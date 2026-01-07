import type { User, SensorReading, SensorId, HistoricalData } from './types';
import { subDays, format } from 'date-fns';

export const mockUser: User = {
  id: 'user-123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  age: 34,
  medicalHistory: 'No significant history. Annual check-ups are regular.',
  threshold: 1.0,
  pairedDeviceId: 'BRAVA-001',
  avatarUrl: 'https://picsum.photos/seed/user-avatar/100/100'
};

const SENSOR_IDS: SensorId[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const NORMAL_TEMP_BASE = 36.5;

export const generateSensorReadings = (): SensorReading[] => {
  const readings: SensorReading[] = [];
  const now = new Date();
  
  // Introduce a random anomaly
  const anomalySensorIndex = Math.floor(Math.random() * SENSOR_IDS.length);
  const hasAnomaly = Math.random() > 0.7; // 30% chance of anomaly

  for (let i = 0; i < SENSOR_IDS.length; i++) {
    const id = SENSOR_IDS[i];
    let temp = NORMAL_TEMP_BASE + (Math.random() - 0.5) * 0.4; // between 36.3 and 36.7

    if (hasAnomaly && i === anomalySensorIndex) {
      temp += 1.2; // create a temperature spike
    }

    const status: SensorReading['status'] = Math.abs(temp - NORMAL_TEMP_BASE) >= mockUser.threshold
      ? 'alert'
      : Math.abs(temp - NORMAL_TEMP_BASE) >= mockUser.threshold - 0.5
      ? 'warning'
      : 'normal';

    readings.push({
      sensorId: id,
      temperature: parseFloat(temp.toFixed(2)),
      timestamp: now.toISOString(),
      status: status,
    });
  }
  return readings;
};

export const generateHistoricalData = (days: number): HistoricalData[] => {
  const data: HistoricalData[] = [];
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i);
    const maxTemp = NORMAL_TEMP_BASE + 0.5 + Math.random() * 1.5;
    const minTemp = NORMAL_TEMP_BASE - 0.2 - Math.random() * 0.3;
    const avgTemp = (maxTemp + minTemp) / 2;
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      maxTemp: parseFloat(maxTemp.toFixed(2)),
      minTemp: parseFloat(minTemp.toFixed(2)),
      avgTemp: parseFloat(avgTemp.toFixed(2)),
      alerts: Math.floor(Math.random() * 3),
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
}
