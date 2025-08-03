/* eslint-disable no-useless-catch */
import api from './api';
import { Paths } from '@/paths';
import { VolunteerRequest } from '../types/VolunteerRequest';

const AUTH_TOKEN_KEY = 'auth_token';

export const fetchVolunteerRequestsByStatus = async (
  status: string
): Promise<VolunteerRequest[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No authentication token found');
    }

    // تأكد من أن BASE_URL يحتوي على /api/
    const url = `${Paths.BASE_URL}getVolunteerRequestsByStatus/${encodeURIComponent(status)}`;

    const response = await api.get<VolunteerRequest[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        // لا تُضف Content-Type في الـ GET
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching volunteer requests:', error);
    throw error;
  }
};

export const approveVolunteerRequest = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/approveVolunteerRequest`;

    await api.post(url, { id }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error approving volunteer request:', error);
    throw error;
  }
};

export const rejectVolunteerRequest = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/rejectVolunteerRequest`;

    await api.post(url, { id }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error rejecting volunteer request:', error);
    throw error;
  }
};

export const fetchFilteredVolunteers = async (isBanned: boolean): Promise<Volunteer[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}filterVolunteersByBan/${isBanned ? 'true' : 'false'}`;

    const response = await api.get<Volunteer[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    throw error;
  }
};

// حظر متطوع
export const banVolunteer = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/banVolunteer`;

    await api.post(url, { id }, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Error banning volunteer:', error);
    throw error;
  }
};

// فك حظر متطوع
export const unblockVolunteer = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/unblockVolunteer`;

    await api.post(url, { id }, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Error unblocking volunteer:', error);
    throw error;
  }
};