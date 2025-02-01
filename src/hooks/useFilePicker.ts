import { FilePickerContext } from "@/contexts/FilePickerContext";
import { useContext } from "react";

export const useFilePicker = () => {
  const context = useContext(FilePickerContext);
  if (!context)
    throw new Error("useFilePicker must be used within a FilePickerProvider");
  return context;
};

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
