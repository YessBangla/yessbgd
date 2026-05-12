export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      cms_industries: {
        Row: {
          created_at: string | null
          data: Json | null
          description: string | null
          icon: string | null
          id: string
          is_published: boolean | null
          outcomes: Json | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean | null
          outcomes?: Json | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean | null
          outcomes?: Json | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_insights: {
        Row: {
          author: string | null
          body_md: string | null
          category: string | null
          cover_image: string | null
          created_at: string | null
          data: Json | null
          excerpt: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string
          tags: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          body_md?: string | null
          category?: string | null
          cover_image?: string | null
          created_at?: string | null
          data?: Json | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          body_md?: string | null
          category?: string | null
          cover_image?: string | null
          created_at?: string | null
          data?: Json | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_services: {
        Row: {
          bullets: Json | null
          created_at: string | null
          data: Json | null
          description: string | null
          icon: string | null
          id: string
          is_published: boolean | null
          pricing: Json | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          bullets?: Json | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean | null
          pricing?: Json | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          bullets?: Json | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean | null
          pricing?: Json | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_ventures: {
        Row: {
          category: string | null
          created_at: string | null
          data: Json | null
          description: string | null
          icon: string | null
          id: string
          image_path: string | null
          is_published: boolean | null
          slug: string
          sort_order: number | null
          status: string | null
          tagline: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          image_path?: string | null
          is_published?: boolean | null
          slug: string
          sort_order?: number | null
          status?: string | null
          tagline?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          image_path?: string | null
          is_published?: boolean | null
          slug?: string
          sort_order?: number | null
          status?: string | null
          tagline?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_location: string | null
          cover_letter: string
          created_at: string
          email: string
          full_name: string
          id: string
          job_slug: string
          job_title: string
          linkedin: string | null
          phone: string
          resume_name: string
          resume_path: string
          resume_size: number
          resume_type: string
          status: Database["public"]["Enums"]["application_status"]
          status_note: string | null
          status_updated_at: string
        }
        Insert: {
          applicant_location?: string | null
          cover_letter: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          job_slug: string
          job_title: string
          linkedin?: string | null
          phone: string
          resume_name: string
          resume_path: string
          resume_size: number
          resume_type: string
          status?: Database["public"]["Enums"]["application_status"]
          status_note?: string | null
          status_updated_at?: string
        }
        Update: {
          applicant_location?: string | null
          cover_letter?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          job_slug?: string
          job_title?: string
          linkedin?: string | null
          phone?: string
          resume_name?: string
          resume_path?: string
          resume_size?: number
          resume_type?: string
          status?: Database["public"]["Enums"]["application_status"]
          status_note?: string | null
          status_updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lookup_application: {
        Args: { _email: string; _ref: string }
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          job_title: string
          status: Database["public"]["Enums"]["application_status"]
          status_note: string
          status_updated_at: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      application_status:
        | "New"
        | "Reviewed"
        | "Rejected"
        | "Submitted"
        | "Under review"
        | "Interview"
        | "Offer"
        | "Hired"
        | "On hold"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      application_status: [
        "New",
        "Reviewed",
        "Rejected",
        "Submitted",
        "Under review",
        "Interview",
        "Offer",
        "Hired",
        "On hold",
      ],
    },
  },
} as const
