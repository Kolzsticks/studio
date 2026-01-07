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
    <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xDataKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={10}
            tickFormatter={(value) => {
              if (period === 'weekly') return new Date(value).toLocaleDateString('en-US', { weekday: 'short' });
              if (period === 'monthly') return new Date(value).toLocaleDateString('en-US', { day: 'numeric' });
              return value;
            }}
          />
          <YAxis unit="°C" domain={['dataMin - 1', 'dataMax + 1']} fontSize={10} />
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <h1 className="text-2xl sm:text-3xl font-bold font-headline">Health Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Temperature Trends</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Daily, weekly, and monthly trends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="daily" className="text-xs sm:text-sm">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs sm:text-sm">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs sm:text-sm">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="mt-4">
              <TrendChart data={dailyTrend} period="daily" />
            </TabsContent>
            <TabsContent value="weekly" className="mt-4">
              <TrendChart data={weeklyTrend} period="weekly" />
            </TabsContent>
            <TabsContent value="monthly" className="mt-4">
              <TrendChart data={monthlyTrend} period="monthly" />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm"><Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Export</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><Bot className="h-4 w-4 sm:h-5 sm:w-5" /> AI Report Summary</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Generate a summary of your recent health data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center p-6 sm:p-8 rounded-lg border border-dashed">
                <Loader2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                <p className="text-sm text-muted-foreground">Generating...</p>
            </div>
          )}
          {summary && (
             <div className="p-3 sm:p-4 bg-secondary rounded-lg border">
                <p className="text-xs sm:text-sm text-foreground">{summary.summary}</p>
             </div>
          )}
          {!isLoading && !summary && (
             <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-lg border border-dashed text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">Your AI summary will appear here.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
            <Button onClick={handleGenerateSummary} disabled={isLoading} size="sm" className="text-xs sm:text-sm">
                {isLoading ? <><Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> Generating...</> : 'Generate Summary'}
            </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><FileText className="h-4 w-4 sm:h-5 sm:w-5" /> Historical Data</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Your key metrics from the past week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="px-6 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Date</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Max</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Avg</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Alerts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklyTrend.slice().reverse().map((day) => (
                    <TableRow key={day.date}>
                      <TableCell className="font-medium whitespace-nowrap text-xs sm:text-sm">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</TableCell>
                      <TableCell className="text-right text-xs sm:text-sm">{day.maxTemp.toFixed(1)}</TableCell>
                      <TableCell className="text-right text-xs sm:text-sm">{day.avgTemp.toFixed(1)}</TableCell>
                      <TableCell className="text-right text-xs sm:text-sm">{day.alerts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}