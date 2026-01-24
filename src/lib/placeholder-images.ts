import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const FALLBACK_IMAGE = '/images/fallback.png';

const createPlaceholder = (
  item: string | Partial<ImagePlaceholder>,
  index: number,
  prefix = 'Image'
): ImagePlaceholder => {
  if (typeof item === 'string') {
    return {
      id: String(index),
      description: `${prefix} ${index + 1}`,
      imageUrl: item || FALLBACK_IMAGE,
      imageHint: `${prefix} ${index + 1}`,
    };
  }
  const obj = item as Partial<ImagePlaceholder>;
  return {
    id: obj.id ?? String(index),
    description: obj.description ?? `${prefix} ${index + 1}`,
    imageUrl: obj.imageUrl ?? FALLBACK_IMAGE,
    imageHint: obj.imageHint ?? '',
  };
};

// --- placeholderImages ---
export const placeholderImages: ImagePlaceholder[] = Array.isArray(data.placeholderImages)
  ? data.placeholderImages.map((item, index) => createPlaceholder(item, index, 'Placeholder image'))
  : [];

// --- carouselImages ---
export const carouselImages: ImagePlaceholder[] = Array.isArray(data.carouselImages)
  ? data.carouselImages.map((item, index) => createPlaceholder(item, index, 'Carousel image'))
  : [];
