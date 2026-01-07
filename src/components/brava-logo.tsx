import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export function BravaLogo({ className, ...props }: SVGProps<SVGSVGElement> & {className?: string}) {
  return (
    <div className={cn("flex items-center gap-2", className)} >
        <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        >
            <path
                d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z"
                fill="hsl(var(--primary))"
            />
            <path
                d="M16 8a8 8 0 100 16 8 8 0 000-16z"
                fill="hsl(var(--accent))"
            />
            <path d="M16 12a4 4 0 100 8 4 4 0 000-8z" fill="#fff" />
        </svg>
        <span className="text-xl font-bold font-headline text-primary">Smart Bra</span>
    </div>
  );
}
