import mongoose, { Document, Schema, Types } from "mongoose";
import { Role, RoleAPI } from "./RoleModel";
import { roleModelName, usersModelName } from ".";
import {
  PointTransaction,
  PointTransactionAPI,
  pointTransactionSchema,
} from "./Users/PointTransaction";
import {
  DeviceToken,
  DeviceTokenAPI,
  deviceTokenSchema,
} from "./Users/DeviceToken";

interface BaseUser {
  name?: string;
  bio?: string;
  username: string;
  email: string;
  password?: string;
  hashedPassword: string;
  salt: string;
  pointsBalance: number;
  created_at: Date;
  updated_at: Date;
  avatar: string;
}
export interface User extends BaseUser, Document {
  _id: Types.ObjectId;
  pointTransactions: PointTransaction[];
  role_ids: Types.ObjectId[];
  roles: Role[];
  devices: DeviceToken[];
}
export interface UserAPI extends BaseUser {
  _id: string;
  pointTransactions: PointTransactionAPI[];
  role_ids: string[];
  roles: RoleAPI[];
  devices: DeviceTokenAPI[];
}

const userSchema = new Schema(
  {
    name: { type: String, trim: true },
    bio: { type: String, trim: true },
    username: { type: String, unique: true, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    hashedPassword: { type: String, required: true },
    salt: { type: String, required: true },
    avatar: { type: String, default: "/images/default-avatar.webp" },
    pointTransactions: [pointTransactionSchema],
    role_ids: [{ type: Schema.Types.ObjectId, ref: roleModelName }],
    devices: [deviceTokenSchema],
  },
  { timestamps: true }
);
userSchema.virtual("roles", {
  ref: roleModelName,
  localField: "role_ids",
  foreignField: "_id",
});

userSchema.virtual("pointsBalance").get(function () {
  return (
    this.pointTransactions?.reduce(
      (total, transaction) => total + (transaction.points || 0),
      0
    ) || 0
  );
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

const User =
  mongoose.models?.[usersModelName] ||
  mongoose.model<User>(usersModelName, userSchema);

export default User;
