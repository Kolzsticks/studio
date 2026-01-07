export type SensorReading = {
  ultrasound: number; // unitless metric
  temperature: number; // in Celsius
  bioimpedance: number; // in Ohms
};

export type ScanResult = {
  id: string;
  timestamp: string; // ISO string
  readings: SensorReading;
  risk: 'Low' | 'High';
}

export type User = {
  name: string;
  age: number;
  weight: number;
  avatarUrl: string;
  familyContacts: FamilyContact[];
};

export type FamilyContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
};

export type HistoricalData = {
  date: string;
  avgDifferential: number;
  peakAsymmetry: number;
  volatility: number;
  alerts: number;
};
