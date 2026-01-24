// src/components/image-carousel.tsx
'use client';

import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from './ui/card';
import { CarouselImage } from '@/types/types';
import React from 'react';

interface Props {
  images: CarouselImage[]; // ← Tableau de CarouselImage
}

// ✅ Export nommé pour résoudre l'erreur d'import
export function ImageCarousel({ images }: Props) {
  if (!images || images.length === 0) return <p>Aucune image disponible</p>;

  // Index aléatoire de départ
  const startIndex = React.useMemo(() => Math.floor(Math.random() * images.length), [images]);

  return (
    <Carousel
      className="w-full max-w-4xl mx-auto"
      opts={{ align: 'start', loop: true, startIndex }}
    >
      <CarouselContent>
        {images.map((img) => (
          <CarouselItem key={img.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="relative flex aspect-video md:aspect-[4/3] lg:aspect-[16/9] items-center justify-center p-0 overflow-hidden rounded-lg">
                  <Image
                    src={img.imageUrl}
                    alt={img.description}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
<CarouselPrevious className="flex" />
<CarouselNext className="flex" />
    </Carousel>
  );
}
