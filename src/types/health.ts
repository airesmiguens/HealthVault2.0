export interface HealthData {
  conditions?: HealthItem[];
  medications?: HealthItem[];
  vaccines?: HealthItem[];
  dates?: DateItem[];
  allergies?: HealthItem[];
  vitals?: VitalItem[];
}

export interface HealthItem {
  name: string;
  date?: string;
  details?: string;
  confidence: number;
}

export interface DateItem {
  date: string;
  context: string;
  type: 'appointment' | 'procedure' | 'vaccination' | 'prescription' | 'other';
}

export interface VitalItem {
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'weight' | 'height' | 'bmi';
  value: string;
  unit: string;
  date?: string;
} 