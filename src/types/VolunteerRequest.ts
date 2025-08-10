// src/types/VolunteerRequest.ts
export interface VolunteerRequest {
  id: number;
  full_name: string;
  phone_number: string | null;
  age: string;
  volunteer_status: 'مقبول' | 'مرفوض' | 'معلق';
  place_of_residence: string;
  gender: string;
  your_last_educational_qualification: string;
  your_studying_domain: string;
  volunteering_hours: string;
  purpose_of_volunteering: string;
}