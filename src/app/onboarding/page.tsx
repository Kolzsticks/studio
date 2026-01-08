'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BravaLogo } from '@/components/brava-logo';
import { Progress } from '@/components/ui/progress';
import { BluetoothConnected, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    // Validate current step's input before proceeding
    if (step === 1 && !formData.name) {
        toast({ variant: 'destructive', title: 'Name is required.' });
        return;
    }
    if (step === 2 && !formData.age) {
        toast({ variant: 'destructive', title: 'Age is required.' });
        return;
    }

    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.name || !formData.age || !formData.weight) {
        toast({ variant: 'destructive', title: 'Please fill in all fields.'});
        return;
    }

    try {
      localStorage.setItem('onboardingData', JSON.stringify(formData));
      localStorage.setItem('scanHistory', JSON.stringify([])); // Initialize empty scan history
      toast({
        title: 'Onboarding Complete!',
        description: 'Your profile has been saved.',
      });
      
      setIsConnecting(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000); // Simulate connection time

    } catch (error) {
      console.error('Failed to save to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save your data. Please try again.',
      });
    }
  };

  if (isConnecting) {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-secondary p-4">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                    <BluetoothConnected className="h-16 w-16 text-primary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold">ESP32 Connected</h2>
                <p className="text-muted-foreground">Synchronizing with your Smart Bra...</p>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-secondary p-4">
      <div className="absolute top-4 left-4">
        <BravaLogo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
            <div className="space-y-2">
                <Progress value={(step / TOTAL_STEPS) * 100} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">Step {step} of {TOTAL_STEPS}</p>
            </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="min-h-[220px]">
            {step === 1 && (
              <div className="space-y-4">
                <CardTitle className="text-2xl">Welcome!</CardTitle>
                <CardDescription>
                  Let's start with your name.
                </CardDescription>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Jennifer"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <CardTitle className="text-2xl">A little about you</CardTitle>
                <CardDescription>
                  This information helps us personalize your experience.
                </CardDescription>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 34"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <CardTitle className="text-2xl">Physical Details</CardTitle>
                <CardDescription>
                    Almost there! This helps in calibrating the sensors.
                </CardDescription>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 65"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handlePrev}>
                Previous
              </Button>
            )}
            {step < TOTAL_STEPS ? (
              <Button type="button" className="ml-auto" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Finish & Connect
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
