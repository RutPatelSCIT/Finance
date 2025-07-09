export interface HealthMetric {
  id: string;
  date: string;
  value: number;
  unit: string;
  type: MetricType;
}

export type MetricType = 
  | 'weight' 
  | 'bloodPressure' 
  | 'heartRate' 
  | 'steps' 
  | 'sleep' 
  | 'waterIntake'
  | 'calories';

export interface BloodPressureReading {
  systolic: number;
  diastolic: number;
}

export interface Goal {
  id: string;
  type: MetricType;
  target: number;
  unit: string;
  deadline?: string;
  isActive: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
}