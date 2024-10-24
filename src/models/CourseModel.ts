import mongoose, { Schema, Document, Types } from "mongoose";
import { usersModelName } from "./UserModel";

export const coursesModelName = "courses";

export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export type CourseLevelType = keyof typeof CourseLevel;

export enum VideoType {
  YOUTUBE = "youtube",
  AWS = "aws",
}

export enum SubscriptionDurationType {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  SCHOOL_YEAR = "school_year",
  PERMANENT = "permanent",
  FIXED = "fixed",
}

export enum CourseType {
  SELF_PACED = "self-paced",
  LIVE = "live",
}

export interface Video {
  title: string;
  key: string;
  type: VideoType;
}

export interface Resource {
  _id: Types.ObjectId | string;
  name: string;
  downloadUrl: string;
}

export interface Chapter {
  title: string;
  videos: Video[];
  resources?: Resource[];
}

export interface Subscription {
  recurrenceType: SubscriptionDurationType;
  startDate?: Date;
  endDate?: Date;
  recurrence?: string;
}

export interface ZoomSlot {
  startTimeUTC: string; // e.g., "16:00"
  endTimeUTC: string; // e.g., "18:00"
  zoomLink: string;
}

export interface LiveSession {
  dayOfWeek: string; // e.g., "Monday"
  slots: ZoomSlot[]; // Multiple slots per day
}

export interface Course extends Document {
  _id: Types.ObjectId | string;
  title: string;
  description: string;
  highlights: string;
  price: number;
  category: string;
  thumbnailUrl?: string;
  level: CourseLevelType;
  chapters: Chapter[];
  instructorId: Types.ObjectId | string;
  instructor?: any;
  courseType: CourseType;
  liveCourse?: {
    isCurrentlyLive: boolean;
    sessions: LiveSession[];
  };
  isActive: boolean;
  subscription: Subscription;
  created_at: Date;
  updated_at: Date;
}

export interface ApplicationLevelCourse extends Course {
  enrollmentExpired?: Date;
  isenrollmentPermanent?: boolean;
}

// ZoomSlot schema to capture individual slots with times and links
const zoomSlotSchema = new Schema<ZoomSlot>({
  startTimeUTC: { type: String, required: true },
  endTimeUTC: { type: String, required: true },
  zoomLink: { type: String, required: true },
});

// LiveSession schema to organize multiple slots by day of the week
const liveSessionSchema = new Schema<LiveSession>({
  dayOfWeek: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  slots: [zoomSlotSchema], // Array of time-specific Zoom slots
});

// Define other necessary schemas (videos, chapters, resources, etc.)
const videoSchema = new Schema<Video>({
  title: { type: String, required: true },
  key: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^[a-zA-Z0-9\-_/]+$/.test(v),
      message: (props) => `${props.value} is not a valid key!`,
    },
  },
  type: { type: String, enum: Object.values(VideoType), required: true },
});

const resourceSchema = new Schema<Resource>({
  name: { type: String, required: true },
  downloadUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^(https?:\/\/)/.test(v),
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
});

const chapterSchema = new Schema<Chapter>({
  title: { type: String, required: true },
  videos: [videoSchema],
  resources: [resourceSchema],
});

const subscriptionSchema = new Schema<Subscription>({
  recurrenceType: {
    type: String,
    enum: Object.values(SubscriptionDurationType),
    required: true,
  },
  startDate: {
    type: Date,
    required: function () {
      return this.recurrenceType === SubscriptionDurationType.FIXED;
    },
  },
  endDate: {
    type: Date,
    required: function () {
      return this.recurrenceType === SubscriptionDurationType.FIXED;
    },
  },
  recurrence: { type: String, required: false },
});

const courseSchema = new Schema<Course>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    highlights: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
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
    courseType: {
      type: String,
      enum: Object.values(CourseType),
      required: true,
    },
    liveCourse: {
      isCurrentlyLive: { type: Boolean, default: false },
      sessions: [liveSessionSchema],
    },
    isActive: { type: Boolean, default: true },
    subscription: subscriptionSchema,
  },
  { timestamps: true, collection: coursesModelName }
);

// Virtual for instructor reference
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
  mongoose.model<Course>(coursesModelName, courseSchema);

export default CourseModel;
