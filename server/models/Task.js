const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ["Bug", "Feature", "Improvement"], default: "Feature" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Todo", "In Progress", "Completed", "Expired"], default: "Todo" },
  dueDate: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  organization: { type: String, required: true },
});

module.exports = mongoose.model("Task", taskSchema);
