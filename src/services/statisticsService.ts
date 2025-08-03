/* eslint-disable no-useless-catch */
import api from './api';
import { Paths } from '@/paths';

const AUTH_TOKEN_KEY = 'auth_token';

export interface StatisticsResponse {
  total_donations: number;
  accepted_volunteers: number;
  beneficiaries: number;
  donors: number;
  projects_count: number;
}

/**
 * Fetch statistics data from the backend API.
 * @returns StatisticsResponse
 * @throws Error if the request fails
 */
export const fetchStatistics = async (): Promise<StatisticsResponse> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get<StatisticsResponse>(`${Paths.BASE_URL}statistics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;    
  }
};
