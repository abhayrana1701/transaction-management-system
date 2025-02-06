// UserProfile.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Button,
  ButtonGroup,
} from "@mui/material";
import { motion } from "framer-motion";
import { useGetUserProfileQuery } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { setProfile } from "../store/reducers/profile.redux";
import PersonIcon from "@mui/icons-material/Person";

// Create a motion component for the Card
const MotionCard = motion(Card);

// Define animation variants for each transaction card
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
};

// Define neon colors for statuses (used as background)
const statusNeonColors: { [key: string]: string } = {
  pending: "#FFFF00", // Neon Yellow
  approved: "#39FF14", // Neon Green
  rejected: "#FF073A", // Neon Red
};

const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const {
    data: profileData,
    error,
    isLoading,
  } = useGetUserProfileQuery();

  // Local state to hold filter option. Default is "all".
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Update Redux slice with profile data when available
  useEffect(() => {
    if (profileData && profileData.data) {
      dispatch(setProfile(profileData.data));
    }
  }, [profileData, dispatch]);

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
          Error loading profile: {JSON.stringify(error)}
        </Alert>
      </Box>
    );
  }

  if (!profileData || !profileData.data || !profileData.data.user) {
    return (
      <Box m={2}>
        <Typography>No profile data found.</Typography>
      </Box>
    );
  }

  const { user, transactions } = profileData.data;

  // Filter transactions based on selected filter option
  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((tx) => tx.status.toLowerCase() === filter);

  return (
    <Box p={2}>
      {/* User Profile Card */}
      <Card sx={{ mb: 4, p: 2, display: "flex", alignItems: "center" }}>
        <Box sx={{ mr: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
        </Box>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1">
            <strong>Role:</strong> {user.role}
          </Typography>
          <Typography variant="body1">
            <strong>Wallet Balance:</strong> ${user.walletBalance}
          </Typography>
        </CardContent>
      </Card>

      {/* Filter Options */}
      <Box mb={2} display="flex" justifyContent="center">
        <ButtonGroup variant="outlined" color="primary">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "contained" : "outlined"}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("pending")}
            variant={filter === "pending" ? "contained" : "outlined"}
          >
            Pending
          </Button>
          <Button
            onClick={() => setFilter("approved")}
            variant={filter === "approved" ? "contained" : "outlined"}
          >
            Approved
          </Button>
          <Button
            onClick={() => setFilter("rejected")}
            variant={filter === "rejected" ? "contained" : "outlined"}
          >
            Rejected
          </Button>
        </ButtonGroup>
      </Box>

      {/* Transactions Section */}
      <Typography variant="h5" gutterBottom>
        Transactions
      </Typography>
      {filteredTransactions && filteredTransactions.length > 0 ? (
        <Grid container spacing={3}>
          {filteredTransactions.map((tx) => (
            <Grid item xs={12} sm={6} md={4} key={tx._id} sx={{ display: "flex" }}>
              <MotionCard
                variant="outlined"
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.03 }}
                variants={cardVariants}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Transaction ID: {tx._id}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Type:</strong> {tx.type}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Amount:</strong> ${tx.amount}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong>{" "}
                    <Box
                      component="span"
                      sx={{
                        backgroundColor: statusNeonColors[tx.status.toLowerCase()],
                        color: "black",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {tx.status}
                    </Box>
                  </Typography>
                
                  {tx.recipient && (
                    <Typography variant="body2">
                      <strong>Recipient:</strong> {tx.recipient.name}{" "}
                      {tx.recipient._id && `(${tx.recipient._id})`}
                    </Typography>
                  )}
                  {tx.adminApprovedBy && (
                    <Typography variant="body2">
                      <strong>Approved by:</strong> {tx.adminApprovedBy.name}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>Notes:</strong> {tx.notes}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No transactions found.</Typography>
      )}
    </Box>
  );
};

export default UserProfile;
