import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BravaLogo } from '@/components/brava-logo';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'login-hero');
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 sm:p-6">
        <BravaLogo />
      </header>
      <main className="flex-grow">
        <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center">
          <div className="flex-1 p-8 md:p-16 lg:p-24 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight text-primary">
              Proactive Breast Health Monitoring
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
             Take control with real-time breast analysis. Our smart technology empowers you to monitor potential signs early, offering peace of mind and supporting proactive detection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-lg">
                <Link href="/onboarding">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full h-64 lg:h-auto lg:self-stretch relative">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
