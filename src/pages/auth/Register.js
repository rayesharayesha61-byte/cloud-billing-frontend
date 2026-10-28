import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Business,
  Person,
  Phone,
  Email,
  Lock,
  LocationOn,
  ReceiptLong,
  ArrowForward,
  ArrowBack,
  CheckCircle,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const steps = ["Business Details", "Account Details"];

function Register() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    gstNumber: "",
    panNumber: "",
    businessType: "",
    state: "",
    invoicePrefix: "INV",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const validateStep = () => {
    setError("");

    if (activeStep === 0) {
      if (!formData.businessName.trim()) {
        setError("Please enter your business name.");
        return false;
      }

      if (!formData.ownerName.trim()) {
        setError("Please enter the owner name.");
        return false;
      }

      if (!/^[0-9]{10}$/.test(formData.mobile)) {
        setError("Please enter a valid 10-digit mobile number.");
        return false;
      }

      if (!formData.businessType) {
        setError("Please select your business type.");
        return false;
      }

      if (!formData.state) {
        setError("Please select your state.");
        return false;
      }

      return true;
    }

    if (activeStep === 1) {
      if (!formData.email.trim()) {
        setError("Please enter your email address.");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(formData.email.trim())) {
        setError("Please enter a valid email address.");
        return false;
      }

      if (!formData.password) {
        setError("Please enter your password.");
        return false;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return false;
      }

      if (!formData.confirmPassword) {
        setError("Please confirm your password.");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }

      if (!agreed) {
        setError("Please accept the Terms & Conditions.");
        return false;
      }

      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const registerData = {
        name: formData.ownerName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

const response = await API.post(
  "/auth/register",
  registerData
);

// Save JWT token
localStorage.setItem("token", response.data.token);

setSuccess(
  response.data.message ||
    "Registration successful!"
);

setTimeout(() => {
  navigate("/business-details");
}, 1800);

setSuccess(
  response.data.message ||
    "Registration successful!"
);

setTimeout(() => {
  navigate("/login");
}, 1800);

setSuccess(
  response.data.message ||
    "Registration successful!"
);

setTimeout(() => {
  navigate("/business-details");
}, 1800);

      setSuccess(
        response.data.message ||
          "Registration successful!"
      );

      setTimeout(() => {
        navigate("/business-details");
      }, 1800);
    } catch (err) {
      console.error("Registration Error:", err);

      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
  sx={{
    width: "100%",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #F8FAFC 100%)",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    p: 0,
    m: 0,
  }}
>
      <Paper
  elevation={0}
  sx={{
    width: "100%",
    minHeight: "100vh",
    borderRadius: 0,
    overflow: "hidden",
    border: "none",
    background: "#FFFFFF",
    boxShadow: "none",
  }}
>
        <Grid container>
          {/* ================= LEFT BRAND ================= */}

          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              background:
                "linear-gradient(160deg, #0F172A 0%, #1E1B4B 55%, #4338CA 100%)",
              color: "#FFFFFF",
              p: { xs: 4, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: { md: 650 },
            }}
          >
            <Box>
              {/* LOGO */}

              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  background: "#EEF2FF",
                  color: "#4F46E5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  boxShadow:
                    "0 10px 30px rgba(79,70,229,0.25)",
                }}
              >
                <ReceiptLong sx={{ fontSize: 28 }} />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  mb: 1,
                }}
              >
                CloudBill
              </Typography>

              <Typography
                sx={{
                  color: "#CBD5E1",
                  lineHeight: 1.7,
                  fontSize: 14,
                  mb: 5,
                }}
              >
                Simple, powerful and professional
                billing software for modern businesses.
              </Typography>

              {/* FEATURES */}

              {[
                "Create professional invoices",
                "Manage products & customers",
                "Track sales and payments",
                "Access your business anywhere",
              ].map((item) => (
                <Box
                  key={item}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <CheckCircle
                    sx={{
                      color: "#818CF8",
                      fontSize: 20,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#E2E8F0",
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* TRIAL INFO */}

            <Box sx={{ mt: 5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#A5B4FC",
                  fontWeight: 600,
                }}
              >
                START YOUR FREE TRIAL TODAY
              </Typography>

              <Typography
                fontWeight={700}
                sx={{
                  mt: 0.5,
                  color: "#FFFFFF",
                }}
              >
                No software installation required.
              </Typography>
            </Box>
          </Grid>

          {/* ================= RIGHT FORM ================= */}

          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{
              p: {
                xs: 3,
                sm: 5,
                md: 6,
              },
            }}
          >
            {/* HEADER */}

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#0F172A",
                  fontSize: {
                    xs: "1.7rem",
                    sm: "2rem",
                  },
                  letterSpacing: "-0.5px",
                }}
              >
                Create your account
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "#64748B",
                  fontSize: 15,
                }}
              >
                Set up your business and start billing
                in minutes.
              </Typography>
            </Box>

            {/* STEPPER */}

       <Stepper
  activeStep={activeStep}
  alternativeLabel
  sx={{
    mb: 4,

    "& .MuiStepLabel-label": {
      color: "#94A3B8",
      fontWeight: 500,
    },

    "& .MuiStepLabel-label.Mui-active": {
      color: "#4F46E5",
      fontWeight: 700,
    },

    "& .MuiStepLabel-label.Mui-completed": {
      color: "#4F46E5",
      fontWeight: 600,
    },

    "& .MuiStepIcon-root": {
      color: "#CBD5E1",
    },

    "& .MuiStepIcon-root.Mui-active": {
      color: "#4F46E5",
    },

    "& .MuiStepIcon-root.Mui-completed": {
      color: "#4F46E5",
    },

    "& .MuiStepConnector-line": {
      borderColor: "#E0E7FF",
    },
  }}
>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* ERROR */}

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

            {/* SUCCESS */}

            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {success}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              {/* ================= STEP 1 ================= */}

              {activeStep === 0 && (
                <Grid container spacing={2.2}>

                  {/* BUSINESS NAME */}

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Business Name"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Enter your business name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business
                              sx={{ color: "#4F46E5" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* OWNER */}

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Owner Name"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person
                              sx={{ color: "#4F46E5" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* MOBILE */}

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Mobile Number"
                      name="mobile"
                      value={formData.mobile}
                      onChange={(e) => {
                        const value =
                          e.target.value.replace(/\D/g, "");

                        if (value.length <= 10) {
                          setFormData((prev) => ({
                            ...prev,
                            mobile: value,
                          }));
                        }

                        setError("");
                      }}
                      placeholder="10-digit mobile number"
                      inputProps={{
                        maxLength: 10,
                        inputMode: "numeric",
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone
                              sx={{ color: "#4F46E5" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* BUSINESS TYPE */}

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      required
                      select
                      label="Business Type"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                    >
                      <MenuItem value="Retail">
                        Retail
                      </MenuItem>

                      <MenuItem value="Wholesale">
                        Wholesale
                      </MenuItem>

                      <MenuItem value="Restaurant">
                        Restaurant
                      </MenuItem>

                      <MenuItem value="Services">
                        Services
                      </MenuItem>

                      <MenuItem value="Manufacturing">
                        Manufacturing
                      </MenuItem>

                      <MenuItem value="Other">
                        Other
                      </MenuItem>
                    </TextField>
                  </Grid>

                  {/* STATE */}

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      required
                      select
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn
                              sx={{ color: "#4F46E5" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <MenuItem value="Tamil Nadu">
                        Tamil Nadu
                      </MenuItem>

                      <MenuItem value="Kerala">
                        Kerala
                      </MenuItem>

                      <MenuItem value="Karnataka">
                        Karnataka
                      </MenuItem>

                      <MenuItem value="Andhra Pradesh">
                        Andhra Pradesh
                      </MenuItem>

                      <MenuItem value="Telangana">
                        Telangana
                      </MenuItem>

                      <MenuItem value="Other">
                        Other
                      </MenuItem>
                    </TextField>
                  </Grid>

                  {/* ADDRESS */}

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Business Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      placeholder="Enter business address"
                    />
                  </Grid>

                  {/* GST */}

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="GST Number"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  </Grid>

                  {/* PAN */}

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="PAN Number"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  </Grid>

                  {/* INVOICE PREFIX */}

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Invoice Prefix"
                      name="invoicePrefix"
                      value={formData.invoicePrefix}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ReceiptLong
                              sx={{ color: "#4F46E5" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {/* ================= STEP 2 ================= */}

              {activeStep === 1 && (
                <Grid container spacing={2.2}>

                  {/* EMAIL */}

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email
                              sx={{ color: "#4F46E5" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* PASSWORD */}

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock
                              sx={{ color: "#4F46E5" }}
                            />
                          </InputAdornment>
                        ),

                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              onClick={() =>
                                setShowPassword(
                                  (prev) => !prev
                                )
                              }
                              edge="end"
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
                    />
                  </Grid>

                  {/* CONFIRM PASSWORD */}

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Confirm Password"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock
                              sx={{ color: "#4F46E5" }}
                            />
                          </InputAdornment>
                        ),

                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(
                                  (prev) => !prev
                                )
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* TERMS */}

                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={agreed}
                          onChange={(e) => {
                            setAgreed(
                              e.target.checked
                            );
                            setError("");
                          }}
                          sx={{
                            color: "#CBD5E1",

                            "&.Mui-checked": {
                              color: "#4F46E5",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          color="#64748B"
                        >
                          I agree to the{" "}
                          <Link
                            href="#"
                            underline="hover"
                            sx={{
                              color: "#4F46E5",
                              fontWeight: 600,
                            }}
                          >
                            Terms & Conditions
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="#"
                            underline="hover"
                            sx={{
                              color: "#4F46E5",
                              fontWeight: 600,
                            }}
                          >
                            Privacy Policy
                          </Link>
                        </Typography>
                      }
                    />
                  </Grid>

                  {/* TRIAL CARD */}

                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2.2,
                        borderRadius: 2,
                        background: "#EEF2FF",
                        border:
                          "1px solid #E0E7FF",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CheckCircle
                          sx={{
                            color: "#4F46E5",
                            fontSize: 22,
                          }}
                        />

                        <Typography
                          fontWeight={700}
                          color="#4338CA"
                        >
                          Free Trial Included
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="#475569"
                        sx={{
                          mt: 0.5,
                          lineHeight: 1.6,
                        }}
                      >
                        Start using CloudBill with
                        no payment required during
                        your trial period.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {/* BUTTON SECTION */}

              <Divider
                sx={{
                  my: 4,
                  borderColor: "#E2E8F0",
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {/* LEFT */}

                {activeStep > 0 ? (
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{
                      borderColor: "#E0E7FF",
                      color: "#475569",
                      px: 3,
                      py: 1.1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,

                      "&:hover": {
                        borderColor: "#C7D2FE",
                        background: "#F8FAFC",
                      },
                    }}
                  >
                    Back
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="text"
                    onClick={() =>
                      navigate("/business-details")
                    }
                    sx={{
                      color: "#64748B",
                      textTransform: "none",
                      fontWeight: 600,

                      "&:hover": {
                        color: "#4F46E5",
                        background: "#EEF2FF",
                      },
                    }}
                  >
                    Already have an account?
                  </Button>
                )}

                {/* RIGHT */}

                {activeStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={handleNext}
                    sx={{
                      background: "#4F46E5",
                      px: 4,
                      py: 1.3,
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow:
                        "0 8px 20px rgba(79,70,229,0.25)",

                      "&:hover": {
                        background: "#4338CA",
                        boxShadow:
                          "0 10px 24px rgba(79,70,229,0.30)",
                      },
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={
                      !loading ? (
                        <CheckCircle />
                      ) : null
                    }
                    sx={{
                      background: "#4F46E5",
                      px: 4,
                      py: 1.3,
                      borderRadius: 2,
                      fontWeight: 700,
                      minWidth: 170,
                      textTransform: "none",
                      boxShadow:
                        "0 8px 20px rgba(79,70,229,0.25)",

                      "&:hover": {
                        background: "#4338CA",
                        boxShadow:
                          "0 10px 24px rgba(79,70,229,0.30)",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: "#FFFFFF",
                        }}
                      />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Register;