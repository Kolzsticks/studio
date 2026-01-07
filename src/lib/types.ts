export type SensorSide = 'left' | 'right';
export type SensorPosition = 'A' | 'B' | 'C' | 'D'; // 4 sensors per side

export type SensorReading = {
  side: SensorSide;
  position: SensorPosition;
  temperature: number; // in Celsius
  timestamp: string; // ISO string
};

export type User = {
  id: string;
  name: string;
  email: string;
  age: number;
  medicalHistory: string;
  threshold: number; // differential threshold
  pairedDeviceId?: string;
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
