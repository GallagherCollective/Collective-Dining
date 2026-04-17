import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Demo from './pages/Demo'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import Scheduler from './pages/manager/Scheduler'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/scheduler" element={<Scheduler />} />
    </Routes>
  )
}