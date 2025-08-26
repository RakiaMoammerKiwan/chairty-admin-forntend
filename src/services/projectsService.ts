/* eslint-disable no-useless-catch */
import api from './api';
import { Paths } from '@/paths';
import { Project } from '../types/Project';

const AUTH_TOKEN_KEY = 'auth_token';

export interface ProjectFilter {
  status: string;
  priority: string;
  type: string;
  duration_type: string;
}


export const fetchProjectsByFilters = async (filters: ProjectFilter): Promise<Project[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const response = await api.get<Project[]>(`${Paths.BASE_URL}getProjectsByFilters`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      params: filters
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching projects by filters:', error);
    throw error;
  }
};

export const getProjectTypes = (): string[] => {
  return ['الكل', 'صحي', 'تعليمي', 'سكني', 'ديني', 'غذائي', 'ميداني', 'عن بعد'];
};

export const getDurationTypes = (): string[] => {
  return ['الكل', 'مؤقت', 'دائم', 'فردي', 'تطوعي'];
};

export const getPriorities = (): string[] => {
  return ['الكل', 'منخفض', 'متوسط', 'مرتفع', 'حرج'];
};

export const getStatuses = (): string[] => {
  return ['جاري', 'معلق', 'منتهي', 'محذوف'];
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      throw new Error('No authentication token found');
    }

     await api.delete(`${Paths.BASE_URL}admin/deleteProject`, {
      params: { id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error || 'فشل حذف المشروع';
  }
};

export const markVolunteerProjectAsCompleted = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/markVolunteerProjectAsCompleted?id=${id}`;

    await api.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Error marking volunteer project as completed:', error);
    throw error;
  }
};

export const donateToProject = async (id: number, amount: number): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const url = `${Paths.BASE_URL}admin/donateToProject/?id=${id}&amount=${amount}`;

    await api.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Error donating to project:', error);
    throw error;
  }
};


export interface ChangeProjectStatusResponse {
  message: string;
}
export const changeProjectStatus = async (
  project_id: number, 
  status: 'جاري' | 'معلق'
): Promise<ChangeProjectStatusResponse> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await api.post<ChangeProjectStatusResponse>(
      `${Paths.BASE_URL}admin/changeProjectStatus`, 
      { project_id, status }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error changing project status:', error);
    throw error;
  }
};
