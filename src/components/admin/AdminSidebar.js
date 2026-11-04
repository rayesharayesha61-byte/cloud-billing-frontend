

import React from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Stack,
} from "@mui/material";

import {
  DashboardOutlined as DashboardIcon,
  People as PeopleIcon,
  PaymentsOutlined as PaymentsIcon,
  CardMembershipOutlined as PlanIcon,
  BusinessOutlined as BusinessIcon,
  EventAvailableOutlined as TrialIcon,
  AssessmentOutlined as ReportIcon,
  // HistoryOutlined as HistoryIcon,
  SettingsOutlined as SettingsIcon,
} from "@mui/icons-material";

export const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Users & Businesses", icon: <PeopleIcon /> },
  { label: "Subscriptions", icon: <PlanIcon /> },
  { label: "Payment History", icon: <PaymentsIcon /> },
  { label: "Manage Plans", icon: <BusinessIcon /> },
  { label: "Trial Management", icon: <TrialIcon /> },
  { label: "Revenue Reports", icon: <ReportIcon /> },

  { label: "System Settings", icon: <SettingsIcon /> },
];

export default function AdminSidebar({ tab, setTab, onNavigate }) {
  return (
    <Box
      sx={{
        width: 250,
        height: "100%",
        bgcolor: "#FFFFFF",
        color: "#334155",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #E5E7EB",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.7 }}>
        <Typography
          variant="h5"
          sx={{
            color: "#2563EB",
            fontWeight: 800,
            letterSpacing: "-0.5px",
          }}
        >
          CloudBill
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#64748B",
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          SUPER ADMIN
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#E5E7EB" }} />

      {/* Menu */}
      <Stack
        spacing={0.6}
        sx={{
          p: 1.5,
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94A3B8",
            px: 1.5,
            pt: 1,
            pb: 0.8,
            letterSpacing: 0.8,
          }}
        >
          MAIN MENU
        </Typography>

        {menuItems.map((item, index) => {
          const active = tab === index;

          return (
            <Button
              key={item.label}
              fullWidth
              startIcon={item.icon}
              onClick={() => {
                setTab(index);
                onNavigate?.();
              }}
              sx={{
                justifyContent: "flex-start",
                color: active ? "#2563EB" : "#475569",
                bgcolor: active ? "#EFF6FF" : "transparent",
                borderRadius: "6px",
                py: 1.15,
                px: 1.5,
                minHeight: 43,
                textTransform: "none",
                fontSize: 13.5,
                fontWeight: active ? 700 : 500,
                transition: "all 0.2s ease",

                "&:hover": {
                  bgcolor: active ? "#EFF6FF" : "#F1F5F9",
                  color: "#2563EB",
                },

                "& .MuiButton-startIcon": {
                  mr: 1.5,
                  color: active ? "#2563EB" : "#64748B",
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Stack>

      <Divider sx={{ borderColor: "#E5E7EB" }} />

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: "#64748B",
            fontWeight: 500,
          }}
        >
          CloudBill Admin Panel
        </Typography>

        <Typography
          sx={{
            fontSize: 11,
            color: "#94A3B8",
            mt: 0.5,
          }}
        >
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
}
