import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Typography, Paper, InputAdornment, IconButton, CircularProgress, Grid } from "@mui/material";
import { Person as PersonIcon, Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRegisterUserMutation, useLoginUserMutation } from "../../services/auth.api";
import { useAppDispatch } from "../../store/index";
import { loginStart, authFailure } from "../../store/reducers/auth.reducer";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { useTranslation } from "react-i18next";  
import { ToastNotification} from '../../utils/toast.util';
import { useTheme } from "@mui/material/styles"; // Import useTheme

interface AuthFormProps {
  type: "signin" | "signup"; 
  onSuccess: (data: any) => void;
}

interface FormInputs {
  name: string | ''; 
  email: string;
  password: string;
}

const MotionPaper = motion(Paper);
const MotionTextField = motion(TextField);
const MotionButton = motion(Button);

const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess }) => {
  const { t } = useTranslation(); 
  const theme = useTheme(); // Get theme using useTheme hook
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loginUser, { }] = useLoginUserMutation();
  const [registerUser, { }] = useRegisterUserMutation();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    dispatch(loginStart());
  
    try {
      if (type === "signup") {
        await registerUser(data).unwrap();
        ToastNotification.showSuccess(t('authForm.successRegistration'));
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        await loginUser(data).unwrap();
        ToastNotification.showSuccess(t('authForm.successLogin'));
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || `${type === "signup" ? t('authForm.registrationFailed') : t('authForm.loginFailed')}`;
      ToastNotification.showError(errorMessage);
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.palette.background.default }}>
      <Grid container sx={{ width: '100%' }} spacing={2}>
        {/* Left Side with Headline and Subline */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingRight: 4 }}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
              {t('authForm.headline')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 400, color: theme.palette.text.secondary }}>
              {t('authForm.subline')}
            </Typography>
          </motion.div>
        </Grid>

        {/* Right Side (Your existing form) */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MotionPaper elevation={10} variants={containerVariants} initial="hidden" animate="visible" sx={{ width: '100%', maxWidth: 500, p: 4, borderRadius: 3, backgroundColor: theme.palette.background.paper }}>
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Typography variant="h4" color="primary" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
                {type === "signup" ? t('authForm.signup') : t('authForm.signin')}
              </Typography>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {type === "signup" && (
                <MotionTextField
                  variants={itemVariants}
                  fullWidth
                  label={t('authForm.name')}
                  {...register("name", { required: t('authForm.nameRequired') })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              )}

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
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <MotionTextField
                variants={itemVariants}
                fullWidth
                type={showPassword ? "text" : "password"}
                label={t('authForm.password')}
                {...register("password", { required: t('authForm.passwordRequired') })}
                error={!!errors.password}
                helperText={errors.password?.message}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {type === "signin" && (
                <motion.div variants={itemVariants} style={{ textAlign: 'left' }}>
                  <Button
                    color="primary"
                    onClick={() => navigate("/forgot-password")}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  >
                    {t('authForm.forgotPassword')}
                  </Button>
                </motion.div>
              )}

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
                  boxShadow: `0 3px 5px 2px rgba(${theme.palette.primary.main}, 0.3)`,
                }}
              >
                {/* Show loader when submitting */}
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  type === "signup" ? t('authForm.signUp') : t('authForm.signIn')
                )}
              </MotionButton>

              <motion.div variants={itemVariants} style={{ marginTop: 16, textAlign: 'center' }}>
                <Typography variant="body2" color={theme.palette.text.secondary}>
                  {type === "signup" ? t('authForm.alreadyAccount') : t('authForm.noAccount')}{" "}
                  <Button
                    color="primary"
                    onClick={() => {
                      const targetPage = type === "signup" ? "/signin" : "/signup";
                      navigate(targetPage);  // Navigate based on formType
                    }}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  >
                    {type === "signup" ? t('authForm.signIn') : t('authForm.signUp')}
                  </Button>
                </Typography>
              </motion.div>
            </form>
          </MotionPaper>
        </Grid>
      </Grid>

      {/* Toast notifications container */}
      <ToastContainer aria-label={""}/>
    </Box>
  );
};

export default AuthForm;
