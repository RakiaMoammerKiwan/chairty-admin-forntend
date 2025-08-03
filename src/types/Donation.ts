// src/types/Donation.ts

export interface Donation {
  id: number;
  recipient_name: string;
  recipient_number: string;
  amount: number;
  delivered: boolean;
  full_name: string;
  email: string;
}