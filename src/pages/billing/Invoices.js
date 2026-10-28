import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
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
  Delete,
  DescriptionOutlined,
  VisibilityOutlined,
  Search,
  ReceiptLongOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const Invoices = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // ---------------------------------------
  // LOAD INVOICES
  // ---------------------------------------

  const loadInvoices = async () => {
    try {
      setLoading(true);

      const response = await API.get("/invoices");

      console.log("INVOICE API RESPONSE:", response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.invoices || [];

      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error("LOAD INVOICES ERROR:", error);

      setInvoices([]);
      setFilteredInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // ---------------------------------------
  // SEARCH + FILTER
  // ---------------------------------------

  useEffect(() => {
    let result = [...invoices];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter(
        (invoice) =>
          String(invoice.invoice_number || "")
            .toLowerCase()
            .includes(searchValue) ||
          String(invoice.customer_name || "")
            .toLowerCase()
            .includes(searchValue) ||
          String(invoice.payment_mode || "")
            .toLowerCase()
            .includes(searchValue)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter(
        (invoice) =>
          String(invoice.payment_status || "").toUpperCase() ===
          statusFilter
      );
    }

    setFilteredInvoices(result);
  }, [search, statusFilter, invoices]);

  // ---------------------------------------
  // DELETE
  // ---------------------------------------

  const openDeleteDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialog(false);
    setSelectedInvoice(null);
  };

  const deleteInvoice = async () => {
    if (!selectedInvoice) return;

    try {
      await API.delete(`/invoices/${selectedInvoice.id}`);

      closeDeleteDialog();
      loadInvoices();
    } catch (error) {
      console.error("DELETE INVOICE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete invoice."
      );
    }
  };

  // ---------------------------------------
  // FORMAT DATE
  // ---------------------------------------

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ---------------------------------------
  // FORMAT AMOUNT
  // ---------------------------------------

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ---------------------------------------
  // STATUS CHIP
  // ---------------------------------------

  const getStatusChip = (status) => {
    const value = String(status || "UNPAID").toUpperCase();

    if (value === "PAID") {
      return (
        <Chip
          label="Paid"
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: "#dcfce7",
            color: "#166534",
          }}
        />
      );
    }

    if (value === "PARTIAL") {
      return (
        <Chip
          label="Partial"
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: "#fef3c7",
            color: "#92400e",
          }}
        />
      );
    }

    return (
      <Chip
        label="Unpaid"
        size="small"
        sx={{
          fontWeight: 600,
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        }}
      />
    );
  };

  // ---------------------------------------
  // SUMMARY
  // ---------------------------------------

  const totalInvoices = invoices.length;

  const paidInvoices = invoices.filter(
    (invoice) =>
      String(invoice.payment_status || "").toUpperCase() === "PAID"
  ).length;

  const unpaidInvoices = invoices.filter(
    (invoice) =>
      String(invoice.payment_status || "").toUpperCase() === "UNPAID"
  ).length;

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.grand_total || 0),
    0
  );

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f8fafc",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#0f172a",
              fontSize: { xs: "25px", md: "30px" },
            }}
          >
            Invoices
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              mt: 0.5,
              fontSize: "14px",
            }}
          >
            Manage all your sales invoices
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/create-invoice")}
          sx={{
            backgroundColor: "#4f46e5",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 2.5,
            py: 1.2,
            "&:hover": {
              backgroundColor: "#4338ca",
            },
          }}
        >
          Create Invoice
        </Button>
      </Box>

      {/* SUMMARY CARDS */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card
          sx={{
            p: 2.5,
            borderRadius: 2,
            boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#eef2ff",
                color: "#4f46e5",
              }}
            >
              <ReceiptLongOutlined />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#64748b",
                }}
              >
                Total Invoices
              </Typography>

              <Typography
                sx={{
                  fontSize: 23,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {totalInvoices}
              </Typography>
            </Box>
          </Stack>
        </Card>

        <Card
          sx={{
            p: 2.5,
            borderRadius: 2,
            boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#dcfce7",
                color: "#16a34a",
              }}
            >
              <DescriptionOutlined />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                Paid
              </Typography>

              <Typography
                sx={{
                  fontSize: 23,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {paidInvoices}
              </Typography>
            </Box>
          </Stack>
        </Card>

        <Card
          sx={{
            p: 2.5,
            borderRadius: 2,
            boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
              }}
            >
              <DescriptionOutlined />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                Unpaid
              </Typography>

              <Typography
                sx={{
                  fontSize: 23,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {unpaidInvoices}
              </Typography>
            </Box>
          </Stack>
        </Card>

        <Card
          sx={{
            p: 2.5,
            borderRadius: 2,
            boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e0f2fe",
                color: "#0284c7",
              }}
            >
              <ReceiptLongOutlined />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                Total Amount
              </Typography>

              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {formatAmount(totalAmount)}
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Box>

      {/* FILTER AREA */}

      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search invoice number, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search
                  sx={{
                    color: "#94a3b8",
                    mr: 1,
                  }}
                />
              ),
            }}
          />

          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{
              minWidth: { xs: "100%", md: 180 },
            }}
          >
            <MenuItem value="ALL">All Status</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="UNPAID">Unpaid</MenuItem>
            <MenuItem value="PARTIAL">Partial</MenuItem>
          </Select>
        </Box>
      </Paper>

      {/* TABLE */}

      <Paper
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
        }}
      >
        <TableContainer
          sx={{
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f8fafc",
                }}
              >
                <TableCell sx={{ fontWeight: 700 }}>
                  Invoice
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  Customer
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  Date
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  Amount
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  Payment
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  Status
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ fontWeight: 700 }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <ReceiptLongOutlined
                      sx={{
                        fontSize: 50,
                        color: "#cbd5e1",
                        mb: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#475569",
                      }}
                    >
                      No invoices found
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#94a3b8",
                        mt: 0.5,
                      }}
                    >
                      Create your first invoice to see it here.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#4f46e5",
                        }}
                      >
                        {invoice.invoice_number}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {invoice.customer_name || "-"}
                      </Typography>

                      {invoice.mobile && (
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#64748b",
                          }}
                        >
                          {invoice.mobile}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {formatDate(invoice.invoice_date)}
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {formatAmount(invoice.grand_total)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {invoice.payment_mode || "-"}
                    </TableCell>

                    <TableCell>
                      {getStatusChip(invoice.payment_status)}
                    </TableCell>

                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        <IconButton
                          size="small"
                          title="View Invoice"
                          onClick={() =>
                            navigate(`/invoice/${invoice.id}`)
                          }
                          sx={{
                            color: "#4f46e5",
                          }}
                        >
                          <VisibilityOutlined fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          title="Delete Invoice"
                          onClick={() =>
                            openDeleteDialog(invoice)
                          }
                          sx={{
                            color: "#dc2626",
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* DELETE DIALOG */}

      <Dialog
        open={deleteDialog}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Delete Invoice?
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ color: "#475569" }}>
            Are you sure you want to delete invoice{" "}
            <strong>
              {selectedInvoice?.invoice_number}
            </strong>
            ?
          </Typography>

          <Typography
            sx={{
              color: "#dc2626",
              fontSize: 13,
              mt: 1,
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            sx={{
              textTransform: "none",
              color: "#475569",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={deleteInvoice}
            sx={{
              textTransform: "none",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices;