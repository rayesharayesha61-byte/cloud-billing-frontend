

import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowForward,
  CheckCircle,
  CloudDone,
  ReceiptLong,
  Inventory2,
  People,
  Payments,
  Assessment,
  Security,
  TrendingUp,
  BusinessCenter,
 
} from "@mui/icons-material";

import PublicHeader from "../../components/public/PublicHeader";
import PublicFooter from "../../components/public/PublicFooter";

import "./About.css";

const features = [
  {
    icon: <ReceiptLong />,
    title: "Smart Invoicing",
    text: "Create professional invoices with GST, discounts, taxes and payment details.",
  },
  {
    icon: <Inventory2 />,
    title: "Product Management",
    text: "Manage products, pricing, stock and inventory in one organized workspace.",
  },
  {
    icon: <People />,
    title: "Customer Management",
    text: "Keep customer information organized and manage business relationships easily.",
  },
  {
    icon: <Payments />,
    title: "Payment Tracking",
    text: "Track Cash, UPI, Card and Bank Transfer payments with ease.",
  },
  {
    icon: <Assessment />,
    title: "Business Reports",
    text: "Understand sales, invoices, outstanding payments and business performance.",
  },
  {
    icon: <Security />,
    title: "Cloud Access",
    text: "Access your billing workspace from anywhere with an internet connection.",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <Box className="about-page">

      <PublicHeader />

      {/* ================= HERO ================= */}

<Box
  component="section"
  className="about-hero"
  sx={{
    py: { xs: 6, md: 10 },
    background: "#FFFFFF",
    overflow: "hidden",
  }}
>
  <Container
    maxWidth={false}
    sx={{
      px: { xs: 2, sm: 4, md: 6 },
    }}
  >
    {/* ================= MAIN LEFT + RIGHT ================= */}
    <Box
      sx={{
        maxWidth: "1250px",
        width: "100%",
        mx: "auto",

        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(0, 1fr) minmax(0, 1fr)",
        },

        gap: {
          xs: 6,
          md: 8,
        },

        alignItems: "center",
      }}
    >
      {/* ================================================= */}
      {/* LEFT CONTENT */}
      {/* ================================================= */}

      <Box
        sx={{
          width: "100%",
          maxWidth: 560,

          justifySelf: {
            xs: "center",
            md: "start",
          },

          textAlign: {
            xs: "center",
            md: "left",
          },
        }}
      >
        {/* LABEL */}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={{
            xs: "center",
            md: "flex-start",
          }}
          sx={{
            mb: 3,
          }}
        >
          {/* <CloudDone
            sx={{
              color: "#4F46E5",
              fontSize: 25,
            }}
          /> */}

          <Typography
            sx={{
              color: "#4F46E5",
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: 1.5,
              pt:5,
              textAlign:"center",
              justifyContent:"center",
              alignItems:"center",
            }}
          >
            ABOUT CLOUDBILL
          </Typography>
        </Stack>

        {/* TITLE */}

        <Typography
          component="h1"
          sx={{
            color: "#111827",

            fontSize: {
              xs: "2.4rem",
              sm: "3rem",
              md: "3.6rem",
            },

            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
          }}
        >
          The smarter way to

          <Box
            component="span"
            sx={{
              display: "block",
              color: "#4F46E5",
            }}
          >
            manage your billing.
          </Box>
        </Typography>

        {/* DESCRIPTION */}

        <Typography
          sx={{
            mt: 3,
            color: "#64748B",
            fontSize: "1.05rem",
            lineHeight: 1.9,

            maxWidth: 540,

            mx: {
              xs: "auto",
              md: 0,
            },
          }}
        >
          CloudBill brings invoicing, products, customers,
          payments and business reports together in one
          simple cloud billing platform.
        </Typography>

        {/* BUTTONS */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          justifyContent={{
            xs: "center",
            md: "flex-start",
          }}
          alignItems={{
            xs: "center",
            sm: "center",
          }}
          sx={{
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate("/register")}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,

              backgroundColor: "#4F46E5",

              textTransform: "none",
              fontWeight: 700,

              boxShadow:
                "0 10px 25px rgba(79,70,229,0.20)",

              "&:hover": {
                backgroundColor: "#3730A3",

                boxShadow:
                  "0 14px 30px rgba(79,70,229,0.28)",
              },
            }}
          >
            Start Free Trial
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/features")}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,

              borderColor: "#CBD5E1",
              color: "#334155",

              textTransform: "none",
              fontWeight: 700,

              "&:hover": {
                borderColor: "#4F46E5",
                color: "#4F46E5",
                backgroundColor: "#EEF2FF",
              },
            }}
          >
            Explore Features
          </Button>
        </Stack>

        {/* FEATURES */}

        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          justifyContent={{
            xs: "center",
            md: "flex-start",
          }}
          sx={{
            mt: 4,
            rowGap: 1,
          }}
        >
          {[
            "30-Day Free Trial",
            "Easy Setup",
            "Cloud Based",
          ].map((item) => (
            <Stack
              key={item}
              direction="row"
              spacing={0.7}
              alignItems="center"
            >
              <CheckCircle
                sx={{
                  color: "#16A34A",
                  fontSize: 18,
                }}
              />

              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                {item}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* ================================================= */}
      {/* RIGHT DASHBOARD */}
      {/* ================================================= */}

      <Box
        sx={{
          width: "100%",
          maxWidth: 540,

          justifySelf: {
            xs: "center",
            md: "end",
          },

          position: "relative",
        }}
      >
        {/* GLOW */}

        <Box
          sx={{
            position: "absolute",

            inset: {
              xs: "8% 2%",
              md: "8% 4%",
            },

            background:
              "linear-gradient(135deg,#E0E7FF,#F0FDFA)",

            filter: "blur(55px)",

            borderRadius: "50%",

            zIndex: 0,
          }}
        />

        {/* DASHBOARD */}

        <Paper
          elevation={0}
          sx={{
            position: "relative",

            zIndex: 1,

            width: "100%",

            boxSizing: "border-box",

            p: {
              xs: 1.8,
              sm: 2.5,
              md: 3,
            },

            borderRadius: 4,

            border:
              "1px solid #E2E8F0",

            backgroundColor: "#FFFFFF",

            boxShadow:
              "0 25px 70px rgba(15,23,42,0.12)",
          }}
        >
          {/* ============================================= */}
          {/* DASHBOARD HEADER */}
          {/* ============================================= */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              justifyContent:
                "space-between",

              pb: 2.5,

              borderBottom:
                "1px solid #E2E8F0",

              "@media (max-width:600px)": {
                flexDirection: "column",

                gap: 1.5,

                justifyContent: "center",
              },
            }}
          >
            {/* CLOUD BILL */}

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                "@media (max-width:600px)": {
                  justifyContent: "center",
                },
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,

                  display: "grid",
                  placeItems: "center",

                  borderRadius: 1.5,

                  backgroundColor:
                    "#EEF2FF",

                  color: "#4F46E5",

                  flexShrink: 0,
                }}
              >
                <CloudDone />
              </Box>

              <Box
                sx={{
                  textAlign: "left",

                  "@media (max-width:600px)": {
                    textAlign: "center",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#1E293B",
                    fontWeight: 800,
                    fontSize: "1rem",
                  }}
                >
                  CloudBill
                </Typography>

                <Typography
                  sx={{
                    color: "#94A3B8",
                    fontSize: "0.7rem",
                  }}
                >
                  Business Dashboard
                </Typography>
              </Box>
            </Stack>

            {/* LIVE */}

            <Box
              sx={{
                px: 1.5,
                py: 0.6,

                borderRadius: 5,

                backgroundColor:
                  "#DCFCE7",

                color: "#15803D",

                fontSize: "0.7rem",

                fontWeight: 700,
              }}
            >
              ● Live
            </Box>
          </Box>

          {/* ============================================= */}
          {/* TITLE */}
          {/* ============================================= */}

          <Box
            sx={{
              mt: 3,
              mb: 2.5,

              "@media (max-width:600px)": {
                textAlign: "center",
                mt: 2.5,
              },
            }}
          >
            <Typography
              sx={{
                color: "#111827",
                fontSize: "1.25rem",
                fontWeight: 800,

                "@media (max-width:600px)": {
                  fontSize: "1.15rem",
                },
              }}
            >
              Business Overview
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#94A3B8",
                fontSize: "0.8rem",

                "@media (max-width:600px)": {
                  fontSize: "0.75rem",
                },
              }}
            >
              Your billing performance at a glance
            </Typography>
          </Box>

          {/* ============================================= */}
          {/* STATS */}
          {/* ============================================= */}

          <Grid
            container
            spacing={1.5}
          >
            {[
              {
                title: "Revenue",
                value: "₹8.25L",
                icon: <TrendingUp />,
              },
              {
                title: "Invoices",
                value: "248",
                icon: <ReceiptLong />,
              },
              {
                title: "Customers",
                value: "324",
                icon: <People />,
              },
            ].map((item) => (
              <Grid
                item
                xs={4}
                key={item.title}
              >
                <Box
                  sx={{
                    height: "100%",
                    boxSizing: "border-box",

                    p: {
                      xs: 1,
                      sm: 1.6,
                    },

                    border:
                      "1px solid #E2E8F0",

                    borderRadius: 2,

                    backgroundColor:
                      "#FFFFFF",
                  }}
                >
                  <Box
                    sx={{
                      color: "#4F46E5",

                      mb: 1,

                      "& svg": {
                        fontSize: 20,
                      },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      color: "#64748B",
                      fontSize: "0.68rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,

                      color: "#1E293B",

                      fontSize: {
                        xs: "0.8rem",
                        sm: "1.1rem",
                      },

                      fontWeight: 800,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* ============================================= */}
          {/* REVENUE CHART */}
          {/* ============================================= */}

          <Box
            sx={{
              mt: 2,

              p: {
                xs: 1.5,
                sm: 2.3,
              },

              border:
                "1px solid #E2E8F0",

              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#1E293B",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                }}
              >
                Revenue Overview
              </Typography>

              <Typography
                sx={{
                  color: "#16A34A",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                +12.5%
              </Typography>
            </Box>

            {/* BARS */}

            <Box
              sx={{
                height: {
                  xs: 110,
                  sm: 140,
                },

                mt: 2,

                display: "flex",

                alignItems: "flex-end",

                gap: {
                  xs: 0.7,
                  sm: 1.5,
                },

                borderBottom:
                  "1px solid #E2E8F0",
              }}
            >
              {[35, 48, 42, 65, 58, 78, 95].map(
                (height, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,

                      height: `${height}%`,

                      borderRadius:
                        "5px 5px 0 0",

                      background:
                        index === 6
                          ? "#4F46E5"
                          : "linear-gradient(180deg,#A5B4FC,#E0E7FF)",
                    }}
                  />
                )
              )}
            </Box>

            {/* WEEKS */}

            <Box
              sx={{
                display: "flex",

                justifyContent:
                  "space-between",

                mt: 1,

                color: "#94A3B8",

                fontSize: "0.65rem",
              }}
            >
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </Box>
          </Box>

          {/* ============================================= */}
          {/* LATEST INVOICE */}
          {/* ============================================= */}

          <Box
            sx={{
              mt: 2,

              p: 1.8,

              display: "flex",

              alignItems: "center",

              justifyContent:
                "space-between",

              gap: 2,

              borderRadius: 2,

              backgroundColor:
                "#F8FAFC",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <ReceiptLong
                sx={{
                  color: "#4F46E5",
                  fontSize: 20,
                }}
              />

              <Box>
                <Typography
                  sx={{
                    color: "#334155",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                  }}
                >
                  Latest Invoice
                </Typography>

                <Typography
                  sx={{
                    color: "#94A3B8",
                    fontSize: "0.65rem",
                  }}
                >
                  INV-000128
                </Typography>
              </Box>
            </Stack>

            <Typography
              sx={{
                color: "#4F46E5",
                fontSize: "0.8rem",
                fontWeight: 800,
              }}
            >
              ₹14,750
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  </Container>
</Box>
      {/* ================= INTRODUCTION ================= */}

      <Box
        component="section"
        sx={{
          py: { xs: 7, md: 10 },
          backgroundColor: "#F8FAFC",
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={5}
            alignItems="center"
          >

            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  color: "#4F46E5",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  letterSpacing: 1.5,
                }}
              >
                ABOUT OUR PLATFORM
              </Typography>

              <Typography
                component="h2"
                sx={{
                  mt: 2,
                  color: "#111827",
                  fontSize: {
                    xs: "2rem",
                    md: "2.8rem",
                  },
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                Everything your business needs,
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    color: "#4F46E5",
                  }}
                >
                  in one place.
                </Box>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: "1rem",
                  lineHeight: 1.9,
                }}
              >
                CloudBill is designed to help businesses manage
                everyday billing operations without unnecessary
                complexity. From creating invoices to tracking
                payments and reviewing business reports, our
                platform keeps your work organized and accessible.
              </Typography>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* ================= FEATURES ================= */}

      {/* ================= POWERFUL FEATURES ================= */}

<Box
  component="section"
  sx={{
    py: { xs: 7, md: 11 },
    backgroundColor: "#FFFFFF",
    width: "100%",
    overflow: "hidden",
  }}
>
  <Container maxWidth="xl">

    {/* SECTION HEADING */}

    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        textAlign: "center",
        mb: 6,
      }}
    >
      <Typography
        sx={{
          color: "#4F46E5",
          fontSize: "0.8rem",
          fontWeight: 800,
          letterSpacing: 1.5,
        }}
      >
        POWERFUL FEATURES
      </Typography>

      <Typography
        component="h2"
        sx={{
          mt: 1.5,
          color: "#111827",
          fontSize: {
            xs: "2rem",
            sm: "2.5rem",
            md: "3rem",
          },
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        Built to simplify

        <Box
          component="span"
          sx={{
            display: "block",
            color: "#4F46E5",
          }}
        >
          your daily workflow.
        </Box>
      </Typography>

      <Typography
        sx={{
          mt: 2,
          color: "#64748B",
          lineHeight: 1.8,
          maxWidth: 620,
          mx: "auto",
        }}
      >
        Manage your billing, customers, products and
        business performance through one connected platform.
      </Typography>
    </Box>


    {/* ================= FEATURE GRID ================= */}

    <Grid
      container
      spacing={3}
      justifyContent="center"
      alignItems="stretch"
      sx={{
        maxWidth: "1150px",
        mx: "auto",
      }}
    >

      {features.map((item) => (

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={item.title}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >

          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 360,
              minHeight: 245,

              p: 3.5,

              display: "flex",
              flexDirection: "column",

              border: "1px solid #E2E8F0",
              borderRadius: 3,

              backgroundColor: "#FFFFFF",

              transition:
                "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",

              "&:hover": {
                transform: "translateY(-7px)",
                borderColor: "#A5B4FC",
                boxShadow:
                  "0 18px 40px rgba(79,70,229,0.12)",
              },
            }}
          >

            {/* ICON */}

            <Box
              sx={{
                width: 54,
                height: 54,

                display: "grid",
                placeItems: "center",

                borderRadius: 2,

                color: "#4F46E5",
                backgroundColor: "#EEF2FF",

                flexShrink: 0,

                "& svg": {
                  fontSize: 27,
                },
              }}
            >
              {item.icon}
            </Box>


            {/* TITLE */}

            <Typography
              sx={{
                mt: 2.5,
                color: "#1E293B",
                fontSize: "1.1rem",
                fontWeight: 800,
              }}
            >
              {item.title}
            </Typography>


            {/* DESCRIPTION */}

            <Typography
              sx={{
                mt: 1.5,
                color: "#64748B",
                fontSize: "0.9rem",
                lineHeight: 1.8,
              }}
            >
              {item.text}
            </Typography>

          </Paper>

        </Grid>

      ))}

    </Grid>

  </Container>
</Box>

      {/* ================= MISSION ================= */}

     <Box
  component="section"
  sx={{
    py: { xs: 7, md: 11 },
    backgroundColor: "#F8FAFC",
    width: "100%",
    overflow: "hidden",
  }}
>
  <Container
    maxWidth="lg"
    sx={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Grid
      container
      spacing={{ xs: 4, md: 6 }}
      alignItems="center"
      justifyContent="center"
      sx={{
        maxWidth: 1050,
        width: "100%",
        mx: "auto",
      }}
    >

      {/* ================= LEFT BOX ================= */}

      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 400,
            p: { xs: 3, md: 4 },

            borderRadius: 4,
            border: "1px solid #E2E8F0",
            backgroundColor: "#FFFFFF",

            boxShadow:
              "0 15px 40px rgba(15,23,42,0.06)",

            transition: "0.3s ease",

            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow:
                "0 20px 45px rgba(79,70,229,0.10)",
            },
          }}
        >

          {/* ICON */}

          <Box
            sx={{
              width: 64,
              height: 64,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,

              color: "#4F46E5",
              backgroundColor: "#EEF2FF",

              "& svg": {
                fontSize: 32,
              },
            }}
          >
            <BusinessCenter />
          </Box>


          {/* TITLE */}

          <Typography
            sx={{
              mt: 3,
              color: "#111827",
              fontSize: {
                xs: "1.35rem",
                md: "1.5rem",
              },
              fontWeight: 800,
              lineHeight: 1.35,
            }}
          >
            One platform.
            <br />
            Less complexity.
          </Typography>


          {/* TEXT */}

          <Typography
            sx={{
              mt: 2,
              color: "#64748B",
              lineHeight: 1.8,
              fontSize: "0.95rem",
            }}
          >
            Spend less time managing billing tasks and
            more time focusing on your customers and growth.
          </Typography>


          {/* LINE */}

          <Box
            sx={{
              mt: 3,
              height: 5,
              width: "70%",
              borderRadius: 5,
              backgroundColor: "#4F46E5",
            }}
          />

        </Paper>
      </Grid>


      {/* ================= RIGHT CONTENT ================= */}

      <Grid
        item
        xs={12}
        md={7}
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 570,
          }}
        >

          {/* LABEL */}

          <Typography
            sx={{
              color: "#4F46E5",
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: 1.5,
            }}
          >
            OUR MISSION
          </Typography>


          {/* HEADING */}

          <Typography
            component="h2"
            sx={{
              mt: 2,
              color: "#111827",
              fontSize: {
                xs: "2rem",
                sm: "2.4rem",
                md: "2.8rem",
              },
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.8px",
            }}
          >
            Helping businesses

            <Box
              component="span"
              sx={{
                display: "block",
                color: "#4F46E5",
              }}
            >
              work smarter.
            </Box>
          </Typography>


          {/* PARAGRAPH 1 */}

          <Typography
            sx={{
              mt: 2.5,
              color: "#64748B",
              lineHeight: 1.9,
              fontSize: "0.95rem",
            }}
          >
            We believe business owners should be able to
            manage their billing with confidence and clarity.
            CloudBill brings essential billing operations into
            one simple and connected workspace.
          </Typography>


          {/* PARAGRAPH 2 */}

          <Typography
            sx={{
              mt: 2,
              color: "#64748B",
              lineHeight: 1.9,
              fontSize: "0.95rem",
            }}
          >
            Whether you run a retail store, service business,
            startup or work independently, CloudBill helps
            organize your everyday invoicing and payment
            workflows.
          </Typography>


          {/* CHECK LIST */}

          <Stack
            spacing={1.5}
            sx={{
              mt: 3,
            }}
          >
            {[
              "Simple and organized billing",
              "Designed for growing businesses",
              "Connected business workflows",
            ].map((item) => (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                key={item}
              >

                <CheckCircle
                  sx={{
                    color: "#4F46E5",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                />

                <Typography
                  sx={{
                    color: "#334155",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  {item}
                </Typography>

              </Stack>
            ))}
          </Stack>

        </Box>
      </Grid>

    </Grid>
  </Container>
</Box>

      {/* ================= HOW IT WORKS ================= */}

      {/* ================= SIMPLE WORKFLOW ================= */}

<Box
  component="section"
  sx={{
    py: { xs: 7, md: 11 },
    backgroundColor: "#FFFFFF",
    width: "100%",
    overflow: "hidden",
  }}
>
  <Container
    maxWidth="lg"
    sx={{
      display: "flex",
      justifyContent: "center",
    }}
  >

    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
      }}
    >

      {/* HEADING */}

      <Box
        sx={{
          maxWidth: 680,
          mx: "auto",
          textAlign: "center",
          mb: 6,
        }}
      >
        <Typography
          sx={{
            color: "#4F46E5",
            fontSize: "0.8rem",
            fontWeight: 800,
            letterSpacing: 1.5,
          }}
        >
          SIMPLE WORKFLOW
        </Typography>

        <Typography
          component="h2"
          sx={{
            mt: 1.5,
            color: "#111827",
            fontSize: {
              xs: "2rem",
              sm: "2.4rem",
              md: "2.8rem",
            },
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          Get started in

          <Box
            component="span"
            sx={{
              color: "#4F46E5",
              display: "block",
            }}
          >
            three simple steps.
          </Box>
        </Typography>
      </Box>


      {/* WORKFLOW CARDS */}

      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="stretch"
        sx={{
          width: "100%",
          mx: "auto",
        }}
      >
        {[
          {
            number: "01",
            title: "Create your account",
            text: "Register your business and start your free trial.",
          },
          {
            number: "02",
            title: "Set up your workspace",
            text: "Add your business details, products and customers.",
          },
          {
            number: "03",
            title: "Start billing",
            text: "Create invoices, track payments and view reports.",
          },
        ].map((item) => (

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={item.number}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >

            <Box
              sx={{
                width: "100%",
                maxWidth: 350,
                minHeight: 230,

                p: 3.5,

                border: "1px solid #E2E8F0",
                borderRadius: 3,

                backgroundColor: "#FFFFFF",

                boxSizing: "border-box",

                transition:
                  "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",

                "&:hover": {
                  transform: "translateY(-6px)",
                  borderColor: "#A5B4FC",
                  boxShadow:
                    "0 18px 40px rgba(79,70,229,0.10)",
                },
              }}
            >

              {/* NUMBER */}

              <Typography
                sx={{
                  color: "#C7D2FE",
                  fontSize: "2.8rem",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {item.number}
              </Typography>


              {/* TITLE */}

              <Typography
                sx={{
                  mt: 2.5,
                  color: "#1E293B",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                }}
              >
                {item.title}
              </Typography>


              {/* TEXT */}

              <Typography
                sx={{
                  mt: 1.2,
                  color: "#64748B",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                }}
              >
                {item.text}
              </Typography>

            </Box>

          </Grid>

        ))}
      </Grid>

    </Box>
  </Container>
</Box>


{/* ================= FINAL CTA ================= */}

<Box
  component="section"
  sx={{
    py: { xs: 7, md: 10 },
    px: 2,
    background:
      "linear-gradient(135deg, #312E81 0%, #4F46E5 55%, #6366F1 100%)",
    textAlign: "center",
    width: "100%",
    overflow: "hidden",
  }}
>
  <Container
    maxWidth="md"
    sx={{
      display: "flex",
      justifyContent: "center",
    }}
  >

    <Box
      sx={{
        width: "100%",
        maxWidth: 720,
        mx: "auto",
      }}
    >

      {/* ICON */}

      <Box
        sx={{
          width: 68,
          height: 68,
          mx: "auto",

          display: "grid",
          placeItems: "center",

          borderRadius: 3,

          backgroundColor: "#FFFFFF",
          color: "#4F46E5",

          boxShadow:
            "0 12px 30px rgba(0,0,0,0.15)",

          "& svg": {
            fontSize: 34,
          },
        }}
      >
        <CloudDone />
      </Box>


      {/* TITLE */}

      <Typography
        component="h2"
        sx={{
          mt: 3,
          color: "#FFFFFF",
          fontSize: {
            xs: "2rem",
            sm: "2.5rem",
            md: "3rem",
          },
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        Ready to simplify

        <Box
          component="span"
          sx={{
            display: "block",
          }}
        >
          your billing?
        </Box>
      </Typography>


      {/* DESCRIPTION */}

      <Typography
        sx={{
          mt: 2,
          color: "#E0E7FF",
          fontSize: "1rem",
          lineHeight: 1.8,
          maxWidth: 600,
          mx: "auto",
        }}
      >
        Start your 30-day free trial and discover a simpler
        way to manage your business billing.
      </Typography>


      {/* NEW BUTTON */}

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate("/register")}
        sx={{
          mt: 4,

          px: 3.5,
          py: 1.5,

          borderRadius: 2,

          backgroundColor: "#111827",
          color: "#FFFFFF",

          textTransform: "none",
          fontWeight: 800,

          boxShadow:
            "0 12px 28px rgba(15,23,42,0.25)",

          transition: "0.3s ease",

          "&:hover": {
            backgroundColor: "#020617",
            transform: "translateY(-3px)",
            boxShadow:
              "0 16px 35px rgba(15,23,42,0.30)",
          },
        }}
      >
        Start Your Free Trial
      </Button>

    </Box>

  </Container>
</Box>

      <PublicFooter />

    </Box>
  );
};

export default About;