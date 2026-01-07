'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bot, Heart, Lightbulb, Loader2, Search, Video } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { mockUser, generateSensorReadings, mockDoctor } from '@/lib/mock-data';
import { getPersonalizedHealthTips, PersonalizedHealthTipsOutput } from '@/ai/flows/personalized-health-tips';
import { useToast } from '@/hooks/use-toast';

function HealthTipsGenerator() {
  const { toast } = useToast();
  const [tips, setTips] = useState<PersonalizedHealthTipsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTips = async () => {
    setIsLoading(true);
    setTips(null);
    try {
      const readings = generateSensorReadings();
      const result = await getPersonalizedHealthTips({
        sensorReadings: readings,
        user: mockUser
      });
      setTips(result);
      toast({
        title: 'Success',
        description: 'Personalized health tips generated.',
      });
    } catch (error) {
      console.error('Failed to generate tips:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate tips. Please try again.',
      });
    }
    setIsLoading(false);
  };

  return (
     <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot /> AI-Powered Health Tips</CardTitle>
          <CardDescription>
            Generate personalized health tips and educational content based on your latest sensor data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Button onClick={handleGenerateTips} disabled={isLoading} size="lg">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Data...</> : <><Lightbulb className="mr-2 h-4 w-4" /> Get Health Tips</>}
            </Button>
            {isLoading && (
                <div className="flex items-center justify-center p-8 rounded-lg border border-dashed">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <p className="text-muted-foreground">Generating your personalized tips...</p>
                </div>
            )}
            {tips && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2"><Heart /> Personalized Health Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc space-y-2 pl-5">
                                {tips.healthTips.map((tip, index) => <li key={index}>{tip}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Educational Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-foreground/80 leading-relaxed">{tips.educationalContent}</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </CardContent>
      </Card>
  );
}

function FindDoctor() {
    const doctors = [
        { ...mockDoctor, id: 1, avatarUrl: PlaceHolderImages.find(p => p.id === 'doctor-1')?.imageUrl || '' },
        { name: 'Dr. Ben Carter', specialty: 'General Practitioner', hospital: 'City Health Clinic', id: 2, avatarUrl: PlaceHolderImages.find(p => p.id === 'doctor-2')?.imageUrl || '' },
        { name: 'Dr. Olivia Chen', specialty: 'Radiologist', hospital: 'St. Jude\'s Hospital', id: 3, avatarUrl: PlaceHolderImages.find(p => p.id === 'doctor-3')?.imageUrl || '' },
    ];
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Search /> Find a Specialist</CardTitle>
                <CardDescription>Search for doctors and book an appointment online.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {doctors.map(doc => (
                    <Card key={doc.id} className="flex items-center p-4 gap-4">
                        <Image src={doc.avatarUrl} alt={doc.name} width={64} height={64} className="rounded-full" data-ai-hint="doctor professional" />
                        <div className="flex-grow">
                            <h3 className="font-bold">{doc.name}</h3>
                            <p className="text-sm text-muted-foreground">{doc.specialty}</p>
                            <p className="text-sm text-muted-foreground">{doc.hospital}</p>
                        </div>
                        <Button>Book Now</Button>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}

function MyAppointments() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Manage your remote consultations.</CardDescription>
            </CardHeader>
            <CardContent>
                <Card className="p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Image src={mockDoctor.avatarUrl} alt={mockDoctor.name} width={48} height={48} className="rounded-full" data-ai-hint="doctor professional" />
                            <div>
                                <h3 className="font-bold">Consultation with {mockDoctor.name}</h3>
                                <p className="text-sm text-muted-foreground">Tomorrow at 10:30 AM</p>
                            </div>
                        </div>
                        <Button><Video className="mr-2 h-4 w-4" /> Join Call</Button>
                    </div>
                </Card>
            </CardContent>
        </Card>
    );
}


export default function ConsultationPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Expert Consultation & Tips</h1>
      <Tabs defaultValue="health-tips">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health-tips">Health Tips</TabsTrigger>
          <TabsTrigger value="find-doctor">Find a Doctor</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="health-tips" className="mt-6">
            <HealthTipsGenerator />
        </TabsContent>
        <TabsContent value="find-doctor" className="mt-6">
            <FindDoctor />
        </TabsContent>
        <TabsContent value="appointments" className="mt-6">
            <MyAppointments />
        </TabsContent>
      </Tabs>
    </div>
  );
}
