// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   Button,
//   TextField,
//   MenuItem,
//   CircularProgress,
//   Chip,
//   Avatar,
//   Divider,
//   Stack,
// } from "@mui/material";
// import {
//   TrendingUpRounded,
//   ReceiptLongRounded,
//   AccountBalanceWalletRounded,
//   PaymentsRounded,
//   AddRounded,
//   Inventory2Outlined,
//   PersonAddAlt1Rounded,
//   ArrowForwardRounded,
//   CalendarMonthRounded,
//   ReceiptOutlined,
// } from "@mui/icons-material";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";
// import API from "../../services/api";

// const formatCurrency = (value) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 2,
//   }).format(Number(value) || 0);

// const getToday = () => {
//   const date = new Date();
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//     2,
//     "0"
//   )}-${String(date.getDate()).padStart(2, "0")}`;
// };

// const Dashboard = () => {
//   const [todaySummary, setTodaySummary] = useState({});
//   const [summary, setSummary] = useState({});
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [period, setPeriod] = useState("7");

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   const loadDashboard = async () => {
//     setLoading(true);

//     try {
//       const today = getToday();

//       const [todayResponse, summaryResponse, invoiceResponse] =
//         await Promise.allSettled([
//           API.get("/reports/summary", {
//             params: { startDate: today, endDate: today },
//           }),
//           API.get("/reports/summary"),
//           API.get("/invoices"),
//         ]);

//       if (todayResponse.status === "fulfilled") {
//         setTodaySummary(todayResponse.value.data?.summary ||
//           todayResponse.value.data || {});
//       }

//       if (summaryResponse.status === "fulfilled") {
//         setSummary(summaryResponse.value.data?.summary ||
//           summaryResponse.value.data || {});
//       }

//       if (invoiceResponse.status === "fulfilled") {
//         const data = invoiceResponse.value.data;
//         const invoiceList = Array.isArray(data)
//           ? data
//           : data?.invoices || data?.data || [];

//         setInvoices(Array.isArray(invoiceList) ? invoiceList : []);
//       }
//     } catch (error) {
//       console.error("Dashboard loading error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const readNumber = (source, keys) => {
//     for (const key of keys) {
//       if (source?.[key] !== undefined && source?.[key] !== null) {
//         return Number(source[key]) || 0;
//       }
//     }
//     return 0;
//   };

//   const todaySales = readNumber(todaySummary, [
//     "totalSales",
//     "todaySales",
//     "total_sales",
//     "sales",
//     "grandTotal",
//   ]);

//   const totalSales = readNumber(summary, [
//     "totalSales",
//     "total_sales",
//     "sales",
//     "grandTotal",
//   ]);

//   const totalInvoices = readNumber(summary, [
//     "totalInvoices",
//     "invoiceCount",
//     "total_invoices",
//     "invoice_count",
//   ]);

//   const outstanding = readNumber(summary, [
//     "outstanding",
//     "totalOutstanding",
//     "outstandingAmount",
//     "pendingAmount",
//     "total_outstanding",
//   ]);

//   const chartData = React.useMemo(() => {
//     const days = Number(period);
//     const result = [];
//     const now = new Date();

//     for (let i = days - 1; i >= 0; i--) {
//       const date = new Date(now);
//       date.setDate(now.getDate() - i);

//       result.push({
//         date: date.toISOString().slice(0, 10),
//         day: date.toLocaleDateString("en-IN", {
//           day: "2-digit",
//           month: "short",
//         }),
//         sales: 0,
//       });
//     }

//     invoices.forEach((invoice) => {
//       const invoiceDate = String(
//         invoice.invoiceDate || invoice.invoice_date || invoice.created_at || ""
//       ).slice(0, 10);

//       const item = result.find((entry) => entry.date === invoiceDate);

//       if (item) {
//         item.sales += Number(
//           invoice.grandTotal ??
//           invoice.grand_total ??
//           invoice.totalAmount ??
//           invoice.total_amount ??
//           invoice.total ??
//           0
//         );
//       }
//     });

//     return result;
//   }, [invoices, period]);

//   const metrics = [
//     {
//       title: "Today's Sales",
//       value: formatCurrency(todaySales),
//       subtitle: "Sales recorded today",
//       icon: <TrendingUpRounded />,
//       color: "#2563eb",
//       bg: "#eff6ff",
//     },
//     {
//       title: "Total Sales",
//       value: formatCurrency(totalSales),
//       subtitle: "Sales in summary period",
//       icon: <PaymentsRounded />,
//       color: "#059669",
//       bg: "#ecfdf5",
//     },
//     {
//       title: "Total Invoices",
//       value: totalInvoices.toLocaleString("en-IN"),
//       subtitle: "Invoices in summary period",
//       icon: <ReceiptLongRounded />,
//       color: "#7c3aed",
//       bg: "#f5f3ff",
//     },
//     {
//       title: "Outstanding",
//       value: formatCurrency(outstanding),
//       subtitle: "Pending customer payments",
//       icon: <AccountBalanceWalletRounded />,
//       color: "#ea580c",
//       bg: "#fff7ed",
//     },
//   ];

//   const getInvoiceNumber = (invoice) =>
//     invoice.invoiceNumber ||
//     invoice.invoice_number ||
//     invoice.invoiceNo ||
//     invoice.invoice_no ||
//     `INV-${invoice.id || ""}`;

//   const getCustomerName = (invoice) =>
//     invoice.customer_name ||
//     invoice.customerName ||
//     invoice.customer?.name ||
//     invoice.customer?.customer_name ||
//     "Customer";

//   const getInvoiceAmount = (invoice) =>
//     invoice.grandTotal ??
//     invoice.grand_total ??
//     invoice.totalAmount ??
//     invoice.total_amount ??
//     invoice.total ??
//     0;

//   const getStatus = (invoice) =>
//     String(invoice.status || invoice.paymentStatus || invoice.payment_status || "Pending");

//   const quickActions = [
//     {
//       title: "Create Invoice",
//       description: "Create a new customer bill",
//       icon: <ReceiptOutlined />,
//       color: "#2563eb",
//       path: "/billing",
//     },
//     {
//       title: "Add Product",
//       description: "Add products to your inventory",
//       icon: <Inventory2Outlined />,
//       color: "#059669",
//       path: "/products",
//     },
//     {
//       title: "Add Customer",
//       description: "Manage your customer details",
//       icon: <PersonAddAlt1Rounded />,
//       color: "#7c3aed",
//       path: "/customers",
//     },
//   ];

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "65vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         maxWidth: "100%",
//         minWidth: 0,
//         p: { xs: 2, sm: 3, lg: 4 },
//         bgcolor: "#f8fafc",
//         boxSizing: "border-box",
//       }}
//     >
//       {/* Dashboard heading */}
//       <Stack
//         direction={{ xs: "column", md: "row" }}
//         justifyContent="space-between"
//         alignItems={{ xs: "stretch", md: "center" }}
//         spacing={2}
//         sx={{ mb: 3 }}
//       >
//         <Box>
//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: 800,
//               color: "#172554",
//               letterSpacing: "-0.8px",
//               fontSize: { xs: 25, md: 30 },
//             }}
//           >
//             Dashboard
//           </Typography>
//           <Typography sx={{ color: "#64748b", mt: 0.7, fontSize: 14 }}>
//             Here's what's happening with your business today.
//           </Typography>
//         </Box>

//         <Stack direction="row" spacing={1.5}>
//           <Chip
//             icon={<CalendarMonthRounded />}
//             label={new Date().toLocaleDateString("en-IN", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             })}
//             sx={{
//               bgcolor: "#fff",
//               border: "1px solid #e2e8f0",
//               height: 42,
//               fontWeight: 600,
//               borderRadius: 2,
//             }}
//           />

//           <Button
//             variant="contained"
//             startIcon={<AddRounded />}
//             onClick={() => (window.location.href = "/billing")}
//             sx={{
//               bgcolor: "#2563eb",
//               borderRadius: 2,
//               px: 2.2,
//               textTransform: "none",
//               fontWeight: 700,
//               boxShadow: "0 5px 14px rgba(37,99,235,0.20)",
//               "&:hover": { bgcolor: "#1d4ed8" },
//             }}
//           >
//             New Invoice
//           </Button>
//         </Stack>
//       </Stack>

//       {/* Summary cards */}
//       <Grid container spacing={2.5}>
//         {metrics.map((metric) => (
//           <Grid item xs={12} sm={6} xl={3} key={metric.title}>
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 2.5,
//                 height: "100%",
//                 borderRadius: 3,
//                 border: "1px solid #e8edf5",
//                 bgcolor: "#fff",
//                 transition: "all .2s ease",
//                 "&:hover": {
//                   transform: "translateY(-3px)",
//                   boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
//                 },
//               }}
//             >
//               <Stack
//                 direction="row"
//                 alignItems="center"
//                 justifyContent="space-between"
//               >
//                 <Typography sx={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>
//                   {metric.title}
//                 </Typography>
//                 <Avatar
//                   variant="rounded"
//                   sx={{
//                     width: 42,
//                     height: 42,
//                     bgcolor: metric.bg,
//                     color: metric.color,
//                     borderRadius: 2.5,
//                   }}
//                 >
//                   {metric.icon}
//                 </Avatar>
//               </Stack>

//               <Typography
//                 sx={{
//                   mt: 2.2,
//                   fontSize: { xs: 23, md: 27 },
//                   fontWeight: 800,
//                   color: "#172554",
//                   letterSpacing: "-0.7px",
//                   overflowWrap: "anywhere",
//                 }}
//               >
//                 {metric.value}
//               </Typography>

//               <Typography sx={{ mt: 0.8, fontSize: 12, color: "#94a3b8" }}>
//                 {metric.subtitle}
//               </Typography>
//             </Paper>
//           </Grid>
//         ))}

//         {/* Sales chart */}
//         <Grid item xs={12} lg={8}>
//           <Paper
//             elevation={0}
//             sx={{
//               p: { xs: 2, sm: 3 },
//               height: 390,
//               borderRadius: 3,
//               border: "1px solid #e8edf5",
//               bgcolor: "#fff",
//             }}
//           >
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//               spacing={1}
//               sx={{ mb: 1 }}
//             >
//               <Box>
//                 <Typography sx={{ fontWeight: 800, fontSize: 17, color: "#172554" }}>
//                   Sales Overview
//                 </Typography>
//                 <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5 }}>
//                   Invoice sales over time
//                 </Typography>
//               </Box>

//               <TextField
//                 select
//                 size="small"
//                 value={period}
//                 onChange={(event) => setPeriod(event.target.value)}
//                 sx={{
//                   width: 125,
//                   "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 12 },
//                 }}
//               >
//                 <MenuItem value="7">Last 7 days</MenuItem>
//                 <MenuItem value="14">Last 14 days</MenuItem>
//                 <MenuItem value="30">Last 30 days</MenuItem>
//               </TextField>
//             </Stack>

//             <Box sx={{ width: "100%", height: 285, mt: 2 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.22} />
//                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
//                     </linearGradient>
//                   </defs>

//                   <CartesianGrid stroke="#edf2f7" strokeDasharray="4 4" vertical={false} />

//                   <XAxis
//                     dataKey="day"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: "#94a3b8", fontSize: 11 }}
//                     dy={10}
//                     minTickGap={15}
//                   />

//                   <YAxis
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: "#94a3b8", fontSize: 11 }}
//                     tickFormatter={(value) =>
//                       value >= 1000 ? `₹${(value / 1000).toFixed(1)}k` : `₹${value}`
//                     }
//                     width={55}
//                   />

//                   <Tooltip
//                     formatter={(value) => [formatCurrency(value), "Sales"]}
//                     contentStyle={{
//                       borderRadius: 12,
//                       border: "1px solid #e2e8f0",
//                       boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
//                     }}
//                   />

//                   <Area
//                     type="monotone"
//                     dataKey="sales"
//                     stroke="#2563eb"
//                     strokeWidth={3}
//                     fill="url(#salesGradient)"
//                     activeDot={{ r: 5, strokeWidth: 0 }}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </Box>
//           </Paper>
//         </Grid>

//         {/* Quick actions */}
//         <Grid item xs={12} lg={4}>
//           <Paper
//             elevation={0}
//             sx={{
//               p: 3,
//               height: 390,
//               borderRadius: 3,
//               border: "1px solid #e8edf5",
//               bgcolor: "#fff",
//             }}
//           >
//             <Typography sx={{ fontWeight: 800, fontSize: 17, color: "#172554" }}>
//               Quick Actions
//             </Typography>
//             <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5, mb: 2.5 }}>
//               Manage your daily operations
//             </Typography>

//             <Stack spacing={1.5}>
//               {quickActions.map((action) => (
//                 <Box
//                   key={action.title}
//                   onClick={() => (window.location.href = action.path)}
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1.5,
//                     p: 1.5,
//                     borderRadius: 2.5,
//                     cursor: "pointer",
//                     border: "1px solid transparent",
//                     transition: "all .2s ease",
//                     "&:hover": {
//                       bgcolor: "#f8fafc",
//                       borderColor: "#e2e8f0",
//                     },
//                   }}
//                 >
//                   <Avatar
//                     variant="rounded"
//                     sx={{
//                       width: 43,
//                       height: 43,
//                       bgcolor: `${action.color}12`,
//                       color: action.color,
//                       borderRadius: 2.5,
//                     }}
//                   >
//                     {action.icon}
//                   </Avatar>

//                   <Box sx={{ flex: 1, minWidth: 0 }}>
//                     <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
//                       {action.title}
//                     </Typography>
//                     <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.4 }}>
//                       {action.description}
//                     </Typography>
//                   </Box>

//                   <ArrowForwardRounded sx={{ fontSize: 17, color: "#94a3b8" }} />
//                 </Box>
//               ))}
//             </Stack>

//             <Divider sx={{ my: 2 }} />

//             <Box
//               sx={{
//                 p: 2,
//                 borderRadius: 2.5,
//                 bgcolor: "#eff6ff",
//                 border: "1px solid #dbeafe",
//               }}
//             >
//               <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>
//                 GST-Compliant Billing
//               </Typography>
//               <Typography sx={{ fontSize: 11, color: "#64748b", mt: 0.5, lineHeight: 1.6 }}>
//                 Keep your invoices and business records organized in one place.
//               </Typography>
//             </Box>
//           </Paper>
//         </Grid>

//         {/* Recent invoices */}
//         <Grid item xs={12}>
//           <Paper
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               border: "1px solid #e8edf5",
//               bgcolor: "#fff",
//               overflow: "hidden",
//             }}
//           >
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//               sx={{ p: { xs: 2, sm: 3 } }}
//             >
//               <Box>
//                 <Typography sx={{ fontWeight: 800, fontSize: 17, color: "#172554" }}>
//                   Recent Invoices
//                 </Typography>
//                 <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5 }}>
//                   Latest billing activity
//                 </Typography>
//               </Box>

//               <Button
//                 endIcon={<ArrowForwardRounded />}
//                 onClick={() => (window.location.href = "/billing")}
//                 sx={{ textTransform: "none", fontWeight: 700 }}
//               >
//                 View All
//               </Button>
//             </Stack>

//             <Divider />

//             {invoices.length === 0 ? (
//               <Box sx={{ py: 6, px: 2, textAlign: "center" }}>
//                 <Avatar
//                   sx={{
//                     mx: "auto",
//                     mb: 1.5,
//                     width: 54,
//                     height: 54,
//                     bgcolor: "#f1f5f9",
//                     color: "#64748b",
//                   }}
//                 >
//                   <ReceiptLongRounded />
//                 </Avatar>
//                 <Typography sx={{ fontWeight: 700, color: "#334155" }}>
//                   No invoices found
//                 </Typography>
//                 <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5 }}>
//                   Create your first invoice to see it here.
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   startIcon={<AddRounded />}
//                   onClick={() => (window.location.href = "/billing")}
//                   sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
//                 >
//                   Create Invoice
//                 </Button>
//               </Box>
//             ) : (
//               <Box sx={{ overflowX: "auto" }}>
//                 <Box sx={{ minWidth: 650 }}>
//                   <Box
//                     sx={{
//                       display: "grid",
//                       gridTemplateColumns: "1.1fr 1.5fr 1fr 1fr 1fr",
//                       gap: 2,
//                       px: 3,
//                       py: 1.5,
//                       bgcolor: "#f8fafc",
//                     }}
//                   >
//                     {["Invoice", "Customer", "Date", "Amount", "Status"].map((heading) => (
//                       <Typography
//                         key={heading}
//                         sx={{
//                           fontSize: 11,
//                           color: "#64748b",
//                           fontWeight: 700,
//                           textTransform: "uppercase",
//                           letterSpacing: ".5px",
//                         }}
//                       >
//                         {heading}
//                       </Typography>
//                     ))}
//                   </Box>

//                   {invoices.slice(0, 5).map((invoice, index) => {
//                     const status = getStatus(invoice);
//                     const paid = /paid|completed/i.test(status);
//                     const cancelled = /cancel/i.test(status);
//                     const dateValue =
//                       invoice.invoiceDate ||
//                       invoice.invoice_date ||
//                       invoice.created_at;

//                     return (
//                       <React.Fragment key={invoice.id || getInvoiceNumber(invoice) || index}>
//                         <Box
//                           sx={{
//                             display: "grid",
//                             gridTemplateColumns: "1.1fr 1.5fr 1fr 1fr 1fr",
//                             gap: 2,
//                             alignItems: "center",
//                             px: 3,
//                             py: 2,
//                             "&:hover": { bgcolor: "#fafcff" },
//                           }}
//                         >
//                           <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#2563eb" }}>
//                             {getInvoiceNumber(invoice)}
//                           </Typography>

//                           <Typography
//                             sx={{
//                               fontSize: 13,
//                               fontWeight: 600,
//                               color: "#334155",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {getCustomerName(invoice)}
//                           </Typography>

//                           <Typography sx={{ fontSize: 12, color: "#64748b" }}>
//                             {dateValue
//                               ? new Date(dateValue).toLocaleDateString("en-IN")
//                               : "—"}
//                           </Typography>

//                           <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#172554" }}>
//                             {formatCurrency(getInvoiceAmount(invoice))}
//                           </Typography>

//                           <Box>
//                             <Chip
//                               size="small"
//                               label={status}
//                               sx={{
//                                 fontSize: 11,
//                                 fontWeight: 700,
//                                 textTransform: "capitalize",
//                                 bgcolor: paid
//                                   ? "#dcfce7"
//                                   : cancelled
//                                   ? "#fee2e2"
//                                   : "#fef3c7",
//                                 color: paid
//                                   ? "#15803d"
//                                   : cancelled
//                                   ? "#b91c1c"
//                                   : "#a16207",
//                                 borderRadius: 1.5,
//                               }}
//                             />
//                           </Box>
//                         </Box>
//                         {index < Math.min(invoices.length, 5) - 1 && <Divider />}
//                       </React.Fragment>
//                     );
//                   })}
//                 </Box>
//               </Box>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";

import {
  TrendingUpRounded,
  ReceiptLongRounded,
  AccountBalanceWalletRounded,
  PaymentsRounded,
  AddRounded,
  Inventory2Outlined,
  PersonAddAlt1Rounded,
  ArrowForwardRounded,
  CalendarMonthRounded,
  ReceiptOutlined,
} from "@mui/icons-material";

import API from "../../services/api";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const todayDate = () => {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const getValue = (data, keys) => {
  for (const key of keys) {
    if (data?.[key] !== undefined && data?.[key] !== null) {
      return Number(data[key]) || 0;
    }
  }
  return 0;
};

const Dashboard = () => {
  const [todaySummary, setTodaySummary] = useState({});
  const [summary, setSummary] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      const [todayResult, summaryResult, invoiceResult] =
        await Promise.allSettled([
          API.get("/reports/summary", {
            params: {
              startDate: todayDate(),
              endDate: todayDate(),
            },
          }),
          API.get("/reports/summary"),
          API.get("/invoices"),
        ]);

      if (todayResult.status === "fulfilled") {
        const data = todayResult.value.data;
        setTodaySummary(data?.summary || data || {});
      }

      if (summaryResult.status === "fulfilled") {
        const data = summaryResult.value.data;
        setSummary(data?.summary || data || {});
      }

      if (invoiceResult.status === "fulfilled") {
        const data = invoiceResult.value.data;
        const list = Array.isArray(data)
          ? data
          : data?.invoices || data?.data || [];

        setInvoices(Array.isArray(list) ? list : []);
      }

      setLoading(false);
    };

    loadDashboard();
  }, []);

  const todaySales = getValue(todaySummary, [
    "totalSales",
    "todaySales",
    "total_sales",
    "sales",
    "grandTotal",
  ]);

  const totalSales = getValue(summary, [
    "totalSales",
    "total_sales",
    "sales",
    "grandTotal",
  ]);

  const totalInvoices = getValue(summary, [
    "totalInvoices",
    "invoiceCount",
    "total_invoices",
    "invoice_count",
  ]);

  const outstanding = getValue(summary, [
    "outstanding",
    "totalOutstanding",
    "outstandingAmount",
    "pendingAmount",
    "total_outstanding",
  ]);

  const chartData = useMemo(() => {
    const days = Number(period);
    const result = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      result.push({
        date: [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0"),
        ].join("-"),
        label: date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        sales: 0,
      });
    }

    invoices.forEach((invoice) => {
      const date = String(
        invoice.invoiceDate ||
          invoice.invoice_date ||
          invoice.created_at ||
          ""
      ).slice(0, 10);

      const entry = result.find((item) => item.date === date);

      if (entry) {
        entry.sales += Number(
          invoice.grandTotal ??
            invoice.grand_total ??
            invoice.totalAmount ??
            invoice.total_amount ??
            invoice.total ??
            0
        );
      }
    });

    return result;
  }, [invoices, period]);

  const maxSales = Math.max(
    ...chartData.map((item) => item.sales),
    100
  );

  const chartPoints = chartData
    .map((item, index) => {
      const x =
        chartData.length === 1
          ? 50
          : (index / (chartData.length - 1)) * 100;

      const y = 90 - (item.sales / maxSales) * 75;

      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,100 ${chartPoints} 100,100`;

  const metrics = [
    {
      title: "Today's Sales",
      value: currency(todaySales),
      subtitle: "Sales recorded today",
      icon: <TrendingUpRounded />,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      title: "Total Sales",
      value: currency(totalSales),
      subtitle: "Sales in summary period",
      icon: <PaymentsRounded />,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      title: "Total Invoices",
      value: totalInvoices.toLocaleString("en-IN"),
      subtitle: "Invoices in summary period",
      icon: <ReceiptLongRounded />,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      title: "Outstanding",
      value: currency(outstanding),
      subtitle: "Pending customer payments",
      icon: <AccountBalanceWalletRounded />,
      color: "#ea580c",
      bg: "#fff7ed",
    },
  ];

  const actions = [
    {
      title: "Create Invoice",
      description: "Create a new customer bill",
      icon: <ReceiptOutlined />,
      color: "#2563eb",
      path: "/billing",
    },
    {
      title: "Add Product",
      description: "Add products to your inventory",
      icon: <Inventory2Outlined />,
      color: "#059669",
      path: "/products",
    },
    {
      title: "Add Customer",
      description: "Manage customer details",
      icon: <PersonAddAlt1Rounded />,
      color: "#7c3aed",
      path: "/customers",
    },
  ];

  const goTo = (path) => {
    window.location.href = path;
  };

  const invoiceNumber = (invoice) =>
    invoice.invoiceNumber ||
    invoice.invoice_number ||
    invoice.invoiceNo ||
    invoice.invoice_no ||
    `INV-${invoice.id || ""}`;

  const customerName = (invoice) =>
    invoice.customer_name ||
    invoice.customerName ||
    invoice.customer?.name ||
    invoice.customer?.customer_name ||
    "Customer";

  const invoiceAmount = (invoice) =>
    invoice.grandTotal ??
    invoice.grand_total ??
    invoice.totalAmount ??
    invoice.total_amount ??
    invoice.total ??
    0;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        p: { xs: 2, sm: 3, lg: 4 },
        bgcolor: "#f8fafc",
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 25, md: 30 },
              fontWeight: 800,
              color: "#172554",
              letterSpacing: "-0.7px",
            }}
          >
            Dashboard
          </Typography>

          <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.5 }}>
            Here's what's happening with your business today.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Chip
            icon={<CalendarMonthRounded />}
            label={new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            sx={{
              height: 42,
              bgcolor: "#fff",
              border: "1px solid #e2e8f0",
              fontWeight: 600,
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => goTo("/billing")}
            sx={{
              bgcolor: "#2563eb",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              px: 2,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            New Invoice
          </Button>
        </Stack>
      </Stack>

      {/* KPI Cards */}
      <Grid container spacing={2.5}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} xl={3} key={metric.title}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                height: "100%",
                border: "1px solid #e8edf5",
                borderRadius: 3,
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                  {metric.title}
                </Typography>

                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: metric.bg,
                    color: metric.color,
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                  }}
                >
                  {metric.icon}
                </Avatar>
              </Stack>

              <Typography
                sx={{
                  mt: 2,
                  fontSize: { xs: 23, md: 26 },
                  fontWeight: 800,
                  color: "#172554",
                  overflowWrap: "anywhere",
                }}
              >
                {metric.value}
              </Typography>

              <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.8 }}>
                {metric.subtitle}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* SVG Sales Chart */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              height: 390,
              border: "1px solid #e8edf5",
              borderRadius: 3,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Box>
                <Typography sx={{ fontWeight: 800, color: "#172554", fontSize: 17 }}>
                  Sales Overview
                </Typography>
                <Typography sx={{ color: "#94a3b8", fontSize: 12, mt: 0.5 }}>
                  Invoice sales over time
                </Typography>
              </Box>

              <TextField
                select
                size="small"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                sx={{
                  width: 125,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: 12,
                  },
                }}
              >
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="14">Last 14 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
              </TextField>
            </Stack>

            <Box sx={{ width: "100%", mt: 3 }}>
              <svg
                viewBox="0 0 100 105"
                preserveAspectRatio="none"
                style={{ width: "100%", height: 235, overflow: "visible" }}
                role="img"
                aria-label="Daily invoice sales chart"
              >
                {[20, 40, 60, 80].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke="#e8edf5"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                  />
                ))}

                <polygon points={areaPoints} fill="#dbeafe" opacity="0.8" />

                <polyline
                  points={chartPoints}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1.2"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {chartData.map((item, index) => {
                  const x =
                    chartData.length === 1
                      ? 50
                      : (index / (chartData.length - 1)) * 100;

                  const y = 90 - (item.sales / maxSales) * 75;

                  return (
                    <circle
                      key={item.date}
                      cx={x}
                      cy={y}
                      r="1.3"
                      fill="#2563eb"
                    >
                      <title>
                        {item.label}: {currency(item.sales)}
                      </title>
                    </circle>
                  );
                })}
              </svg>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                  mt: 1,
                }}
              >
                {chartData.map((item, index) => {
                  const showLabel =
                    chartData.length <= 7 ||
                    index % Math.ceil(chartData.length / 7) === 0 ||
                    index === chartData.length - 1;

                  return (
                    <Typography
                      key={item.date}
                      sx={{
                        fontSize: 10,
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                        visibility: showLabel ? "visible" : "hidden",
                      }}
                    >
                      {item.label}
                    </Typography>
                  );
                })}
              </Box>
            </Box>

            <Typography sx={{ color: "#94a3b8", fontSize: 11, mt: 2 }}>
              Daily sales based on invoices loaded from your API.
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 390,
              border: "1px solid #e8edf5",
              borderRadius: 3,
            }}
          >
            <Typography sx={{ fontWeight: 800, color: "#172554", fontSize: 17 }}>
              Quick Actions
            </Typography>

            <Typography sx={{ color: "#94a3b8", fontSize: 12, mt: 0.5, mb: 2 }}>
              Manage your daily operations
            </Typography>

            <Stack spacing={1.5}>
              {actions.map((action) => (
                <Box
                  key={action.title}
                  onClick={() => goTo(action.path)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2.5,
                    cursor: "pointer",
                    border: "1px solid transparent",
                    "&:hover": {
                      bgcolor: "#f8fafc",
                      borderColor: "#e2e8f0",
                    },
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 43,
                      height: 43,
                      bgcolor: `${action.color}12`,
                      color: action.color,
                      borderRadius: 2.5,
                    }}
                  >
                    {action.icon}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
                      {action.title}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.4 }}>
                      {action.description}
                    </Typography>
                  </Box>

                  <ArrowForwardRounded sx={{ fontSize: 17, color: "#94a3b8" }} />
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ p: 2, bgcolor: "#eff6ff", borderRadius: 2.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>
                GST-Compliant Billing
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#64748b", mt: 0.5, lineHeight: 1.6 }}>
                Keep your invoices and business records organized in one place.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Invoices */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #e8edf5",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ p: { xs: 2, sm: 3 } }}
            >
              <Box>
                <Typography sx={{ fontWeight: 800, color: "#172554", fontSize: 17 }}>
                  Recent Invoices
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5 }}>
                  Latest billing activity
                </Typography>
              </Box>

              <Button
                endIcon={<ArrowForwardRounded />}
                onClick={() => goTo("/billing")}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                View All
              </Button>
            </Stack>

            <Divider />

            {invoices.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center", px: 2 }}>
                <ReceiptLongRounded sx={{ fontSize: 42, color: "#94a3b8" }} />

                <Typography sx={{ mt: 1, fontWeight: 700, color: "#334155" }}>
                  No invoices found
                </Typography>

                <Typography sx={{ mt: 0.5, fontSize: 12, color: "#94a3b8" }}>
                  Create your first invoice to see it here.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<AddRounded />}
                  onClick={() => goTo("/billing")}
                  sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
                >
                  Create Invoice
                </Button>
              </Box>
            ) : (
              <Box sx={{ overflowX: "auto" }}>
                <Box sx={{ minWidth: 650 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1.1fr 1.5fr 1fr 1fr 1fr",
                      gap: 2,
                      px: 3,
                      py: 1.5,
                      bgcolor: "#f8fafc",
                    }}
                  >
                    {["Invoice", "Customer", "Date", "Amount", "Status"].map(
                      (heading) => (
                        <Typography
                          key={heading}
                          sx={{
                            fontSize: 11,
                            color: "#64748b",
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          {heading}
                        </Typography>
                      )
                    )}
                  </Box>

                  {invoices.slice(0, 5).map((invoice, index) => {
                    const status = String(
                      invoice.status ||
                        invoice.paymentStatus ||
                        invoice.payment_status ||
                        "Pending"
                    );

                    const isPaid = /paid|completed/i.test(status);
                    const isCancelled = /cancel/i.test(status);

                    const dateValue =
                      invoice.invoiceDate ||
                      invoice.invoice_date ||
                      invoice.created_at;

                    return (
                      <React.Fragment
                        key={invoice.id || invoiceNumber(invoice) || index}
                      >
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1.1fr 1.5fr 1fr 1fr 1fr",
                            alignItems: "center",
                            gap: 2,
                            px: 3,
                            py: 2,
                          }}
                        >
                          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#2563eb" }}>
                            {invoiceNumber(invoice)}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#334155",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {customerName(invoice)}
                          </Typography>

                          <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                            {dateValue
                              ? new Date(dateValue).toLocaleDateString("en-IN")
                              : "—"}
                          </Typography>

                          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#172554" }}>
                            {currency(invoiceAmount(invoice))}
                          </Typography>

                          <Chip
                            size="small"
                            label={status}
                            sx={{
                              width: "fit-content",
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "capitalize",
                              bgcolor: isPaid
                                ? "#dcfce7"
                                : isCancelled
                                ? "#fee2e2"
                                : "#fef3c7",
                              color: isPaid
                                ? "#15803d"
                                : isCancelled
                                ? "#b91c1c"
                                : "#a16207",
                            }}
                          />
                        </Box>

                        {index < Math.min(invoices.length, 5) - 1 && <Divider />}
                      </React.Fragment>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;