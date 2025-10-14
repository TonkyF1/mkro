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
      achievements: {
        Row: {
          achievement_id: string
          achievement_name: string
          id: string
          points_awarded: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          achievement_name: string
          id?: string
          points_awarded?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          achievement_name?: string
          id?: string
          points_awarded?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_plans: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          payload: Json
          plan_type: string | null
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          payload: Json
          plan_type?: string | null
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          payload?: Json
          plan_type?: string | null
          start_date?: string
          user_id?: string
        }
        Relationships: []
      }
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
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_user: boolean
          message: string
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_user: boolean
          message: string
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_user?: boolean
          message?: string
          tokens_used?: number | null
          user_id?: string
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
      diary_meals: {
        Row: {
          created_at: string | null
          custom_entry: Json | null
          date: string
          id: string
          is_completed: boolean | null
          meal_slot: string
          recipe_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_entry?: Json | null
          date: string
          id?: string
          is_completed?: boolean | null
          meal_slot: string
          recipe_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_entry?: Json | null
          date?: string
          id?: string
          is_completed?: boolean | null
          meal_slot?: string
          recipe_id?: string | null
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
      exercise_logs: {
        Row: {
          calories_burned: number | null
          created_at: string | null
          date: string
          duration_min: number | null
          exercise_id: string | null
          id: string
          notes: string | null
          reps: number | null
          sets: number | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string | null
          date: string
          duration_min?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          calories_burned?: number | null
          created_at?: string | null
          date?: string
          duration_min?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises_library"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises_library: {
        Row: {
          cooldown: string | null
          id: string
          muscle_groups: string[] | null
          tips: string | null
          title: string
          warmup: string | null
          youtube_id: string
        }
        Insert: {
          cooldown?: string | null
          id?: string
          muscle_groups?: string[] | null
          tips?: string | null
          title: string
          warmup?: string | null
          youtube_id: string
        }
        Update: {
          cooldown?: string | null
          id?: string
          muscle_groups?: string[] | null
          tips?: string | null
          title?: string
          warmup?: string | null
          youtube_id?: string
        }
        Relationships: []
      }
      hydration_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          ml: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          ml: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          ml?: number
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
          calories: number | null
          carbs: number | null
          fats: number | null
          id: string
          is_cheat_meal: boolean | null
          is_fakeaway: boolean | null
          logged_at: string | null
          meal_type: string | null
          name: string
          protein: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          fats?: number | null
          id?: string
          is_cheat_meal?: boolean | null
          is_fakeaway?: boolean | null
          logged_at?: string | null
          meal_type?: string | null
          name: string
          protein?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          fats?: number | null
          id?: string
          is_cheat_meal?: boolean | null
          is_fakeaway?: boolean | null
          logged_at?: string | null
          meal_type?: string | null
          name?: string
          protein?: number | null
          user_id?: string
        }
        Relationships: []
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
      payments: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          id: string
          status: string | null
          stripe_payment_id: string | null
          subscription_type: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          stripe_payment_id?: string | null
          subscription_type?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          stripe_payment_id?: string | null
          subscription_type?: string | null
          user_id?: string
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
          age: number | null
          ai_messages_reset_date: string | null
          ai_messages_today: number | null
          created_at: string | null
          diet_type: string | null
          email: string | null
          fitness_level: string | null
          goal: string | null
          height: number | null
          id: string
          is_premium: boolean | null
          level: string | null
          name: string | null
          points: number | null
          streak: number | null
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_status: string | null
          target_calories: number | null
          target_carbs: number | null
          target_fats: number | null
          target_protein: number | null
          updated_at: string | null
          user_id: string
          weight: number | null
          workout_preference: string | null
        }
        Insert: {
          age?: number | null
          ai_messages_reset_date?: string | null
          ai_messages_today?: number | null
          created_at?: string | null
          diet_type?: string | null
          email?: string | null
          fitness_level?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          is_premium?: boolean | null
          level?: string | null
          name?: string | null
          points?: number | null
          streak?: number | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          target_calories?: number | null
          target_carbs?: number | null
          target_fats?: number | null
          target_protein?: number | null
          updated_at?: string | null
          user_id: string
          weight?: number | null
          workout_preference?: string | null
        }
        Update: {
          age?: number | null
          ai_messages_reset_date?: string | null
          ai_messages_today?: number | null
          created_at?: string | null
          diet_type?: string | null
          email?: string | null
          fitness_level?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          is_premium?: boolean | null
          level?: string | null
          name?: string | null
          points?: number | null
          streak?: number | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          target_calories?: number | null
          target_carbs?: number | null
          target_fats?: number | null
          target_protein?: number | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
          workout_preference?: string | null
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
          calories: number | null
          carbs: number | null
          category: string | null
          cook_time: number | null
          created_at: string | null
          description: string | null
          fats: number | null
          id: string
          image_url: string | null
          ingredients: Json | null
          instructions: string | null
          is_premium: boolean | null
          meal_type: string | null
          name: string
          protein: number | null
          servings: number | null
          tags: string[] | null
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          category?: string | null
          cook_time?: number | null
          created_at?: string | null
          description?: string | null
          fats?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: string | null
          is_premium?: boolean | null
          meal_type?: string | null
          name: string
          protein?: number | null
          servings?: number | null
          tags?: string[] | null
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          category?: string | null
          cook_time?: number | null
          created_at?: string | null
          description?: string | null
          fats?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: string | null
          is_premium?: boolean | null
          meal_type?: string | null
          name?: string
          protein?: number | null
          servings?: number | null
          tags?: string[] | null
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
      weekly_reports: {
        Row: {
          ai_raw: Json | null
          badges: string[] | null
          created_at: string | null
          id: string
          suggestions: string | null
          summary: string | null
          user_id: string
          week_end: string
          week_start: string
        }
        Insert: {
          ai_raw?: Json | null
          badges?: string[] | null
          created_at?: string | null
          id?: string
          suggestions?: string | null
          summary?: string | null
          user_id: string
          week_end: string
          week_start: string
        }
        Update: {
          ai_raw?: Json | null
          badges?: string[] | null
          created_at?: string | null
          id?: string
          suggestions?: string | null
          summary?: string | null
          user_id?: string
          week_end?: string
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
      weight_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
      weight_tracking: {
        Row: {
          id: string
          recorded_at: string | null
          user_id: string
          weight: number
        }
        Insert: {
          id?: string
          recorded_at?: string | null
          user_id: string
          weight: number
        }
        Update: {
          id?: string
          recorded_at?: string | null
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string | null
          day_name: string
          day_number: number
          duration: number | null
          exercises: Json | null
          goal_type: string
          id: string
          is_premium: boolean | null
          workout_name: string
        }
        Insert: {
          created_at?: string | null
          day_name: string
          day_number: number
          duration?: number | null
          exercises?: Json | null
          goal_type: string
          id?: string
          is_premium?: boolean | null
          workout_name: string
        }
        Update: {
          created_at?: string | null
          day_name?: string
          day_number?: number
          duration?: number | null
          exercises?: Json | null
          goal_type?: string
          id?: string
          is_premium?: boolean | null
          workout_name?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          calories_burned: number | null
          completed_at: string | null
          duration: number | null
          exercises: Json | null
          id: string
          points_earned: number | null
          user_id: string
          workout_type: string | null
        }
        Insert: {
          calories_burned?: number | null
          completed_at?: string | null
          duration?: number | null
          exercises?: Json | null
          id?: string
          points_earned?: number | null
          user_id: string
          workout_type?: string | null
        }
        Update: {
          calories_burned?: number | null
          completed_at?: string | null
          duration?: number | null
          exercises?: Json | null
          id?: string
          points_earned?: number | null
          user_id?: string
          workout_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_day_totals: {
        Args: { d: string }
        Returns: {
          carbs_g: number
          fat_g: number
          kcal: number
          protein_g: number
        }[]
      }
      fn_toggle_meal_complete: {
        Args: { p_meal: string }
        Returns: {
          carbs_g: number
          fat_g: number
          kcal: number
          protein_g: number
        }[]
      }
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
