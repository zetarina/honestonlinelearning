"use client";
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { message } from "antd";
import { FileData } from "@/models/FileModel";
import apiClient from "@/utils/api/apiClient";

type FilePickerContextProps = {
  files: FileData[];
  loading: boolean;
  fetchFiles: (search: string, page: number, type?: string) => Promise<void>;
  syncFiles: () => void; // Now debounced
  clearFiles: () => void;
};

const FilePickerContext = createContext<FilePickerContextProps | null>(null);

export const FilePickerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const lastFetchRef = useRef<number>(0);
  const lastSyncRef = useRef<number>(0);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /** ✅ Fetch Files from Server (limited to 1 minute per request) */
  const fetchFiles = async (search: string, page: number, type?: string) => {
    const now = Date.now();
    if (now - lastFetchRef.current < 60000) return; // Limit to 1 minute

    try {
      setLoading(true);
      lastFetchRef.current = now; // Update last fetch timestamp

      const response = await apiClient.get(`/files`, {
        params: { search, page, type },
      });

      setFiles((prev) =>
        page === 1 ? response.data.files : [...prev, ...response.data.files]
      );
    } catch (error) {
      console.error("Error fetching files:", error);
      message.error("Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  /** ✅ Debounced Sync Files (Limits to 1 Request Per Minute) */
  const syncFiles = useCallback(() => {
    const now = Date.now();
    if (now - lastSyncRef.current < 60000) {
      console.warn("⚠️ Sync request ignored (limit: 1 minute)");
      return;
    }

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        lastSyncRef.current = Date.now();
        await apiClient.post("/files/sync");
        message.success("Files synced successfully!");
      } catch (error) {
        console.error("Error syncing files:", error);
        message.error("Failed to sync files.");
      }
    }, 1000); // ✅ Debounce (1-second delay before executing)
  }, []);

  const clearFiles = () => setFiles([]);

  return (
    <FilePickerContext.Provider
      value={{ files, loading, fetchFiles, syncFiles, clearFiles }}
    >
      {children}
    </FilePickerContext.Provider>
  );
};

/** ✅ Hook to Access File Picker */
export const useFilePicker = () => {
  const context = useContext(FilePickerContext);
  if (!context)
    throw new Error("useFilePicker must be used within a FilePickerProvider");
  return context;
};

/** ✅ Image-Specific Hook */
export const useImagePicker = () => {
  const { files, loading, fetchFiles, syncFiles, clearFiles } = useFilePicker();
  return {
    images: files.filter((file) => file.type === "image"),
    loading,
    fetchImages: (search: string, page: number) =>
      fetchFiles(search, page, "image"),
    syncImages: syncFiles,
    clearImages: clearFiles,
  };
};

/** ✅ Video-Specific Hook */
export const useVideoPicker = () => {
  const { files, loading, fetchFiles, syncFiles, clearFiles } = useFilePicker();
  return {
    videos: files.filter((file) => file.type === "video"),
    loading,
    fetchVideos: (search: string, page: number) =>
      fetchFiles(search, page, "video"),
    syncVideos: syncFiles,
    clearVideos: clearFiles,
  };
};

/** ✅ Document-Specific Hook */
export const useDocumentPicker = () => {
  const { files, loading, fetchFiles, syncFiles, clearFiles } = useFilePicker();
  return {
    documents: files.filter((file) => file.type === "document"),
    loading,
    fetchDocuments: (search: string, page: number) =>
      fetchFiles(search, page, "document"),
    syncDocuments: syncFiles,
    clearDocuments: clearFiles,
  };
};
