import { useEffect, useState, type ImgHTMLAttributes } from 'react';

interface CharacterArtworkProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string;
}

export const CharacterArtwork = ({ fallbackSrc, src, onError, ...props }: CharacterArtworkProps) => {
  const primarySrc = src || fallbackSrc;
  const [activeSrc, setActiveSrc] = useState(primarySrc);

  useEffect(() => {
    setActiveSrc(primarySrc);
  }, [primarySrc]);

  return (
    <img
      {...props}
      data-source={activeSrc === fallbackSrc ? 'fallback' : 'variant'}
      referrerPolicy={activeSrc === fallbackSrc ? undefined : 'no-referrer'}
      src={activeSrc}
      onError={(event) => {
        if (activeSrc !== fallbackSrc) {
          setActiveSrc(fallbackSrc);
        }

        onError?.(event);
      }}
    />
  );
};
