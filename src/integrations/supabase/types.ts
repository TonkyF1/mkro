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
      challenges: {
        Row: {
          challenge_type: string
          completed_at: string | null
          created_at: string
          current_progress: number
          description: string
          difficulty: string
          end_date: string
          id: string
          start_date: string
          status: string
          target_value: number
          title: string
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          challenge_type: string
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          description: string
          difficulty?: string
          end_date: string
          id?: string
          start_date?: string
          status?: string
          target_value: number
          title: string
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          challenge_type?: string
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          description?: string
          difficulty?: string
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          target_value?: number
          title?: string
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      coach_state: {
        Row: {
          adherence_score: number | null
          created_at: string
          current_phase: Database["public"]["Enums"]["training_phase"] | null
          last_checkin_at: string | null
          next_checkin_at: string | null
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          adherence_score?: number | null
          created_at?: string
          current_phase?: Database["public"]["Enums"]["training_phase"] | null
          last_checkin_at?: string | null
          next_checkin_at?: string | null
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          adherence_score?: number | null
          created_at?: string
          current_phase?: Database["public"]["Enums"]["training_phase"] | null
          last_checkin_at?: string | null
          next_checkin_at?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["event_kind"]
          payload: Json | null
          summary: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["event_kind"]
          payload?: Json | null
          summary: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["event_kind"]
          payload?: Json | null
          summary?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_completions: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          day_name: string
          id: string
          meal_type: string
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          day_name: string
          id?: string
          meal_type: string
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          day_name?: string
          id?: string
          meal_type?: string
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      meal_history: {
        Row: {
          calories: number
          carbs: number
          created_at: string
          fats: number
          id: string
          meal_type: string | null
          name: string
          protein: number
          updated_at: string
          user_id: string
        }
        Insert: {
          calories: number
          carbs: number
          created_at?: string
          fats: number
          id?: string
          meal_type?: string | null
          name: string
          protein: number
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          fats?: number
          id?: string
          meal_type?: string | null
          name?: string
          protein?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          carbs_g: number | null
          created_at: string
          day_index: number
          fat_g: number | null
          id: string
          ingredients: Json
          instructions: string | null
          kcal: number | null
          meal_time: string
          plan_id: string | null
          protein_g: number | null
          recipe_title: string
          tags: string[] | null
          user_id: string
        }
        Insert: {
          carbs_g?: number | null
          created_at?: string
          day_index: number
          fat_g?: number | null
          id?: string
          ingredients?: Json
          instructions?: string | null
          kcal?: number | null
          meal_time: string
          plan_id?: string | null
          protein_g?: number | null
          recipe_title: string
          tags?: string[] | null
          user_id: string
        }
        Update: {
          carbs_g?: number | null
          created_at?: string
          day_index?: number
          fat_g?: number | null
          id?: string
          ingredients?: Json
          instructions?: string | null
          kcal?: number | null
          meal_time?: string
          plan_id?: string | null
          protein_g?: number | null
          recipe_title?: string
          tags?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          bf_pct: number | null
          calories_avg: number | null
          created_at: string
          date: string
          id: string
          notes: string | null
          protein_avg: number | null
          steps: number | null
          user_id: string
          waist_cm: number | null
          weight_kg: number | null
          workouts_done: number | null
        }
        Insert: {
          bf_pct?: number | null
          calories_avg?: number | null
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          protein_avg?: number | null
          steps?: number | null
          user_id: string
          waist_cm?: number | null
          weight_kg?: number | null
          workouts_done?: number | null
        }
        Update: {
          bf_pct?: number | null
          calories_avg?: number | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          protein_avg?: number | null
          steps?: number | null
          user_id?: string
          waist_cm?: number | null
          weight_kg?: number | null
          workouts_done?: number | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string
          end_date: string
          id: string
          payload: Json
          plan_type: Database["public"]["Enums"]["plan_type"]
          start_date: string
          user_id: string
          version: number | null
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          payload?: Json
          plan_type: Database["public"]["Enums"]["plan_type"]
          start_date: string
          user_id: string
          version?: number | null
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          payload?: Json
          plan_type?: Database["public"]["Enums"]["plan_type"]
          start_date?: string
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          allergies: string[] | null
          bodyfat_pct: number | null
          budget_level: string | null
          budget_preference: string | null
          completed_at: string | null
          cooking_time_preference: string | null
          created_at: string
          days_available: Json | null
          diet_prefs: Json | null
          dietary_preferences: string[] | null
          eating_out_frequency: string | null
          equipment: Json | null
          experience_level: string | null
          goal: string | null
          goals: Json | null
          health_conditions: string[] | null
          height: number | null
          height_cm: number | null
          height_unit: string | null
          hydration_goal: number | null
          id: string
          injuries: Json | null
          is_premium: boolean | null
          kitchen_equipment: string[] | null
          meal_frequency: number | null
          meals_per_day: number | null
          motivation_factors: string[] | null
          name: string | null
          sex: string | null
          sleep_hours: number | null
          stress_level: number | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_expiry: string | null
          subscription_status: string | null
          supplement_usage: string[] | null
          target_carbs: number | null
          target_fats: number | null
          target_protein: number | null
          trial_prompts_used: number | null
          trial_start_date: string | null
          updated_at: string
          user_id: string
          weight: number | null
          weight_kg: number | null
          weight_unit: string | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          bodyfat_pct?: number | null
          budget_level?: string | null
          budget_preference?: string | null
          completed_at?: string | null
          cooking_time_preference?: string | null
          created_at?: string
          days_available?: Json | null
          diet_prefs?: Json | null
          dietary_preferences?: string[] | null
          eating_out_frequency?: string | null
          equipment?: Json | null
          experience_level?: string | null
          goal?: string | null
          goals?: Json | null
          health_conditions?: string[] | null
          height?: number | null
          height_cm?: number | null
          height_unit?: string | null
          hydration_goal?: number | null
          id?: string
          injuries?: Json | null
          is_premium?: boolean | null
          kitchen_equipment?: string[] | null
          meal_frequency?: number | null
          meals_per_day?: number | null
          motivation_factors?: string[] | null
          name?: string | null
          sex?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_expiry?: string | null
          subscription_status?: string | null
          supplement_usage?: string[] | null
          target_carbs?: number | null
          target_fats?: number | null
          target_protein?: number | null
          trial_prompts_used?: number | null
          trial_start_date?: string | null
          updated_at?: string
          user_id: string
          weight?: number | null
          weight_kg?: number | null
          weight_unit?: string | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          bodyfat_pct?: number | null
          budget_level?: string | null
          budget_preference?: string | null
          completed_at?: string | null
          cooking_time_preference?: string | null
          created_at?: string
          days_available?: Json | null
          diet_prefs?: Json | null
          dietary_preferences?: string[] | null
          eating_out_frequency?: string | null
          equipment?: Json | null
          experience_level?: string | null
          goal?: string | null
          goals?: Json | null
          health_conditions?: string[] | null
          height?: number | null
          height_cm?: number | null
          height_unit?: string | null
          hydration_goal?: number | null
          id?: string
          injuries?: Json | null
          is_premium?: boolean | null
          kitchen_equipment?: string[] | null
          meal_frequency?: number | null
          meals_per_day?: number | null
          motivation_factors?: string[] | null
          name?: string | null
          sex?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_expiry?: string | null
          subscription_status?: string | null
          supplement_usage?: string[] | null
          target_carbs?: number | null
          target_fats?: number | null
          target_protein?: number | null
          trial_prompts_used?: number | null
          trial_start_date?: string | null
          updated_at?: string
          user_id?: string
          weight?: number | null
          weight_kg?: number | null
          weight_unit?: string | null
        }
        Relationships: []
      }
      recipe_images: {
        Row: {
          attempts: number
          created_at: string | null
          dish: string | null
          file_path: string
          id: string
          ocr_text: string | null
          prompt: string | null
          status: string
        }
        Insert: {
          attempts?: number
          created_at?: string | null
          dish?: string | null
          file_path: string
          id?: string
          ocr_text?: string | null
          prompt?: string | null
          status?: string
        }
        Update: {
          attempts?: number
          created_at?: string | null
          dish?: string | null
          file_path?: string
          id?: string
          ocr_text?: string | null
          prompt?: string | null
          status?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          calories: number
          carbs: number
          created_at: string | null
          dietary_tags: string[]
          fats: number
          id: string
          ingredients: string[]
          instructions: string
          name: string
          prep_time: number
          protein: number
          servings: number
        }
        Insert: {
          calories: number
          carbs: number
          created_at?: string | null
          dietary_tags: string[]
          fats: number
          id?: string
          ingredients: string[]
          instructions: string
          name: string
          prep_time: number
          protein: number
          servings: number
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string | null
          dietary_tags?: string[]
          fats?: number
          id?: string
          ingredients?: string[]
          instructions?: string
          name?: string
          prep_time?: number
          protein?: number
          servings?: number
        }
        Relationships: []
      }
      shopping_results: {
        Row: {
          created_at: string
          estimated_price: number | null
          gram_quantity: number
          id: string
          ingredient_type: string
          product_name: string
          store_availability: Json | null
          store_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_price?: number | null
          gram_quantity: number
          id?: string
          ingredient_type: string
          product_name: string
          store_availability?: Json | null
          store_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_price?: number | null
          gram_quantity?: number
          id?: string
          ingredient_type?: string
          product_name?: string
          store_availability?: Json | null
          store_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          challenges_completed: number
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          level: number
          longest_streak: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          challenges_completed?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          challenges_completed?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_nutrition_plans: {
        Row: {
          created_at: string
          days: Json
          id: string
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          created_at?: string
          days?: Json
          id?: string
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          created_at?: string
          days?: Json
          id?: string
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      weekly_training_plans: {
        Row: {
          created_at: string
          days: Json
          id: string
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          created_at?: string
          days?: Json
          id?: string
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          created_at?: string
          days?: Json
          id?: string
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          created_at: string
          day_index: number
          exercises: Json
          focus: string | null
          id: string
          instructions: string | null
          plan_id: string | null
          rpe_goal: number | null
          session_name: string
          time_min: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          day_index: number
          exercises?: Json
          focus?: string | null
          id?: string
          instructions?: string | null
          plan_id?: string | null
          rpe_goal?: number | null
          session_name: string
          time_min?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          day_index?: number
          exercises?: Json
          focus?: string | null
          id?: string
          instructions?: string | null
          plan_id?: string | null
          rpe_goal?: number | null
          session_name?: string
          time_min?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
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
      event_kind: "checkin" | "plan_update" | "deload" | "injury_adjust"
      plan_type: "training" | "nutrition" | "hybrid"
      training_phase: "base" | "build" | "peak" | "deload"
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
      event_kind: ["checkin", "plan_update", "deload", "injury_adjust"],
      plan_type: ["training", "nutrition", "hybrid"],
      training_phase: ["base", "build", "peak", "deload"],
    },
  },
} as const
