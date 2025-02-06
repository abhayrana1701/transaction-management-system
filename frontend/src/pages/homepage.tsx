import React from 'react';
import { Box, Typography } from '@mui/material';
import Features from '../components/features';
import { useTheme } from '@mui/material/styles'; // Import useTheme for dynamic theming
import { motion } from 'framer-motion'; // Import motion for animations

// Function to split text into an array of letters with spacing
const splitTextIntoLetters = (text: string) => {
  return text.split('').map((char, index) => {
    // If the character is a space, we can return a span with no content and only spacing
    if (char === ' ') {
      return <span key={index} style={{ marginRight: '0.5em' }} />;
    }

    return (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: -50 }} // Start from above and invisible
        animate={{ opacity: 1, y: 0 }} // End at normal position
        transition={{
          delay: index * 0.05, // Stagger animation delay based on index
          type: 'spring',
          stiffness: 50,
          damping: 25,
        }}
        style={{ display: 'inline-block', marginRight: '0.1em' }} // Ensure each letter has spacing
      >
        {char}
      </motion.span>
    );
  });
};

const Home: React.FC = () => {
  const theme = useTheme(); // Access the theme

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column', // Stack items vertically
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default, // Use background color from theme
        padding: 0, // Optional padding for some space around
      }}
    >

      {/* Animated title with staggered letters */}
      <Typography
        variant="h4"
        color={theme.palette.primary.main} // Use primary color from theme
        fontWeight="bold"
        sx={{ paddingTop: 5, mb: 1 }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.05, type: 'spring', stiffness: 80, damping: 15 },
            },
          }}
        >
          {splitTextIntoLetters("Welcome to the NexBank!")}
        </motion.div>
      </Typography>

      {/* Subline Text */}
      <Typography
        variant="body1"
        color={theme.palette.text.secondary} // Use secondary text color from theme
        sx={{ textAlign: 'center' }}
      >
        Step into the future of banking. Explore smart features, seamless transactions, and a financial journey that's uniquely yours.
      </Typography>

      <Features />
    </Box>
  );
};

export default Home;
