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
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import SearchIcon from "@mui/icons-material/Search";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const PLANS = {
  BASIC: 299,
  PROFESSIONAL: 599,
  BUSINESS: 999,
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const date = (value) => {
  if (!value) return "—";

  const raw = String(value).slice(0, 10);
  const parts = raw.split("-");

  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return "—";
};

const chipColor = (value) => {
  const status = String(value || "").toUpperCase();

  if (status === "ACTIVE") return "success";
  if (status === "TRIAL") return "info";
  if (status === "EXPIRED") return "error";
  if (status === "CANCELLED") return "default";

  return "default";
};

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, height: "100%", bgcolor: "#fff" }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography variant="h4" fontWeight={800} sx={{ my: 1 }}>
              {value ?? 0}
            </Typography>

            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 46,
              height: 46,
              display: "grid",
              placeItems: "center",
              bgcolor: "#eef2ff",
              color: "#3949ab",
              borderRadius: 2,
              flexShrink: 0,
            }}
          >
            <Icon />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState(0);
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [reports, setReports] = useState(null);

  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("ALL");
  const [drafts, setDrafts] = useState({});

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [d, u, s, r] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/subscriptions"),
        api.get("/admin/reports"),
      ]);

      setDashboard(d.data);
      setUsers(u.data.users || []);
      setSubscriptions(s.data.subscriptions || []);
      setReports(r.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Cannot load Admin Panel. Check login, API URL and admin permissions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filteredUsers = users.filter((user) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      !term ||
      [user.id, user.business_id, user.name, user.email].some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );

    const matchesFilter =
      userFilter === "ALL" ||
      (userFilter === "ACTIVE" && Number(user.is_active) === 1) ||
      (userFilter === "INACTIVE" && Number(user.is_active) === 0) ||
      (userFilter === "TRIAL" &&
        String(user.subscription_status).toUpperCase() === "TRIAL") ||
      (userFilter === "EXPIRED" &&
        String(user.subscription_status).toUpperCase() === "EXPIRED");

    return matchesSearch && matchesFilter;
  });

  const toggleUser = async (user) => {
    const next = Number(user.is_active) !== 1;

    if (
      !window.confirm(
        `${next ? "Activate" : "Deactivate"} account for ${
          user.name || user.email
        }?`
      )
    ) {
      return;
    }

    setBusyId(user.id);
    setError("");
    setNotice("");

    try {
      const { data } = await api.patch(
        `/admin/users/${user.id}/status`,
        { isActive: next }
      );

      setNotice(data.message || "Account status updated.");
      await loadAll();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update account status."
      );
    } finally {
      setBusyId(null);
    }
  };

  const getDraft = (row) =>
    drafts[row.user_id] || {
      plan: row.plan_name || "BASIC",
      status: row.status || "TRIAL",
    };

  const updateDraft = (userId, field, value) => {
    setDrafts((old) => ({
      ...old,
      [userId]: {
        ...getDraft(
          subscriptions.find((row) => row.user_id === userId) || {
            user_id: userId,
            plan_name: "BASIC",
            status: "TRIAL",
          }
        ),
        ...old[userId],
        [field]: value,
      },
    }));
  };

  const saveSubscription = async (row) => {
    const draft = getDraft(row);

    setBusyId(`sub-${row.user_id}`);
    setError("");
    setNotice("");

    try {
      const { data } = await api.patch(
        `/admin/subscriptions/${row.user_id}`,
        {
          plan: draft.plan,
          status: draft.status,
        }
      );

      setNotice(data.message || "Subscription updated.");
      await loadAll();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update subscription."
      );
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !dashboard) {
    return (
      <Box sx={{ minHeight: 300, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 3 },
        minHeight: "100%",
        bgcolor: "#f7f8fc",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Admin Panel
          </Typography>

          <Typography color="text.secondary">
            Manage CloudBill users, businesses and subscriptions.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadAll}
          disabled={loading}
        >
          Refresh data
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {notice && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setNotice("")}
        >
          {notice}
        </Alert>
      )}

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
        <StatCard
          title="Total Users / Businesses"
          value={dashboard?.stats?.totalUsers}
          subtitle="Registered accounts"
          icon={BusinessOutlinedIcon}
        />

        <StatCard
          title="Active Accounts"
          value={dashboard?.stats?.activeUsers}
          subtitle={`${dashboard?.stats?.inactiveUsers || 0} deactivated`}
          icon={PeopleAltOutlinedIcon}
        />

        <StatCard
          title="Trial Accounts"
          value={dashboard?.stats?.trialUsers}
          subtitle={`${dashboard?.stats?.expiredUsers || 0} expired`}
        //   icon={CheckCircleOutlineIcon}
        />

        <StatCard
          title="Active Plan Amount"
          value={money(dashboard?.stats?.monthlyActiveAmount)}
          subtitle="Active subscription amounts"
          icon={PaidOutlinedIcon}
        />
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 1, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Dashboard" />
          <Tab label="Users & Businesses" />
          <Tab label="Subscriptions" />
          <Tab label="Reports" />
        </Tabs>

        <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
          {tab === 0 && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                Recently registered accounts
              </Typography>

              <UserTable
                rows={dashboard?.recentUsers || []}
                busyId={busyId}
                onToggle={toggleUser}
              />
            </Stack>
          )}

          {tab === 1 && (
            <Stack spacing={2}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search name, email, user ID or business ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                }}
              />

              <FormControl size="small" sx={{ maxWidth: 260 }}>
                <InputLabel>Account filter</InputLabel>
                <Select
                  label="Account filter"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All accounts</MenuItem>
                  <MenuItem value="ACTIVE">Active accounts</MenuItem>
                  <MenuItem value="INACTIVE">Deactivated accounts</MenuItem>
                  <MenuItem value="TRIAL">Trial accounts</MenuItem>
                  <MenuItem value="EXPIRED">Expired accounts</MenuItem>
                </Select>
              </FormControl>

              <UserTable
                rows={filteredUsers}
                busyId={busyId}
                onToggle={toggleUser}
              />
            </Stack>
          )}

          {tab === 2 && (
            <SubscriptionTable
              rows={subscriptions}
              getDraft={getDraft}
              updateDraft={updateDraft}
              saveSubscription={saveSubscription}
              busyId={busyId}
            />
          )}

          {tab === 3 && (
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight={700}>
                Reports
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                  },
                  gap: 2,
                }}
              >
                <StatCard
                  title="Total Users"
                  value={reports?.summary?.totalUsers}
                  icon={PeopleAltOutlinedIcon}
                />

                <StatCard
                  title="Active Accounts"
                  value={reports?.summary?.activeUsers}
                //   icon={CheckCircleOutlineIcon}
                />

                <StatCard
                  title="Inactive Accounts"
                  value={reports?.summary?.inactiveUsers}
                  icon={BlockOutlinedIcon}
                />
              </Box>

              <Typography fontWeight={700}>
                Subscriptions by plan and status
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Plan</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Accounts</TableCell>
                      <TableCell align="right">Total Amount</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(reports?.planBreakdown || []).map((row, index) => (
                      <TableRow key={`${row.plan}-${row.status}-${index}`}>
                        <TableCell>{row.plan}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={row.status}
                            color={chipColor(row.status)}
                          />
                        </TableCell>
                        <TableCell align="right">{row.total}</TableCell>
                        <TableCell align="right">
                          {money(row.amount)}
                        </TableCell>
                      </TableRow>
                    ))}

                    {!reports?.planBreakdown?.length && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No subscription report data available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography fontWeight={700}>
                Monthly registrations
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell align="right">New accounts</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(reports?.monthlyRegistrations || []).map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell align="right">{row.total}</TableCell>
                      </TableRow>
                    ))}

                    {!reports?.monthlyRegistrations?.length && (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          No registration data available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

function UserTable({ rows, onToggle, busyId }) {
  return (
    <TableContainer sx={{ maxHeight: 560 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Business ID</TableCell>
            <TableCell>Name / Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Plan / Trial end</TableCell>
            <TableCell>Account</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((user) => (
            <TableRow hover key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.business_id ?? "—"}</TableCell>

              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {user.name || "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </TableCell>

              <TableCell>
                <Chip
                  size="small"
                  label={user.role || "USER"}
                  variant="outlined"
                />
              </TableCell>

              <TableCell>
                <Typography variant="body2">
                  {user.plan_name || user.plan || "FREE_TRIAL"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ends {date(user.trial_end_date)}
                </Typography>
              </TableCell>

              <TableCell>
                <Chip
                  size="small"
                  label={
                    Number(user.is_active) === 1 ? "ACTIVE" : "DEACTIVATED"
                  }
                  color={Number(user.is_active) === 1 ? "success" : "error"}
                />
              </TableCell>

              <TableCell align="right">
                <Button
                  size="small"
                  color={Number(user.is_active) === 1 ? "error" : "success"}
                  disabled={
                    busyId === user.id ||
                    String(user.role).toUpperCase() === "ADMIN"
                  }
                  startIcon={
                    busyId === user.id ? (
                      <CircularProgress size={14} />
                    ) : Number(user.is_active) === 1 ? (
                      <BlockOutlinedIcon />
                    ) : (
                    <BlockOutlinedIcon />
                    )
                  }
                  onClick={() => onToggle(user)}
                >
                  {Number(user.is_active) === 1 ? "Deactivate" : "Activate"}
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {!rows.length && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No accounts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function SubscriptionTable({
  rows,
  getDraft,
  updateDraft,
  saveSubscription,
  busyId,
}) {
  return (
    <TableContainer sx={{ maxHeight: 560 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Business ID</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Trial end</TableCell>
            <TableCell>Next billing</TableCell>
            <TableCell>Save</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => {
            const draft = getDraft(row);

            return (
              <TableRow key={row.subscription_id}>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {row.name || "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.email}
                  </Typography>
                </TableCell>

                <TableCell>{row.business_id ?? "—"}</TableCell>

                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 145 }}>
                    <Select
                      value={draft.plan}
                      onChange={(e) =>
                        updateDraft(row.user_id, "plan", e.target.value)
                      }
                    >
                      <MenuItem value="BASIC">Basic</MenuItem>
                      <MenuItem value="PROFESSIONAL">Professional</MenuItem>
                      <MenuItem value="BUSINESS">Business</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell>{money(PLANS[draft.plan])}/mo</TableCell>

                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 125 }}>
                    <Select
                      value={draft.status}
                      onChange={(e) =>
                        updateDraft(row.user_id, "status", e.target.value)
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

                <TableCell>{date(row.trial_end_date)}</TableCell>
                <TableCell>{date(row.next_billing_date)}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={busyId === `sub-${row.user_id}`}
                    onClick={() => saveSubscription(row)}
                  >
                    {busyId === `sub-${row.user_id}` ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}

          {!rows.length && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No subscription records found. Create subscription records
                for registered users first.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}