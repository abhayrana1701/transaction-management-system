// TransactionList.tsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useGetPendingTransactionsQuery, useApproveDepositMutation, useApproveTransferMutation } from "../services/approve.transaction.api";
import { useDispatch } from "react-redux";
import { transactionStart, transactionSuccess, transactionFailure } from "../store/reducers/transaction.reducer";
import { toast } from "react-toastify";
import { ToastNotification} from '../utils/toast.util';
import { ToastContainer } from 'react-toastify';

const TransactionList: React.FC = () => {
  const { data, error, isLoading } = useGetPendingTransactionsQuery();
  const dispatch = useDispatch();

  // Local state to track which transaction is being approved (keyed by transaction._id)
  const [approving, setApproving] = useState<{ [id: string]: boolean }>({});

  // RTK Query mutation hooks for approval endpoints
  const [approveDeposit] = useApproveDepositMutation();
  const [approveTransfer] = useApproveTransferMutation();

  // Handler for the Approve button
  const handleApprove = async (transaction: any) => {
    dispatch(transactionStart());
    setApproving((prev) => ({ ...prev, [transaction._id]: true }));
    try {
      let response;
      if (transaction.type === "deposit") {
        response = await approveDeposit({ transactionId: transaction._id }).unwrap();
      } else if (transaction.type === "transfer") {
        response = await approveTransfer({ transactionId: transaction._id }).unwrap();
      } else {
        throw new Error("Unsupported transaction type");
      }
      dispatch(transactionSuccess(response.message));
      ToastNotification.showSuccess(response.message);
  
    } catch (err: unknown) {
      dispatch(transactionFailure("Failed to approve transaction"));
      if (err instanceof Error) {
        ToastNotification.showError(err.message);
      } else {
        ToastNotification.showError("Failed to approve transaction");
      }
    } finally {
      setApproving((prev) => ({ ...prev, [transaction._id]: false }));
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">
          Error loading transactions: {JSON.stringify(error)}
        </Alert>
      </Box>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <Box m={2}>
        <Typography variant="h6" align="center">
          No pending transactions found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box m={2}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: 600, mb: 3 }}
      >
        Pending Transactions
      </Typography>
      <Grid container spacing={3} alignItems="stretch">
        {data.data.map((transaction: any) => (
          <Grid item xs={12} sm={6} md={4} key={transaction._id} sx={{ display: "flex" }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Transaction ID: {transaction._id}
                </Typography>
                <Typography variant="body1">
                  <strong>User:</strong> {transaction.user.name} ({transaction.user.email})
                </Typography>
                {transaction.recipient && (
                  <Typography variant="body1">
                    <strong>Recipient:</strong> {transaction.recipient.name} ({transaction.recipient.email})
                  </Typography>
                )}
                <Typography variant="body1">
                  <strong>Amount:</strong> ${transaction.amount}
                </Typography>
                <Typography variant="body1">
                  <strong>Type:</strong> {transaction.type}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong> {transaction.status}
                </Typography>
                <Typography variant="body1">
                  <strong>Admin Approved By:</strong> {transaction.adminApprovedBy || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  <strong>Notes:</strong> {transaction.notes}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleApprove(transaction)}
                  sx={{
                    transition: "transform 0.3s, background-color 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                  disabled={!!approving[transaction._id]}
                >
                  {approving[transaction._id] ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Approve"
                  )}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    transition: "transform 0.3s, background-color 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  Reject
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ToastContainer aria-label={""}/>
    </Box>
  );
};

export default TransactionList;
