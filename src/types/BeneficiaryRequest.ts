
export interface Type {
  id: number;
  name: string;
}

export interface BeneficiaryRequest {
  id: number;
  full_name: string;
  phone_number: string;
  age: string;
  place_of_residence: string;
  gender: string;
  family_size: string;
  health_status: string;
  income_source: string;
  description: string;
  status: 'معلق' | 'مقبول' | 'مرفوض';
  type_id: number;
  type: Type;
  created_at: string;
  updated_at: string;
}