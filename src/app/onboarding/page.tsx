'use client';

import { useState } from 'react';
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

export default function OnboardingPage() {
  const router = useRouter();
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the user's data
    console.log({ age, weight });
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-secondary p-4">
        <div className="absolute top-4 left-4">
            <BravaLogo />
        </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">A little about you</CardTitle>
          <CardDescription>
            This information helps us personalize your experience.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 34"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 65"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
