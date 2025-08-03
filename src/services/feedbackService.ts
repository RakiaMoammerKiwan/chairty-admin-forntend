/* eslint-disable no-useless-catch */
import api from './api';
import { Paths } from '@/paths';
import { Feedback } from '../types/Feedback';

const AUTH_TOKEN_KEY = 'auth_token';

export const fetchFeedbacksByStatus = async (status: string): Promise<Feedback[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${Paths.BASE_URL}getFilteredFeedbacks/${encodeURIComponent(status)}`;

    const response = await api.get<Feedback[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
};

// قبول رأي
export const acceptFeedback = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/acceptFeedback?id=${id}`;

    await api.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Error accepting feedback:', error);
    throw error;
  }
};

// رفض رأي
export const rejectFeedback = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/rejectFeedback?id=${id}`;

    await api.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Error rejecting feedback:', error);
    throw error;
  }
};