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
  health_projects_balance: number;
  educational_projects_balance: number;
  nutritional_projects_balance: number;
  housing_projects_balance: number;
  religious_projects_balance: number;
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

export interface BeneficiariesPerYearResponse {
  year: string;
  beneficiaries: number;
}
export const fetchBeneficiariesPerYear = async (): Promise<BeneficiariesPerYearResponse[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get<BeneficiariesPerYearResponse[]>(`${Paths.BASE_URL}beneficiariesPerYear`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;    
  }
};