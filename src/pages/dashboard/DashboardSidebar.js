

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Avatar,
//   Box,
//   Divider,
//   IconButton,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Tooltip,
//   Typography,
// } from "@mui/material";

// import {
//   Dashboard as DashboardIcon,
//   ReceiptLong,
//   Inventory2,
//   People,
//   Assessment,
//   AccountBalanceWallet,
//   Settings,
//   CreditCard,
//   Logout,
//   Close,
// } from "@mui/icons-material";

// import { useNavigate, useLocation } from "react-router-dom";
// // http://localhost:5000/api
// const API_URL =
//   process.env.REACT_APP_API_URL || "https://cloud-billing-backend.onrender.com/api";

// const DashboardSidebar = ({ mobileOpen, setMobileOpen }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [subscription, setSubscription] = useState(null);

//   // Fetch actual subscription from backend
//   useEffect(() => {
//     let cancelled = false;

//     const fetchSubscription = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setSubscription(null);
//         return;
//       }

//       try {
//         const response = await axios.get(`${API_URL}/subscription`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!cancelled) {
//           setSubscription(response.data?.subscription || null);
//         }
//       } catch (error) {
//         console.error(
//           "Failed to fetch subscription:",
//           error.response?.data?.message || error.message
//         );

//         if (!cancelled) {
//           setSubscription(null);
//         }
//       }
//     };

//     fetchSubscription();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const menuItems = [
//     { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
//     { label: "Billing", icon: <ReceiptLong />, path: "/billing/create" },
//     { label: "Products", icon: <Inventory2 />, path: "/products" },
//     { label: "Customers", icon: <People />, path: "/customers" },
//     { label: "Reports", icon: <Assessment />, path: "/reports" },
//     {
//       label: "Expenses",
//       icon: <AccountBalanceWallet />,
//       path: "/expenses",
//     },
//   ];

//   const bottomItems = [
//     { label: "Subscription", icon: <CreditCard />, path: "/subscription" },
//     { label: "Settings", icon: <Settings />, path: "/settings" },
//   ];

//   const handleNavigation = (path) => {
//     navigate(path);
//     setMobileOpen?.(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setMobileOpen?.(false);
//     navigate("/login", { replace: true });
//   };

//   // Use the backend trial date to calculate remaining days.
//   const getDaysRemaining = (dateValue) => {
//     if (!dateValue) return null;

//     // Parse a MySQL DATE (YYYY-MM-DD) as a local calendar date.
//     const dateString = String(dateValue).slice(0, 10);
//     const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);

//     let endDate;

//     if (match) {
//       endDate = new Date(
//         Number(match[1]),
//         Number(match[2]) - 1,
//         Number(match[3])
//       );
//     } else {
//       endDate = new Date(dateValue);

//       if (Number.isNaN(endDate.getTime())) return null;

//       endDate.setHours(0, 0, 0, 0);
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     return Math.max(
//       0,
//       Math.ceil((endDate.getTime() - today.getTime()) / 86400000)
//     );
//   };

//   // The GET API returns status as subscription.status.
//   const status = String(
//     subscription?.status ||
//     subscription?.subscription_status ||
//     ""
//   ).toUpperCase();

//   const isTrial = status === "TRIAL";

//   const daysRemaining = isTrial
//     ? getDaysRemaining(
//         subscription?.trial_end_date ||
//         subscription?.user_trial_end_date
//       )
//     : null;

//   const trialProgress =
//     isTrial && daysRemaining !== null
//       ? Math.min(100, Math.max(0, ((30 - daysRemaining) / 30) * 100))
//       : status === "ACTIVE"
//         ? 100
//         : 0;

//   const getStatusLabel = () => {
//     if (!subscription) return "SUBSCRIPTION";

//     if (isTrial) return "FREE TRIAL";
//     if (status === "ACTIVE") return "PAID SUBSCRIPTION";
//     if (status === "EXPIRED") return "SUBSCRIPTION EXPIRED";
//     if (status === "CANCELLED") return "SUBSCRIPTION CANCELLED";

//     return status || "SUBSCRIPTION";
//   };

//   const getStatusDescription = () => {
//     if (!subscription) return "Subscription details unavailable";

//     if (isTrial) {
//       if (daysRemaining === null) return "Trial end date unavailable";

//       return daysRemaining > 0
//         ? `${daysRemaining} days remaining`
//         : "Free trial expired";
//     }

//     if (status === "ACTIVE") {
//       return subscription.plan_name
//         ? `${subscription.plan_name} plan active`
//         : "Paid plan active";
//     }

//     if (status === "EXPIRED") return "Please renew your plan";
//     if (status === "CANCELLED") return "Contact support to renew";

//     return status || "Status unavailable";
//   };

//   const sidebarContent = (
//     <Box
//       sx={{
//         height: "100dvh",
//         width: 260,
//         display: "flex",
//         flexDirection: "column",
//         background: "linear-gradient(180deg, #111827 0%, #1E1B4B 100%)",
//         color: "#FFFFFF",
//         overflowY: "auto",
//         overflowX: "hidden",
//         boxSizing: "border-box",
//       }}
//     >
//       {/* LOGO */}
//       <Box
//         sx={{
//           px: 2.5,
//           py: 2.5,
//           display: "flex",
//           alignItems: "center",
//           gap: 1.3,
//           flexShrink: 0,
//         }}
//       >
//         <Avatar
//           sx={{
//             width: 40,
//             height: 40,
//             borderRadius: "11px",
//             background: "linear-gradient(135deg, #6366F1, #2563EB)",
//             fontWeight: 800,
//           }}
//         >
//           C
//         </Avatar>

//         <Box>
//           <Typography sx={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>
//             CloudBill
//           </Typography>
//           <Typography sx={{ fontSize: 10, color: "#94A3B8", mt: 0.4 }}>
//             Smart Billing Software
//           </Typography>
//         </Box>

//         <IconButton
//           onClick={() => setMobileOpen?.(false)}
//           aria-label="Close navigation"
//           sx={{
//             ml: "auto",
//             display: { xs: "flex", md: "none" },
//             color: "#CBD5E1",
//           }}
//         >
//           <Close />
//         </IconButton>
//       </Box>

//       <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

//       {/* MAIN MENU */}
//       <Box sx={{ px: 1.5, pt: 2 }}>
//         <Typography
//           sx={{
//             px: 1.5,
//             mb: 1,
//             fontSize: 10,
//             fontWeight: 800,
//             color: "#64748B",
//             letterSpacing: 1,
//             textTransform: "uppercase",
//           }}
//         >
//           Main Menu
//         </Typography>

//         <List disablePadding>
//           {menuItems.map((item) => {
//             const active =
//               location.pathname === item.path ||
//               (item.path === "/billing/create" &&
//                 location.pathname.startsWith("/billing"));

//             return (
//               <Tooltip key={item.label} title={item.label} placement="right">
//                 <ListItemButton
//                   onClick={() => handleNavigation(item.path)}
//                   sx={{
//                     minHeight: 46,
//                     mb: 0.5,
//                     px: 1.5,
//                     borderRadius: "11px",
//                     color: active ? "#FFFFFF" : "#94A3B8",
//                     backgroundColor: active
//                       ? "rgba(99,102,241,0.20)"
//                       : "transparent",
//                     border: active
//                       ? "1px solid rgba(129,140,248,0.20)"
//                       : "1px solid transparent",
//                     "&:hover": {
//                       color: "#FFFFFF",
//                       backgroundColor: "rgba(99,102,241,0.14)",
//                     },
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: 38,
//                       color: active ? "#A5B4FC" : "#64748B",
//                     }}
//                   >
//                     {React.cloneElement(item.icon, {
//                       sx: { fontSize: 20 },
//                     })}
//                   </ListItemIcon>

//                   <ListItemText
//                     primary={item.label}
//                     primaryTypographyProps={{
//                       fontSize: 13,
//                       fontWeight: active ? 700 : 500,
//                     }}
//                   />
//                 </ListItemButton>
//               </Tooltip>
//             );
//           })}
//         </List>
//       </Box>

//       {/* MANAGE MENU */}
//       <Box sx={{ px: 1.5, mt: 2 }}>
//         <Typography
//           sx={{
//             px: 1.5,
//             mb: 1,
//             fontSize: 10,
//             fontWeight: 800,
//             color: "#64748B",
//             letterSpacing: 1,
//             textTransform: "uppercase",
//           }}
//         >
//           Manage
//         </Typography>

//         <List disablePadding>
//           {bottomItems.map((item) => {
//             const active =
//               location.pathname === item.path ||
//               (item.path !== "/" &&
//                 location.pathname.startsWith(`${item.path}/`));

//             return (
//               <ListItemButton
//                 key={item.label}
//                 onClick={() => handleNavigation(item.path)}
//                 sx={{
//                   minHeight: 44,
//                   mb: 0.5,
//                   px: 1.5,
//                   borderRadius: "11px",
//                   color: active ? "#FFFFFF" : "#94A3B8",
//                   backgroundColor: active
//                     ? "rgba(99,102,241,0.20)"
//                     : "transparent",
//                   "&:hover": {
//                     color: "#FFFFFF",
//                     backgroundColor: "rgba(99,102,241,0.14)",
//                   },
//                 }}
//               >
//                 <ListItemIcon
//                   sx={{
//                     minWidth: 38,
//                     color: active ? "#A5B4FC" : "#64748B",
//                   }}
//                 >
//                   {React.cloneElement(item.icon, {
//                     sx: { fontSize: 19 },
//                   })}
//                 </ListItemIcon>

//                 <ListItemText
//                   primary={item.label}
//                   primaryTypographyProps={{
//                     fontSize: 13,
//                     fontWeight: active ? 700 : 500,
//                   }}
//                 />
//               </ListItemButton>
//             );
//           })}
//         </List>
//       </Box>

//       {/* REAL SUBSCRIPTION / TRIAL CARD */}
//       <Box sx={{ mt: "auto", px: 2, py: 2, flexShrink: 0 }}>
//         <Box
//           sx={{
//             p: 1.8,
//             borderRadius: "14px",
//             background:
//               "linear-gradient(135deg, rgba(79,70,229,0.25), rgba(37,99,235,0.15))",
//             border: "1px solid rgba(129,140,248,0.15)",
//           }}
//         >
//           <Typography
//             sx={{
//               fontSize: 11,
//               color: "#A5B4FC",
//               fontWeight: 700,
//             }}
//           >
//             {getStatusLabel()}
//           </Typography>

//           <Typography sx={{ fontSize: 13, fontWeight: 700, mt: 0.5 }}>
//             {getStatusDescription()}
//           </Typography>

//           <Box
//             sx={{
//               height: 5,
//               borderRadius: 5,
//               backgroundColor: "rgba(255,255,255,0.10)",
//               mt: 1.2,
//               overflow: "hidden",
//             }}
//           >
//             <Box
//               sx={{
//                 width: `${trialProgress}%`,
//                 height: "100%",
//                 borderRadius: 5,
//                 background: "linear-gradient(90deg, #818CF8, #60A5FA)",
//                 transition: "width 0.3s ease",
//               }}
//             />
//           </Box>

//           {subscription?.plan_name && (
//             <Typography
//               sx={{ fontSize: 10, color: "#94A3B8", mt: 1 }}
//             >
//               Current plan: {subscription.plan_name}
//             </Typography>
//           )}
//         </Box>
//       </Box>

//       {/* LOGOUT */}
//       <Box sx={{ px: 1.5, pb: 2, flexShrink: 0 }}>
//         <ListItemButton
//           onClick={handleLogout}
//           sx={{
//             minHeight: 44,
//             px: 1.5,
//             borderRadius: "11px",
//             color: "#94A3B8",
//             "&:hover": {
//               color: "#FCA5A5",
//               backgroundColor: "rgba(239,68,68,0.08)",
//             },
//           }}
//         >
//           <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
//             <Logout sx={{ fontSize: 19 }} />
//           </ListItemIcon>

//           <ListItemText
//             primary="Logout"
//             primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
//           />
//         </ListItemButton>
//       </Box>
//     </Box>
//   );

//   return (
//     <>
//       {/* DESKTOP NAVIGATION */}
//       <Box
//         sx={{
//           display: { xs: "none", md: "block" },
//           width: 260,
//           flexShrink: 0,
//         }}
//       >
//         {sidebarContent}
//       </Box>

//       {/* MOBILE NAVIGATION */}
//       {mobileOpen && (
//         <Box
//           onClick={() => setMobileOpen?.(false)}
//           sx={{
//             display: { xs: "block", md: "none" },
//             position: "fixed",
//             inset: 0,
//             zIndex: 1400,
//             backgroundColor: "rgba(15,23,42,0.55)",
//           }}
//         >
//           <Box
//             onClick={(event) => event.stopPropagation()}
//             sx={{
//               width: 260,
//               maxWidth: "85vw",
//               height: "100dvh",
//             }}
//           >
//             {sidebarContent}
//           </Box>
//         </Box>
//       )}
//     </>
//   );
// };

// export default DashboardSidebar;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Avatar,
//   Box,
//   Divider,
//   IconButton,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Tooltip,
//   Typography,
// } from "@mui/material";

// import {
//   Dashboard as DashboardIcon,
//   ReceiptLong,
//   Inventory2,
//   People,
//   Assessment,
//   AccountBalanceWallet,
//   Settings,
//   CreditCard,
//   Logout,
//   Close,
// } from "@mui/icons-material";

// import { useNavigate, useLocation } from "react-router-dom";

// const API_URL =
//   process.env.REACT_APP_API_URL ||
//   "https://cloud-billing-backend.onrender.com/api";

// const DashboardSidebar = ({ mobileOpen, setMobileOpen }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [subscription, setSubscription] = useState(null);

//   // FETCH SUBSCRIPTION
//   useEffect(() => {
//     let cancelled = false;

//     const fetchSubscription = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setSubscription(null);
//         return;
//       }

//       try {
//         const response = await axios.get(`${API_URL}/subscription`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!cancelled) {
//           setSubscription(response.data?.subscription || null);
//         }
//       } catch (error) {
//         console.error(
//           "Failed to fetch subscription:",
//           error.response?.data?.message || error.message
//         );

//         if (!cancelled) {
//           setSubscription(null);
//         }
//       }
//     };

//     fetchSubscription();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // MAIN MENU
//   const menuItems = [
//     { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
//     { label: "Billing", icon: <ReceiptLong />, path: "/billing/create" },
//     { label: "Products", icon: <Inventory2 />, path: "/products" },
//     { label: "Customers", icon: <People />, path: "/customers" },
//     { label: "Reports", icon: <Assessment />, path: "/reports" },
//     {
//       label: "Expenses",
//       icon: <AccountBalanceWallet />,
//       path: "/expenses",
//     },
//   ];

//   // MANAGE MENU
//   const bottomItems = [
//     { label: "Subscription", icon: <CreditCard />, path: "/subscription" },
//     { label: "Settings", icon: <Settings />, path: "/settings" },
//   ];

//   const handleNavigation = (path) => {
//     navigate(path);
//     setMobileOpen?.(false);
//   };

//   // LOGOUT
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     setMobileOpen?.(false);

//     navigate("/login", { replace: true });
//   };

//   // TRIAL DAYS CALCULATION
//   const getDaysRemaining = (dateValue) => {
//     if (!dateValue) return null;

//     const dateString = String(dateValue).slice(0, 10);
//     const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);

//     let endDate;

//     if (match) {
//       endDate = new Date(
//         Number(match[1]),
//         Number(match[2]) - 1,
//         Number(match[3])
//       );
//     } else {
//       endDate = new Date(dateValue);

//       if (Number.isNaN(endDate.getTime())) return null;

//       endDate.setHours(0, 0, 0, 0);
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     return Math.max(
//       0,
//       Math.ceil((endDate.getTime() - today.getTime()) / 86400000)
//     );
//   };

//   const status = String(
//     subscription?.status ||
//       subscription?.subscription_status ||
//       ""
//   ).toUpperCase();

//   const isTrial = status === "TRIAL";

//   const daysRemaining = isTrial
//     ? getDaysRemaining(
//         subscription?.trial_end_date ||
//           subscription?.user_trial_end_date
//       )
//     : null;

//   const trialProgress =
//     isTrial && daysRemaining !== null
//       ? Math.min(100, Math.max(0, ((30 - daysRemaining) / 30) * 100))
//       : status === "ACTIVE"
//       ? 100
//       : 0;

//   const getStatusLabel = () => {
//     if (!subscription) return "SUBSCRIPTION";

//     if (isTrial) return "FREE TRIAL";
//     if (status === "ACTIVE") return "PAID SUBSCRIPTION";
//     if (status === "EXPIRED") return "SUBSCRIPTION EXPIRED";
//     if (status === "CANCELLED") return "SUBSCRIPTION CANCELLED";

//     return status || "SUBSCRIPTION";
//   };

//   const getStatusDescription = () => {
//     if (!subscription) return "Subscription details unavailable";

//     if (isTrial) {
//       if (daysRemaining === null) return "Trial end date unavailable";

//       return daysRemaining > 0
//         ? `${daysRemaining} days remaining`
//         : "Free trial expired";
//     }

//     if (status === "ACTIVE") {
//       return subscription.plan_name
//         ? `${subscription.plan_name} plan active`
//         : "Paid plan active";
//     }

//     if (status === "EXPIRED") return "Please renew your plan";
//     if (status === "CANCELLED") return "Contact support to renew";

//     return status || "Status unavailable";
//   };

//   // SIDEBAR CONTENT
//   const sidebarContent = (
//     <Box
//       sx={{
//         width: 260,
//         height: "100%",
//         minHeight: 0,
//         display: "flex",
//         flexDirection: "column",
//         background: "linear-gradient(180deg, #111827 0%, #1E1B4B 100%)",
//         color: "#FFFFFF",
//         overflowY: "auto",
//         overflowX: "hidden",
//         boxSizing: "border-box",

//         "&::-webkit-scrollbar": {
//           width: "4px",
//         },

//         "&::-webkit-scrollbar-thumb": {
//           backgroundColor: "rgba(255,255,255,0.2)",
//           borderRadius: "10px",
//         },
//       }}
//     >
//       {/* LOGO */}
//       <Box
//         sx={{
//           px: 2.5,
//           py: 2.5,
//           display: "flex",
//           alignItems: "center",
//           gap: 1.3,
//           flexShrink: 0,
//         }}
//       >
//         <Avatar
//           sx={{
//             width: 40,
//             height: 40,
//             borderRadius: "11px",
//             background: "linear-gradient(135deg, #6366F1, #2563EB)",
//             fontWeight: 800,
//           }}
//         >
//           C
//         </Avatar>

//         <Box>
//           <Typography sx={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>
//             CloudBill
//           </Typography>

//           <Typography sx={{ fontSize: 10, color: "#94A3B8", mt: 0.4 }}>
//             Smart Billing Software
//           </Typography>
//         </Box>

//         <IconButton
//           onClick={() => setMobileOpen?.(false)}
//           aria-label="Close navigation"
//           sx={{
//             ml: "auto",
//             display: { xs: "flex", md: "none" },
//             color: "#CBD5E1",
//           }}
//         >
//           <Close />
//         </IconButton>
//       </Box>

//       <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

//       {/* MAIN MENU */}
//       <Box sx={{ px: 1.5, pt: 2, flexShrink: 0 }}>
//         <Typography
//           sx={{
//             px: 1.5,
//             mb: 1,
//             fontSize: 10,
//             fontWeight: 800,
//             color: "#64748B",
//             letterSpacing: 1,
//             textTransform: "uppercase",
//           }}
//         >
//           Main Menu
//         </Typography>

//         <List disablePadding>
//           {menuItems.map((item) => {
//             const active =
//               location.pathname === item.path ||
//               (item.path === "/billing/create" &&
//                 location.pathname.startsWith("/billing"));

//             return (
//               <Tooltip key={item.label} title={item.label} placement="right">
//                 <ListItemButton
//                   onClick={() => handleNavigation(item.path)}
//                   sx={{
//                     minHeight: 46,
//                     mb: 0.5,
//                     px: 1.5,
//                     borderRadius: "11px",
//                     color: active ? "#FFFFFF" : "#94A3B8",
//                     backgroundColor: active
//                       ? "rgba(99,102,241,0.20)"
//                       : "transparent",
//                     border: active
//                       ? "1px solid rgba(129,140,248,0.20)"
//                       : "1px solid transparent",
//                     "&:hover": {
//                       color: "#FFFFFF",
//                       backgroundColor: "rgba(99,102,241,0.14)",
//                     },
//                   }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: 38,
//                       color: active ? "#A5B4FC" : "#64748B",
//                     }}
//                   >
//                     {React.cloneElement(item.icon, {
//                       sx: { fontSize: 20 },
//                     })}
//                   </ListItemIcon>

//                   <ListItemText
//                     primary={item.label}
//                     primaryTypographyProps={{
//                       fontSize: 13,
//                       fontWeight: active ? 700 : 500,
//                     }}
//                   />
//                 </ListItemButton>
//               </Tooltip>
//             );
//           })}
//         </List>
//       </Box>

//       {/* MANAGE MENU */}
//       <Box sx={{ px: 1.5, mt: 2, flexShrink: 0 }}>
//         <Typography
//           sx={{
//             px: 1.5,
//             mb: 1,
//             fontSize: 10,
//             fontWeight: 800,
//             color: "#64748B",
//             letterSpacing: 1,
//             textTransform: "uppercase",
//           }}
//         >
//           Manage
//         </Typography>

//         <List disablePadding>
//           {bottomItems.map((item) => {
//             const active =
//               location.pathname === item.path ||
//               location.pathname.startsWith(`${item.path}/`);

//             return (
//               <ListItemButton
//                 key={item.label}
//                 onClick={() => handleNavigation(item.path)}
//                 sx={{
//                   minHeight: 44,
//                   mb: 0.5,
//                   px: 1.5,
//                   borderRadius: "11px",
//                   color: active ? "#FFFFFF" : "#94A3B8",
//                   backgroundColor: active
//                     ? "rgba(99,102,241,0.20)"
//                     : "transparent",
//                   "&:hover": {
//                     color: "#FFFFFF",
//                     backgroundColor: "rgba(99,102,241,0.14)",
//                   },
//                 }}
//               >
//                 <ListItemIcon
//                   sx={{
//                     minWidth: 38,
//                     color: active ? "#A5B4FC" : "#64748B",
//                   }}
//                 >
//                   {React.cloneElement(item.icon, {
//                     sx: { fontSize: 19 },
//                   })}
//                 </ListItemIcon>

//                 <ListItemText
//                   primary={item.label}
//                   primaryTypographyProps={{
//                     fontSize: 13,
//                     fontWeight: active ? 700 : 500,
//                   }}
//                 />
//               </ListItemButton>
//             );
//           })}
//         </List>
//       </Box>

//       {/* SUBSCRIPTION CARD */}
//       <Box sx={{ mt: "auto", px: 2, py: 2, flexShrink: 0 }}>
//         <Box
//           sx={{
//             p: 1.8,
//             borderRadius: "14px",
//             background:
//               "linear-gradient(135deg, rgba(79,70,229,0.25), rgba(37,99,235,0.15))",
//             border: "1px solid rgba(129,140,248,0.15)",
//           }}
//         >
//           <Typography
//             sx={{
//               fontSize: 11,
//               color: "#A5B4FC",
//               fontWeight: 700,
//             }}
//           >
//             {getStatusLabel()}
//           </Typography>

//           <Typography sx={{ fontSize: 13, fontWeight: 700, mt: 0.5 }}>
//             {getStatusDescription()}
//           </Typography>

//           <Box
//             sx={{
//               height: 5,
//               borderRadius: 5,
//               backgroundColor: "rgba(255,255,255,0.10)",
//               mt: 1.2,
//               overflow: "hidden",
//             }}
//           >
//             <Box
//               sx={{
//                 width: `${trialProgress}%`,
//                 height: "100%",
//                 borderRadius: 5,
//                 background: "linear-gradient(90deg, #818CF8, #60A5FA)",
//                 transition: "width 0.3s ease",
//               }}
//             />
//           </Box>

//           {subscription?.plan_name && (
//             <Typography sx={{ fontSize: 10, color: "#94A3B8", mt: 1 }}>
//               Current plan: {subscription.plan_name}
//             </Typography>
//           )}
//         </Box>
//       </Box>

//       {/* LOGOUT */}
//       <Box sx={{ px: 1.5, pb: 2, flexShrink: 0 }}>
//         <ListItemButton
//           onClick={handleLogout}
//           sx={{
//             minHeight: 44,
//             px: 1.5,
//             borderRadius: "11px",
//             color: "#94A3B8",
//             "&:hover": {
//               color: "#FCA5A5",
//               backgroundColor: "rgba(239,68,68,0.08)",
//             },
//           }}
//         >
//           <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
//             <Logout sx={{ fontSize: 19 }} />
//           </ListItemIcon>

//           <ListItemText
//             primary="Logout"
//             primaryTypographyProps={{
//               fontSize: 13,
//               fontWeight: 600,
//             }}
//           />
//         </ListItemButton>
//       </Box>
//     </Box>
//   );

//   return (
//     <>
//       {/* DESKTOP FIXED SIDEBAR */}
//       <Box
//         sx={{
//           display: { xs: "none", md: "block" },
//           position: "fixed",
//           top: 0,
//           left: 0,
//           bottom: 0,
//           width: 260,
//           height: "100dvh",
//           zIndex: 1200,
//           overflow: "hidden",
//         }}
//       >
//         {sidebarContent}
//       </Box>

//       {/* MOBILE SIDEBAR */}
//       {mobileOpen && (
//         <Box
//           onClick={() => setMobileOpen?.(false)}
//           sx={{
//             display: { xs: "block", md: "none" },
//             position: "fixed",
//             inset: 0,
//             zIndex: 1400,
//             backgroundColor: "rgba(15,23,42,0.55)",
//           }}
//         >
//           <Box
//             onClick={(event) => event.stopPropagation()}
//             sx={{
//               width: 260,
//               maxWidth: "85vw",
//               height: "100dvh",
//               position: "fixed",
//               top: 0,
//               left: 0,
//             }}
//           >
//             {sidebarContent}
//           </Box>
//         </Box>
//       )}
//     </>
//   );
// };

// export default DashboardSidebar;

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  ReceiptLong,
  Inventory2,
  People,
  Assessment,
  AccountBalanceWallet,
  Settings,
  CreditCard,
  Logout,
  Close,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://cloud-billing-backend.onrender.com/api";

const DashboardSidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [subscription, setSubscription] = useState(null);

  // FETCH SUBSCRIPTION
  useEffect(() => {
    let cancelled = false;

    const fetchSubscription = async () => {
      const token = localStorage.getItem("token");

      let savedUser = {};

      try {
        savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      } catch {
        savedUser = {};
      }

      if (!token) {
        setSubscription(null);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/subscription`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Subscription API Response:", response.data);

        const apiData = response.data;

        const subscriptionData =
          apiData?.subscription ||
          apiData?.data?.subscription ||
          apiData?.data ||
          {};

        const finalData = {
          ...savedUser,
          ...subscriptionData,
        };

        if (!cancelled) {
          setSubscription(finalData);
        }
      } catch (error) {
        console.error(
          "Subscription API Error:",
          error.response?.data || error.message
        );

        // Use saved user details if API fails
        if (!cancelled) {
          setSubscription(savedUser);
        }
      }
    };

    fetchSubscription();

    return () => {
      cancelled = true;
    };
  }, []);

  // MAIN MENU
  const menuItems = [
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      label: "Billing",
      icon: <ReceiptLong />,
      path: "/billing/create",
    },
    {
      label: "Products",
      icon: <Inventory2 />,
      path: "/products",
    },
    {
      label: "Customers",
      icon: <People />,
      path: "/customers",
    },
    {
      label: "Reports",
      icon: <Assessment />,
      path: "/reports",
    },
    {
      label: "Expenses",
      icon: <AccountBalanceWallet />,
      path: "/expenses",
    },
  ];

  // MANAGE MENU
  const bottomItems = [
    {
      label: "Subscription",
      icon: <CreditCard />,
      path: "/subscription",
    },
    {
      label: "Settings",
      icon: <Settings />,
      path: "/settings",
    },
  ];

  // NAVIGATION
  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen?.(false);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMobileOpen?.(false);
    navigate("/login", { replace: true });
  };

  // DATE CALCULATION
  const getDaysRemaining = (dateValue) => {
    if (!dateValue) return null;

    const dateString = String(dateValue).slice(0, 10);

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);

    let endDate;

    if (match) {
      endDate = new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
      );
    } else {
      endDate = new Date(dateValue);

      if (Number.isNaN(endDate.getTime())) {
        return null;
      }

      endDate.setHours(0, 0, 0, 0);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Math.max(
      0,
      Math.ceil(
        (endDate.getTime() - today.getTime()) / 86400000
      )
    );
  };

  // SUBSCRIPTION STATUS
  const status = String(
    subscription?.status ||
      subscription?.subscription_status ||
      ""
  ).toUpperCase();

  const isTrial = status === "TRIAL";
  const isActive = status === "ACTIVE";

  const trialEndDate =
    subscription?.trial_end_date ||
    subscription?.user_trial_end_date;

  const daysRemaining = isTrial
    ? getDaysRemaining(trialEndDate)
    : null;

  const trialProgress =
    isTrial && daysRemaining !== null
      ? Math.min(
          100,
          Math.max(0, ((30 - daysRemaining) / 30) * 100)
        )
      : isActive
      ? 100
      : 0;

  // STATUS LABEL
  const getStatusLabel = () => {
    if (!subscription || !status) {
      return "SUBSCRIPTION";
    }

    if (isTrial) return "FREE TRIAL";
    if (isActive) return "PAID SUBSCRIPTION";
    if (status === "EXPIRED") return "SUBSCRIPTION EXPIRED";
    if (status === "CANCELLED") return "SUBSCRIPTION CANCELLED";

    return status;
  };

  // STATUS DESCRIPTION
  const getStatusDescription = () => {
    if (!subscription || !status) {
      return "Subscription details unavailable";
    }

    if (isTrial) {
      if (daysRemaining === null) {
        return "Trial end date unavailable";
      }

      return daysRemaining > 0
        ? `${daysRemaining} days remaining`
        : "Free trial expired";
    }

    if (isActive) {
      const plan =
        subscription?.plan_name ||
        subscription?.plan;

      return plan
        ? `${plan} plan active`
        : "Paid plan active";
    }

    if (status === "EXPIRED") {
      return "Please renew your plan";
    }

    if (status === "CANCELLED") {
      return "Contact support to renew";
    }

    return "Subscription status unavailable";
  };

  const currentPlan =
    subscription?.plan_name ||
    subscription?.plan;

  // SIDEBAR CONTENT
  const sidebarContent = (
    <Box
      sx={{
        width: 260,
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, #111827 0%, #1E1B4B 100%)",
        color: "#FFFFFF",
        overflowY: "auto",
        overflowX: "hidden",
        boxSizing: "border-box",

        "&::-webkit-scrollbar": {
          width: "4px",
        },

        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: "10px",
        },
      }}
    >
      {/* LOGO */}
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.3,
          flexShrink: 0,
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            borderRadius: "11px",
            background:
              "linear-gradient(135deg, #6366F1, #2563EB)",
            fontWeight: 800,
          }}
        >
          C
        </Avatar>

        <Box>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            CloudBill
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              color: "#94A3B8",
              mt: 0.4,
            }}
          >
            Smart Billing Software
          </Typography>
        </Box>

        <IconButton
          onClick={() => setMobileOpen?.(false)}
          aria-label="Close navigation"
          sx={{
            ml: "auto",
            display: { xs: "flex", md: "none" },
            color: "#CBD5E1",
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      />

      {/* MAIN MENU */}
      <Box sx={{ px: 1.5, pt: 2, flexShrink: 0 }}>
        <Typography
          sx={{
            px: 1.5,
            mb: 1,
            fontSize: 10,
            fontWeight: 800,
            color: "#64748B",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Main Menu
        </Typography>

        <List disablePadding>
          {menuItems.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path === "/billing/create" &&
                location.pathname.startsWith("/billing"));

            return (
              <Tooltip
                key={item.label}
                title={item.label}
                placement="right"
              >
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 46,
                    mb: 0.5,
                    px: 1.5,
                    borderRadius: "11px",
                    color: active ? "#FFFFFF" : "#94A3B8",
                    backgroundColor: active
                      ? "rgba(99,102,241,0.20)"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(129,140,248,0.20)"
                      : "1px solid transparent",
                    "&:hover": {
                      color: "#FFFFFF",
                      backgroundColor: "rgba(99,102,241,0.14)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 38,
                      color: active ? "#A5B4FC" : "#64748B",
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      sx: { fontSize: 20 },
                    })}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* MANAGE MENU */}
      <Box sx={{ px: 1.5, mt: 2, flexShrink: 0 }}>
        <Typography
          sx={{
            px: 1.5,
            mb: 1,
            fontSize: 10,
            fontWeight: 800,
            color: "#64748B",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Manage
        </Typography>

        <List disablePadding>
          {bottomItems.map((item) => {
            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            return (
              <ListItemButton
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 44,
                  mb: 0.5,
                  px: 1.5,
                  borderRadius: "11px",
                  color: active ? "#FFFFFF" : "#94A3B8",
                  backgroundColor: active
                    ? "rgba(99,102,241,0.20)"
                    : "transparent",
                  "&:hover": {
                    color: "#FFFFFF",
                    backgroundColor: "rgba(99,102,241,0.14)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    color: active ? "#A5B4FC" : "#64748B",
                  }}
                >
                  {React.cloneElement(item.icon, {
                    sx: { fontSize: 19 },
                  })}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* SUBSCRIPTION CARD */}
      <Box
        sx={{
          mt: "auto",
          px: 2,
          py: 2,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            p: 1.8,
            borderRadius: "14px",
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.25), rgba(37,99,235,0.15))",
            border: "1px solid rgba(129,140,248,0.15)",
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              color: "#A5B4FC",
              fontWeight: 700,
            }}
          >
            {getStatusLabel()}
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              mt: 0.5,
            }}
          >
            {getStatusDescription()}
          </Typography>

          <Box
            sx={{
              height: 5,
              borderRadius: 5,
              backgroundColor: "rgba(255,255,255,0.10)",
              mt: 1.2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${trialProgress}%`,
                height: "100%",
                borderRadius: 5,
                background:
                  "linear-gradient(90deg, #818CF8, #60A5FA)",
                transition: "width 0.3s ease",
              }}
            />
          </Box>

          {currentPlan && (
            <Typography
              sx={{
                fontSize: 10,
                color: "#94A3B8",
                mt: 1,
              }}
            >
              Current plan: {currentPlan}
            </Typography>
          )}
        </Box>
      </Box>

      {/* LOGOUT */}
      <Box sx={{ px: 1.5, pb: 2, flexShrink: 0 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            minHeight: 44,
            px: 1.5,
            borderRadius: "11px",
            color: "#94A3B8",
            "&:hover": {
              color: "#FCA5A5",
              backgroundColor: "rgba(239,68,68,0.08)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 38,
              color: "inherit",
            }}
          >
            <Logout sx={{ fontSize: 19 }} />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 13,
              fontWeight: 600,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 260,
          height: "100dvh",
          zIndex: 1200,
          overflow: "hidden",
        }}
      >
        {sidebarContent}
      </Box>

      {/* MOBILE SIDEBAR */}
      {mobileOpen && (
        <Box
          onClick={() => setMobileOpen?.(false)}
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            backgroundColor: "rgba(15,23,42,0.55)",
          }}
        >
          <Box
            onClick={(event) => event.stopPropagation()}
            sx={{
              width: 260,
              maxWidth: "85vw",
              height: "100dvh",
              position: "fixed",
              top: 0,
              left: 0,
            }}
          >
            {sidebarContent}
          </Box>
        </Box>
      )}
    </>
  );
};

export default DashboardSidebar;
