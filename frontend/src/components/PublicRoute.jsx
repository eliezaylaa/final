import { Navigate } from "react-router-dom";

const getUser = () => JSON.parse(localStorage.getItem("user"));
export default function PublicRoute({ children }) {
  const token = localStorage.getItem("access");
  if (!token) return children;
  const role = getUser()?.role;
  if (role == "admin") return <Navigate to="/dashboard" />;
  if (role == "manager" || role == "employee") return <Navigate to="/home" />;
  return <Navigate to="/shop" />;
}
