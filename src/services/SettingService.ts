import { Setting } from "@/models/SettingModel";
import { settingRepository } from "@/repositories/";

class SettingService {
  async getSettingByKey(
    key: string,
    environment = "production"
  ): Promise<Setting | null> {
    const setting = await settingRepository.findByKey(key, environment);
    return setting;
  }

  async getSettingById(id: string): Promise<Setting | null> {
    return await settingRepository.findById(id);
  }
  async getAllSettings(environment = "production"): Promise<Setting[]> {
    const settings = await settingRepository.findAll(environment);
    return settings;
  }

  async setSettingByKey(
    key: string,
    value: string,
    environment = "production",
    isPublic?: boolean
  ): Promise<Setting | null> {
    const existingSetting = await settingRepository.findByKey(key, environment);
    if (existingSetting) {
      return settingRepository.updateByKey(key, value, environment, isPublic);
    } else {
      return settingRepository.create({ key, value, environment, isPublic });
    }
  }

  async updateSettingById(
    id: string,
    value: string,
    isPublic?: boolean
  ): Promise<Setting | null> {
    return await settingRepository.updateById(id, { value, isPublic });
  }

  async getPublicSettings(
    environment = "production"
  ): Promise<Record<string, string>> {
    const publicSettings = await settingRepository.findPublicSettings(
      environment
    );
    return publicSettings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async getPublicSettingByKey(
    key: string,
    environment = "production"
  ): Promise<string | null> {
    const setting = await settingRepository.findPublicByKey(key, environment);
    return setting ? setting.value : null;
  }

  async deleteSettingById(id: string): Promise<Setting | null> {
    return await settingRepository.deleteById(id);
  }
}

export default SettingService;
