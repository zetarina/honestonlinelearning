"use client";

import React, { useEffect, useState } from "react";

interface CacheImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectFit?: "cover" | "contain";
  style?: React.CSSProperties;
  priority?: boolean;
}

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const CacheImage: React.FC<CacheImageProps> = ({
  src,
  alt,
  width,
  height,
  objectFit = "cover",
  style,
  priority = false,
}) => {
  const [cachedSrc, setCachedSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const cachedImages = JSON.parse(
      localStorage.getItem("cachedImages") || "{}"
    );
    const now = new Date().getTime();

    if (cachedImages[src] && now - cachedImages[src].timestamp < ONE_DAY_IN_MS) {
      setCachedSrc(cachedImages[src].base64);
      setLoading(false);
    } else {
      fetch(src)
        .then((response) => {
          if (!response.ok) throw new Error("Image fetch failed");
          return response.blob();
        })
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setCachedSrc(base64data);
            setLoading(false);

            localStorage.setItem(
              "cachedImages",
              JSON.stringify({
                ...cachedImages,
                [src]: {
                  base64: base64data,
                  timestamp: now,
                },
              })
            );
          };
          reader.readAsDataURL(blob); 
        })
        .catch((err) => {
          console.error("Failed to cache image", err);
          setError(true);
          setLoading(false);
        });
    }
  }, [src]);

  if (loading) {
    return <div>Loading image...</div>; 
  }

  if (error || !cachedSrc) {
    return <div>Failed to load image</div>; 
  }

  return (
    <img
      src={cachedSrc}
      alt={alt}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        objectFit,
        ...style,
      }}
    />
  );
};

export default CacheImage;
