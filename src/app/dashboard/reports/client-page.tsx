'use client';

import { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Waves, User } from 'lucide-react';
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  LabelList
} from 'recharts';
import type { ScanResult } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

const chartConfig: ChartConfig = {
  ultrasound: {
    label: 'Ultrasound',
    color: 'hsl(var(--chart-1))',
  },
  temperature: {
    label: 'Temperature',
    color: 'hsl(var(--chart-2))',
  },
  bioimpedance: {
    label: 'Bioimpedance',
    color: 'hsl(var(--chart-3))',
  },
};

function TrendChart({ data }: { data: ScanResult[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto -mx-3 sm:mx-0">
      <div className="min-w-[320px] px-3 sm:px-0">
        <ChartContainer config={chartConfig} className="h-[160px] sm:h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={8}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis
                yAxisId="left"
                unit="°C"
                domain={['dataMin - 1', 'dataMax + 1']}
                fontSize={8}
                stroke="var(--color-temperature)"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                unit="mm"
                domain={['dataMin - 0.2', 'dataMax + 0.2']}
                fontSize={8}
                stroke="var(--color-ultrasound)"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Line yAxisId="right" dataKey="readings.ultrasound" name="Ultrasound" type="monotone" stroke="var(--color-ultrasound)" strokeWidth={2} dot={false} />
              <Line yAxisId="left" dataKey="readings.temperature" name="Temperature" type="monotone" stroke="var(--color-temperature)" strokeWidth={2} dot={false} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}

function BioimpedanceReport({ data }: { data: ScanResult[] }) {
    if (!data || data.length === 0) return null;

    const chartData = data.map(scan => ({
        name: new Date(scan.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: scan.readings.bioimpedance
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-xl"><User /> Bioimpedance Analysis</CardTitle>
          <CardDescription className="text-[10px] sm:text-sm">Shows tissue resistance over time. Lower values may warrant attention.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[160px] sm:h-[200px] w-full">
                <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fillBioimpedance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-bioimpedance)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-bioimpedance)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={8} tickMargin={8} />
                        <YAxis unit="Ω" domain={['dataMin - 50', 'dataMax + 50']} fontSize={8}/>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="value" name="Bioimpedance" stroke="var(--color-bioimpedance)" fill="url(#fillBioimpedance)" />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>
    )
}

function UltrasoundReport({ data }: { data: ScanResult[] }) {
    if (!data || data.length === 0) return null;

    const chartData = data.map(scan => ({
        name: new Date(scan.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: scan.readings.ultrasound,
        fill: scan.readings.ultrasound >= 0.7 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-xl"><Waves /> Ultrasound Report</CardTitle>
          <CardDescription className="text-[10px] sm:text-sm">Visualizes tissue density from ultrasound scans. Values ≥ 0.7mm are flagged.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[160px] sm:h-[200px] w-full">
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={8} tickMargin={8} />
                        <YAxis unit="mm" domain={[0, 'dataMax + 0.2']} fontSize={8}/>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="value" name="Ultrasound" radius={[4, 4, 0, 0]}>
                            <LabelList dataKey="value" position="top" offset={5} fontSize={8} formatter={(val: number) => val.toFixed(2)} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>
    )
}


export default function ReportsClientPage() {
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    try {
      const historyData = localStorage.getItem('scanHistory');
      if (historyData) {
        setScanHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error("Failed to load scan history", error);
    }
  }, []);

  const handleExport = () => {
    if (scanHistory.length === 0) return;

    // Create CSV content
    const header = "ScanID,Timestamp,Risk,Ultrasound(mm),Temperature(C),Bioimpedance(ohm)\n";
    const rows = scanHistory.map(scan => 
        `${scan.id},${scan.timestamp},${scan.risk},${scan.readings.ultrasound},${scan.readings.temperature},${scan.readings.bioimpedance}`
    ).join('\n');
    const csvContent = header + rows;

    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "smart-bra-data.csv"); // Although it's CSV, Excel opens it correctly.
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = scanHistory.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="space-y-3 sm:space-y-6 max-w-full overflow-hidden">
      <h1 className="text-lg sm:text-3xl font-bold font-headline">Historical Reports</h1>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-sm sm:text-xl">Overall Scan Trends</CardTitle>
          <CardDescription className="text-[10px] sm:text-sm">
            Weekly and monthly trends of key sensor parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <TrendChart data={filteredHistory} />
        </CardContent>
        <CardFooter className="p-3 sm:p-6">
          <Button variant="outline" size="sm" className="text-[10px] sm:text-sm h-7 sm:h-9" onClick={handleExport}>
            <Download className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Export All Data (Excel)
          </Button>
        </CardFooter>
      </Card>
      
      <UltrasoundReport data={filteredHistory} />
      <BioimpedanceReport data={filteredHistory} />

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-1.5 text-sm sm:text-xl">
            <FileText className="h-3.5 w-3.5 sm:h-5 sm:w-5" /> All Scans Data
          </CardTitle>
          <CardDescription className="text-[10px] sm:text-sm">
            Your detailed metrics from all recorded scans.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[320px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] sm:text-sm pl-3 sm:pl-4">Date</TableHead>
                  <TableHead className="text-right text-[10px] sm:text-sm">Ultrasound</TableHead>
                  <TableHead className="text-right text-[10px] sm:text-sm">Temp.</TableHead>
                  <TableHead className="text-right text-[10px] sm:text-sm">Bioimp.</TableHead>
                  <TableHead className="text-right text-[10px] sm:text-sm pr-3 sm:pr-4">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanHistory.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium whitespace-nowrap text-[10px] sm:text-sm pl-3 sm:pl-4">
                      {new Date(scan.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right text-[10px] sm:text-sm">{scan.readings.ultrasound.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-[10px] sm:text-sm">{scan.readings.temperature.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-[10px] sm:text-sm">{scan.readings.bioimpedance.toFixed(0)}</TableCell>
                    <TableCell className="text-right text-[10px] sm:text-sm pr-3 sm:pr-4">
                        <Badge variant={scan.risk === 'High' ? 'destructive' : 'secondary'}>{scan.risk}</Badge>
                    </TableCell>
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
