-- Insert Workout Plans

-- MUSCLE GAIN - Push/Pull/Legs Split
INSERT INTO workout_plans (goal_type, day_number, day_name, workout_name, duration, exercises, is_premium) VALUES
('Muscle Gain', 0, 'Monday', 'Push Day - Chest, Shoulders, Triceps', 60, 
'[
  {"name": "Bench Press", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "Barbell, controlled movement"},
  {"name": "Incline Dumbbell Press", "sets": 3, "reps": "10-12", "rest": "60s", "notes": "45° angle"},
  {"name": "Shoulder Press", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "Seated or standing"},
  {"name": "Lateral Raises", "sets": 3, "reps": "12-15", "rest": "45s", "notes": "Light weight, strict form"},
  {"name": "Tricep Dips", "sets": 3, "reps": "10-12", "rest": "60s", "notes": "Weighted if possible"},
  {"name": "Cable Tricep Pushdowns", "sets": 3, "reps": "12-15", "rest": "45s", "notes": "Full extension"}
]'::jsonb, false),

('Muscle Gain', 1, 'Tuesday', 'Pull Day - Back, Biceps', 60,
'[
  {"name": "Deadlifts", "sets": 4, "reps": "6-8", "rest": "120s", "notes": "Conventional or sumo"},
  {"name": "Pull-Ups", "sets": 4, "reps": "8-12", "rest": "90s", "notes": "Assisted if needed"},
  {"name": "Barbell Rows", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "Underhand or overhand grip"},
  {"name": "Face Pulls", "sets": 3, "reps": "15-20", "rest": "45s", "notes": "High rep for rear delts"},
  {"name": "Barbell Curls", "sets": 3, "reps": "10-12", "rest": "60s", "notes": "Strict form"},
  {"name": "Hammer Curls", "sets": 3, "reps": "12-15", "rest": "45s", "notes": "Alternate arms"}
]'::jsonb, false),

('Muscle Gain', 2, 'Wednesday', 'Legs - Quads, Hamstrings, Glutes', 70,
'[
  {"name": "Back Squats", "sets": 4, "reps": "8-10", "rest": "120s", "notes": "Deep as possible"},
  {"name": "Romanian Deadlifts", "sets": 4, "reps": "10-12", "rest": "90s", "notes": "Feel the hamstring stretch"},
  {"name": "Leg Press", "sets": 4, "reps": "12-15", "rest": "90s", "notes": "Full range of motion"},
  {"name": "Walking Lunges", "sets": 3, "reps": "12 each leg", "rest": "60s", "notes": "Dumbbells in hands"},
  {"name": "Leg Curls", "sets": 3, "reps": "12-15", "rest": "45s", "notes": "Squeeze at top"},
  {"name": "Calf Raises", "sets": 4, "reps": "15-20", "rest": "45s", "notes": "Full stretch"}
]'::jsonb, true),

('Muscle Gain', 3, 'Thursday', 'Rest Day - Active Recovery', 30,
'[
  {"name": "Light Walking", "sets": 1, "reps": "20-30 mins", "rest": "0s", "notes": "Easy pace"},
  {"name": "Stretching", "sets": 1, "reps": "15 mins", "rest": "0s", "notes": "Full body"},
  {"name": "Foam Rolling", "sets": 1, "reps": "10 mins", "rest": "0s", "notes": "Focus on sore areas"}
]'::jsonb, true);

-- BOOTY BUILD
INSERT INTO workout_plans (goal_type, day_number, day_name, workout_name, duration, exercises, is_premium) VALUES
('Booty Build', 0, 'Monday', 'Glute Activation & Hip Thrusts', 60,
'[
  {"name": "Hip Thrusts", "sets": 5, "reps": "10-12", "rest": "90s", "notes": "Barbell, squeeze glutes at top"},
  {"name": "Bulgarian Split Squats", "sets": 4, "reps": "12 each", "rest": "60s", "notes": "Back foot elevated"},
  {"name": "Romanian Deadlifts", "sets": 4, "reps": "10-12", "rest": "90s", "notes": "Feel glutes engage"},
  {"name": "Cable Kickbacks", "sets": 3, "reps": "15 each", "rest": "45s", "notes": "Squeeze at extension"},
  {"name": "Glute Bridges", "sets": 3, "reps": "20", "rest": "45s", "notes": "Bodyweight, hold top"},
  {"name": "Fire Hydrants", "sets": 3, "reps": "20 each", "rest": "30s", "notes": "Burn out set"}
]'::jsonb, false),

('Booty Build', 1, 'Tuesday', 'Lower Body Power', 65,
'[
  {"name": "Sumo Deadlifts", "sets": 4, "reps": "8-10", "rest": "120s", "notes": "Wide stance for glutes"},
  {"name": "Walking Lunges", "sets": 4, "reps": "12 each", "rest": "60s", "notes": "Heavy dumbbells"},
  {"name": "Leg Press (feet high)", "sets": 4, "reps": "12-15", "rest": "90s", "notes": "Targets glutes"},
  {"name": "Single Leg RDLs", "sets": 3, "reps": "10 each", "rest": "60s", "notes": "Balance and stretch"},
  {"name": "Abductor Machine", "sets": 3, "reps": "15-20", "rest": "45s", "notes": "Slow and controlled"},
  {"name": "Banded Side Steps", "sets": 3, "reps": "20 each way", "rest": "30s", "notes": "Feel the burn"}
]'::jsonb, false);

-- HYROX Training
INSERT INTO workout_plans (goal_type, day_number, day_name, workout_name, duration, exercises, is_premium) VALUES
('HYROX', 0, 'Monday', 'Running Intervals + SkiErg', 60,
'[
  {"name": "Running Intervals", "sets": 10, "reps": "400m", "rest": "90s", "notes": "8-9/10 effort"},
  {"name": "SkiErg", "sets": 8, "reps": "500m", "rest": "60s", "notes": "Consistent pace"},
  {"name": "Burpees", "sets": 5, "reps": "15", "rest": "45s", "notes": "Chest to floor"},
  {"name": "Wall Balls", "sets": 4, "reps": "25", "rest": "60s", "notes": "9ft target"}
]'::jsonb, true),

('HYROX', 1, 'Tuesday', 'Sled Push/Pull + Strength', 65,
'[
  {"name": "Sled Push", "sets": 8, "reps": "20m", "rest": "90s", "notes": "Heavy weight"},
  {"name": "Sled Pull", "sets": 8, "reps": "20m", "rest": "90s", "notes": "Consistent pace"},
  {"name": "Farmers Carry", "sets": 6, "reps": "50m", "rest": "60s", "notes": "Heavy dumbbells"},
  {"name": "Rowing Machine", "sets": 5, "reps": "500m", "rest": "90s", "notes": "Max effort"},
  {"name": "Box Jumps", "sets": 4, "reps": "15", "rest": "45s", "notes": "24 inch box"}
]'::jsonb, true);

-- CROSSFIT
INSERT INTO workout_plans (goal_type, day_number, day_name, workout_name, duration, exercises, is_premium) VALUES
('CrossFit', 0, 'Monday', 'AMRAP - As Many Rounds As Possible', 50,
'[
  {"name": "AMRAP 20 minutes", "sets": 1, "reps": "20 mins", "rest": "0s", "notes": "Score rounds completed"},
  {"name": "Thrusters", "sets": 1, "reps": "10", "rest": "0s", "notes": "43kg/30kg barbell"},
  {"name": "Pull-Ups", "sets": 1, "reps": "15", "rest": "0s", "notes": "Kipping allowed"},
  {"name": "Box Jumps", "sets": 1, "reps": "20", "rest": "0s", "notes": "24/20 inch"},
  {"name": "Burpees", "sets": 1, "reps": "25", "rest": "0s", "notes": "Chest to floor"}
]'::jsonb, true),

('CrossFit', 1, 'Tuesday', 'EMOM - Every Minute On Minute', 48,
'[
  {"name": "EMOM 12 minutes", "sets": 1, "reps": "12 mins", "rest": "0s", "notes": "Alternating movements"},
  {"name": "Min 1: Power Cleans", "sets": 1, "reps": "5", "rest": "0s", "notes": "60kg/40kg"},
  {"name": "Min 2: Toes to Bar", "sets": 1, "reps": "10", "rest": "0s", "notes": "Strict or kipping"},
  {"name": "Min 3: Double Unders", "sets": 1, "reps": "30", "rest": "0s", "notes": "Singles if needed"}
]'::jsonb, true);

-- STRONGMAN
INSERT INTO workout_plans (goal_type, day_number, day_name, workout_name, duration, exercises, is_premium) VALUES
('Strongman', 0, 'Monday', 'Max Strength - Deadlifts & Carries', 70,
'[
  {"name": "Deadlifts", "sets": 5, "reps": "3-5", "rest": "180s", "notes": "90% 1RM"},
  {"name": "Farmers Carry", "sets": 5, "reps": "50m", "rest": "120s", "notes": "Heavy as possible"},
  {"name": "Yoke Walk", "sets": 4, "reps": "20m", "rest": "120s", "notes": "200kg+"},
  {"name": "Tire Flips", "sets": 4, "reps": "8", "rest": "90s", "notes": "Large tire"},
  {"name": "Atlas Stone Lifts", "sets": 5, "reps": "5", "rest": "120s", "notes": "To platform"}
]'::jsonb, true),

('Strongman', 1, 'Tuesday', 'Log Press & Overhead', 65,
'[
  {"name": "Log Press", "sets": 5, "reps": "5", "rest": "180s", "notes": "Clean each rep"},
  {"name": "Axle Bar Overhead Press", "sets": 4, "reps": "8", "rest": "120s", "notes": "Thick bar"},
  {"name": "Sandbag Carry", "sets": 4, "reps": "100m", "rest": "90s", "notes": "Bear hug"},
  {"name": "Sled Drag", "sets": 4, "reps": "50m", "rest": "90s", "notes": "Heavy weight"},
  {"name": "Keg Toss", "sets": 3, "reps": "10", "rest": "60s", "notes": "Over bar"}
]'::jsonb, true);

-- RUNNING
INSERT INTO workout_plans (goal_type, day_number, day_name, workout_name, duration, exercises, is_premium) VALUES
('Running', 0, 'Monday', 'Easy Run - Base Building', 45,
'[
  {"name": "Easy Run", "sets": 1, "reps": "5-6km", "rest": "0s", "notes": "Conversational pace, 6:00-6:30/km"},
  {"name": "Dynamic Stretching", "sets": 1, "reps": "10 mins", "rest": "0s", "notes": "Post-run mobility"}
]'::jsonb, false),

('Running', 1, 'Tuesday', 'Interval Training - Speed Work', 55,
'[
  {"name": "Warm Up", "sets": 1, "reps": "2km", "rest": "0s", "notes": "Easy pace"},
  {"name": "Intervals", "sets": 8, "reps": "400m", "rest": "90s", "notes": "4:30/km pace"},
  {"name": "Cool Down", "sets": 1, "reps": "1km", "rest": "0s", "notes": "Very easy"},
  {"name": "Stretching", "sets": 1, "reps": "10 mins", "rest": "0s", "notes": "Full body"}
]'::jsonb, false),

('Running', 2, 'Wednesday', 'Tempo Run - Threshold', 50,
'[
  {"name": "Warm Up", "sets": 1, "reps": "2km", "rest": "0s", "notes": "Easy pace"},
  {"name": "Tempo", "sets": 1, "reps": "5km", "rest": "0s", "notes": "5:00-5:15/km, comfortably hard"},
  {"name": "Cool Down", "sets": 1, "reps": "1km", "rest": "0s", "notes": "Easy pace"},
  {"name": "Core Work", "sets": 1, "reps": "10 mins", "rest": "0s", "notes": "Plank variations"}
]'::jsonb, true);

-- WEIGHT LOSS
INSERT INTO workout_plans (goal_type, day_number, day_name, workout_name, duration, exercises, is_premium) VALUES
('Weight Loss', 0, 'Monday', 'HIIT Circuit - Full Body', 45,
'[
  {"name": "Jumping Jacks", "sets": 3, "reps": "60s", "rest": "30s", "notes": "Warm up"},
  {"name": "Burpees", "sets": 4, "reps": "20", "rest": "30s", "notes": "Full movement"},
  {"name": "Mountain Climbers", "sets": 4, "reps": "40", "rest": "30s", "notes": "Fast pace"},
  {"name": "Jump Squats", "sets": 4, "reps": "15", "rest": "30s", "notes": "Explosive"},
  {"name": "Push-Ups", "sets": 4, "reps": "15-20", "rest": "30s", "notes": "Modify if needed"},
  {"name": "High Knees", "sets": 4, "reps": "60s", "rest": "30s", "notes": "Max effort"}
]'::jsonb, false),

('Weight Loss', 1, 'Tuesday', 'Cardio & Core', 40,
'[
  {"name": "Running/Treadmill", "sets": 1, "reps": "20 mins", "rest": "0s", "notes": "Steady pace"},
  {"name": "Plank", "sets": 4, "reps": "60s", "rest": "30s", "notes": "Hold position"},
  {"name": "Russian Twists", "sets": 4, "reps": "40", "rest": "30s", "notes": "Weighted"},
  {"name": "Bicycle Crunches", "sets": 4, "reps": "30", "rest": "30s", "notes": "Controlled"},
  {"name": "Leg Raises", "sets": 4, "reps": "15", "rest": "30s", "notes": "Lower slowly"}
]'::jsonb, false),

('Weight Loss', 2, 'Wednesday', 'Strength Circuit', 45,
'[
  {"name": "Goblet Squats", "sets": 4, "reps": "15", "rest": "45s", "notes": "Dumbbell or kettlebell"},
  {"name": "Dumbbell Rows", "sets": 4, "reps": "12 each", "rest": "45s", "notes": "Bent over"},
  {"name": "Lunges", "sets": 4, "reps": "12 each", "rest": "45s", "notes": "Walking or static"},
  {"name": "Shoulder Press", "sets": 4, "reps": "12", "rest": "45s", "notes": "Dumbbells"},
  {"name": "Kettlebell Swings", "sets": 4, "reps": "20", "rest": "45s", "notes": "Hip hinge"}
]'::jsonb, true);