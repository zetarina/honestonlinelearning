"use client";
import { FilePickerContext } from "@/contexts/FilePickerContext";
import { FileDataAPI } from "@/models/FileModel";
import apiClient from "@/utils/api/apiClient";
import { message } from "antd";
import { useState, useRef, useCallback } from "react";

export const FilePickerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<FileDataAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const lastFetchRef = useRef<number>(0);
  const lastSyncRef = useRef<number>(0);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchFiles = async (search: string, page: number, type?: string) => {
    const now = Date.now();
    if (now - lastFetchRef.current < 60000) return;

    try {
      setLoading(true);
      lastFetchRef.current = now;

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
    }, 1000);
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
