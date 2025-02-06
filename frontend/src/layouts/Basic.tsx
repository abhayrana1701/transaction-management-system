import React from "react";
import { Box, Theme, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { createStyles } from "@mui/styles";
import Header from "../components/header";
import Footer from "../components/footer";
import { useSelector } from "react-redux"; // Assuming you're using Redux to get user info

const useStyle = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "lightgrey",
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("md")]: {
        backgroundColor: theme.palette.background.default,
      },
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
  });

const Basic: React.FC = () => {
  const theme = useTheme();
  const styles = useStyle(theme);

  // Get user info from Redux (adjust accordingly to your state structure)
  const userRole = useSelector((state: any) => state.auth.user?.role); // Assuming role is inside user

  return (
    <Box sx={styles.root}>
      <Header isAdmin={userRole === "admin"} /> {/* Pass prop to Header */}
      <Box sx={styles.content}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Basic;
