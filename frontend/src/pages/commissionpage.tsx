// src/components/CommissionList.tsx
import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useGetCommissionsQuery } from "../services/approve.transaction.api";

const CommissionList: React.FC = () => {
  const { data, error, isLoading } = useGetCommissionsQuery();

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
          Error loading commissions: {JSON.stringify(error)}
        </Alert>
      </Box>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <Box m={2}>
        <Typography>No commission data found.</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Commission Details
      </Typography>
      <Grid container spacing={3}>
        {data.data.map((commission) => (
          <Grid item xs={12} sm={6} md={4} key={commission._id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Commission ID: {commission._id}
                </Typography>
                <Typography variant="body2">
                  <strong>Transaction ID:</strong> {commission.transaction}
                </Typography>
                <Typography variant="body2">
                  <strong>Commission Amount:</strong> ${commission.amount}
                </Typography>
                <Typography variant="body2">
                  <strong>Commission Type:</strong> {commission.type}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CommissionList;
