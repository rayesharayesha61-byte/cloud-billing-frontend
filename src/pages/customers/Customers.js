import React, { useEffect, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Close,
  Delete,
  EditOutlined,
  People,
  Save,
  Search,
} from "@mui/icons-material";

import API from "../../services/api";

const emptyForm = {
  customerName: "",
  mobile: "",
  email: "",
  address: "",
  gstin: "",
  state: "",
  customerType: "Individual",
  openingOutstanding: "",
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  // =====================================
  // GET CUSTOMERS
  // =====================================

const loadCustomers = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await API.get("/customers");

    console.log("CUSTOMER API RESPONSE:", response.data);
    console.log("CUSTOMER COUNT:", response.data?.length);
    console.log("CUSTOMER DATA:", JSON.stringify(response.data, null, 2));

    setCustomers(response.data || []);
  } catch (err) {
    console.error("LOAD CUSTOMERS ERROR:", err);

    setError(
      err.response?.data?.message ||
        "Unable to load customers."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadCustomers();
  }, []);

  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // ADD CUSTOMER
  // =====================================

  const handleAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setOpen(true);
  };

  // =====================================
  // EDIT CUSTOMER
  // =====================================

  const handleEdit = (customer) => {
    setEditingId(customer.id);

    setFormData({
      customerName: customer.customer_name || "",
      mobile: customer.mobile || "",
      email: customer.email || "",
      address: customer.address || "",
      gstin: customer.gstin || "",
      state: customer.state || "",
      customerType:
        customer.customer_type || "Individual",
      openingOutstanding:
        customer.opening_outstanding || "",
    });

    setError("");
    setOpen(true);
  };

  // =====================================
  // CLOSE
  // =====================================

  const handleClose = () => {
    if (saving) return;

    setOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  // =====================================
  // SAVE
  // =====================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.customerName.trim()) {
      setError("Customer name is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        customerName: formData.customerName.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        gstin: formData.gstin.trim(),
        state: formData.state,
        customerType: formData.customerType,
        openingOutstanding:
          Number(formData.openingOutstanding) || 0,
      };

      if (editingId) {
        await API.put(
          `/customers/${editingId}`,
          payload
        );
      } else {
        await API.post("/customers", payload);
      }

      await loadCustomers();

      handleClose();
    } catch (err) {
      console.error("SAVE CUSTOMER ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save customer."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // DELETE
  // =====================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/customers/${id}`);

      setCustomers((prev) =>
        prev.filter(
          (customer) => customer.id !== id
        )
      );
    } catch (err) {
      console.error("DELETE CUSTOMER ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete customer."
      );
    }
  };

  // =====================================
  // SEARCH
  // =====================================

  const filteredCustomers = customers.filter(
    (customer) => {
      const value = search.toLowerCase();

      return (
        customer.customer_name
          ?.toLowerCase()
          .includes(value) ||
        customer.mobile
          ?.toLowerCase()
          .includes(value) ||
        customer.email
          ?.toLowerCase()
          .includes(value) ||
        customer.gstin
          ?.toLowerCase()
          .includes(value)
      );
    }
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* HEADER */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #4F46E5, #2563EB)",
            }}
          >
            <People />
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 26,
                },
                fontWeight: 800,
                color: "#0F172A",
              }}
            >
              Customers
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "#64748B",
                mt: 0.3,
              }}
            >
              Manage your customers
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{
            minHeight: 44,
            px: 2.2,
            borderRadius: "11px",
            textTransform: "none",
            fontWeight: 700,
            background:
              "linear-gradient(135deg, #4F46E5, #2563EB)",
          }}
        >
          Add Customer
        </Button>
      </Stack>

      {/* ERROR */}

      {error && !open && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: "12px",
          }}
        >
          {error}
        </Alert>
      )}

      {/* CUSTOMER TABLE */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: "18px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* SEARCH */}

        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search customer, mobile, email or GSTIN..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            sx={{
              maxWidth: 480,

              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#F8FAFC",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: "#94A3B8",
                      fontSize: 20,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* LOADING */}

        {loading ? (
          <Box
            sx={{
              minHeight: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={30} />
          </Box>
        ) : filteredCustomers.length === 0 ? (
          <Box
            sx={{
              minHeight: 350,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar
              sx={{
                width: 60,
                height: 60,
                borderRadius: "16px",
                backgroundColor: "#EEF2FF",
                color: "#6366F1",
                mb: 1.5,
              }}
            >
              <People />
            </Avatar>

            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 800,
                color: "#0F172A",
              }}
            >
              No customers found
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12,
                color: "#64748B",
              }}
            >
              Add your first customer.
            </Typography>

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAdd}
              sx={{
                mt: 2,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Add Customer
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#F8FAFC",
                  }}
                >
                  <TableCell sx={tableHeaderStyle}>
                    Customer
                  </TableCell>

                  <TableCell sx={tableHeaderStyle}>
                    Mobile
                  </TableCell>

                  <TableCell sx={tableHeaderStyle}>
                    GSTIN
                  </TableCell>

                  <TableCell sx={tableHeaderStyle}>
                    Type
                  </TableCell>

                  <TableCell sx={tableHeaderStyle}>
                    Outstanding
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={tableHeaderStyle}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCustomers.map(
                  (customer) => (
                    <TableRow
                      key={customer.id}
                      hover
                    >
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.2}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "9px",
                              backgroundColor:
                                "#EEF2FF",
                              color: "#4F46E5",
                            }}
                          >
                            <People
                              sx={{
                                fontSize: 18,
                              }}
                            />
                          </Avatar>

                          <Box>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#0F172A",
                              }}
                            >
                              {
                                customer.customer_name
                              }
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: 10,
                                color: "#94A3B8",
                              }}
                            >
                              {customer.email ||
                                "No email"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell
                        sx={tableCellStyle}
                      >
                        {customer.mobile || "-"}
                      </TableCell>

                      <TableCell
                        sx={tableCellStyle}
                      >
                        {customer.gstin || "-"}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            customer.customer_type ||
                            "Individual"
                          }
                          size="small"
                          sx={{
                            borderRadius: "7px",
                            backgroundColor:
                              "#EFF6FF",
                            color: "#2563EB",
                            fontWeight: 700,
                            fontSize: 10,
                          }}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          ...tableCellStyle,
                          fontWeight: 700,
                        }}
                      >
                        ₹
                        {Number(
                          customer.opening_outstanding ||
                            0
                        ).toLocaleString("en-IN")}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleEdit(customer)
                          }
                          sx={{
                            color: "#4F46E5",
                            mr: 0.5,
                          }}
                        >
                          <EditOutlined
                            sx={{
                              fontSize: 19,
                            }}
                          />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDelete(
                              customer.id
                            )
                          }
                          sx={{
                            color: "#EF4444",
                          }}
                        >
                          <Delete
                            sx={{
                              fontSize: 19,
                            }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ADD / EDIT DIALOG */}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0F172A",
                }}
              >
                {editingId
                  ? "Edit Customer"
                  : "Add New Customer"}
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#64748B",
                  mt: 0.4,
                }}
              >
                Enter customer details
              </Typography>
            </Box>

            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: "10px",
              }}
            >
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Example: ABC Traders"
                sx={fieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                sx={fieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@example.com"
                sx={fieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Customer Type"
                name="customerType"
                value={formData.customerType}
                onChange={handleChange}
                sx={fieldStyle}
              >
                <MenuItem value="Individual">
                  Individual
                </MenuItem>

                <MenuItem value="Business">
                  Business
                </MenuItem>

                <MenuItem value="Retailer">
                  Retailer
                </MenuItem>

                <MenuItem value="Wholesaler">
                  Wholesaler
                </MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="GSTIN"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="22AAAAA0000A1Z5"
                sx={fieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                sx={fieldStyle}
              >
                <MenuItem value="">
                  Select State
                </MenuItem>

                <MenuItem value="Tamil Nadu">
                  Tamil Nadu
                </MenuItem>

                <MenuItem value="Kerala">
                  Kerala
                </MenuItem>

                <MenuItem value="Karnataka">
                  Karnataka
                </MenuItem>

                <MenuItem value="Andhra Pradesh">
                  Andhra Pradesh
                </MenuItem>

                <MenuItem value="Telangana">
                  Telangana
                </MenuItem>

                <MenuItem value="Puducherry">
                  Puducherry
                </MenuItem>

                <MenuItem value="Other">
                  Other
                </MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter customer address"
                sx={fieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Opening Outstanding"
                name="openingOutstanding"
                value={
                  formData.openingOutstanding
                }
                onChange={handleChange}
                placeholder="0.00"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      ₹
                    </InputAdornment>
                  ),
                }}
                sx={fieldStyle}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid #E2E8F0",
          }}
        >
          <Button
            onClick={handleClose}
            disabled={saving}
            sx={{
              textTransform: "none",
              color: "#64748B",
              fontWeight: 700,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress
                  size={16}
                  color="inherit"
                />
              ) : (
                <Save />
              )
            }
            sx={{
              minWidth: 140,
              borderRadius: "9px",
              textTransform: "none",
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #4F46E5, #2563EB)",
            }}
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Update Customer"
              : "Save Customer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// =====================================
// STYLES
// =====================================

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "11px",
    backgroundColor: "#F8FAFC",

    "& fieldset": {
      borderColor: "#E2E8F0",
    },

    "&:hover fieldset": {
      borderColor: "#A5B4FC",
    },

    "&.Mui-focused": {
      backgroundColor: "#FFFFFF",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#6366F1",
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#4F46E5",
  },
};

const tableHeaderStyle = {
  fontSize: 11,
  fontWeight: 800,
  color: "#64748B",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const tableCellStyle = {
  fontSize: 12,
  color: "#475569",
  whiteSpace: "nowrap",
};

export default Customers;