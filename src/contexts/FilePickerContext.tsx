"use client";
import { createContext } from "react";
import { FileDataAPI } from "@/models/FileModel";

type FilePickerContextProps = {
  files: FileDataAPI[];
  loading: boolean;
  fetchFiles: (search: string, page: number, type?: string) => Promise<void>;
  syncFiles: () => void;
  clearFiles: () => void;
};

export const FilePickerContext = createContext<FilePickerContextProps | null>(
  null
);
