import api from './api';
import { Paths } from '@/paths';

const AUTH_TOKEN_KEY = 'auth_token';

export interface MonthlyDonationResponse {
  message: string;
}

export const executeMonthlyDonation = async (): Promise<MonthlyDonationResponse> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${Paths.BASE_URL}admin/doAllMonthlyDonations`;

    const response = await api.post<MonthlyDonationResponse>(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error executing monthly donation:', error);
    throw error;
  }
};