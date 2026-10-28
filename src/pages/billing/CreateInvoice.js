import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  PictureAsPdf,
  Share,

} from "@mui/icons-material";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  ArrowBack,
  Delete,
  // DescriptionOutlined,
 
  Inventory2Outlined,
  ReceiptLong,
  Save,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import API from "../../services/api";

// =====================================================
// EMPTY ITEM
// =====================================================

const createEmptyItem = () => ({
  productId: "",
  quantity: 1,
});


// =====================================================
// COMPONENT
// =====================================================

const CreateInvoice = () => {
  const navigate = useNavigate();

  // ---------------------------------------------------
  // STATE
  // ---------------------------------------------------

  const [customers, setCustomers] = useState([]);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
const [createdInvoice, setCreatedInvoice] = useState(null);


  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [customerId, setCustomerId] =
    useState("");

  const [invoiceDate, setInvoiceDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [paymentMode, setPaymentMode] =
    useState("Cash");

  const [discountAmount, setDiscountAmount] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [items, setItems] = useState([
    createEmptyItem(),
  ]);

  // ===================================================
  // LOAD CUSTOMERS + PRODUCTS
  // ===================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        setError("");

        const [
          customersResponse,
          productsResponse,
        ] = await Promise.all([
          API.get("/customers"),
          API.get("/products"),
        ]);

        console.log(
          "CUSTOMERS:",
          customersResponse.data
        );

        console.log(
          "PRODUCTS:",
          productsResponse.data
        );

        const customerData =
          customersResponse.data;

        const productData =
          productsResponse.data;

        setCustomers(
          Array.isArray(customerData)
            ? customerData
            : customerData?.customers || []
        );

        setProducts(
          Array.isArray(productData)
            ? productData
            : productData?.products || []
        );
      } catch (err) {
        console.error(
          "LOAD BILLING DATA ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load customers and products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ===================================================
  // SELECTED CUSTOMER
  // ===================================================

  const selectedCustomer = useMemo(() => {
    return customers.find(
      (customer) =>
        Number(customer.id) ===
        Number(customerId)
    );
  }, [customers, customerId]);

  // ===================================================
  // ITEM CHANGE
  // ===================================================

  const handleItemChange = (
    index,
    field,
    value
  ) => {
    setItems((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  // ===================================================
  // ADD ITEM
  // ===================================================

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      createEmptyItem(),
    ]);
  };

  // ===================================================
  // REMOVE ITEM
  // ===================================================

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      return;
    }

    setItems((prev) =>
      prev.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  // ===================================================
  // PRODUCT FIND
  // ===================================================

 const getProduct = useCallback(
  (productId) => {
    return products.find(
      (product) => Number(product.id) === Number(productId)
    );
  },
  [products]
);

const calculateItem = useCallback(
  (item) => {
    const product = getProduct(item.productId);

    if (!product) {
      return {
        product: null,
        quantity: 0,
        gross: 0,
        discount: 0,
        taxable: 0,
        gst: 0,
        total: 0,
      };
    }

    const quantity = Number(item.quantity) || 0;
    const price = Number(product.selling_price) || 0;
    const gstPercent = Number(product.gst) || 0;
    const discountPercent = Number(product.discount) || 0;

    const gross = quantity * price;
    const discount = gross * (discountPercent / 100);
    const taxable = gross - discount;
    const gst = taxable * (gstPercent / 100);
    const total = taxable + gst;

    return {
      product,
      quantity,
      gross,
      discount,
      taxable,
      gst,
      total,
    };
  },
  [getProduct]
);

  // ===================================================
  // TOTALS
  // ===================================================

 const totals = useMemo(() => {
  let subtotal = 0;
  let gst = 0;
  let lineDiscount = 0;

  items.forEach((item) => {
    const calculated = calculateItem(item);

    subtotal += calculated.taxable;
    gst += calculated.gst;
    lineDiscount += calculated.discount;
  });

  const invoiceDiscount = Math.max(
    0,
    Number(discountAmount) || 0
  );

  const grandTotal = Math.max(
    0,
    subtotal + gst - invoiceDiscount
  );

  return {
    subtotal,
    gst,
    lineDiscount,
    invoiceDiscount,
    grandTotal,
  };
}, [items, calculateItem, discountAmount]);

  // ===================================================
  // SAVE INVOICE
  // ===================================================

 



const generateInvoicePDF = () => {
  if (!createdInvoice) return;

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("INVOICE", 14, 20);

  doc.setFontSize(10);

  doc.text(`Invoice No: ${createdInvoice.invoiceNumber}`, 14, 32);
  doc.text(`Date: ${createdInvoice.invoiceDate}`, 14, 39);
  doc.text(`Customer: ${createdInvoice.customerName}`, 14, 46);
  doc.text(`Payment Mode: ${createdInvoice.paymentMode}`, 14, 53);

  autoTable(doc, {
    startY: 62,
    head: [["Product", "Qty", "Rate", "GST", "Amount"]],
    body: createdInvoice.items.map((item) => [
      item.name,
      String(item.quantity),
      `Rs. ${Number(item.price).toFixed(2)}`,
      `${item.gstPercent}%`,
      `Rs. ${Number(item.total).toFixed(2)}`,
    ]),
  });

  let finalY = doc.lastAutoTable.finalY + 10;

  // Add another page if the summary would overflow.
  if (finalY + 45 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
    finalY = 20;
  }

  doc.setFontSize(10);
  doc.text(`Subtotal: Rs. ${createdInvoice.subtotal.toFixed(2)}`, 14, finalY);
  doc.text(`GST: Rs. ${createdInvoice.gst.toFixed(2)}`, 14, finalY + 7);
  doc.text(`Discount: Rs. ${createdInvoice.discount.toFixed(2)}`, 14, finalY + 14);

  doc.setFontSize(14);
  doc.text(
    `Grand Total: Rs. ${createdInvoice.grandTotal.toFixed(2)}`,
    14,
    finalY + 24
  );

  if (createdInvoice.notes) {
    doc.setFontSize(10);
    const noteLines = doc.splitTextToSize(
      `Notes: ${createdInvoice.notes}`,
      180
    );

    doc.text(noteLines, 14, finalY + 34);
  }

  doc.save(`${createdInvoice.invoiceNumber}.pdf`);
};


const shareInvoiceWhatsApp = () => {
  if (!createdInvoice) return;

  const message = encodeURIComponent(
    `Invoice: ${createdInvoice.invoiceNumber}\n` +
    `Date: ${createdInvoice.invoiceDate}\n` +
    `Customer: ${createdInvoice.customerName}\n` +
    `Payment Mode: ${createdInvoice.paymentMode}\n` +
    `Grand Total: Rs. ${createdInvoice.grandTotal.toFixed(2)}\n\n` +
    "Please find the invoice PDF downloaded from our billing system."
  );

  window.open(
    `https://wa.me/?text=${message}`,
    "_blank",
    "noopener,noreferrer"
  );
};

  // ===================================================
  // SAVE INVOICE
  // ===================================================

  const handleSubmit = async () => {
    if (saving) return;

    try {
      setError("");
      setSuccess("");

      // Validate customer
      if (!customerId) {
        setError("Please select a customer.");
        return;
      }

      if (!invoiceDate) {
        setError("Please select an invoice date.");
        return;
      }

      // Validate products
      const validItems = items.filter(
        (item) =>
          item.productId !== "" &&
          Number(item.quantity) > 0
      );

      if (validItems.length === 0) {
        setError("Please add at least one product.");
        return;
      }

      // Validate stock
      for (const item of validItems) {
        const product = getProduct(item.productId);

        if (!product) {
          setError("Selected product not found.");
          return;
        }

        const quantity = Number(item.quantity);
        const stock = Number(product.stock_quantity || 0);

        if (!Number.isFinite(quantity) || quantity <= 0) {
          setError("Please enter a valid quantity.");
          return;
        }

        if (quantity > stock) {
          setError(
            `${product.product_name} has only ${stock} ${product.unit || "Piece"} available.`
          );
          return;
        }
      }

      // Validate discount
      const invoiceDiscount = Number(discountAmount || 0);

      if (
        !Number.isFinite(invoiceDiscount) ||
        invoiceDiscount < 0 ||
        invoiceDiscount > totals.subtotal
      ) {
        setError(
          "Please enter a valid discount amount."
        );
        return;
      }

      setSaving(true);

      const payload = {
        customerId: Number(customerId),
        invoiceDate,
        paymentMode,
        discountAmount: invoiceDiscount,
        notes: notes.trim(),
        items: validItems.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      };

      console.log("CREATE INVOICE PAYLOAD:", payload);

      const response = await API.post("/invoices", payload);

      console.log("CREATE INVOICE RESPONSE:", response.data);

      // Backend returns invoiceNumber directly
    const data = response.data;

const invoice =
  data?.invoice ??
  data?.data?.invoice ??
  data?.data ??
  data;

const invoiceNumber =
  invoice?.invoiceNumber ??
  invoice?.invoice_number ??
  invoice?.invoice_no;

if (!invoiceNumber) {
  console.error("Unexpected invoice response:", data);

  setError(
    "Invoice number is missing. Check the backend response in the console."
  );
  return;
}

      // Success
      setSuccess(
        `Invoice ${invoiceNumber} created successfully.`
      );

setCreatedInvoice({
  invoiceNumber: String(invoiceNumber),
  invoiceDate,
  customerName: selectedCustomer?.customer_name || "-",
  paymentMode,
  notes: notes.trim(),
  subtotal: totals.subtotal,
  gst: totals.gst,
  discount: totals.invoiceDiscount,
  grandTotal: totals.grandTotal,

  items: validItems.map((item) => {
    const result = calculateItem(item);

    return {
      name: result.product?.product_name || "-",
      quantity: result.quantity,
      price: Number(result.product?.selling_price) || 0,
      gstPercent: Number(result.product?.gst) || 0,
      total: result.total,
    };
  }),
});
      // Reset form
      setCustomerId("");
      setDiscountAmount("");
      setNotes("");
      setPaymentMode("Cash");
      setItems([createEmptyItem()]);

    } catch (error) {
      console.error(
        "CREATE INVOICE ERROR:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        "Unable to create invoice. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8FAFC",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <IconButton
            onClick={() =>
              navigate("/billing")
            }
            sx={{
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
            }}
          >
            <ArrowBack />
          </IconButton>

          <Avatar
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #4F46E5, #2563EB)",
            }}
          >
            <ReceiptLong />
          </Avatar>



          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 26,
                },
                fontWeight: 800,
                color: "#0F172A",
              }}
            >
              Create Invoice
            </Typography>



            <Typography
              sx={{
                fontSize: 12,
                color: "#64748B",
              }}
            >
              Create a new customer invoice
            </Typography>
          </Box>
          
        </Stack>
      </Stack>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            mb: 2,
            borderRadius: "12px",
          }}
        >
          {error}
        </Alert>
      )}

      {/* ================================================= */}
      {/* CUSTOMER + INVOICE INFO */}
      {/* ================================================= */}

      <Paper
        elevation={0}
        sx={cardStyle}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 2.5 }}
        >
         

          <Typography
            sx={sectionTitleStyle}
          >
            Customer & Invoice Details
          </Typography>
        </Stack>

        <Grid
          container
          spacing={2}
        >
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <FormControl
              fullWidth
              sx={fieldStyle}
            >
              <InputLabel>
                Customer *
              </InputLabel>

              <Select
                value={customerId}
                label="Customer *"
                onChange={(e) =>
                  setCustomerId(
                    e.target.value
                  )
                }
              >
                <MenuItem value="">
                  Select Customer
                </MenuItem>

                {customers.map(
                  (customer) => (
                    <MenuItem
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.customer_name}

                      {customer.mobile
                        ? ` - ${customer.mobile}`
                        : ""}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <TextField
              fullWidth
              type="date"
              label="Invoice Date"
              value={invoiceDate}
              onChange={(e) =>
                setInvoiceDate(
                  e.target.value
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldStyle}
            />
          </Grid>

          {selectedCustomer && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  backgroundColor: "#F8FAFC",
                  border:
                    "1px solid #E2E8F0",
                }}
              >
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={2}
                  divider={
                    <Divider
                      orientation="vertical"
                      flexItem
                    />
                  }
                >
                  <Box>
                    <Typography
                      sx={smallLabelStyle}
                    >
                      Customer
                    </Typography>

                    <Typography
                      sx={smallValueStyle}
                    >
                      {
                        selectedCustomer.customer_name
                      }
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={smallLabelStyle}
                    >
                      Mobile
                    </Typography>

                    <Typography
                      sx={smallValueStyle}
                    >
                      {selectedCustomer.mobile ||
                        "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={smallLabelStyle}
                    >
                      GSTIN
                    </Typography>

                    <Typography
                      sx={smallValueStyle}
                    >
                      {selectedCustomer.gstin ||
                        "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={smallLabelStyle}
                    >
                      State
                    </Typography>

                    <Typography
                      sx={smallValueStyle}
                    >
                      {selectedCustomer.state ||
                        "-"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* ================================================= */}
      {/* PRODUCTS */}
      {/* ================================================= */}

      <Paper
        elevation={0}
        sx={{
          ...cardStyle,
          mt: 3,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={1.5}
          sx={{ mb: 2.5 }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Inventory2Outlined
              sx={{
                color: "#4F46E5",
              }}
            />

            <Typography
              sx={sectionTitleStyle}
            >
              Products
            </Typography>
          </Stack>

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddItem}
            sx={{
              textTransform: "none",
              borderRadius: "9px",
              fontWeight: 700,
            }}
          >
            Add Product
          </Button>
        </Stack>

        {/* Product rows */}

        <Stack spacing={2}>
          {items.map(
            (item, index) => {
              const calculated =
                calculateItem(item);

              const product =
                calculated.product;

              return (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: "13px",
                    border:
                      "1px solid #E2E8F0",
                    backgroundColor:
                      "#FFFFFF",
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                  >
                    {/* Product */}

                    <Grid
                      size={{
                        xs: 12,
                        md: 4,
                      }}
                    >
                      <FormControl
                        fullWidth
                        sx={fieldStyle}
                      >
                        <InputLabel>
                          Product
                        </InputLabel>

                        <Select
                          value={
                            item.productId
                          }
                          label="Product"
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "productId",
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value="">
                            Select Product
                          </MenuItem>

                          {products.map(
                            (productItem) => (
                              <MenuItem
                                key={
                                  productItem.id
                                }
                                value={
                                  productItem.id
                                }
                              >
                                {
                                  productItem.product_name
                                }
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Quantity */}

                    <Grid
                      size={{
                        xs: 6,
                        md: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        value={
                          item.quantity
                        }
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        inputProps={{
                          min: 1,
                        }}
                        sx={fieldStyle}
                      />
                    </Grid>

                    {/* Price */}

                    <Grid
                      size={{
                        xs: 6,
                        md: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Rate"
                        value={
                          product
                            ? `₹${Number(
                                product.selling_price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}`
                            : "₹0"
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={fieldStyle}
                      />
                    </Grid>

                    {/* GST */}

                    <Grid
                      size={{
                        xs: 6,
                        md: 1.5,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="GST"
                        value={
                          product
                            ? `${product.gst || 0}%`
                            : "0%"
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={fieldStyle}
                      />
                    </Grid>

                    {/* Total */}

                    <Grid
                      size={{
                        xs: 6,
                        md: 1.5,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Amount"
                        value={`₹${calculated.total.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}`}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={fieldStyle}
                      />
                    </Grid>

                    {/* Delete */}

                    <Grid
                      size={{
                        xs: 12,
                        md: 1,
                      }}
                    >
                      <IconButton
                        onClick={() =>
                          handleRemoveItem(
                            index
                          )
                        }
                        disabled={
                          items.length === 1
                        }
                        sx={{
                          color: "#EF4444",
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>

                    {/* Stock */}

                    {product && (
                      <Grid
                        size={{ xs: 12 }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#64748B",
                            }}
                          >
                            Available stock:
                          </Typography>

                          <Chip
                            size="small"
                            label={`${product.stock_quantity || 0} ${
                              product.unit ||
                              "Piece"
                            }`}
                            sx={{
                              fontSize: 10,
                              fontWeight: 700,
                              backgroundColor:
                                Number(
                                  product.stock_quantity
                                ) <= 5
                                  ? "#FEF2F2"
                                  : "#ECFDF5",
                              color:
                                Number(
                                  product.stock_quantity
                                ) <= 5
                                  ? "#DC2626"
                                  : "#059669",
                            }}
                          />
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              );
            }
          )}
        </Stack>
      </Paper>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <Grid
        container
        spacing={3}
        sx={{ mt: 0 }}
      >
        {/* Notes */}

        <Grid
          size={{
            xs: 12,
            md: 7,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              ...cardStyle,
              mt: 3,
            }}
          >
            <Typography
              sx={sectionTitleStyle}
            >
              Notes
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={5}
              placeholder="Add invoice notes..."
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              sx={{
                ...fieldStyle,
                mt: 2,
              }}
            />
          </Paper>
        </Grid>

        {/* Totals */}

        <Grid
          size={{
            xs: 12,
            md: 5,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              ...cardStyle,
              mt: 3,
            }}
          >
            <Typography
              sx={sectionTitleStyle}
            >
              Invoice Summary
            </Typography>

            <Stack
              spacing={1.5}
              sx={{ mt: 2 }}
            >
              <SummaryRow
                label="Subtotal"
                value={totals.subtotal}
              />

              <SummaryRow
                label="GST"
                value={totals.gst}
              />

              <TextField
                fullWidth
                type="number"
                label="Invoice Discount"
                value={discountAmount}
                onChange={(e) =>
                  setDiscountAmount(
                    e.target.value
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      ₹
                    </InputAdornment>
                  ),
                }}
                sx={fieldStyle}
              />

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#0F172A",
                  }}
                >
                  Grand Total
                </Typography>

                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#4F46E5",
                  }}
                >
                  ₹
                  {totals.grandTotal.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </Typography>
              </Stack>

              <FormControl
                fullWidth
                sx={{
                  ...fieldStyle,
                  mt: 1,
                }}
              >
                <InputLabel>
                  Payment Mode
                </InputLabel>

                <Select
                  value={paymentMode}
                  label="Payment Mode"
                  onChange={(e) =>
                    setPaymentMode(
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="Cash">
                    Cash
                  </MenuItem>

                  <MenuItem value="UPI">
                    UPI
                  </MenuItem>

                  <MenuItem value="Card">
                    Card
                  </MenuItem>

                  <MenuItem value="Bank Transfer">
                    Bank Transfer
                  </MenuItem>

                  <MenuItem value="Credit">
                    Credit
                  </MenuItem>

                  <MenuItem value="Other">
                    Other
                  </MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={
                  saving ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <Save />
                  )
                }
                onClick={handleSubmit}
                disabled={saving}
                sx={{
                  mt: 1,
                  minHeight: 48,
                  borderRadius: "11px",
                  textTransform: "none",
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #4F46E5, #2563EB)",
                  boxShadow:
                    "0 8px 20px rgba(79,70,229,0.20)",
                }}
              >
                {saving
                  ? "Creating Invoice..."
                  : "Create Invoice"}
              </Button>
              {createdInvoice && (
  <Stack spacing={1.5} sx={{ mt: 2 }}>
    <Button
      fullWidth
      variant="outlined"
      startIcon={<PictureAsPdf />}
      onClick={generateInvoicePDF}
      sx={{ textTransform: "none" }}
    >
      Download Invoice PDF
    </Button>

    <Button
      fullWidth
      variant="contained"
      startIcon={<Share />}
      onClick={shareInvoiceWhatsApp}
      sx={{
        textTransform: "none",
        backgroundColor: "#15803D",
        "&:hover": {
          backgroundColor: "#166534",
        },
      }}
    >
      Share via WhatsApp
    </Button>
  </Stack>
)}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* ================================================= */}
      {/* SUCCESS */}
      {/* ================================================= */}

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={5000}
        onClose={() => setSuccess("")}
        message={success}
      />
    </Box>
  );
};

// =====================================================
// SUMMARY ROW
// =====================================================

const SummaryRow = ({
  label,
  value,
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
    >
      <Typography
        sx={{
          fontSize: 13,
          color: "#64748B",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: "#334155",
        }}
      >
        ₹
        {Number(value).toLocaleString(
          "en-IN",
          {
            maximumFractionDigits: 2,
          }
        )}
      </Typography>
    </Stack>
  );
};

// =====================================================
// STYLES
// =====================================================

const cardStyle = {
  borderRadius: "18px",
  border: "1px solid #E2E8F0",
  backgroundColor: "#FFFFFF",
  p: {
    xs: 2,
    sm: 3,
  },
};

const sectionTitleStyle = {
  fontSize: 16,
  fontWeight: 800,
  color: "#0F172A",
};

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "11px",
    backgroundColor: "#F8FAFC",

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
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#4F46E5",
  },
};

const smallLabelStyle = {
  fontSize: 10,
  color: "#94A3B8",
  textTransform: "uppercase",
  fontWeight: 700,
};

const smallValueStyle = {
  mt: 0.3,
  fontSize: 12,
  color: "#334155",
  fontWeight: 700,
};

export default CreateInvoice;