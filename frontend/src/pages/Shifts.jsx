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
  Modal,
  Select,
  MenuItem,
} from "@mui/material";

function Shifts() {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [menu, setMenu] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    user_id: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  const [editData, setEditData] = useState({
    date: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    api.get("/shifts").then((res) => setShifts(res.data.shifts || []));
    api.get("/users").then((res) => setUsers(res.data.users || []));
  }, []);

  const refresh = () =>
    api.get("/shifts").then((res) => setShifts(res.data.shifts || []));

  const handleAdd = async () => {
    await api.post("/shifts", form);
    refresh();
    setAddModal(false);
    setForm({ user_id: "", date: "", start_time: "", end_time: "" });
  };

  const handleEdit = async (id) => {
    await api.put(`/shifts/${id}`, editData);
    setEditing(null);
    refresh();
  };

  const handleDelete = async (id) => {
    await api.delete(`/shifts/${id}`);
    refresh();
    setMenu(null);
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
            Shifts
          </Typography>
          <Button
            variant="contained"
            onClick={() => setAddModal(true)}
            sx={{ textTransform: "none" }}
          >
            Add Shift
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
              Add Shift
            </Typography>
            <Select
              value={form.user_id}
              onChange={(e) =>
                setForm({
                  user_id: e.target.value,
                  date: form.date,
                  start_time: form.start_time,
                  end_time: form.end_time,
                })
              }
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select User
              </MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.full_name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  user_id: form.user_id,
                  date: e.target.value,
                  start_time: form.start_time,
                  end_time: form.end_time,
                })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Start Time"
              type="time"
              value={form.start_time}
              onChange={(e) =>
                setForm({
                  user_id: form.user_id,
                  date: form.date,
                  start_time: e.target.value,
                  end_time: form.end_time,
                })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="time"
              value={form.end_time}
              onChange={(e) =>
                setForm({
                  user_id: form.user_id,
                  date: form.date,
                  start_time: form.start_time,
                  end_time: e.target.value,
                })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
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
                <TableCell>Role</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shifts.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.full_name}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>{s.date ? s.date.split("T")[0] : "-"}</TableCell>
                  <TableCell>
                    {editing == s.id ? (
                      <TextField
                        size="small"
                        type="time"
                        value={editData.start_time}
                        onChange={(e) =>
                          setEditData({
                            date: editData.date,
                            start_time: e.target.value,
                            end_time: editData.end_time,
                          })
                        }
                      />
                    ) : (
                      s.start_time
                    )}
                  </TableCell>
                  <TableCell>
                    {editing == s.id ? (
                      <TextField
                        size="small"
                        type="time"
                        value={editData.end_time}
                        onChange={(e) =>
                          setEditData({
                            date: editData.date,
                            start_time: editData.start_time,
                            end_time: e.target.value,
                          })
                        }
                      />
                    ) : (
                      s.end_time
                    )}
                  </TableCell>
                  <TableCell>
                    {s.check_in
                      ? new Date(s.check_in).toLocaleTimeString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {s.check_out
                      ? new Date(s.check_out).toLocaleTimeString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {editing == s.id ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleEdit(s.id)}
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
                            if (menu == s.id) {
                              setMenu(null);
                            } else {
                              setMenu(s.id);
                            }
                          }}
                          sx={{ minWidth: 0, textTransform: "none" }}
                        >
                          more
                        </Button>
                        {menu == s.id && (
                          <Box
                            sx={{
                              position: "absolute",
                              right: 0,
                              bgcolor: "white",
                              boxShadow: 3,
                              borderRadius: 2,
                              zIndex: 10,
                              width: 120,
                              p: 1,
                            }}
                          >
                            <Box
                              onClick={() => {
                                setEditData({
                                  date: s.date,
                                  start_time: s.start_time,
                                  end_time: s.end_time,
                                });
                                setEditing(s.id);
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
                            <Box
                              onClick={() => handleDelete(s.id)}
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

export default Shifts;
