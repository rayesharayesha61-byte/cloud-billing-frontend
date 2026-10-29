
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
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
  AdminPanelSettings,
  Refresh,
  PeopleAlt,

  PersonOff,
  HourglassBottom,
  EventBusy,
  CurrencyRupee,
  Search,
  Assessment,
} from "@mui/icons-material";

const API_URL = (
  process.env.REACT_APP_API_URL || "https://cloud-billing-backend.onrender.com/api"
).replace(/\/+$/, "");

const PLANS = [
  { value: "BASIC", label: "Basic - ₹299", amount: 299 },
  { value: "PROFESSIONAL", label: "Professional - ₹599", amount: 599 },
  { value: "BUSINESS", label: "Business - ₹999", amount: 999 },
];

const EMPTY_STATS = {
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  trialUsers: 0,
  expiredUsers: 0,
  monthlyActiveAmount: 0,
};

function getPayload(response) {
  const body = response?.data;
  return body?.data ?? body ?? {};
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2,
              bgcolor: `${color}18`,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function StatusChip({ status }) {
  const value = String(status || "UNKNOWN").toUpperCase();

  const color =
    value === "ACTIVE"
      ? "success"
      : value === "TRIAL"
      ? "info"
      : value === "EXPIRED" || value === "INACTIVE"
      ? "error"
      : "default";

  return <Chip label={value} color={color} size="small" />;
}

export default function AdminPanel() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [reports, setReports] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotice("");

    const endpoints = [
      { key: "dashboard", url: "/admin/dashboard" },
      { key: "users", url: "/admin/users" },
      { key: "subscriptions", url: "/admin/subscriptions" },
      { key: "reports", url: "/admin/reports" },
    ];

    try {
      const results = await Promise.allSettled(
        endpoints.map((item) => api.get(item.url))
      );

      const resultMap = {};

      results.forEach((result, index) => {
        resultMap[endpoints[index].key] = result;
      });

      const dashboardResult = resultMap.dashboard;
      const usersResult = resultMap.users;
      const subscriptionsResult = resultMap.subscriptions;
      const reportsResult = resultMap.reports;

      if (dashboardResult.status === "fulfilled") {
        const data = getPayload(dashboardResult.value);

        setStats({
          ...EMPTY_STATS,
          ...(data.stats || data),
        });
      }

      if (usersResult.status === "fulfilled") {
        const data = getPayload(usersResult.value);

        setUsers(
          Array.isArray(data)
            ? data
            : Array.isArray(data.users)
            ? data.users
            : []
        );
      }

      if (subscriptionsResult.status === "fulfilled") {
        const data = getPayload(subscriptionsResult.value);

        setSubscriptions(
          Array.isArray(data)
            ? data
            : Array.isArray(data.subscriptions)
            ? data.subscriptions
            : []
        );
      }

      if (reportsResult.status === "fulfilled") {
        setReports(getPayload(reportsResult.value));
      }

      const failed = results
        .map((result, index) =>
          result.status === "rejected"
            ? `${endpoints[index].url}: ${getErrorMessage(result.reason)}`
            : null
        )
        .filter(Boolean);

      if (failed.length === endpoints.length) {
        setError(failed.join(" | "));
      } else if (failed.length > 0) {
        setError(`Some admin data could not load: ${failed.join(" | ")}`);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleUserStatus = async (user) => {
    const userId = user.id ?? user.user_id;

    if (!userId) {
      setError("User ID is missing. Check the /admin/users API response.");
      return;
    }

    const currentActive =
      Number(user.is_active) === 1 ||
      user.is_active === true ||
      String(user.is_active).toLowerCase() === "true";

    const nextActive = !currentActive;

    setActionLoading(`user-${userId}`);
    setError("");
    setNotice("");

    try {
      await api.patch(`/admin/users/${userId}/status`, {
        isActive: nextActive,
      });

      setUsers((previous) =>
        previous.map((item) =>
          String(item.id ?? item.user_id) === String(userId)
            ? { ...item, is_active: nextActive ? 1 : 0 }
            : item
        )
      );

      setNotice(
        `User ${nextActive ? "activated" : "deactivated"} successfully.`
      );

      await loadAdminData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading("");
    }
  };

  const handleSubscriptionChange = async (subscription, field, value) => {
    const userId =
      subscription.user_id ??
      subscription.userId ??
      subscription.id;

    if (!userId) {
      setError(
        "Subscription user ID is missing. Check the /admin/subscriptions API response."
      );
      return;
    }

    const currentPlan =
      subscription.plan_name || subscription.plan || "BASIC";

    const currentStatus = subscription.status || "TRIAL";

    const nextPlan = field === "plan" ? value : currentPlan;
    const nextStatus = field === "status" ? value : currentStatus;

    setActionLoading(`subscription-${userId}`);
    setError("");
    setNotice("");

    try {
      await api.patch(`/admin/subscriptions/${userId}`, {
        plan: nextPlan,
        status: nextStatus,
      });

      setNotice("Subscription updated successfully.");
      await loadAdminData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading("");
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = search.trim().toLowerCase();

    if (!term) return true;

    return [
      user.name,
      user.owner_name,
      user.email,
      user.business_name,
      user.mobile,
      user.phone,
    ].some((value) => String(value || "").toLowerCase().includes(term));
  });

  const summary = reports.summary || {};
  const planBreakdown = Array.isArray(reports.planBreakdown)
    ? reports.planBreakdown
    : [];
  const monthlyRegistrations = Array.isArray(reports.monthlyRegistrations)
    ? reports.monthlyRegistrations
    : [];

  const monthlyMax = Math.max(
    1,
    ...monthlyRegistrations.map((item) =>
      Number(item.total ?? item.count ?? item.registrations ?? 0)
    )
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">
          Loading Admin Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              bgcolor: "#e0e7ff",
              color: "#3730a3",
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AdminPanelSettings fontSize="large" />
          </Box>

          <Box>
            <Typography variant="h5" fontWeight={800}>
              Admin Dashboard
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Cloud Billing Software Management
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={loadAdminData}
        >
          Refresh Data
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {notice && (
        <Alert
          severity="success"
          onClose={() => setNotice("")}
          sx={{ mb: 2 }}
        >
          {notice}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          title="Total Users"
          value={stats.totalUsers ?? 0}
          icon={<PeopleAlt />}
          color="#4f46e5"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers ?? 0}
         icon={<PersonOff />}
          color="#15803d"
        />
        <StatCard
          title="Inactive Users"
          value={stats.inactiveUsers ?? 0}
          icon={<PersonOff />}
          color="#dc2626"
        />
        <StatCard
          title="Trial Users"
          value={stats.trialUsers ?? 0}
          icon={<HourglassBottom />}
          color="#0284c7"
        />
        <StatCard
          title="Expired Users"
          value={stats.expiredUsers ?? 0}
          icon={<EventBusy />}
          color="#ea580c"
        />
        <StatCard
          title="Monthly Active Amount"
          value={formatMoney(stats.monthlyActiveAmount)}
          icon={<CurrencyRupee />}
          color="#7c3aed"
        />
      </Box>

      <Card
        elevation={0}
        sx={{ border: "1px solid #e5e7eb", borderRadius: 3, mb: 3 }}
      >
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight={700}>
              User Management
            </Typography>

            <TextField
              size="small"
              placeholder="Search users..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              sx={{ width: { xs: "100%", sm: 300 } }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "gray" }} />,
              }}
            />
          </Stack>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Business / User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredUsers.map((user) => {
                  const id = user.id ?? user.user_id;
                  const active =
                    Number(user.is_active) === 1 ||
                    user.is_active === true ||
                    String(user.is_active).toLowerCase() === "true";

                  return (
                    <TableRow key={id ?? user.email}>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {user.business_name ||
                            user.name ||
                            user.owner_name ||
                            "Unnamed User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {id ?? "-"}
                        </Typography>
                      </TableCell>

                      <TableCell>{user.email || "-"}</TableCell>

                      <TableCell>
                        {user.plan_name || user.plan || "-"}
                      </TableCell>

                      <TableCell>
                        <StatusChip
                          status={
                            user.subscription_status ||
                            user.status ||
                            "UNKNOWN"
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={active ? "Active" : "Inactive"}
                          color={active ? "success" : "default"}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          color={active ? "error" : "success"}
                          disabled={actionLoading === `user-${id}`}
                          onClick={() => handleUserStatus(user)}
                        >
                          {actionLoading === `user-${id}`
                            ? "Saving..."
                            : active
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{ border: "1px solid #e5e7eb", borderRadius: 3, mb: 3 }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Subscription Management
          </Typography>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Business / User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Update</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {subscriptions.map((sub, index) => {
                  const userId =
                    sub.user_id ?? sub.userId ?? sub.id;

                  return (
                    <TableRow key={userId ?? index}>
                      <TableCell>
                        {sub.business_name ||
                          sub.name ||
                          sub.owner_name ||
                          "Unnamed User"}
                      </TableCell>

                      <TableCell>{sub.email || "-"}</TableCell>

                      <TableCell sx={{ minWidth: 180 }}>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Plan</InputLabel>
                          <Select
                            label="Plan"
                            value={String(
                              sub.plan_name || sub.plan || "BASIC"
                            ).toUpperCase()}
                            disabled={
                              actionLoading === `subscription-${userId}`
                            }
                            onChange={(event) =>
                              handleSubscriptionChange(
                                sub,
                                "plan",
                                event.target.value
                              )
                            }
                          >
                            {PLANS.map((plan) => (
                              <MenuItem
                                key={plan.value}
                                value={plan.value}
                              >
                                {plan.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell sx={{ minWidth: 140 }}>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            label="Status"
                            value={String(sub.status || "TRIAL").toUpperCase()}
                            disabled={
                              actionLoading === `subscription-${userId}`
                            }
                            onChange={(event) =>
                              handleSubscriptionChange(
                                sub,
                                "status",
                                event.target.value
                              )
                            }
                          >
                            {["TRIAL", "ACTIVE", "EXPIRED", "CANCELLED"].map(
                              (status) => (
                                <MenuItem key={status} value={status}>
                                  {status}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell>
                        {actionLoading === `subscription-${userId}` ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Auto-saved
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {subscriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      No subscriptions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 2,
        }}
      >
        <Card
          elevation={0}
          sx={{ border: "1px solid #e5e7eb", borderRadius: 3 }}
        >
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Assessment color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Reports Summary
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">
                  Total Registrations
                </Typography>
                <Typography fontWeight={700}>
                  {summary.totalUsers ?? stats.totalUsers ?? 0}
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">
                  Active Subscriptions
                </Typography>
                <Typography fontWeight={700}>
                  {summary.activeSubscriptions ??
                    summary.activeUsers ??
                    stats.activeUsers ??
                    0}
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">
                  Monthly Active Amount
                </Typography>
                <Typography fontWeight={700}>
                  {formatMoney(
                    summary.monthlyActiveAmount ?? stats.monthlyActiveAmount
                  )}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{ border: "1px solid #e5e7eb", borderRadius: 3 }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Plan Breakdown
            </Typography>

            {planBreakdown.length === 0 ? (
              <Typography color="text.secondary" variant="body2">
                No plan report data available.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {planBreakdown.map((item, index) => {
                  const count = Number(
                    item.total ?? item.count ?? item.users ?? 0
                  );

                  return (
                    <Box key={item.plan_name || item.plan || index}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mb: 0.5 }}
                      >
                        <Typography variant="body2">
                          {item.plan_name || item.plan || "Other"}
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {count}
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          height: 8,
                          bgcolor: "#e5e7eb",
                          borderRadius: 5,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${
                              stats.totalUsers > 0
                                ? Math.min(
                                    100,
                                    (count / stats.totalUsers) * 100
                                  )
                                : 0
                            }%`,
                            bgcolor: ["#4f46e5", "#0891b2", "#16a34a"][
                              index % 3
                            ],
                            borderRadius: 5,
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>

      <Card
        elevation={0}
        sx={{ border: "1px solid #e5e7eb", borderRadius: 3, mt: 2 }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Monthly Registrations
          </Typography>

          {monthlyRegistrations.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No monthly registration data available.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {monthlyRegistrations.map((item, index) => {
                const count = Number(
                  item.total ?? item.count ?? item.registrations ?? 0
                );

                return (
                  <Box key={item.month || item.label || index}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="body2">
                        {item.month || item.label || `Month ${index + 1}`}
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {count}
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        height: 10,
                        bgcolor: "#e5e7eb",
                        borderRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${Math.min(
                            100,
                            (count / monthlyMax) * 100
                          )}%`,
                          bgcolor: "#4f46e5",
                          borderRadius: 5,
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
