
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";

import {
  Business,
  Save,
  Refresh,
} from "@mui/icons-material";

const API_URL =
  process.env.REACT_APP_API_URL || "https://cloud-billing-backend.onrender.com/api";

const initialForm = {
  business_name: "",
  owner_name: "",
  mobile: "",
  email: "",
  address: "",
  gst_number: "",
  pan_number: "",
  business_type: "",
  state: "",
  logo: "",
  invoice_prefix: "INV",
};

const businessTypes = [
  "Retail",
  "Wholesale",
  "Manufacturing",
  "Services",
  "Trading",
  "Other",
];

const states = [
  "Andhra Pradesh",
  "Karnataka",
  "Kerala",
  "Tamil Nadu",
  "Telangana",
  "Maharashtra",
  "Delhi",
  "Other",
];

export default function Settings() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [invoiceNextNumber, setInvoiceNextNumber] = useState(null);

 const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

const loadSettings = useCallback(async () => {
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const response = await axios.get(
      `${API_URL}/business-settings`,
      { headers: getHeaders() }
    );

    const business = response.data.business;

    setForm({
      business_name: business.business_name || "",
      owner_name: business.owner_name || "",
      mobile: business.mobile || "",
      email: business.email || "",
      address: business.address || "",
      gst_number: business.gst_number || "",
      pan_number: business.pan_number || "",
      business_type: business.business_type || "",
      state: business.state || "",
      logo: business.logo || "",
      invoice_prefix: business.invoice_prefix || "INV",
    });

    setInvoiceNextNumber(business.invoice_next_number ?? 1);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to load business settings."
    );
  } finally {
    setLoading(false);
  }
}, []);

 useEffect(() => {
  loadSettings();
}, [loadSettings]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(
        `${API_URL}/business-settings`,
        form,
        { headers: getHeaders() }
      );

      const business = response.data.business;

      setForm({
        business_name: business.business_name || "",
        owner_name: business.owner_name || "",
        mobile: business.mobile || "",
        email: business.email || "",
        address: business.address || "",
        gst_number: business.gst_number || "",
        pan_number: business.pan_number || "",
        business_type: business.business_type || "",
        state: business.state || "",
        logo: business.logo || "",
        invoice_prefix: business.invoice_prefix || "INV",
      });

      setInvoiceNextNumber(
        business.invoice_next_number ?? 1
      );

      setSuccess(
        response.data.message ||
        "Settings updated successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputFields = [
    {
      name: "business_name",
      label: "Business Name",
      required: true,
    },
    {
      name: "owner_name",
      label: "Owner Name",
      required: true,
    },
    {
      name: "mobile",
      label: "Mobile Number",
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      required: true,
      type: "email",
    },
    {
      name: "gst_number",
      label: "GST Number",
    },
    {
      name: "pan_number",
      label: "PAN Number",
    },
    {
      name: "invoice_prefix",
      label: "Invoice Prefix",
      required: true,
    },
    {
      name: "logo",
      label: "Business Logo Path / URL",
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Page header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            color="#172554"
          >
            Business Settings
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your business information and invoice details.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadSettings}
          disabled={saving}
          sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}
        >
          Reload
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 2.5 }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: "#e0e7ff",
                color: "#3730a3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Business />
            </Box>

            <Box>
              <Typography fontWeight={700} variant="h6">
                Business Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update the details stored in your business profile.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSave}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2.5,
              }}
            >
              {inputFields.map((field) => (
                <TextField
                  key={field.name}
                  fullWidth
                  name={field.name}
                  label={field.label}
                  type={field.type || "text"}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={Boolean(field.required)}
                  inputProps={
                    field.name === "invoice_prefix"
                      ? { maxLength: 20 }
                      : {}
                  }
                />
              ))}

              <TextField
                select
                fullWidth
                name="business_type"
                label="Business Type"
                value={form.business_type}
                onChange={handleChange}
              >
                {businessTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                name="state"
                label="State"
                value={form.state}
                onChange={handleChange}
              >
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                multiline
                minRows={3}
                name="address"
                label="Business Address"
                value={form.address}
                onChange={handleChange}
                sx={{ gridColumn: { sm: "1 / -1" } }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Next invoice number
                </Typography>
                <Typography fontWeight={700}>
                  {invoiceNextNumber == null
                    ? "—"
                    : `${form.invoice_prefix}-${String(
                        invoiceNextNumber
                      ).padStart(4, "0")}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Display only. This value is not changed here.
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={
                  saving ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <Save />
                  )
                }
                disabled={saving}
                sx={{
                  minWidth: 180,
                  py: 1.3,
                  fontWeight: 700,
                  backgroundColor: "#3730a3",
                  "&:hover": {
                    backgroundColor: "#312e81",
                  },
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
