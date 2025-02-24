import { Model, Types } from "mongoose";
import { ApplicationLevelCourse, Course } from "../models/CourseModel";
import dbConnect from "@/db";
import CourseModel from "../models/CourseModel";
import { enrollmentsModelName } from "@/models";

class UserCourseRepository {
  private courseModel: Model<Course>;

  constructor() {
    this.courseModel = CourseModel;
  }

  async getAllUserCourses(
    userId?: Types.ObjectId
  ): Promise<ApplicationLevelCourse[]> {
    await dbConnect();
    const userIdObj = userId ? userId : null;
    const result = await this.courseModel.aggregate([
      ...(userIdObj
        ? [
            {
              $lookup: {
                from: enrollmentsModelName,
                let: { courseId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$course_id", "$$courseId"] },
                          { $eq: ["$user_id", userIdObj] },
                        ],
                      },
                    },
                  },
                ],
                as: "userEnrollment",
              },
            },
            {
              $unwind: {
                path: "$userEnrollment",
                preserveNullAndEmptyArrays: true,
              },
            },
          ]
        : []),
      {
        $addFields: {
          enrollmentExpired: {
            $and: [
              { $ne: ["$userEnrollment.expires_at", null] },
              { $lt: ["$userEnrollment.expires_at", new Date()] },
            ],
          },
          expires_at: { $ifNull: ["$userEnrollment.expires_at", null] },
          isEnrollmentPermanent: "$userEnrollment.isPermanent",
          chapters: {
            $map: {
              input: "$chapters",
              as: "chapter",
              in: {
                title: "$$chapter.title",
                resources: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$enrollmentExpired", false] },
                        { $eq: ["$userEnrollment", {}] },
                      ],
                    },
                    "$$chapter.resources",
                    [],
                  ],
                },
                videos: {
                  $map: {
                    input: "$$chapter.videos",
                    as: "video",
                    in: {
                      title: "$$video.title",
                      key: "$$video.key",
                      type: "$$video.type",
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $project: { userEnrollment: 0 } },
    ]);

    return result as ApplicationLevelCourse[];
  }

  async getUserCourseById(
    courseId: Types.ObjectId,
    userId?: Types.ObjectId
  ): Promise<ApplicationLevelCourse | null> {
    await dbConnect();

    const result = await this.courseModel.aggregate([
      { $match: { _id: courseId } },
      ...(userId
        ? [
            {
              $lookup: {
                from: enrollmentsModelName,
                let: { courseId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$course_id", "$$courseId"] },
                          { $eq: ["$user_id", userId] },
                        ],
                      },
                    },
                  },
                ],
                as: "userEnrollment",
              },
            },
            {
              $unwind: {
                path: "$userEnrollment",
                preserveNullAndEmptyArrays: true,
              },
            },
          ]
        : []),
      {
        $addFields: {
          enrollmentExpired: {
            $and: [
              { $ne: ["$userEnrollment.expires_at", null] },
              { $lt: ["$userEnrollment.expires_at", new Date()] },
            ],
          },
          expires_at: { $ifNull: ["$userEnrollment.expires_at", null] },
          isEnrollmentPermanent: "$userEnrollment.isPermanent",
          chapters: {
            $map: {
              input: "$chapters",
              as: "chapter",
              in: {
                title: "$$chapter.title",
                resources: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$enrollmentExpired", false] },
                        { $eq: ["$userEnrollment", {}] },
                      ],
                    },
                    "$$chapter.resources",
                    [],
                  ],
                },
                videos: {
                  $map: {
                    input: "$$chapter.videos",
                    as: "video",
                    in: {
                      title: "$$video.title",
                      key: "$$video.key",
                      type: "$$video.type",
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $project: { userEnrollment: 0 } },
    ]);

    return result.length > 0 ? (result[0] as ApplicationLevelCourse) : null;
  }
}

export default UserCourseRepository;
