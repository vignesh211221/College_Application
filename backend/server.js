const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const staffRoutes = require('./routes/staffRoutes');
const staffTimetableRoutes = require("./routes/staffTimetableRoutes");
const staffWorkdoneRoutes = require("./routes/staffWorkdoneRoutes");
const placementRoutes = require("./routes/placementRoutes");
const studentTimetableRoutes = require("./routes/studentTimetableRoutes");
const staffDetailRoutes = require("./routes/staffDetailRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const path = require("path");

const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/staff', staffRoutes);
app.use("/api/timetable", staffTimetableRoutes);
app.use('/api/workdone', staffWorkdoneRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/student-timetable", studentTimetableRoutes);
app.use("/api/staff-detail", staffDetailRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

require('./utils/staffReminderJob');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
