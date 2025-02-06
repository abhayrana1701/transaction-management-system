import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasErrorOccurred: boolean;
  errorDetails: Error | null;
  errorContext: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasErrorOccurred: false,
    errorDetails: null,
    errorContext: null,
  };

  static getDerivedStateFromError(): Partial<State> {
    return { hasErrorOccurred: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ errorDetails: error, errorContext: info });
    console.error('Captured error:', error, info);
  }

  resetErrorState = (): void => {
    this.setState({ hasErrorOccurred: false, errorDetails: null, errorContext: null });
  };

  render() {
    if (this.state.hasErrorOccurred) {
      return (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" color="error">
            Something went wrong.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {this.state.errorDetails?.message || 'An unexpected error occurred.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={this.resetErrorState}
          >
            Reload
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
