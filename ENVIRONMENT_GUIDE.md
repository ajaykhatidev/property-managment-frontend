# Environment Configuration Guide

This project now supports easy switching between local development and production environments.

## How to Switch Environments

### Method 1: Environment Variables (Recommended)

Create a `.env` file in the root directory:

```bash
# For development (default)
VITE_APP_ENV=development

# For production
VITE_APP_ENV=production

# Optional: Override API URL
VITE_API_BASE_URL=https://your-custom-api.com/api
```

### Method 2: Environment Switcher Component

In development mode, you'll see a floating environment switcher in the top-right corner that allows you to switch between environments with a single click.

### Method 3: Direct Code Modification

Edit `src/config/environment.js` and change the `currentEnv` variable:

```javascript
const currentEnv = 'production'; // or 'development'
```

## Environment URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://property-managment-x0d8.onrender.com/api`

## Features

✅ **Centralized API Management**: All API calls go through a single client  
✅ **Environment-based Configuration**: Easy switching between environments  
✅ **Request/Response Logging**: Automatic logging in development mode  
✅ **Error Handling**: Consistent error handling across all API calls  
✅ **Timeout Configuration**: 10-second timeout for all requests  
✅ **Environment Switcher**: Visual switcher for development  

## API Client Usage

All components now use the centralized API client:

```javascript
import { api } from '../api/api-client.js';

// Instead of direct axios calls
const response = await api.getProperties(filters);
const response = await api.addClient(data);
const response = await api.updateProperty(id, data);
```

## Available API Methods

### Properties
- `api.getProperties(filters)` - Get all properties with optional filters
- `api.getProperty(id)` - Get single property
- `api.addProperty(data)` - Add new property
- `api.updateProperty(id, data)` - Update property
- `api.deleteProperty(id)` - Delete property
- `api.getSoldProperties()` - Get sold properties
- `api.getAvailableProperties()` - Get available properties

### Clients
- `api.getClients(params)` - Get all clients with optional params
- `api.getClient(id)` - Get single client
- `api.addClient(data)` - Add new client
- `api.updateClient(id, data)` - Update client
- `api.deleteClient(id)` - Delete client

## Development Tips

1. **Check Console**: In development mode, all API requests are logged to the console
2. **Environment Indicator**: The environment switcher shows current environment and API URL
3. **Hot Reload**: After changing environment variables, restart your dev server
4. **Error Handling**: All API errors are automatically logged and handled consistently
