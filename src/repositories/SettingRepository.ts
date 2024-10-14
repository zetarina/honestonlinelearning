import dbConnect from "@/utils/db";
import SettingModel, { Setting } from "../models/SettingModel";
import { Model, Types } from "mongoose";

class SettingRepository {
  private settingModel: Model<Setting>;

  constructor() {
    this.settingModel = SettingModel;
  }

  async findAll(environment: string): Promise<Setting[]> {
    await dbConnect();
    return this.settingModel.find({ environment }).exec();
  }

  async findByKey(key: string, environment: string): Promise<Setting | null> {
    await dbConnect();
    return this.settingModel.findOne({ key, environment }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<Setting | null> {
    await dbConnect();
    return this.settingModel.findById(id).exec();
  }

  async create(settingData: Partial<Setting>): Promise<Setting> {
    await dbConnect();
    const setting = new this.settingModel(settingData);
    return setting.save();
  }

  async updateById(
    id: string | Types.ObjectId,
    updateData: Partial<Setting>
  ): Promise<Setting | null> {
    await dbConnect();
    return this.settingModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async updateByKey(
    key: string,
    value: string | number | boolean,
    environment: string,
    isPublic?: boolean
  ): Promise<Setting | null> {
    await dbConnect();
    const setting = await this.findByKey(key, environment);
    if (setting) {
      setting.value = value;
      if (typeof isPublic !== "undefined") {
        setting.isPublic = isPublic;
      }
      return setting.save();
    }
    return null;
  }

  async deleteById(id: string | Types.ObjectId): Promise<Setting | null> {
    await dbConnect();
    return this.settingModel.findByIdAndDelete(id).exec();
  }

  async findPublicSettings(environment: string): Promise<Setting[]> {
    await dbConnect();
    return this.settingModel.find({ environment, isPublic: true }).exec();
  }

  async findPublicByKey(
    key: string,
    environment: string
  ): Promise<Setting | null> {
    await dbConnect();
    return this.settingModel
      .findOne({ key, environment, isPublic: true })
      .exec();
  }
}

export default SettingRepository;
