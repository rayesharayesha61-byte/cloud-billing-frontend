
import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardSidebar from "./DashboardSidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#F8FAFC",
      }}
    >
      {/* Desktop sidebar */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: 260,
          flexShrink: 0,
        }}
      >
        <DashboardSidebar />
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Mobile navigation bar */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            height: 56,
            px: 1.5,
            gap: 1,
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <MenuIcon />
          </IconButton>

          <Typography fontWeight={800} color="#111827">
            CloudBill
          </Typography>
        </Box>

        <Outlet />
      </Box>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <Box
          onClick={() => setMobileOpen(false)}
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            backgroundColor: "rgba(15,23,42,0.5)",
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: 260,
              maxWidth: "85vw",
              height: "100dvh",
              overflowY: "auto",
            }}
          >
            <DashboardSidebar
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DashboardLayout;
