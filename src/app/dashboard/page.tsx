'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  ArrowDown,
  ArrowUp,
  Thermometer,
  AlertTriangle,
  Activity,
  BarChart,
  LineChart,
} from 'lucide-react';
import { generateSensorReadings, dailyTrend } from '@/lib/mock-data';
import type { SensorReading } from '@/lib/types';
import { useEffect, useState } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
} from 'recharts';
import { cn } from '@/lib/utils';

const chartConfig = {
  avgTemp: {
    label: 'Avg Temp',
    color: 'hsl(var(--chart-1))',
  },
  maxTemp: {
    label: 'Max Temp',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;


function SensorGrid({ readings }: { readings: SensorReading[] }) {
  const getStatusColor = (status: SensorReading['status']) => {
    switch (status) {
      case 'alert':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-green-500/20 text-green-600 border-green-500/30';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {readings.map((reading) => (
        <div
          key={reading.sensorId}
          className={cn(
            'flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300',
            getStatusColor(reading.status)
          )}
        >
          <span className="text-sm font-medium uppercase">
            {reading.sensorId}
          </span>
          <span className="text-2xl font-bold">
            {reading.temperature.toFixed(1)}°
          </span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [readings, setReadings] = useState<SensorReading[]>([]);

  useEffect(() => {
    setReadings(generateSensorReadings());
    const interval = setInterval(() => {
      setReadings(generateSensorReadings());
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (!readings.length) {
    return <div>Loading sensor data...</div>;
  }

  const temperatures = readings.map((r) => r.temperature);
  const highestTemp = Math.max(...temperatures);
  const lowestTemp = Math.min(...temperatures);
  const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
  const activeAlerts = readings.filter((r) => r.status === 'alert').length;

  return (
    <div className="space-y-8">
       <h1 className="text-2xl md:text-3xl font-bold font-headline">Hi, Jennifer</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Temp</CardTitle>
            <ArrowUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highestTemp.toFixed(2)}°C</div>
            <p className="text-xs text-muted-foreground">
              Current maximum reading
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Temp</CardTitle>
            <ArrowDown className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowestTemp.toFixed(2)}°C</div>
            <p className="text-xs text-muted-foreground">
              Current minimum reading
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Temp</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTemp.toFixed(2)}°C</div>
            <p className="text-xs text-muted-foreground">
              Across all sensors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Sensors in alert status
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity /> Real-Time Sensor Readings
          </CardTitle>
          <CardDescription>
            Live temperature from all 8 sensors. Data refreshes automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SensorGrid readings={readings} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart /> 24-Hour Temperature Trend
          </CardTitle>
          <CardDescription>
            Average temperature readings over the last 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={dailyTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis unit="°C" domain={['dataMin - 1', 'dataMax + 1']} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="avgTemp"
                  type="monotone"
                  stroke="var(--color-avgTemp)"
                  strokeWidth={2}
                  dot={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
