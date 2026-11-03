

// import React, { useCallback, useEffect, useState } from "react";
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
//   Chip,
//   Divider,
// } from "@mui/material";

// import {
//   AssessmentOutlined,
//   TrendingUpRounded,
//   ReceiptLongOutlined,
//   AccountBalanceWalletOutlined,
//   PendingActionsOutlined,
//   PaymentsOutlined,
//   PictureAsPdfOutlined,
//   FileDownloadOutlined,
//   FilterAltOutlined,
//   RefreshRounded,
//   Inventory2Outlined,
//   PeopleAltOutlined,
//   CalendarMonthOutlined,
// } from "@mui/icons-material";

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
//   { value: "sales", label: "Sales Report", icon: <TrendingUpRounded /> },
//   { value: "gst", label: "GST Report", icon: <ReceiptLongOutlined /> },
//   { value: "customers", label: "Customer Report", icon: <PeopleAltOutlined /> },
//   { value: "products", label: "Product & Stock Report", icon: <Inventory2Outlined /> },
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

// const summaryConfig = [
//   {
//     label: "Total Sales",
//     key: "totalSales",
//     icon: <TrendingUpRounded />,
//     color: "#4f46e5",
//     bg: "#eef2ff",
//     format: "money",
//   },
//   {
//     label: "Total Invoices",
//     key: "invoiceCount",
//     icon: <ReceiptLongOutlined />,
//     color: "#0284c7",
//     bg: "#e0f2fe",
//   },
//   {
//     label: "Amount Received",
//     key: "receivedAmount",
//     icon: <PaymentsOutlined />,
//     color: "#059669",
//     bg: "#d1fae5",
//     format: "money",
//   },
//   {
//     label: "Pending Amount",
//     key: "pendingAmount",
//     icon: <PendingActionsOutlined />,
//     color: "#d97706",
//     bg: "#fef3c7",
//     format: "money",
//   },
//   {
//     label: "GST Amount",
//     key: "gstAmount",
//     icon: <AccountBalanceWalletOutlined />,
//     color: "#7c3aed",
//     bg: "#ede9fe",
//     format: "money",
//   },
// ];

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
//         err.response?.data?.message ||
//           "Unable to load reports. Please check the backend API."
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
//       reportOptions.find((item) => item.value === reportType)?.label ||
//         "Report",
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
//           moneyKeys.has(key) ? money(row[key]) : String(row[key] ?? "")
//         )
//       ),
//       styles: {
//         fontSize: 8,
//         cellPadding: 3,
//       },
//       headStyles: {
//         fillColor: [49, 46, 129],
//         textColor: 255,
//       },
//       alternateRowStyles: {
//         fillColor: [245, 247, 255],
//       },
//       theme: "grid",
//     });

//     doc.save(`${reportType}-report.pdf`);
//   };

//   const resetFilters = () => {
//     setStartDate(monthStart());
//     setEndDate(today());
//   };

//   const activeReport =
//     reportOptions.find((item) => item.value === reportType)?.label || "Report";

//   return (
//     <Box
//       sx={{
//         minHeight: "100%",
//         p: { xs: 2, sm: 3, md: 4 },
//         bgcolor: "#f5f7fc",
//         backgroundImage:
//           "radial-gradient(circle at 100% 0%, rgba(99,102,241,0.07), transparent 30%)",
//       }}
//     >
//       {/* PAGE HEADER */}
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         justifyContent="space-between"
//         alignItems={{ xs: "flex-start", sm: "center" }}
//         gap={2}
//         mb={3}
//       >
//         <Box>
//           <Stack direction="row" alignItems="center" spacing={1.2} mb={0.8}>
//             <Box
//               sx={{
//                 width: 46,
//                 height: 46,
//                 display: "grid",
//                 placeItems: "center",
//                 borderRadius: "14px",
//                 color: "#fff",
//                 background: "linear-gradient(135deg, #4f46e5, #6366f1)",
//                 boxShadow: "0 6px 16px rgba(79,70,229,0.22)",
//               }}
//             >
//               <AssessmentOutlined sx={{ fontSize: 27 }} />
//             </Box>

//             <Typography
//               variant="h4"
//               sx={{
//                 fontWeight: 800,
//                 color: "#172033",
//                 letterSpacing: "-1px",
//                 fontSize: { xs: "1.7rem", md: "2.1rem" },
//               }}
//             >
//               Reports & Analytics
//             </Typography>
//           </Stack>

//           <Typography color="text.secondary" fontSize={14}>
//             Track sales performance, GST, customers and inventory in one place.
//           </Typography>
//         </Box>

//         <Chip
//           icon={<CalendarMonthOutlined />}
//           label={`${startDate}  —  ${endDate}`}
//           sx={{
//             bgcolor: "#fff",
//             border: "1px solid #e2e8f0",
//             color: "#475569",
//             fontWeight: 600,
//             borderRadius: "10px",
//             height: 38,
//             maxWidth: "100%",
//           }}
//         />
//       </Stack>

//       {/* SUMMARY CARDS */}
//       <Grid container spacing={2} mb={3}>
//         {summaryConfig.map((item) => (
//           <Grid item xs={12} sm={6} lg={2.4} key={item.key}>
//             <Card
//               elevation={0}
//               sx={{
//                 height: "100%",
//                 borderRadius: "16px",
//                 border: "1px solid #e8ebf3",
//                 bgcolor: "#fff",
//                 transition: "transform 0.2s, box-shadow 0.2s",
//                 "&:hover": {
//                   transform: "translateY(-3px)",
//                   boxShadow: "0 10px 28px rgba(15,23,42,0.07)",
//                 },
//               }}
//             >
//               <CardContent sx={{ p: 2.3, "&:last-child": { pb: 2.3 } }}>
//                 <Stack
//                   direction="row"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   mb={2}
//                 >
//                   <Typography
//                     variant="body2"
//                     sx={{ color: "#64748b", fontWeight: 600 }}
//                   >
//                     {item.label}
//                   </Typography>

//                   <Box
//                     sx={{
//                       width: 42,
//                       height: 42,
//                       display: "grid",
//                       placeItems: "center",
//                       borderRadius: "12px",
//                       color: item.color,
//                       bgcolor: item.bg,
//                       flexShrink: 0,
//                     }}
//                   >
//                     {item.icon}
//                   </Box>
//                 </Stack>

//                 <Typography
//                   sx={{
//                     fontSize: { xs: "1.25rem", md: "1.45rem" },
//                     fontWeight: 800,
//                     color: "#172033",
//                     letterSpacing: "-0.5px",
//                     overflowWrap: "anywhere",
//                   }}
//                 >
//                   {item.format === "money"
//                     ? money(summary?.[item.key])
//                     : Number(summary?.[item.key] || 0).toLocaleString("en-IN")}
//                 </Typography>

//                 <Typography
//                   variant="caption"
//                   sx={{ color: "#94a3b8", display: "block", mt: 0.8 }}
//                 >
//                   Selected date range
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* FILTER SECTION */}
//       <Paper
//         elevation={0}
//         sx={{
//           border: "1px solid #e5e9f2",
//           borderRadius: "16px",
//           overflow: "hidden",
//           mb: 3,
//           bgcolor: "#fff",
//         }}
//       >
//         <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid #edf0f6" }}>
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <FilterAltOutlined sx={{ color: "#4f46e5" }} />
//             <Typography fontWeight={750} color="#1e293b">
//               Filter Reports
//             </Typography>
//           </Stack>
//         </Box>

//         <Box sx={{ p: { xs: 2, md: 2.5 } }}>
//           <Grid container spacing={2} alignItems="flex-end">
//             <Grid item xs={12} sm={6} md={3}>
//               <Typography
//                 variant="body2"
//                 fontWeight={600}
//                 color="#475569"
//                 mb={1}
//               >
//                 Report Type
//               </Typography>

//               <FormControl fullWidth size="small">
//                 <Select
//                   value={reportType}
//                   onChange={(e) => setReportType(e.target.value)}
//                   sx={{
//                     borderRadius: "10px",
//                     bgcolor: "#fff",
//                     "& .MuiOutlinedInput-notchedOutline": {
//                       borderColor: "#dfe4ee",
//                     },
//                   }}
//                 >
//                   {reportOptions.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       <Stack direction="row" alignItems="center" spacing={1}>
//                         <Box sx={{ display: "flex", color: "#6366f1" }}>
//                           {option.icon}
//                         </Box>
//                         <span>{option.label}</span>
//                       </Stack>
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Typography
//                 variant="body2"
//                 fontWeight={600}
//                 color="#475569"
//                 mb={1}
//               >
//                 From Date
//               </Typography>

//               <TextField
//                 type="date"
//                 size="small"
//                 fullWidth
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 inputProps={{ max: endDate || undefined }}
//                 InputLabelProps={{ shrink: true }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: "10px",
//                   },
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Typography
//                 variant="body2"
//                 fontWeight={600}
//                 color="#475569"
//                 mb={1}
//               >
//                 To Date
//               </Typography>

//               <TextField
//                 type="date"
//                 size="small"
//                 fullWidth
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 inputProps={{ min: startDate || undefined }}
//                 InputLabelProps={{ shrink: true }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: "10px",
//                   },
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Stack direction="row" spacing={1}>
//                 <Button
//                   variant="contained"
//                   startIcon={<FilterAltOutlined />}
//                   onClick={loadReports}
//                   disabled={loading}
//                   fullWidth
//                   sx={{
//                     minHeight: 40,
//                     borderRadius: "10px",
//                     textTransform: "none",
//                     fontWeight: 700,
//                     bgcolor: "#4f46e5",
//                     boxShadow: "none",
//                     "&:hover": {
//                       bgcolor: "#4338ca",
//                       boxShadow: "0 4px 12px rgba(79,70,229,0.2)",
//                     },
//                   }}
//                 >
//                   Apply Filters
//                 </Button>

//                 <Button
//                   variant="outlined"
//                   onClick={resetFilters}
//                   disabled={loading}
//                   sx={{
//                     minWidth: 44,
//                     width: 44,
//                     height: 40,
//                     borderRadius: "10px",
//                     borderColor: "#dfe4ee",
//                     color: "#64748b",
//                   }}
//                   title="Reset dates"
//                 >
//                   <RefreshRounded />
//                 </Button>
//               </Stack>
//             </Grid>
//           </Grid>
//         </Box>
//       </Paper>

//       {/* ERROR MESSAGE */}
//       {error && (
//         <Alert
//           severity="error"
//           sx={{
//             mb: 3,
//             borderRadius: "12px",
//             alignItems: "center",
//           }}
//         >
//           {error}
//         </Alert>
//       )}

//       {/* REPORT TABLE */}
//       <Paper
//         elevation={0}
//         sx={{
//           border: "1px solid #e5e9f2",
//           borderRadius: "16px",
//           overflow: "hidden",
//           bgcolor: "#fff",
//         }}
//       >
//         <Box sx={{ p: { xs: 2, md: 2.5 } }}>
//           <Stack
//             direction={{ xs: "column", sm: "row" }}
//             justifyContent="space-between"
//             alignItems={{ xs: "stretch", sm: "center" }}
//             gap={2}
//           >
//             <Box>
//               <Typography
//                 variant="h6"
//                 sx={{ fontWeight: 800, color: "#172033" }}
//               >
//                 {activeReport}
//               </Typography>

//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 sx={{ mt: 0.5 }}
//               >
//                 {loading
//                   ? "Fetching report data..."
//                   : `${rows.length} record${rows.length === 1 ? "" : "s"} found`}
//               </Typography>
//             </Box>

//             <Stack direction="row" spacing={1} flexWrap="wrap">
//               <Button
//                 variant="outlined"
//                 startIcon={<PictureAsPdfOutlined />}
//                 onClick={exportPDF}
//                 disabled={!rows.length || loading}
//                 sx={{
//                   borderRadius: "10px",
//                   textTransform: "none",
//                   fontWeight: 700,
//                   borderColor: "#fecaca",
//                   color: "#dc2626",
//                   "&:hover": {
//                     bgcolor: "#fef2f2",
//                     borderColor: "#f87171",
//                   },
//                 }}
//               >
//                 Export PDF
//               </Button>

//               <Button
//                 variant="outlined"
//                 startIcon={<FileDownloadOutlined />}
//                 onClick={exportExcel}
//                 disabled={!rows.length || loading}
//                 sx={{
//                   borderRadius: "10px",
//                   textTransform: "none",
//                   fontWeight: 700,
//                   borderColor: "#a7f3d0",
//                   color: "#047857",
//                   "&:hover": {
//                     bgcolor: "#ecfdf5",
//                     borderColor: "#34d399",
//                   },
//                 }}
//               >
//                 Export Excel
//               </Button>
//             </Stack>
//           </Stack>
//         </Box>

//         <Divider sx={{ borderColor: "#edf0f6" }} />

//         {loading ? (
//           <Box
//             display="flex"
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             gap={2}
//             p={7}
//           >
//             <CircularProgress
//               size={36}
//               thickness={4}
//               sx={{ color: "#4f46e5" }}
//             />
//             <Typography variant="body2" color="text.secondary">
//               Loading your reports...
//             </Typography>
//           </Box>
//         ) : (
//           <TableContainer sx={{ overflowX: "auto" }}>
//             <Table
//               size="medium"
//               sx={{
//                 minWidth: 720,
//                 "& .MuiTableCell-root": {
//                   borderColor: "#edf0f6",
//                   px: 2.5,
//                   py: 1.8,
//                 },
//               }}
//             >
//               <TableHead>
//                 <TableRow
//                   sx={{
//                     bgcolor: "#f8faff",
//                     "& .MuiTableCell-root": {
//                       color: "#475569",
//                       fontSize: "0.77rem",
//                       fontWeight: 800,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.35px",
//                       whiteSpace: "nowrap",
//                     },
//                   }}
//                 >
//                   {currentColumns.map(([, label]) => (
//                     <TableCell key={label}>{label}</TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {rows.map((row, index) => (
//                   <TableRow
//                     hover
//                     key={
//                       row.id ??
//                       row.invoiceNumber ??
//                       row.customerId ??
//                       row.productId ??
//                       index
//                     }
//                     sx={{
//                       transition: "background-color 0.15s",
//                       "&:hover": {
//                         bgcolor: "#f8faff !important",
//                       },
//                       "&:last-child td": {
//                         borderBottom: 0,
//                       },
//                     }}
//                   >
//                     {currentColumns.map(([key]) => {
//                       const value = row[key];

//                       if (key === "paymentStatus") {
//                         const status = String(value || "Unknown");
//                         const normalized = status.toLowerCase();

//                         const color =
//                           normalized === "paid"
//                             ? {
//                                 bg: "#d1fae5",
//                                 text: "#047857",
//                               }
//                             : normalized === "pending" ||
//                                 normalized === "unpaid"
//                               ? {
//                                   bg: "#fef3c7",
//                                   text: "#b45309",
//                                 }
//                               : normalized === "partial" ||
//                                   normalized === "partially paid"
//                                 ? {
//                                     bg: "#dbeafe",
//                                     text: "#1d4ed8",
//                                   }
//                                 : {
//                                     bg: "#f1f5f9",
//                                     text: "#475569",
//                                   };

//                         return (
//                           <TableCell key={key}>
//                             <Chip
//                               size="small"
//                               label={status}
//                               sx={{
//                                 bgcolor: color.bg,
//                                 color: color.text,
//                                 fontWeight: 700,
//                                 fontSize: "0.72rem",
//                                 borderRadius: "7px",
//                                 textTransform: "capitalize",
//                               }}
//                             />
//                           </TableCell>
//                         );
//                       }

//                       if (key === "invoiceNumber") {
//                         return (
//                           <TableCell key={key}>
//                             <Typography
//                               sx={{
//                                 fontWeight: 700,
//                                 color: "#4f46e5",
//                                 whiteSpace: "nowrap",
//                                 fontSize: "0.85rem",
//                               }}
//                             >
//                               {value ?? "-"}
//                             </Typography>
//                           </TableCell>
//                         );
//                       }

//                       if (moneyKeys.has(key)) {
//                         return (
//                           <TableCell key={key}>
//                             <Typography
//                               sx={{
//                                 fontWeight:
//                                   key === "grandTotal" ||
//                                   key === "totalSales"
//                                     ? 700
//                                     : 500,
//                                 color: "#1e293b",
//                                 whiteSpace: "nowrap",
//                                 fontSize: "0.85rem",
//                               }}
//                             >
//                               {money(value)}
//                             </Typography>
//                           </TableCell>
//                         );
//                       }

//                       return (
//                         <TableCell key={key}>
//                           <Typography
//                             sx={{
//                               color: "#334155",
//                               fontSize: "0.85rem",
//                               whiteSpace:
//                                 key === "customerName" ||
//                                 key === "productName"
//                                   ? "normal"
//                                   : "nowrap",
//                             }}
//                           >
//                             {value ?? "-"}
//                           </Typography>
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 ))}

//                 {!rows.length && (
//                   <TableRow>
//                     <TableCell
//                       colSpan={currentColumns.length}
//                       align="center"
//                       sx={{ py: 8, borderBottom: 0 }}
//                     >
//                       <Box
//                         display="flex"
//                         flexDirection="column"
//                         alignItems="center"
//                         gap={1.5}
//                       >
//                         <Box
//                           sx={{
//                             width: 60,
//                             height: 60,
//                             borderRadius: "18px",
//                             bgcolor: "#eef2ff",
//                             color: "#6366f1",
//                             display: "grid",
//                             placeItems: "center",
//                           }}
//                         >
//                           <AssessmentOutlined sx={{ fontSize: 32 }} />
//                         </Box>

//                         <Typography
//                           fontWeight={700}
//                           color="#334155"
//                         >
//                           No report data found
//                         </Typography>

//                         <Typography
//                           variant="body2"
//                           color="text.secondary"
//                         >
//                           Try another date range or select a different report.
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}

//         {/* TABLE FOOTER */}
//         {!loading && rows.length > 0 && (
//           <Box
//             sx={{
//               px: 2.5,
//               py: 1.8,
//               borderTop: "1px solid #edf0f6",
//               bgcolor: "#fafbff",
//             }}
//           >
//             <Typography variant="caption" color="text.secondary">
//               Showing {rows.length} report record{rows.length === 1 ? "" : "s"}
//             </Typography>
//           </Box>
//         )}
//       </Paper>

//       <Typography
//         variant="caption"
//         sx={{
//           display: "block",
//           textAlign: "center",
//           color: "#94a3b8",
//           mt: 3,
//         }}
//       >
//         CloudBill · Business Reports & Analytics
//       </Typography>
//     </Box>
//   );
// }
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Chip,
  CircularProgress,
  Divider,
  FormControl,
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

const AUTO_REFRESH_MS = 60000;

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
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

const fieldAliases = {
  invoiceNumber: ["invoiceNumber", "invoice_number", "invoiceNo", "invoice_no"],
  invoiceDate: ["invoiceDate", "invoice_date", "created_at", "createdAt"],
  customerName: ["customerName", "customer_name", "customer?.name"],
  grandTotal: ["grandTotal", "grand_total", "totalAmount", "total_amount", "total"],
  receivedAmount: ["receivedAmount", "received_amount", "paidAmount", "paid_amount"],
  pendingAmount: ["pendingAmount", "pending_amount", "balanceAmount", "balance_amount"],
  paymentStatus: ["paymentStatus", "payment_status", "status"],
  discountAmount: ["discountAmount", "discount_amount", "discount"],
  gstAmount: ["gstAmount", "gst_amount", "totalGst", "total_gst", "taxAmount", "tax_amount"],
  subtotal: ["subtotal", "sub_total", "subTotal"],
  mobile: ["mobile", "phone", "phone_number", "mobile_number"],
  invoiceCount: ["invoiceCount", "invoice_count", "totalInvoices", "total_invoices"],
  totalSales: ["totalSales", "total_sales", "salesAmount", "sales_amount"],
  productName: ["productName", "product_name", "name"],
  sku: ["sku", "SKU", "product_code"],
  soldQuantity: ["soldQuantity", "sold_quantity", "quantity_sold"],
  stockQuantity: ["stockQuantity", "stock_quantity", "current_stock", "stock"],
  sellingPrice: ["sellingPrice", "selling_price", "price"],
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
    aliases: ["totalSales", "total_sales", "sales", "grandTotal", "grand_total"],
    icon: <TrendingUpRounded />,
    color: "#4f46e5",
    bg: "#eef2ff",
    format: "money",
  },
  {
    label: "Total Invoices",
    key: "invoiceCount",
    aliases: ["invoiceCount", "invoice_count", "totalInvoices", "total_invoices"],
    icon: <ReceiptLongOutlined />,
    color: "#0284c7",
    bg: "#e0f2fe",
  },
  {
    label: "Amount Received",
    key: "receivedAmount",
    aliases: ["receivedAmount", "received_amount", "paidAmount", "paid_amount"],
    icon: <PaymentsOutlined />,
    color: "#059669",
    bg: "#d1fae5",
    format: "money",
  },
  {
    label: "Pending Amount",
    key: "pendingAmount",
    aliases: ["pendingAmount", "pending_amount", "outstanding", "outstanding_amount"],
    icon: <PendingActionsOutlined />,
    color: "#d97706",
    bg: "#fef3c7",
    format: "money",
  },
  {
    label: "GST Amount",
    key: "gstAmount",
    aliases: ["gstAmount", "gst_amount", "totalGst", "total_gst"],
    icon: <AccountBalanceWalletOutlined />,
    color: "#7c3aed",
    bg: "#ede9fe",
    format: "money",
  },
];

const unwrapSummary = (response) => {
  const data = response?.data;
  return data?.summary ?? data?.data?.summary ?? data?.data ?? data ?? {};
};

const unwrapRows = (response) => {
  const data = response?.data;
  const candidates = [
    data?.data,
    data?.rows,
    data?.report,
    data?.invoices,
    data?.customers,
    data?.products,
    data?.data?.rows,
    data?.data?.invoices,
    data?.data?.customers,
    data?.data?.products,
  ];

  if (Array.isArray(data)) return data;
  return candidates.find(Array.isArray) || [];
};

const readField = (row, key) => {
  if (!row) return undefined;
  if (key === "customerName" && row.customer && typeof row.customer === "object") {
    return row.customer.name ?? row.customer.customer_name ?? row.customerName ?? row.customer_name;
  }

  const aliases = fieldAliases[key] || [key];
  for (const alias of aliases) {
    const value = row[alias];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
};

const readSummaryValue = (summary, aliases) => {
  for (const key of aliases) {
    const value = summary?.[key];
    if (value !== undefined && value !== null && value !== "") {
      const number = Number(value);
      if (Number.isFinite(number)) return number;
    }
  }
  return null;
};

const formatDate = (value) => {
  if (!value) return "—";
  const raw = String(value).slice(0, 10);
  const parts = raw.split("-").map(Number);

  if (parts.length === 3 && parts.every(Number.isFinite)) {
    return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? String(value)
    : parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export default function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState(monthStart());
  const [endDate, setEndDate] = useState(today());
  const [summary, setSummary] = useState({});
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadReports = useCallback(
    async (showLoader = true) => {
      if (startDate && endDate && startDate > endDate) {
        setError("Start date cannot be after end date.");
        return;
      }

      if (showLoader) setLoading(true);
      else setRefreshing(true);

      setError("");

      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      try {
        const [summaryResponse, reportResponse] = await Promise.all([
          API.get("/reports/summary", { params }),
          API.get(`/reports/${reportType}`, { params }),
        ]);

        setSummary(unwrapSummary(summaryResponse));
        setRows(unwrapRows(reportResponse));
        setLastUpdated(new Date());
      } catch (err) {
        console.error("REPORT LOAD ERROR:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load reports. Please check the backend API."
        );
        setRows([]);
        setSummary({});
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [reportType, startDate, endDate]
  );

  useEffect(() => {
    loadReports(true);
  }, [loadReports]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      loadReports(false);
    }, AUTO_REFRESH_MS);

    return () => window.clearInterval(timer);
  }, [loadReports]);

  const currentColumns = columns[reportType] || columns.sales;
  const activeReport =
    reportOptions.find((item) => item.value === reportType)?.label || "Report";

  const exportRows = useMemo(
    () =>
      rows.map((row) => {
        const result = {};
        currentColumns.forEach(([key, label]) => {
          const value = readField(row, key);
          result[label] = moneyKeys.has(key)
            ? Number(value || 0)
            : key === "invoiceDate"
            ? formatDate(value)
            : value ?? "";
        });
        return result;
      }),
    [rows, currentColumns]
  );

  const exportExcel = () => {
    if (!exportRows.length) return;
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}-report-${today()}.xlsx`);
  };

  const exportPDF = () => {
    if (!rows.length) return;

    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text(activeReport, 14, 15);
    doc.setFontSize(9);
    doc.text(`Period: ${startDate || "All"} to ${endDate || "All"}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [currentColumns.map(([, label]) => label)],
      body: rows.map((row) =>
        currentColumns.map(([key]) => {
          const value = readField(row, key);
          if (moneyKeys.has(key)) return money(value);
          if (key === "invoiceDate") return formatDate(value);
          return String(value ?? "—");
        })
      ),
      styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
      headStyles: { fillColor: [49, 46, 129], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 255] },
      theme: "grid",
      margin: { left: 12, right: 12 },
    });

    doc.save(`${reportType}-report-${today()}.pdf`);
  };

  const resetFilters = () => {
    setStartDate(monthStart());
    setEndDate(today());
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        p: { xs: 2, sm: 3, md: 3.5 },
        bgcolor: "#f7f9fc",
      }}
    >
      {/* Header */}
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
                width: 44,
                height: 44,
                display: "grid",
                placeItems: "center",
                borderRadius: 2.5,
                color: "#fff",
                background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                boxShadow: "0 6px 16px rgba(79,70,229,.18)",
              }}
            >
              <AssessmentOutlined sx={{ fontSize: 25 }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                color: "#172033",
                letterSpacing: "-.8px",
                fontSize: { xs: "1.55rem", md: "2rem" },
              }}
            >
              Reports & Analytics
            </Typography>
          </Stack>
          <Typography color="text.secondary" fontSize={13.5}>
            Monitor sales, GST, customers and inventory from your business data.
          </Typography>
          {lastUpdated && (
            <Typography sx={{ color: "#94a3b8", fontSize: 11, mt: 0.6 }}>
              Last updated: {lastUpdated.toLocaleTimeString("en-IN")} · Auto-refresh every 60 seconds
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            icon={<CalendarMonthOutlined />}
            label={`${startDate} — ${endDate}`}
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e2e8f0",
              color: "#475569",
              fontWeight: 600,
              borderRadius: 2,
              height: 38,
              maxWidth: "100%",
            }}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshRounded />}
            onClick={() => loadReports(false)}
            disabled={loading || refreshing}
            sx={{
              borderRadius: 2,
              height: 38,
              textTransform: "none",
              fontWeight: 700,
              borderColor: "#dbe3ef",
              color: "#334155",
            }}
          >
            {refreshing ? "Refreshing" : "Refresh"}
          </Button>
        </Stack>
      </Stack>

      {/* Summary cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
            xl: "repeat(5, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {summaryConfig.map((item) => {
          const value = readSummaryValue(summary, item.aliases);
          return (
            <Card
              key={item.key}
              elevation={0}
              sx={{
                minWidth: 0,
                borderRadius: 3,
                border: "1px solid #e8ebf3",
                bgcolor: "#fff",
                transition: "transform .2s, box-shadow .2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(15,23,42,.06)",
                },
              }}
            >
              <CardContent sx={{ p: 2.2, "&:last-child": { pb: 2.2 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                  <Typography sx={{ color: "#64748b", fontWeight: 650, fontSize: 12.5 }}>
                    {item.label}
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 2.5,
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
                    mt: 1.8,
                    fontSize: { xs: "1.25rem", md: "1.4rem" },
                    fontWeight: 800,
                    color: "#172033",
                    letterSpacing: "-.4px",
                    overflowWrap: "anywhere",
                  }}
                >
                  {value === null ? "—" : item.format === "money" ? money(value) : value.toLocaleString("en-IN")}
                </Typography>
                <Typography sx={{ color: "#94a3b8", display: "block", mt: 0.7, fontSize: 10.5 }}>
                  {value === null ? "Not provided by summary API" : "Selected date range"}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e5e9f2",
          borderRadius: 3,
          overflow: "hidden",
          mb: 3,
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ px: { xs: 2, md: 2.5 }, py: 2, borderBottom: "1px solid #edf0f6" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FilterAltOutlined sx={{ color: "#4f46e5" }} />
            <Typography fontWeight={750} color="#1e293b">
              Filter Reports
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "1.2fr 1fr 1fr auto",
              },
              gap: 2,
              alignItems: "end",
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={600} color="#475569" mb={0.8}>
                Report Type
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={reportType}
                  onChange={(event) => setReportType(event.target.value)}
                  sx={{ borderRadius: 2, bgcolor: "#fff" }}
                >
                  {reportOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ display: "flex", color: "#6366f1" }}>{option.icon}</Box>
                        <span>{option.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="body2" fontWeight={600} color="#475569" mb={0.8}>
                From Date
              </Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                inputProps={{ max: endDate || undefined }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Box>

            <Box>
              <Typography variant="body2" fontWeight={600} color="#475569" mb={0.8}>
                To Date
              </Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                inputProps={{ min: startDate || undefined }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<FilterAltOutlined />}
                onClick={() => loadReports(true)}
                disabled={loading || refreshing}
                fullWidth
                sx={{
                  minHeight: 40,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#4f46e5",
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                  "&:hover": { bgcolor: "#4338ca", boxShadow: "none" },
                }}
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                onClick={resetFilters}
                disabled={loading || refreshing}
                sx={{
                  minWidth: 42,
                  width: 42,
                  height: 40,
                  borderRadius: 2,
                  borderColor: "#dfe4ee",
                  color: "#64748b",
                }}
                title="Reset dates"
              >
                <RefreshRounded />
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2, alignItems: "center" }}
          action={
            <Button color="inherit" size="small" onClick={() => loadReports(true)}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Report table */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e5e9f2",
          borderRadius: 3,
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
              <Typography sx={{ fontWeight: 800, color: "#172033", fontSize: 17 }}>
                {activeReport}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 12 }}>
                {loading ? "Fetching report data..." : `${rows.length} record${rows.length === 1 ? "" : "s"} found`}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                variant="outlined"
                startIcon={<PictureAsPdfOutlined />}
                onClick={exportPDF}
                disabled={!rows.length || loading}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#fecaca",
                  color: "#dc2626",
                  "&:hover": { bgcolor: "#fef2f2", borderColor: "#f87171" },
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
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#a7f3d0",
                  color: "#047857",
                  "&:hover": { bgcolor: "#ecfdf5", borderColor: "#34d399" },
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
            <CircularProgress size={36} thickness={4} sx={{ color: "#4f46e5" }} />
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
                  py: 1.7,
                },
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#f8faff",
                    "& .MuiTableCell-root": {
                      color: "#475569",
                      fontSize: ".72rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: ".35px",
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
                    key={row.id ?? row.invoice_id ?? row.customer_id ?? row.product_id ?? index}
                    sx={{
                      "&:hover": { bgcolor: "#f8faff !important" },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    {currentColumns.map(([key]) => {
                      const value = readField(row, key);

                      if (key === "paymentStatus") {
                        const status = String(value || "Unknown");
                        const normalized = status.toLowerCase();
                        const palette =
                          normalized === "paid" || normalized === "completed"
                            ? { bg: "#d1fae5", text: "#047857" }
                            : normalized === "pending" || normalized === "unpaid"
                            ? { bg: "#fef3c7", text: "#b45309" }
                            : normalized === "partial" || normalized === "partially paid"
                            ? { bg: "#dbeafe", text: "#1d4ed8" }
                            : { bg: "#f1f5f9", text: "#475569" };

                        return (
                          <TableCell key={key}>
                            <Chip
                              size="small"
                              label={status}
                              sx={{
                                bgcolor: palette.bg,
                                color: palette.text,
                                fontWeight: 700,
                                fontSize: ".7rem",
                                borderRadius: 1.5,
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>
                        );
                      }

                      if (key === "invoiceNumber") {
                        return (
                          <TableCell key={key}>
                            <Typography sx={{ fontWeight: 700, color: "#4f46e5", whiteSpace: "nowrap", fontSize: 13 }}>
                              {value ?? "—"}
                            </Typography>
                          </TableCell>
                        );
                      }

                      if (moneyKeys.has(key)) {
                        return (
                          <TableCell key={key}>
                            <Typography
                              sx={{
                                fontWeight: key === "grandTotal" || key === "totalSales" ? 700 : 500,
                                color: "#1e293b",
                                whiteSpace: "nowrap",
                                fontSize: 13,
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
                              fontSize: 13,
                              whiteSpace: key === "customerName" || key === "productName" ? "normal" : "nowrap",
                            }}
                          >
                            {key === "invoiceDate" ? formatDate(value) : value ?? "—"}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}

                {!rows.length && (
                  <TableRow>
                    <TableCell colSpan={currentColumns.length} align="center" sx={{ py: 8, borderBottom: 0 }}>
                      <Stack alignItems="center" spacing={1.3}>
                        <Box
                          sx={{
                            width: 58,
                            height: 58,
                            borderRadius: 2.5,
                            bgcolor: "#eef2ff",
                            color: "#6366f1",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <AssessmentOutlined sx={{ fontSize: 30 }} />
                        </Box>
                        <Typography fontWeight={700} color="#334155">
                          No report data found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try another date range or select a different report.
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && rows.length > 0 && (
          <Box sx={{ px: 2.5, py: 1.7, borderTop: "1px solid #edf0f6", bgcolor: "#fafbff" }}>
            <Typography variant="caption" color="text.secondary">
              Showing {rows.length} report record{rows.length === 1 ? "" : "s"}
            </Typography>
          </Box>
        )}
      </Paper>

      <Typography
        variant="caption"
        sx={{ display: "block", textAlign: "center", color: "#94a3b8", mt: 3 }}
      >
        CloudBill · Business Reports & Analytics
      </Typography>
    </Box>
  );
}
