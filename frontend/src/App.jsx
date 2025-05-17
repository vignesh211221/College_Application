import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashBoard from "./pages/admin/AdminDashBoard";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StaffDashboard from "./pages/staff/StaffDashboard";
import PlacementDashboard from "./pages/placement/PlacementDashboard";
import PlacementCoDashboard from "./pages/PlacementCoordinator/PlacementCoDashboard";
import HODDashboard from "./pages/hod/HODDashboard";
import StudentDepartment from "./pages/admin/StudentDepartment";
import StudentList from "./pages/admin/StudentList";
import StaffDepartment from "./pages/admin/StaffDepartment";
import StaffList from "./pages/admin/StaffList";
import StaffSelector from "./pages/hod/StaffSelector";
import CreateTimetable from "./pages/hod/CreateTimetable";
import DeptStaffList from "./pages/hod/DeptStaffList";
import StaffStudentList from "./pages/staff/StaffStudentList";
import TimetableView from "./pages/staff/TimetableView";
import WorkdoneStaffSelector from "./pages/hod/WorkdoneStaffSelector";
import WorkdoneList from "./pages/hod/WorkdoneList";
import StaffWorkDone from "./pages/staff/StaffWorkdone";
import SelectDepartment from "./pages/admin/SelectDepartment";
import AdminDepartmentPage from "./pages/admin/AdminDepartmentPage";
import DepartmentSelect from "./pages/placement/DepartmentSelect";
import CreatePlacement from "./pages/placement/CreatePlacement";
import PlacementStafflist from "./pages/placement/PlacementStafflist";
import StudentProfile from "./pages/student/StudentProfile";
import Placements from "./pages/student/Placement";
import Placement from "./pages/placement/Placement";
import PlacementSelector from"./pages/placement/PlacementSelector";
import AppliedStudentList from "./pages/placement/AppliedStudentList";
import PlacementColist from "./pages/PlacementCoordinator/PlacementColist";
import AppliedStudentListDept from "./pages/PlacementCoordinator/AppliedStudentListDept";
import PlacementActivities from "./pages/admin/PlacementActivites";
import PlacementPieChart from "./pages/placement/PlacementPieChart";
import CreateStudentTimetable from "./pages/staff/CreateStudentTimetable";
import StudentTimetableView from "./pages/student/StudentTimetableView";
import StudentFileUpload from "./pages/student/StudentFileUpload";
import PlacementDept from "./pages/placement/PlacementDept";
import ClassBoxes from "./pages/placement/ClassBoxes";
import UploadedFilesPage from "./pages/placement/UploadFilesPage";
import ClassTimetableClass from"./pages/admin/ClasstimetableClass";
// import StudentClassTimetable from "./pages/admin/StudentClassTimetable";

const App = ()=>{
  return(
    <>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Register />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route element={<PrivateRoute roles={["student"]} />}/>
          <Route path="/student-dashboard" element={<StudentDashboard />}/>
          <Route element={<PrivateRoute roles={["admin"]} />}/>
          <Route path="/admin-dashboard" element={<AdminDashBoard />}/>
          <Route element={<PrivateRoute roles={["staff"]} />}/>
          <Route path="/staff-dashboard" element={<StaffDashboard />}/>
          <Route element={<PrivateRoute roles={["hod"]} />}/>
          <Route path="/hod-dashboard" element={<HODDashboard />}/>
          <Route element={<PrivateRoute roles={["placementofficer"]} />}/>
          <Route path="/placement-dashboard" element={<PlacementDashboard />}/>
          <Route path="/students" element={<StudentDepartment />} />
          <Route element={<PrivateRoute roles={["placementCoordinator"]} />}/>
          <Route path="/coordinator-dashboard" element={<PlacementCoDashboard />}/>
          <Route path="/students/:department" element={<StudentList />} />
          <Route path="/staffs" element={<StaffDepartment />} />
          <Route path="/staffs/:department" element={<StaffList />} />
          <Route path="/stafflist/:department" element={<DeptStaffList />} />
          <Route path="/timetable/staffs/:department" element={<StaffSelector />} />
          <Route path="/timetable/create/:staffId" element={<CreateTimetable />} />
          <Route path="/staffs/class/:className" element={<StaffStudentList />} />
          <Route path="/staff/timetable/:staffId" element={<TimetableView />} />
          <Route path="/staff/workdone/:staffId" element={<StaffWorkDone />} />
          <Route path="/workdone/stafflist/:staffId" element={<WorkdoneList />} />
          <Route path="/workdone/staffs/:department" element={<WorkdoneStaffSelector />} />
          <Route path="/departments" element={<SelectDepartment />} />
          <Route path="/departments/:department" element={<AdminDepartmentPage />} />
          <Route path="/placements" element={<DepartmentSelect/>} />
          <Route path="/placementstafflist/:department"element={< PlacementStafflist/>} />
          <Route path="/createplacement" element={<CreatePlacement />} />
          <Route path="/studentprofile/:id" element={<StudentProfile />} />
          <Route path="/student/:studentId/placements" element={<Placements />} />
          <Route path="/appliedlists" element={<Placement />} />
          <Route path="/select-department/:placementId" element={<PlacementSelector />} />
          <Route path="/applied-list/:placementId/:department" element={<AppliedStudentList />} />
          <Route path="/staff/placements" element={<PlacementColist />} />
          {/* <Route path="/student/appliedlists" element={<PlacementColist />} /> */}
          <Route path="/students/applied-students/:placementId/:department" element={<AppliedStudentListDept />} />
          <Route path="/placements-activities" element={<PlacementActivities />} />
          <Route path="/placement-piechart/:placementId" element={<PlacementPieChart />} />
          <Route path="/student-timetable/class/:className/:department" element={< CreateStudentTimetable/>} />
          <Route path="/view-student-timetable/:className/:department" element={<StudentTimetableView />} />
          <Route path="/uploads/:studentId" element={<StudentFileUpload />} />
          <Route path="/department/files"element={<PlacementDept />}/>
          <Route path="/classes/:department" element={<ClassBoxes />} />
          <Route path="/uploaded-files/:department/:className" element={<UploadedFilesPage />} />
          <Route path="/class-timetable/:department" element={<ClassTimetableClass />} />
          {/* <Route path="/class/:className/:department"element={<StudentClassTimetable/>} /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App;