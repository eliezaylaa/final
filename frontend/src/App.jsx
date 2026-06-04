import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Shifts from "./pages/Shifts";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import Invoices from "./pages/Invoices";

const getUser = () => JSON.parse(localStorage.getItem("user"));
const getToken = () => localStorage.getItem("access");

const AdminRoute = ({ element }) => {
  if (!getToken()) return <Navigate to="/login" />;
  if (getUser().role != "admin") return <Navigate to="/login" />;
  return element;
};

const EmployeeRoute = ({ element }) => {
  if (!getToken()) return <Navigate to="/login" />;
  const role = getUser().role;
  if (role != "employee" && role != "manager") return <Navigate to="/login" />;
  return element;
};

const UserRoute = ({ element }) => {
  if (!getToken()) return <Navigate to="/login" />;
  return element;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<AdminRoute element={<Dashboard />} />}
        />
        <Route path="/users" element={<AdminRoute element={<Users />} />} />
        <Route path="/shifts" element={<AdminRoute element={<Shifts />} />} />
        <Route
          path="/products"
          element={<AdminRoute element={<Products />} />}
        />
        <Route
          path="/invoices"
          element={<AdminRoute element={<Invoices />} />}
        />
        <Route path="/home" element={<EmployeeRoute element={<Home />} />} />
        <Route path="/shop" element={<UserRoute element={<Shop />} />} />
        <Route
          path="/checkout"
          element={<UserRoute element={<Checkout />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
