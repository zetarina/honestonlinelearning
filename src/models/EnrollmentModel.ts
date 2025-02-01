import mongoose, { Schema, Types, Document } from "mongoose";
import { User, UserAPI } from "./UserModel";
import { Course, CourseAPI } from "./CourseModel";
import { coursesModelName, enrollmentsModelName, usersModelName } from ".";

export interface EnrollmentHistoryEntry {
  action: "ENROLL" | "EXTEND" | "COMPLETE";
  timestamp: Date;
  expires_at?: Date | null;
}

export enum EnrollmentStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  COMPLETED = "completed",
}

interface BaseEnrollment {
  enrolled_at: Date;
  expires_at?: Date;
  isPermanent: boolean;
  status: EnrollmentStatus;
  pointsSpent: number;
  enrollmentHistory: EnrollmentHistoryEntry[];
}

export interface Enrollment extends BaseEnrollment, Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  course_id: Types.ObjectId;
  user?: User;
  course?: Course;
}

export interface EnrollmentAPI extends BaseEnrollment {
  _id: string;
  user_id: string;
  course_id: string;
  user?: UserAPI;
  course?: CourseAPI;
}

const enrollmentSchema = new Schema<Enrollment>({
  user_id: { type: Schema.Types.ObjectId, ref: usersModelName, required: true },
  course_id: {
    type: Schema.Types.ObjectId,
    ref: coursesModelName,
    required: true,
  },
  enrolled_at: { type: Date, default: Date.now },
  expires_at: { type: Date, default: null },
  isPermanent: { type: Boolean, default: false },
  pointsSpent: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(EnrollmentStatus),
    default: EnrollmentStatus.ACTIVE,
  },
  enrollmentHistory: [
    {
      action: {
        type: String,
        enum: ["ENROLL", "EXTEND", "COMPLETE"],
        required: true,
      },
      timestamp: { type: Date, default: Date.now },
      expires_at: { type: Date, default: null },
    },
  ],
});

enrollmentSchema.virtual("user", {
  ref: usersModelName,
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

enrollmentSchema.virtual("course", {
  ref: coursesModelName,
  localField: "course_id",
  foreignField: "_id",
  justOne: true,
});
enrollmentSchema.set("toObject", { virtuals: true });
enrollmentSchema.set("toJSON", { virtuals: true });

const Enrollment =
  mongoose.models?.[enrollmentsModelName] ||
  mongoose.model<Enrollment>(enrollmentsModelName, enrollmentSchema);

export default Enrollment;
