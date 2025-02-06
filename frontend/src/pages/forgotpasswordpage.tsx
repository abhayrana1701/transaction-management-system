import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Typography, CircularProgress, Grid, InputAdornment, Paper } from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForgotPasswordMutation } from "../services/auth.api";
import { useAppDispatch } from "../store/index";
import { authFailure } from "../store/reducers/auth.reducer";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles"; // Import the theme hook

interface FormInputs {
  email: string;
}

const MotionPaper = motion(Paper);
const MotionTextField = motion(TextField);
const MotionButton = motion(Button);

const ForgotPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme(); // Get theme using useTheme hook
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [forgotPassword] = useForgotPasswordMutation();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);

    try {
      await forgotPassword(data).unwrap();
      toast.success(t('authForm.passwordReset'), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });

      // setTimeout(() => {
      //   navigate("/signin");
      // }, 1000);
    } catch (err: any) {
      const errorMessage = err?.data?.message || t('authForm.passwordResetFailed');
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
      });
      dispatch(authFailure(errorMessage));
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
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark' 
          ? theme.palette.background.default
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: 2,
      }}
    >
      <Grid container sx={{ width: '100%' }} spacing={2}>
        {/* Left Side with Headline and Subline */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingRight: 4 }}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Typography variant="h4" color={theme.palette.primary.main} fontWeight="bold" sx={{ mb: 2 }}>
              {t('authForm.headline')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 400, color: theme.palette.text.secondary }}>
              {t('authForm.subline')}
            </Typography>
          </motion.div>
        </Grid>

        {/* Right Side (Your existing form) */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MotionPaper
            elevation={10}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              width: '100%',
              maxWidth: 500,
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              backdropFilter: 'blur(10px)',
            }}
          >
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Typography variant="h4" color={theme.palette.primary.main} fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
                {t('authForm.resetPassword')}
              </Typography>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <MotionTextField
                variants={itemVariants}
                fullWidth
                label={t('authForm.email')}
                {...register("email", {
                  required: t('authForm.emailRequired'),
                  pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/, message: t('authForm.invalidEmail') },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
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
                  fontWeight: 'bold',
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  boxShadow: `0 3px 5px 2px rgba(${theme.palette.primary.main}, .3)`,
                }}
              >
                {/* Show loader when submitting */}
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  t('authForm.resetPassword')
                )}
              </MotionButton>
            </form>
          </MotionPaper>
        </Grid>
      </Grid>

      {/* Toast notifications container */}
      <ToastContainer aria-label={""} />
    </Box>
  );
};

export default ForgotPasswordForm;
