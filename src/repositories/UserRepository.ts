import dbConnect from "@/db";
import UserModel, { User } from "../models/UserModel";
import { Types, Model } from "mongoose";
import { roleRepository } from ".";
import { RoleType } from "@/models/RoleModel";
import { PointTransactionType } from "@/models/Users/PointTransaction";
import { DeviceToken } from "@/models/Users/DeviceToken";

class UserRepository {
  private userModel: Model<User>;

  constructor() {
    this.userModel = UserModel;
  }

  async findAllSafe(): Promise<Partial<User>[]> {
    await dbConnect();
    return this.userModel
      .find()
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }

  async findSafeById(id: Types.ObjectId): Promise<User | null> {
    await dbConnect();
    return this.userModel
      .findById(id)
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }

  async findSafeByEmail(email: string): Promise<Partial<User> | null> {
    await dbConnect();
    return this.userModel
      .findOne({ email })
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }
  async findByRole(roleId: Types.ObjectId): Promise<User[]> {
    await dbConnect();

    return this.userModel
      .find({ role_ids: { $in: [roleId] } })
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }

  async findAll(): Promise<User[]> {
    await dbConnect();
    return this.userModel
      .find()
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }

  async findById(id: Types.ObjectId): Promise<User | null> {
    await dbConnect();
    return this.userModel
      .findById(id)
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    await dbConnect();
    return this.userModel.findOne({ email }).populate("roles").exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    await dbConnect();
    const user = new this.userModel(userData);
    return user.save();
  }

  async update(
    id: Types.ObjectId,
    updateData: Partial<User>
  ): Promise<User | null> {
    await dbConnect();

    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }

  async delete(id: Types.ObjectId): Promise<User | null> {
    await dbConnect();
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async manipulatePoints(
    userId: Types.ObjectId,
    type: PointTransactionType,
    points: number,
    details?: {
      courseId?: Types.ObjectId;
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
      courseId: details?.courseId,
    });

    return user.save();
  }
  async saveDeviceToken(
    userId: Types.ObjectId,
    deviceName: string,
    token: string
  ): Promise<void> {
    await dbConnect();
    const user = await this.userModel.findById(userId);

    if (!user) throw new Error("User not found");

    if (!user.devices) {
      user.devices = [];
    }

    user.devices.push({ deviceName, token, createdAt: new Date() });
    await user.save();
  }

  async findDeviceToken(
    userId: Types.ObjectId,
    token: string
  ): Promise<boolean> {
    await dbConnect();
    const user = await this.userModel.findById(userId);
    if (!user) return false;

    return user.devices.some((device) => device.token === token);
  }

  async deleteDeviceToken(
    userId: Types.ObjectId,
    token: string
  ): Promise<void> {
    await dbConnect();
    await this.userModel
      .updateOne({ _id: userId }, { $pull: { devices: { token } } })
      .exec();
  }

  async getAllDevices(userId: Types.ObjectId): Promise<DeviceToken[]> {
    await dbConnect();
    const user = await this.userModel.findById(userId).select("devices").exec();
    if (!user) throw new Error("User not found");

    return user.devices;
  }
  async findRefreshToken(refreshToken: string): Promise<User | null> {
    await dbConnect();

    return this.userModel.findOne({ "devices.token": refreshToken }).exec();
  }
  async findByRoleTypeOrEmail(
    roleType: RoleType,
    email: string
  ): Promise<User | null> {
    await dbConnect();

    const role = await roleRepository.findByRoleType(roleType);
    if (!role) return null;

    return this.userModel
      .findOne({
        $or: [{ role_ids: { $in: [role._id] } }, { email }],
      })
      .select("-hashedPassword -salt -tokens")
      .populate("roles")
      .exec();
  }
  async purgeDeviceTokensByUserId(userId: Types.ObjectId): Promise<void> {
    await dbConnect();
    const user = await this.userModel.findById(userId);

    if (!user) throw new Error("User not found");

    user.devices = [];

    await user.save();
  }
  async purgeAllDeviceTokens(): Promise<void> {
    await dbConnect();
    await this.userModel
      .updateMany({}, { $set: { devices: [] }, $unset: { tokens: "" } })
      .exec();
  }
}

export default UserRepository;
