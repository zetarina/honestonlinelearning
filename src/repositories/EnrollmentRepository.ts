import dbConnect from "@/utils/db";
import EnrollmentModel, { Enrollment } from "../models/EnrollmentModel";
import { Model, Types } from "mongoose";

class EnrollmentRepository {
  private enrollmentModel: Model<Enrollment>;

  constructor() {
    this.enrollmentModel = EnrollmentModel;
  }

  async findAll(): Promise<Enrollment[]> {
    await dbConnect();
    return this.enrollmentModel
      .find()
      .populate({
        path: "user",
        select: "name username email role",
      })
      .populate({
        path: "course",
        select: "title category price instructorId level",
      })
      .exec();
  }

  async findById(id: string | Types.ObjectId): Promise<Enrollment | null> {
    await dbConnect();
    return this.enrollmentModel
      .findById(id)
      .populate({
        path: "user",
        select: "name username email role",
      })
      .populate({
        path: "course",
        select: "title category price instructorId level",
      })
      .exec();
  }

  async create(enrollmentData: Partial<Enrollment>): Promise<Enrollment> {
    await dbConnect();
    const enrollment = new this.enrollmentModel(enrollmentData);
    return enrollment.save();
  }

  async update(
    id: string | Types.ObjectId,
    updateData: Partial<Enrollment>
  ): Promise<Enrollment | null> {
    await dbConnect();
    return this.enrollmentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate({
        path: "user",
        select: "username email role",
      })
      .populate({
        path: "course",
        select: "title category price instructorId level",
      })
      .exec();
  }

  async delete(id: string | Types.ObjectId): Promise<Enrollment | null> {
    await dbConnect();
    return this.enrollmentModel.findByIdAndDelete(id).exec();
  }

  async findByUserId(userId: string | Types.ObjectId): Promise<Enrollment[]> {
    await dbConnect();
    return this.enrollmentModel
      .find({ user_id: userId })
      .populate({
        path: "course",
        select: "title category price instructorId level",
      })
      .exec();
  }

  async findByUserIdAndCourseId(
    userId: string | Types.ObjectId,
    courseId: string | Types.ObjectId
  ): Promise<Enrollment | null> {
    await dbConnect();
    return this.enrollmentModel
      .findOne({
        user_id: userId,
        course_id: courseId,
      })
      .populate({
        path: "course",
        select: "title category price instructorId level",
      })
      .exec();
  }

  async findByCourseIds(courseIds: Types.ObjectId[]): Promise<Enrollment[]> {
    await dbConnect();
    return this.enrollmentModel
      .find({
        course_id: { $in: courseIds },
      })
      .populate({
        path: "user",
        select: "username email role",
      })
      .populate({
        path: "course",
        select: "title category price instructorId level",
      })
      .exec();
  }
}

export default EnrollmentRepository;
