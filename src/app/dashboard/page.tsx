'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Activity,
  Thermometer,
  Waves,
  Zap,
  Bot,
  Loader2,
  HeartPulse,
  Siren,
} from 'lucide-react';
import { generateSensorReadings, mockUser } from '@/lib/mock-data';
import type { SensorReading } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { diagnoseBreastCancerRisk, DiagnoseBreastCancerRiskOutput } from '@/ai/flows/diagnose-breast-cancer-risk';
import { useToast } from '@/hooks/use-toast';

function calculateMetrics(readings: SensorReading[]) {
  const leftReadings = readings.filter(r => r.side === 'left').sort((a,b) => a.position.localeCompare(b.position));
  const rightReadings = readings.filter(r => r.side === 'right').sort((a,b) => a.position.localeCompare(b.position));

  if (leftReadings.length !== rightReadings.length) {
    return { differentials: [], avgDifferential: 0, peakAsymmetry: 0, volatility: 0 };
  }

  const differentials = leftReadings.map((left, i) => {
    const right = rightReadings[i];
    return {
      position: left.position,
      leftTemp: left.temperature,
      rightTemp: right.temperature,
      diff: Math.abs(left.temperature - right.temperature),
    }
  });

  const diffValues = differentials.map(d => d.diff);
  const avgDifferential = diffValues.reduce((a, b) => a + b, 0) / diffValues.length;
  const peakAsymmetry = Math.max(...diffValues);
  
  const mean = avgDifferential;
  const variance = diffValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / diffValues.length;
  const volatility = Math.sqrt(variance);

  return { differentials, avgDifferential, peakAsymmetry, volatility };
}


function SensorCompareGrid({ differentials, threshold }: { differentials: any[], threshold: number }) {
  const getStatusColor = (diff: number) => {
    if (diff >= threshold) return 'bg-red-500/20 text-red-500 border-red-500/30';
    if (diff >= threshold * 0.7) return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    return 'bg-green-500/20 text-green-600 border-green-500/30';
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {differentials.map((d) => (
        <div key={d.position} className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-3">
             <h3 className="text-sm font-semibold text-center mb-2">Sensor {d.position}</h3>
             <div className="flex justify-around text-sm">
               <div className="text-center">
                 <p className="text-xs text-muted-foreground">Left</p>
                 <p className="font-bold">{d.leftTemp.toFixed(1)}°</p>
               </div>
               <div className="text-center">
                 <p className="text-xs text-muted-foreground">Right</p>
                 <p className="font-bold">{d.rightTemp.toFixed(1)}°</p>
               </div>
             </div>
          </div>
           <div className={cn('p-2 border-t text-center', getStatusColor(d.diff))}>
              <p className="text-xs font-medium">Differential</p>
              <p className="font-bold text-lg">{d.diff.toFixed(2)}°</p>
           </div>
        </div>
      ))}
    </div>
  );
}

function AiAnalysis() {
  const { toast } = useToast();
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [analysis, setAnalysis] = useState<DiagnoseBreastCancerRiskOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const metrics = useMemo(() => calculateMetrics(readings), [readings]);

  const handleRunAnalysis = async (isAnomaly: boolean) => {
    setIsLoading(true);
    setAnalysis(null);
    const newReadings = generateSensorReadings(isAnomaly);
    setReadings(newReadings);

    try {
      const result = await diagnoseBreastCancerRisk({
        sensorReadings: newReadings.map(({ side, position, temperature, timestamp }) => ({ side, position, temperature, timestamp })),
        user: mockUser,
      });
      setAnalysis(result);
      toast({
        title: 'Analysis Complete',
        description: `Risk assessment has been generated.`,
        variant: result.riskLevel === 'High' ? 'destructive' : 'default',
      });
    } catch (error) {
      console.error('Failed to run analysis:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not run AI analysis. Please try again.',
      });
    }
    setIsLoading(false);
  };
  
  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'destructive';
      case 'Moderate': return 'secondary';
      default: return 'default';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot /> AI-Powered Risk Analysis</CardTitle>
        <CardDescription>
          Analyzes thermal differentials to detect potential signs of breast cancer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button onClick={() => handleRunAnalysis(false)} disabled={isLoading} variant="outline">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HeartPulse className="mr-2 h-4 w-4" />} 
                Run Normal Analysis
            </Button>
            <Button onClick={() => handleRunAnalysis(true)} disabled={isLoading} variant="destructive">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Siren className="mr-2 h-4 w-4" />}
                Simulate Anomaly
            </Button>
        </div>
        {isLoading && (
            <div className="flex items-center justify-center p-8 rounded-lg border border-dashed">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <p className="text-muted-foreground">Analyzing thermal data...</p>
            </div>
        )}
        {analysis && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Analysis Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Risk Level</span>
                        <Badge variant={getRiskBadgeVariant(analysis.riskLevel)} className="text-base">{analysis.riskLevel}</Badge>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-semibold">Summary</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">{analysis.summary}</p>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-semibold">Recommendation</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">{analysis.recommendation}</p>
                    </div>
                </CardContent>
                 {analysis.riskLevel === 'High' && (
                  <CardFooter className="bg-destructive/10">
                    <div className="flex items-start gap-3">
                      <Siren className="h-5 w-5 text-destructive flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-destructive">Family Alert Triggered</h4>
                        <p className="text-sm text-destructive/80">
                         {mockUser.familyContacts.map(c => c.name).join(' and ')} have been notified of this high-risk result.
                        </p>
                      </div>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [readings, setReadings] = useState<SensorReading[]>([]);

  useEffect(() => {
    setReadings(generateSensorReadings());
  }, []);

  const { differentials, avgDifferential, peakAsymmetry, volatility } = useMemo(() => calculateMetrics(readings), [readings]);
  const hasAlert = peakAsymmetry >= mockUser.threshold;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
       <h1 className="text-xl sm:text-3xl font-bold font-headline">Hi, {mockUser.name}</h1>
      
       {hasAlert && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
              <h3 className="font-bold text-destructive">High Thermal Asymmetry Detected!</h3>
              <p className="text-sm text-destructive/80">
                A temperature differential of {peakAsymmetry.toFixed(2)}°C has exceeded your threshold. Please run the AI analysis.
              </p>
            </div>
          </div>
       )}

      <div className="grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5 sm:p-3 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-sm font-medium">Avg Differential</CardTitle>
            <Thermometer className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2.5 pt-0 sm:p-3 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold">{avgDifferential.toFixed(2)}°</div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5 sm:p-3 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-sm font-medium">Peak Asymmetry</CardTitle>
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2.5 pt-0 sm:p-3 sm:pt-0">
            <div className={cn("text-lg sm:text-2xl font-bold", peakAsymmetry >= mockUser.threshold ? "text-destructive" : "")}>
              {peakAsymmetry.toFixed(2)}°
            </div>
          </CardContent>
        </Card>
        <Card className="p-0 col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5 sm:p-3 sm:pb-2">
            <CardTitle className="text-[11px] sm:text-sm font-medium">Thermal Volatility</CardTitle>
            <Waves className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2.5 pt-0 sm:p-3 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold">{volatility.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-1.5 text-sm sm:text-xl">
            <Activity className="h-3.5 w-3.5 sm:h-5 sm:w-5" /> Comparative Sensor Analysis
          </CardTitle>
          <CardDescription className="text-[10px] sm:text-sm">
            Live thermal differential between left and right breast sensors.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <SensorCompareGrid differentials={differentials} threshold={mockUser.threshold} />
        </CardContent>
      </Card>

      <AiAnalysis />
    </div>
  );
}
