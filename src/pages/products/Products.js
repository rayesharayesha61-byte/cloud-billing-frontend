// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   Avatar,
//   Box,
//   Button,
//   Chip,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   IconButton,
//   InputAdornment,
//   MenuItem,
//   Paper,
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

// import {
//   Add,

//   EditOutlined,
//   Inventory2,
//   Search,
//   Close,
//   Save,
// } from "@mui/icons-material";

// import API from "../../services/api";

// const emptyForm = {
//   productName: "",
//   sku: "",
//   barcode: "",
//   hsnSac: "",
//   category: "",
//   purchasePrice: "",
//   sellingPrice: "",
//   gst: "",
//   discount: "",
//   stockQuantity: "",
//   unit: "Piece",
// };

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [open, setOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [search, setSearch] = useState("");
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState(emptyForm);

//   // =====================================
//   // GET PRODUCTS
//   // =====================================

//  const loadProducts = async () => {
//   try {
//     setLoading(true);
//     setError("");

//     const response = await API.get("/products");

//     console.log("PRODUCT API RESPONSE:", response.data);

//     setProducts(response.data || []);
//   } catch (err) {
//     console.error("LOAD PRODUCTS ERROR:", err);

//     setError(
//       err.response?.data?.message ||
//         "Unable to load products."
//     );
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   // =====================================
//   // INPUT CHANGE
//   // =====================================

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // =====================================
//   // OPEN ADD
//   // =====================================

//   const handleAdd = () => {
//     setEditingId(null);
//     setFormData(emptyForm);
//     setError("");
//     setOpen(true);
//   };

//   // =====================================
//   // OPEN EDIT
//   // =====================================

//   const handleEdit = (product) => {
//     setEditingId(product.id);

//     setFormData({
//       productName: product.product_name || "",
//       sku: product.sku || "",
//       barcode: product.barcode || "",
//       hsnSac: product.hsn_sac || "",
//       category: product.category || "",
//       purchasePrice: product.purchase_price || "",
//       sellingPrice: product.selling_price || "",
//       gst: product.gst || "",
//       discount: product.discount || "",
//       stockQuantity: product.stock_quantity || "",
//       unit: product.unit || "Piece",
//     });

//     setError("");
//     setOpen(true);
//   };

//   // =====================================
//   // CLOSE
//   // =====================================

//   const handleClose = () => {
//     if (saving) return;

//     setOpen(false);
//     setEditingId(null);
//     setFormData(emptyForm);
//     setError("");
//   };

//   // =====================================
//   // SAVE PRODUCT
//   // =====================================

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setError("");

//     if (!formData.productName.trim()) {
//       setError("Product name is required.");
//       return;
//     }

//     if (!formData.sellingPrice) {
//       setError("Selling price is required.");
//       return;
//     }

//     if (formData.stockQuantity === "") {
//       setError("Stock quantity is required.");
//       return;
//     }

//     try {
//       setSaving(true);

//       const payload = {
//         productName: formData.productName.trim(),
//         sku: formData.sku.trim(),
//         barcode: formData.barcode.trim(),
//         hsnSac: formData.hsnSac.trim(),
//         category: formData.category,
//         purchasePrice: Number(formData.purchasePrice) || 0,
//         sellingPrice: Number(formData.sellingPrice),
//         gst: Number(formData.gst) || 0,
//         discount: Number(formData.discount) || 0,
//         stockQuantity: Number(formData.stockQuantity),
//         unit: formData.unit,
//       };

//       if (editingId) {
//         await API.put(
//           `/products/${editingId}`,
//           payload
//         );
//       } else {
//         await API.post("/products", payload);
//       }

//       await loadProducts();

//       handleClose();
//     } catch (err) {
//       console.error("SAVE PRODUCT ERROR:", err);

//       setError(
//         err.response?.data?.message ||
//           "Unable to save product."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =====================================
//   // DELETE
//   // =====================================

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this product?"
//     );

//     if (!confirmDelete) return;

//     try {
//       await API.delete(`/products/${id}`);

//       setProducts((prev) =>
//         prev.filter((product) => product.id !== id)
//       );
//     } catch (err) {
//       console.error("DELETE PRODUCT ERROR:", err);

//       setError(
//         err.response?.data?.message ||
//           "Unable to delete product."
//       );
//     }
//   };

//   // =====================================
//   // SEARCH
//   // =====================================

//   const filteredProducts = products.filter((product) => {
//     const value = search.toLowerCase();

//     return (
//       product.product_name
//         ?.toLowerCase()
//         .includes(value) ||
//       product.sku
//         ?.toLowerCase()
//         .includes(value) ||
//       product.category
//         ?.toLowerCase()
//         .includes(value)
//     );
//   });

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         backgroundColor: "#F8FAFC",
//         p: {
//           xs: 2,
//           sm: 3,
//           md: 4,
//         },
//       }}
//     >
//       {/* ================================= */}
//       {/* HEADER */}
//       {/* ================================= */}

//       <Stack
//         direction={{
//           xs: "column",
//           sm: "row",
//         }}
//         justifyContent="space-between"
//         alignItems={{
//           xs: "flex-start",
//           sm: "center",
//         }}
//         spacing={2}
//         sx={{ mb: 3 }}
//       >
//         <Box>
//           <Stack
//             direction="row"
//             spacing={1.5}
//             alignItems="center"
//           >
//             <Avatar
//               sx={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: "12px",
//                 background:
//                   "linear-gradient(135deg, #4F46E5, #2563EB)",
//               }}
//             >
//               <Inventory2 />
//             </Avatar>

//             <Box>
//               <Typography
//                 sx={{
//                   fontSize: {
//                     xs: 22,
//                     sm: 26,
//                   },
//                   fontWeight: 800,
//                   color: "#0F172A",
//                 }}
//               >
//                 Products
//               </Typography>

//               <Typography
//                 sx={{
//                   fontSize: 12,
//                   color: "#64748B",
//                   mt: 0.3,
//                 }}
//               >
//                 Manage your products and inventory
//               </Typography>
//             </Box>
//           </Stack>
//         </Box>

//         <Button
//           variant="contained"
//           startIcon={<Add />}
//           onClick={handleAdd}
//           sx={{
//             minHeight: 44,
//             px: 2.2,
//             borderRadius: "11px",
//             textTransform: "none",
//             fontWeight: 700,
//             background:
//               "linear-gradient(135deg, #4F46E5, #2563EB)",
//             boxShadow:
//               "0 8px 20px rgba(79,70,229,0.20)",

//             "&:hover": {
//               background:
//                 "linear-gradient(135deg, #4338CA, #1D4ED8)",
//             },
//           }}
//         >
//           Add Product
//         </Button>
//       </Stack>

//       {/* ================================= */}
//       {/* ERROR */}
//       {/* ================================= */}

//       {error && !open && (
//         <Alert
//           severity="error"
//           sx={{
//             mb: 2,
//             borderRadius: "12px",
//           }}
//         >
//           {error}
//         </Alert>
//       )}

//       {/* ================================= */}
//       {/* PRODUCT CARD */}
//       {/* ================================= */}

//       <Paper
//         elevation={0}
//         sx={{
//           borderRadius: "18px",
//           border: "1px solid #E2E8F0",
//           overflow: "hidden",
//           backgroundColor: "#FFFFFF",
//         }}
//       >
//         {/* SEARCH BAR */}

//         <Box
//           sx={{
//             p: 2,
//             borderBottom: "1px solid #E2E8F0",
//           }}
//         >
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search product, SKU or category..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             sx={{
//               maxWidth: 420,

//               "& .MuiOutlinedInput-root": {
//                 borderRadius: "10px",
//                 backgroundColor: "#F8FAFC",

//                 "& fieldset": {
//                   borderColor: "#E2E8F0",
//                 },

//                 "&:hover fieldset": {
//                   borderColor: "#A5B4FC",
//                 },

//                 "&.Mui-focused fieldset": {
//                   borderColor: "#6366F1",
//                 },
//               },
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search
//                     sx={{
//                       color: "#94A3B8",
//                       fontSize: 20,
//                     }}
//                   />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Box>

//         {/* ================================= */}
//         {/* TABLE */}
//         {/* ================================= */}

//         {loading ? (
//           <Box
//             sx={{
//               minHeight: 350,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <CircularProgress size={30} />
//           </Box>
//         ) : filteredProducts.length === 0 ? (
//           <Box
//             sx={{
//               minHeight: 350,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               px: 3,
//             }}
//           >
//             <Avatar
//               sx={{
//                 width: 60,
//                 height: 60,
//                 borderRadius: "16px",
//                 backgroundColor: "#EEF2FF",
//                 color: "#6366F1",
//                 mb: 1.5,
//               }}
//             >
//               <Inventory2 />
//             </Avatar>

//             <Typography
//               sx={{
//                 fontSize: 16,
//                 fontWeight: 800,
//                 color: "#0F172A",
//               }}
//             >
//               No products found
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 0.5,
//                 fontSize: 12,
//                 color: "#64748B",
//                 textAlign: "center",
//               }}
//             >
//               Add your first product to start
//               managing your inventory.
//             </Typography>

//             <Button
//               variant="outlined"
//               startIcon={<Add />}
//               onClick={handleAdd}
//               sx={{
//                 mt: 2,
//                 borderRadius: "10px",
//                 textTransform: "none",
//                 fontWeight: 700,
//               }}
//             >
//               Add Product
//             </Button>
//           </Box>
//         ) : (
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow
//                   sx={{
//                     backgroundColor: "#F8FAFC",
//                   }}
//                 >
//                   <TableCell
//                     sx={tableHeaderStyle}
//                   >
//                     Product
//                   </TableCell>

//                   <TableCell
//                     sx={tableHeaderStyle}
//                   >
//                     SKU
//                   </TableCell>

//                   <TableCell
//                     sx={tableHeaderStyle}
//                   >
//                     Category
//                   </TableCell>

//                   <TableCell
//                     sx={tableHeaderStyle}
//                   >
//                     Selling Price
//                   </TableCell>

//                   <TableCell
//                     sx={tableHeaderStyle}
//                   >
//                     GST
//                   </TableCell>

//                   <TableCell
//                     sx={tableHeaderStyle}
//                   >
//                     Stock
//                   </TableCell>

//                   <TableCell
//                     align="right"
//                     sx={tableHeaderStyle}
//                   >
//                     Actions
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {filteredProducts.map((product) => (
//                   <TableRow
//                     key={product.id}
//                     hover
//                     sx={{
//                       "&:last-child td": {
//                         borderBottom: 0,
//                       },
//                     }}
//                   >
//                     <TableCell>
//                       <Stack
//                         direction="row"
//                         spacing={1.2}
//                         alignItems="center"
//                       >
//                         <Avatar
//                           sx={{
//                             width: 36,
//                             height: 36,
//                             borderRadius: "9px",
//                             backgroundColor:
//                               "#EEF2FF",
//                             color: "#4F46E5",
//                           }}
//                         >
//                           <Inventory2
//                             sx={{ fontSize: 18 }}
//                           />
//                         </Avatar>

//                         <Box>
//                           <Typography
//                             sx={{
//                               fontSize: 13,
//                               fontWeight: 700,
//                               color: "#0F172A",
//                             }}
//                           >
//                             {product.product_name}
//                           </Typography>

//                           <Typography
//                             sx={{
//                               fontSize: 10,
//                               color: "#94A3B8",
//                             }}
//                           >
//                             {product.hsn_sac || "No HSN/SAC"}
//                           </Typography>
//                         </Box>
//                       </Stack>
//                     </TableCell>

//                     <TableCell sx={tableCellStyle}>
//                       {product.sku || "-"}
//                     </TableCell>

//                     <TableCell sx={tableCellStyle}>
//                       {product.category || "-"}
//                     </TableCell>

//                     <TableCell sx={tableCellStyle}>
//                       ₹
//                       {Number(
//                         product.selling_price || 0
//                       ).toLocaleString("en-IN")}
//                     </TableCell>

//                     <TableCell>
//                       <Chip
//                         label={`${product.gst || 0}%`}
//                         size="small"
//                         sx={{
//                           borderRadius: "7px",
//                           backgroundColor:
//                             "#EFF6FF",
//                           color: "#2563EB",
//                           fontWeight: 700,
//                           fontSize: 10,
//                         }}
//                       />
//                     </TableCell>

//                     <TableCell>
//                       <Chip
//                         label={`${product.stock_quantity || 0} ${
//                           product.unit || "Piece"
//                         }`}
//                         size="small"
//                         sx={{
//                           borderRadius: "7px",
//                           backgroundColor:
//                             Number(
//                               product.stock_quantity
//                             ) <= 5
//                               ? "#FEF2F2"
//                               : "#ECFDF5",

//                           color:
//                             Number(
//                               product.stock_quantity
//                             ) <= 5
//                               ? "#DC2626"
//                               : "#059669",

//                           fontWeight: 700,
//                           fontSize: 10,
//                         }}
//                       />
//                     </TableCell>

//                     <TableCell align="right">
//                       <IconButton
//                         size="small"
//                         onClick={() =>
//                           handleEdit(product)
//                         }
//                         sx={{
//                           color: "#4F46E5",
//                           mr: 0.5,
//                         }}
//                       >
//                         <EditOutlined
//                           sx={{ fontSize: 19 }}
//                         />
//                       </IconButton>

//                       <IconButton
//                         size="small"
//                         onClick={() =>
//                           handleDelete(product.id)
//                         }
//                         sx={{
//                           color: "#EF4444",
//                         }}
//                       >
//                         {/* <DeleteOutline
//                           sx={{ fontSize: 19 }}
//                         /> */}
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>

//       {/* ================================= */}
//       {/* ADD / EDIT DIALOG */}
//       {/* ================================= */}

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         fullWidth
//         maxWidth="md"
//         PaperProps={{
//           sx: {
//             borderRadius: "20px",
//             overflow: "hidden",
//           },
//         }}
//       >
//         {/* DIALOG HEADER */}

//         <DialogTitle
//           sx={{
//             px: 3,
//             py: 2.5,
//             borderBottom: "1px solid #E2E8F0",
//           }}
//         >
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Box>
//               <Typography
//                 sx={{
//                   fontSize: 20,
//                   fontWeight: 800,
//                   color: "#0F172A",
//                 }}
//               >
//                 {editingId
//                   ? "Edit Product"
//                   : "Add New Product"}
//               </Typography>

//               <Typography
//                 sx={{
//                   fontSize: 11,
//                   color: "#64748B",
//                   mt: 0.4,
//                 }}
//               >
//                 Enter product and inventory details
//               </Typography>
//             </Box>

//             <IconButton onClick={handleClose}>
//               <Close />
//             </IconButton>
//           </Stack>
//         </DialogTitle>

//         {/* DIALOG BODY */}

//         <DialogContent sx={{ p: 3 }}>
//           {error && (
//             <Alert
//               severity="error"
//               sx={{
//                 mb: 2,
//                 borderRadius: "10px",
//               }}
//             >
//               {error}
//             </Alert>
//           )}

//           <Grid container spacing={2}>
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <TextField
//                 fullWidth
//                 required
//                 label="Product Name"
//                 name="productName"
//                 value={formData.productName}
//                 onChange={handleChange}
//                 placeholder="Example: Product A"
//                 sx={fieldStyle}
//               />
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <TextField
//                 fullWidth
//                 label="SKU"
//                 name="sku"
//                 value={formData.sku}
//                 onChange={handleChange}
//                 placeholder="Example: PROD-001"
//                 sx={fieldStyle}
//               />
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <TextField
//                 fullWidth
//                 label="Barcode"
//                 name="barcode"
//                 value={formData.barcode}
//                 onChange={handleChange}
//                 placeholder="Optional"
//                 sx={fieldStyle}
//               />
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <TextField
//                 fullWidth
//                 label="HSN / SAC"
//                 name="hsnSac"
//                 value={formData.hsnSac}
//                 onChange={handleChange}
//                 placeholder="Example: 8471"
//                 sx={fieldStyle}
//               />
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 sx={fieldStyle}
//               >
//                 <MenuItem value="">
//                   Select Category
//                 </MenuItem>

//                 <MenuItem value="General">
//                   General
//                 </MenuItem>

//                 <MenuItem value="Electronics">
//                   Electronics
//                 </MenuItem>

//                 <MenuItem value="Clothing">
//                   Clothing
//                 </MenuItem>

//                 <MenuItem value="Food">
//                   Food
//                 </MenuItem>

//                 <MenuItem value="Services">
//                   Services
//                 </MenuItem>

//                 <MenuItem value="Other">
//                   Other
//                 </MenuItem>
//               </TextField>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Unit"
//                 name="unit"
//                 value={formData.unit}
//                 onChange={handleChange}
//                 sx={fieldStyle}
//               >
//                 <MenuItem value="Piece">
//                   Piece
//                 </MenuItem>

//                 <MenuItem value="Kg">
//                   Kg
//                 </MenuItem>

//                 <MenuItem value="Gram">
//                   Gram
//                 </MenuItem>

//                 <MenuItem value="Liter">
//                   Liter
//                 </MenuItem>

//                 <MenuItem value="Meter">
//                   Meter
//                 </MenuItem>

//                 <MenuItem value="Box">
//                   Box
//                 </MenuItem>
//               </TextField>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <TextField
//                 fullWidth
//                 type="number"
//                 label="Purchase Price"
//                 name="purchasePrice"
//                 value={formData.purchasePrice}
//                 onChange={handleChange}
//                 placeholder="0.00"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       ₹
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={fieldStyle}
//               />
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <TextField
//                 fullWidth
//                 required
//                 type="number"
//                 label="Selling Price"
//                 name="sellingPrice"
//                 value={formData.sellingPrice}
//                 onChange={handleChange}
//                 placeholder="0.00"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       ₹
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={fieldStyle}
//               />
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <TextField
//                 fullWidth
//                 type="number"
//                 label="GST %"
//                 name="gst"
//                 value={formData.gst}
//                 onChange={handleChange}
//                 placeholder="18"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       %
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={fieldStyle}
//               />
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <TextField
//                 fullWidth
//                 type="number"
//                 label="Discount"
//                 name="discount"
//                 value={formData.discount}
//                 onChange={handleChange}
//                 placeholder="0"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       %
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={fieldStyle}
//               />
//             </Grid>

//             <Grid size={{ xs: 12 }}>
//               <TextField
//                 fullWidth
//                 type="number"
//                 label="Opening Stock"
//                 name="stockQuantity"
//                 value={formData.stockQuantity}
//                 onChange={handleChange}
//                 placeholder="Enter available quantity"
//                 sx={fieldStyle}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>

//         {/* DIALOG ACTIONS */}

//         <DialogActions
//           sx={{
//             px: 3,
//             py: 2,
//             borderTop: "1px solid #E2E8F0",
//           }}
//         >
//           <Button
//             onClick={handleClose}
//             disabled={saving}
//             sx={{
//               textTransform: "none",
//               borderRadius: "9px",
//               color: "#64748B",
//               fontWeight: 700,
//             }}
//           >
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={saving}
//             startIcon={
//               saving ? (
//                 <CircularProgress
//                   size={16}
//                   color="inherit"
//                 />
//               ) : (
//                 <Save />
//               )
//             }
//             sx={{
//               minWidth: 130,
//               borderRadius: "9px",
//               textTransform: "none",
//               fontWeight: 700,
//               background:
//                 "linear-gradient(135deg, #4F46E5, #2563EB)",
//             }}
//           >
//             {saving
//               ? "Saving..."
//               : editingId
//               ? "Update Product"
//               : "Save Product"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// // =====================================
// // STYLES
// // =====================================

// const fieldStyle = {
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "11px",
//     backgroundColor: "#F8FAFC",

//     "& fieldset": {
//       borderColor: "#E2E8F0",
//     },

//     "&:hover fieldset": {
//       borderColor: "#A5B4FC",
//     },

//     "&.Mui-focused": {
//       backgroundColor: "#FFFFFF",
//     },

//     "&.Mui-focused fieldset": {
//       borderColor: "#6366F1",
//     },
//   },

//   "& .MuiInputLabel-root.Mui-focused": {
//     color: "#4F46E5",
//   },
// };

// const tableHeaderStyle = {
//   fontSize: 11,
//   fontWeight: 800,
//   color: "#64748B",
//   textTransform: "uppercase",
//   whiteSpace: "nowrap",
// };

// const tableCellStyle = {
//   fontSize: 12,
//   color: "#475569",
//   whiteSpace: "nowrap",
// };

// export default Products;
import React, { useEffect, useState } from "react";
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress, Dialog,
  DialogActions, DialogContent, DialogTitle, Grid, IconButton,
  InputAdornment, MenuItem, Paper, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from "@mui/material";
import { Add, EditOutlined, Inventory2, Search, Close, Save, Delete } from "@mui/icons-material";
import API from "../../services/api";

const emptyForm = {
  productName: "", sku: "", barcode: "", hsnSac: "", category: "",
  purchasePrice: "", sellingPrice: "", gst: "", discount: "",
  stockQuantity: "", unit: "Piece"
};

const getProductList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const normalizeProduct = (p) => ({
  ...p,
  id: p.id,
  product_name: p.product_name ?? p.productName ?? "",
  sku: p.sku ?? "",
  barcode: p.barcode ?? "",
  hsn_sac: p.hsn_sac ?? p.hsnSac ?? "",
  category: p.category ?? "",
  purchase_price: p.purchase_price ?? p.purchasePrice ?? 0,
  selling_price: p.selling_price ?? p.sellingPrice ?? 0,
  gst: p.gst ?? 0,
  discount: p.discount ?? 0,
  stock_quantity: p.stock_quantity ?? p.stockQuantity ?? 0,
  unit: p.unit ?? "Piece",
});

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/products");
      console.log("PRODUCT API RESPONSE:", response.data);
      setProducts(getProductList(response.data).map(normalizeProduct));
    } catch (err) {
      console.error("LOAD PRODUCTS ERROR:", err);
      setError(err.response?.data?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setOpen(true);
  };

  const handleEdit = (p) => {
    const product = normalizeProduct(p);
    setEditingId(product.id);
    setFormData({
      productName: product.product_name,
      sku: product.sku,
      barcode: product.barcode,
      hsnSac: product.hsn_sac,
      category: product.category,
      purchasePrice: String(product.purchase_price ?? ""),
      sellingPrice: String(product.selling_price ?? ""),
      gst: String(product.gst ?? ""),
      discount: String(product.discount ?? ""),
      stockQuantity: String(product.stock_quantity ?? ""),
      unit: product.unit || "Piece",
    });
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    if (saving) return;
    setOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.productName.trim()) return setError("Product name is required.");
    if (formData.sellingPrice === "" || Number(formData.sellingPrice) < 0)
      return setError("Enter a valid selling price.");
    if (formData.stockQuantity === "" || Number(formData.stockQuantity) < 0)
      return setError("Enter a valid stock quantity.");

 const payload = {
  product_name: formData.productName.trim(),
  sku: formData.sku.trim() || null,
  barcode: formData.barcode.trim() || null,
  hsn_sac: formData.hsnSac.trim() || null,
  category: formData.category || null,
  purchase_price: Number(formData.purchasePrice) || 0,
  selling_price: Number(formData.sellingPrice),
  gst: Number(formData.gst) || 0,
  discount: Number(formData.discount) || 0,
  stock_quantity: Number(formData.stockQuantity) || 0,
  unit: formData.unit || "Piece",
};

    try {
      setSaving(true);
      if (editingId) await API.put(`/products/${editingId}`, payload);
      else await API.post("/products", payload);
      await loadProducts();
      setOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err) {
      console.error("SAVE PRODUCT ERROR:", err);
      setError(err.response?.data?.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => Number(p.id) !== Number(id)));
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);
      setError(err.response?.data?.message || "Unable to delete product.");
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return [p.product_name, p.sku, p.category].some((v) => String(v || "").toLowerCase().includes(q));
  });

  const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "10px" } };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC", p: { xs: 2, sm: 3, md: 4 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 44, height: 44, borderRadius: "12px", background: "linear-gradient(135deg,#4F46E5,#2563EB)" }}><Inventory2 /></Avatar>
          <Box><Typography variant="h5" fontWeight={800} color="#0F172A">Products</Typography><Typography variant="body2" color="#64748B">Manage products and inventory</Typography></Box>
        </Stack>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ textTransform: "none", borderRadius: "10px" }}>Add Product</Button>
      </Stack>

      {error && !open && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ border: "1px solid #E2E8F0", borderRadius: "16px", overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #E2E8F0" }}>
          <TextField size="small" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product, SKU or category..." sx={{ maxWidth: 420, ...fieldSx }} InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
        </Box>
        {loading ? <Box sx={{ p: 8, textAlign: "center" }}><CircularProgress size={30} /></Box> :
          filteredProducts.length === 0 ? <Box sx={{ p: 7, textAlign: "center" }}><Inventory2 sx={{ fontSize: 42, color: "#6366F1" }} /><Typography fontWeight={800}>No products found</Typography><Typography variant="body2" color="text.secondary">Add your first product to manage inventory.</Typography><Button sx={{ mt: 2, textTransform: "none" }} onClick={handleAdd} startIcon={<Add />}>Add Product</Button></Box> :
          <TableContainer><Table>
            <TableHead><TableRow sx={{ bgcolor: "#F8FAFC" }}>{["Product", "SKU", "Category", "Selling Price", "GST", "Stock", "Actions"].map((h) => <TableCell key={h} sx={{ fontSize: 11, fontWeight: 800, color: "#64748B" }}>{h}</TableCell>)}</TableRow></TableHead>
            <TableBody>{filteredProducts.map((p) => <TableRow hover key={p.id}>
              <TableCell><Typography fontWeight={700}>{p.product_name}</Typography><Typography variant="caption" color="text.secondary">{p.hsn_sac || "No HSN/SAC"}</Typography></TableCell>
              <TableCell>{p.sku || "-"}</TableCell><TableCell>{p.category || "-"}</TableCell>
              <TableCell>₹{Number(p.selling_price || 0).toLocaleString("en-IN")}</TableCell>
              <TableCell><Chip size="small" label={`${p.gst || 0}%`} /></TableCell>
              <TableCell><Chip size="small" label={`${p.stock_quantity || 0} ${p.unit || "Piece"}`} color={Number(p.stock_quantity) <= 5 ? "error" : "success"} /></TableCell>
              <TableCell><IconButton size="small" onClick={() => handleEdit(p)} color="primary"><EditOutlined /></IconButton><IconButton size="small" onClick={() => handleDelete(p.id)} color="error"><Delete /></IconButton></TableCell>
            </TableRow>)}</TableBody>
          </Table></TableContainer>}
      </Paper>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ borderBottom: "1px solid #E2E8F0" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box><Typography fontWeight={800}>{editingId ? "Edit Product" : "Add New Product"}</Typography><Typography variant="caption" color="text.secondary">Enter product and inventory details</Typography></Box>
            <IconButton onClick={handleClose}><Close /></IconButton>
          </Stack>
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2}>
              {[
                ["productName", "Product Name", true], ["sku", "SKU"], ["barcode", "Barcode"], ["hsnSac", "HSN / SAC"]
              ].map(([name, label, required]) => <Grid item xs={12} sm={6} key={name}><TextField fullWidth name={name} label={label} required={Boolean(required)} value={formData[name]} onChange={handleChange} sx={fieldSx} /></Grid>)}
              <Grid item xs={12} sm={6}><TextField select fullWidth name="category" label="Category" value={formData.category} onChange={handleChange} sx={fieldSx}>{["General","Electronics","Clothing","Food","Services","Other"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField></Grid>
              <Grid item xs={12} sm={6}><TextField select fullWidth name="unit" label="Unit" value={formData.unit} onChange={handleChange} sx={fieldSx}>{["Piece","Kg","Gram","Liter","Meter","Box"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField></Grid>
              {[["purchasePrice","Purchase Price"],["sellingPrice","Selling Price"],["gst","GST %"],["discount","Discount %"],["stockQuantity","Opening Stock"]].map(([name,label]) => <Grid item xs={12} sm={6} key={name}><TextField fullWidth type="number" name={name} label={label} value={formData[name]} onChange={handleChange} inputProps={{ min: 0, step: "any" }} required={["sellingPrice","stockQuantity"].includes(name)} sx={fieldSx} /></Grid>)}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: "1px solid #E2E8F0" }}>
            <Button onClick={handleClose} disabled={saving} sx={{ textTransform: "none" }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={16} /> : <Save />} sx={{ textTransform: "none" }}>{saving ? "Saving..." : editingId ? "Update Product" : "Save Product"}</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
