import { Model, Types } from "mongoose";
import { Course } from "../models/CourseModel";
import CourseModel from "../models/CourseModel";
import dbConnect from "@/db";

class CourseRepository {
  private courseModel: Model<Course>;

  constructor() {
    this.courseModel = CourseModel;
  }

  async findAll(): Promise<Course[]> {
    await dbConnect();
    return this.courseModel.find().populate("instructor").exec();
  }

  async findById(id: Types.ObjectId): Promise<Course | null> {
    await dbConnect();
    return this.courseModel.findById(id).populate("instructor").exec();
  }

  async create(courseData: Partial<Course>): Promise<Course> {
    await dbConnect();
    const course = new this.courseModel(courseData);
    return course.save();
  }

  async update(
    id: Types.ObjectId,
    updateData: Partial<Course>
  ): Promise<Course | null> {
    await dbConnect();
    return this.courseModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: Types.ObjectId): Promise<Course | null> {
    await dbConnect();
    return this.courseModel.findByIdAndDelete(id).exec();
  }

  async findCoursesByIds(courseIds: Types.ObjectId[]): Promise<Course[]> {
    await dbConnect();
    return this.courseModel
      .find({ _id: { $in: courseIds } })
      .populate("instructor")
      .exec();
  }
}

export default CourseRepository;
