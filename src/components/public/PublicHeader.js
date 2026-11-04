

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

import {
  CloudQueue,
  Menu as MenuIcon,
  Close,
  CheckCircleRounded,
} from "@mui/icons-material";

import "./PublicHeader.css";

function PublicHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const isActive = (path) => currentPath === path;

  const goToPage = (path) => {
    closeMobile();
    navigate(path);
  };

  const goToFeatures = () => {
    closeMobile();

    if (currentPath === "/") {
      const featuresSection = document.getElementById("features");

      if (featuresSection) {
        featuresSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      navigate("/features");
    }
  };

  // DESKTOP NAV BUTTON
  const navButtonSx = (path) => ({
    color: isActive(path) ? "#2563EB" : "inherit",
    fontWeight: isActive(path) ? 700 : 500,
    position: "relative",
    borderRadius: 2,
    "&::after": isActive(path)
      ? {
          content: '""',
          position: "absolute",
          bottom: 3,
          left: "20%",
          width: "60%",
          height: "3px",
          borderRadius: 5,
          backgroundColor: "#2563EB",
        }
      : {},
    "&:hover": {
      color: "#2563EB",
      backgroundColor: "rgba(37,99,235,0.06)",
    },
  });

  // MOBILE ACTIVE MENU
  const mobileItemSx = (path) => ({
    borderRadius: 2,
    mx: 1,
    my: 0.4,
    color: isActive(path) ? "#2563EB" : "#334155",
    backgroundColor: isActive(path)
      ? "rgba(37,99,235,0.10)"
      : "transparent",
    "&:hover": {
      backgroundColor: "rgba(37,99,235,0.08)",
    },
  });

  const MobileMenuItem = ({ label, path }) => (
    <ListItemButton
      onClick={() => goToPage(path)}
      sx={mobileItemSx(path)}
    >
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontWeight: isActive(path) ? 700 : 500,
          fontSize: 14,
        }}
      />

      {isActive(path) && (
        <CheckCircleRounded
          sx={{ color: "#2563EB", fontSize: 20 }}
        />
      )}
    </ListItemButton>
  );

  return (
    <>
      {/* HEADER */}
      <AppBar
        position="fixed"
        elevation={0}
        className="public-header"
      >
        <Container maxWidth="xl">
          <Toolbar className="public-toolbar">

            {/* LOGO */}
            <Box
              className="public-logo"
              onClick={() => goToPage("/")}
              sx={{ cursor: "pointer" }}
            >
              <Box className="public-logo-icon">
                <CloudQueue />
              </Box>

              <Typography className="public-logo-text">
                Cloud<span>Bill</span>
              </Typography>
            </Box>

            {/* DESKTOP NAVIGATION */}
            <Stack
              direction="row"
              spacing={0.5}
              className="public-navigation"
            >
              <Button
                onClick={() => goToPage("/")}
                sx={navButtonSx("/")}
              >
                Home
              </Button>

              <Button
                onClick={goToFeatures}
                sx={{
                  color: currentPath === "/features" ||
                    (currentPath === "/" &&
                      window.location.hash === "#features")
                    ? "#2563EB"
                    : "inherit",
                  fontWeight: 500,
                  "&:hover": {
                    color: "#2563EB",
                  },
                }}
              >
                Features
              </Button>

              <Button
                onClick={() => goToPage("/pricing")}
                sx={navButtonSx("/pricing")}
              >
                Pricing
              </Button>

              <Button
                onClick={() => goToPage("/about")}
                sx={navButtonSx("/about")}
              >
                About Us
              </Button>

              <Button
                onClick={() => goToPage("/contact")}
                sx={navButtonSx("/contact")}
              >
                Contact
              </Button>

              <Button
                onClick={() => goToPage("/faq")}
                sx={navButtonSx("/faq")}
              >
                FAQ
              </Button>
            </Stack>

            {/* RIGHT ACTIONS */}
            <Stack
              direction="row"
              spacing={1}
              className="public-header-actions"
            >
              <Button
                className="public-login"
                onClick={() => goToPage("/login")}
                sx={navButtonSx("/login")}
              >
                Login
              </Button>

              <Button
                className="public-register"
                variant="outlined"
                onClick={() => goToPage("/register")}
                sx={{
                  borderColor: isActive("/register")
                    ? "#2563EB"
                    : undefined,
                  color: isActive("/register")
                    ? "#2563EB"
                    : undefined,
                }}
              >
                Register
                {isActive("/register") && (
                  <CheckCircleRounded sx={{ ml: 0.5, fontSize: 17 }} />
                )}
              </Button>

              <Button
                variant="contained"
                className="public-trial"
                onClick={() => goToPage("/register")}
              >
                Free Trial
              </Button>
            </Stack>

            {/* MOBILE MENU BUTTON */}
            <IconButton
              className="mobile-menu"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>

          </Toolbar>
        </Container>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobile}
        className="mobile-drawer"
      >
        <Box className="mobile-drawer-content">

          {/* MOBILE HEADER */}
          <Box className="mobile-drawer-header">
            <Box
              className="mobile-logo"
              onClick={() => goToPage("/")}
              sx={{ cursor: "pointer" }}
            >
              <Box className="mobile-logo-icon">
                <CloudQueue />
              </Box>

              <Typography className="mobile-logo-text">
                Cloud<span>Bill</span>
              </Typography>
            </Box>

            <IconButton onClick={closeMobile}>
              <Close />
            </IconButton>
          </Box>

          <Divider />

          {/* MOBILE NAVIGATION */}
          <List className="mobile-navigation">
            <MobileMenuItem label="Home" path="/" />

            <ListItemButton
              onClick={goToFeatures}
              sx={{
                mx: 1,
                my: 0.4,
                borderRadius: 2,
                color: "#334155",
              }}
            >
              <ListItemText primary="Features" />
            </ListItemButton>

            <MobileMenuItem label="Pricing" path="/pricing" />
            <MobileMenuItem label="About Us" path="/about" />
            <MobileMenuItem label="Contact" path="/contact" />
            <MobileMenuItem label="FAQ" path="/faq" />
          </List>

          <Divider />

          {/* MOBILE ACTIONS */}
          <Box className="mobile-actions">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => goToPage("/login")}
              color={isActive("/login") ? "primary" : "inherit"}
            >
              Login
              {isActive("/login") && (
                <CheckCircleRounded sx={{ ml: 1, fontSize: 18 }} />
              )}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => goToPage("/register")}
              color={isActive("/register") ? "primary" : "inherit"}
            >
              Register
              {isActive("/register") && (
                <CheckCircleRounded sx={{ ml: 1, fontSize: 18 }} />
              )}
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={() => goToPage("/register")}
            >
              Free Trial
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default PublicHeader;
