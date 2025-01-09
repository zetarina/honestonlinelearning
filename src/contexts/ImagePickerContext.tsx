import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";
import { ImageObj } from "@/models/ImageModel";
import apiClient from "@/utils/api/apiClient";

type ImagePickerContextProps = {
  images: ImageObj[];
  loading: boolean;
  fetchImages: (search: string, page: number) => Promise<void>;
  syncImages: () => Promise<void>;
  clearImages: () => void;
};

const ImagePickerContext = createContext<ImagePickerContextProps | null>(null);

export const ImagePickerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [images, setImages] = useState<ImageObj[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async (search: string, page: number) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/images?search=${search}&page=${page}`
      );
      setImages((prev) =>
        page === 1 ? response.data.images : [...prev, ...response.data.images]
      );
    } catch (error) {
      message.error("Failed to fetch images.");
    } finally {
      setLoading(false);
    }
  };

  const syncImages = async () => {
    try {
      await apiClient.post("/images/sync");
      message.success("Images synced successfully!");
    } catch (error) {
      message.error("Failed to sync images.");
    }
  };

  const clearImages = () => setImages([]);

  return (
    <ImagePickerContext.Provider
      value={{ images, loading, fetchImages, syncImages, clearImages }}
    >
      {children}
    </ImagePickerContext.Provider>
  );
};

export const useImagePicker = () => {
  const context = useContext(ImagePickerContext);
  if (!context)
    throw new Error(
      "useImagePicker must be used within an ImagePickerProvider"
    );
  return context;
};
