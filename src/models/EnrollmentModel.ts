import mongoose, { Schema, Types, Document } from "mongoose";
import { User } from "./UserModel";
import { Course, } from "./CourseModel";
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

export interface Enrollment extends Document {
  _id: Types.ObjectId | string;
  user_id: Types.ObjectId | string;
  course_id: Types.ObjectId | string;
  enrolled_at: Date;
  expires_at?: Date;
  isPermanent: boolean;
  status: EnrollmentStatus;
  pointsSpent: number;
  user?: User;
  course?: Course;
  enrollmentHistory: EnrollmentHistoryEntry[];
}

const enrollmentSchema = new Schema<Enrollment>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: usersModelName,
      required: true,
    },
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
        expires_at: { type: Date, default: null }, // Optional for tracking expiration
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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

const Enrollment =
  mongoose.models?.[enrollmentsModelName] ||
  mongoose.model<Enrollment>(enrollmentsModelName, enrollmentSchema);

export default Enrollment;
