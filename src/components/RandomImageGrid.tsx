'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { CarouselImage } from '@/types/types';

interface Props {
  images: CarouselImage[];
  count?: number; // nombre d’images à afficher (optionnel)
}

export function RandomImageGrid({ images, count = 3 }: Props) {
  const shuffled = useMemo(() => {
    return [...images].sort(() => 0.5 - Math.random()).slice(0, count);
  }, [images, count]);

  return (
    <section className="p-4">
      <h2 className="text-xl font-bold mb-4 text-primary">📸 Photos aléatoires</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {shuffled.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-lg shadow">
            <Image
              src={img.imageUrl}
              alt={img.description}
              width={300}
              height={200}
              className="w-full h-auto object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
    </section>
  );
}
