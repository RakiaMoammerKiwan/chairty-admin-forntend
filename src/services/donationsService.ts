/* eslint-disable no-useless-catch */
import api from './api';
import { Paths } from '@/paths';

const AUTH_TOKEN_KEY = 'auth_token';

export const fetchFilteredGiftDonations = async (delivered: boolean | null): Promise<any[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}getFilteredGiftDelivered/${delivered ? 'true' : 'false'}`;

    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching filtered gift donations:', error);
    throw error;
  }
};

export const markGiftDonationAsDelivered = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/giftDelivered?id=${id}`;

    await api.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Error marking gift donation as delivered:', error);
    throw error;
  }
};