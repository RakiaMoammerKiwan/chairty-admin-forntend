import { Type } from "./Type";

export interface BeneficiaryRequest {
  id: number;
  full_name: string;
  phone_number: string;
  age: number;
  gender: string;
  user_id: number;
  type_id: number;
  marital_status: string;
  number_of_kids: number;
  kids_description: string | null;
  governorate: string;
  home_address: string;
  monthly_income: number;
  current_job: string;
  monthly_income_source: string;
  number_of_needy: number;
  expected_cost: number;
  description: string;
  severity_level: string;
  document_path: string | null;
  current_housing_condition: string | null;
  needed_housing_help: string | null;
  status: 'معلق' | 'مقبول' | 'مرفوض';
  created_at: string;
  updated_at: string;
  type: Type;
}