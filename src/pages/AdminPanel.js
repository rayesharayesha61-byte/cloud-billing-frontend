
// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";

// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Chip,
//   CircularProgress,
//   Alert,
//   IconButton,
//   MenuItem,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Drawer,
//   useMediaQuery,
//   useTheme,
//   Divider,
// } from "@mui/material";

// import {
//   Refresh as RefreshIcon,
//   Menu as MenuIcon,
//   Close as CloseIcon,
//   People as PeopleIcon,
//   Payments as PaymentsIcon,
//   CardMembership as PlanIcon,
//   Assessment as ReportIcon,
//   CheckCircle as CheckIcon,
// } from "@mui/icons-material";

// import AdminSidebar, { menuItems } from "../components/admin/AdminSidebar";

// const API = axios.create({
//   baseURL:
//     process.env.REACT_APP_API_URL ||
//     "https://cloud-billing-backend.onrender.com/api",
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// const endpoints = {
//   1: "/super-admin/users",
//   2: "/super-admin/subscriptions",
//   3: "/super-admin/payments",
//   4: "/super-admin/plans",
//   5: "/super-admin/trials",
//   6: "/super-admin/coupons",
//   7: "/super-admin/notifications",
//   8: "/super-admin/tickets",
//   9: "/super-admin/reports",
//   10: "/super-admin/login-activity",
//   11: "/super-admin/settings",
// };

// const responseKeys = {
//   1: "users",
//   2: "subscriptions",
//   3: "payments",
//   4: "plans",
//   5: "trials",
//   6: "coupons",
//   7: "notifications",
//   8: "tickets",
//   9: "monthly",
//   10: "activity",
//   11: "settings",
// };

// const unavailableTabs = {
//   6: "Coupons are unavailable because the current database has no coupons table.",
//   7: "Notifications are unavailable because the current database has no notifications table.",
//   8: "Support tickets are unavailable because the current database has no tickets table.",
//   10: "Login Activity is unavailable because the current database has no login activity table.",
//   11: "System Settings are unavailable because the current database has no settings table.",
// };

// const money = (value) =>
//   `₹${Number(value || 0).toLocaleString("en-IN")}`;

// const statusColor = (status) => {
//   const value = String(status || "").toUpperCase();

//   if (["ACTIVE", "APPROVED", "RESOLVED"].includes(value)) {
//     return "success";
//   }

//   if (["PENDING", "TRIAL", "IN_PROGRESS"].includes(value)) {
//     return "warning";
//   }

//   if (["EXPIRED", "REJECTED", "CANCELLED", "CLOSED"].includes(value)) {
//     return "error";
//   }

//   return "default";
// };

// export default function AdminPanel() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   const [tab, setTab] = useState(0);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const [stats, setStats] = useState({});
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [data, setData] = useState([]);

//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [paymentDialog, setPaymentDialog] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [paymentStatus, setPaymentStatus] = useState("APPROVED");
//   const [paymentNote, setPaymentNote] = useState("");

//   const [trialDialog, setTrialDialog] = useState(false);
//   const [selectedTrial, setSelectedTrial] = useState(null);
//   const [trialDays, setTrialDays] = useState(7);

//   const loadDashboard = useCallback(async () => {
//     const response = await API.get("/super-admin/dashboard");

//     setStats(response.data.stats || {});
//     setRecentUsers(response.data.recentUsers || []);
//   }, []);

//   const loadData = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       if (tab === 0) {
//         await loadDashboard();
//         setData([]);
//         return;
//       }

//       if (tab === 1) {
//         const [usersResponse, businessesResponse] = await Promise.all([
//           API.get("/super-admin/users", {
//             params: { search },
//           }),
//           API.get("/super-admin/businesses"),
//         ]);

//         setData({
//           users: usersResponse.data.users || [],
//           businesses: businessesResponse.data.businesses || [],
//         });

//         return;
//       }

//       const response = await API.get(endpoints[tab]);
//       const result = response.data[responseKeys[tab]];

//       setData(Array.isArray(result) ? result : result || []);
//     } catch (err) {
//       setData([]);
//       setError(
//         err.response?.data?.message ||
//           "Unable to load data. Please check the backend API."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [tab, search, loadDashboard]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   const showSuccess = (message) => {
//     setSuccess(message);
//     setError("");

//     setTimeout(() => {
//       setSuccess("");
//     }, 3000);
//   };

//   const updateUser = async (id, isActive) => {
//     try {
//       await API.patch(`/super-admin/users/${id}/status`, {
//         isActive,
//       });

//       showSuccess("User status updated successfully");
//       await loadData();
//     } catch (err) {
//       setError(err.response?.data?.message || "User update failed");
//     }
//   };

//   const updateSubscription = async (userId, plan, status) => {
//     try {
//       await API.patch(`/super-admin/subscriptions/${userId}`, {
//         plan,
//         status,
//       });

//       showSuccess("Subscription updated successfully");
//       await loadData();
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Subscription update failed"
//       );
//     }
//   };

//   const openPaymentDialog = (payment, status) => {
//     setSelectedPayment(payment);
//     setPaymentStatus(status);
//     setPaymentNote("");
//     setPaymentDialog(true);
//   };

//   const submitPaymentStatus = async () => {
//     if (!selectedPayment) return;

//     try {
//       await API.patch(
//         `/super-admin/payments/${selectedPayment.id}/status`,
//         {
//           status: paymentStatus,
//           admin_note: paymentNote,
//         }
//       );

//       setPaymentDialog(false);
//       setSelectedPayment(null);

//       showSuccess(
//         `Payment ${paymentStatus.toLowerCase()} successfully`
//       );

//       await loadData();
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Payment update failed"
//       );
//     }
//   };

//   const openTrialDialog = (trial) => {
//     setSelectedTrial(trial);
//     setTrialDays(7);
//     setTrialDialog(true);
//   };

//   const submitTrialExtension = async () => {
//     if (!selectedTrial) return;

//     const days = Number(trialDays);

//     if (!Number.isInteger(days) || days < 1 || days > 365) {
//       setError("Enter a trial extension between 1 and 365 days");
//       return;
//     }

//     try {
//       await API.patch(
//         `/super-admin/trials/${selectedTrial.id}`,
//         { days }
//       );

//       setTrialDialog(false);
//       setSelectedTrial(null);

//       showSuccess("Trial extended successfully");
//       await loadData();
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Trial update failed"
//       );
//     }
//   };

//   const renderStatus = (status) => (
//     <Chip
//       size="small"
//       label={status || "UNKNOWN"}
//       color={statusColor(status)}
//       variant="outlined"
//     />
//   );

//   const renderTable = (columns, rows) => (
//     <Box sx={{ width: "100%", overflowX: "auto" }}>
//       <Table size="small" sx={{ minWidth: 650 }}>
//         <TableHead>
//           <TableRow sx={{ bgcolor: "#F1F5F9" }}>
//             {columns.map((column) => (
//               <TableCell
//                 key={column}
//                 sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
//               >
//                 {column}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {rows.length === 0 ? (
//             <TableRow>
//               <TableCell
//                 colSpan={columns.length}
//                 align="center"
//                 sx={{ py: 5, color: "text.secondary" }}
//               >
//                 No records found
//               </TableCell>
//             </TableRow>
//           ) : (
//             rows.map((row, index) => (
//               <TableRow
//                 hover
//                 key={row.id ?? row.subscription_id ?? index}
//               >
//                 {row.cells.map((cell, i) => (
//                   <TableCell key={i} sx={{ whiteSpace: "nowrap" }}>
//                     {cell}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </Box>
//   );

//   const statCards = [
//     {
//       title: "Total Users",
//       value: stats.totalUsers || 0,
//       icon: <PeopleIcon color="primary" />,
//     },
//     {
//       title: "Active Users",
//       value: stats.activeUsers || 0,
//       icon: <CheckIcon color="success" />,
//     },
//     {
//       title: "Trial Users",
//       value: stats.trialUsers || 0,
//       icon: <PlanIcon color="info" />,
//     },
//     {
//       title: "Paid Users",
//       value: stats.paidUsers || 0,
//       icon: <PaymentsIcon color="success" />,
//     },
//     {
//       title: "Expired Users",
//       value: stats.expiredUsers || 0,
//       icon: <PeopleIcon color="error" />,
//     },
//     {
//       title: "Monthly Revenue",
//       value: money(stats.monthlyRevenue),
//       icon: <PaymentsIcon color="primary" />,
//     },
//     {
//       title: "Yearly Revenue",
//       value: money(stats.yearlyRevenue),
//       icon: <ReportIcon color="success" />,
//     },
//   ];

//   const renderDashboard = () => (
//     <>
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: {
//             xs: "1fr",
//             sm: "repeat(2, 1fr)",
//             lg: "repeat(4, 1fr)",
//           },
//           gap: 2,
//           mb: 3,
//         }}
//       >
//         {statCards.map((card) => (
//           <Paper
//             key={card.title}
//             elevation={0}
//             sx={{
//               p: 2.5,
//               borderRadius: 3,
//               border: "1px solid #E2E8F0",
//               bgcolor: "#fff",
//             }}
//           >
//             <Stack direction="row" justifyContent="space-between">
//               <Box>
//                 <Typography color="text.secondary" variant="body2">
//                   {card.title}
//                 </Typography>
//                 <Typography variant="h5" fontWeight={800} mt={1}>
//                   {card.value}
//                 </Typography>
//               </Box>
//               {card.icon}
//             </Stack>
//           </Paper>
//         ))}
//       </Box>

//       <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
//         <Typography variant="h6" fontWeight={700} mb={2}>
//           Recent Users
//         </Typography>

//         {renderTable(
//           ["ID", "Name", "Email", "Plan", "Status", "Account"],
//           recentUsers.map((user) => ({
//             id: user.id,
//             cells: [
//               user.id,
//               user.name,
//               user.email,
//               user.plan || "-",
//               renderStatus(user.subscription_status),
//               renderStatus(
//                 Number(user.is_active) === 1 ? "ACTIVE" : "INACTIVE"
//               ),
//             ],
//           }))
//         )}
//       </Paper>
//     </>
//   );

//   const renderUsers = () => {
//     const users = data.users || [];
//     const businesses = data.businesses || [];

//     return (
//       <Stack spacing={3}>
//         <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
//           <Typography variant="h6" fontWeight={700} mb={2}>
//             Users
//           </Typography>

//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search users by name, email or ID"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           {renderTable(
//             [
//               "ID",
//               "Business ID",
//               "Name",
//               "Email",
//               "Plan",
//               "Subscription",
//               "Account",
//               "Action",
//             ],
//             users.map((user) => ({
//               id: user.id,
//               cells: [
//                 user.id,
//                 user.business_id || "-",
//                 user.name,
//                 user.email,
//                 user.plan || "-",
//                 renderStatus(user.subscription_status),
//                 renderStatus(
//                   Number(user.is_active) === 1 ? "ACTIVE" : "INACTIVE"
//                 ),
//                 <Button
//                   size="small"
//                   color={
//                     Number(user.is_active) === 1 ? "error" : "success"
//                   }
//                   onClick={() =>
//                     updateUser(
//                       user.id,
//                       Number(user.is_active) !== 1
//                     )
//                   }
//                 >
//                   {Number(user.is_active) === 1
//                     ? "Deactivate"
//                     : "Activate"}
//                 </Button>,
//               ],
//             }))
//           )}
//         </Paper>

//         <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
//           <Typography variant="h6" fontWeight={700} mb={2}>
//             Businesses
//           </Typography>

//           {renderTable(
//             [
//               "Business ID",
//               "Business Name",
//               "Owner",
//               "Email",
//               "Subscription",
//               "Account",
//             ],
//             businesses.map((business) => ({
//               id: business.id,
//               cells: [
//                 business.id,
//                 business.business_name ||
//                   business.name ||
//                   business.company_name ||
//                   "-",
//                 business.user_name || "-",
//                 business.user_email || "-",
//                 renderStatus(business.subscription_status),
//                 renderStatus(
//                   Number(business.is_active) === 1 ? "ACTIVE" : "INACTIVE"
//                 ),
//               ],
//             }))
//           )}
//         </Paper>
//       </Stack>
//     );
//   };

//   const renderSubscriptions = () => (
//     <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
//       {renderTable(
//         [
//           "User",
//           "Email",
//           "Plan",
//           "Amount",
//           "Status",
//           "Update Status",
//         ],
//         (Array.isArray(data) ? data : []).map((subscription) => ({
//           id: subscription.id,
//           cells: [
//             subscription.name || subscription.user_id,
//             subscription.email || "-",
//             subscription.plan_name || "-",
//             money(subscription.amount),
//             renderStatus(subscription.status),
//             <TextField
//               select
//               size="small"
//               value={subscription.status || "TRIAL"}
//               sx={{ minWidth: 145 }}
//               onChange={(e) =>
//                 updateSubscription(
//                   subscription.user_id,
//                   subscription.plan_name,
//                   e.target.value
//                 )
//               }
//             >
//               {["TRIAL", "ACTIVE", "EXPIRED", "CANCELLED"].map(
//                 (value) => (
//                   <MenuItem value={value} key={value}>
//                     {value}
//                   </MenuItem>
//                 )
//               )}
//             </TextField>,
//           ],
//         }))
//       )}
//     </Paper>
//   );

//   const renderPayments = () => (
//     <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
//       {renderTable(
//         [
//           "ID",
//           "User",
//           "Email",
//           "Plan",
//           "Amount",
//           "UTR",
//           "Status",
//           "Date",
//           "Action",
//         ],
//         (Array.isArray(data) ? data : []).map((payment) => ({
//           id: payment.id,
//           cells: [
//             payment.id,
//             payment.name || payment.user_id,
//             payment.email || "-",
//             payment.plan_name || "-",
//             money(payment.amount),
//             payment.utr_number || "-",
//             renderStatus(payment.status),
//             payment.created_at || "-",
//             payment.status === "PENDING" ? (
//               <Stack direction="row" spacing={1}>
//                 <Button
//                   size="small"
//                   color="success"
//                   variant="contained"
//                   onClick={() =>
//                     openPaymentDialog(payment, "APPROVED")
//                   }
//                 >
//                   Approve
//                 </Button>

//                 <Button
//                   size="small"
//                   color="error"
//                   variant="outlined"
//                   onClick={() =>
//                     openPaymentDialog(payment, "REJECTED")
//                   }
//                 >
//                   Reject
//                 </Button>
//               </Stack>
//             ) : (
//               "-"
//             ),
//           ],
//         }))
//       )}
//     </Paper>
//   );

//   const renderPlans = () => (
//     <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
//       <Alert severity="info" sx={{ mb: 2 }}>
//         Plans are displayed from the existing backend data. Creating or
//         editing separate plans requires a supported backend implementation.
//       </Alert>

//       {renderTable(
//         ["Plan", "Amount", "Total Subscriptions"],
//         (Array.isArray(data) ? data : []).map((plan, index) => ({
//           id: index,
//           cells: [
//             plan.plan_name || "-",
//             money(plan.amount),
//             plan.total_subscriptions || 0,
//           ],
//         }))
//       )}
//     </Paper>
//   );

//   const renderTrials = () => (
//     <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
//       {renderTable(
//         [
//           "User",
//           "Email",
//           "Plan",
//           "Trial Start",
//           "Trial End",
//           "Status",
//           "Action",
//         ],
//         (Array.isArray(data) ? data : []).map((trial) => ({
//           id: trial.id,
//           cells: [
//             trial.name || "-",
//             trial.email || "-",
//             trial.plan || "-",
//             trial.trial_start_date || "-",
//             trial.trial_end_date || "-",
//             renderStatus(trial.subscription_status),
//             <Button
//               size="small"
//               variant="outlined"
//               onClick={() => openTrialDialog(trial)}
//             >
//               Extend Trial
//             </Button>,
//           ],
//         }))
//       )}
//     </Paper>
//   );

//   const renderReports = () => (
//     <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
//       <Typography variant="h6" fontWeight={700} mb={2}>
//         Monthly Revenue
//       </Typography>

//       {renderTable(
//         ["Month", "Revenue"],
//         (Array.isArray(data) ? data : []).map((report, index) => ({
//           id: index,
//           cells: [
//             report.month || "-",
//             money(report.revenue),
//           ],
//         }))
//       )}
//     </Paper>
//   );

//   const renderContent = () => {
//     if (tab === 0) return renderDashboard();
//     if (tab === 1) return renderUsers();
//     if (tab === 2) return renderSubscriptions();
//     if (tab === 3) return renderPayments();
//     if (tab === 4) return renderPlans();
//     if (tab === 5) return renderTrials();
//     if (tab === 9) return renderReports();

//     if (unavailableTabs[tab]) {
//       return (
//         <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
//           <Alert severity="warning">
//             {unavailableTabs[tab]}
//           </Alert>

//           <Typography color="text.secondary" mt={2}>
//             This section needs its own database table and backend
//             implementation before it can be enabled.
//           </Typography>
//         </Paper>
//       );
//     }

//     return null;
//   };

//   const handleTabChange = (index) => {
//     setTab(index);
//     setSearch("");
//     setError("");
//     setSuccess("");
//     setMobileOpen(false);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         width: "100%",
//         height: "100vh",
//         overflow: "hidden",
//         bgcolor: "#F4F6FB",
//       }}
//     >
//       {/* DESKTOP ADMIN SIDEBAR */}
//       {!isMobile && (
//         <Box
//           sx={{
//             width: 250,
//             height: "100vh",
//             position: "fixed",
//             top: 0,
//             left: 0,
//             flexShrink: 0,
//             zIndex: 1200,
//           }}
//         >
//           <AdminSidebar
//             tab={tab}
//             setTab={handleTabChange}
//           />
//         </Box>
//       )}

//       {/* MOBILE ADMIN SIDEBAR */}
//       <Drawer
//         open={mobileOpen}
//         onClose={() => setMobileOpen(false)}
//         PaperProps={{
//           sx: {
//             width: 250,
//             bgcolor: "#172554",
//             overflow: "hidden",
//           },
//         }}
//       >
//         <Box
//           sx={{
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
//             <IconButton
//               onClick={() => setMobileOpen(false)}
//               sx={{ color: "#fff" }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <Box sx={{ flex: 1, minHeight: 0 }}>
//             <AdminSidebar
//               tab={tab}
//               setTab={handleTabChange}
//             />
//           </Box>
//         </Box>
//       </Drawer>

//       {/* MAIN CONTENT - INDEPENDENT SCROLL */}
//       <Box
//         component="main"
//         sx={{
//           ml: { xs: 0, md: "250px" },
//           width: { xs: "100%", md: "calc(100% - 250px)" },
//           height: "100vh",
//           minWidth: 0,
//           overflowY: "auto",
//           overflowX: "hidden",
//           p: { xs: 2, md: 3 },
//           boxSizing: "border-box",
//         }}
//       >
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           mb={3}
//         >
//           <Stack direction="row" alignItems="center" spacing={1}>
//             {isMobile && (
//               <IconButton
//                 onClick={() => setMobileOpen(true)}
//                 sx={{
//                   bgcolor: "#fff",
//                   border: "1px solid #E2E8F0",
//                 }}
//               >
//                 <MenuIcon />
//               </IconButton>
//             )}

//             <Box>
//               <Typography
//                 variant="h5"
//                 fontWeight={800}
//                 color="#172554"
//               >
//                 {menuItems[tab].label}
//               </Typography>

//               <Typography color="text.secondary" variant="body2">
//                 CloudBill Super Admin Management
//               </Typography>
//             </Box>
//           </Stack>

//           <IconButton
//             onClick={loadData}
//             disabled={loading}
//             sx={{
//               bgcolor: "#fff",
//               border: "1px solid #E2E8F0",
//             }}
//           >
//             <RefreshIcon />
//           </IconButton>
//         </Stack>

//         {error && (
//           <Alert
//             severity="error"
//             sx={{ mb: 2 }}
//             onClose={() => setError("")}
//           >
//             {error}
//           </Alert>
//         )}

//         {success && (
//           <Alert
//             severity="success"
//             sx={{ mb: 2 }}
//             onClose={() => setSuccess("")}
//           >
//             {success}
//           </Alert>
//         )}

//         {loading ? (
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             minHeight="300px"
//           >
//             <CircularProgress />
//           </Box>
//         ) : (
//           renderContent()
//         )}
//       </Box>

//       {/* PAYMENT APPROVAL DIALOG */}
//       <Dialog
//         open={paymentDialog}
//         onClose={() => setPaymentDialog(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           {paymentStatus === "APPROVED"
//             ? "Approve Payment"
//             : "Reject Payment"}
//         </DialogTitle>

//         <DialogContent>
//           <Typography variant="body2" color="text.secondary" mb={2}>
//             Payment ID: {selectedPayment?.id}
//             {" | "}
//             Amount: {money(selectedPayment?.amount)}
//           </Typography>

//           <TextField
//             fullWidth
//             multiline
//             rows={3}
//             label="Admin Note"
//             value={paymentNote}
//             onChange={(e) => setPaymentNote(e.target.value)}
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setPaymentDialog(false)}>
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             color={paymentStatus === "APPROVED" ? "success" : "error"}
//             onClick={submitPaymentStatus}
//           >
//             Confirm {paymentStatus}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* TRIAL EXTENSION DIALOG */}
//       <Dialog
//         open={trialDialog}
//         onClose={() => setTrialDialog(false)}
//         fullWidth
//         maxWidth="xs"
//       >
//         <DialogTitle>Extend Trial</DialogTitle>

//         <DialogContent>
//           <Typography color="text.secondary" mb={2}>
//             User: {selectedTrial?.name}
//           </Typography>

//           <TextField
//             fullWidth
//             type="number"
//             label="Additional Days"
//             value={trialDays}
//             onChange={(e) => setTrialDays(e.target.value)}
//             inputProps={{ min: 1, max: 365 }}
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setTrialDialog(false)}>
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             onClick={submitTrialExtension}
//           >
//             Extend Trial
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  useMediaQuery,
  useTheme,
  
} from "@mui/material";

import {
  Refresh as RefreshIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
People as PeopleIcon,
  PaymentsOutlined as PaymentsIcon,
  CardMembershipOutlined as PlanIcon,
  AssessmentOutlined as ReportIcon,
 CheckCircle as CheckIcon
} from "@mui/icons-material";

import AdminSidebar, {
  menuItems,
} from "../components/admin/AdminSidebar";

// API CONFIGURATION

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://cloud-billing-backend.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// MENU INDEX MAPPING

const endpoints = {
  1: "/super-admin/users",
  2: "/super-admin/subscriptions",
  3: "/super-admin/payments",
  4: "/super-admin/plans",
  5: "/super-admin/trials",
  6: "/super-admin/reports",
};

const responseKeys = {
  1: "users",
  2: "subscriptions",
  3: "payments",
  4: "plans",
  5: "trials",
  6: "monthly",
};

const unavailableTabs = {
  7: "Login Activity needs a login activity database table and backend API.",
  8: "System Settings needs a settings database table and backend API.",
};

// COMMON STYLES

const colors = {
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  text: "#1E293B",
  secondary: "#64748B",
  border: "#E5E7EB",
  background: "#F4F6FB",
  white: "#FFFFFF",
};

const paperStyle = {
  p: { xs: 1.5, sm: 2.5 },
  borderRadius: 2,
  border: `1px solid ${colors.border}`,
  bgcolor: colors.white,
  boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
};

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const statusColor = (status) => {
  const value = String(status || "").toUpperCase();

  if (["ACTIVE", "APPROVED", "RESOLVED"].includes(value)) {
    return "success";
  }

  if (["PENDING", "TRIAL", "IN_PROGRESS"].includes(value)) {
    return "warning";
  }

  if (
    ["EXPIRED", "REJECTED", "CANCELLED", "CLOSED", "INACTIVE"].includes(value)
  ) {
    return "error";
  }

  return "default";
};

const tableHeaderStyle = {
  fontWeight: 700,
  fontSize: 13,
  color: "#475569",
  bgcolor: "#F8FAFC",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #E2E8F0",
  py: 1.8,
};

const tableCellStyle = {
  fontSize: 13,
  color: "#334155",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #F1F5F9",
  py: 1.6,
};

export default function AdminPanel() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [tab, setTab] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("APPROVED");
  const [paymentNote, setPaymentNote] = useState("");

  const [trialDialog, setTrialDialog] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [trialDays, setTrialDays] = useState(7);

  // LOAD DASHBOARD

  const loadDashboard = useCallback(async () => {
    const response = await API.get("/super-admin/dashboard");

    setStats(response.data.stats || {});
    setRecentUsers(response.data.recentUsers || []);
  }, []);

  // LOAD TAB DATA

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (tab === 0) {
        await loadDashboard();
        setData([]);
        return;
      }

      if (tab === 1) {
        const [usersResponse, businessesResponse] =
          await Promise.all([
            API.get("/super-admin/users", {
              params: { search },
            }),
            API.get("/super-admin/businesses"),
          ]);

        setData({
          users: usersResponse.data.users || [],
          businesses:
            businessesResponse.data.businesses || [],
        });

        return;
      }

      // Sections without backend support

      if (unavailableTabs[tab]) {
        setData([]);
        return;
      }

      const response = await API.get(endpoints[tab]);

      const result =
        response.data[responseKeys[tab]];

      setData(
        Array.isArray(result)
          ? result
          : result || []
      );
    } catch (err) {
      setData([]);

      setError(
        err.response?.data?.message ||
          "Unable to load data. Please check the backend API."
      );
    } finally {
      setLoading(false);
    }
  }, [tab, search, loadDashboard]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // SUCCESS MESSAGE

  const showSuccess = (message) => {
    setSuccess(message);
    setError("");

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  // UPDATE USER

  const updateUser = async (id, isActive) => {
    try {
      await API.patch(
        `/super-admin/users/${id}/status`,
        { isActive }
      );

      showSuccess("User status updated successfully");

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "User update failed"
      );
    }
  };

  // UPDATE SUBSCRIPTION

  const updateSubscription = async (
    userId,
    plan,
    status
  ) => {
    try {
      await API.patch(
        `/super-admin/subscriptions/${userId}`,
        {
          plan,
          status,
        }
      );

      showSuccess(
        "Subscription updated successfully"
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Subscription update failed"
      );
    }
  };

  // PAYMENT APPROVAL

  const openPaymentDialog = (payment, status) => {
    setSelectedPayment(payment);
    setPaymentStatus(status);
    setPaymentNote("");
    setPaymentDialog(true);
  };

  const submitPaymentStatus = async () => {
    if (!selectedPayment) return;

    try {
      await API.patch(
        `/super-admin/payments/${selectedPayment.id}/status`,
        {
          status: paymentStatus,
          admin_note: paymentNote,
        }
      );

      setPaymentDialog(false);
      setSelectedPayment(null);

      showSuccess(
        `Payment ${paymentStatus.toLowerCase()} successfully`
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Payment update failed"
      );
    }
  };

  // TRIAL EXTENSION

  const openTrialDialog = (trial) => {
    setSelectedTrial(trial);
    setTrialDays(7);
    setTrialDialog(true);
  };

  const submitTrialExtension = async () => {
    if (!selectedTrial) return;

    const days = Number(trialDays);

    if (
      !Number.isInteger(days) ||
      days < 1 ||
      days > 365
    ) {
      setError(
        "Enter a trial extension between 1 and 365 days"
      );
      return;
    }

    try {
      await API.patch(
        `/super-admin/trials/${selectedTrial.id}`,
        { days }
      );

      setTrialDialog(false);
      setSelectedTrial(null);

      showSuccess("Trial extended successfully");

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Trial update failed"
      );
    }
  };

  // STATUS CHIP

  const renderStatus = (status) => (
    <Chip
      size="small"
      label={status || "UNKNOWN"}
      color={statusColor(status)}
      variant="outlined"
      sx={{
        fontWeight: 600,
        fontSize: 11,
        borderRadius: 1,
      }}
    />
  );

  // COMMON TABLE

  const renderTable = (columns, rows) => (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Table
        size="small"
        sx={{
          minWidth: 650,
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column}
                sx={tableHeaderStyle}
              >
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{
                  py: 6,
                  color: colors.secondary,
                  fontSize: 13,
                }}
              >
                No records found
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow
                hover
                key={
                  row.id ??
                  row.subscription_id ??
                  index
                }
                sx={{
                  "&:hover": {
                    bgcolor: "#F8FAFC",
                  },
                }}
              >
                {row.cells.map((cell, i) => (
                  <TableCell
                    key={i}
                    sx={tableCellStyle}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );

  // DASHBOARD STATISTICS

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: <PeopleIcon />,
      color: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      title: "Active Users",
      value: stats.activeUsers || 0,
      icon: <CheckIcon />,
      color: "#16A34A",
      bg: "#F0FDF4",
    },
    {
      title: "Trial Users",
      value: stats.trialUsers || 0,
      icon: <PlanIcon />,
      color: "#0891B2",
      bg: "#ECFEFF",
    },
    {
      title: "Paid Users",
      value: stats.paidUsers || 0,
      icon: <PaymentsIcon />,
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    {
      title: "Expired Users",
      value: stats.expiredUsers || 0,
      icon: <PeopleIcon />,
      color: "#DC2626",
      bg: "#FEF2F2",
    },
    {
      title: "Monthly Revenue",
      value: money(stats.monthlyRevenue),
      icon: <PaymentsIcon />,
      color: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      title: "Yearly Revenue",
      value: money(stats.yearlyRevenue),
      icon: <ReportIcon />,
      color: "#16A34A",
      bg: "#F0FDF4",
    },
  ];

  // DASHBOARD

  const renderDashboard = () => (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {statCards.map((card) => (
          <Paper
            key={card.title}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: `1px solid ${colors.border}`,
              bgcolor: colors.white,
              transition: "0.2s",
              "&:hover": {
                boxShadow:
                  "0 4px 12px rgba(15,23,42,0.07)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  {card.title}
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  mt={1}
                  color={colors.text}
                >
                  {card.value}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.color,
                }}
              >
                {card.icon}
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Paper elevation={0} sx={paperStyle}>
        <Typography
          variant="h6"
          fontWeight={700}
          color={colors.text}
          mb={2}
        >
          Recent Users
        </Typography>

        {renderTable(
          [
            "ID",
            "Name",
            "Email",
            "Plan",
            "Status",
            "Account",
          ],
          recentUsers.map((user) => ({
            id: user.id,
            cells: [
              user.id,
              user.name,
              user.email,
              user.plan || "-",
              renderStatus(
                user.subscription_status
              ),
              renderStatus(
                Number(user.is_active) === 1
                  ? "ACTIVE"
                  : "INACTIVE"
              ),
            ],
          }))
        )}
      </Paper>
    </>
  );

  // USERS AND BUSINESSES

  const renderUsers = () => {
    const users = data.users || [];
    const businesses = data.businesses || [];

    return (
      <Stack spacing={3}>
        <Paper elevation={0} sx={paperStyle}>
          <Typography
            variant="h6"
            fontWeight={700}
            color={colors.text}
            mb={2}
          >
            Users
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Search users by name, email or ID"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            sx={{
              mb: 2,
              maxWidth: 450,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#FFFFFF",
              },
            }}
          />

          {renderTable(
            [
              "ID",
              "Business ID",
              "Name",
              "Email",
              "Plan",
              "Subscription",
              "Account",
              "Action",
            ],
            users.map((user) => ({
              id: user.id,
              cells: [
                user.id,
                user.business_id || "-",
                user.name,
                user.email,
                user.plan || "-",
                renderStatus(
                  user.subscription_status
                ),
                renderStatus(
                  Number(user.is_active) === 1
                    ? "ACTIVE"
                    : "INACTIVE"
                ),
                <Button
                  size="small"
                  variant="outlined"
                  color={
                    Number(user.is_active) === 1
                      ? "error"
                      : "success"
                  }
                  onClick={() =>
                    updateUser(
                      user.id,
                      Number(user.is_active) !== 1
                    )
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: 1.5,
                    fontWeight: 600,
                  }}
                >
                  {Number(user.is_active) === 1
                    ? "Deactivate"
                    : "Activate"}
                </Button>,
              ],
            }))
          )}
        </Paper>

        <Paper elevation={0} sx={paperStyle}>
          <Typography
            variant="h6"
            fontWeight={700}
            color={colors.text}
            mb={2}
          >
            Businesses
          </Typography>

          {renderTable(
            [
              "Business ID",
              "Business Name",
              "Owner",
              "Email",
              "Subscription",
              "Account",
            ],
            businesses.map((business) => ({
              id: business.id,
              cells: [
                business.id,
                business.business_name ||
                  business.name ||
                  business.company_name ||
                  "-",
                business.user_name || "-",
                business.user_email || "-",
                renderStatus(
                  business.subscription_status
                ),
                renderStatus(
                  Number(business.is_active) === 1
                    ? "ACTIVE"
                    : "INACTIVE"
                ),
              ],
            }))
          )}
        </Paper>
      </Stack>
    );
  };

  // SUBSCRIPTIONS

  const renderSubscriptions = () => (
    <Paper elevation={0} sx={paperStyle}>
      <Typography
        variant="h6"
        fontWeight={700}
        color={colors.text}
        mb={2}
      >
        Subscription Management
      </Typography>

      {renderTable(
        [
          "User",
          "Email",
          "Plan",
          "Amount",
          "Status",
          "Update Status",
        ],
        (Array.isArray(data) ? data : []).map(
          (subscription) => ({
            id: subscription.id,
            cells: [
              subscription.name ||
                subscription.user_id,
              subscription.email || "-",
              subscription.plan_name || "-",
              money(subscription.amount),
              renderStatus(subscription.status),
              <TextField
                select
                size="small"
                value={
                  subscription.status || "TRIAL"
                }
                sx={{
                  minWidth: 145,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
                onChange={(e) =>
                  updateSubscription(
                    subscription.user_id,
                    subscription.plan_name,
                    e.target.value
                  )
                }
              >
                {[
                  "TRIAL",
                  "ACTIVE",
                  "EXPIRED",
                  "CANCELLED",
                ].map((value) => (
                  <MenuItem
                    value={value}
                    key={value}
                  >
                    {value}
                  </MenuItem>
                ))}
              </TextField>,
            ],
          })
        )
      )}
    </Paper>
  );

  // PAYMENT HISTORY

  const renderPayments = () => (
    <Paper elevation={0} sx={paperStyle}>
      <Typography
        variant="h6"
        fontWeight={700}
        color={colors.text}
        mb={2}
      >
        Payment History
      </Typography>

      {renderTable(
        [
          "ID",
          "User",
          "Email",
          "Plan",
          "Amount",
          "UTR",
          "Status",
          "Date",
          "Action",
        ],
        (Array.isArray(data) ? data : []).map(
          (payment) => ({
            id: payment.id,
            cells: [
              payment.id,
              payment.name || payment.user_id,
              payment.email || "-",
              payment.plan_name || "-",
              money(payment.amount),
              payment.utr_number || "-",
              renderStatus(payment.status),
              payment.created_at || "-",
              payment.status === "PENDING" ? (
                <Stack
                  direction="row"
                  spacing={1}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() =>
                      openPaymentDialog(
                        payment,
                        "APPROVED"
                      )
                    }
                    sx={{
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    Approve
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() =>
                      openPaymentDialog(
                        payment,
                        "REJECTED"
                      )
                    }
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    Reject
                  </Button>
                </Stack>
              ) : (
                "-"
              ),
            ],
          })
        )
      )}
    </Paper>
  );

  // MANAGE PLANS

  const renderPlans = () => (
    <Paper elevation={0} sx={paperStyle}>
      <Typography
        variant="h6"
        fontWeight={700}
        color={colors.text}
        mb={2}
      >
        Manage Plans
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Plans are displayed from existing backend data.
        Creating or editing separate plans requires
        a supported backend implementation.
      </Alert>

      {renderTable(
        [
          "Plan",
          "Amount",
          "Total Subscriptions",
        ],
        (Array.isArray(data) ? data : []).map(
          (plan, index) => ({
            id: index,
            cells: [
              plan.plan_name || "-",
              money(plan.amount),
              plan.total_subscriptions || 0,
            ],
          })
        )
      )}
    </Paper>
  );

  // TRIAL MANAGEMENT

  const renderTrials = () => (
    <Paper elevation={0} sx={paperStyle}>
      <Typography
        variant="h6"
        fontWeight={700}
        color={colors.text}
        mb={2}
      >
        Trial Management
      </Typography>

      {renderTable(
        [
          "User",
          "Email",
          "Plan",
          "Trial Start",
          "Trial End",
          "Status",
          "Action",
        ],
        (Array.isArray(data) ? data : []).map(
          (trial) => ({
            id: trial.id,
            cells: [
              trial.name || "-",
              trial.email || "-",
              trial.plan || "-",
              trial.trial_start_date || "-",
              trial.trial_end_date || "-",
              renderStatus(
                trial.subscription_status
              ),
              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  openTrialDialog(trial)
                }
                sx={{
                  textTransform: "none",
                  borderRadius: 1.5,
                  color: colors.primary,
                  borderColor: colors.primary,
                }}
              >
                Extend Trial
              </Button>,
            ],
          })
        )
      )}
    </Paper>
  );

  // REVENUE REPORTS

  const renderReports = () => (
    <Paper elevation={0} sx={paperStyle}>
      <Typography
        variant="h6"
        fontWeight={700}
        color={colors.text}
        mb={2}
      >
        Monthly Revenue
      </Typography>

      {renderTable(
        ["Month", "Revenue"],
        (Array.isArray(data) ? data : []).map(
          (report, index) => ({
            id: index,
            cells: [
              report.month || "-",
              money(report.revenue),
            ],
          })
        )
      )}
    </Paper>
  );

  // CONTENT ROUTING

  const renderContent = () => {
    if (tab === 0) return renderDashboard();
    if (tab === 1) return renderUsers();
    if (tab === 2) return renderSubscriptions();
    if (tab === 3) return renderPayments();
    if (tab === 4) return renderPlans();
    if (tab === 5) return renderTrials();
    if (tab === 6) return renderReports();

    if (unavailableTabs[tab]) {
      return (
        <Paper elevation={0} sx={paperStyle}>
          <Alert severity="warning">
            {unavailableTabs[tab]}
          </Alert>

          <Typography
            color="text.secondary"
            mt={2}
            fontSize={13}
          >
            This section needs its own database table
            and backend implementation before it can
            be enabled.
          </Typography>
        </Paper>
      );
    }

    return null;
  };

  // MENU NAVIGATION

  const handleTabChange = (index) => {
    setTab(index);
    setSearch("");
    setError("");
    setSuccess("");
    setMobileOpen(false);
  };

  // MAIN UI

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        bgcolor: colors.background,
      }}
    >
      {/* DESKTOP SIDEBAR */}

      {!isMobile && (
        <Box
          sx={{
            width: 250,
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            flexShrink: 0,
            zIndex: 1200,
          }}
        >
          <AdminSidebar
            tab={tab}
            setTab={handleTabChange}
          />
        </Box>
      )}

      {/* MOBILE DRAWER */}

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 250,
            bgcolor: "#FFFFFF",
            borderRight: `1px solid ${colors.border}`,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
            }}
          >
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{ color: "#475569" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
            }}
          >
            <AdminSidebar
              tab={tab}
              setTab={handleTabChange}
            />
          </Box>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}

      <Box
        component="main"
        sx={{
          ml: { xs: 0, md: "250px" },
          width: {
            xs: "100%",
            md: "calc(100% - 250px)",
          },
          height: "100vh",
          minWidth: 0,
          overflowY: "auto",
          overflowX: "hidden",
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
          boxSizing: "border-box",
        }}
      >
        {/* TOP HEADER */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
          >
            {isMobile && (
              <IconButton
                onClick={() =>
                  setMobileOpen(true)
                }
                sx={{
                  bgcolor: "#FFFFFF",
                  border: `1px solid ${colors.border}`,
                  borderRadius: 2,
                  color: colors.text,
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box>
              <Typography
                variant="h5"
                fontWeight={750}
                color={colors.text}
                sx={{
                  fontSize: {
                    xs: 20,
                    md: 24,
                  },
                }}
              >
                {menuItems[tab]?.label || "Dashboard"}
              </Typography>

              <Typography
                color={colors.secondary}
                variant="body2"
                sx={{ fontSize: 12 }}
              >
                CloudBill Super Admin Management
              </Typography>
            </Box>
          </Stack>

          <IconButton
            onClick={loadData}
            disabled={loading}
            sx={{
              bgcolor: "#FFFFFF",
              border: `1px solid ${colors.border}`,
              borderRadius: 2,
              color: colors.primary,
              "&:hover": {
                bgcolor: colors.primaryLight,
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Stack>

        {/* ERROR */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* SUCCESS */}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {/* PAGE CONTENT */}

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress
              size={32}
              sx={{ color: colors.primary }}
            />
          </Box>
        ) : (
          renderContent()
        )}
      </Box>

      {/* PAYMENT APPROVAL DIALOG */}

      <Dialog
        open={paymentDialog}
        onClose={() =>
          setPaymentDialog(false)
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          fontWeight={700}
          color={colors.text}
        >
          {paymentStatus === "APPROVED"
            ? "Approve Payment"
            : "Reject Payment"}
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
          >
            Payment ID: {selectedPayment?.id}
            {" | "}
            Amount: {money(selectedPayment?.amount)}
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Admin Note"
            placeholder="Enter payment verification note"
            value={paymentNote}
            onChange={(e) =>
              setPaymentNote(e.target.value)
            }
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() =>
              setPaymentDialog(false)
            }
            sx={{
              color: colors.secondary,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color={
              paymentStatus === "APPROVED"
                ? "success"
                : "error"
            }
            onClick={submitPaymentStatus}
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              boxShadow: "none",
            }}
          >
            Confirm {paymentStatus}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TRIAL EXTENSION DIALOG */}

      <Dialog
        open={trialDialog}
        onClose={() =>
          setTrialDialog(false)
        }
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          fontWeight={700}
          color={colors.text}
        >
          Extend Trial
        </DialogTitle>

        <DialogContent>
          <Typography
            color="text.secondary"
            mb={2}
            fontSize={13}
          >
            User: {selectedTrial?.name}
          </Typography>

          <TextField
            fullWidth
            type="number"
            label="Additional Days"
            value={trialDays}
            onChange={(e) =>
              setTrialDays(e.target.value)
            }
            inputProps={{
              min: 1,
              max: 365,
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() =>
              setTrialDialog(false)
            }
            sx={{
              color: colors.secondary,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={submitTrialExtension}
            sx={{
              bgcolor: colors.primary,
              textTransform: "none",
              borderRadius: 1.5,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#1D4ED8",
                boxShadow: "none",
              },
            }}
          >
            Extend Trial
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
