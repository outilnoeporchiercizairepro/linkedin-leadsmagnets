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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      competitor_posts_bapt: {
        Row: {
          caption: string | null
          comments_count: number | null
          competitor_id: number
          content_type: string | null
          created_at: string
          id: number
          keywords: string[] | null
          likes_count: number | null
          media_urls: string | null
          post_date: string | null
          post_id_linkedin: string | null
          post_url: string | null
          repost_count: number | null
          title_carousel: string | null
          updated_at: string
          urn_post_id: string | null
        }
        Insert: {
          caption?: string | null
          comments_count?: number | null
          competitor_id: number
          content_type?: string | null
          created_at?: string
          id?: number
          keywords?: string[] | null
          likes_count?: number | null
          media_urls?: string | null
          post_date?: string | null
          post_id_linkedin?: string | null
          post_url?: string | null
          repost_count?: number | null
          title_carousel?: string | null
          updated_at?: string
          urn_post_id?: string | null
        }
        Update: {
          caption?: string | null
          comments_count?: number | null
          competitor_id?: number
          content_type?: string | null
          created_at?: string
          id?: number
          keywords?: string[] | null
          likes_count?: number | null
          media_urls?: string | null
          post_date?: string | null
          post_id_linkedin?: string | null
          post_url?: string | null
          repost_count?: number | null
          title_carousel?: string | null
          updated_at?: string
          urn_post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_posts_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors_bapt"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_posts_imrane: {
        Row: {
          caption: string | null
          comments_count: number | null
          competitor_id: number
          content_type: string | null
          created_at: string
          id: number
          keywords: string[] | null
          likes_count: number | null
          media_urls: string | null
          post_date: string | null
          post_id_linkedin: string | null
          post_url: string | null
          repost_count: number | null
          title_carousel: string | null
          updated_at: string
          urn_post_id: string | null
        }
        Insert: {
          caption?: string | null
          comments_count?: number | null
          competitor_id: number
          content_type?: string | null
          created_at?: string
          id?: number
          keywords?: string[] | null
          likes_count?: number | null
          media_urls?: string | null
          post_date?: string | null
          post_id_linkedin?: string | null
          post_url?: string | null
          repost_count?: number | null
          title_carousel?: string | null
          updated_at?: string
          urn_post_id?: string | null
        }
        Update: {
          caption?: string | null
          comments_count?: number | null
          competitor_id?: number
          content_type?: string | null
          created_at?: string
          id?: number
          keywords?: string[] | null
          likes_count?: number | null
          media_urls?: string | null
          post_date?: string | null
          post_id_linkedin?: string | null
          post_url?: string | null
          repost_count?: number | null
          title_carousel?: string | null
          updated_at?: string
          urn_post_id?: string | null
        }
        Relationships: []
      }
      competitors_bapt: {
        Row: {
          a_propos: string | null
          connection_count: number | null
          created_at: string
          entreprise: string | null
          follower_count: number | null
          headline: string | null
          id: number
          industry: string | null
          last_activity_date: string | null
          location: string | null
          name: string | null
          notes: string | null
          photo_profil: string | null
          posts_table_name: string | null
          public_identifier: string | null
          status: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          a_propos?: string | null
          connection_count?: number | null
          created_at?: string
          entreprise?: string | null
          follower_count?: number | null
          headline?: string | null
          id?: number
          industry?: string | null
          last_activity_date?: string | null
          location?: string | null
          name?: string | null
          notes?: string | null
          photo_profil?: string | null
          posts_table_name?: string | null
          public_identifier?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          a_propos?: string | null
          connection_count?: number | null
          created_at?: string
          entreprise?: string | null
          follower_count?: number | null
          headline?: string | null
          id?: number
          industry?: string | null
          last_activity_date?: string | null
          location?: string | null
          name?: string | null
          notes?: string | null
          photo_profil?: string | null
          posts_table_name?: string | null
          public_identifier?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      competitors_imrane: {
        Row: {
          a_propos: string | null
          connection_count: number | null
          created_at: string
          entreprise: string | null
          follower_count: number | null
          headline: string | null
          id: number
          industry: string | null
          last_activity_date: string | null
          location: string | null
          name: string | null
          notes: string | null
          photo_profil: string | null
          posts_table_name: string | null
          public_identifier: string | null
          status: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          a_propos?: string | null
          connection_count?: number | null
          created_at?: string
          entreprise?: string | null
          follower_count?: number | null
          headline?: string | null
          id?: number
          industry?: string | null
          last_activity_date?: string | null
          location?: string | null
          name?: string | null
          notes?: string | null
          photo_profil?: string | null
          posts_table_name?: string | null
          public_identifier?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          a_propos?: string | null
          connection_count?: number | null
          created_at?: string
          entreprise?: string | null
          follower_count?: number | null
          headline?: string | null
          id?: number
          industry?: string | null
          last_activity_date?: string | null
          location?: string | null
          name?: string | null
          notes?: string | null
          photo_profil?: string | null
          posts_table_name?: string | null
          public_identifier?: string | null
          status?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      "Leads Linkedin_bapt": {
        Row: {
          connection_status: string | null
          date: string | null
          dm_status: string | null
          entreprise: string | null
          headline: string | null
          id_linkedin: string
          name: string | null
          url: string | null
        }
        Insert: {
          connection_status?: string | null
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id_linkedin: string
          name?: string | null
          url?: string | null
        }
        Update: {
          connection_status?: string | null
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id_linkedin?: string
          name?: string | null
          url?: string | null
        }
        Relationships: []
      }
      "Leads Linkedin_imrane": {
        Row: {
          connection_status: string | null
          date: string | null
          dm_status: string | null
          entreprise: string | null
          headline: string | null
          id_linkedin: string
          name: string | null
          url: string | null
        }
        Insert: {
          connection_status?: string | null
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id_linkedin: string
          name?: string | null
          url?: string | null
        }
        Update: {
          connection_status?: string | null
          date?: string | null
          dm_status?: string | null
          entreprise?: string | null
          headline?: string | null
          id_linkedin?: string
          name?: string | null
          url?: string | null
        }
        Relationships: []
      }
      post_comments_10: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_11: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_14: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_15: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_16: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_19: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_20: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_21: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_25: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_26: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_31: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_33: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_7: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      post_comments_9: {
        Row: {
          comment_date: string | null
          connection_request_statut: boolean | null
          created_at: string
          id_comment_primary: string
          linkedin_id: string
          linkedin_title: string | null
          linkedin_url: string | null
          person_name: string | null
          received_dm: boolean | null
        }
        Insert: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Update: {
          comment_date?: string | null
          connection_request_statut?: boolean | null
          created_at?: string
          id_comment_primary?: string
          linkedin_id?: string
          linkedin_title?: string | null
          linkedin_url?: string | null
          person_name?: string | null
          received_dm?: boolean | null
        }
        Relationships: []
      }
      "Posts En Ligne_bapt": {
        Row: {
          added_at: string | null
          B2B_ou_B2C: string | null
          Caption: string | null
          comments_table_name: string | null
          id: number
          keyword: string | null
          leadmagnet: boolean | null
          media: string | null
          Post_id: number | null
          post_url: string | null
          table_exist: boolean | null
          type_post: string | null
          Url_lead_magnet: string | null
          urn_post_id: string | null
        }
        Insert: {
          added_at?: string | null
          B2B_ou_B2C?: string | null
          Caption?: string | null
          comments_table_name?: string | null
          id?: number
          keyword?: string | null
          leadmagnet?: boolean | null
          media?: string | null
          Post_id?: number | null
          post_url?: string | null
          table_exist?: boolean | null
          type_post?: string | null
          Url_lead_magnet?: string | null
          urn_post_id?: string | null
        }
        Update: {
          added_at?: string | null
          B2B_ou_B2C?: string | null
          Caption?: string | null
          comments_table_name?: string | null
          id?: number
          keyword?: string | null
          leadmagnet?: boolean | null
          media?: string | null
          Post_id?: number | null
          post_url?: string | null
          table_exist?: boolean | null
          type_post?: string | null
          Url_lead_magnet?: string | null
          urn_post_id?: string | null
        }
        Relationships: []
      }
      "Posts En Ligne_imrane": {
        Row: {
          added_at: string | null
          B2B_ou_B2C: string | null
          caption: string | null
          comments_table_name: string | null
          id: number
          keyword: string | null
          leadmagnet: boolean | null
          media: string | null
          post_id: number | null
          post_url: string | null
          table_exist: boolean | null
          type_post: string | null
          url_lead_magnet: string | null
          urn_post_id: string | null
        }
        Insert: {
          added_at?: string | null
          B2B_ou_B2C?: string | null
          caption?: string | null
          comments_table_name?: string | null
          id?: number
          keyword?: string | null
          leadmagnet?: boolean | null
          media?: string | null
          post_id?: number | null
          post_url?: string | null
          table_exist?: boolean | null
          type_post?: string | null
          url_lead_magnet?: string | null
          urn_post_id?: string | null
        }
        Update: {
          added_at?: string | null
          B2B_ou_B2C?: string | null
          caption?: string | null
          comments_table_name?: string | null
          id?: number
          keyword?: string | null
          leadmagnet?: boolean | null
          media?: string | null
          post_id?: number | null
          post_url?: string | null
          table_exist?: boolean | null
          type_post?: string | null
          url_lead_magnet?: string | null
          urn_post_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
          user_type: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
          user_type: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
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
      count_comments_by_status: {
        Args: { p_table_name: string }
        Returns: Json
      }
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
