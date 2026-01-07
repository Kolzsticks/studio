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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
      {readings.map((reading) => (
        <div
          key={reading.sensorId}
          className={cn(
            'flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border transition-all duration-300',
            getStatusColor(reading.status)
          )}
        >
          <span className="text-[10px] sm:text-xs font-medium uppercase">
            {reading.sensorId}
          </span>
          <span className="text-lg sm:text-xl font-bold">
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
    <div className="space-y-3 sm:space-y-6">
       <h1 className="text-xl sm:text-3xl font-bold font-headline">Hi, Jennifer</h1>
      <div className="grid gap-2 sm:gap-4 grid-cols-2">
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Highest</CardTitle>
            <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{highestTemp.toFixed(1)}°</div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Lowest</CardTitle>
            <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{lowestTemp.toFixed(1)}°</div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Average</CardTitle>
            <Thermometer className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{avgTemp.toFixed(1)}°</div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{activeAlerts}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5" /> Real-Time Sensors
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Live temperature from all 8 sensors.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <SensorGrid readings={readings} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
            <LineChart className="h-4 w-4 sm:h-5 sm:w-5" /> 24-Hour Trend
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Average temperature over the last 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <ChartContainer config={chartConfig} className="h-[180px] sm:h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={dailyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={9} />
                <YAxis unit="°C" domain={['dataMin - 1', 'dataMax + 1']} fontSize={9} />
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