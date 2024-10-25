import mongoose, { Document, Schema, Types } from "mongoose";
export const imageModelName = "images";

export interface ImageObj extends Document {
  _id: Types.ObjectId | string;
  url: string;
  name: string;
  service: string;
  createdAt: Date;
}

const ImageSchema = new Schema<ImageObj>({
  url: { type: String, required: true },
  name: { type: String, required: true },
  service: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ImageModel =
  mongoose.models?.[imageModelName] ||
  mongoose.model<ImageObj>(imageModelName, ImageSchema);
export default ImageModel;
