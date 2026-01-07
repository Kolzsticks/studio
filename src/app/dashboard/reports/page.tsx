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
import { Download, FileText } from 'lucide-react';
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
import { dailyTrend, weeklyTrend, monthlyTrend } from '@/lib/mock-data';

const chartConfig: ChartConfig = {
  avgDifferential: {
    label: 'Avg Differential',
    color: 'hsl(var(--chart-1))',
  },
  peakAsymmetry: {
    label: 'Peak Asymmetry',
    color: 'hsl(var(--chart-2))',
  },
};

function TrendChart({ data, period }: { data: any[]; period: 'daily' | 'weekly' | 'monthly' }) {
  const xDataKey = period === 'daily' ? 'date' : 'date';

  return (
    <div className="w-full overflow-x-auto -mx-3 sm:mx-0">
      <div className="min-w-[320px] px-3 sm:px-0">
        <ChartContainer config={chartConfig} className="h-[160px] sm:h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey={xDataKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={8}
                tickFormatter={(value) => {
                  if (period === 'weekly') return new Date(value).toLocaleDateString('en-US', { weekday: 'short' });
                  if (period === 'monthly') return new Date(value).toLocaleDateString('en-US', { day: 'numeric' });
                  return value;
                }}
              />
              <YAxis unit="°C" domain={['dataMin - 0.2', 'dataMax + 0.2']} fontSize={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Line dataKey="avgDifferential" type="monotone" stroke="var(--color-avgDifferential)" strokeWidth={2} dot={false} />
              <Line dataKey="peakAsymmetry" type="monotone" stroke="var(--color-peakAsymmetry)" strokeWidth={2} dot={false} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="space-y-3 sm:space-y-6 max-w-full overflow-hidden">
      <h1 className="text-lg sm:text-3xl font-bold font-headline">Historical Reports</h1>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-sm sm:text-xl">Thermal Differential Trends</CardTitle>
          <CardDescription className="text-[10px] sm:text-sm">
            Daily, weekly, and monthly trends of key thermal parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <Tabs defaultValue="weekly">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="daily" className="text-[10px] sm:text-sm px-1.5 py-1 sm:px-3 sm:py-2">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-[10px] sm:text-sm px-1.5 py-1 sm:px-3 sm:py-2">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-[10px] sm:text-sm px-1.5 py-1 sm:px-3 sm:py-2">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="mt-3 sm:mt-4">
              <TrendChart data={dailyTrend} period="daily" />
            </TabsContent>
            <TabsContent value="weekly" className="mt-3 sm:mt-4">
              <TrendChart data={weeklyTrend} period="weekly" />
            </TabsContent>
            <TabsContent value="monthly" className="mt-3 sm:mt-4">
              <TrendChart data={monthlyTrend} period="monthly" />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="p-3 sm:p-6">
            <Button variant="outline" size="sm" className="text-[10px] sm:text-sm h-7 sm:h-9">
              <Download className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Export All Data
            </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-1.5 text-sm sm:text-xl">
            <FileText className="h-3.5 w-3.5 sm:h-5 sm:w-5" /> Weekly Data Overview
          </CardTitle>
          <CardDescription className="text-[10px] sm:text-sm">
            Your key metrics from the past 7 days.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[280px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] sm:text-sm pl-3 sm:pl-4">Date</TableHead>
                  <TableHead className="text-right text-[10px] sm:text-sm">Avg Diff.</TableHead>
                  <TableHead className="text-right text-[10px] sm:text-sm">Peak Asym.</TableHead>
                  <TableHead className="text-right text-[10px] sm:text-sm pr-3 sm:pr-4">Alerts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyTrend.slice().reverse().map((day) => (
                  <TableRow key={day.date}>
                    <TableCell className="font-medium whitespace-nowrap text-[10px] sm:text-sm pl-3 sm:pl-4">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right text-[10px] sm:text-sm">{day.avgDifferential.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-[10px] sm:text-sm">{day.peakAsymmetry.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-[10px] sm:text-sm pr-3 sm:pr-4">{day.alerts}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
