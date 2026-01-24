import React, { useMemo } from 'react';
import { CarouselImage } from '@/types/types';

const FALLBACK_IMAGE = '/images/fallback.png';

interface CarouselProps {
  images: CarouselImage[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const displayImages = useMemo(() => {
    const needed = Math.min(3, images.length);
    return images.sort(() => 0.5 - Math.random()).slice(0, needed);
  }, [images]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
      className="no-scrollbar"
    >
      {displayImages.map((image) => (
        <div
          key={image.id}
          style={{
            flex: '0 0 auto',
            width: '90%',          // sur mobile
            maxWidth: '300px',     // limite sur grand écran
            scrollSnapAlign: 'center',
            textAlign: 'center',
          }}
          className="sm:w-[45%] md:w-[30%]" // ✅ tailwind responsive
        >
          <img
            src={image.imageUrl || FALLBACK_IMAGE}
            alt={image.description || 'Image'}
            width={300}
            height={200}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (!img.src.includes(FALLBACK_IMAGE)) {
                img.src = FALLBACK_IMAGE;
              }
            }}
          />
        </div>
      ))}

      {/* Styles pour masquer scrollbar sur tous navigateurs */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Carousel;
