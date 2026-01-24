'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Facebook } from 'lucide-react';

interface FacebookGroupCardProps {
  name: string;
  reversedUrl: string;
}

export function FacebookGroupCard({ name, reversedUrl }: FacebookGroupCardProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Reverse the string to get the original URL
    setUrl(reversedUrl.split('').reverse().join(''));
  }, [reversedUrl]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="flex items-start gap-3">
          <Facebook className="h-5 w-5 flex-shrink-0 text-blue-600" />
          <span className="text-base">{name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild size="sm" className="w-full" disabled={!url}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Visiter le groupe
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
