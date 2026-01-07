import type { User, HistoricalData, FamilyContact, ScanResult, SensorReading } from './types';
import { subDays, format } from 'date-fns';

export const mockUser: User = {
  name: 'Jennifer',
  age: 34,
  weight: 65,
  avatarUrl: 'https://picsum.photos/seed/user-avatar/100/100',
  familyContacts: [
    { id: 'contact-1', name: 'Michael Smith', relationship: 'Husband', phone: '555-123-4567', email: 'michael@example.com'},
    { id: 'contact-2', name: 'Sarah Johnson', relationship: 'Sister', phone: '555-987-6543', email: 'sarah@example.com'},
  ]
};

export const generateSensorReadings = (isAnomaly: boolean = false): SensorReading => {
  let temperature = 36.5 + (Math.random() - 0.5) * 0.8;
  let bioimpedance = 500 + (Math.random() - 0.5) * 50;
  let ultrasound = Math.random() * 0.5;

  if (isAnomaly) {
    temperature += 1.8 + Math.random() * 0.5;
    bioimpedance -= 100 + Math.random() * 50; // Lower impedance can be a sign
    ultrasound += 0.4 + Math.random() * 0.2; // Higher value for density
  }

  return {
    temperature: parseFloat(temperature.toFixed(2)),
    bioimpedance: parseFloat(bioimpedance.toFixed(2)),
    ultrasound: parseFloat(ultrasound.toFixed(2)),
  };
};

export const calculateRisk = (readings: SensorReading): 'Low' | 'High' => {
  // Simplified risk logic based on ultrasound value
  return readings.ultrasound >= 0.7 ? 'High' : 'Low';
};

export const generateNewScan = (isAnomaly: boolean = false): ScanResult => {
    const readings = generateSensorReadings(isAnomaly);
    const risk = calculateRisk(readings);
    return {
        id: `scan_${new Date().getTime()}`,
        timestamp: new Date().toISOString(),
        readings,
        risk
    }
}


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
