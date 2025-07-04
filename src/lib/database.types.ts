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
      locations: {
        Row: {
          id: string
          zip_code: string
          city: string
          state: string
          created_at: string
        }
        Insert: {
          id?: string
          zip_code: string
          city: string
          state: string
          created_at?: string
        }
        Update: {
          id?: string
          zip_code?: string
          city?: string
          state?: string
          created_at?: string
        }
        Relationships: []
      }
      mosques: {
        Row: {
          id: string
          location_id: string
          name: string
          first_prayer_time: string
          second_prayer_time: string
          address: string
          created_at: string
        }
        Insert: {
          id?: string
          location_id: string
          name: string
          first_prayer_time: string
          second_prayer_time: string
          address: string
          created_at?: string
        }
        Update: {
          id?: string
          location_id?: string
          name?: string
          first_prayer_time?: string
          second_prayer_time?: string
          address?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mosques_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "locations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}