'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface InfoCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    children: ReactNode;
}

export function InfoCard({ icon: Icon, title, description, children }: InfoCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                </div>
                <CardDescription className="pt-2">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 flex-grow pt-2">
                {children}
            </CardContent>
        </Card>
    );
}

interface CardLinkProps {
    href: string;
    text: string;
}

export function CardLink({ href, text }: CardLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary p-2 rounded-md transition-colors hover:bg-primary/5"
        >
            <span>{text}</span>
            <ExternalLink className="w-4 h-4" />
        </a>
    );
}
