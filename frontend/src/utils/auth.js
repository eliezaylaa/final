export const requireAuth = () => {
  const token = localStorage.getItem("access");
  if (!token) {
    window.location.href = "/login";
  }
};
export const requireAdmin = () => {
  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token) {
    window.location.href = "/login";
    return;
  }
  if (user?.role != "admin") {
    window.location.href = "/login";
  }
};
export const requireEmployee = () => {
  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token) {
    window.location.href = "/login";
    return;
  }
  if (user.role != "employee" && user.role != "manager") {
    window.location.href = "/login";
  }
};
