import React from 'react';

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in the component tree,
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 *
 * This prevents the entire app from crashing when a single component encounters an error,
 * which is especially important for a complex game like PathBloom.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and store in state for display
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You can also log error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            backgroundColor: '#1a1a2e',
            color: '#eee',
            textAlign: 'center',
          }}
        >
          <h1 style={{ color: '#ff6b6b', marginBottom: '20px' }}>Oops! Something went wrong</h1>
          <p style={{ marginBottom: '20px', maxWidth: '600px' }}>
            The game encountered an unexpected error. This has been logged and our team will
            investigate the issue.
          </p>

          {typeof process !== 'undefined' &&
            process.env &&
            process.env.NODE_ENV === 'development' &&
            this.state.error && (
              <div
                style={{
                  backgroundColor: '#16213e',
                  padding: '15px',
                  borderRadius: '8px',
                  maxWidth: '800px',
                  textAlign: 'left',
                  marginBottom: '20px',
                  overflow: 'auto',
                  maxHeight: '300px',
                }}
              >
                <h3 style={{ color: '#ff6b6b', marginTop: 0 }}>Error Details:</h3>
                <pre
                  style={{
                    color: '#4ecdc4',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 24px',
                backgroundColor: '#4ecdc4',
                color: '#1a1a2e',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ff6b6b',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
