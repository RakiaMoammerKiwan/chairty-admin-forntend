interface AppPaths {
  BASE_URL: string;
  SERVICE_PERMISSION_NAME: string;
  NODE_ENV: string;
}

export const Paths: AppPaths = {
  BASE_URL: import.meta.env.VITE_SERVER_URL || 'http://localhost:8000/api',
  SERVICE_PERMISSION_NAME: import.meta.env.VITE_SERVICE_PERMISSION_NAME || 'default-service',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
};