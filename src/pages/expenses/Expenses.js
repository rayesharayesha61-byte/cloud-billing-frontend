import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Divider,
} from "@mui/material";

import {
  AddRounded,
  SearchRounded,
  ReceiptLongRounded,
  PaymentsRounded,
  CalendarMonthRounded,
  DeleteOutlineRounded,
  EditOutlined,
  CloseRounded,
  TrendingUpRounded,
  LocalShippingOutlined,
  StorefrontOutlined,
  BoltOutlined,
  MoreHorizRounded,
} from "@mui/icons-material";

import API from "../../services/api";

const categories = [
  "Office Supplies",
  "Rent",
  "Salary",
  "Transport",
  "Utilities",
  "Marketing",
  "Inventory",
  "Travel",
  "Maintenance",
  "Other",
];

const paymentMethods = ["Cash", "UPI", "Bank Transfer", "Card", "Cheque", "Other"];

const today = () => {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const emptyForm = () => ({
  title: "",
  category: "Other",
  amount: "",
  expenseDate: today(),
  paymentMethod: "Cash",
  description: "",
});

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotice = (message, severity = "success") => {
    setNotice({ open: true, message, severity });
  };

  const loadExpenses = async () => {
    setLoading(true);

    try {
      const response = await API.get("/expenses");
      const data = response.data;
      const list = Array.isArray(data)
        ? data
        : data?.expenses || data?.data || [];

      setExpenses(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Load expenses error:", error);
      showNotice(
        error.response?.data?.message ||
          "Unable to load expenses. Check your API endpoint.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const normalizedExpenses = useMemo(
    () =>
      expenses.map((expense) => ({
        ...expense,
        _id: expense.id ?? expense.expenseId ?? expense.expense_id,
        _title:
          expense.title ||
          expense.expenseName ||
          expense.expense_name ||
          expense.name ||
          "Expense",
        _category: expense.category || "Other",
        _amount: Number(
          expense.amount ?? expense.totalAmount ?? expense.total_amount ?? 0
        ),
        _date:
          expense.expenseDate ||
          expense.expense_date ||
          expense.date ||
          expense.created_at ||
          "",
        _payment:
          expense.paymentMethod ||
          expense.payment_method ||
          expense.paymentMode ||
          expense.payment_mode ||
          "—",
        _description: expense.description || expense.notes || "",
      })),
    [expenses]
  );

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return normalizedExpenses
      .filter((expense) => {
        const matchesSearch =
          !query ||
          expense._title.toLowerCase().includes(query) ||
          expense._category.toLowerCase().includes(query) ||
          expense._payment.toLowerCase().includes(query) ||
          expense._description.toLowerCase().includes(query);

        const matchesCategory =
          categoryFilter === "All" ||
          expense._category.toLowerCase() === categoryFilter.toLowerCase();

        return matchesSearch && matchesCategory;
      })
      .sort(
        (a, b) =>
          new Date(b._date || 0).getTime() -
          new Date(a._date || 0).getTime()
      );
  }, [normalizedExpenses, search, categoryFilter]);

  const totalExpenses = normalizedExpenses.reduce(
    (total, expense) => total + expense._amount,
    0
  );

  const month = today().slice(0, 7);

  const monthlyExpenses = normalizedExpenses
    .filter((expense) => String(expense._date).slice(0, 7) === month)
    .reduce((total, expense) => total + expense._amount, 0);

  const openAddDialog = () => {
    setEditingExpense(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEditDialog = (expense) => {
    setEditingExpense(expense);
    setForm({
      title: expense._title === "Expense" ? "" : expense._title,
      category: expense._category,
      amount: String(expense._amount || ""),
      expenseDate: String(expense._date).slice(0, 10) || today(),
      paymentMethod: expense._payment === "—" ? "Cash" : expense._payment,
      description: expense._description,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setEditingExpense(null);
    setForm(emptyForm());
  };

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const saveExpense = async () => {
    const amount = Number(form.amount);

    if (!form.title.trim()) {
      showNotice("Please enter an expense name.", "warning");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      showNotice("Please enter a valid expense amount.", "warning");
      return;
    }

    if (!form.expenseDate) {
      showNotice("Please select the expense date.", "warning");
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      amount,
      expenseDate: form.expenseDate,
      paymentMethod: form.paymentMethod,
      description: form.description.trim(),
    };

    setSaving(true);

    try {
      if (editingExpense) {
        if (editingExpense._id == null) {
          showNotice("Expense ID is missing; cannot update this record.", "error");
          return;
        }

        await API.put(`/expenses/${editingExpense._id}`, payload);
        showNotice("Expense updated successfully.");
      } else {
        await API.post("/expenses", payload);
        showNotice("Expense added successfully.");
      }

      setDialogOpen(false);
      setEditingExpense(null);
      setForm(emptyForm());
      await loadExpenses();
    } catch (error) {
      console.error("Save expense error:", error);
      showNotice(
        error.response?.data?.message ||
          "Could not save expense. Verify your backend route and field names.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteExpense = async (expense) => {
    if (expense._id == null) {
      showNotice("Expense ID is missing; cannot delete this record.", "error");
      return;
    }

    if (
      !window.confirm(
        `Delete "${expense._title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await API.delete(`/expenses/${expense._id}`);
      showNotice("Expense deleted successfully.");
      await loadExpenses();
    } catch (error) {
      console.error("Delete expense error:", error);
      showNotice(
        error.response?.data?.message || "Unable to delete expense.",
        "error"
      );
    }
  };

  const summaryCards = [
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      description: "All recorded expenses",
      icon: <PaymentsRounded />,
      color: "#2563eb",
      background: "#eff6ff",
    },
    {
      title: "This Month",
      value: formatCurrency(monthlyExpenses),
      description: "Expenses recorded this month",
      icon: <CalendarMonthRounded />,
      color: "#7c3aed",
      background: "#f5f3ff",
    },
    {
      title: "Total Records",
      value: normalizedExpenses.length.toLocaleString("en-IN"),
      description: "Recorded expense entries",
      icon: <ReceiptLongRounded />,
      color: "#059669",
      background: "#ecfdf5",
    },
  ];

  const categoryIcon = (category) => {
    const value = category.toLowerCase();

    if (value.includes("transport") || value.includes("travel")) {
      return <LocalShippingOutlined />;
    }

    if (value.includes("inventory") || value.includes("office")) {
      return <StorefrontOutlined />;
    }

    if (value.includes("utilit")) {
      return <BoltOutlined />;
    }

    return <MoreHorizRounded />;
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, lg: 4 },
        bgcolor: "#f8fafc",
        minHeight: "100%",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 25, md: 30 },
              fontWeight: 800,
              color: "#172554",
              letterSpacing: "-0.7px",
            }}
          >
            Expenses
          </Typography>

          <Typography sx={{ color: "#64748b", mt: 0.5, fontSize: 14 }}>
            Track and manage your business expenses in one place.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={openAddDialog}
          sx={{
            bgcolor: "#2563eb",
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: "0 5px 14px rgba(37,99,235,0.18)",
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          Add Expense
        </Button>
      </Stack>

      {/* Summary cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} lg={4} key={card.title}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid #e8edf5",
                borderRadius: 3,
                height: "100%",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography sx={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>
                  {card.title}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: card.background,
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
              </Stack>

              <Typography
                sx={{
                  mt: 2,
                  fontSize: { xs: 23, md: 27 },
                  fontWeight: 800,
                  color: "#172554",
                  overflowWrap: "anywhere",
                }}
              >
                {card.value}
              </Typography>

              <Typography sx={{ mt: 0.7, color: "#94a3b8", fontSize: 12 }}>
                {card.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Expenses table */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e8edf5",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          sx={{ p: { xs: 2, sm: 3 } }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, color: "#172554", fontSize: 17 }}>
              All Expenses
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5 }}>
              Review your expense transactions
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              size="small"
              placeholder="Search expenses..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              sx={{
                minWidth: { sm: 220 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#fff",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              select
              size="small"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              sx={{
                minWidth: 155,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>

        <Divider />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 7 }}>
            <CircularProgress />
          </Box>
        ) : filteredExpenses.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 7, px: 2 }}>
            <ReceiptLongRounded sx={{ fontSize: 45, color: "#cbd5e1" }} />

            <Typography sx={{ mt: 1.5, fontWeight: 700, color: "#334155" }}>
              No expenses found
            </Typography>

            <Typography sx={{ color: "#94a3b8", fontSize: 13, mt: 0.5 }}>
              Add an expense or change your search filters.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={openAddDialog}
              sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
            >
              Add Expense
            </Button>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 850 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {[
                    "Expense",
                    "Category",
                    "Date",
                    "Payment Method",
                    "Amount",
                    "Actions",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        py: 1.8,
                        color: "#64748b",
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: ".4px",
                        borderBottom: "1px solid #e8edf5",
                      }}
                      align={heading === "Actions" ? "right" : "left"}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow
                    key={expense._id ?? `${expense._title}-${expense._date}`}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            flexShrink: 0,
                            borderRadius: 2,
                            bgcolor: "#eff6ff",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {categoryIcon(expense._category)}
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
                            {expense._title}
                          </Typography>
                          {expense._description && (
                            <Typography
                              sx={{
                                fontSize: 11,
                                color: "#94a3b8",
                                mt: 0.3,
                                maxWidth: 220,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {expense._description}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={expense._category}
                        sx={{
                          bgcolor: "#f1f5f9",
                          color: "#475569",
                          fontSize: 11,
                          fontWeight: 600,
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ color: "#64748b", fontSize: 12 }}>
                      {expense._date
                        ? new Date(expense._date).toLocaleDateString("en-IN")
                        : "—"}
                    </TableCell>

                    <TableCell sx={{ color: "#64748b", fontSize: 12 }}>
                      {expense._payment}
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#172554" }}>
                        {formatCurrency(expense._amount)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Edit expense">
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(expense)}
                          sx={{ color: "#2563eb", mr: 0.5 }}
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete expense">
                        <IconButton
                          size="small"
                          onClick={() => deleteExpense(expense)}
                          sx={{ color: "#dc2626" }}
                        >
                          <DeleteOutlineRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && filteredExpenses.length > 0 && (
          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: "1px solid #e8edf5",
              bgcolor: "#fff",
            }}
          >
            <Typography sx={{ fontSize: 12, color: "#64748b" }}>
              Showing {filteredExpenses.length} of {normalizedExpenses.length} expenses
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Add / Edit Expense dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, m: 2 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 800,
            color: "#172554",
          }}
        >
          {editingExpense ? "Edit Expense" : "Add New Expense"}

          <IconButton onClick={closeDialog} disabled={saving} size="small">
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography sx={{ fontSize: 13, color: "#64748b", mb: 2.5 }}>
            Enter the details of your business expense below.
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Expense Name"
              placeholder="e.g. Office rent"
              fullWidth
              required
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Category"
                  fullWidth
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Amount (₹)"
                  type="number"
                  fullWidth
                  required
                  value={form.amount}
                  onChange={(event) => updateField("amount", event.target.value)}
                  inputProps={{ min: 0.01, step: "0.01" }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expense Date"
                  type="date"
                  fullWidth
                  required
                  value={form.expenseDate}
                  onChange={(event) => updateField("expenseDate", event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Payment Method"
                  fullWidth
                  value={form.paymentMethod}
                  onChange={(event) => updateField("paymentMethod", event.target.value)}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <TextField
              label="Description (Optional)"
              placeholder="Add notes about this expense"
              multiline
              minRows={3}
              fullWidth
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={closeDialog}
            disabled={saving}
            sx={{ textTransform: "none", color: "#64748b" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={saveExpense}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <AddRounded />
              )
            }
            sx={{
              bgcolor: "#2563eb",
              borderRadius: 2,
              px: 2.5,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            {saving ? "Saving..." : editingExpense ? "Update Expense" : "Save Expense"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notice.open}
        autoHideDuration={4000}
        onClose={() => setNotice((previous) => ({ ...previous, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notice.severity}
          variant="filled"
          onClose={() => setNotice((previous) => ({ ...previous, open: false }))}
        >
          {notice.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Expenses;