import dbConnect from "@/db";
import SettingModel from "../models/SettingModel";
import { Model } from "mongoose";
import { SETTINGS_KEYS, SettingsInterface } from "@/config/settingKeys";

class SettingRepository {
  private settingModel: Model<any>;

  constructor() {
    this.settingModel = SettingModel;
  }
  async findAllStructured(environment: string): Promise<SettingsInterface> {
    await dbConnect();
  
    const pipeline = [
      { $match: { environment } }, // Filter by environment
      { $project: { _id: 0, key: 1, value: 1 } }, // Include only key and value
      {
        $group: {
          _id: null,
          structuredSettings: {
            $push: { k: "$key", v: "$value" },
          },
        },
      },
      {
        $project: {
          structuredSettings: {
            $arrayToObject: {
              $map: {
                input: "$structuredSettings",
                as: "item",
                in: ["$$item.k", "$$item.v"],
              },
            },
          },
        },
      },
      {
        $replaceRoot: { newRoot: "$structuredSettings" },
      },
    ];
  
    const results = await this.settingModel.aggregate(pipeline).exec();
  
    return (results[0] || {}) as SettingsInterface;
  }
  

  // Retrieve a single setting by key
  async findByKey(
    key: keyof SettingsInterface,
    environment: string
  ): Promise<SettingsInterface[keyof SettingsInterface] | null> {
    await dbConnect();

    const pipeline = [
      { $match: { key, environment } },
      { $project: { _id: 0, value: 1 } },
    ];

    const result = await this.settingModel.aggregate(pipeline).exec();
    return result.length > 0 ? result[0].value : null;
  }

  // Retrieve multiple settings by keys
  async findByKeys(
    keys: (keyof SettingsInterface)[],
    environment: string
  ): Promise<Partial<SettingsInterface>> {
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
    return results[0] || {};
  }

  // Retrieve all public settings
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

  // Upsert settings in a structured format
  async upsertSettingsStructured(
    updates: Partial<SettingsInterface>,
    environment: string
  ): Promise<SettingsInterface> {
    await dbConnect();

    const bulkOperations = Object.entries(updates).map(([key, value]) => ({
      updateOne: {
        filter: { key, environment },
        update: { $set: { value, environment } },
        upsert: true,
      },
    }));

    await this.settingModel.bulkWrite(bulkOperations);

    return this.findAllStructured(environment);
  }
}

export default SettingRepository;
