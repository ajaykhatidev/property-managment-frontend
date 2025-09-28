// Environment configuration
const environments = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api',
    ENVIRONMENT: 'development'
  },
  production: {
    API_BASE_URL: 'https://property-managment-x0d8.onrender.com/api',
    ENVIRONMENT: 'production'
  }
};

// Get current environment from environment variable or default to development
const currentEnv = import.meta.env.VITE_APP_ENV || 'production';

// Allow override of API URL via environment variable
const baseConfig = environments[currentEnv] || environments.development;
const customApiUrl = import.meta.env.VITE_API_BASE_URL;

// Export current environment config
export const config = {
  ...baseConfig,
  ...(customApiUrl && { API_BASE_URL: customApiUrl })
};

// Export individual values for convenience
export const API_BASE_URL = config.API_BASE_URL;
export const ENVIRONMENT = config.ENVIRONMENT;

// Helper function to switch environment (useful for testing)
export const switchEnvironment = (env) => {
  if (environments[env]) {
    return environments[env];
  }
  console.warn(`Environment '${env}' not found. Using development.`);
  return environments.development;
};

// Log current configuration
console.log(`🌍 Environment: ${ENVIRONMENT}`);
console.log(`🔗 API Base URL: ${API_BASE_URL}`);
