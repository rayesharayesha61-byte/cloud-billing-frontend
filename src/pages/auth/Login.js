import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  Link as MuiLink,
} from "@mui/material";

import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  LoginOutlined,
 
  SecurityOutlined,
  ReceiptLongOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };
const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  if (!form.email.trim()) {
    setError("Please enter your email address.");
    return;
  }

  if (!form.password) {
    setError("Please enter your password.");
    return;
  }

  // Development-only shortcut.
  // Production-ல் backend admin authentication பயன்படுத்தவும்.
  if (
    form.email.trim().toLowerCase() === "admin@gmail.com" &&
    form.password === "123456"
  ) {
    login({
      user: {
        id: "super-admin",
        email: "admin@gmail.com",
        role: "super_admin",
      },
      role: "super_admin",
      token: "development-admin-token",
    });

    navigate("/admin", { replace: true });
    return;
  }

  try {
    setLoading(true);

    const data = await loginUser({
      email: form.email.trim(),
      password: form.password,
    });

    login(data);

    // Backend response-ல் role இருந்தால் அதன்படி redirect செய்யவும்.
    const role = String(
      data?.user?.role ?? data?.role ?? ""
    ).toLowerCase();

    if (role === "super_admin" || role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Invalid email or password. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   setError("");

  //   if (!form.email.trim()) {
  //     setError("Please enter your email address.");
  //     return;
  //   }

  //   if (!form.password) {
  //     setError("Please enter your password.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const data = await loginUser({
  //       email: form.email.trim(),
  //       password: form.password,
  //     });

  //     login(data);

  //     navigate("/dashboard", {
  //       replace: true,
  //     });
  //   } catch (error) {
  //     setError(
  //       error.response?.data?.message ||
  //         "Invalid email or password. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 100%)",
      }}
    >
      {/* ================= LEFT BRAND PANEL ================= */}

      <Box
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },

          width: "48%",
          minHeight: "100vh",

          position: "relative",
          overflow: "hidden",

          background:
            "linear-gradient(145deg, #0F172A 0%, #172554 45%, #1D4ED8 100%)",

          color: "#FFFFFF",

          alignItems: "center",
          justifyContent: "center",

          px: {
            md: 6,
            lg: 9,
          },
        }}
      >
        {/* Background decoration */}

        <Box
          sx={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "rgba(59, 130, 246, 0.18)",
            top: -180,
            left: -180,
            filter: "blur(10px)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "rgba(99, 102, 241, 0.18)",
            bottom: -150,
            right: -120,
            filter: "blur(10px)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 520,
          }}
        >
          {/* Logo */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 6,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "rgba(255,255,255,0.12)",
                border:
                  "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <ReceiptLongOutlined
                sx={{
                  fontSize: 28,
                  color: "#FFFFFF",
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  letterSpacing: "-0.5px",
                }}
              >
                Cloud
                <Box
                  component="span"
                  sx={{
                    color: "#60A5FA",
                  }}
                >
                  Bill
                </Box>
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "#CBD5E1",
                }}
              >
                Smart Billing. Simple Business.
              </Typography>
            </Box>
          </Box>

          {/* Main heading */}

          <Typography
            sx={{
              fontSize: {
                md: 38,
                lg: 48,
              },
              lineHeight: 1.12,
              fontWeight: 800,
              letterSpacing: "-1.5px",
              mb: 2.5,
            }}
          >
            Manage your business
            <br />
            <Box
              component="span"
              sx={{
                color: "#60A5FA",
              }}
            >
              smarter.
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "#CBD5E1",
              fontSize: 16,
              lineHeight: 1.7,
              maxWidth: 470,
              mb: 4,
            }}
          >
            Create invoices, manage products,
            track customers and monitor your
            business from one powerful billing
            platform.
          </Typography>

          {/* Features */}

          <Stack spacing={2.2}>
            <FeatureItem
              icon={<ReceiptLongOutlined />}
              text="Create professional GST invoices"
            />

            <FeatureItem
              icon={<TrendingUpOutlined />}
              text="Track sales and business performance"
            />

            <FeatureItem
              icon={<SecurityOutlined />}
              text="Secure and reliable cloud billing"
            />
          </Stack>

          {/* Bottom trial card */}

          <Box
            sx={{
              mt: 6,
              p: 2.5,
              borderRadius: 3,
              background:
                "rgba(255,255,255,0.08)",
              border:
                "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {/* <CheckCircleOutline
                sx={{
                  color: "#60A5FA",
                  fontSize: 26,
                }}
              /> */}

              <Box>
                <Typography
                  fontWeight={700}
                  sx={{ color: "#FFFFFF" }}
                >
                  Start your free trial
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#CBD5E1",
                    mt: 0.3,
                  }}
                >
                  No complicated setup. Start
                  managing your business today.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ================= RIGHT LOGIN PANEL ================= */}

      <Box
        sx={{
          width: {
            xs: "100%",
            md: "52%",
          },

          minHeight: "100vh",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          px: {
            xs: 2,
            sm: 4,
            md: 5,
            lg: 8,
          },

          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 470,

            p: {
              xs: 3,
              sm: 4,
              md: 5,
            },

            borderRadius: 3,

            border:
              "1px solid #E2E8F0",

            backgroundColor: "#FFFFFF",

            boxShadow:
              "0 20px 60px rgba(15, 23, 42, 0.08)",
          }}
        >
          {/* Mobile logo */}

          <Box
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },

              alignItems: "center",
              justifyContent: "center",
              gap: 1,

              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 1.5,
                backgroundColor:
                  "primary.main",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                color: "#FFFFFF",
              }}
            >
              <ReceiptLongOutlined />
            </Box>

            <Typography
              variant="h5"
              fontWeight={800}
              color="text.primary"
            >
              Cloud
              <Box
                component="span"
                sx={{
                  color: "primary.main",
                }}
              >
                Bill
              </Box>
            </Typography>
          </Box>

          {/* Heading */}

          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,

                display: {
                  xs: "none",
                  sm: "flex",
                },

                alignItems: "center",
                justifyContent: "center",

                background:
                  "linear-gradient(135deg, #2563EB, #4F46E5)",

                color: "#FFFFFF",

                mb: 2.5,

                boxShadow:
                  "0 8px 20px rgba(37, 99, 235, 0.25)",
              }}
            >
              <LoginOutlined
                fontSize="medium"
              />
            </Box>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#0F172A",
                letterSpacing: "-0.8px",
              }}
            >
              Welcome back
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                fontSize: 15,
              }}
            >
              Sign in to continue to your
              CloudBill account.
            </Typography>
          </Box>

          {/* Error */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            {/* Email */}

            <Typography
              variant="body2"
              fontWeight={600}
              sx={{
                mb: 0.8,
                color: "#334155",
              }}
            >
              Email Address
            </Typography>

            <TextField
              fullWidth
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined
                      sx={{
                        color: "#64748B",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  backgroundColor: "#F8FAFC",

                  "& fieldset": {
                    borderColor: "#E2E8F0",
                  },

                  "&:hover fieldset": {
                    borderColor: "#94A3B8",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#2563EB",
                    borderWidth: 1.5,
                  },
                },
              }}
            />

            {/* Password */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.8,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  color: "#334155",
                }}
              >
                Password
              </Typography>

              <MuiLink
                component={Link}
                to="/forgot-password"
                underline="hover"
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#2563EB",
                }}
              >
                Forgot Password?
              </MuiLink>
            </Box>

            <TextField
              fullWidth
              name="password"
              placeholder="Enter your password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined
                      sx={{
                        color: "#64748B",
                      }}
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  backgroundColor: "#F8FAFC",

                  "& fieldset": {
                    borderColor: "#E2E8F0",
                  },

                  "&:hover fieldset": {
                    borderColor: "#94A3B8",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#2563EB",
                    borderWidth: 1.5,
                  },
                },
              }}
            />

            {/* Login Button */}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={
                !loading ? (
                  <LoginOutlined />
                ) : null
              }
              sx={{
                height: 52,
                borderRadius: 1.5,

                fontSize: 15.5,
                fontWeight: 700,

                background:
                  "linear-gradient(135deg, #2563EB, #4F46E5)",

                boxShadow:
                  "0 8px 20px rgba(37, 99, 235, 0.22)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1D4ED8, #4338CA)",

                  boxShadow:
                    "0 10px 25px rgba(37, 99, 235, 0.3)",
                },

                "&:disabled": {
                  background: "#94A3B8",
                  color: "#FFFFFF",
                },
              }}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </Button>
          </Box>

          {/* Divider */}

          <Divider
            sx={{
              my: 3,
              color: "#94A3B8",
              fontSize: 13,
            }}
          >
            Secure Login
          </Divider>

          {/* Security info */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "#64748B",
              mb: 3,
            }}
          >
            <SecurityOutlined
              sx={{ fontSize: 18 }}
            />

            <Typography
              variant="caption"
            >
              Your account information is
              securely protected.
            </Typography>
          </Box>

          {/* Register */}

          <Box
            sx={{
              textAlign: "center",
              pt: 2,
              borderTop:
                "1px solid #F1F5F9",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Don't have a CloudBill account?
            </Typography>

            <Button
              component={Link}
              to="/register"
              variant="text"
              sx={{
                mt: 0.5,
                fontWeight: 700,
                color: "#2563EB",
              }}
            >
              Create your account
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

/* ================= FEATURE ITEM ================= */

const FeatureItem = ({ icon, text }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.8,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background:
            "rgba(255,255,255,0.1)",

          color: "#93C5FD",
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          color: "#E2E8F0",
          fontSize: 14.5,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default Login;