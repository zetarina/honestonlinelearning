import dbConnect from "@/utils/db";
import UserModel, {
  User,
  PointTransactionType,
  UserRole,
} from "../models/UserModel";
import { Types, Model } from "mongoose";

class UserRepository {
  private userModel: Model<User>;

  constructor() {
    this.userModel = UserModel;
  }

  async findAllSafe(): Promise<Partial<User>[]> {
    await dbConnect();
    return this.userModel.find().select("-hashedPassword -salt -tokens").exec();
  }

  async findSafeById(
    id: string | Types.ObjectId
  ): Promise<Partial<User> | null> {
    await dbConnect();
    return this.userModel
      .findById(id)
      .select("-hashedPassword -salt -tokens")
      .exec();
  }

  async findSafeByEmail(email: string): Promise<Partial<User> | null> {
    await dbConnect();
    return this.userModel
      .findOne({ email })
      .select("-hashedPassword -salt -tokens")
      .exec();
  }
  async findByRole(role: UserRole): Promise<Partial<User>[] | User[]> {
    await dbConnect();

    const query = this.userModel
      .find({ role })
      .select("-hashedPassword -salt -tokens");

    return query.exec();
  }
  async findAll(): Promise<User[]> {
    await dbConnect();
    return this.userModel.find().exec();
  }

  async findById(id: string | Types.ObjectId): Promise<User | null> {
    await dbConnect();
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    await dbConnect();
    return this.userModel.findOne({ email }).exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    await dbConnect();
    const user = new this.userModel(userData);
    return user.save();
  }

  async update(
    id: string | Types.ObjectId,
    updateData: Partial<User>
  ): Promise<User | null> {
    await dbConnect();
   
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string | Types.ObjectId): Promise<User | null> {
    await dbConnect();
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async manipulatePoints(
    userId: string | Types.ObjectId,
    type: PointTransactionType,
    points: number,
    details?: {
      courseId?: string;
      reason?: string;
    }
  ): Promise<User | null> {
    await dbConnect();
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new Error("User not found");

    user.pointTransactions.push({
      type,
      points,
      date: new Date(),
      courseId: details?.courseId
        ? Types.ObjectId.createFromHexString(details.courseId)
        : undefined,
    });

    return user.save();
  }
}

export default UserRepository;
