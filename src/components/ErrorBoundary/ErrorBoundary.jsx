import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console or send it to an external service
    console.error('Error caught by boundary:', error, errorInfo);
    // Optional: Send error to external service (like Sentry)
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Oops! Something went wrong</h2>
          <p>
            We're sorry for the inconvenience. Please try refreshing the page.
            <br />
            <strong>Error Details:</strong> {this.state.error.message || 'Unknown Error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="error-reload-btn"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;