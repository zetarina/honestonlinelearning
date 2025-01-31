import dbConnect from "@/db";
import RoleModel, { Role, RoleType } from "../models/RoleModel";
import { Types, Model } from "mongoose";

class RoleRepository {
  private roleModel: Model<Role>;

  constructor() {
    this.roleModel = RoleModel;
  }

  async findAll(): Promise<Role[]> {
    await dbConnect();
    return this.roleModel.find().exec();
  }

  async findById(roleId: string | Types.ObjectId): Promise<Role | null> {
    await dbConnect();
    return this.roleModel.findById(roleId).exec();
  }

  async findRolesAboveLevel(level: number): Promise<Role[]> {
    await dbConnect();
    return this.roleModel.find({ level: { $gt: level } }).exec();
  }

  async findRolesUpToLevel(level: number): Promise<Role[]> {
    await dbConnect();
    return this.roleModel.find({ level: { $lte: level } }).exec();
  }

  async create(roleData: Partial<Role>): Promise<Role> {
    await dbConnect();
    const role = new this.roleModel(roleData);
    return role.save();
  }

  async update(
    roleId: string | Types.ObjectId,
    updateData: Partial<Role>
  ): Promise<Role | null> {
    await dbConnect();
    return this.roleModel
      .findByIdAndUpdate(roleId, updateData, { new: true })
      .exec();
  }

  async delete(roleId: string | Types.ObjectId): Promise<Role | null> {
    await dbConnect();
    return this.roleModel.findByIdAndDelete(roleId).exec();
  }

  async updatePermissions(
    roleId: string | Types.ObjectId,
    permissions: string[]
  ): Promise<Role | null> {
    await dbConnect();
    return this.roleModel
      .findByIdAndUpdate(roleId, { permissions }, { new: true })
      .exec();
  }

  async findByRoleType(roleType: RoleType): Promise<Role | null> {
    await dbConnect();
    return this.roleModel.findOne({ type: roleType }).exec();
  }
}

export default RoleRepository;
