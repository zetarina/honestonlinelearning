import { APP_PERMISSIONS } from "@/config/permissions";
import mongoose, { Schema, Document, Types } from "mongoose";
import { roleModelName } from ".";


export enum RoleType {
  SYSTEM = "system",
  GUEST = "guest",
  CUSTOM = "custom",
}

export interface Role extends Document {
  _id: Types.ObjectId | string;
  name: string;
  type: RoleType;
  permissions: string[];
  color: string;
  nonDeletable: boolean;
  nonPermissionsEditable: boolean;
  level: number;
}

const roleSchema = new Schema<Role>({
  name: { type: String, unique: true, required: true },
  type: {
    type: String,
    enum: Object.values(RoleType),
    default: RoleType.CUSTOM,
  },
  permissions: {
    type: [String],
    enum: Object.values(APP_PERMISSIONS),
    default: [],
  },
  color: { type: String, required: true },
  nonDeletable: { type: Boolean, default: false },
  nonPermissionsEditable: { type: Boolean, default: false },
  level: { type: Number, required: true, default: 1, min: 1, max: 100 },
});


const RoleModel =
  mongoose.models?.[roleModelName] || mongoose.model(roleModelName, roleSchema);

export default RoleModel;
