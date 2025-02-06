import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'; 
import MoneyOffIcon from '@mui/icons-material/MoneyOff'; 
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode'; // Import the icons
import LanguageIcon from '@mui/icons-material/Language'; // Import Language Icon
import HomeIcon from '@mui/icons-material/Home';
import { useAppSelector, useAppDispatch } from "../../store/index";
import { logout } from "../../store/reducers/auth.reducer";
import { motion } from 'framer-motion'; // Import Framer Motion
import { ThemeContext } from "../../context/theme.context"; // Import ThemeContext
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import ConfirmationDialog from "../confirmationdialog";
import { AccountBalanceWallet } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

interface HeaderProps {
  isAdmin: boolean; // Prop to check if user is admin
}

const Header: React.FC<HeaderProps> = ({ isAdmin }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated); 
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For Language Menu
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  
  const { t, i18n } = useTranslation(); // Initialize i18n

  // Confirmation Dialog State
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogout = () => {
    // Trigger the dialog instead of logging out directly
    setOpenDialog(true);
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Open the language menu
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null); // Close the language menu
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language); // Change language via i18n
    setAnchorEl(null); // Close menu after selection
  };

  // Context API for theme toggle
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ThemeContext must be used within a ThemeContextProvider");
  }

  const { toggleTheme, mode } = themeContext; // Get toggleTheme and current mode from context

  // Regular User Menu Items
  const userMenuItems = [
    { text: t("header.home"), path: "/", icon: <HomeIcon /> },
    { text: t("header.depositMoney"), path: "/add-funds", icon: <AccountBalanceWallet /> },
    { text: "Transfer Money", path: "/transfer-money", icon: <CurrencyExchangeIcon/> },
    { text: "Withdraw Money", path: "/withdraw-money", icon: <MoneyOffIcon/> },
    { text: "Profile", path: "/user-profile", icon: <PersonIcon/> },
  ];

  // Admin Menu Items
  const adminMenuItems = [
    { text: t("header.home"), path: "/", icon: <HomeIcon /> },
    { text: "Approve Transactions", path: "admin/pending-transactions", icon: <CheckCircleIcon  /> },
    { text: "Commsion History", path: "/admin/commissions", icon: <MonetizationOnIcon/> },
  ];

  const drawerContent = (
    <List>
      {(isAdmin ? adminMenuItems : userMenuItems).map((item) => (
        <motion.div
          key={item.path}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ListItem 
            component={Link} 
            to={item.path} 
            onClick={handleDrawerToggle}
            sx={{
              "&:hover": {
                backgroundColor: theme.palette.secondary.main, 
                transition: "all 0.3s ease",
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        </motion.div>
      ))}
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ListItem onClick={handleLogout} sx={{
            "&:hover": {
              backgroundColor: theme.palette.secondary.main, 
              transition: "all 0.3s ease",
            },
          }}>
            <ListItemText primary={t("header.logout")} sx={{
              fontWeight: 500,
              fontSize: "16px",
            }} />
          </ListItem>
        </motion.div>
      )}
    </List>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <AppBar 
          position="static" 
          color="primary" 
          sx={{
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
          }}
        >
          <Toolbar sx={{ padding: "0 20px" }}>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, fontSize: "24px" }}>
              {t("header.appName")}
            </Typography>
            {isMobile ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    ":hover": { 
                      backgroundColor: theme.palette.secondary.main 
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            ) : (
              <>
                {(isAdmin ? adminMenuItems : userMenuItems).map((item) => (
                  <motion.div 
                    key={item.path} 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        margin: "0 10px",
                        ":hover": {
                          backgroundColor: theme.palette.secondary.main,
                          transition: "all 0.3s ease"
                        }
                      }}
                    >
                      {item.text}
                    </Button>
                  </motion.div>
                ))}
                
                {/* Language Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <IconButton
                    color="inherit"
                    onClick={handleLanguageMenuClick}
                    sx={{
                      border: "2px solid",
                      borderRadius: "4px",
                      padding: "8px",
                      marginLeft: "10px",
                      ":hover": {
                        backgroundColor: theme.palette.secondary.main,
                      }
                    }}
                  >
                    <LanguageIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleLanguageMenuClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={() => changeLanguage("en")}>English</MenuItem>
                    <MenuItem onClick={() => changeLanguage("hi")}>Hindi</MenuItem>
                  </Menu>
                </motion.div>

                {/* Theme Toggle Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <IconButton
                    color="inherit"
                    onClick={toggleTheme}
                    sx={{
                      border: "2px solid",
                      borderRadius: "4px",
                      padding: "8px",
                      marginLeft: "10px",
                      ":hover": {
                        backgroundColor: theme.palette.secondary.main,
                      }
                    }}
                  >
                    {mode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </motion.div>

                {isAuthenticated && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <IconButton
                      color="inherit"
                      onClick={handleLogout}
                      sx={{
                        ":hover": {
                          backgroundColor: theme.palette.secondary.main,
                        },
                        marginLeft: "10px"
                      }}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </motion.div>
                )}
                {!isAuthenticated && (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Button
                        color="inherit"
                        component={Link}
                        to="/signup" 
                        sx={{
                          margin: "0 10px",
                          ":hover": {
                            backgroundColor: theme.palette.secondary.main,
                            transition: "all 0.3s ease"
                          }
                        }}
                      >
                        {t("header.signUp")}
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Button
                        color="inherit"
                        component={Link}
                        to="/signin" 
                        sx={{
                          margin: "0 10px",
                          ":hover": {
                            backgroundColor: theme.palette.secondary.main,
                            transition: "all 0.3s ease"
                          }
                        }}
                      >
                        {t("header.signIn")}
                      </Button>
                    </motion.div>
                  </>
                )}
              </>
            )}
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Confirmation Dialog for Logout */}
      <ConfirmationDialog
        open={openDialog}
        heading={"Logout Confirmation"}
        message={"Do you want to logout ?"}
        onConfirm={() => {
          dispatch(logout());
          setOpenDialog(false); // Close dialog after confirmation
        }}
        onClose={() => setOpenDialog(false)} // Close dialog on cancel
      />
      
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;
