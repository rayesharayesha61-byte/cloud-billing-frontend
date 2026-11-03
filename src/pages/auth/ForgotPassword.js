import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleEmailSubmit = async () => {
    try {
      setError("");

      const res = await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email }
      );

      setQuestion(res.data.question);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleReset = async () => {
    try {
      setError("");

      const res = await axios.post(
        `${API_URL}/auth/reset-password`,
        {
          email,
          answer,
          newPassword,
          confirmPassword,
        }
      );

      if (res.data.success) {
        navigate("/login", {
          state: { message: "Password reset successfully. Please login." },
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Password reset failed"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#F8FAFC,#EEF4FF)",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: 4,
          border: "1px solid #E2E8F0",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={1}>
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </Typography>

        <Typography color="text.secondary" mb={3}>
          {step === 1
            ? "Enter your registered email address."
            : "Verify your security answer and create a new password."}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === 1 ? (
          <>
            <TextField
              fullWidth
              label="Registered Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleEmailSubmit}
              sx={{
                mt: 2,
                py: 1.3,
                background: "linear-gradient(90deg,#2563EB,#4F46E5)",
              }}
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              {question}
            </Alert>

            <TextField
              fullWidth
              label="Security Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleReset}
              sx={{
                mt: 2,
                py: 1.3,
                background: "linear-gradient(90deg,#2563EB,#4F46E5)",
              }}
            >
              Reset Password
            </Button>
          </>
        )}

        <Button
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
}