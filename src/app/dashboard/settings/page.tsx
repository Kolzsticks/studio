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
import { Switch } from '@/components/ui/switch';
import type { User, FamilyContact } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function ProfileForm() {
    const { toast } = useToast();
    const [user, setUser] = useState<Partial<User>>({ name: '', age: 0, weight: 0 });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('onboardingData');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to load user data", error);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUser({ ...user, [e.target.id]: e.target.value });
    };

    const handleSaveChanges = () => {
        try {
            localStorage.setItem('onboardingData', JSON.stringify(user));
            toast({
                title: "Profile Updated",
                description: "Your personal information has been saved.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not save your profile.",
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={user.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" value={user.age} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" value={user.weight} onChange={handleChange} />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
        </Card>
    )
}

function PreferencesForm() {
    const { toast } = useToast();
    const handleSave = () => {
        toast({ title: "Preferences Saved", description: "Your settings have been updated."});
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Adjust application and alert settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <Button onClick={handleSave}>Save Preferences</Button>
            </CardFooter>
        </Card>
    );
}

function FamilyAlertsForm() {
    const { toast } = useToast();
    const [contacts, setContacts] = useState<FamilyContact[]>([]);

    useEffect(() => {
        try {
            const storedContacts = localStorage.getItem('familyContacts');
            if (storedContacts) {
                setContacts(JSON.parse(storedContacts));
            } else {
                // Initialize with some mock data if nothing is stored
                const mockContacts = [
                    { id: 'contact-1', name: 'Michael Smith', relationship: 'Husband', phone: '555-123-4567', email: 'michael@example.com'},
                    { id: 'contact-2', name: 'Sarah Johnson', relationship: 'Sister', phone: '555-987-6543', email: 'sarah@example.com'},
                ];
                setContacts(mockContacts);
                localStorage.setItem('familyContacts', JSON.stringify(mockContacts));
            }
        } catch (error) {
            console.error("Failed to load contacts", error);
        }
    }, []);

    const saveContacts = (updatedContacts: FamilyContact[]) => {
        try {
            localStorage.setItem('familyContacts', JSON.stringify(updatedContacts));
            setContacts(updatedContacts);
        } catch (error) {
            console.error("Failed to save contacts", error);
        }
    }

    const handleAddContact = () => {
        const newContact: FamilyContact = {
            id: `contact_${Date.now()}`,
            name: "New Contact",
            relationship: "Relative",
            phone: "",
            email: ""
        };
        saveContacts([...contacts, newContact]);
        toast({ title: "Contact Added", description: "You can now edit the new contact's details."});
    };
    
    const handleRemoveContact = (id: string) => {
        const updatedContacts = contacts.filter(c => c.id !== id);
        saveContacts(updatedContacts);
        toast({ title: "Contact Removed" });
    }

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
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveContact(contact.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </CardContent>
            <CardFooter>
                <Button variant="outline" onClick={handleAddContact}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Contact
                </Button>
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
