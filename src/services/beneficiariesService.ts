/* eslint-disable no-useless-catch */
import api from './api';
import { Paths } from '@/paths';
import { BeneficiaryRequest } from '../types/BeneficiaryRequest';

const AUTH_TOKEN_KEY = 'auth_token';

// جلب الطلبات المصفاة
export const fetchBeneficiaryRequests = async (
  type: string | null,
  status: string | null
): Promise<BeneficiaryRequest[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No authentication token found');
    }

    const typePart = type ? encodeURIComponent(type) : '';
    const statusPart = status ? encodeURIComponent(status) : '';

    const path = [typePart, statusPart].filter(Boolean).join('/');
    const url = `${Paths.BASE_URL}getFilteredBeneficiaryRequests${path ? '/' + path : ''}`;

    const response = await api.get<BeneficiaryRequest[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching beneficiary requests:', error);
    throw error;
  }
};

export const showBeneficiaryRequest = async (id: number): Promise<BeneficiaryRequest> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}showBeneficiaryRequest?id=${id}`;

    const response = await api.get<BeneficiaryRequest>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching beneficiary request:', error);
    throw error;
  }
};


// قبول طلب مستفيد
export const acceptBeneficiaryRequest = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/acceptBeneficiaryRequest?id=${id}`;

    await api.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Error accepting beneficiary request:', error);
    throw error;
  }
};

// رفض طلب مستفيد
export const rejectBeneficiaryRequest = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/rejectBeneficiaryRequest?id=${id}`;

    await api.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Error rejecting beneficiary request:', error);
    throw error;
  }
};

export const fetchFilteredBeneficiaries = async (isBanned: boolean): Promise<Beneficiary[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}filterBeneficiaryByBan/${isBanned ? 'true' : 'false'}`;

    const response = await api.get<Beneficiary[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    throw error;
  }
};

// حظر مستفيد
export const banBeneficiary = async (phoneNumber: string): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/banBeneficiary`;

    await api.post(url, { phone_number: phoneNumber }, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Error banning beneficiary:', error);
    throw error;
  }
};

// فك حظر مستفيد
export const unblockBeneficiary = async (phoneNumber: string): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/unblockBeneficiary`;

    await api.post(url, { phone_number: phoneNumber }, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Error unblocking beneficiary:', error);
    throw error;
  }
};