export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      arena_matches: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          start_time: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      arena_stats: {
        Row: {
          correct_answers: number
          created_at: string | null
          highest_score: number
          last_match_date: string | null
          matches_played: number
          matches_won: number
          questions_answered: number
          total_score: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          correct_answers?: number
          created_at?: string | null
          highest_score?: number
          last_match_date?: string | null
          matches_played?: number
          matches_won?: number
          questions_answered?: number
          total_score?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          correct_answers?: number
          created_at?: string | null
          highest_score?: number
          last_match_date?: string | null
          matches_played?: number
          matches_won?: number
          questions_answered?: number
          total_score?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      course_bookmarks: {
        Row: {
          course_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcard_reviews: {
        Row: {
          confidence_level: number | null
          flashcard_id: string
          id: string
          response_time_ms: number | null
          review_time: string
          user_id: string
          was_correct: boolean
        }
        Insert: {
          confidence_level?: number | null
          flashcard_id: string
          id?: string
          response_time_ms?: number | null
          review_time?: string
          user_id: string
          was_correct: boolean
        }
        Update: {
          confidence_level?: number | null
          flashcard_id?: string
          id?: string
          response_time_ms?: number | null
          review_time?: string
          user_id?: string
          was_correct?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "fk_flashcard_reviews_flashcards"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcard_reviews_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_statistics: {
        Row: {
          average_interval: number
          cards_due: number
          cards_learned: number
          cards_mastered: number
          correct_reviews: number
          created_at: string
          id: string
          last_study_date: string | null
          retention_rate: number
          streak_days: number
          total_cards: number
          total_reviews: number
          updated_at: string
          user_id: string
        }
        Insert: {
          average_interval?: number
          cards_due?: number
          cards_learned?: number
          cards_mastered?: number
          correct_reviews?: number
          created_at?: string
          id?: string
          last_study_date?: string | null
          retention_rate?: number
          streak_days?: number
          total_cards?: number
          total_reviews?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          average_interval?: number
          cards_due?: number
          cards_learned?: number
          cards_mastered?: number
          correct_reviews?: number
          created_at?: string
          id?: string
          last_study_date?: string | null
          retention_rate?: number
          streak_days?: number
          total_cards?: number
          total_reviews?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          answer: string
          consecutive_correct_answers: number | null
          created_at: string
          easiness_factor: number | null
          id: string
          last_reviewed_at: string | null
          next_review_at: string | null
          question: string
          updated_at: string
          upload_id: string | null
          user_id: string
        }
        Insert: {
          answer: string
          consecutive_correct_answers?: number | null
          created_at?: string
          easiness_factor?: number | null
          id?: string
          last_reviewed_at?: string | null
          next_review_at?: string | null
          question: string
          updated_at?: string
          upload_id?: string | null
          user_id: string
        }
        Update: {
          answer?: string
          consecutive_correct_answers?: number | null
          created_at?: string
          easiness_factor?: number | null
          id?: string
          last_reviewed_at?: string | null
          next_review_at?: string | null
          question?: string
          updated_at?: string
          upload_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "ocr_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          access_code: string | null
          created_at: string
          description: string | null
          end_time: string | null
          features: Json
          host_id: string
          id: string
          is_private: boolean
          max_participants: number
          start_time: string
          status: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          access_code?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          features?: Json
          host_id: string
          id?: string
          is_private?: boolean
          max_participants?: number
          start_time?: string
          status?: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          access_code?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          features?: Json
          host_id?: string
          id?: string
          is_private?: boolean
          max_participants?: number
          start_time?: string
          status?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      match_players: {
        Row: {
          correct_answers: number
          created_at: string | null
          id: string
          match_id: string
          questions_answered: number
          score: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          correct_answers?: number
          created_at?: string | null
          id?: string
          match_id: string
          questions_answered?: number
          score?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          correct_answers?: number
          created_at?: string | null
          id?: string
          match_id?: string
          questions_answered?: number
          score?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "arena_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      ocr_uploads: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          image_url: string
          status: Database["public"]["Enums"]["processing_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          image_url: string
          status?: Database["public"]["Enums"]["processing_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          image_url?: string
          status?: Database["public"]["Enums"]["processing_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      poll_responses: {
        Row: {
          created_at: string | null
          id: string
          poll_id: string
          selected_options: number[]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          poll_id: string
          selected_options: number[]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          poll_id?: string
          selected_options?: number[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_responses_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "session_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          learning_preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          learning_preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          learning_preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          category: string
          correct_answer: string
          created_at: string | null
          difficulty: string
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          updated_at: string | null
        }
        Insert: {
          category: string
          correct_answer: string
          created_at?: string | null
          difficulty: string
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          correct_answer?: string
          created_at?: string | null
          difficulty?: string
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      session_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          session_id: string
          type: string
          user_avatar: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          session_id: string
          type?: string
          user_avatar?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          session_id?: string
          type?: string
          user_avatar?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          is_shared: boolean
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_shared?: boolean
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_shared?: boolean
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          id: string
          is_active: boolean
          joined_at: string
          left_at: string | null
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          joined_at?: string
          left_at?: string | null
          role?: string
          session_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean
          joined_at?: string
          left_at?: string | null
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_polls: {
        Row: {
          allow_multiple_choices: boolean | null
          created_at: string | null
          creator_id: string
          ended_at: string | null
          id: string
          is_active: boolean | null
          options: Json
          question: string
          session_id: string
        }
        Insert: {
          allow_multiple_choices?: boolean | null
          created_at?: string | null
          creator_id: string
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          options: Json
          question: string
          session_id: string
        }
        Update: {
          allow_multiple_choices?: boolean | null
          created_at?: string | null
          creator_id?: string
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json
          question?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_polls_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_whiteboard_paths: {
        Row: {
          brush_size: number
          color: string
          created_at: string
          id: string
          path_data: Json
          session_id: string
          tool: string
          user_id: string
          user_name: string
        }
        Insert: {
          brush_size: number
          color: string
          created_at?: string
          id?: string
          path_data: Json
          session_id: string
          tool: string
          user_id: string
          user_name: string
        }
        Update: {
          brush_size?: number
          color?: string
          created_at?: string
          id?: string
          path_data?: Json
          session_id?: string
          tool?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_whiteboard_paths_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_daily_flashcard_stats: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      update_player_progress: {
        Args: {
          match_id_param: string
          user_id_param: string
          score_to_add: number
          is_correct: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      processing_status: "pending" | "processing" | "completed" | "error"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      processing_status: ["pending", "processing", "completed", "error"],
    },
  },
} as const
