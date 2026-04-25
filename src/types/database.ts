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
          theme_color: string | null
          theme_variant: string | null
          is_deposit_required: boolean | null
          deposit_percentage: number | null
          iban: string | null
          account_holder: string | null
          bank_name: string | null
        }
        Insert: Omit<Database['public']['Tables']['salons']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['salons']['Row']>
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
          image_url: string | null
          auth_user_id: string | null
          title: string | null
          role: string | null
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['staff']['Row']>
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
        Update: Partial<Database['public']['Tables']['services']['Row']>
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          salon_id: string
          staff_id: string
          service_id: string
          customer_id: string
          appointment_date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['appointments']['Row']>
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
        Update: Partial<Database['public']['Tables']['customers']['Row']>
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
        Update: Partial<Database['public']['Tables']['working_hours']['Row']>
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          salon_id: string
          title: string
          message: string
          is_read: boolean
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'is_read'> & { is_read?: boolean }
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }
      staff_services: {
        Row: {
          staff_id: string
          service_id: string
        }
        Insert: Database['public']['Tables']['staff_services']['Row']
        Update: Partial<Database['public']['Tables']['staff_services']['Row']>
      }
      staff_working_hours: {
        Row: {
          id: string
          staff_id: string
          salon_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_day_off: boolean
        }
        Insert: Omit<Database['public']['Tables']['staff_working_hours']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['staff_working_hours']['Row']>
      }
      exception_dates: {
        Row: {
          id: string
          salon_id: string
          staff_id: string | null
          exception_date: string
          reason: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['exception_dates']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['exception_dates']['Row']>
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['system_settings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['system_settings']['Row']>
      }
      support_tickets: {
        Row: {
          id: string
          salon_id: string
          subject: string
          message: string
          status: 'open' | 'answered' | 'closed'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['support_tickets']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['support_tickets']['Row']>
      }
      ticket_messages: {
        Row: {
          id: string
          ticket_id: string
          sender: 'salon' | 'admin'
          message: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ticket_messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ticket_messages']['Row']>
      }
      admin_logs: {
        Row: {
          id: string
          salon_id: string | null
          action_type: string
          title: string
          description: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['admin_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['admin_logs']['Row']>
      }
      reviews: {
        Row: {
          id: string
          salon_id: string
          appointment_id: string
          rating: number
          comment: string | null
          is_verified: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Row']>
      }
      subscriptions: {
        Row: {
          id: string
          salon_id: string
          plan_name: string
          amount: number
          receipt_no: string | null
          status: 'pending' | 'active' | 'rejected' | 'expired'
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['subscriptions']['Row']>
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
export type WorkingHour = WorkingHours
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type StaffWorkingHour = Database['public']['Tables']['staff_working_hours']['Row']

export type AppointmentWithDetails = Appointment & {
  staff: Staff
  service: Service
  customer: Customer
}