import React from 'react';
import { Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import { 
  Accessibility, 
  Code, 
  Speed, 
  Cloud, 
  Security, 
  TrendingUp, 
  DeviceHub, 
  Storage 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Updated features to reflect your banking app's functionality
const features: Feature[] = [
  {
    icon: <Security />,
    title: 'Secure Access',
    description: 'Robust user authorization and multi-factor authentication to keep your account safe.'
  },
  {
    icon: <Accessibility />,
    title: 'User Empowerment',
    description: 'Easy account management and intuitive user experiences for seamless login and signup.'
  },
  {
    icon: <Cloud />,
    title: 'Instant Funding',
    description: 'Quickly add funds to your wallet with secure deposit requests awaiting admin approval.'
  },
  {
    icon: <DeviceHub />,
    title: 'Money Transfers',
    description: 'Effortlessly send money to other users or accounts with state-of-the-art transaction security.'
  },
  {
    icon: <Speed />,
    title: 'Quick Withdrawals',
    description: 'Fast and intuitive withdrawal processes to access your funds when you need them.'
  },
  {
    icon: <Storage />,
    title: 'Transaction History',
    description: 'A comprehensive log of all your transactions to help you manage your finances with ease.'
  },
  {
    icon: <TrendingUp />,
    title: 'Commission Tracking',
    description: 'For admins: monitor commissions earned on every transaction, whether local or international.'
  },
  {
    icon: <Code />,
    title: 'Developer Ready',
    description: 'Built on modern tech stacks to ensure seamless integrations and ongoing scalability.'
  },
];

const neonColors = [
  '#39FF14', // Neon Green
  '#00FFFF', // Neon Cyan
  '#FF1493', // Neon Pink
  '#FF6347', // Neon Orange
  '#7FFF00', // Neon Yellow Green
  '#8A2BE2', // Neon Blue
  '#FF00FF', // Neon Purple
  '#00FF00', // Neon Green
];

const Features: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: theme.palette.background.default,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" color={theme.palette.primary.main} fontWeight="bold" sx={{ marginBottom: 3 }}>
        Key Features
      </Typography>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.2,
                  type: 'spring',
                  stiffness: 100,
                  damping: 25,
                }}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <Paper
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: theme.palette.background.paper,
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0px 10px 20px rgba(0, 0, 0, 0.1)`,
                      border: `2px solid ${theme.palette.primary.main}`,
                    },
                  }}
                >
                  <IconButton
                    sx={{
                      backgroundColor: neonColors[index % neonColors.length],
                      padding: 2,
                      borderRadius: '50%',
                      color: 'white',
                      marginBottom: 2,
                      '&:hover': {
                        backgroundColor: neonColors[(index + 1) % neonColors.length],
                      },
                    }}
                  >
                    {feature.icon}
                  </IconButton>
                  <Typography variant="h6" color={theme.palette.primary.main} fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary} sx={{ marginTop: 1 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Features;
