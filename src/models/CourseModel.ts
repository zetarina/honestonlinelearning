import mongoose, { Schema, Document, Types } from "mongoose";
import { coursesModelName, usersModelName } from ".";
import { Chapter, ChapterAPI, chapterSchema } from "./Courses/Chapeter";
import { User, UserAPI } from "./UserModel";
import {
  LiveSession,
  LiveSessionAPI,
  liveSessionSchema,
} from "./Courses/LiveSession";
import {
  subscriptionSchema,
  SubscriptionType,
  SubscriptionTypeAPI,
} from "./Courses/SubscriptionType";

export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export type CourseLevelType = keyof typeof CourseLevel;

export enum CourseType {
  SELF_PACED = "self-paced",
  LIVE = "live",
}

interface BaseCourse {
  title: string;
  description: string;
  highlights: string;
  price: number;
  category: string;
  thumbnailUrl?: string;
  level: CourseLevelType;
  courseType: CourseType;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Course extends BaseCourse, Document {
  _id: Types.ObjectId;
  chapters?: Chapter[];
  instructorId: Types.ObjectId;
  instructor?: User;
  liveCourse?: {
    isCurrentlyLive: boolean;
    sessions: LiveSession[];
  };
  subscriptionType: SubscriptionType;
}

export interface CourseAPI extends BaseCourse {
  _id: string;
  chapters?: ChapterAPI[];
  instructorId: string;
  instructor?: UserAPI;
  liveCourse?: {
    isCurrentlyLive: boolean;
    sessions: LiveSessionAPI[];
  };
  subscriptionType: SubscriptionTypeAPI;
}

export interface ApplicationLevelCourse extends Course {
  enrollmentExpired?: Date;
  isEnrollmentPermanent?: boolean;
}

export interface ApplicationLevelCourseAPI extends CourseAPI {
  enrollmentExpired?: string;
  isEnrollmentPermanent?: boolean;
}

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
    subscriptionType: subscriptionSchema,
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
  mongoose.model<Course>(coursesModelName, courseSchema);

export default CourseModel;
