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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          account_id: string | null
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id: number
          linkedin_id: string | null
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          post_id: number | null
          received_dm: boolean | null
        }
        Insert: {
          account_id?: string | null
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id?: number
          linkedin_id?: string | null
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          post_id?: number | null
          received_dm?: boolean | null
        }
        Update: {
          account_id?: string | null
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id?: number
          linkedin_id?: string | null
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          post_id?: number | null
          received_dm?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          connection_level: string | null
          created_at: string
          entreprise: string | null
          follower_count: number | null
          headline: string | null
          id: number
          id_linkedin: string | null
          industry: string | null
          last_activity_date: string | null
          location: string | null
          name: string | null
          notes: string | null
          status: string | null
          updated_at: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          connection_level?: string | null
          created_at?: string
          entreprise?: string | null
          follower_count?: number | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          industry?: string | null
          last_activity_date?: string | null
          location?: string | null
          name?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          connection_level?: string | null
          created_at?: string
          entreprise?: string | null
          follower_count?: number | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          industry?: string | null
          last_activity_date?: string | null
          location?: string | null
          name?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      competitors_bapt: {
        Row: {
          connection_level: string | null
          created_at: string
          entreprise: string | null
          follower_count: number | null
          headline: string | null
          id: number
          id_linkedin: string | null
          industry: string | null
          last_activity_date: string | null
          location: string | null
          name: string | null
          notes: string | null
          status: string | null
          updated_at: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          connection_level?: string | null
          created_at?: string
          entreprise?: string | null
          follower_count?: number | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          industry?: string | null
          last_activity_date?: string | null
          location?: string | null
          name?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          connection_level?: string | null
          created_at?: string
          entreprise?: string | null
          follower_count?: number | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          industry?: string | null
          last_activity_date?: string | null
          location?: string | null
          name?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      competitors_imrane: {
        Row: {
          connection_level: string | null
          created_at: string
          entreprise: string | null
          follower_count: number | null
          headline: string | null
          id: number
          id_linkedin: string | null
          industry: string | null
          last_activity_date: string | null
          location: string | null
          name: string | null
          notes: string | null
          status: string | null
          updated_at: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          connection_level?: string | null
          created_at?: string
          entreprise?: string | null
          follower_count?: number | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          industry?: string | null
          last_activity_date?: string | null
          location?: string | null
          name?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          connection_level?: string | null
          created_at?: string
          entreprise?: string | null
          follower_count?: number | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          industry?: string | null
          last_activity_date?: string | null
          location?: string | null
          name?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          connection_status: string | null
          created_at: string
          date: string | null
          dm_status: string | null
          entreprise: string | null
          headline: string | null
          id: number
          id_linkedin: string | null
          name: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          connection_status?: string | null
          created_at?: string
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          name?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          connection_status?: string | null
          created_at?: string
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          name?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      leads_bapt: {
        Row: {
          connection_status: string | null
          created_at: string
          date: string | null
          dm_status: string | null
          entreprise: string | null
          headline: string | null
          id: number
          id_linkedin: string | null
          name: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          connection_status?: string | null
          created_at?: string
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          name?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          connection_status?: string | null
          created_at?: string
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          name?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      leads_imrane: {
        Row: {
          connection_status: string | null
          created_at: string
          date: string | null
          dm_status: string | null
          entreprise: string | null
          headline: string | null
          id: number
          id_linkedin: string | null
          name: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          connection_status?: string | null
          created_at?: string
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          name?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          connection_status?: string | null
          created_at?: string
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id?: number
          id_linkedin?: string | null
          name?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          account_id: string | null
          added_at: string | null
          brouillon: boolean | null
          caption: string | null
          comments_table_name: string | null
          contenu: string | null
          created_at: string | null
          id: number
          keyword: string | null
          lead_magnet: boolean | null
          media: string | null
          media_url: string | null
          message_prefait: string | null
          option_image: string | null
          planifie: boolean | null
          post_url: string | null
          poste: boolean | null
          prompt_image: string | null
          type_post: string | null
          url_lead_magnet: string | null
          urn_post_id: string | null
          written_created_at: string | null
        }
        Insert: {
          account_id?: string | null
          added_at?: string | null
          brouillon?: boolean | null
          caption?: string | null
          comments_table_name?: string | null
          contenu?: string | null
          created_at?: string | null
          id?: number
          keyword?: string | null
          lead_magnet?: boolean | null
          media?: string | null
          media_url?: string | null
          message_prefait?: string | null
          option_image?: string | null
          planifie?: boolean | null
          post_url?: string | null
          poste?: boolean | null
          prompt_image?: string | null
          type_post?: string | null
          url_lead_magnet?: string | null
          urn_post_id?: string | null
          written_created_at?: string | null
        }
        Update: {
          account_id?: string | null
          added_at?: string | null
          brouillon?: boolean | null
          caption?: string | null
          comments_table_name?: string | null
          contenu?: string | null
          created_at?: string | null
          id?: number
          keyword?: string | null
          lead_magnet?: boolean | null
          media?: string | null
          media_url?: string | null
          message_prefait?: string | null
          option_image?: string | null
          planifie?: boolean | null
          post_url?: string | null
          poste?: boolean | null
          prompt_image?: string | null
          type_post?: string | null
          url_lead_magnet?: string | null
          urn_post_id?: string | null
          written_created_at?: string | null
        }
        Relationships: []
      }
      posts_en_ligne_bapt: {
        Row: {
          account_id: string | null
          added_at: string | null
          brouillon: boolean | null
          caption: string | null
          comments_table_name: string | null
          contenu: string | null
          created_at: string | null
          id: number
          keyword: string | null
          lead_magnet: boolean | null
          media: string | null
          media_url: string | null
          message_prefait: string | null
          option_image: string | null
          planifie: boolean | null
          post_url: string | null
          poste: boolean | null
          prompt_image: string | null
          type_post: string | null
          url_lead_magnet: string | null
          urn_post_id: string | null
          written_created_at: string | null
        }
        Insert: {
          account_id?: string | null
          added_at?: string | null
          brouillon?: boolean | null
          caption?: string | null
          comments_table_name?: string | null
          contenu?: string | null
          created_at?: string | null
          id?: number
          keyword?: string | null
          lead_magnet?: boolean | null
          media?: string | null
          media_url?: string | null
          message_prefait?: string | null
          option_image?: string | null
          planifie?: boolean | null
          post_url?: string | null
          poste?: boolean | null
          prompt_image?: string | null
          type_post?: string | null
          url_lead_magnet?: string | null
          urn_post_id?: string | null
          written_created_at?: string | null
        }
        Update: {
          account_id?: string | null
          added_at?: string | null
          brouillon?: boolean | null
          caption?: string | null
          comments_table_name?: string | null
          contenu?: string | null
          created_at?: string | null
          id?: number
          keyword?: string | null
          lead_magnet?: boolean | null
          media?: string | null
          media_url?: string | null
          message_prefait?: string | null
          option_image?: string | null
          planifie?: boolean | null
          post_url?: string | null
          poste?: boolean | null
          prompt_image?: string | null
          type_post?: string | null
          url_lead_magnet?: string | null
          urn_post_id?: string | null
          written_created_at?: string | null
        }
        Relationships: []
      }
      posts_en_ligne_imrane: {
        Row: {
          account_id: string | null
          added_at: string | null
          brouillon: boolean | null
          caption: string | null
          comments_table_name: string | null
          contenu: string | null
          created_at: string | null
          id: number
          keyword: string | null
          lead_magnet: boolean | null
          media: string | null
          media_url: string | null
          message_prefait: string | null
          option_image: string | null
          planifie: boolean | null
          post_url: string | null
          poste: boolean | null
          prompt_image: string | null
          type_post: string | null
          url_lead_magnet: string | null
          urn_post_id: string | null
          written_created_at: string | null
        }
        Insert: {
          account_id?: string | null
          added_at?: string | null
          brouillon?: boolean | null
          caption?: string | null
          comments_table_name?: string | null
          contenu?: string | null
          created_at?: string | null
          id?: number
          keyword?: string | null
          lead_magnet?: boolean | null
          media?: string | null
          media_url?: string | null
          message_prefait?: string | null
          option_image?: string | null
          planifie?: boolean | null
          post_url?: string | null
          poste?: boolean | null
          prompt_image?: string | null
          type_post?: string | null
          url_lead_magnet?: string | null
          urn_post_id?: string | null
          written_created_at?: string | null
        }
        Update: {
          account_id?: string | null
          added_at?: string | null
          brouillon?: boolean | null
          caption?: string | null
          comments_table_name?: string | null
          contenu?: string | null
          created_at?: string | null
          id?: number
          keyword?: string | null
          lead_magnet?: boolean | null
          media?: string | null
          media_url?: string | null
          message_prefait?: string | null
          option_image?: string | null
          planifie?: boolean | null
          post_url?: string | null
          poste?: boolean | null
          prompt_image?: string | null
          type_post?: string | null
          url_lead_magnet?: string | null
          urn_post_id?: string | null
          written_created_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          linkedin_account_id: string | null
          linkedin_url: string | null
          n8n_webhook_url: string | null
          unipile_account_id: string | null
          unipile_api_key: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          linkedin_account_id?: string | null
          linkedin_url?: string | null
          n8n_webhook_url?: string | null
          unipile_account_id?: string | null
          unipile_api_key?: string | null
          updated_at?: string
          user_type: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          linkedin_account_id?: string | null
          linkedin_url?: string | null
          n8n_webhook_url?: string | null
          unipile_account_id?: string | null
          unipile_api_key?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_post_comments_table: {
        Args: { post_id_param: number }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
