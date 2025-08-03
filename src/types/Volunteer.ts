
export interface Volunteer {
  id: number;
  full_name: string;
  email: string;
  phone_number: string | null;
  role: string;
  volunteer_status: 'مقبول' | 'مرفوض' | 'معلق';
  ban: 0 | 1;
}