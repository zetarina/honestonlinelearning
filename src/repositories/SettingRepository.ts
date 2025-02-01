import dbConnect from "@/db";
import SettingModel from "../models/SettingModel";
import { Model } from "mongoose";
import { SETTINGS_GUIDE, SettingsInterface } from "@/config/settingKeys";

class SettingRepository {
  private settingModel: Model<any>;

  constructor() {
    this.settingModel = SettingModel;
  }

  async findAllStructured(environment: string): Promise<SettingsInterface> {
    await dbConnect();

    const pipeline = [
      { $match: { environment } },
      { $project: { _id: 0, key: 1, value: 1, isPublic: 1 } },
      {
        $group: {
          _id: null,
          structuredSettings: {
            $push: { k: "$key", v: "$value" },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $arrayToObject: "$structuredSettings",
          },
        },
      },
    ];

    const results = await this.settingModel.aggregate(pipeline).exec();
    return (results[0] || {}) as SettingsInterface;
  }
  async findByKey<K extends keyof SettingsInterface>(
    key: K,
    environment: string
  ): Promise<SettingsInterface[K] | null> {
    await dbConnect();

    const pipeline = [
      { $match: { key, environment } },
      { $project: { _id: 0, value: 1 } },
    ];

    const result = await this.settingModel.aggregate(pipeline).exec();
    return result.length > 0 ? (result[0].value as SettingsInterface[K]) : null;
  }

  async findByKeys<K extends keyof SettingsInterface>(
    keys: K[],
    environment: string
  ): Promise<Pick<SettingsInterface, K>> {
    await dbConnect();

    const pipeline = [
      { $match: { key: { $in: keys }, environment } },
      { $project: { _id: 0, key: 1, value: 1 } },
      {
        $group: {
          _id: null,
          structuredSettings: {
            $push: { k: "$key", v: "$value" },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $arrayToObject: "$structuredSettings",
          },
        },
      },
    ];

    const results = await this.settingModel.aggregate(pipeline).exec();
    return (results[0] || {}) as Pick<SettingsInterface, K>;
  }

  async findPublicSettings(
    environment: string
  ): Promise<Partial<SettingsInterface>> {
    await dbConnect();

    const pipeline = [
      { $match: { environment, isPublic: true } },
      { $project: { _id: 0, key: 1, value: 1 } },
      {
        $group: {
          _id: null,
          structuredSettings: {
            $push: { k: "$key", v: "$value" },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $arrayToObject: "$structuredSettings",
          },
        },
      },
    ];

    const results = await this.settingModel.aggregate(pipeline).exec();
    return results[0] || {};
  }

  async upsertSettingsStructured(
    updates: Partial<SettingsInterface>,
    environment: string
  ): Promise<SettingsInterface> {
    await dbConnect();

    const bulkOperations = Object.entries(updates).map(([key, value]) => {
      const isPublic =
        SETTINGS_GUIDE[key as keyof typeof SETTINGS_GUIDE]?.visibility ===
        "public";

      return {
        updateOne: {
          filter: { key, environment },
          update: { $set: { value, environment, isPublic } },
          upsert: true,
        },
      };
    });

    await this.settingModel.bulkWrite(bulkOperations);

    return this.findAllStructured(environment);
  }
}

export default SettingRepository;
