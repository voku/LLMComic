import { useState, useEffect } from 'react';

interface Props {
  panelId: string;
  prompt: string;
  fallbackSeed?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ImageGenerator({ panelId, prompt, fallbackSeed, className, style }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Load cached image on mount
  useEffect(() => {
    // Try to load the generated image from the server
    const serverPath = `${import.meta.env.BASE_URL}generated/${panelId}.jpg`;
    setImageUrl(serverPath);
    setImageError(false);
  }, [panelId]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      if (fallbackSeed) {
        setImageUrl(`https://picsum.photos/seed/${fallbackSeed}/1920/1080?grayscale`);
      } else {
        setImageUrl(null);
      }
    }
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={prompt}
          className="w-full h-full object-cover contrast-125 brightness-110"
          referrerPolicy="no-referrer"
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
