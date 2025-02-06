import React from "react";
import { Box, Typography, Link, Grid, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const Footer: React.FC = () => {
  const { t } = useTranslation(); // Initialize i18n

  return (
    <Box
      sx={{
        backgroundColor: "#333",
        color: "#fff",
        py: 4,
        textAlign: "center",
        paddingBottom: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Main Footer Content */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("footer.storeName")} {/* Dynamic store name */}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }} justifyContent="center">
        <Grid item>
          <Link href="/about" color="inherit" underline="hover">
            {t("footer.aboutUs")}
          </Link>
        </Grid>
        <Grid item>
          <Link href="/contact" color="inherit" underline="hover">
            {t("footer.contactUs")}
          </Link>
        </Grid>
        <Grid item>
          <Link href="/faq" color="inherit" underline="hover">
            {t("footer.faq")}
          </Link>
        </Grid>
        <Grid item>
          <Link href="/support" color="inherit" underline="hover">
            {t("footer.support")}
          </Link>
        </Grid>
      </Grid>

      {/* Social Media Links */}
      <Box sx={{ mb: 2 }}>
        <IconButton
          href="https://facebook.com"
          target="_blank"
          sx={{ color: "#fff", "&:hover": { color: "#1877f2" } }}
        >
          <Facebook />
        </IconButton>
        <IconButton
          href="https://twitter.com"
          target="_blank"
          sx={{ color: "#fff", "&:hover": { color: "#1da1f2" } }}
        >
          <Twitter />
        </IconButton>
        <IconButton
          href="https://instagram.com"
          target="_blank"
          sx={{ color: "#fff", "&:hover": { color: "#e1306c" } }}
        >
          <Instagram />
        </IconButton>
        <IconButton
          href="https://linkedin.com"
          target="_blank"
          sx={{ color: "#fff", "&:hover": { color: "#0077b5" } }}
        >
          <LinkedIn />
        </IconButton>
      </Box>

      {/* Footer Copyright */}
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </Typography>

      {/* Terms and Privacy Links */}
      <Box sx={{ mt: 2 }}>
        <Link href="/terms" color="inherit" underline="hover" sx={{ mr: 2 }}>
          {t("footer.termsOfService")}
        </Link>
        |
        <Link href="/privacy" color="inherit" underline="hover" sx={{ ml: 2 }}>
          {t("footer.privacyPolicy")}
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
