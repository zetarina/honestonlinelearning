import mongoose, { Document, Schema, Types } from "mongoose";

export enum UserRole {
  STUDENT = "Student",
  INSTRUCTOR = "Instructor",
  ADMIN = "Admin",
}

export enum PointTransactionType {
  ADDED_BY_SYSTEM = "Added by System",
  DEDUCTED_BY_SYSTEM = "Deducted by System",
  COURSE_PURCHASE = "Course Purchase",
  COURSE_REFUND = "Course Refund",
  BONUS_REWARD = "Bonus Reward",
  PURCHASED_POINTS = "Purchased Points",
}

export const usersModelName: string = "users";

export interface DeviceToken {
  deviceName: string;
  token: string;
  createdAt: Date;
}

export interface PointTransaction {
  type: PointTransactionType;
  points: number;
  paymentId?: Types.ObjectId | string;
  date: Date;
  courseId?: Types.ObjectId | string;
}

export interface User extends Document {
  _id: Types.ObjectId | string;
  name: string;
  bio: string;
  username: string;
  email: string;
  password?: string;
  hashedPassword: string;
  salt: string;
  pointTransactions: PointTransaction[];
  pointsBalance: number;
  role: UserRole;
  devices: DeviceToken[];
  created_at: Date;
  updated_at: Date;
  avatar: string;
}

const pointTransactionSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(PointTransactionType),
    required: true,
  },
  points: { type: Number, required: true },
  paymentId: { type: Schema.Types.ObjectId, ref: "Payment", sparse: true },
  date: { type: Date, default: Date.now },
  courseId: { type: Schema.Types.ObjectId, ref: "Course" },
});

const deviceTokenSchema = new Schema({
  deviceName: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    hashedPassword: { type: String, required: true },
    salt: { type: String, required: true },
    avatar: { type: String, default: "/images/default-avatar.webp" },
    pointTransactions: [pointTransactionSchema],
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
    },
    devices: [deviceTokenSchema],
  },
  { timestamps: true }
);

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
