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
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          allergies: string[] | null
          budget_preference: string | null
          completed_at: string | null
          cooking_time_preference: string | null
          created_at: string
          dietary_preferences: string[] | null
          eating_out_frequency: string | null
          goal: string | null
          health_conditions: string[] | null
          height: number | null
          height_unit: string | null
          hydration_goal: number | null
          id: string
          is_premium: boolean | null
          kitchen_equipment: string[] | null
          meal_frequency: number | null
          motivation_factors: string[] | null
          name: string | null
          sleep_hours: number | null
          stress_level: number | null
          supplement_usage: string[] | null
          target_carbs: number | null
          target_fats: number | null
          target_protein: number | null
          trial_prompts_used: number | null
          trial_start_date: string | null
          updated_at: string
          user_id: string
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          budget_preference?: string | null
          completed_at?: string | null
          cooking_time_preference?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          eating_out_frequency?: string | null
          goal?: string | null
          health_conditions?: string[] | null
          height?: number | null
          height_unit?: string | null
          hydration_goal?: number | null
          id?: string
          is_premium?: boolean | null
          kitchen_equipment?: string[] | null
          meal_frequency?: number | null
          motivation_factors?: string[] | null
          name?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          supplement_usage?: string[] | null
          target_carbs?: number | null
          target_fats?: number | null
          target_protein?: number | null
          trial_prompts_used?: number | null
          trial_start_date?: string | null
          updated_at?: string
          user_id: string
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          budget_preference?: string | null
          completed_at?: string | null
          cooking_time_preference?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          eating_out_frequency?: string | null
          goal?: string | null
          health_conditions?: string[] | null
          height?: number | null
          height_unit?: string | null
          hydration_goal?: number | null
          id?: string
          is_premium?: boolean | null
          kitchen_equipment?: string[] | null
          meal_frequency?: number | null
          motivation_factors?: string[] | null
          name?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          supplement_usage?: string[] | null
          target_carbs?: number | null
          target_fats?: number | null
          target_protein?: number | null
          trial_prompts_used?: number | null
          trial_start_date?: string | null
          updated_at?: string
          user_id?: string
          weight?: number | null
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
