const cron = require("node-cron");
const StaffTimetable = require("../models/StaffTimetable");
const Staff = require("../models/Staff");
const sendEmail = require("../utils/sendEmail");

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });

  const reminderTime = new Date(now.getTime() + 5 * 60000).toTimeString().slice(0, 5); // HH:MM format

  try {
    const todaysTimetables = await StaffTimetable.find({ day: currentDay });

    for (const timetable of todaysTimetables) {
      const staff = await Staff.findById(timetable.staff).populate("user");

      for (const period of timetable.periods) {
        if (period.time === reminderTime) {
          // Convert to 12-hour format
          const [hours, minutes] = period.time.split(":");
          const date = new Date();
          date.setHours(hours, minutes);

          const formattedTime = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          const message = `Reminder: You have a class "${period.subject}" for "${period.class}" at ${formattedTime}.`;

          await sendEmail({
            email: staff.user.email,
            subject: "Upcoming Class Reminder",
            message,
          });

          console.log(`📧 Reminder sent to ${staff.user.email} for period ${period.periodNumber} (${formattedTime})`);
        }
      }
    }
  } catch (error) {
    console.error("❌ Reminder Error:", error.message);
  }
});
