const cron = require("node-cron");
const Task = require("./models/Task");

cron.schedule("*/1 * * * *", async () => {
  console.log("🔄 Checking for expired tasks...");

  const now = new Date();

  try {
    const expired = await Task.updateMany(
      {
        dueDate: { $lt: now },
        status: { $in: ["Todo", "In Progress"] }
      },
      { $set: { status: "Expired" } }
    );

    if (expired.modifiedCount > 0) {
      console.log(`✅ Marked ${expired.modifiedCount} task(s) as Expired`);
    } else {
      console.log("⏳ No tasks to expire");
    }
  } catch (err) {
    console.error("❌ Cron Error:", err.message);
  }
});
