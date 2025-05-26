const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { title, description, category, priority, dueDate, assignedTo } = req.body;
  console.log("USER FROM TOKEN:", req.user);


  if (req.user.role === "member") {
    console.log("❌ Access denied for role:", req.user.role);
    return res.status(403).json({ message: "Access denied." });
  }

  try {
    const task = await Task.create({
      title,
      description,
      category,
      priority,
      dueDate,
      assignedTo,
      organization: req.user.organization,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ organization: req.user.organization });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/:id/status", auth, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.organization !== req.user.organization) {
      return res.status(403).json({ message: "Forbidden" });
    }

    task.status = status;
    await task.save();

    res.json({ message: "Status updated", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.organization !== task.organization ||
      (req.user.role !== "admin" && req.user.role !== "manager")
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
