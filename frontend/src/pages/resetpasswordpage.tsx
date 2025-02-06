import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  IconButton,
} from "@mui/material";
import { Lock as LockIcon, Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useResetPasswordMutation } from "../services/auth.api";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useTheme, alpha } from "@mui/material/styles"; // Import alpha helper

interface FormInputs {
  newPassword: string;
  confirmPassword: string;
}

const MotionPaper = motion(Paper);
const MotionTextField = motion(TextField);
const MotionButton = motion(Button);

const ResetPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [resetPassword] = useResetPasswordMutation();

  // Extract token from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!token) {
      toast.error(t("authForm.invalidToken"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({ token, newPassword: data.newPassword }).unwrap();
      toast.success("Password Reset Success", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });

      // Redirect to sign-in page after successful reset
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } catch (err: any) {
      const errorMessage = err?.data?.message || t("authForm.passwordResetFailed");
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Grid container sx={{ width: "100%" }} spacing={2}>
        {/* Left Side with Headline and Subline */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            paddingRight: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              color={theme.palette.primary.main}
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              {t("authForm.headline")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 400,
                color: theme.palette.text.secondary,
              }}
            >
              {t("authForm.subline")}
            </Typography>
          </motion.div>
        </Grid>

        {/* Right Side (Form) */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <MotionPaper
            elevation={10}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              width: "100%",
              maxWidth: 500,
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              backdropFilter: "blur(10px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h4"
                color={theme.palette.primary.main}
                fontWeight="bold"
                textAlign="center"
                sx={{ mb: 3 }}
              >
                {t("authForm.resetPassword")}
              </Typography>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <MotionTextField
                variants={itemVariants}
                fullWidth
                label={t("authForm.newPassword")}
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: t("authForm.passwordRequired"),
                  minLength: {
                    value: 6,
                    message: t("authForm.passwordMinLength"),
                  },
                })}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword((prev) => !prev)} edge="end">
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <MotionTextField
                variants={itemVariants}
                fullWidth
                label={t("authForm.confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: t("authForm.confirmPasswordRequired"),
                  validate: (value) =>
                    value === watch("newPassword") || t("authForm.passwordMismatch"),
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <MotionButton
                variants={itemVariants}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  boxShadow: `0 3px 5px 2px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: theme.palette.common.white }} />
                ) : (
                  t("authForm.resetPassword")
                )}
              </MotionButton>
            </form>
          </MotionPaper>
        </Grid>
      </Grid>

      {/* Toast notifications container */}
      <ToastContainer aria-label="" />
    </Box>
  );
};

export default ResetPasswordForm;
