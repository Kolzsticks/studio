'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, FileText, Bot, Loader2 } from 'lucide-react';
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
import { dailyTrend, weeklyTrend, monthlyTrend, generateSensorReadings, mockUser } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { generateHealthReportSummary, GenerateHealthReportSummaryOutput } from '@/ai/flows/generate-health-report-summary';

const chartConfig: ChartConfig = {
  avgTemp: {
    label: 'Avg Temp',
    color: 'hsl(var(--chart-1))',
  },
  maxTemp: {
    label: 'Max Temp',
    color: 'hsl(var(--chart-2))',
  },
};

function TrendChart({ data, period }: { data: any[]; period: 'daily' | 'weekly' | 'monthly' }) {
  const xDataKey = period === 'daily' ? 'date' : 'date';

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xDataKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              if (period === 'weekly') return new Date(value).toLocaleDateString('en-US', { weekday: 'short' });
              if (period === 'monthly') return new Date(value).toLocaleDateString('en-US', { day: 'numeric' });
              return value;
            }}
          />
          <YAxis unit="°C" domain={['dataMin - 1', 'dataMax + 1']} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Line dataKey="avgTemp" type="monotone" stroke="var(--color-avgTemp)" strokeWidth={2} dot={false} />
          <Line dataKey="maxTemp" type="monotone" stroke="var(--color-maxTemp)" strokeWidth={2} dot={false} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default function ReportsPage() {
    const { toast } = useToast();
    const [summary, setSummary] = useState<GenerateHealthReportSummaryOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateSummary = async () => {
        setIsLoading(true);
        setSummary(null);
        try {
            const readings = generateSensorReadings();
            const result = await generateHealthReportSummary({
                sensorReadings: readings.map(({sensorId, temperature, timestamp}) => ({sensorId, temperature, timestamp})),
                userMedicalHistory: mockUser.medicalHistory,
                threshold: mockUser.threshold,
            });
            setSummary(result);
            toast({
                title: 'Success',
                description: 'AI health report summary generated.',
            });
        } catch (error) {
            console.error('Failed to generate summary:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not generate AI summary. Please try again.',
            });
        }
        setIsLoading(false);
    };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Health Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Temperature Trends</CardTitle>
          <CardDescription>
            View daily, weekly, and monthly temperature trends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <TrendChart data={dailyTrend} period="daily" />
            </TabsContent>
            <TabsContent value="weekly">
              <TrendChart data={weeklyTrend} period="weekly" />
            </TabsContent>
            <TabsContent value="monthly">
              <TrendChart data={monthlyTrend} period="monthly" />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-end">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export as PDF</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot /> AI-Powered Report Summary</CardTitle>
          <CardDescription>
            Generate a concise summary of your recent health data using AI. This can be shared with healthcare professionals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center p-8 rounded-lg border border-dashed">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <p className="text-muted-foreground">Generating your report...</p>
            </div>
          )}
          {summary && (
             <div className="p-4 bg-secondary rounded-lg border">
                <p className="text-sm text-foreground">{summary.summary}</p>
             </div>
          )}
          {!isLoading && !summary && (
             <div className="flex items-center justify-center p-8 rounded-lg border border-dashed">
                <p className="text-muted-foreground">Your AI summary will appear here.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
            <Button onClick={handleGenerateSummary} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Summary'}
            </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText /> Historical Data</CardTitle>
          <CardDescription>
            A log of your key metrics from the past week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Max Temp (°C)</TableHead>
                <TableHead className="text-right">Min Temp (°C)</TableHead>
                <TableHead className="text-right">Avg Temp (°C)</TableHead>
                <TableHead className="text-right">Alerts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklyTrend.slice().reverse().map((day) => (
                <TableRow key={day.date}>
                  <TableCell className="font-medium">{new Date(day.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</TableCell>
                  <TableCell className="text-right">{day.maxTemp}</TableCell>
                  <TableCell className="text-right">{day.minTemp}</TableCell>
                  <TableCell className="text-right">{day.avgTemp}</TableCell>
                  <TableCell className="text-right">{day.alerts}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
