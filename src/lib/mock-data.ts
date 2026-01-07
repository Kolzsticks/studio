import type { User, SensorReading, SensorPosition, HistoricalData, FamilyContact } from './types';
import { subDays, format } from 'date-fns';

export const mockUser: User = {
  id: 'user-123',
  name: 'Jennifer',
  email: 'jennifer@example.com',
  age: 34,
  medicalHistory: 'No significant history. Annual check-ups are regular.',
  threshold: 1.5, // Differential temperature threshold in °C
  pairedDeviceId: 'BRAVA-002',
  avatarUrl: 'https://picsum.photos/seed/user-avatar/100/100',
  familyContacts: [
    { id: 'contact-1', name: 'Michael Smith', relationship: 'Husband', phone: '555-123-4567', email: 'michael@example.com'},
    { id: 'contact-2', name: 'Sarah Johnson', relationship: 'Sister', phone: '555-987-6543', email: 'sarah@example.com'},
  ]
};

const SENSOR_POSITIONS: SensorPosition[] = ['A', 'B', 'C', 'D'];
const NORMAL_TEMP_BASE = 36.5;

export const generateSensorReadings = (isAnomaly: boolean = false): SensorReading[] => {
  const readings: SensorReading[] = [];
  const now = new Date();
  
  const anomalySide = Math.random() > 0.5 ? 'left' : 'right';
  const anomalyPositionIndex = Math.floor(Math.random() * SENSOR_POSITIONS.length);

  ['left', 'right'].forEach(side => {
    SENSOR_POSITIONS.forEach((position, index) => {
      let temp = NORMAL_TEMP_BASE + (Math.random() - 0.5) * 0.8; // Base temp variation

      if (isAnomaly && side === anomalySide && index === anomalyPositionIndex) {
        // Introduce a significant temperature spike for the anomaly
        temp += 1.8 + Math.random() * 0.5;
      } else if (isAnomaly && side === anomalySide) {
        // Introduce smaller spikes on other sensors of the anomaly side
        temp += 0.5 + Math.random() * 0.3;
      }
      
      readings.push({
        side: side as 'left' | 'right',
        position: position,
        temperature: parseFloat(temp.toFixed(2)),
        timestamp: now.toISOString(),
      });
    });
  });

  return readings;
};

export const generateHistoricalData = (days: number): HistoricalData[] => {
  const data: HistoricalData[] = [];
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i);
    const avgDifferential = Math.random() * 1.2;
    const peakAsymmetry = avgDifferential + Math.random() * 0.8;
    const volatility = Math.random() * 0.5;
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      avgDifferential: parseFloat(avgDifferential.toFixed(2)),
      peakAsymmetry: parseFloat(peakAsymmetry.toFixed(2)),
      volatility: parseFloat(volatility.toFixed(2)),
      alerts: Math.random() > 0.8 ? 1 : 0,
    });
  }
  return data.reverse();
};


export const dailyTrend = generateHistoricalData(24).map((d, i) => ({ ...d, date: `${i}:00`}));
export const weeklyTrend = generateHistoricalData(7);
export const monthlyTrend = generateHistoricalData(30);

export const mockDoctor = {
  name: 'Dr. Evelyn Reed',
  specialty: 'Oncology Specialist',
  hospital: 'Unity Health Medical Center',
  avatarUrl: 'https://picsum.photos/seed/doctor1/100/100'
};
