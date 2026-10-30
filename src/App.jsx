import { BrowserRouter, Navigate, Route, Routes, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateCV from "./pages/CreateCV";
import EditCV from "./pages/EditCV";

function NotFound() {
  return <main className="page"><section className="panel"><h1>Page not found</h1><Link to="/dashboard">Go to dashboard</Link></section></main>;
}
export default function App() {
  return <BrowserRouter><AuthProvider><Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-cv" element={<CreateCV />} />
      <Route path="/cvs/:id" element={<EditCV />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes></AuthProvider></BrowserRouter>;
}
