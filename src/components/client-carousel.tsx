'use client';

import { useState, useEffect } from 'react';
// Importe le tableau d'objets formaté sous le nom allCarouselImages
import { carouselImages as allCarouselImages } from '@/lib/placeholder-images';
import { CarouselImage } from '@/types/types';
import { ImageCarousel } from './image-carousel';

export function ClientCarousel() {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);

  useEffect(() => {
    // 💡 CORRECTION : Utilise directement le tableau importé (déjà un tableau d'objets)
    // Plus besoin de .map() car la transformation du string en objet a été faite dans le fichier .ts
    const imagesArray: CarouselImage[] = allCarouselImages as CarouselImage[];

    // Mélange et garde les 3 premières
    const shuffled = [...imagesArray].sort(() => 0.5 - Math.random());
    setCarouselImages(shuffled.slice(0, 3));
  }, []);

  if (carouselImages.length === 0) {
    return (
      <div className="h-40 w-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-gray-500">
        Chargement du carrousel...
      </div>
    );
  }

  return <ImageCarousel images={carouselImages} />;
}
