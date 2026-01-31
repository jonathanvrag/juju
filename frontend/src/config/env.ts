export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  appName: 'Book Management System',
  tokenKey: 'token',
} as const;
