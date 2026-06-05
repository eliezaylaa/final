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
} from "@mui/material";

function Products() {
  const [products, setProducts] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [menu, setMenu] = useState(null);
  const [form, setForm] = useState({ name: "", price: "" });
  const [editData, setEditData] = useState({ name: "", price: "" });

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data.products || []));
  }, []);

  const refresh = () =>
    api.get("/products").then((res) => setProducts(res.data.products || []));

  const handleAdd = async () => {
    await api.post("/products", form);
    refresh();
    setAddModal(false);
    setForm({ name: "", price: "" });
  };

  const handleEdit = async (id) => {
    await api.put(`/products/${id}`, editData);
    setEditing(null);
    refresh();
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
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
            Products
          </Typography>
          <Button
            variant="contained"
            onClick={() => setAddModal(true)}
            sx={{ textTransform: "none" }}
          >
            Add Product
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
              Add Product
            </Typography>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ name: e.target.value, price: form.price })
              }
              fullWidth
            />
            <TextField
              label="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ name: form.name, price: e.target.value })
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
                <TableCell>Price</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {editing == p.id ? (
                      <TextField
                        size="small"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({
                            name: e.target.value,
                            price: editData.price,
                          })
                        }
                      />
                    ) : (
                      p.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editing == p.id ? (
                      <TextField
                        size="small"
                        value={editData.price}
                        onChange={(e) =>
                          setEditData({
                            name: editData.name,
                            price: e.target.value,
                          })
                        }
                      />
                    ) : (
                      p.price + "€"
                    )}
                  </TableCell>
                  <TableCell>
                    {editing == p.id ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleEdit(p.id)}
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
                            if (menu == p.id) {
                              setMenu(null);
                            } else {
                              setMenu(p.id);
                            }
                          }}
                          sx={{ minWidth: 0, textTransform: "none" }}
                        >
                          more
                        </Button>
                        {menu == p.id && (
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
                                setEditData({ name: p.name, price: p.price });
                                setEditing(p.id);
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
                              onClick={() => handleDelete(p.id)}
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

export default Products;
