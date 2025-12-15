// API Configuration
// In development, use localhost
// In production, use the environment variable for the Render backend URL
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }
  // In production, use REACT_APP_API_URL from environment variables
  return process.env.REACT_APP_API_URL || '';
};

export const API_BASE_URL = getBaseURL();

