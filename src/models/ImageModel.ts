import mongoose, { Document, Schema } from "mongoose";

export interface Image extends Document {
  url: string;
  name: string;
  service: string;
  createdAt: Date;
}

const ImageSchema = new Schema<Image>({
  url: { type: String, required: true },
  name: { type: String, required: true },
  service: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ImageModel =
  mongoose.models.Image || mongoose.model<Image>("Image", ImageSchema);
export default ImageModel;
