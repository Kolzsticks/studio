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
                    <Label htmlFor="threshold">Temperature Alert Threshold (°C)</Label>
                    <div className="flex items-center gap-4">
                        <Slider
                            id="threshold"
                            min={0.5}
                            max={2.5}
                            step={0.1}
                            value={[threshold]}
                            onValueChange={(value) => setThreshold(value[0])}
                        />
                        <span className="font-bold text-lg w-24 text-center p-2 rounded-md bg-secondary">{threshold.toFixed(1)}°C</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Set the temperature difference that will trigger an alert.
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

function DeviceManagement() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Device Management</CardTitle>
                <CardDescription>Manage your connected Brava smart bra.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 flex items-center justify-between">
                    <div>
                        <p className="font-medium">Device ID: {mockUser.pairedDeviceId}</p>
                        <p className="text-sm text-green-600">Status: Connected & Active</p>
                    </div>
                    <Button variant="destructive">Disconnect</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    To pair a new device, please disconnect the current one first.
                </p>
            </CardContent>
             <CardFooter>
                <Button variant="outline">Pair New Device</Button>
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
          <TabsTrigger value="device">Device</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
            <ProfileForm />
        </TabsContent>
        <TabsContent value="preferences" className="mt-6">
            <PreferencesForm />
        </TabsContent>
        <TabsContent value="device" className="mt-6">
            <DeviceManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
