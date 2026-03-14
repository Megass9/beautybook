export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Salon {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone: string;
  logo_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkingHour {
  id: string;
  salon_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, ...
  open_time: string; // "09:00"
  close_time: string; // "18:00"
  is_closed: boolean;
}

export interface Staff {
  id: string;
  salon_id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  auth_user_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface StaffService {
  staff_id: string;
  service_id: string;
}

export interface StaffWorkingHour {
  id: string;
  staff_id: string;
  salon_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_day_off: boolean;
}

export interface Service {
  id: string;
  salon_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  category?: string;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  salon_id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  salon_id: string;
  customer_id: string;
  staff_id: string;
  service_id: string;
  appointment_date: string; // "2024-01-15"
  start_time: string; // "14:00"
  end_time: string; // "15:00"
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  created_at: string;
  // Joins
  customer?: Customer;
  staff?: Staff;
  service?: Service;
}

export interface Database {
  public: {
    Tables: {
      salons: { Row: Salon; Insert: Omit<Salon, "id" | "created_at" | "updated_at">; Update: Partial<Salon> };
      working_hours: { Row: WorkingHour; Insert: Omit<WorkingHour, "id">; Update: Partial<WorkingHour> };
      staff: { Row: Staff; Insert: Omit<Staff, "id" | "created_at">; Update: Partial<Staff> };
      services: { Row: Service; Insert: Omit<Service, "id" | "created_at">; Update: Partial<Service> };
      customers: { Row: Customer; Insert: Omit<Customer, "id" | "created_at">; Update: Partial<Customer> };
      appointments: { Row: Appointment; Insert: Omit<Appointment, "id" | "created_at">; Update: Partial<Appointment> };
    };
  };
}
