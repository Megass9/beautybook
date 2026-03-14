export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      salons: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          address: string
          city: string
          phone: string
          logo_url: string | null
          owner_id: string
          description: string | null
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['salons']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['salons']['Insert']>
      }
      staff: {
        Row: {
          id: string
          created_at: string
          salon_id: string
          name: string
          email: string | null
          phone: string | null
          avatar_url: string | null
          title: string | null
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['staff']['Insert']>
      }
      services: {
        Row: {
          id: string
          created_at: string
          salon_id: string
          name: string
          description: string | null
          duration_minutes: number
          price: number
          category: string | null
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          salon_id: string
          staff_id: string
          service_id: string
          customer_id: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>
      }
      customers: {
        Row: {
          id: string
          created_at: string
          salon_id: string
          name: string
          phone: string
          email: string | null
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      working_hours: {
        Row: {
          id: string
          salon_id: string
          staff_id: string | null
          day_of_week: number
          open_time: string
          close_time: string
          is_closed: boolean
        }
        Insert: Omit<Database['public']['Tables']['working_hours']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['working_hours']['Insert']>
      }
      staff_services: {
        Row: {
          staff_id: string
          service_id: string
        }
        Insert: Database['public']['Tables']['staff_services']['Row']
        Update: Partial<Database['public']['Tables']['staff_services']['Insert']>
      }
    }
  }
}

export type Salon = Database['public']['Tables']['salons']['Row']
export type Staff = Database['public']['Tables']['staff']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type Customer = Database['public']['Tables']['customers']['Row']
export type WorkingHours = Database['public']['Tables']['working_hours']['Row']

export type AppointmentWithDetails = Appointment & {
  staff: Staff
  service: Service
  customer: Customer
}
