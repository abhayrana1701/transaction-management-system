import { Box, Grid, Paper, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface SkeletonLoaderProps {
  type?: string; // Type of the skeleton, for example 'upload', 'profile', 'card-grid', etc.
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'default' }) => {
  const theme = useTheme();
  if (type === 'upload') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: theme.palette.background.default,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <Grid container sx={{ width: '100%' }} spacing={2}>
          {/* Left Side Skeleton */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingRight: 4 }}>
            <Box>
              <Skeleton variant="text" width={300} height={60} sx={{ mb: 2 }} />
              <Skeleton variant="text" width={400} height={24} />
            </Box>
          </Grid>
    
          {/* Right Side Skeleton */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper
              elevation={10}
              sx={{
                width: '100%',
                maxWidth: 500, // Match the width of the form in the UploadComponent
                p: 4,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0px 10px 30px rgba(0,0,0,0.4)',
              }}
            >
              {/* Form Title Skeleton */}
              <Skeleton variant="text" width={200} height={40} sx={{ mx: 'auto', mb: 3 }} />
    
              {/* Title Input Skeleton */}
              <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
    
              {/* Description Input Skeleton */}
              <Skeleton variant="rectangular" height={128} sx={{ mb: 2, borderRadius: 1 }} />
    
              {/* Upload Area Skeleton */}
              <Skeleton
                variant="rectangular"
                height={150}
                sx={{
                  mb: 2,
                  borderRadius: 1,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: theme.palette.divider,
                }}
              />
    
              {/* Submit Button Skeleton */}
              <Skeleton
                variant="rectangular"
                height={48}
                sx={{
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}40 30%, ${theme.palette.secondary.main}40 90%)`,
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
    
    
  } else if (type === 'profile') {
    return (
      <div style={{ padding: '20px' }}>
        <Skeleton variant="circular" width={100} height={100} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
    );
  } else if (type === 'card-grid') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" width={200} height={300} />
        ))}
      </div>
    );
  }

  // Default fallback (could be a full-page skeleton)
  return <Skeleton variant="rectangular" width="100%" height="100vh" />;
};

export default SkeletonLoader;
