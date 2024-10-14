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

// Helper function to determine if the src is an external URL
const isExternalUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false; // If URL constructor fails, it's likely a relative URL
  }
};

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
    if (!src) {
      console.error("Image source is invalid:", src);
      setError(true);
      setLoading(false);
      return;
    }

    // Skip caching if the image is a local resource (starts with '/')
    if (!isExternalUrl(src)) {
      setCachedSrc(src); // Directly use the src if it's local
      setLoading(false);
      return;
    }

    try {
      const cachedImages = JSON.parse(localStorage.getItem("cachedImages") || "{}");
      const now = Date.now();

      if (cachedImages[src] && now - cachedImages[src].timestamp < ONE_DAY_IN_MS) {
        setCachedSrc(cachedImages[src].base64);
        setLoading(false);
      } else {
        fetch(src)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Image fetch failed");
            }
            return response.blob();
          })
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result as string;
              setCachedSrc(base64data);
              setLoading(false);

              // Store the base64 image in localStorage if it's an external URL
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
    } catch (err) {
      console.error("Error accessing localStorage", err);
      setError(true);
      setLoading(false);
    }
  }, [src]);

  if (loading) {
    return <div>Loading image...</div>; // Loading placeholder
  }

  if (error || !cachedSrc) {
    return <div>Failed to load image</div>; // Error placeholder
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
