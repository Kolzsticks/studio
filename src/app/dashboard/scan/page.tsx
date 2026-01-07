'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanLine, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateNewScan, calculateRisk, type ScanResult } from '@/lib/mock-data';

type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';

export default function ScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const startScan = (isAnomaly: boolean) => {
    setStatus('scanning');
    setScanResult(null);

    setTimeout(() => {
      try {
        const result = generateNewScan(isAnomaly);
        setScanResult(result);
        setStatus('complete');
        
        // Save to localStorage
        const historyData = localStorage.getItem('scanHistory');
        const history = historyData ? JSON.parse(historyData) : [];
        const newHistory = [result, ...history];
        localStorage.setItem('scanHistory', JSON.stringify(newHistory));
        
        toast({
          title: 'Scan Complete!',
          description: `Risk level identified as ${result.risk}.`,
          variant: result.risk === 'High' ? 'destructive' : 'default',
        });

      } catch (e) {
        setStatus('error');
        toast({
          variant: 'destructive',
          title: 'Scan Failed',
          description: 'Could not complete the scan. Please try again.',
        });
      }
    }, 4000); // Simulate scan duration
  };

  const ScanView = () => {
    switch (status) {
      case 'scanning':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative w-48 h-48">
              <ScanLine className="absolute inset-0 m-auto h-full w-full text-primary opacity-20" />
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 animate-[scan-vertical_4s_ease-in-out_infinite]" />
            </div>
            <h2 className="text-2xl font-bold">Scanning...</h2>
            <p className="text-muted-foreground">Please remain still. This will take a moment.</p>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
      case 'complete':
        if (!scanResult) return null;
        const isHighRisk = scanResult.risk === 'High';
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            {isHighRisk ? (
              <AlertTriangle className="h-16 w-16 text-destructive" />
            ) : (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            <h2 className={cn("text-3xl font-bold", isHighRisk ? "text-destructive" : "text-green-500")}>
              {isHighRisk ? "High Risk Detected" : "Low Risk"}
            </h2>
            <p className="text-muted-foreground max-w-sm">
              {isHighRisk
                ? "Your scan indicates unusual readings. We recommend reviewing the report and consulting a specialist."
                : "Your scan appears normal. Continue with regular monitoring."}
            </p>
          </div>
        );
      case 'error':
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <XCircle className="h-16 w-16 text-destructive" />
                <h2 className="text-2xl font-bold text-destructive">Scan Failed</h2>
                <p className="text-muted-foreground">An error occurred during the scan. Please try again.</p>
            </div>
        );
      case 'idle':
      default:
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <ScanLine className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-bold">Ready to Start</h2>
            <p className="text-muted-foreground">Click a button below to begin a new scan.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Scan</CardTitle>
          <CardDescription>
            Initiate a new scan to get real-time analysis of your breast health.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px] bg-secondary/30 rounded-lg">
          <ScanView />
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-6">
          {status === 'idle' || status === 'error' ? (
            <>
                <Button onClick={() => startScan(false)} size="lg" className="w-full sm:w-auto">Start Normal Scan</Button>
                <Button onClick={() => startScan(true)} size="lg" variant="destructive" className="w-full sm:w-auto">Simulate Anomaly</Button>
            </>
          ) : status === 'complete' ? (
            <Button onClick={() => router.push('/dashboard')} size="lg" className="w-full sm:w-auto">
              Back to Dashboard
            </Button>
          ) : (
             <Button disabled size="lg" className="w-full sm:w-auto">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scan in Progress...
            </Button>
          )}
        </CardFooter>
      </Card>
      <style jsx>{`
        @keyframes scan-vertical {
          0% { transform: translateY(-10%); opacity: 0; }
          10% { transform: translateY(0); opacity: 1; }
          90% { transform: translateY(100%); opacity: 1; }
          100% { transform: translateY(110%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
