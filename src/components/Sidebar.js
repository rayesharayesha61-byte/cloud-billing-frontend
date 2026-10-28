
// import React from "react";
// import {
//   Box,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Typography,
//   Collapse,
//   IconButton,
// } from "@mui/material";

// import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
// import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
// import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
// import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
// import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
// import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
// import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
// import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

// const drawerWidth = 250;

// const Sidebar = ({
//   mobileOpen = false,
//   onMobileClose = () => {},
//   user,
//   isAdmin: isAdminProp,
// }) => {
//   const [salesOpen, setSalesOpen] = React.useState(true);
//   const [itemsOpen, setItemsOpen] = React.useState(true);
//   const [customersOpen, setCustomersOpen] = React.useState(false);

//   const isAdmin = React.useMemo(() => {
//     if (typeof isAdminProp === "boolean") return isAdminProp;

//     let currentUser = user;

//     if (!currentUser) {
//       try {
//         currentUser = JSON.parse(
//           localStorage.getItem("user") || "null"
//         );
//       } catch {
//         currentUser = null;
//       }
//     }

//     return String(currentUser?.role || "").toUpperCase() === "ADMIN";
//   }, [isAdminProp, user]);

//   const navigate = (path) => {
//     onMobileClose();
//     window.location.href = path;
//   };

//   const navItemSx = {
//     minHeight: 42,
//     borderRadius: 1.8,
//     mb: 0.4,
//     color: "#CBD5E1",
//     "&:hover": {
//       backgroundColor: "#1E293B",
//       color: "#FFFFFF",
//     },
//   };

//   const sectionTitleSx = {
//     px: 1.5,
//     mt: 2.5,
//     mb: 1,
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#64748B",
//     letterSpacing: 1,
//   };

//   const NavItem = ({ icon, label, onClick, active = false }) => (
//     <ListItemButton
//       onClick={onClick}
//       sx={{
//         ...navItemSx,
//         ...(active
//           ? {
//               bgcolor: "rgba(37,99,235,0.22)",
//               color: "#FFFFFF",
//               "&:hover": {
//                 bgcolor: "rgba(37,99,235,0.32)",
//               },
//             }
//           : {}),
//       }}
//     >
//       <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
//         {icon}
//       </ListItemIcon>

//       <ListItemText
//         primary={label}
//         primaryTypographyProps={{
//           fontSize: 13,
//           fontWeight: 500,
//         }}
//       />
//     </ListItemButton>
//   );

//   const ParentItem = ({ icon, label, open, onClick }) => (
//     <ListItemButton onClick={onClick} sx={navItemSx}>
//       <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
//         {icon}
//       </ListItemIcon>

//       <ListItemText
//         primary={label}
//         primaryTypographyProps={{
//           fontSize: 13,
//           fontWeight: 500,
//         }}
//       />

//       {open ? (
//         <ExpandLessIcon sx={{ fontSize: 18 }} />
//       ) : (
//         <ExpandMoreIcon sx={{ fontSize: 18 }} />
//       )}
//     </ListItemButton>
//   );

//   const SubItem = ({ label, onClick }) => (
//     <ListItemButton
//       onClick={onClick}
//       sx={{
//         minHeight: 36,
//         pl: 6.2,
//         borderRadius: 1.5,
//         color: "#94A3B8",
//         "&:hover": {
//           backgroundColor: "#1E293B",
//           color: "#FFFFFF",
//         },
//       }}
//     >
//       <ListItemText
//         primary={label}
//         primaryTypographyProps={{ fontSize: 12.5 }}
//       />
//     </ListItemButton>
//   );

//   const drawerContent = (
//     <Box
//       sx={{
//         width: "100%",
//         height: "100%",
//         minHeight: 0,
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         backgroundColor: "#0F172A",
//         color: "#FFFFFF",
//       }}
//     >
//       {/* Fixed Logo */}
//       <Box
//         sx={{
//           flexShrink: 0,
//           height: 64,
//           px: 2.5,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           borderBottom: "1px solid rgba(255,255,255,0.08)",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
//           <Box
//             sx={{
//               width: 38,
//               height: 38,
//               borderRadius: 2,
//               background: "linear-gradient(135deg, #2563EB, #4F46E5)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontWeight: 800,
//               fontSize: 18,
//             }}
//           >
//             C
//           </Box>

//           <Box>
//             <Typography
//               sx={{
//                 fontSize: 18,
//                 fontWeight: 800,
//                 lineHeight: 1.1,
//               }}
//             >
//               CloudBill
//             </Typography>

//             <Typography
//               sx={{
//                 fontSize: 10,
//                 color: "#94A3B8",
//                 letterSpacing: 0.5,
//               }}
//             >
//               BUSINESS BILLING
//             </Typography>
//           </Box>
//         </Box>

//         <IconButton
//           onClick={onMobileClose}
//           sx={{
//             display: { xs: "flex", md: "none" },
//             color: "#FFFFFF",
//           }}
//         >
//           <CloseOutlinedIcon />
//         </IconButton>
//       </Box>

//       {/* Only navigation scrolls */}
//       <Box
//         sx={{
//           flex: "1 1 0",
//           minHeight: 0,
//           overflowY: "auto",
//           overflowX: "hidden",
//           px: 1.2,
//           py: 2,
//           overscrollBehavior: "contain",
//           scrollbarWidth: "thin",
//           scrollbarColor: "#334155 transparent",
//           "&::-webkit-scrollbar": {
//             width: "5px",
//           },
//           "&::-webkit-scrollbar-thumb": {
//             backgroundColor: "#334155",
//             borderRadius: "10px",
//           },
//           "&::-webkit-scrollbar-track": {
//             backgroundColor: "transparent",
//           },
//         }}
//       >
//         <Typography sx={{ ...sectionTitleSx, mt: 0 }}>
//           OVERVIEW
//         </Typography>

//         <List disablePadding>
//           <NavItem
//             icon={<DashboardOutlinedIcon />}
//             label="Dashboard"
//             onClick={() => navigate("/dashboard")}
//           />
//         </List>

//         <Typography sx={sectionTitleSx}>SALES</Typography>

//         <List disablePadding>
//           <ParentItem
//             icon={<ShoppingCartOutlinedIcon />}
//             label="Sales"
//             open={salesOpen}
//             onClick={() => setSalesOpen((prev) => !prev)}
//           />

//           <Collapse in={salesOpen} timeout="auto" unmountOnExit>
//             <SubItem
//               label="Invoices"
//               onClick={() => navigate("/billing/invoices")}
//             />
//             <SubItem
//               label="Recurring Invoices"
//               onClick={() => navigate("/billing/recurring-invoices")}
//             />
//             <SubItem
//               label="Credit Notes"
//               onClick={() => navigate("/billing/credit-notes")}
//             />
//             <SubItem
//               label="Payments Received"
//               onClick={() => navigate("/billing/payments")}
//             />
//           </Collapse>
//         </List>

//         <Typography sx={sectionTitleSx}>ITEMS</Typography>

//         <List disablePadding>
//           <ParentItem
//             icon={<Inventory2OutlinedIcon />}
//             label="Items"
//             open={itemsOpen}
//             onClick={() => setItemsOpen((prev) => !prev)}
//           />

//           <Collapse in={itemsOpen} timeout="auto" unmountOnExit>
//             <SubItem
//               label="Products"
//               onClick={() => navigate("/products")}
//             />
//             <SubItem
//               label="Services"
//               onClick={() => navigate("/services")}
//             />
//             <SubItem
//               label="Categories"
//               onClick={() => navigate("/categories")}
//             />
//             <SubItem
//               label="Price Lists"
//               onClick={() => navigate("/price-lists")}
//             />
//           </Collapse>
//         </List>

//         <Typography sx={sectionTitleSx}>CUSTOMERS</Typography>

//         <List disablePadding>
//           <ParentItem
//             icon={<PeopleOutlineOutlinedIcon />}
//             label="Customers"
//             open={customersOpen}
//             onClick={() => setCustomersOpen((prev) => !prev)}
//           />

//           <Collapse in={customersOpen} timeout="auto" unmountOnExit>
//             <SubItem
//               label="All Customers"
//               onClick={() => navigate("/customers")}
//             />
//             <SubItem
//               label="Customer Statements"
//               onClick={() => navigate("/customers/statements")}
//             />
//           </Collapse>
//         </List>

//         <Typography sx={sectionTitleSx}>BUSINESS</Typography>

//         <List disablePadding>
//           <NavItem
//             icon={<AccountBalanceWalletOutlinedIcon />}
//             label="Expenses"
//             onClick={() => navigate("/expenses")}
//           />

//           <NavItem
//             icon={<AssessmentOutlinedIcon />}
//             label="Reports"
//             onClick={() => navigate("/reports")}
//           />

//           <NavItem
//             icon={<CreditCardOutlinedIcon />}
//             label="Subscription"
//             onClick={() => navigate("/subscription")}
//           />

//           <NavItem
//             icon={<BusinessOutlinedIcon />}
//             label="Business Details"
//             onClick={() => navigate("/business-details")}
//           />

//           <NavItem
//             icon={<SettingsOutlinedIcon />}
//             label="Settings"
//             onClick={() => navigate("/settings")}
//           />

//           {isAdmin && (
//             <>
//               <Typography sx={sectionTitleSx}>
//                 ADMINISTRATION
//               </Typography>

//               <NavItem
//                 icon={<AdminPanelSettingsOutlinedIcon />}
//                 label="Admin Panel"
//                 onClick={() => navigate("/admin")}
//               />
//             </>
//           )}
//         </List>
//       </Box>

//       {/* Fixed Free Trial card */}
//       <Box
//         sx={{
//           flexShrink: 0,
//           p: 1.5,
//           borderTop: "1px solid rgba(255,255,255,0.06)",
//           backgroundColor: "#0F172A",
//         }}
//       >
//         <Box
//           sx={{
//             p: 1.8,
//             borderRadius: 2.5,
//             background:
//               "linear-gradient(135deg, rgba(37,99,235,0.22), rgba(79,70,229,0.22))",
//             border: "1px solid rgba(96,165,250,0.18)",
//           }}
//         >
//           <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
//             Free Trial
//           </Typography>

//           <Typography
//             sx={{
//               fontSize: 11,
//               color: "#94A3B8",
//               mt: 0.5,
//             }}
//           >
//             Manage your subscription
//           </Typography>

//           <Box
//             component="button"
//             onClick={() => navigate("/subscription")}
//             sx={{
//               mt: 1.2,
//               border: 0,
//               borderRadius: 1.5,
//               px: 1.5,
//               py: 0.8,
//               cursor: "pointer",
//               backgroundColor: "#2563EB",
//               color: "#FFFFFF",
//               fontSize: 11,
//               fontWeight: 700,
//             }}
//           >
//             View Plans
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );

//   return (
//     <>
//       {/* Desktop: fixed sidebar */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           display: { xs: "none", md: "block" },
//           width: drawerWidth,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: drawerWidth,
//             height: "100vh",
//             boxSizing: "border-box",
//             border: 0,
//             position: "fixed",
//             top: 0,
//             left: 0,
//             overflow: "hidden",
//           },
//         }}
//       >
//         {drawerContent}
//       </Drawer>

//       {/* Mobile: temporary sidebar */}
//       <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={onMobileClose}
//         ModalProps={{ keepMounted: true }}
//         sx={{
//           display: { xs: "block", md: "none" },
//           "& .MuiDrawer-paper": {
//             width: drawerWidth,
//             height: "100dvh",
//             boxSizing: "border-box",
//             border: 0,
//             overflow: "hidden",
//           },
//         }}
//       >
//         {drawerContent}
//       </Drawer>
//     </>
//   );
// };

// export default Sidebar;

import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const drawerWidth = 250;

const Sidebar = ({
  mobileOpen = false,
  onMobileClose = () => {},
  user,
  isAdmin: isAdminProp,
}) => {
  const [salesOpen, setSalesOpen] = React.useState(true);
  const [itemsOpen, setItemsOpen] = React.useState(true);
  const [customersOpen, setCustomersOpen] = React.useState(false);

  const isAdmin = React.useMemo(() => {
    if (typeof isAdminProp === "boolean") return isAdminProp;

    let currentUser = user;

    if (!currentUser) {
      try {
        currentUser = JSON.parse(
          localStorage.getItem("user") || "null"
        );
      } catch {
        currentUser = null;
      }
    }

    return String(currentUser?.role || "").toUpperCase() === "ADMIN";
  }, [isAdminProp, user]);

  const navigate = (path) => {
    onMobileClose();
    window.location.href = path;
  };

  const navItemSx = {
    minHeight: 42,
    borderRadius: 1.8,
    mb: 0.4,
    color: "#CBD5E1",
    "&:hover": {
      backgroundColor: "#1E293B",
      color: "#FFFFFF",
    },
  };

  const sectionTitleSx = {
    px: 1.5,
    mt: 2.5,
    mb: 1,
    fontSize: 10,
    fontWeight: 700,
    color: "#64748B",
    letterSpacing: 1,
  };

  const NavItem = ({ icon, label, onClick, active = false }) => (
    <ListItemButton
      onClick={onClick}
      sx={{
        ...navItemSx,
        ...(active
          ? {
              bgcolor: "rgba(37,99,235,0.22)",
              color: "#FFFFFF",
              "&:hover": {
                bgcolor: "rgba(37,99,235,0.32)",
              },
            }
          : {}),
      }}
    >
      <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
        {icon}
      </ListItemIcon>

      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontSize: 13,
          fontWeight: 500,
        }}
      />
    </ListItemButton>
  );

  const ParentItem = ({ icon, label, open, onClick }) => (
    <ListItemButton onClick={onClick} sx={navItemSx}>
      <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
        {icon}
      </ListItemIcon>

      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontSize: 13,
          fontWeight: 500,
        }}
      />

      {open ? (
        <ExpandLessIcon sx={{ fontSize: 18 }} />
      ) : (
        <ExpandMoreIcon sx={{ fontSize: 18 }} />
      )}
    </ListItemButton>
  );

  const SubItem = ({ label, onClick }) => (
    <ListItemButton
      onClick={onClick}
      sx={{
        minHeight: 36,
        pl: 6.2,
        borderRadius: 1.5,
        color: "#94A3B8",
        "&:hover": {
          backgroundColor: "#1E293B",
          color: "#FFFFFF",
        },
      }}
    >
      <ListItemText
        primary={label}
        primaryTypographyProps={{ fontSize: 12.5 }}
      />
    </ListItemButton>
  );

  const drawerContent = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#0F172A",
        color: "#FFFFFF",
      }}
    >
      {/* Fixed Logo */}
      <Box
        sx={{
          flexShrink: 0,
          height: 64,
          px: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background: "linear-gradient(135deg, #2563EB, #4F46E5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            C
          </Box>

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
                letterSpacing: 0.5,
              }}
            >
              BUSINESS BILLING
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onMobileClose}
          sx={{
            display: { xs: "flex", sm: "none" },
            color: "#FFFFFF",
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </Box>

      {/* Only navigation scrolls */}
      <Box
        sx={{
          flex: "1 1 0",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: 1.2,
          py: 2,
          overscrollBehavior: "contain",
          scrollbarWidth: "thin",
          scrollbarColor: "#334155 transparent",
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#334155",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Typography sx={{ ...sectionTitleSx, mt: 0 }}>
          OVERVIEW
        </Typography>

        <List disablePadding>
          <NavItem
            icon={<DashboardOutlinedIcon />}
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />
        </List>

        <Typography sx={sectionTitleSx}>SALES</Typography>

        <List disablePadding>
          <ParentItem
            icon={<ShoppingCartOutlinedIcon />}
            label="Sales"
            open={salesOpen}
            onClick={() => setSalesOpen((prev) => !prev)}
          />

          <Collapse in={salesOpen} timeout="auto" unmountOnExit>
            <SubItem
              label="Invoices"
              onClick={() => navigate("/billing/invoices")}
            />
            <SubItem
              label="Recurring Invoices"
              onClick={() => navigate("/billing/recurring-invoices")}
            />
            <SubItem
              label="Credit Notes"
              onClick={() => navigate("/billing/credit-notes")}
            />
            <SubItem
              label="Payments Received"
              onClick={() => navigate("/billing/payments")}
            />
          </Collapse>
        </List>

        <Typography sx={sectionTitleSx}>ITEMS</Typography>

        <List disablePadding>
          <ParentItem
            icon={<Inventory2OutlinedIcon />}
            label="Items"
            open={itemsOpen}
            onClick={() => setItemsOpen((prev) => !prev)}
          />

          <Collapse in={itemsOpen} timeout="auto" unmountOnExit>
            <SubItem
              label="Products"
              onClick={() => navigate("/products")}
            />
            <SubItem
              label="Services"
              onClick={() => navigate("/services")}
            />
            <SubItem
              label="Categories"
              onClick={() => navigate("/categories")}
            />
            <SubItem
              label="Price Lists"
              onClick={() => navigate("/price-lists")}
            />
          </Collapse>
        </List>

        <Typography sx={sectionTitleSx}>CUSTOMERS</Typography>

        <List disablePadding>
          <ParentItem
            icon={<PeopleOutlineOutlinedIcon />}
            label="Customers"
            open={customersOpen}
            onClick={() => setCustomersOpen((prev) => !prev)}
          />

          <Collapse in={customersOpen} timeout="auto" unmountOnExit>
            <SubItem
              label="All Customers"
              onClick={() => navigate("/customers")}
            />
            <SubItem
              label="Customer Statements"
              onClick={() => navigate("/customers/statements")}
            />
          </Collapse>
        </List>

        <Typography sx={sectionTitleSx}>BUSINESS</Typography>

        <List disablePadding>
          <NavItem
            icon={<AccountBalanceWalletOutlinedIcon />}
            label="Expenses"
            onClick={() => navigate("/expenses")}
          />

          <NavItem
            icon={<AssessmentOutlinedIcon />}
            label="Reports"
            onClick={() => navigate("/reports")}
          />

          <NavItem
            icon={<CreditCardOutlinedIcon />}
            label="Subscription"
            onClick={() => navigate("/subscription")}
          />

          <NavItem
            icon={<BusinessOutlinedIcon />}
            label="Business Details"
            onClick={() => navigate("/business-details")}
          />

          <NavItem
            icon={<SettingsOutlinedIcon />}
            label="Settings"
            onClick={() => navigate("/settings")}
          />

          {isAdmin && (
            <>
              <Typography sx={sectionTitleSx}>
                ADMINISTRATION
              </Typography>

              <NavItem
                icon={<AdminPanelSettingsOutlinedIcon />}
                label="Admin Panel"
                onClick={() => navigate("/admin")}
              />
            </>
          )}
        </List>
      </Box>

      {/* Fixed Free Trial card */}
      <Box
        sx={{
          flexShrink: 0,
          p: 1.5,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "#0F172A",
        }}
      >
        <Box
          sx={{
            p: 1.8,
            borderRadius: 2.5,
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.22), rgba(79,70,229,0.22))",
            border: "1px solid rgba(96,165,250,0.18)",
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
            Free Trial
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              color: "#94A3B8",
              mt: 0.5,
            }}
          >
            Manage your subscription
          </Typography>

          <Box
            component="button"
            onClick={() => navigate("/subscription")}
            sx={{
              mt: 1.2,
              border: 0,
              borderRadius: 1.5,
              px: 1.5,
              py: 0.8,
              cursor: "pointer",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            View Plans
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            height: "100vh",
            boxSizing: "border-box",
            border: 0,
            position: "fixed",
            top: 0,
            left: 0,
            overflow: "hidden",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile: temporary sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: "min(250px, 85vw)",
            height: "100dvh",
            boxSizing: "border-box",
            border: 0,
            overflow: "hidden",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
