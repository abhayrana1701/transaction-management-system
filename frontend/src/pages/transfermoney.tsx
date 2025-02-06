// TransferRequestComponent.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, Paper, TextField, Grid, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { useRequestTransferMoneyMutation } from '../services/approve.transaction.api';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { transactionStart, transactionSuccess, transactionFailure } from '../store/reducers/transaction.reducer';
import { ToastNotification} from '../utils/toast.util';
import { ToastContainer } from 'react-toastify';

// For motion components
const MotionPaper = motion(Paper);
const MotionButton = motion(Button);

// Validation Schema using Yup
const validationSchema = Yup.object({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be greater than zero'),
  recipientId: Yup.string().required('Recipient ID is required'),
  notes: Yup.string().optional(),
});

const TransferRequestComponent: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  // RTK Query mutation hook for requesting a transfer
  const [requestTransferMoney, { isLoading }] = useRequestTransferMoneyMutation();

  // Form state
  const [amount, setAmount] = useState<number | string>('');
  const [recipientId, setRecipientId] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; recipientId?: string; notes?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate the form data using Yup
      await validationSchema.validate({ amount, recipientId, notes }, { abortEarly: false });
      setErrors({}); // Clear previous errors

      dispatch(transactionStart());

      try {
        // Call the transfer mutation using RTK Query
        const response = await requestTransferMoney({ 
          amount: parseFloat(amount as string), 
          recipientId, 
          notes 
        }).unwrap();

        dispatch(transactionSuccess(response.message));
        ToastNotification.showSuccess('Transfer request sent. Awaiting admin approval.');
        // Reset form fields
        setAmount('');
        setRecipientId('');
        setNotes('');
      } catch (err: unknown) {
        dispatch(transactionFailure('Failed to submit transfer request'));
        if (err instanceof Error) {
          ToastNotification.showError(err.message);
        } else {
          ToastNotification.showError('Failed to submit transfer request');
        }
      }
    } catch (validationErrors: any) {
      // Collect and set validation errors
      const formErrors: any = {};
      validationErrors.inner.forEach((err: any) => {
        formErrors[err.path] = err.message;
      });
      setErrors(formErrors);
    }
  };

  // Animation variants for container and items
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, when: 'beforeChildren', staggerChildren: 0.1 } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Grid container sx={{ width: '100%' }} spacing={2}>
        {/* Left Side: Heading and Explanation */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pr: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
              Transfer Money from Your Wallet
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 400, color: 'text.secondary' }}>
              Enter the amount you wish to transfer, the recipient's ID, and any optional notes.
              Your transfer request requires admin approval.
            </Typography>
          </motion.div>
        </Grid>

        {/* Right Side: Transfer Request Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
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
              boxShadow: '0px 10px 30px rgba(0,0,0,0.4)',
            }}
          >
            <Typography variant="h5" color="primary" textAlign="center" sx={{ mb: 3 }}>
              Transfer Request Form
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                name="amount"
                type="number"
                label="Amount"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                helperText={errors.amount}
                error={Boolean(errors.amount)}
              />
              <TextField
                name="recipientId"
                type="text"
                label="Recipient ID"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                helperText={errors.recipientId}
                error={Boolean(errors.recipientId)}
              />
              <TextField
                name="notes"
                label="Notes (Optional)"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 2 }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                helperText={errors.notes}
                error={Boolean(errors.notes)}
              />

              <MotionButton
                variants={itemVariants}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  boxShadow: `0 3px 5px 2px rgba(${theme.palette.primary.main}, 0.3)`,
                  mt: 2,
                }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit'}
              </MotionButton>
            </form>
          </MotionPaper>
        </Grid>
      </Grid>
      <ToastContainer aria-label={""}/>
    </Box>
  );
};

export default TransferRequestComponent;
