import mongoose, { Schema } from "mongoose";
import { usersModelName } from "./UserModel";
export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}
export enum VideoType {
  YOUTUBE = "youtube",
  VIMEO = "vimeo",
  AWS = "aws",
}

export enum DurationType {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  PERMANENT = "permanent",
}

export const coursesModelName: string = "courses";

export interface Video {
  title: string;
  url: string;
  type: VideoType;
  duration: number;
}

export interface Chapter {
  title: string;
  videos: Video[];
  resources: string[];
}
export interface ApplicationLevelCourse
  extends Omit<
    Course,
    | "created_at"
    | "updated_at"
    | "expires_at"
    | "startDate"
    | "endDate"
    | "liveSessionStart"
    | "liveSessionEnd"
  > {
  isEnrolled: boolean;
  enrollmentExpired?: boolean;
  startDate?: string;
  endDate?: string;
  expires_at?: string;
  liveSessionStart?: string;
  liveSessionEnd?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Course extends Document {
  _id: mongoose.Types.ObjectId | string;
  title: string;
  description: string;
  highlights: string;
  price: number;
  category: string;
  thumbnailUrl?: string;
  level: CourseLevel;
  chapters?: Chapter[];
  instructorId: mongoose.Types.ObjectId | string;
  instructor?: any;
  isLive: boolean;
  isCurrentlyLive?: boolean;
  isActive: boolean;
  durationType: DurationType;
  startDate?: Date;
  endDate?: Date;
  recurrence?: string;
  zoomLinks?: string[];
  liveCourseUrl?: string;
  liveSessionStart?: Date;
  liveSessionEnd?: Date;
  created_at: Date;
  updated_at: Date;
}
const videoSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: Object.values(VideoType), required: true },
  duration: { type: Number, required: true },
});

const chapterSchema = new Schema({
  title: { type: String, required: true },
  videos: [videoSchema],
  resources: [{ type: String }],
});
const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    highlights: { type: String, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnailUrl: { type: String, trim: true },
    level: {
      type: String,
      enum: Object.values(CourseLevel),
      required: true,
    },
    chapters: [chapterSchema],
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: usersModelName,
      required: true,
    },
    isLive: { type: Boolean, default: false },
    liveCourseUrl: { type: String },
    isCurrentlyLive: { type: Boolean, default: false },
    liveSessionStart: { type: Date },
    liveSessionEnd: { type: Date },
    isActive: { type: Boolean, default: true },
    durationType: {
      type: String,
      enum: Object.values(DurationType),
      required: true,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    recurrence: { type: String, required: false },
    zoomLinks: [{ type: String }],
  },
  { timestamps: true, collection: coursesModelName }
);

courseSchema.virtual("instructor", {
  ref: usersModelName,
  localField: "instructorId",
  foreignField: "_id",
  justOne: true,
});

courseSchema.set("toObject", { virtuals: true });
courseSchema.set("toJSON", { virtuals: true });

export const CourseModel =
  mongoose.models?.[coursesModelName] ||
  mongoose.model(coursesModelName, courseSchema);

export default CourseModel;
