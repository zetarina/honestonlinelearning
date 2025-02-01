import { SettingsInterface } from "@/config/settingKeys";
import mongoose, { Document, Schema, Types } from "mongoose";
const settingModelName: string = "Settings";

interface BaseSetting {
  key: keyof SettingsInterface;
  value: SettingsInterface[keyof SettingsInterface];
  environment?: string;
  isPublic: boolean;
}

export interface Setting extends BaseSetting, Document {
  _id: Types.ObjectId;
}

export interface SettingAPI extends BaseSetting {
  _id: string;
}

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
