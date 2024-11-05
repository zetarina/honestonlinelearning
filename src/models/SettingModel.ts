import mongoose, { Document, Schema, Types } from "mongoose";

export interface Setting extends Document {
  _id: Types.ObjectId | string;
  key: string;
  value: string;
  environment?: string;
  isPublic: boolean;
}

const settingModelName = "Setting";

const SettingSchema = new Schema<Setting>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  environment: { type: String, default: "production" },
  isPublic: { type: Boolean, default: false },
});

const SettingModel =
  mongoose.models?.[settingModelName] ||
  mongoose.model(settingModelName, SettingSchema);

export default SettingModel;
