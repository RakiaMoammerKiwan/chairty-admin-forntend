// src/utils/authHeader.ts
import { Paths } from "@/paths";

interface AuthHeaders {
  Authorization?: string;
  'Content-Type': string;
  [key: string]: string | undefined;
}

export const authHeader = (): AuthHeaders => {
  const token = localStorage.getItem('token');
  const headers: AuthHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Service-Name': Paths.SERVICE_PERMISSION_NAME,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};