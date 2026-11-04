
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  useMediaQuery,
  useTheme,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";

import {
  Refresh as RefreshIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  People as PeopleIcon,
  PaymentsOutlined as PaymentsIcon,
  CardMembershipOutlined as PlanIcon,
  AssessmentOutlined as ReportIcon,
  CheckCircle as CheckIcon,
  Business as BusinessIcon,
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

import AdminSidebar, {
  menuItems,
} from "../components/admin/AdminSidebar";

// ================= API CONFIGURATION =================

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://cloud-billing-backend.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= MENU INDEX MAPPING =================

const endpoints = {
  2: "/super-admin/subscriptions",
  3: "/super-admin/payments",
  4: "/super-admin/plans",
  5: "/super-admin/trials",
  6: "/super-admin/reports",
};

const responseKeys = {
  2: "subscriptions",
  3: "payments",
  4: "plans",
  5: "trials",
  6: "monthly",
};

// ================= COMMON STYLES =================

const colors = {
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  text: "#1E293B",
  secondary: "#64748B",
  border: "#E5E7EB",
  background: "#F4F6FB",
  white: "#FFFFFF",
};

const paperStyle = {
  p: { xs: 1.5, sm: 2.5 },
  borderRadius: 2,
  border: `1px solid ${colors.border}`,
  bgcolor: colors.white,
  boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
};

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const statusColor = (status) => {
  const value = String(status || "").toUpperCase();

  if (["ACTIVE", "APPROVED", "RESOLVED"].includes(value)) {
    return "success";
  }

  if (["PENDING", "TRIAL", "IN_PROGRESS"].includes(value)) {
    return "warning";
  }

  if (
    ["EXPIRED", "REJECTED", "CANCELLED", "CLOSED", "INACTIVE"].includes(
      value
    )
  ) {
    return "error";
  }

  return "default";
};

const tableHeaderStyle = {
  fontWeight: 700,
  fontSize: 13,
  color: "#475569",
  bgcolor: "#F8FAFC",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #E2E8F0",
  py: 1.8,
};

const tableCellStyle = {
  fontSize: 13,
  color: "#334155",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #F1F5F9",
  py: 1.6,
};

// ================= DEFAULT SYSTEM SETTINGS =================

const defaultSettings = {
  company_name: "CloudBill",
  support_email: "support@cloudbill.com",
  support_phone: "",
  company_address: "",
  website_url: "",

  trial_days: 30,
  free_trial_enabled: true,
  yearly_billing_enabled: true,
  auto_expire_subscription: true,
  grace_period_days: 7,

  upi_id: "",
  gpay_number: "",
  payment_instructions: "",
  payment_approval_required: true,

  password_min_length: 8,
  login_attempt_limit: 5,
  session_timeout: 30,
  registration_enabled: true,
  maintenance_mode: false,

  new_user_alert: true,
  payment_alert: true,
  subscription_expiry_alert: true,
  trial_expiry_alert: true,

  terms_conditions: "",
  privacy_policy: "",
  refund_policy: "",
};

const booleanFields = [
  "free_trial_enabled",
  "yearly_billing_enabled",
  "auto_expire_subscription",
  "payment_approval_required",
  "registration_enabled",
  "maintenance_mode",
  "new_user_alert",
  "payment_alert",
  "subscription_expiry_alert",
  "trial_expiry_alert",
];

// ================= ADMIN PANEL =================

export default function AdminPanel() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [tab, setTab] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Payment dialog
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("APPROVED");
  const [paymentNote, setPaymentNote] = useState("");

  // Trial dialog
  const [trialDialog, setTrialDialog] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [trialDays, setTrialDays] = useState(7);

  // System settings state - MUST be inside component
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // ================= SUCCESS MESSAGE =================

  const showSuccess = (message) => {
    setSuccess(message);
    setError("");

    window.setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  // ================= LOAD DASHBOARD =================

  const loadDashboard = useCallback(async () => {
    const response = await API.get("/super-admin/dashboard");

    setStats(response.data.stats || {});
    setRecentUsers(response.data.recentUsers || []);
  }, []);

  // ================= LOAD TAB DATA =================

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Dashboard
      if (tab === 0) {
        await loadDashboard();
        setData([]);
        return;
      }

      // Users and Businesses
      if (tab === 1) {
        const [usersResponse, businessesResponse] =
          await Promise.all([
            API.get("/super-admin/users", {
              params: { search },
            }),
            API.get("/super-admin/businesses"),
          ]);

        setData({
          users: usersResponse.data.users || [],
          businesses: businessesResponse.data.businesses || [],
        });

        return;
      }

      // System Settings
      if (tab === 7) {
        const response = await API.get("/super-admin/settings");

        const saved = response.data.settings || {};
        const normalized = {
          ...defaultSettings,
          ...saved,
        };

        booleanFields.forEach((field) => {
          normalized[field] =
            saved[field] === undefined
              ? defaultSettings[field]
              : (
                  saved[field] === true ||
                  saved[field] === 1 ||
                  saved[field] === "1" ||
                  saved[field] === "true"
                );
        });

        setSettings(normalized);
        setData([]);

        return;
      }

      // Revenue Reports
      if (tab === 6) {
        const [dashboardResponse, reportResponse] =
          await Promise.all([
            API.get("/super-admin/dashboard"),
            API.get("/super-admin/reports"),
          ]);

        setStats(dashboardResponse.data.stats || {});

        const reports = reportResponse.data.monthly || [];

        setData(Array.isArray(reports) ? reports : []);

        return;
      }

      // Other tabs
      const endpoint = endpoints[tab];

      if (!endpoint) {
        setData([]);
        return;
      }

      const response = await API.get(endpoint);
      const result = response.data[responseKeys[tab]];

      setData(
        Array.isArray(result)
          ? result
          : result || []
      );
    } catch (err) {
      console.error("ADMIN LOAD ERROR:", err);

      setData([]);

      setError(
        err.response?.data?.message ||
          "Unable to load data. Please check the backend API."
      );
    } finally {
      setLoading(false);
    }
  }, [tab, search, loadDashboard]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ================= UPDATE USER =================

  const updateUser = async (id, isActive) => {
    try {
      await API.patch(
        `/super-admin/users/${id}/status`,
        { isActive }
      );

      showSuccess("User status updated successfully");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "User update failed"
      );
    }
  };

  // ================= UPDATE SUBSCRIPTION =================

  const updateSubscription = async (userId, plan, status) => {
    try {
      await API.patch(
        `/super-admin/subscriptions/${userId}`,
        {
          plan,
          status,
        }
      );

      showSuccess("Subscription updated successfully");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Subscription update failed"
      );
    }
  };

  // ================= PAYMENT APPROVAL =================

  const openPaymentDialog = (payment, status) => {
    setSelectedPayment(payment);
    setPaymentStatus(status);
    setPaymentNote("");
    setPaymentDialog(true);
  };

  const submitPaymentStatus = async () => {
    if (!selectedPayment) return;

    try {
      await API.patch(
        `/super-admin/payments/${selectedPayment.id}/status`,
        {
          status: paymentStatus,
          admin_note: paymentNote,
        }
      );

      setPaymentDialog(false);
      setSelectedPayment(null);

      showSuccess(
        `Payment ${paymentStatus.toLowerCase()} successfully`
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Payment update failed"
      );
    }
  };

  // ================= TRIAL EXTENSION =================

  const openTrialDialog = (trial) => {
    setSelectedTrial(trial);
    setTrialDays(7);
    setTrialDialog(true);
  };

  const submitTrialExtension = async () => {
    if (!selectedTrial) return;

    const days = Number(trialDays);

    if (
      !Number.isInteger(days) ||
      days < 1 ||
      days > 365
    ) {
      setError("Enter a trial extension between 1 and 365 days");
      return;
    }

    try {
      await API.patch(
        `/super-admin/trials/${selectedTrial.id}`,
        { days }
      );

      setTrialDialog(false);
      setSelectedTrial(null);

      showSuccess("Trial extended successfully");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Trial update failed"
      );
    }
  };

  // ================= SYSTEM SETTINGS =================

  const handleSettingsChange = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveSettings = async () => {
    try {
      setSettingsSaving(true);
      setError("");
      setSuccess("");

      await API.put("/super-admin/settings", settings);

      showSuccess("System settings saved successfully!");
    } catch (err) {
      console.error("SAVE SETTINGS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save system settings"
      );
    } finally {
      setSettingsSaving(false);
    }
  };

  // ================= STATUS CHIP =================

  const renderStatus = (status) => (
    <Chip
      size="small"
      label={status || "UNKNOWN"}
      color={statusColor(status)}
      variant="outlined"
      sx={{
        fontWeight: 600,
        fontSize: 11,
        borderRadius: 1,
      }}
    />
  );

  // ================= COMMON TABLE =================

  const renderTable = (columns, rows) => (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Table
        size="small"
        sx={{
          minWidth: 650,
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column} sx={tableHeaderStyle}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{
                  py: 6,
                  color: colors.secondary,
                  fontSize: 13,
                }}
              >
                No records found
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow
                hover
                key={row.id ?? row.subscription_id ?? index}
                sx={{
                  "&:hover": {
                    bgcolor: "#F8FAFC",
                  },
                }}
              >
                {row.cells.map((cell, i) => (
                  <TableCell key={i} sx={tableCellStyle}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );

  // ================= DASHBOARD STATISTICS =================

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: <PeopleIcon />,
      color: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      title: "Active Users",
      value: stats.activeUsers || 0,
      icon: <CheckIcon />,
      color: "#16A34A",
      bg: "#F0FDF4",
    },
    {
      title: "Trial Users",
      value: stats.trialUsers || 0,
      icon: <PlanIcon />,
      color: "#0891B2",
      bg: "#ECFEFF",
    },
    {
      title: "Paid Users",
      value: stats.paidUsers || 0,
      icon: <PaymentsIcon />,
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    {
      title: "Expired Users",
      value: stats.expiredUsers || 0,
      icon: <PeopleIcon />,
      color: "#DC2626",
      bg: "#FEF2F2",
    },
    {
      title: "Monthly Revenue",
      value: money(stats.monthlyRevenue),
      icon: <PaymentsIcon />,
      color: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      title: "Yearly Revenue",
      value: money(stats.yearlyRevenue),
      icon: <ReportIcon />,
      color: "#16A34A",
      bg: "#F0FDF4",
    },
  ];

  // ================= DASHBOARD =================

  const renderDashboard = () => (
    <>
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
        {statCards.map((card) => (
          <Paper
            key={card.title}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: `1px solid ${colors.border}`,
              bgcolor: colors.white,
              transition: "0.2s",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(15,23,42,0.07)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  {card.title}
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  mt={1}
                  color={colors.text}
                >
                  {card.value}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.color,
                }}
              >
                {card.icon}
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Paper elevation={0} sx={paperStyle}>
        <Typography
          variant="h6"
          fontWeight={700}
          color={colors.text}
          mb={2}
        >
          Recent Users
        </Typography>

        {renderTable(
          ["ID", "Name", "Email", "Plan", "Status", "Account"],
          recentUsers.map((user) => ({
            id: user.id,
            cells: [
              user.id,
              user.name || "-",
              user.email || "-",
              user.plan || "-",
              renderStatus(user.subscription_status),
              renderStatus(
                Number(user.is_active) === 1 ? "ACTIVE" : "INACTIVE"
              ),
            ],
          }))
        )}
      </Paper>
    </>
  );

  // ================= USERS AND BUSINESSES =================

  const renderUsers = () => {
    const users = data.users || [];
    const businesses = data.businesses || [];

    return (
      <Stack spacing={3}>
        <Paper elevation={0} sx={paperStyle}>
          <Typography
            variant="h6"
            fontWeight={700}
            color={colors.text}
            mb={2}
          >
            Users
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Search users by name, email or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              mb: 2,
              maxWidth: 450,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#FFFFFF",
              },
            }}
          />

          {renderTable(
            [
              "ID",
              "Business ID",
              "Name",
              "Email",
              "Plan",
              "Subscription",
              "Account",
              "Action",
            ],
            users.map((user) => ({
              id: user.id,
              cells: [
                user.id,
                user.business_id || "-",
                user.name || "-",
                user.email || "-",
                user.plan || "-",
                renderStatus(user.subscription_status),
                renderStatus(
                  Number(user.is_active) === 1 ? "ACTIVE" : "INACTIVE"
                ),
                <Button
                  size="small"
                  variant="outlined"
                  color={
                    Number(user.is_active) === 1 ? "error" : "success"
                  }
                  onClick={() =>
                    updateUser(
                      user.id,
                      Number(user.is_active) !== 1
                    )
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: 1.5,
                    fontWeight: 600,
                  }}
                >
                  {Number(user.is_active) === 1
                    ? "Deactivate"
                    : "Activate"}
                </Button>,
              ],
            }))
          )}
        </Paper>

        <Paper elevation={0} sx={paperStyle}>
          <Typography
            variant="h6"
            fontWeight={700}
            color={colors.text}
            mb={2}
          >
            Businesses
          </Typography>

          {renderTable(
            [
              "Business ID",
              "Business Name",
              "Owner",
              "Email",
              "Subscription",
              "Account",
            ],
            businesses.map((business) => ({
              id: business.id,
              cells: [
                business.id,
                business.business_name ||
                  business.name ||
                  business.company_name ||
                  "-",
                business.user_name || "-",
                business.user_email || "-",
                renderStatus(business.subscription_status),
                renderStatus(
                  Number(business.is_active) === 1 ? "ACTIVE" : "INACTIVE"
                ),
              ],
            }))
          )}
        </Paper>
      </Stack>
    );
  };

  // ================= SUBSCRIPTIONS =================

  const renderSubscriptions = () => (
    <Paper elevation={0} sx={paperStyle}>
      <Typography
        variant="h6"
        fontWeight={700}
        color={colors.text}
        mb={2}
      >
        Subscription Management
      </Typography>

      {renderTable(
        ["User", "Email", "Plan", "Amount", "Status", "Update Status"],
        (Array.isArray(data) ? data : []).map((subscription) => ({
          id: subscription.id,
          cells: [
            subscription.name || subscription.user_id,
            subscription.email || "-",
            subscription.plan_name || "-",
            money(subscription.amount),
            renderStatus(subscription.status),
            <TextField
              select
              size="small"
              value={subscription.status || "TRIAL"}
              sx={{
                minWidth: 145,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
              onChange={(e) =>
                updateSubscription(
                  subscription.user_id,
                  subscription.plan_name,
                  e.target.value
                )
              }
            >
              {["TRIAL", "ACTIVE", "EXPIRED", "CANCELLED"].map((value) => (
                <MenuItem value={value} key={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>,
          ],
        }))
      )}
    </Paper>
  );

  // ================= PAYMENT HISTORY =================

  const renderPayments = () => (
    <Paper elevation={0} sx={paperStyle}>
      <Typography
        variant="h6"
        fontWeight={700}
        color={colors.text}
        mb={2}
      >
        Payment History
      </Typography>

      {renderTable(
        [
          "ID",
          "User",
          "Email",
          "Plan",
          "Amount",
          "UTR",
          "Status",
          "Date",
          "Action",
        ],
        (Array.isArray(data) ? data : []).map((payment) => ({
          id: payment.id,
          cells: [
            payment.id,
            payment.name || payment.user_id,
            payment.email || "-",
            payment.plan_name || "-",
            money(payment.amount),
            payment.utr_number || "-",
            renderStatus(payment.status),
            payment.created_at || "-",
            payment.status === "PENDING" ? (
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => openPaymentDialog(payment, "APPROVED")}
                  sx={{
                    textTransform: "none",
                    boxShadow: "none",
                  }}
                >
                  Approve
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => openPaymentDialog(payment, "REJECTED")}
                  sx={{ textTransform: "none" }}
                >
                  Reject
                </Button>
              </Stack>
            ) : (
              "-"
            ),
          ],
        }))
      )}
    </Paper>
  );

  // ================= MANAGE PLANS =================

  const renderPlans = () => (
    <Paper elevation={0} sx={paperStyle}>
      <Typography
        variant="h6"
        fontWeight={700}
        color={colors.text}
        mb={2}
      >
        Manage Plans
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Plans are displayed from existing backend data.
        Creating or editing separate plans requires a supported backend implementation.
      </Alert>

      {renderTable(
        ["Plan", "Amount", "Total Subscriptions"],
        (Array.isArray(data) ? data : []).map((plan, index) => ({
          id: index,
          cells: [
            plan.plan_name || "-",
            money(plan.amount),
            plan.total_subscriptions || 0,
          ],
        }))
      )}
    </Paper>
  );

  // ================= TRIAL MANAGEMENT =================

  const renderTrials = () => (
    <Paper elevation={0} sx={paperStyle}>
      <Typography
        variant="h6"
        fontWeight={700}
        color={colors.text}
        mb={2}
      >
        Trial Management
      </Typography>

      {renderTable(
        [
          "User",
          "Email",
          "Plan",
          "Trial Start",
          "Trial End",
          "Status",
          "Action",
        ],
        (Array.isArray(data) ? data : []).map((trial) => ({
          id: trial.id,
          cells: [
            trial.name || "-",
            trial.email || "-",
            trial.plan || "-",
            trial.trial_start_date || "-",
            trial.trial_end_date || "-",
            renderStatus(trial.subscription_status),
            <Button
              size="small"
              variant="outlined"
              onClick={() => openTrialDialog(trial)}
              sx={{
                textTransform: "none",
                borderRadius: 1.5,
                color: colors.primary,
                borderColor: colors.primary,
              }}
            >
              Extend Trial
            </Button>,
          ],
        }))
      )}
    </Paper>
  );

  // ================= REVENUE REPORTS =================

  const renderReports = () => {
    const monthlyData = Array.isArray(data) ? data : [];

    const chartData = monthlyData.map((item) => ({
      month:
        item.month ||
        item.month_name ||
        item.monthName ||
        "-",
      revenue: Number(
        item.revenue ||
          item.total_revenue ||
          item.amount ||
          0
      ),
    }));

    const maxRevenue = Math.max(
      ...chartData.map((item) => item.revenue),
      1
    );

    const reportCards = [
      {
        title: "Total Users",
        value: stats.totalUsers || 0,
        icon: <PeopleIcon />,
        color: "#2563EB",
        bg: "#EFF6FF",
      },
      {
        title: "Active Users",
        value: stats.activeUsers || 0,
        icon: <CheckIcon />,
        color: "#16A34A",
        bg: "#F0FDF4",
      },
      {
        title: "Trial Users",
        value: stats.trialUsers || 0,
        icon: <PlanIcon />,
        color: "#0891B2",
        bg: "#ECFEFF",
      },
      {
        title: "Paid Users",
        value: stats.paidUsers || 0,
        icon: <PaymentsIcon />,
        color: "#7C3AED",
        bg: "#F5F3FF",
      },
      {
        title: "Monthly Revenue",
        value: money(stats.monthlyRevenue),
        icon: <PaymentsIcon />,
        color: "#2563EB",
        bg: "#EFF6FF",
      },
      {
        title: "Yearly Revenue",
        value: money(stats.yearlyRevenue),
        icon: <ReportIcon />,
        color: "#16A34A",
        bg: "#F0FDF4",
      },
    ];

    return (
      <Stack spacing={3}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {reportCards.map((card) => (
            <Paper
              key={card.title}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: `1px solid ${colors.border}`,
                bgcolor: "#FFFFFF",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    mt={1}
                    color={colors.text}
                  >
                    {card.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: card.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
              </Stack>
            </Paper>
          ))}
        </Box>

        <Paper elevation={0} sx={paperStyle}>
          <Typography
            variant="h6"
            fontWeight={700}
            color={colors.text}
            mb={0.5}
          >
            Monthly Revenue Report
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Month-wise revenue overview
          </Typography>

          {chartData.length === 0 ? (
            <Alert severity="info">
              No monthly revenue data available.
              Backend report API must return monthly revenue records.
            </Alert>
          ) : (
            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
                pb: 1,
              }}
            >
              <Box
                sx={{
                  minWidth: Math.max(chartData.length * 85, 300),
                  height: 300,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 2,
                  px: 1,
                  pt: 2,
                  borderBottom: "1px solid #CBD5E1",
                }}
              >
                {chartData.map((item, index) => {
                  const barHeight =
                    item.revenue > 0
                      ? Math.max(
                          (item.revenue / maxRevenue) * 210,
                          8
                        )
                      : 0;

                  return (
                    <Box
                      key={`${item.month}-${index}`}
                      sx={{
                        flex: 1,
                        minWidth: 55,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color={colors.text}
                        sx={{
                          mb: 0.8,
                          fontSize: 10,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {money(item.revenue)}
                      </Typography>

                      <Box
                        sx={{
                          width: "70%",
                          maxWidth: 48,
                          height: `${barHeight}px`,
                          minHeight: item.revenue > 0 ? 8 : 0,
                          bgcolor: "#2563EB",
                          borderRadius: "6px 6px 0 0",
                          transition: "height 0.3s",
                          "&:hover": {
                            bgcolor: "#1D4ED8",
                          },
                        }}
                      />

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          fontSize: 11,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.month}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Paper>

        <Paper elevation={0} sx={paperStyle}>
          <Typography
            variant="h6"
            fontWeight={700}
            color={colors.text}
            mb={2}
          >
            Revenue Details
          </Typography>

          {renderTable(
            ["Month", "Revenue"],
            chartData.map((item, index) => ({
              id: index,
              cells: [item.month, money(item.revenue)],
            }))
          )}
        </Paper>
      </Stack>
    );
  };

  // ================= SETTINGS FORM HELPERS =================

  const textField = (
    label,
    name,
    type = "text",
    multiline = false
  ) => (
    <TextField
      fullWidth
      size="small"
      label={label}
      type={type}
      multiline={multiline}
      rows={multiline ? 4 : undefined}
      value={settings[name] ?? ""}
      onChange={(e) => {
        const value =
          type === "number"
            ? e.target.value === ""
              ? ""
              : Number(e.target.value)
            : e.target.value;

        handleSettingsChange(name, value);
      }}
      inputProps={
        type === "number"
          ? { min: 0 }
          : undefined
      }
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          bgcolor: "#FFFFFF",
        },
      }}
    />
  );

  const toggleField = (label, name) => (
    <FormControlLabel
      control={
        <Switch
          checked={Boolean(settings[name])}
          onChange={(e) =>
            handleSettingsChange(name, e.target.checked)
          }
          color="primary"
        />
      }
      label={
        <Typography
          variant="body2"
          color={colors.text}
          fontWeight={500}
        >
          {label}
        </Typography>
      }
      sx={{
        m: 0,
        minHeight: 42,
      }}
    />
  );

  const settingsSection = (title, icon, children) => (
    <Paper
      elevation={0}
      sx={{
        ...paperStyle,
        mb: 2.5,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        mb={2}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: colors.primaryLight,
            color: colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          fontWeight={700}
          color={colors.text}
        >
          {title}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      {children}
    </Paper>
  );

  // ================= SYSTEM SETTINGS =================

  const renderSettings = () => (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color={colors.text}
          >
            System Settings
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage your CloudBill application configuration.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={saveSettings}
          disabled={settingsSaving}
          startIcon={
            settingsSaving ? (
              <CircularProgress size={17} color="inherit" />
            ) : (
              <CheckIcon />
            )
          }
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            py: 1,
            bgcolor: colors.primary,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#1D4ED8",
              boxShadow: "none",
            },
          }}
        >
          {settingsSaving ? "Saving..." : "Save Settings"}
        </Button>
      </Stack>

      {/* GENERAL SETTINGS */}

      {settingsSection(
        "General Settings",
        <BusinessIcon />,
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          {textField("Company Name", "company_name")}
          {textField("Support Email", "support_email", "email")}
          {textField("Support Phone", "support_phone")}
          {textField("Website URL", "website_url")}
          <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
            {textField(
              "Company Address",
              "company_address",
              "text",
              true
            )}
          </Box>
        </Box>
      )}

      {/* SUBSCRIPTION SETTINGS */}

      {settingsSection(
        "Subscription Settings",
        <PlanIcon />,
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2,
              mb: 2,
            }}
          >
            {textField("Free Trial Days", "trial_days", "number")}
            {textField("Grace Period Days", "grace_period_days", "number")}
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Stack spacing={0.5}>
            {toggleField("Enable Free Trial", "free_trial_enabled")}
            {toggleField("Enable Yearly Billing", "yearly_billing_enabled")}
            {toggleField(
              "Automatically Expire Subscription",
              "auto_expire_subscription"
            )}
          </Stack>
        </>
      )}

      {/* PAYMENT SETTINGS */}

      {settingsSection(
        "Payment Settings",
        <CreditCardIcon />,
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2,
              mb: 2,
            }}
          >
            {textField("UPI ID", "upi_id")}
            {textField("GPay Number", "gpay_number")}
          </Box>

          {textField(
            "Payment Instructions",
            "payment_instructions",
            "text",
            true
          )}

          <Divider sx={{ my: 1.5 }} />

          {toggleField(
            "Require Admin Payment Approval",
            "payment_approval_required"
          )}
        </>
      )}

      {/* SECURITY SETTINGS */}

      {settingsSection(
        "Security Settings",
        <SecurityIcon />,
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
              },
              gap: 2,
              mb: 2,
            }}
          >
            {textField(
              "Minimum Password Length",
              "password_min_length",
              "number"
            )}

            {textField(
              "Login Attempt Limit",
              "login_attempt_limit",
              "number"
            )}

            {textField(
              "Session Timeout (Minutes)",
              "session_timeout",
              "number"
            )}
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Stack spacing={0.5}>
            {toggleField(
              "Allow New User Registration",
              "registration_enabled"
            )}

            {toggleField(
              "Maintenance Mode",
              "maintenance_mode"
            )}
          </Stack>
        </>
      )}

      {/* NOTIFICATION SETTINGS */}

      {settingsSection(
        "Notification Settings",
        <NotificationsIcon />,
        <Stack spacing={0.5}>
          {toggleField("New User Alert", "new_user_alert")}
          {toggleField("Payment Alert", "payment_alert")}
          {toggleField(
            "Subscription Expiry Alert",
            "subscription_expiry_alert"
          )}
          {toggleField("Trial Expiry Alert", "trial_expiry_alert")}
        </Stack>
      )}

      {/* BACKUP AND DATABASE */}

      {settingsSection(
        "Backup & Database",
        <StorageIcon />,
        <Alert severity="info">
          Database backup and restore functionality is not configured yet.
          This section is informational only; no backup action is available here.
        </Alert>
      )}

      {/* LEGAL SETTINGS */}

      {settingsSection(
        "Legal & Policies",
        <DescriptionIcon />,
        <Stack spacing={2}>
          {textField(
            "Terms & Conditions",
            "terms_conditions",
            "text",
            true
          )}

          {textField(
            "Privacy Policy",
            "privacy_policy",
            "text",
            true
          )}

          {textField(
            "Refund Policy",
            "refund_policy",
            "text",
            true
          )}
        </Stack>
      )}

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          onClick={saveSettings}
          disabled={settingsSaving}
          startIcon={
            settingsSaving ? (
              <CircularProgress size={17} color="inherit" />
            ) : (
              <CheckIcon />
            )
          }
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 4,
            py: 1.2,
            bgcolor: colors.primary,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#1D4ED8",
              boxShadow: "none",
            },
          }}
        >
          {settingsSaving ? "Saving..." : "Save Settings"}
        </Button>
      </Box>
    </Box>
  );

  // ================= CONTENT ROUTING =================

  const renderContent = () => {
    if (tab === 0) return renderDashboard();
    if (tab === 1) return renderUsers();
    if (tab === 2) return renderSubscriptions();
    if (tab === 3) return renderPayments();
    if (tab === 4) return renderPlans();
    if (tab === 5) return renderTrials();
    if (tab === 6) return renderReports();
    if (tab === 7) return renderSettings();

    return null;
  };

  // ================= MENU NAVIGATION =================

  const handleTabChange = (index) => {
    setTab(index);
    setSearch("");
    setError("");
    setSuccess("");
    setMobileOpen(false);
  };

  // ================= MAIN UI =================

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        bgcolor: colors.background,
      }}
    >
      {/* DESKTOP SIDEBAR */}

      {!isMobile && (
        <Box
          sx={{
            width: 250,
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            flexShrink: 0,
            zIndex: 1200,
          }}
        >
          <AdminSidebar
            tab={tab}
            setTab={handleTabChange}
          />
        </Box>
      )}

      {/* MOBILE DRAWER */}

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 250,
            bgcolor: "#FFFFFF",
            borderRight: `1px solid ${colors.border}`,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
            }}
          >
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{ color: "#475569" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, minHeight: 0 }}>
            <AdminSidebar
              tab={tab}
              setTab={handleTabChange}
            />
          </Box>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}

      <Box
        component="main"
        sx={{
          ml: { xs: 0, md: "250px" },
          width: {
            xs: "100%",
            md: "calc(100% - 250px)",
          },
          height: "100vh",
          minWidth: 0,
          overflowY: "auto",
          overflowX: "hidden",
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
          boxSizing: "border-box",
        }}
      >
        {/* TOP HEADER */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
          >
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  bgcolor: "#FFFFFF",
                  border: `1px solid ${colors.border}`,
                  borderRadius: 2,
                  color: colors.text,
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box>
              <Typography
                variant="h5"
                fontWeight={750}
                color={colors.text}
                sx={{
                  fontSize: {
                    xs: 20,
                    md: 24,
                  },
                }}
              >
                {menuItems[tab]?.label || "Dashboard"}
              </Typography>

              <Typography
                color={colors.secondary}
                variant="body2"
                sx={{ fontSize: 12 }}
              >
                CloudBill Super Admin Management
              </Typography>
            </Box>
          </Stack>

          <IconButton
            onClick={loadData}
            disabled={loading}
            sx={{
              bgcolor: "#FFFFFF",
              border: `1px solid ${colors.border}`,
              borderRadius: 2,
              color: colors.primary,
              "&:hover": {
                bgcolor: colors.primaryLight,
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Stack>

        {/* ERROR */}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* SUCCESS */}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {/* PAGE CONTENT */}

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress
              size={32}
              sx={{ color: colors.primary }}
            />
          </Box>
        ) : (
          renderContent()
        )}
      </Box>

      {/* PAYMENT APPROVAL DIALOG */}

      <Dialog
        open={paymentDialog}
        onClose={() => setPaymentDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          fontWeight={700}
          color={colors.text}
        >
          {paymentStatus === "APPROVED"
            ? "Approve Payment"
            : "Reject Payment"}
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
          >
            Payment ID: {selectedPayment?.id}
            {" | "}
            Amount: {money(selectedPayment?.amount)}
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Admin Note"
            placeholder="Enter payment verification note"
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setPaymentDialog(false)}
            sx={{
              color: colors.secondary,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color={
              paymentStatus === "APPROVED"
                ? "success"
                : "error"
            }
            onClick={submitPaymentStatus}
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              boxShadow: "none",
            }}
          >
            Confirm {paymentStatus}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TRIAL EXTENSION DIALOG */}

      <Dialog
        open={trialDialog}
        onClose={() => setTrialDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          fontWeight={700}
          color={colors.text}
        >
          Extend Trial
        </DialogTitle>

        <DialogContent>
          <Typography
            color="text.secondary"
            mb={2}
            fontSize={13}
          >
            User: {selectedTrial?.name}
          </Typography>

          <TextField
            fullWidth
            type="number"
            label="Additional Days"
            value={trialDays}
            onChange={(e) => setTrialDays(e.target.value)}
            inputProps={{
              min: 1,
              max: 365,
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setTrialDialog(false)}
            sx={{
              color: colors.secondary,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={submitTrialExtension}
            sx={{
              bgcolor: colors.primary,
              textTransform: "none",
              borderRadius: 1.5,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#1D4ED8",
                boxShadow: "none",
              },
            }}
          >
            Extend Trial
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
