'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Thermometer,
  Waves,
  Scan,
  History,
  User,
} from 'lucide-react';
import type { ScanResult, User as UserType } from '@/lib/types';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

function SensorCard({
  Icon,
  label,
  value,
  unit,
}: {
  Icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <Card className="p-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5 sm:p-3 sm:pb-2">
        <CardTitle className="text-[11px] sm:text-sm font-medium">
          {label}
        </CardTitle>
        <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-2.5 pt-0 sm:p-3 sm:pt-0">
        <div className="text-lg sm:text-2xl font-bold">
          {value.toFixed(2)} <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ScanHistory({ history }: { history: ScanResult[] }) {
    const router = useRouter();

    const handleViewReport = (scanId: string) => {
        router.push(`/dashboard/reports?scan_id=${scanId}`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History /> Scan History</CardTitle>
                <CardDescription>Review your past scan results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {history.length > 0 ? (
                    history.slice(0, 5).map(scan => (
                        <Card key={scan.id} className="p-3">
                            <div className="flex items-center justify-between gap-2">
                                <div className="grid gap-0.5">
                                    <p className="font-semibold text-sm">
                                        Scan - {new Date(scan.timestamp).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(scan.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={scan.risk === 'High' ? 'destructive' : 'secondary'}>{scan.risk} Risk</Badge>
                                    <Button size="sm" variant="outline" onClick={() => handleViewReport(scan.id)}>View</Button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg">
                        <p>No scans recorded yet.</p>
                        <p className="text-sm">Click "New Scan" to start.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [latestScan, setLatestScan] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('onboardingData');
      const historyData = localStorage.getItem('scanHistory');

      if (!userData) {
        router.push('/onboarding');
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      if (historyData) {
        const parsedHistory = JSON.parse(historyData);
        setScanHistory(parsedHistory);
        if (parsedHistory.length > 0) {
            setLatestScan(parsedHistory[0]); // History is sorted newest first
        }
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      router.push('/onboarding');
    }
  }, [router]);

  if (!user) {
    return null; // or a loading spinner
  }
  
  const hasAlert = latestScan?.risk === 'High';

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <h1 className="text-xl sm:text-3xl font-bold font-headline">
        Hi, {user.name}
      </h1>

      {hasAlert && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <div>
            <h3 className="font-bold text-destructive">
              High Risk Detected in Your Latest Scan!
            </h3>
            <p className="text-sm text-destructive/80">
              Please review the results and consider consulting a specialist.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-sm sm:text-xl">
             <div className="flex items-center gap-1.5">
                <Scan className="h-3.5 w-3.5 sm:h-5 sm:w-5" /> Latest Scan Results
             </div>
             <Button
                size="sm"
                className="flashing-green"
                onClick={() => router.push('/dashboard/scan')}
              >
                New Scan
             </Button>
          </CardTitle>
          <CardDescription className="text-[10px] sm:text-sm">
             {latestScan ? `Results from ${new Date(latestScan.timestamp).toLocaleString()}` : "No scan data yet. Start a new scan."}
          </CardDescription>
        </CardHeader>
        <CardContent>
            {latestScan ? (
                 <div className="grid gap-2 sm:gap-4 grid-cols-3">
                    <SensorCard Icon={Waves} label="Ultrasound" value={latestScan.readings.ultrasound} unit="mm" />
                    <SensorCard Icon={Thermometer} label="Temperature" value={latestScan.readings.temperature} unit="°C" />
                    <SensorCard Icon={User} label="Bioimpedance" value={latestScan.readings.bioimpedance} unit="Ω" />
                </div>
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <p>Click "New Scan" to get your first reading.</p>
                </div>
            )}
        </CardContent>
      </Card>
      
      <ScanHistory history={scanHistory} />
    </div>
  );
}
