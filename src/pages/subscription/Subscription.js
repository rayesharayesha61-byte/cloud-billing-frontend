

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Chip,
//   Stack,
//   Divider,
//   CircularProgress,
//   Alert,
//   Switch,
//   FormControlLabel,
//   LinearProgress,
//   TextField,
// } from "@mui/material";
// import {
//   CheckCircleRounded,
//   WorkspacePremiumRounded,
//   ReceiptLongRounded,
//   CalendarMonthRounded,
//   TrendingUpRounded,
//   AutorenewRounded,
// } from "@mui/icons-material";

// const API_URL =
//   process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// const plans = [
//   {
//     name: "BASIC",
//     title: "Basic",
//     monthly: 299,
//     yearly: 2999,
//     description: "Essential billing tools for small businesses.",
//     features: [
//       "GST invoice management",
//       "Product & customer management",
//       "PDF invoice download",
//       "Basic sales reports",
//       "Email support",
//     ],
//   },
//   {
//     name: "PROFESSIONAL",
//     title: "Professional",
//     monthly: 599,
//     yearly: 5999,
//     description: "Advanced tools for growing businesses.",
//     popular: true,
//     features: [
//       "Everything in Basic",
//       "Advanced sales reports",
//       "Expense management",
//       "Customer payment tracking",
//       "Priority support",
//     ],
//   },
//   {
//     name: "BUSINESS",
//     title: "Business",
//     monthly: 999,
//     yearly: 9999,
//     description: "Complete billing for established businesses.",
//     features: [
//       "Everything in Professional",
//       "Business performance insights",
//       "Advanced business reporting",
//       "Priority assistance",
//       "Business-focused features",
//     ],
//   },
// ];

// const formatDate = (value) => {
//   if (!value) return "Not available";

//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return value;

//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatPrice = (value) =>
//   Number(value || 0).toLocaleString("en-IN");

// export default function Subscription() {
//   const [subscription, setSubscription] = useState(null);
//   const [yearly, setYearly] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [changingPlan, setChangingPlan] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
// const [paymentPlan, setPaymentPlan] = useState(null);
// const [utrNumber, setUtrNumber] = useState("");
// const [submittingPayment, setSubmittingPayment] = useState(false);

// const UPI_ID = "rayesharayesha61@oksbi";
// const PAYEE_NAME = "CloudBill";
//   const token = localStorage.getItem("token");

//   const loadSubscription = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await axios.get(`${API_URL}/subscription`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setSubscription(response.data.subscription);
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Unable to load subscription details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadSubscription();
//     // Load once when this page opens.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//  const openGPay = () => {
//   if (!paymentPlan) return;

//   const params = new URLSearchParams({
//     pa: UPI_ID,
//     pn: PAYEE_NAME,
//     am: paymentPlan.amount.toFixed(2),
//     cu: "INR",
//     tn: `CloudBill ${paymentPlan.name} ${paymentPlan.billingCycle}`,
//   });

//   window.location.href = `upi://pay?${params.toString()}`;
// };

// const submitPayment = async () => {
//   setError("");
//   setMessage("");

//   if (!paymentPlan) {
//     setError("Please select a subscription plan.");
//     return;
//   }

//   if (!utrNumber.trim()) {
//     setError("Please enter your UTR / transaction reference number.");
//     return;
//   }

//   try {
//     setSubmittingPayment(true);

//     const response = await axios.post(
//       `${API_URL}/subscription/payments`,
//       {
//         plan: paymentPlan.name,
//         billingCycle: paymentPlan.billingCycle,
//         utrNumber: utrNumber.trim(),
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     setMessage(
//       response.data.message ||
//         "Payment submitted for admin verification."
//     );

//     setPaymentPlan(null);
//     setUtrNumber("");
//   } catch (err) {
//     setError(
//       err.response?.data?.message ||
//         "Unable to submit payment. Please try again."
//     );
//   } finally {
//     setSubmittingPayment(false);
//   }
// };
// const handlePlanSelect = (plan) => {
//   setError("");
//   setMessage("");

//   if (!token) {
//     setError("Please log in to continue.");
//     return;
//   }

//   const amount = yearly ? plan.yearly : plan.monthly;
//   const billingCycle = yearly ? "YEARLY" : "MONTHLY";

//   setPaymentPlan({
//     ...plan,
//     amount,
//     billingCycle,
//   });

//   setUtrNumber("");
// };
//   } catch (err) {
//     setError("Unable to open the UPI payment app.");
//   } finally {
//     setChangingPlan("");
//   }
// };


//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "60vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const status = String(
//     subscription?.status ||
//       subscription?.subscription_status ||
//       "TRIAL"
//   ).toUpperCase();

//   const currentPlan = String(
//     subscription?.plan_name ||
//       subscription?.plan ||
//       "FREE_TRIAL"
//   ).toUpperCase();

//   const isTrial = status === "TRIAL" || currentPlan === "FREE_TRIAL";
//   const selectedPlan = plans.find((p) => p.name === currentPlan);

//   const trialEnd =
//     subscription?.trial_end_date || subscription?.trialEndDate;

//   const trialStart =
//     subscription?.trial_start_date || subscription?.trialStartDate;

//   const trialDays = trialEnd
//     ? Math.max(
//         0,
//         Math.ceil(
//           (new Date(trialEnd).setHours(23, 59, 59, 999) -
//             new Date().getTime()) /
//             (1000 * 60 * 60 * 24)
//         )
//       )
//     : 0;

//   const trialTotalDays =
//     trialStart && trialEnd
//       ? Math.max(
//           1,
//           Math.ceil(
//             (new Date(trialEnd) - new Date(trialStart)) /
//               (1000 * 60 * 60 * 24)
//           ) + 1
//         )
//       : 30;

//   const trialProgress = isTrial
//     ? Math.min(
//         100,
//         Math.max(
//           0,
//           ((trialTotalDays - trialDays) / trialTotalDays) * 100
//         )
//       )
//     : 100;

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         bgcolor: "#F5F7FC",
//         p: { xs: 2, md: 4 },
//       }}
//     >
//       {/* Header */}
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         justifyContent="space-between"
//         alignItems={{ xs: "flex-start", sm: "center" }}
//         spacing={2}
//         sx={{ mb: 4 }}
//       >
//         <Box>
//           <Typography
//             variant="h4"
//             sx={{ fontWeight: 800, color: "#172554", mb: 1 }}
//           >
//             Subscription & Billing
//           </Typography>

//           <Typography color="text.secondary">
//             Manage your plan, monitor your trial and explore upgrades.
//           </Typography>
//         </Box>

//         <Button
//           variant="outlined"
//           startIcon={<AutorenewRounded />}
//           onClick={loadSubscription}
//           sx={{
//             borderRadius: 2,
//             textTransform: "none",
//             fontWeight: 700,
//           }}
//         >
//           Refresh
//         </Button>
//       </Stack>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {message && (
//         <Alert severity="info" sx={{ mb: 2 }}>
//           {message}
//         </Alert>
//       )}

//       {/* Current subscription */}
//       <Card
//         elevation={0}
//         sx={{
//           mb: 4,
//           borderRadius: 4,
//           overflow: "hidden",
//           border: "1px solid #E1E7F5",
//         }}
//       >
//         <Box
//           sx={{
//             p: { xs: 2.5, md: 3.5 },
//             color: "#fff",
//             background:
//               "linear-gradient(120deg, #172554 0%, #3730A3 60%, #4F46E5 100%)",
//           }}
//         >
//           <Stack
//             direction={{ xs: "column", sm: "row" }}
//             justifyContent="space-between"
//             alignItems={{ xs: "flex-start", sm: "center" }}
//             spacing={2}
//           >
//             <Box>
//               <Stack direction="row" spacing={1} alignItems="center">
//                 <WorkspacePremiumRounded />
//                 <Typography variant="h6" fontWeight={700}>
//                   Your Current Plan
//                 </Typography>
//               </Stack>

//               <Typography
//                 variant="h4"
//                 fontWeight={800}
//                 sx={{ mt: 2, textTransform: "capitalize" }}
//               >
//                 {currentPlan.replaceAll("_", " ")}
//               </Typography>

//               <Typography sx={{ mt: 0.5, opacity: 0.85 }}>
//                 {isTrial
//                   ? "Enjoy your CloudBill free trial."
//                   : "Your subscription details at a glance."}
//               </Typography>
//             </Box>

//             <Chip
//               label={status}
//               icon={<CheckCircleRounded />}
//               sx={{
//                 fontWeight: 800,
//                 bgcolor:
//                   status === "ACTIVE"
//                     ? "#DCFCE7"
//                     : status === "EXPIRED"
//                     ? "#FEE2E2"
//                     : "#FEF3C7",
//                 color:
//                   status === "ACTIVE"
//                     ? "#166534"
//                     : status === "EXPIRED"
//                     ? "#991B1B"
//                     : "#92400E",
//               }}
//             />
//           </Stack>
//         </Box>

//         <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={4}>
//               <Stack direction="row" spacing={1.5} alignItems="center">
//                 <Box
//                   sx={{
//                     p: 1.3,
//                     bgcolor: "#EEF2FF",
//                     color: "#4338CA",
//                     borderRadius: 2,
//                   }}
//                 >
//                   <CalendarMonthRounded />
//                 </Box>
//                 <Box>
//                   <Typography variant="body2" color="text.secondary">
//                     {isTrial ? "Trial ends on" : "Subscription ends on"}
//                   </Typography>
//                   <Typography fontWeight={700}>
//                     {formatDate(
//                       isTrial
//                         ? trialEnd
//                         : subscription?.subscription_end_date ||
//                             subscription?.next_billing_date
//                     )}
//                   </Typography>
//                 </Box>
//               </Stack>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <Stack direction="row" spacing={1.5} alignItems="center">
//                 <Box
//                   sx={{
//                     p: 1.3,
//                     bgcolor: "#F0FDF4",
//                     color: "#15803D",
//                     borderRadius: 2,
//                   }}
//                 >
//                   <ReceiptLongRounded />
//                 </Box>
//                 <Box>
//                   <Typography variant="body2" color="text.secondary">
//                     {isTrial ? "Trial duration remaining" : "Plan price"}
//                   </Typography>
//                   <Typography fontWeight={700}>
//                     {isTrial
//                       ? `${trialDays} days remaining`
//                       : `₹${formatPrice(
//                           subscription?.amount ||
//                             selectedPlan?.monthly ||
//                             0
//                         )} / month`}
//                   </Typography>
//                 </Box>
//               </Stack>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <Stack direction="row" spacing={1.5} alignItems="center">
//                 <Box
//                   sx={{
//                     p: 1.3,
//                     bgcolor: "#FFF7ED",
//                     color: "#C2410C",
//                     borderRadius: 2,
//                   }}
//                 >
//                   <TrendingUpRounded />
//                 </Box>
//                 <Box>
//                   <Typography variant="body2" color="text.secondary">
//                     Account email
//                   </Typography>
//                   <Typography
//                     fontWeight={700}
//                     sx={{ overflowWrap: "anywhere" }}
//                   >
//                     {subscription?.email || "Your registered account"}
//                   </Typography>
//                 </Box>
//               </Stack>
//             </Grid>
//           </Grid>

//           {isTrial && (
//             <Box sx={{ mt: 3 }}>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 sx={{ mb: 1 }}
//               >
//                 <Typography variant="body2" fontWeight={600}>
//                   Trial period
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {Math.max(0, trialDays)} days left
//                 </Typography>
//               </Stack>

//               <LinearProgress
//                 variant="determinate"
//                 value={trialProgress}
//                 sx={{
//                   height: 8,
//                   borderRadius: 10,
//                   bgcolor: "#E5E7EB",
//                   "& .MuiLinearProgress-bar": {
//                     borderRadius: 10,
//                     bgcolor: trialDays <= 5 ? "#EA580C" : "#4F46E5",
//                   },
//                 }}
//               />

//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//                 sx={{ display: "block", mt: 1 }}
//               >
//                 Choose a paid plan when you're ready to continue using
//                 CloudBill after your trial.
//               </Typography>
//             </Box>
//           )}
//         </CardContent>
//       </Card>

//       {/* Pricing heading */}
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         justifyContent="space-between"
//         alignItems={{ xs: "flex-start", sm: "center" }}
//         spacing={2}
//         sx={{ mb: 3 }}
//       >
//         <Box>
//           <Typography variant="h5" fontWeight={800} color="#172554">
//             Choose the right plan
//           </Typography>
//           <Typography color="text.secondary" sx={{ mt: 0.5 }}>
//             Simple pricing to help your business grow.
//           </Typography>
//         </Box>

//         <FormControlLabel
//           control={
//             <Switch
//               checked={yearly}
//               onChange={(e) => setYearly(e.target.checked)}
//               color="primary"
//             />
//           }
//           label={
//             <Stack direction="row" spacing={1} alignItems="center">
//               <Typography fontWeight={600}>Yearly billing</Typography>
//               <Chip
//                 size="small"
//                 label="Save more"
//                 color="success"
//                 variant="outlined"
//               />
//             </Stack>
//           }
//         />
//       </Stack>

//       {/* Plan cards */}
//       <Grid container spacing={3} alignItems="stretch">
//         {plans.map((plan) => {
//           const price = yearly ? plan.yearly : plan.monthly;
//           const isCurrent = plan.name === currentPlan;
//           const isPopular = plan.popular;

//           return (
//             <Grid item xs={12} md={4} key={plan.name}>
//               <Card
//                 elevation={0}
//                 sx={{
//                   height: "100%",
//                   position: "relative",
//                   borderRadius: 4,
//                   border: isPopular
//                     ? "2px solid #4F46E5"
//                     : "1px solid #E1E7F5",
//                   boxShadow: isPopular
//                     ? "0 16px 40px rgba(79,70,229,0.12)"
//                     : "0 8px 25px rgba(15,23,42,0.035)",
//                   transition: "transform 0.2s, box-shadow 0.2s",
//                   "&:hover": {
//                     transform: "translateY(-4px)",
//                     boxShadow: "0 16px 35px rgba(15,23,42,0.09)",
//                   },
//                 }}
//               >
//                 {isPopular && (
//                   <Box
//                     sx={{
//                       py: 1,
//                       textAlign: "center",
//                       color: "#fff",
//                       bgcolor: "#4F46E5",
//                       fontWeight: 700,
//                       fontSize: 13,
//                     }}
//                   >
//                     MOST POPULAR
//                   </Box>
//                 )}

//                 <CardContent sx={{ p: 3 }}>
//                   <Typography
//                     variant="h6"
//                     fontWeight={800}
//                     color="#172554"
//                   >
//                     {plan.title}
//                   </Typography>

//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ minHeight: 44, mt: 1 }}
//                   >
//                     {plan.description}
//                   </Typography>

//                   <Box sx={{ my: 3 }}>
//                     <Stack direction="row" alignItems="baseline" spacing={0.5}>
//                       <Typography
//                         variant="h3"
//                         fontWeight={800}
//                         color="#172554"
//                       >
//                         ₹{formatPrice(price)}
//                       </Typography>
//                     </Stack>
//                     <Typography variant="body2" color="text.secondary">
//                       per {yearly ? "year" : "month"}
//                     </Typography>
//                   </Box>

//                   <Button
//                     fullWidth
//                     variant={isPopular ? "contained" : "outlined"}
//                     disabled={
//                       Boolean(changingPlan) ||
//                       isCurrent ||
//                       (status === "EXPIRED" && !isTrial)
//                     }
//                     onClick={() => handlePlanSelect(plan)}
//                     sx={{
//                       py: 1.25,
//                       borderRadius: 2,
//                       textTransform: "none",
//                       fontWeight: 700,
//                       boxShadow: "none",
//                     }}
//                   >
//                     {changingPlan === plan.name
//                       ? "Updating..."
//                       : isCurrent
//                       ? "Selected Plan"
//                       : "Select Plan"}
//                   </Button>

//                   <Divider sx={{ my: 3 }} />

//                   <Typography
//                     variant="body2"
//                     fontWeight={700}
//                     sx={{ mb: 2 }}
//                   >
//                     What's included
//                   </Typography>

//                   <Stack spacing={1.7}>
//                     {plan.features.map((feature) => (
//                       <Stack
//                         direction="row"
//                         spacing={1}
//                         alignItems="flex-start"
//                         key={feature}
//                       >
//                         <CheckCircleRounded
//                           sx={{
//                             color: "#16A34A",
//                             fontSize: 20,
//                             mt: "1px",
//                           }}
//                         />
//                         <Typography variant="body2" color="#475569">
//                           {feature}
//                         </Typography>
//                       </Stack>
//                     ))}
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>

//       {/* Footer note */}
//       <Box
//         sx={{
//           mt: 4,
//           p: 2.5,
//           borderRadius: 3,
//           bgcolor: "#EEF2FF",
//           border: "1px solid #E0E7FF",
//         }}
//       >
//         <Typography fontWeight={700} color="#312E81">
//           Need help with your subscription?
//         </Typography>
//         <Typography variant="body2" color="#4338CA" sx={{ mt: 0.5 }}>
//           Contact support@cloudbill.com for assistance with your plan or
//           billing questions.
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CheckCircleRounded,
  WorkspacePremiumRounded,
  ReceiptLongRounded,
  CalendarMonthRounded,
  TrendingUpRounded,
  AutorenewRounded,
  AccountBalanceWalletRounded,
} from "@mui/icons-material";

const API_URL =
  process.env.REACT_APP_API_URL || "https://cloud-billing-backend.onrender.com";

const UPI_ID = "rayesharayesha61@oksbi";
const PAYEE_NAME = "CloudBill";

const plans = [
  {
    name: "BASIC",
    title: "Basic",
    monthly: 299,
    yearly: 2999,
    description: "Essential billing tools for small businesses.",
    features: [
      "GST invoice management",
      "Product & customer management",
      "PDF invoice download",
      "Basic sales reports",
      "Email support",
    ],
  },
  {
    name: "PROFESSIONAL",
    title: "Professional",
    monthly: 599,
    yearly: 5999,
    description: "Advanced tools for growing businesses.",
    popular: true,
    features: [
      "Everything in Basic",
      "Advanced sales reports",
      "Expense management",
      "Customer payment tracking",
      "Priority support",
    ],
  },
  {
    name: "BUSINESS",
    title: "Business",
    monthly: 999,
    yearly: 9999,
    description: "Complete billing for established businesses.",
    features: [
      "Everything in Professional",
      "Business performance insights",
      "Advanced business reporting",
      "Priority assistance",
      "Business-focused features",
    ],
  },
];

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-IN");

export default function Subscription() {
  const [subscription, setSubscription] = useState(null);
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [paymentPlan, setPaymentPlan] = useState(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const token = localStorage.getItem("token");

  const loadSubscription = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Please log in to view your subscription.");
        setSubscription(null);
        return;
      }

      const response = await axios.get(`${API_URL}/subscription`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubscription(response.data.subscription);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load subscription details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscription();
    // Load subscription once when this page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlanSelect = (plan) => {
    setError("");
    setMessage("");

    if (!token) {
      setError("Please log in to continue.");
      return;
    }

    const amount = yearly ? plan.yearly : plan.monthly;
    const billingCycle = yearly ? "YEARLY" : "MONTHLY";

    setPaymentPlan({
      ...plan,
      amount,
      billingCycle,
    });

    setUtrNumber("");
  };

  const closePaymentDialog = () => {
    if (submittingPayment) return;

    setPaymentPlan(null);
    setUtrNumber("");
  };

  const openGPay = () => {
    if (!paymentPlan) return;

    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: Number(paymentPlan.amount).toFixed(2),
      cu: "INR",
      tn: `CloudBill ${paymentPlan.name} ${paymentPlan.billingCycle}`,
    });

    // This opens a compatible UPI app if one is available.
    window.location.href = `upi://pay?${params.toString()}`;
  };

  const submitPayment = async () => {
    setError("");
    setMessage("");

    if (!token) {
      setError("Please log in again to submit your payment.");
      return;
    }

    if (!paymentPlan) {
      setError("Please select a subscription plan.");
      return;
    }

    if (!utrNumber.trim()) {
      setError("Please enter your UTR / transaction reference number.");
      return;
    }

    try {
      setSubmittingPayment(true);

      const response = await axios.post(
        `${API_URL}/subscription/payments`,
        {
          plan: paymentPlan.name,
          billingCycle: paymentPlan.billingCycle,
          utrNumber: utrNumber.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data?.message ||
          "Payment details submitted. Your subscription will be updated after admin verification."
      );

      setPaymentPlan(null);
      setUtrNumber("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit payment. Please try again."
      );
    } finally {
      setSubmittingPayment(false);
    }
  };

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

  const status = String(
    subscription?.status ||
      subscription?.subscription_status ||
      "TRIAL"
  ).toUpperCase();

  const currentPlan = String(
    subscription?.plan_name ||
      subscription?.plan ||
      "FREE_TRIAL"
  ).toUpperCase();

  const isTrial =
    status === "TRIAL" || currentPlan === "FREE_TRIAL";

  const selectedPlan = plans.find(
    (plan) => plan.name === currentPlan
  );

  const trialEnd =
    subscription?.trial_end_date ||
    subscription?.trialEndDate;

  const trialStart =
    subscription?.trial_start_date ||
    subscription?.trialStartDate;

  const trialDays = trialEnd
    ? Math.max(
        0,
        Math.ceil(
          (new Date(trialEnd).setHours(23, 59, 59, 999) -
            new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const trialTotalDays =
    trialStart && trialEnd
      ? Math.max(
          1,
          Math.ceil(
            (new Date(trialEnd) - new Date(trialStart)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 30;

  const trialProgress = isTrial
    ? Math.min(
        100,
        Math.max(
          0,
          ((trialTotalDays - trialDays) / trialTotalDays) * 100
        )
      )
    : 100;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FC",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Manual UPI payment dialog */}
      <Dialog
        open={Boolean(paymentPlan)}
        onClose={closePaymentDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#172554" }}>
          Complete Your Payment
        </DialogTitle>

        <DialogContent>
          {paymentPlan && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Alert severity="info">
                Pay the exact amount using a UPI app. After payment,
                enter the transaction reference number. Admin
                verification is required before your subscription
                becomes active.
              </Alert>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "#F5F7FF",
                  border: "1px solid #E0E7FF",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <AccountBalanceWalletRounded color="primary" />
                  <Typography fontWeight={700}>
                    {PAYEE_NAME}
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  UPI ID
                </Typography>

                <Typography fontWeight={700} sx={{ mb: 2 }}>
                  {UPI_ID}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="body2" color="text.secondary">
                  Selected plan
                </Typography>

                <Typography fontWeight={700}>
                  {paymentPlan.title} · {paymentPlan.billingCycle}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="#172554"
                  sx={{ mt: 1 }}
                >
                  ₹{formatPrice(paymentPlan.amount)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<AccountBalanceWalletRounded />}
                onClick={openGPay}
                sx={{
                  py: 1.3,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Open UPI App
              </Button>

              <Typography variant="caption" color="text.secondary">
                If the UPI app does not open, open GPay manually and
                pay the UPI ID shown above. Confirm the payee details
                in your payment app before paying.
              </Typography>

              <TextField
                label="UTR / Transaction Reference Number"
                placeholder="Enter your payment reference number"
                value={utrNumber}
                onChange={(event) =>
                  setUtrNumber(event.target.value)
                }
                fullWidth
                required
                inputProps={{ maxLength: 100 }}
                helperText="Enter the reference number shown in your payment app after payment."
              />
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button
            onClick={closePaymentDialog}
            disabled={submittingPayment}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={submitPayment}
            disabled={submittingPayment || !utrNumber.trim()}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              minWidth: 170,
            }}
          >
            {submittingPayment
              ? "Submitting..."
              : "Submit for Verification"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#172554", mb: 1 }}
          >
            Subscription & Billing
          </Typography>

          <Typography color="text.secondary">
            Manage your plan, monitor your trial and explore upgrades.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<AutorenewRounded />}
          onClick={loadSubscription}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Refresh
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Current subscription */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #E1E7F5",
        }}
      >
        <Box
          sx={{
            p: { xs: 2.5, md: 3.5 },
            color: "#fff",
            background:
              "linear-gradient(120deg, #172554 0%, #3730A3 60%, #4F46E5 100%)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <WorkspacePremiumRounded />
                <Typography variant="h6" fontWeight={700}>
                  Your Current Plan
                </Typography>
              </Stack>

              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ mt: 2, textTransform: "capitalize" }}
              >
                {currentPlan.replace(/_/g, " ")}
              </Typography>

              <Typography sx={{ mt: 0.5, opacity: 0.85 }}>
                {isTrial
                  ? "Enjoy your CloudBill free trial."
                  : "Your subscription details at a glance."}
              </Typography>
            </Box>

            <Chip
              label={status}
              icon={<CheckCircleRounded />}
              sx={{
                fontWeight: 800,
                bgcolor:
                  status === "ACTIVE"
                    ? "#DCFCE7"
                    : status === "EXPIRED"
                    ? "#FEE2E2"
                    : "#FEF3C7",
                color:
                  status === "ACTIVE"
                    ? "#166534"
                    : status === "EXPIRED"
                    ? "#991B1B"
                    : "#92400E",
              }}
            />
          </Stack>
        </Box>

        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    p: 1.3,
                    bgcolor: "#EEF2FF",
                    color: "#4338CA",
                    borderRadius: 2,
                  }}
                >
                  <CalendarMonthRounded />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {isTrial ? "Trial ends on" : "Subscription ends on"}
                  </Typography>

                  <Typography fontWeight={700}>
                    {formatDate(
                      isTrial
                        ? trialEnd
                        : subscription?.subscription_end_date ||
                            subscription?.next_billing_date
                    )}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    p: 1.3,
                    bgcolor: "#F0FDF4",
                    color: "#15803D",
                    borderRadius: 2,
                  }}
                >
                  <ReceiptLongRounded />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {isTrial ? "Trial duration remaining" : "Plan price"}
                  </Typography>

                  <Typography fontWeight={700}>
                    {isTrial
                      ? `${trialDays} days remaining`
                      : `₹${formatPrice(
                          subscription?.amount ||
                            selectedPlan?.monthly ||
                            0
                        )} / month`}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    p: 1.3,
                    bgcolor: "#FFF7ED",
                    color: "#C2410C",
                    borderRadius: 2,
                  }}
                >
                  <TrendingUpRounded />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Account email
                  </Typography>

                  <Typography
                    fontWeight={700}
                    sx={{ overflowWrap: "anywhere" }}
                  >
                    {subscription?.email || "Your registered account"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {isTrial && (
            <Box sx={{ mt: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Trial period
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {trialDays} days left
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={trialProgress}
                sx={{
                  height: 8,
                  borderRadius: 10,
                  bgcolor: "#E5E7EB",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 10,
                    bgcolor: trialDays <= 5 ? "#EA580C" : "#4F46E5",
                  },
                }}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                Choose a paid plan when you're ready to continue using
                CloudBill after your trial.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Pricing heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="#172554">
            Choose the right plan
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Simple pricing to help your business grow.
          </Typography>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={yearly}
              onChange={(event) => setYearly(event.target.checked)}
              color="primary"
            />
          }
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={600}>Yearly billing</Typography>
              <Chip
                size="small"
                label="Save more"
                color="success"
                variant="outlined"
              />
            </Stack>
          }
        />
      </Stack>

      {/* Plan cards */}
      <Grid container spacing={3} alignItems="stretch">
        {plans.map((plan) => {
          const price = yearly ? plan.yearly : plan.monthly;
          const isCurrent = plan.name === currentPlan;
          const isPopular = plan.popular;

          return (
            <Grid item xs={12} md={4} key={plan.name}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  position: "relative",
                  borderRadius: 4,
                  border: isPopular
                    ? "2px solid #4F46E5"
                    : "1px solid #E1E7F5",
                  boxShadow: isPopular
                    ? "0 16px 40px rgba(79,70,229,0.12)"
                    : "0 8px 25px rgba(15,23,42,0.035)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 16px 35px rgba(15,23,42,0.09)",
                  },
                }}
              >
                {isPopular && (
                  <Box
                    sx={{
                      py: 1,
                      textAlign: "center",
                      color: "#fff",
                      bgcolor: "#4F46E5",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    MOST POPULAR
                  </Box>
                )}

                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color="#172554"
                  >
                    {plan.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minHeight: 44, mt: 1 }}
                  >
                    {plan.description}
                  </Typography>

                  <Box sx={{ my: 3 }}>
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      color="#172554"
                    >
                      ₹{formatPrice(price)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      per {yearly ? "year" : "month"}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant={isPopular ? "contained" : "outlined"}
                    disabled={isCurrent}
                    onClick={() => handlePlanSelect(plan)}
                    sx={{
                      py: 1.25,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 700,
                      boxShadow: "none",
                    }}
                  >
                    {isCurrent ? "Selected Plan" : "Select Plan"}
                  </Button>

                  <Divider sx={{ my: 3 }} />

                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                  >
                    What's included
                  </Typography>

                  <Stack spacing={1.7}>
                    {plan.features.map((feature) => (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                        key={feature}
                      >
                        <CheckCircleRounded
                          sx={{
                            color: "#16A34A",
                            fontSize: 20,
                            mt: "1px",
                          }}
                        />

                        <Typography variant="body2" color="#475569">
                          {feature}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Footer note */}
      <Box
        sx={{
          mt: 4,
          p: 2.5,
          borderRadius: 3,
          bgcolor: "#EEF2FF",
          border: "1px solid #E0E7FF",
        }}
      >
        <Typography fontWeight={700} color="#312E81">
          Need help with your subscription?
        </Typography>

        <Typography variant="body2" color="#4338CA" sx={{ mt: 0.5 }}>
          Contact support@cloudbill.com for assistance with your plan or
          billing questions.
        </Typography>
      </Box>
    </Box>
  );
}
