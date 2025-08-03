/* eslint-disable no-useless-catch */
import api from './api';
import { Paths } from '@/paths';
import { Project } from '../types/Project';

const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Fetch projects of a specific type from the API.
 * @param type Project type (e.g., 'صحي', 'تعليمي')
 * @returns Array of Project objects
 * @throws Error if the request fails
 */
export const fetchProjectsByType = async (type: string): Promise<Project[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get<Project[]>(`${Paths.BASE_URL}getProjectsByType/${encodeURIComponent(type)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchProjectsByStatus = async (status: string): Promise<Project[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get<Project[]>(`${Paths.BASE_URL}filterProjectByStatus/${encodeURIComponent(status)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a project by its ID.
 * @param id Project ID
 * @throws Error if the request fails or project cannot be deleted
 */
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