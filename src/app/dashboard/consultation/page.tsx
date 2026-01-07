'use client';

import { useState, useEffect } from 'react';
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
import { Search, Video, Calendar } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import type { FamilyContact } from '@/lib/types';


function FindDoctor() {
    const { toast } = useToast();
    const doctors = [
        { name: 'Dr. Anadyte', specialty: 'Oncology Specialist', hospital: 'Private Hospital, Lagos', id: 1, avatarUrl: PlaceHolderImages.find(p => p.id === 'doctor-1')?.imageUrl || '' },
        { name: 'Dr. Chioma', specialty: 'General Practitioner', hospital: 'City Health Clinic', id: 2, avatarUrl: PlaceHolderImages.find(p => p.id === 'doctor-2')?.imageUrl || '' },
        { name: 'Dr. Bolanle', specialty: 'Radiologist', hospital: 'St. Jude\'s Hospital', id: 3, avatarUrl: PlaceHolderImages.find(p => p.id === 'doctor-3')?.imageUrl || '' },
    ];
    
    const handleBook = (doctorName: string) => {
        toast({
            title: "Appointment Booked!",
            description: `Your appointment with ${doctorName} has been scheduled.`,
        });
    }

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
                        <Button onClick={() => handleBook(doc.name)}>Book Now</Button>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}

function MyAppointments() {
    const { toast } = useToast();
    const handleJoin = () => {
        toast({
            title: "Joining Call...",
            description: "Connecting to the virtual consultation room."
        });
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar /> Upcoming Appointments</CardTitle>
                <CardDescription>Manage your remote consultations.</CardDescription>
            </CardHeader>
            <CardContent>
                <Card className="p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Image src={PlaceHolderImages.find(p => p.id === 'doctor-1')?.imageUrl || ''} alt={"Dr. Anadyte"} width={48} height={48} className="rounded-full" data-ai-hint="doctor professional" />
                            <div>
                                <h3 className="font-bold">Consultation with Dr. Anadyte</h3>
                                <p className="text-sm text-muted-foreground">Tomorrow at 10:30 AM</p>
                            </div>
                        </div>
                        <Button onClick={handleJoin}><Video className="mr-2 h-4 w-4" /> Join Call</Button>
                    </div>
                </Card>
            </CardContent>
        </Card>
    );
}


export default function ConsultationPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Expert Consultation</h1>
      <Tabs defaultValue="find-doctor">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="find-doctor">Find a Doctor</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
        </TabsList>
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
