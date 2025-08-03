/* eslint-disable no-useless-catch */
import api from './api';
import { Paths } from '@/paths';

const AUTH_TOKEN_KEY = 'auth_token';

export const addVolunteerProject = async (
  params: {
    type_id: string;
    name: string;
    description: string;
    total_amount: string;
    volunteer_hours: string;
    required_tasks: string;
    location: string;
  },
  photo: File
): Promise<any> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No authentication token found');

    const formData = new FormData();
    formData.append('type_id', params.type_id);
    formData.append('name', params.name);
    formData.append('description', params.description);
    formData.append('total_amount', params.total_amount);
    formData.append('volunteer_hours', params.volunteer_hours);
    formData.append('required_tasks', params.required_tasks);
      formData.append('location', params.location);
    formData.append('photo', photo);

    const url = `${Paths.BASE_URL}admin/addVolunteerProject`;

    const response = await api.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};