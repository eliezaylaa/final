import { Navigate } from "react-router-dom";
const getUser = () => JSON.parse(localStorage.getItem("user"));
export default function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("access");
  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(getUser()?.role))
    return <Navigate to="/login" />;
  return children;
}
