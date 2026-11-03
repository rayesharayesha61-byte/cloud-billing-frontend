
import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Payment as PaymentIcon,
  PendingActions as PendingIcon,
  CardMembership as PlanIcon,
  EventAvailable as TrialIcon,
  Assessment as ReportIcon,
  ListAlt as AllIcon,
} from "@mui/icons-material";

const subMenus = {
  0: [
    { label: "Overview", key: "all", icon: <DashboardIcon /> },
  ],
  1: [
    { label: "All Users", key: "all-users", icon: <AllIcon /> },
    { label: "Businesses", key: "businesses", icon: <BusinessIcon /> },
    { label: "Active Users", key: "active-users", icon: <CheckIcon /> },
    { label: "Inactive Users", key: "inactive-users", icon: <CancelIcon /> },
  ],
  2: [
    { label: "All Subscriptions", key: "all", icon: <AllIcon /> },
    { label: "Active", key: "ACTIVE", icon: <CheckIcon /> },
    { label: "Trial", key: "TRIAL", icon: <TrialIcon /> },
    { label: "Expired", key: "EXPIRED", icon: <CancelIcon /> },
    { label: "Cancelled", key: "CANCELLED", icon: <CancelIcon /> },
  ],
  3: [
    { label: "All Payments", key: "all", icon: <AllIcon /> },
    { label: "Pending", key: "PENDING", icon: <PendingIcon /> },
    { label: "Approved", key: "APPROVED", icon: <CheckIcon /> },
    { label: "Rejected", key: "REJECTED", icon: <CancelIcon /> },
  ],
  4: [
    { label: "All Plans", key: "all", icon: <PlanIcon /> },
  ],
  5: [
    { label: "All Trials", key: "all", icon: <AllIcon /> },
    { label: "Active Trials", key: "TRIAL", icon: <TrialIcon /> },
    { label: "Expired Trials", key: "EXPIRED", icon: <CancelIcon /> },
  ],
  6: [{ label: "All Coupons", key: "all", icon: <AllIcon /> }],
  7: [{ label: "All Notifications", key: "all", icon: <AllIcon /> }],
  8: [{ label: "All Tickets", key: "all", icon: <AllIcon /> }],
  9: [{ label: "Monthly Revenue", key: "all", icon: <ReportIcon /> }],
  10: [{ label: "All Activity", key: "all", icon: <AllIcon /> }],
  11: [{ label: "General Settings", key: "all", icon: <AllIcon /> }],
};

export default function AdminSubSidebar({
  tab,
  subTab,
  setSubTab,
}) {
  const items = subMenus[tab] || [];

  return (
    <Box
      sx={{
        width: 220,
        height: "100%",
        bgcolor: "#fff",
        borderRight: "1px solid #E2E8F0",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={800} color="#172554">
          {tab === 0 ? "Dashboard" : "Sections"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Choose a section
        </Typography>
      </Box>

      <Divider />

      <Stack
        spacing={0.75}
        sx={{
          p: 1.5,
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {items.map((item) => (
          <Button
            key={item.key}
            fullWidth
            startIcon={item.icon}
            onClick={() => setSubTab(item.key)}
            sx={{
              justifyContent: "flex-start",
              textAlign: "left",
              textTransform: "none",
              borderRadius: 2,
              py: 1.2,
              px: 1.5,
              color: subTab === item.key ? "#1D4ED8" : "#475569",
              bgcolor: subTab === item.key ? "#EFF6FF" : "transparent",
              fontWeight: subTab === item.key ? 700 : 500,
              "&:hover": {
                bgcolor: "#F1F5F9",
              },
              "& .MuiButton-startIcon": {
                color: "inherit",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
