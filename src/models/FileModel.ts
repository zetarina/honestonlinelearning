import mongoose, { Document, Schema, Types } from "mongoose";
export const FILE_MODEL_NAME = "Files";
export const STORAGE_SERVICES = {
  FIREBASE: "firebase",
  LOCAL: "local",
} as const;

export type StorageServiceType =
  (typeof STORAGE_SERVICES)[keyof typeof STORAGE_SERVICES];



export interface FileData extends Document {
  _id: Types.ObjectId | string;
  filePath: string;
  name: string;
  type: "image" | "video" | "document";
  size: number;
  service: StorageServiceType;
  publicUrl: string;
  description?: string;
  tags?: string[];
  uploadedBy: Types.ObjectId | string;
  lastAccessed?: Date;
  isPublic: boolean;
  contentType?: string;
  folder?: string;
  createdAt: Date;
}

const FileSchema = new Schema<FileData>(
  {
    filePath: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "video", "document"],
      required: true,
    },
    size: { type: Number, required: true },
    service: {
      type: String,
      enum: Object.values(STORAGE_SERVICES),
      required: true,
    },
    publicUrl: { type: String, required: true },
    description: { type: String },
    tags: { type: [String] },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lastAccessed: { type: Date, default: null },
    isPublic: { type: Boolean, default: false },
    contentType: { type: String },
    folder: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const FileModel =
  mongoose.models?.[FILE_MODEL_NAME] ||
  mongoose.model<FileData>(FILE_MODEL_NAME, FileSchema);

export default FileModel;
