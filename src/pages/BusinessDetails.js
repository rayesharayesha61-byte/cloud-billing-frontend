import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowForward,
  Business,
  CheckCircle,
  CloudUpload,
  Email,
  InfoOutlined,
  LocationOn,
  Person,
  Phone,
  ReceiptLong,
  Security,
  Storefront,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

const BusinessDetails = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [error, setError] = useState("");
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    mobile: "",
    email: "",
    address: "",
    gstNumber: "",
    panNumber: "",
    businessType: "",
    state: "",
    invoicePrefix: "INV",
  });

  // =========================
  // LOAD BUSINESS DETAILS
  // =========================
  useEffect(() => {
    const loadBusiness = async () => {
      try {
        setLoadingBusiness(true);

        const response = await API.get("/business");

        const business = response.data?.business;

        if (business) {
          setFormData({
            businessName: business.business_name || "",
            ownerName: business.owner_name || "",
            mobile: business.mobile || "",
            email: business.email || "",
            address: business.address || "",
            gstNumber: business.gst_number || "",
            panNumber: business.pan_number || "",
            businessType: business.business_type || "",
            state: business.state || "",
            invoicePrefix: business.invoice_prefix || "INV",
          });

          if (business.logo) {
            setPreview(business.logo);
          }
        }
      } catch (err) {
        console.error("LOAD BUSINESS ERROR:", err);

        if (err.response?.status !== 404) {
          setError(
            err.response?.data?.message ||
              "Unable to load business details."
          );
        }
      } finally {
        setLoadingBusiness(false);
      }
    };

    loadBusiness();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =========================
  // LOGO UPLOAD
  // =========================
  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Logo size must be less than 2MB.");
      return;
    }

    setLogo(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    setError("");
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const businessName = formData.businessName.trim();
    const ownerName = formData.ownerName.trim();
    const mobile = formData.mobile.trim();
    const email = formData.email.trim();
    const address = formData.address.trim();
    const gstNumber = formData.gstNumber.trim();
    const panNumber = formData.panNumber.trim();
    const businessType = formData.businessType.trim();
    const state = formData.state.trim();
    const invoicePrefix = formData.invoicePrefix.trim();

    if (!businessName) {
      setError("Business name is required.");
      return;
    }

    if (!ownerName) {
      setError("Owner name is required.");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!businessType) {
      setError("Please select your business type.");
      return;
    }

    if (!state) {
      setError("Please select your state.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/business", {
        businessName,
        ownerName,
        mobile,
        email,
        address,
        gstNumber,
        panNumber,
        businessType,
        state,
        invoicePrefix: invoicePrefix || "INV",
        logo: "",
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("SAVE BUSINESS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save business details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // COMMON TEXT FIELD STYLE
  // =========================
  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#F8FAFC",
      transition: "all 0.2s ease",

      "& fieldset": {
        borderColor: "#E2E8F0",
      },

      "&:hover fieldset": {
        borderColor: "#A5B4FC",
      },

      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#6366F1",
        borderWidth: "1.5px",
      },
    },

    "& .MuiInputLabel-root": {
      color: "#64748B",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#4F46E5",
    },

    "& .MuiInputBase-input": {
      fontSize: "14px",
    },
  };

  if (loadingBusiness) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #F8FAFC 100%)",
        }}
      >
        <LinearProgress />
      </Box>
    );
  }

  return (
   <Box
  sx={{
    minHeight: "100vh",
    width: "100%",
    background:
      "radial-gradient(circle at top left, rgba(99,102,241,0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(59,130,246,0.10), transparent 30%), #F8FAFC",
    display: "flex",
    alignItems: "stretch",
  }}
>
    <Box
  sx={{
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  }}
>
        {/* TOP BRANDING */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, #4F46E5, #2563EB)",
                boxShadow:
                  "0 8px 20px rgba(79,70,229,0.25)",
              }}
            >
              <Business />
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.1,
                }}
              >
                CloudBill
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#64748B",
                  mt: 0.3,
                }}
              >
                Smart Cloud Billing
              </Typography>
            </Box>
          </Stack>

          <Chip
            icon={<CheckCircle sx={{ fontSize: 17 }} />}
            label="Account Created"
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              borderRadius: "20px",
              backgroundColor: "#ECFDF5",
              color: "#047857",
              fontWeight: 700,
              fontSize: 12,
            }}
          />
        </Stack>

        {/* MAIN CARD */}
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: {
              xs: "18px",
              md: "26px",
            },
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 25px 70px rgba(15,23,42,0.08)",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Grid container>
            {/* ================================= */}
            {/* LEFT SIDE */}
            {/* ================================= */}
            <Grid
              size={{
                xs: 12,
                md: 4.2,
              }}
              sx={{
                background:
                  "linear-gradient(160deg, #111827 0%, #1E1B4B 45%, #312E81 100%)",
                color: "#FFFFFF",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative circles */}
              <Box
                sx={{
                  position: "absolute",
                  width: 250,
                  height: 250,
                  borderRadius: "50%",
                  background:
                    "rgba(99,102,241,0.18)",
                  top: -100,
                  right: -100,
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background:
                    "rgba(59,130,246,0.12)",
                  bottom: -80,
                  left: -80,
                }}
              />

              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  p: {
                    xs: 3,
                    sm: 4,
                    md: 4.5,
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Chip
                  label="STEP 02 OF 03"
                  sx={{
                    alignSelf: "flex-start",
                    color: "#C7D2FE",
                    backgroundColor:
                      "rgba(255,255,255,0.10)",
                    border:
                      "1px solid rgba(255,255,255,0.12)",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: 0.8,
                    mb: 3,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: {
                      xs: 27,
                      sm: 31,
                      md: 34,
                    },
                    fontWeight: 800,
                    lineHeight: 1.15,
                    mb: 1.5,
                  }}
                >
                  Set up your
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                      color: "#A5B4FC",
                    }}
                  >
                    business profile
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    color: "#CBD5E1",
                    fontSize: 14,
                    lineHeight: 1.7,
                    maxWidth: 380,
                  }}
                >
                  Add your business information once and
                  use it automatically across invoices,
                  reports and billing documents.
                </Typography>

                {/* STEPS */}
                <Box sx={{ mt: 4 }}>
                  <StepItem
                    number="01"
                    title="Create Account"
                    description="Your CloudBill account is ready"
                    completed
                  />

                  <StepItem
                    number="02"
                    title="Business Details"
                    description="Tell us about your business"
                    active
                  />

                  <StepItem
                    number="03"
                    title="Dashboard"
                    description="Start managing your billing"
                  />
                </Box>

                {/* FEATURES */}
                <Box
                  sx={{
                    mt: "auto",
                    pt: 4,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      mb: 1.5,
                    }}
                  >
                    Why CloudBill?
                  </Typography>

                  <Stack spacing={1.2}>
                    <MiniFeature
                      icon={<ReceiptLong />}
                      text="GST-ready invoices"
                    />

                    <MiniFeature
                      icon={<CloudUpload />}
                      text="Cloud-based billing"
                    />

                    <MiniFeature
                      icon={<Security />}
                      text="Secure business data"
                    />
                  </Stack>
                </Box>
              </Box>
            </Grid>

            {/* ================================= */}
            {/* RIGHT SIDE FORM */}
            {/* ================================= */}
            <Grid
              size={{
                xs: 12,
                md: 7.8,
              }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  p: {
                    xs: 2.5,
                    sm: 4,
                    md: 4.5,
                  },
                }}
              >
                {/* FORM HEADER */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: 22,
                        sm: 25,
                      },
                      fontWeight: 800,
                      color: "#0F172A",
                    }}
                  >
                    Business Details
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B",
                      fontSize: 13,
                      mt: 0.6,
                    }}
                  >
                    Complete your business profile to continue
                    to your CloudBill dashboard.
                  </Typography>
                </Box>

                {/* ERROR */}
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2.5,
                      borderRadius: "12px",
                      fontSize: 13,
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* ================================= */}
                {/* LOGO */}
                {/* ================================= */}
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: "16px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#F8FAFC",
                  }}
                >
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={2}
                    alignItems={{
                      xs: "flex-start",
                      sm: "center",
                    }}
                  >
                    <Avatar
                      src={preview}
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #EEF2FF, #DBEAFE)",
                        color: "#4F46E5",
                        border: "1px solid #C7D2FE",
                      }}
                    >
                      {!preview && <Storefront />}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#0F172A",
                          fontSize: 14,
                        }}
                      >
                        Business Logo
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#64748B",
                          mt: 0.4,
                          mb: 1.2,
                        }}
                      >
                        Upload your business logo. PNG, JPG or
                        WEBP up to 2MB.
                      </Typography>

                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        sx={{
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: 12,
                          borderColor: "#C7D2FE",
                          color: "#4F46E5",

                          "&:hover": {
                            borderColor: "#6366F1",
                            backgroundColor: "#EEF2FF",
                          },
                        }}
                      >
                        Choose Logo

                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                      </Button>
                    </Box>
                  </Stack>
                </Box>

                {/* BASIC INFORMATION */}
                <SectionHeader
                  icon={<Business />}
                  title="Basic Information"
                  description="Your business and owner details"
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Business Name"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Enter business name"
                      sx={fieldStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business
                              sx={{
                                color: "#94A3B8",
                                fontSize: 20,
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Owner Name"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Enter owner name"
                      sx={fieldStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person
                              sx={{
                                color: "#94A3B8",
                                fontSize: 20,
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Mobile Number"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      inputProps={{
                        maxLength: 10,
                        inputMode: "numeric",
                      }}
                      sx={fieldStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone
                              sx={{
                                color: "#94A3B8",
                                fontSize: 20,
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Business Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="business@example.com"
                      sx={fieldStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email
                              sx={{
                                color: "#94A3B8",
                                fontSize: 20,
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* BUSINESS CLASSIFICATION */}
                <SectionHeader
                  icon={<Storefront />}
                  title="Business Classification"
                  description="Choose the category that best describes your business"
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      select
                      required
                      label="Business Type"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      sx={fieldStyle}
                    >
                      <MenuItem value="">
                        Select business type
                      </MenuItem>

                      <MenuItem value="Retail">
                        Retail
                      </MenuItem>

                      <MenuItem value="Wholesale">
                        Wholesale
                      </MenuItem>

                      <MenuItem value="Manufacturing">
                        Manufacturing
                      </MenuItem>

                      <MenuItem value="Services">
                        Services
                      </MenuItem>

                      <MenuItem value="Restaurant">
                        Restaurant
                      </MenuItem>

                      <MenuItem value="Other">
                        Other
                      </MenuItem>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      select
                      required
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      sx={fieldStyle}
                    >
                      <MenuItem value="">
                        Select state
                      </MenuItem>

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

                      <MenuItem value="Maharashtra">
                        Maharashtra
                      </MenuItem>

                      <MenuItem value="Delhi">
                        Delhi
                      </MenuItem>

                      <MenuItem value="Other">
                        Other
                      </MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* TAX & BILLING */}
                <SectionHeader
                  icon={<ReceiptLong />}
                  title="Tax & Billing"
                  description="These details will appear on your invoices"
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="GST Number"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="Optional"
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="PAN Number"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="Optional"
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Invoice Prefix"
                      name="invoicePrefix"
                      value={formData.invoicePrefix}
                      onChange={handleChange}
                      placeholder="INV"
                      helperText="Example: INV-001"
                      sx={fieldStyle}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* ADDRESS */}
                <SectionHeader
                  icon={<LocationOn />}
                  title="Business Address"
                  description="Add your registered business location"
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete business address"
                  sx={fieldStyle}
                />

                {/* INFO */}
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: "12px",
                    backgroundColor: "#F5F3FF",
                    border: "1px solid #DDD6FE",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <InfoOutlined
                      sx={{
                        color: "#6366F1",
                        fontSize: 18,
                        mt: 0.1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 11.5,
                        color: "#4C1D95",
                        lineHeight: 1.6,
                      }}
                    >
                      Your business information will be used
                      to generate professional invoices and
                      billing documents.
                    </Typography>
                  </Stack>
                </Box>

                {/* BUTTON */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  endIcon={
                    !loading && (
                      <ArrowForward sx={{ fontSize: 20 }} />
                    )
                  }
                  sx={{
                    mt: 3,
                    minHeight: 52,
                    borderRadius: "13px",
                    textTransform: "none",
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#FFFFFF",

                    background:
                      "linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)",

                    boxShadow:
                      "0 10px 25px rgba(79,70,229,0.25)",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #4338CA 0%, #1D4ED8 100%)",
                      boxShadow:
                        "0 14px 30px rgba(79,70,229,0.32)",
                    },

                    "&:disabled": {
                      color: "#FFFFFF",
                      opacity: 0.7,
                    },
                  }}
                >
                  {loading
                    ? "Saving Business Details..."
                    : "Save & Continue to Dashboard"}
                </Button>

                {/* FOOTER */}
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={0.7}
                  sx={{ mt: 2 }}
                >
                  <Security
                    sx={{
                      fontSize: 15,
                      color: "#94A3B8",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "#94A3B8",
                    }}
                  >
                    Your information is securely stored with
                    CloudBill
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

// ==========================================
// SECTION HEADER
// ==========================================
const SectionHeader = ({
  icon,
  title,
  description,
}) => {
  return (
    <Stack
      direction="row"
      spacing={1.2}
      alignItems="flex-start"
      sx={{ mb: 2 }}
    >
      <Avatar
        sx={{
          width: 34,
          height: 34,
          borderRadius: "10px",
          backgroundColor: "#EEF2FF",
          color: "#4F46E5",
        }}
      >
        {React.cloneElement(icon, {
          sx: { fontSize: 18 },
        })}
      </Avatar>

      <Box>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 800,
            color: "#0F172A",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 11.5,
            color: "#64748B",
            mt: 0.3,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Stack>
  );
};

// ==========================================
// STEP ITEM
// ==========================================
const StepItem = ({
  number,
  title,
  description,
  completed,
  active,
}) => {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        position: "relative",
        mb: 2.5,
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          flexShrink: 0,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          backgroundColor: completed
            ? "#22C55E"
            : active
            ? "#6366F1"
            : "rgba(255,255,255,0.08)",

          border: active
            ? "2px solid rgba(255,255,255,0.25)"
            : "1px solid rgba(255,255,255,0.08)",

          color: "#FFFFFF",
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        {completed ? (
          <CheckCircle sx={{ fontSize: 18 }} />
        ) : (
          number
        )}
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: active || completed
              ? "#FFFFFF"
              : "#94A3B8",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 10.5,
            color: "#94A3B8",
            mt: 0.2,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Stack>
  );
};

// ==========================================
// MINI FEATURE
// ==========================================
const MiniFeature = ({ icon, text }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        p: 1,
        borderRadius: "10px",
        backgroundColor: "rgba(255,255,255,0.05)",
        border:
          "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            "rgba(129,140,248,0.15)",
          color: "#A5B4FC",
        }}
      >
        {React.cloneElement(icon, {
          sx: { fontSize: 16 },
        })}
      </Box>

      <Typography
        sx={{
          fontSize: 11.5,
          color: "#CBD5E1",
          fontWeight: 600,
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
};

export default BusinessDetails;