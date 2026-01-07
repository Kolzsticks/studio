export type SensorId = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export type SensorReading = {
  sensorId: SensorId;
  temperature: number; // in Celsius
  timestamp: string; // ISO string
  status: 'normal' | 'warning' | 'alert';
};

export type User = {
  id: string;
  name: string;
  email: string;
  age: number;
  medicalHistory: string;
  threshold: number; // default 1.0°C
  pairedDeviceId?: string;
  avatarUrl: string;
};

export type HistoricalData = {
  date: string;
  maxTemp: number;
  minTemp: number;
  avgTemp: number;
  alerts: number;
};
