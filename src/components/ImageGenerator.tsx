import { CSSProperties, useEffect, useState } from 'react';
import { getGeneratedImagePath } from '../generatedImages';

interface Props {
  imageId: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}

export function ImageGenerator({ imageId, alt, className, style }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(getGeneratedImagePath(imageId, import.meta.env.BASE_URL));
  }, [imageId]);

  const handleImageError = () => {
    setImageUrl(null);
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={alt}
          className="w-full h-full object-cover contrast-125 brightness-110"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
          <span className="text-zinc-600 font-mono uppercase tracking-widest">Image Missing</span>
        </div>
      )}
    </div>
  );
}
