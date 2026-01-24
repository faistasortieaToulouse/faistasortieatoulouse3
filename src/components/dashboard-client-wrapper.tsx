'use client';

import React, { useEffect, useState } from 'react';
import { TimeWeatherBar } from './time-weather-bar';
import { ImageCarousel } from './image-carousel';
import { CarouselImage } from '@/types/types';

interface Props {
  placeholderImages: CarouselImage[];
}

export function DashboardClientWrapper({ placeholderImages }: Props) {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);

  useEffect(() => {
    // Mélange aléatoire à chaque montage
    const shuffled = [...placeholderImages].sort(() => 0.5 - Math.random());
    setCarouselImages(shuffled.slice(0, 3));
  }, [placeholderImages]);

  return (
    <>
      <TimeWeatherBar />
      <section>
        {carouselImages.length > 0 && <ImageCarousel images={carouselImages} />}
      </section>
    </>
  );
}
