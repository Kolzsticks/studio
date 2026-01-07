'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { mockUser } from '@/lib/mock-data';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, Trash2 } from 'lucide-react';
import type { FamilyContact } from '@/lib/types';

function ProfileForm() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={mockUser.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={mockUser.email} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" defaultValue={mockUser.age} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea id="medicalHistory" defaultValue={mockUser.medicalHistory} rows={4} />
                </div>
            </CardContent>
            <CardFooter>
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>
    )
}

function PreferencesForm() {
    const [threshold, setThreshold] = useState(mockUser.threshold);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Adjust application and alert settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <div className="space-y-4">
                    <Label htmlFor="threshold">Thermal Differential Alert Threshold (°C)</Label>
                    <div className="flex items-center gap-4">
                        <Slider
                            id="threshold"
                            min={0.5}
                            max={3.0}
                            step={0.1}
                            value={[threshold]}
                            onValueChange={(value) => setThreshold(value[0])}
                        />
                        <span className="font-bold text-lg w-24 text-center p-2 rounded-md bg-secondary">{threshold.toFixed(1)}°C</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Set the temperature difference between breasts that will trigger an alert.
                    </p>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive summaries and alerts via email.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get real-time alerts on your device.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </CardContent>
            <CardFooter>
                <Button>Save Preferences</Button>
            </CardFooter>
        </Card>
    );
}

function FamilyAlertsForm() {
    const [contacts, setContacts] = useState<FamilyContact[]>(mockUser.familyContacts);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Family Alert Contacts</CardTitle>
                <CardDescription>Manage designated family members to be notified in case of a high-risk alert.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {contacts.map(contact => (
                    <Card key={contact.id} className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-semibold">{contact.name} <span className="text-sm font-normal text-muted-foreground">({contact.relationship})</span></h4>
                                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                                <p className="text-sm text-muted-foreground">{contact.email}</p>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </CardContent>
            <CardFooter>
                <Button variant="outline">Add New Contact</Button>
            </CardFooter>
        </Card>
    )
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Personal Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="family-alerts">Family Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
            <ProfileForm />
        </TabsContent>
        <TabsContent value="preferences" className="mt-6">
            <PreferencesForm />
        </TabsContent>
        <TabsContent value="family-alerts" className="mt-6">
            <FamilyAlertsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
