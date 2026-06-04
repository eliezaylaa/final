import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Modal,
  Alert,
} from "@mui/material";

function Users() {
  const [users, setUsers] = useState([]);
  const [menu, setMenu] = useState(null);
  const [editing, setEditing] = useState(null);
  const [salaryEdit, setSalaryEdit] = useState(null);
  const [newSalary, setNewSalary] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "user",
    salary: "",
  });
  const [editData, setEditData] = useState({
    full_name: "",
    email: "",
    role: "",
    salary: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data.users || []));
  }, []);

  const refresh = () =>
    api.get("/users").then((res) => setUsers(res.data.users || []));

  const handleFire = async (id) => {
    await api.put(`/users/${id}/fire`);
    refresh();
    setMenu(null);
  };
  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    refresh();
    setMenu(null);
  };
  const handleEdit = async (id) => {
    await api.put(`/users/${id}`, editData);
    setEditing(null);
    refresh();
  };
  const handleSalaryUpdate = async (id) => {
    await api.put(`/users/${id}/salary`, { salary: newSalary });
    refresh();
    setSalaryEdit(null);
    setNewSalary("");
  };
  const handleAdd = async () => {
    try {
      await api.post("/users", form);
      refresh();
      setAddModal(false);
      setForm({
        full_name: "",
        email: "",
        password: "",
        role: "user",
        salary: "",
      });
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Box
        sx={{
          width: 220,
          bgcolor: "white",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: 1,
        }}
      >
        <a href="/dashboard">
          <img src="/favicon.svg" style={{ width: 32, marginBottom: 16 }} />
        </a>
        {["Users", "Shifts", "Products", "Invoices"].map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase()}`}
            style={{ textDecoration: "none" }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                "&:hover": { bgcolor: "#f5f5f5" },
                color: "#333",
                fontSize: 14,
              }}
            >
              {item}
            </Box>
          </a>
        ))}
        <Box sx={{ mt: "auto" }}>
          <Button
            fullWidth
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            sx={{ textTransform: "none", color: "#666" }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="600">
            Users
          </Typography>
          <Button
            variant="contained"
            onClick={() => setAddModal(true)}
            sx={{ textTransform: "none" }}
          >
            Add User
          </Button>
        </Box>

        <Modal open={addModal} onClose={() => setAddModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "white",
              p: 4,
              borderRadius: 3,
              width: 400,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight="600">
              Add User
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Full Name"
              value={form.full_name}
              onChange={(e) =>
                setForm({
                  full_name: e.target.value,
                  email: form.email,
                  password: form.password,
                  role: form.role,
                  salary: form.salary,
                })
              }
              fullWidth
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  full_name: form.full_name,
                  email: e.target.value,
                  password: form.password,
                  role: form.role,
                  salary: form.salary,
                })
              }
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  full_name: form.full_name,
                  email: form.email,
                  password: e.target.value,
                  role: form.role,
                  salary: form.salary,
                })
              }
              fullWidth
            />
            <Select
              value={form.role}
              onChange={(e) =>
                setForm({
                  full_name: form.full_name,
                  email: form.email,
                  password: form.password,
                  role: e.target.value,
                  salary: form.salary,
                })
              }
              fullWidth
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
            <TextField
              label="Salary"
              value={form.salary}
              onChange={(e) =>
                setForm({
                  full_name: form.full_name,
                  email: form.email,
                  password: form.password,
                  role: form.role,
                  salary: e.target.value,
                })
              }
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleAdd}
                fullWidth
                sx={{ textTransform: "none" }}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                onClick={() => setAddModal(false)}
                fullWidth
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} sx={{ opacity: !u.is_active ? 0.4 : 1 }}>
                  <TableCell>
                    {editing == u.id ? (
                      <TextField
                        size="small"
                        value={editData.full_name}
                        onChange={(e) =>
                          setEditData({
                            full_name: e.target.value,
                            email: editData.email,
                            role: editData.role,
                            salary: editData.salary,
                          })
                        }
                      />
                    ) : (
                      u.full_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editing == u.id ? (
                      <TextField
                        size="small"
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({
                            full_name: editData.full_name,
                            email: e.target.value,
                            role: editData.role,
                            salary: editData.salary,
                          })
                        }
                      />
                    ) : (
                      u.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editing == u.id ? (
                      <Select
                        size="small"
                        value={editData.role}
                        onChange={(e) =>
                          setEditData({
                            full_name: editData.full_name,
                            email: editData.email,
                            role: e.target.value,
                            salary: editData.salary,
                          })
                        }
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="employee">Employee</MenuItem>
                        <MenuItem value="manager">Manager</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    ) : (
                      u.role
                    )}
                  </TableCell>
                  <TableCell>
                    {salaryEdit == u.id ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          size="small"
                          value={newSalary}
                          onChange={(e) => setNewSalary(e.target.value)}
                          sx={{ width: 80 }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleSalaryUpdate(u.id)}
                          sx={{ textTransform: "none" }}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setSalaryEdit(null)}
                          sx={{ textTransform: "none" }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : u.role == "employee" || u.role == "manager" ? (
                      `${u.salary}€`
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editing == u.id ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleEdit(u.id)}
                          sx={{ textTransform: "none" }}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setEditing(null)}
                          sx={{ textTransform: "none" }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ position: "relative" }}>
                        <Button
                          size="small"
                          onClick={() => {
                            if (menu == u.id) {
                              setMenu(null);
                            } else {
                              setMenu(u.id);
                            }
                          }}
                          sx={{ minWidth: 0, textTransform: "none" }}
                        >
                          ***
                        </Button>
                        {menu == u.id && u.is_active && (
                          <Box
                            sx={{
                              position: "absolute",
                              right: 0,
                              bgcolor: "white",
                              boxShadow: 3,
                              borderRadius: 2,
                              zIndex: 10,
                              width: 140,
                              p: 1,
                            }}
                          >
                            <Box
                              onClick={() => {
                                setEditData({
                                  full_name: u.full_name,
                                  email: u.email,
                                  role: u.role,
                                  salary: u.salary,
                                });
                                setEditing(u.id);
                                setMenu(null);
                              }}
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                cursor: "pointer",
                                "&:hover": { bgcolor: "#f5f5f5" },
                                fontSize: 14,
                              }}
                            >
                              Edit
                            </Box>
                            {(u.role == "employee" || u.role == "manager") && (
                              <Box
                                onClick={() => {
                                  setSalaryEdit(u.id);
                                  setMenu(null);
                                }}
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  cursor: "pointer",
                                  "&:hover": { bgcolor: "#f5f5f5" },
                                  fontSize: 14,
                                }}
                              >
                                Change
                              </Box>
                            )}
                            <Box
                              onClick={() => handleFire(u.id)}
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                cursor: "pointer",
                                "&:hover": { bgcolor: "#f5f5f5" },
                                fontSize: 14,
                              }}
                            >
                              Fire
                            </Box>
                            <Box
                              onClick={() => handleDelete(u.id)}
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                cursor: "pointer",
                                "&:hover": { bgcolor: "#f5f5f5" },
                                fontSize: 14,
                              }}
                            >
                              Delete
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

export default Users;
