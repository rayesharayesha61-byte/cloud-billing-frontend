
import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const Header = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        color: "#0F172A",
        borderBottom: "1px solid #E2E8F0",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "64px !important",
          px: { xs: 1.5, md: 3 },
          gap: 1,
        }}
      >
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: { xs: "flex", md: "none" },
            mr: 0.5,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1,
            flex: 1,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, #2563EB, #4F46E5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            C
          </Box>

          <Typography
            sx={{
              fontSize: 19,
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            CloudBill
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            width: { sm: 220, md: 320 },
            height: 40,
            px: 1.5,
            border: "1px solid #E2E8F0",
            borderRadius: 2,
            backgroundColor: "#F8FAFC",
          }}
        >
          <SearchOutlinedIcon
            sx={{
              fontSize: 20,
              color: "#64748B",
            }}
          />

          <Typography
            sx={{
              ml: 1,
              fontSize: 13,
              color: "#94A3B8",
            }}
          >
            Search anything...
          </Typography>
        </Box>

        <Tooltip title="Help">
          <IconButton
            sx={{
              display: { xs: "none", sm: "flex" },
            }}
          >
            <HelpOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton>
            <NotificationsNoneOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            mx: 0.5,
            my: 1.5,
          }}
        />

        <Box
          onClick={handleMenuOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            px: 1,
            py: 0.5,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#F8FAFC",
            },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              backgroundColor: "#2563EB",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            U
          </Avatar>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Business Owner
            </Typography>

            <Typography
              sx={{
                fontSize: 11,
                color: "#64748B",
              }}
            >
              Owner
            </Typography>
          </Box>

          <KeyboardArrowDownOutlinedIcon
            sx={{
              fontSize: 19,
              color: "#64748B",
            }}
          />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 190,
              borderRadius: 2,
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <BusinessOutlinedIcon
              sx={{
                mr: 1.5,
                fontSize: 20,
              }}
            />
            Business Profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              window.location.href =
                "/settings";
            }}
          >
            Settings
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={{
              color: "error.main",
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;