
// import React, { useCallback, useEffect, useState } from "react";

// // Change this import to the same API instance used in Products.jsx
// import API from "../../services/api";

// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// import {
//   Alert,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   FormControl,
//   Grid,
//   MenuItem,
//   Paper,
//   Select,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
// } from "@mui/material";

// const money = (value) =>
//   Number(value || 0).toLocaleString("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 2,
//   });

// const today = () => {
//   const d = new Date();
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// };

// const monthStart = () => `${today().slice(0, 7)}-01`;

// const reportOptions = [
//   { value: "sales", label: "Sales Report" },
//   { value: "gst", label: "GST Report" },
//   { value: "customers", label: "Customer Report" },
//   { value: "products", label: "Product & Stock Report" },
// ];

// const columns = {
//   sales: [
//     ["invoiceNumber", "Invoice No."],
//     ["invoiceDate", "Date"],
//     ["customerName", "Customer"],
//     ["grandTotal", "Total"],
//     ["receivedAmount", "Received"],
//     ["pendingAmount", "Pending"],
//     ["paymentStatus", "Status"],
//   ],
//   gst: [
//     ["invoiceNumber", "Invoice No."],
//     ["invoiceDate", "Date"],
//     ["customerName", "Customer"],
//     ["subtotal", "Subtotal"],
//     ["discountAmount", "Discount"],
//     ["gstAmount", "GST"],
//     ["grandTotal", "Total"],
//   ],
//   customers: [
//     ["customerName", "Customer"],
//     ["mobile", "Mobile"],
//     ["invoiceCount", "Invoices"],
//     ["totalSales", "Total Sales"],
//     ["gstAmount", "GST"],
//   ],
//   products: [
//     ["productName", "Product"],
//     ["sku", "SKU"],
//     ["soldQuantity", "Sold Qty"],
//     ["stockQuantity", "Current Stock"],
//     ["sellingPrice", "Selling Price"],
//     ["totalSales", "Sales Amount"],
//   ],
// };

// const moneyKeys = new Set([
//   "subtotal",
//   "discountAmount",
//   "gstAmount",
//   "grandTotal",
//   "receivedAmount",
//   "pendingAmount",
//   "totalSales",
//   "sellingPrice",
// ]);

// export default function Reports() {
//   const [reportType, setReportType] = useState("sales");
//   const [startDate, setStartDate] = useState(monthStart());
//   const [endDate, setEndDate] = useState(today());
//   const [summary, setSummary] = useState(null);
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const loadReports = useCallback(async () => {
//     if (startDate && endDate && startDate > endDate) {
//       setError("Start date cannot be after end date.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const params = {};
//       if (startDate) params.startDate = startDate;
//       if (endDate) params.endDate = endDate;

//       const [summaryResponse, reportResponse] = await Promise.all([
//         API.get("/reports/summary", { params }),
//         API.get(`/reports/${reportType}`, { params }),
//       ]);

//       setSummary(summaryResponse.data);

//       const reportData = reportResponse.data;
//       setRows(Array.isArray(reportData.data) ? reportData.data : []);
//     } catch (err) {
//       console.error("REPORT LOAD ERROR:", err);
//       setError(
//         err.response?.data?.message || "Unable to load reports. Check backend API."
//       );
//       setRows([]);
//       setSummary(null);
//     } finally {
//       setLoading(false);
//     }
//   }, [reportType, startDate, endDate]);

//   useEffect(() => {
//     loadReports();
//   }, [loadReports]);

//   const currentColumns = columns[reportType];

//   const exportRows = rows.map((row) => {
//     const result = {};
//     currentColumns.forEach(([key, label]) => {
//       result[label] = moneyKeys.has(key)
//         ? Number(row[key] || 0)
//         : row[key] ?? "";
//     });
//     return result;
//   });

//   const exportExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(exportRows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
//     XLSX.writeFile(workbook, `${reportType}-report.xlsx`);
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF({ orientation: "landscape" });

//     doc.setFontSize(16);
//     doc.text(
//       reportOptions.find((item) => item.value === reportType)?.label || "Report",
//       14,
//       15
//     );

//     doc.setFontSize(10);
//     doc.text(`Period: ${startDate || "All"} to ${endDate || "All"}`, 14, 22);

//     autoTable(doc, {
//       startY: 28,
//       head: [currentColumns.map(([, label]) => label)],
//       body: rows.map((row) =>
//         currentColumns.map(([key]) =>
//           moneyKeys.has(key)
//             ? money(row[key])
//             : String(row[key] ?? "")
//         )
//       ),
//       styles: { fontSize: 8 },
//       theme: "grid",
//     });

//     doc.save(`${reportType}-report.pdf`);
//   };

//   const summaryCards = [
//     ["Total Sales", money(summary?.totalSales)],
//     ["Invoices", summary?.invoiceCount ?? 0],
//     ["Amount Received", money(summary?.receivedAmount)],
//     ["Pending Amount", money(summary?.pendingAmount)],
//     ["GST Amount", money(summary?.gstAmount)],
//   ];

//   return (
//     <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f7f8fc", minHeight: "100%" }}>
//       <Typography variant="h4" fontWeight={700} mb={1}>
//         Reports
//       </Typography>

//       <Typography color="text.secondary" mb={3}>
//         View your business sales, GST, customers and stock reports.
//       </Typography>

//       <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={6} md={3}>
//             <Typography variant="body2" mb={1}>Report Type</Typography>
//             <FormControl fullWidth size="small">
//               <Select
//                 value={reportType}
//                 onChange={(e) => setReportType(e.target.value)}
//               >
//                 {reportOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <Typography variant="body2" mb={1}>From Date</Typography>
//             <TextField
//               type="date"
//               size="small"
//               fullWidth
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <Typography variant="body2" mb={1}>To Date</Typography>
//             <TextField
//               type="date"
//               size="small"
//               fullWidth
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               inputProps={{ min: startDate }}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <Stack direction="row" spacing={1} mt={{ xs: 0, md: 3 }}>
//               <Button
//                 variant="contained"
//                 onClick={loadReports}
//                 disabled={loading}
//                 fullWidth
//               >
//                 Filter
//               </Button>
//             </Stack>
//           </Grid>
//         </Grid>
//       </Paper>

//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       <Grid container spacing={2} mb={3}>
//         {summaryCards.map(([label, value]) => (
//           <Grid item xs={12} sm={6} md={4} lg={2.4} key={label}>
//             <Card sx={{ borderRadius: 3, height: "100%" }}>
//               <CardContent>
//                 <Typography variant="body2" color="text.secondary">
//                   {label}
//                 </Typography>
//                 <Typography variant="h6" fontWeight={700} mt={1}>
//                   {value}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Paper sx={{ p: 2, borderRadius: 3 }}>
//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           justifyContent="space-between"
//           alignItems={{ xs: "stretch", sm: "center" }}
//           gap={2}
//           mb={2}
//         >
//           <Typography variant="h6" fontWeight={700}>
//             {reportOptions.find((item) => item.value === reportType)?.label}
//           </Typography>

//           <Stack direction="row" spacing={1}>
//             <Button
//               variant="outlined"
//               onClick={exportPDF}
//               disabled={!rows.length || loading}
//             >
//               Export PDF
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={exportExcel}
//               disabled={!rows.length || loading}
//             >
//               Export Excel
//             </Button>
//           </Stack>
//         </Stack>

//         {loading ? (
//           <Box display="flex" justifyContent="center" p={5}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <TableContainer>
//             <Table size="small">
//               <TableHead>
//                 <TableRow sx={{ bgcolor: "#eef2ff" }}>
//                   {currentColumns.map(([, label]) => (
//                     <TableCell key={label}>
//                       <Typography fontWeight={700} variant="body2">
//                         {label}
//                       </Typography>
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {rows.map((row, index) => (
//                   <TableRow hover key={row.id ?? row.invoiceNumber ?? row.customerId ?? row.productId ?? index}>
//                     {currentColumns.map(([key]) => (
//                       <TableCell key={key}>
//                         {moneyKeys.has(key)
//                           ? money(row[key])
//                           : row[key] ?? "-"}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}

//                 {!rows.length && (
//                   <TableRow>
//                     <TableCell colSpan={currentColumns.length} align="center">
//                       No report data found for this date range.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>
//     </Box>
//   );
// }

import React, { useCallback, useEffect, useState } from "react";
import API from "../../services/api";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Divider,
} from "@mui/material";

import {
  AssessmentOutlined,
  TrendingUpRounded,
  ReceiptLongOutlined,
  AccountBalanceWalletOutlined,
  PendingActionsOutlined,
  PaymentsOutlined,
  PictureAsPdfOutlined,
  FileDownloadOutlined,
  FilterAltOutlined,
  RefreshRounded,
  Inventory2Outlined,
  PeopleAltOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material";

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const monthStart = () => `${today().slice(0, 7)}-01`;

const reportOptions = [
  { value: "sales", label: "Sales Report", icon: <TrendingUpRounded /> },
  { value: "gst", label: "GST Report", icon: <ReceiptLongOutlined /> },
  { value: "customers", label: "Customer Report", icon: <PeopleAltOutlined /> },
  { value: "products", label: "Product & Stock Report", icon: <Inventory2Outlined /> },
];

const columns = {
  sales: [
    ["invoiceNumber", "Invoice No."],
    ["invoiceDate", "Date"],
    ["customerName", "Customer"],
    ["grandTotal", "Total"],
    ["receivedAmount", "Received"],
    ["pendingAmount", "Pending"],
    ["paymentStatus", "Status"],
  ],
  gst: [
    ["invoiceNumber", "Invoice No."],
    ["invoiceDate", "Date"],
    ["customerName", "Customer"],
    ["subtotal", "Subtotal"],
    ["discountAmount", "Discount"],
    ["gstAmount", "GST"],
    ["grandTotal", "Total"],
  ],
  customers: [
    ["customerName", "Customer"],
    ["mobile", "Mobile"],
    ["invoiceCount", "Invoices"],
    ["totalSales", "Total Sales"],
    ["gstAmount", "GST"],
  ],
  products: [
    ["productName", "Product"],
    ["sku", "SKU"],
    ["soldQuantity", "Sold Qty"],
    ["stockQuantity", "Current Stock"],
    ["sellingPrice", "Selling Price"],
    ["totalSales", "Sales Amount"],
  ],
};

const moneyKeys = new Set([
  "subtotal",
  "discountAmount",
  "gstAmount",
  "grandTotal",
  "receivedAmount",
  "pendingAmount",
  "totalSales",
  "sellingPrice",
]);

const summaryConfig = [
  {
    label: "Total Sales",
    key: "totalSales",
    icon: <TrendingUpRounded />,
    color: "#4f46e5",
    bg: "#eef2ff",
    format: "money",
  },
  {
    label: "Total Invoices",
    key: "invoiceCount",
    icon: <ReceiptLongOutlined />,
    color: "#0284c7",
    bg: "#e0f2fe",
  },
  {
    label: "Amount Received",
    key: "receivedAmount",
    icon: <PaymentsOutlined />,
    color: "#059669",
    bg: "#d1fae5",
    format: "money",
  },
  {
    label: "Pending Amount",
    key: "pendingAmount",
    icon: <PendingActionsOutlined />,
    color: "#d97706",
    bg: "#fef3c7",
    format: "money",
  },
  {
    label: "GST Amount",
    key: "gstAmount",
    icon: <AccountBalanceWalletOutlined />,
    color: "#7c3aed",
    bg: "#ede9fe",
    format: "money",
  },
];

export default function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState(monthStart());
  const [endDate, setEndDate] = useState(today());
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    if (startDate && endDate && startDate > endDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = {};

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [summaryResponse, reportResponse] = await Promise.all([
        API.get("/reports/summary", { params }),
        API.get(`/reports/${reportType}`, { params }),
      ]);

      setSummary(summaryResponse.data);

      const reportData = reportResponse.data;
      setRows(Array.isArray(reportData.data) ? reportData.data : []);
    } catch (err) {
      console.error("REPORT LOAD ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load reports. Please check the backend API."
      );

      setRows([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [reportType, startDate, endDate]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const currentColumns = columns[reportType];

  const exportRows = rows.map((row) => {
    const result = {};

    currentColumns.forEach(([key, label]) => {
      result[label] = moneyKeys.has(key)
        ? Number(row[key] || 0)
        : row[key] ?? "";
    });

    return result;
  });

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, `${reportType}-report.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);

    doc.text(
      reportOptions.find((item) => item.value === reportType)?.label ||
        "Report",
      14,
      15
    );

    doc.setFontSize(10);
    doc.text(`Period: ${startDate || "All"} to ${endDate || "All"}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [currentColumns.map(([, label]) => label)],
      body: rows.map((row) =>
        currentColumns.map(([key]) =>
          moneyKeys.has(key) ? money(row[key]) : String(row[key] ?? "")
        )
      ),
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [49, 46, 129],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 255],
      },
      theme: "grid",
    });

    doc.save(`${reportType}-report.pdf`);
  };

  const resetFilters = () => {
    setStartDate(monthStart());
    setEndDate(today());
  };

  const activeReport =
    reportOptions.find((item) => item.value === reportType)?.label || "Report";

  return (
    <Box
      sx={{
        minHeight: "100%",
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "#f5f7fc",
        backgroundImage:
          "radial-gradient(circle at 100% 0%, rgba(99,102,241,0.07), transparent 30%)",
      }}
    >
      {/* PAGE HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={3}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.2} mb={0.8}>
            <Box
              sx={{
                width: 46,
                height: 46,
                display: "grid",
                placeItems: "center",
                borderRadius: "14px",
                color: "#fff",
                background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                boxShadow: "0 6px 16px rgba(79,70,229,0.22)",
              }}
            >
              <AssessmentOutlined sx={{ fontSize: 27 }} />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#172033",
                letterSpacing: "-1px",
                fontSize: { xs: "1.7rem", md: "2.1rem" },
              }}
            >
              Reports & Analytics
            </Typography>
          </Stack>

          <Typography color="text.secondary" fontSize={14}>
            Track sales performance, GST, customers and inventory in one place.
          </Typography>
        </Box>

        <Chip
          icon={<CalendarMonthOutlined />}
          label={`${startDate}  —  ${endDate}`}
          sx={{
            bgcolor: "#fff",
            border: "1px solid #e2e8f0",
            color: "#475569",
            fontWeight: 600,
            borderRadius: "10px",
            height: 38,
            maxWidth: "100%",
          }}
        />
      </Stack>

      {/* SUMMARY CARDS */}
      <Grid container spacing={2} mb={3}>
        {summaryConfig.map((item) => (
          <Grid item xs={12} sm={6} lg={2.4} key={item.key}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: "16px",
                border: "1px solid #e8ebf3",
                bgcolor: "#fff",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 28px rgba(15,23,42,0.07)",
                },
              }}
            >
              <CardContent sx={{ p: 2.3, "&:last-child": { pb: 2.3 } }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", fontWeight: 600 }}
                  >
                    {item.label}
                  </Typography>

                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "12px",
                      color: item.color,
                      bgcolor: item.bg,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                </Stack>

                <Typography
                  sx={{
                    fontSize: { xs: "1.25rem", md: "1.45rem" },
                    fontWeight: 800,
                    color: "#172033",
                    letterSpacing: "-0.5px",
                    overflowWrap: "anywhere",
                  }}
                >
                  {item.format === "money"
                    ? money(summary?.[item.key])
                    : Number(summary?.[item.key] || 0).toLocaleString("en-IN")}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", display: "block", mt: 0.8 }}
                >
                  Selected date range
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* FILTER SECTION */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e5e9f2",
          borderRadius: "16px",
          overflow: "hidden",
          mb: 3,
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid #edf0f6" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FilterAltOutlined sx={{ color: "#4f46e5" }} />
            <Typography fontWeight={750} color="#1e293b">
              Filter Reports
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="#475569"
                mb={1}
              >
                Report Type
              </Typography>

              <FormControl fullWidth size="small">
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  sx={{
                    borderRadius: "10px",
                    bgcolor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#dfe4ee",
                    },
                  }}
                >
                  {reportOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ display: "flex", color: "#6366f1" }}>
                          {option.icon}
                        </Box>
                        <span>{option.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="#475569"
                mb={1}
              >
                From Date
              </Typography>

              <TextField
                type="date"
                size="small"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                inputProps={{ max: endDate || undefined }}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="#475569"
                mb={1}
              >
                To Date
              </Typography>

              <TextField
                type="date"
                size="small"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                inputProps={{ min: startDate || undefined }}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<FilterAltOutlined />}
                  onClick={loadReports}
                  disabled={loading}
                  fullWidth
                  sx={{
                    minHeight: 40,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: "#4f46e5",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#4338ca",
                      boxShadow: "0 4px 12px rgba(79,70,229,0.2)",
                    },
                  }}
                >
                  Apply Filters
                </Button>

                <Button
                  variant="outlined"
                  onClick={resetFilters}
                  disabled={loading}
                  sx={{
                    minWidth: 44,
                    width: 44,
                    height: 40,
                    borderRadius: "10px",
                    borderColor: "#dfe4ee",
                    color: "#64748b",
                  }}
                  title="Reset dates"
                >
                  <RefreshRounded />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* ERROR MESSAGE */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: "12px",
            alignItems: "center",
          }}
        >
          {error}
        </Alert>
      )}

      {/* REPORT TABLE */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e5e9f2",
          borderRadius: "16px",
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={2}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#172033" }}
              >
                {activeReport}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {loading
                  ? "Fetching report data..."
                  : `${rows.length} record${rows.length === 1 ? "" : "s"} found`}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<PictureAsPdfOutlined />}
                onClick={exportPDF}
                disabled={!rows.length || loading}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#fecaca",
                  color: "#dc2626",
                  "&:hover": {
                    bgcolor: "#fef2f2",
                    borderColor: "#f87171",
                  },
                }}
              >
                Export PDF
              </Button>

              <Button
                variant="outlined"
                startIcon={<FileDownloadOutlined />}
                onClick={exportExcel}
                disabled={!rows.length || loading}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#a7f3d0",
                  color: "#047857",
                  "&:hover": {
                    bgcolor: "#ecfdf5",
                    borderColor: "#34d399",
                  },
                }}
              >
                Export Excel
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "#edf0f6" }} />

        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            p={7}
          >
            <CircularProgress
              size={36}
              thickness={4}
              sx={{ color: "#4f46e5" }}
            />
            <Typography variant="body2" color="text.secondary">
              Loading your reports...
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table
              size="medium"
              sx={{
                minWidth: 720,
                "& .MuiTableCell-root": {
                  borderColor: "#edf0f6",
                  px: 2.5,
                  py: 1.8,
                },
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#f8faff",
                    "& .MuiTableCell-root": {
                      color: "#475569",
                      fontSize: "0.77rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.35px",
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  {currentColumns.map(([, label]) => (
                    <TableCell key={label}>{label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    hover
                    key={
                      row.id ??
                      row.invoiceNumber ??
                      row.customerId ??
                      row.productId ??
                      index
                    }
                    sx={{
                      transition: "background-color 0.15s",
                      "&:hover": {
                        bgcolor: "#f8faff !important",
                      },
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    {currentColumns.map(([key]) => {
                      const value = row[key];

                      if (key === "paymentStatus") {
                        const status = String(value || "Unknown");
                        const normalized = status.toLowerCase();

                        const color =
                          normalized === "paid"
                            ? {
                                bg: "#d1fae5",
                                text: "#047857",
                              }
                            : normalized === "pending" ||
                                normalized === "unpaid"
                              ? {
                                  bg: "#fef3c7",
                                  text: "#b45309",
                                }
                              : normalized === "partial" ||
                                  normalized === "partially paid"
                                ? {
                                    bg: "#dbeafe",
                                    text: "#1d4ed8",
                                  }
                                : {
                                    bg: "#f1f5f9",
                                    text: "#475569",
                                  };

                        return (
                          <TableCell key={key}>
                            <Chip
                              size="small"
                              label={status}
                              sx={{
                                bgcolor: color.bg,
                                color: color.text,
                                fontWeight: 700,
                                fontSize: "0.72rem",
                                borderRadius: "7px",
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>
                        );
                      }

                      if (key === "invoiceNumber") {
                        return (
                          <TableCell key={key}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: "#4f46e5",
                                whiteSpace: "nowrap",
                                fontSize: "0.85rem",
                              }}
                            >
                              {value ?? "-"}
                            </Typography>
                          </TableCell>
                        );
                      }

                      if (moneyKeys.has(key)) {
                        return (
                          <TableCell key={key}>
                            <Typography
                              sx={{
                                fontWeight:
                                  key === "grandTotal" ||
                                  key === "totalSales"
                                    ? 700
                                    : 500,
                                color: "#1e293b",
                                whiteSpace: "nowrap",
                                fontSize: "0.85rem",
                              }}
                            >
                              {money(value)}
                            </Typography>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={key}>
                          <Typography
                            sx={{
                              color: "#334155",
                              fontSize: "0.85rem",
                              whiteSpace:
                                key === "customerName" ||
                                key === "productName"
                                  ? "normal"
                                  : "nowrap",
                            }}
                          >
                            {value ?? "-"}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}

                {!rows.length && (
                  <TableRow>
                    <TableCell
                      colSpan={currentColumns.length}
                      align="center"
                      sx={{ py: 8, borderBottom: 0 }}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={1.5}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "18px",
                            bgcolor: "#eef2ff",
                            color: "#6366f1",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <AssessmentOutlined sx={{ fontSize: 32 }} />
                        </Box>

                        <Typography
                          fontWeight={700}
                          color="#334155"
                        >
                          No report data found
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Try another date range or select a different report.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* TABLE FOOTER */}
        {!loading && rows.length > 0 && (
          <Box
            sx={{
              px: 2.5,
              py: 1.8,
              borderTop: "1px solid #edf0f6",
              bgcolor: "#fafbff",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Showing {rows.length} report record{rows.length === 1 ? "" : "s"}
            </Typography>
          </Box>
        )}
      </Paper>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "center",
          color: "#94a3b8",
          mt: 3,
        }}
      >
        CloudBill · Business Reports & Analytics
      </Typography>
    </Box>
  );
}
