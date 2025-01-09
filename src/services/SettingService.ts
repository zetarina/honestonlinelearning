import { SettingsInterface } from "@/config/settingKeys";
import { settingRepository } from "@/repositories/";

class SettingService {
  async getAllSettings(environment = "production"): Promise<SettingsInterface> {
    return await settingRepository.findAllStructured(environment);
  }

  async getPublicSettings(
    environment = "production"
  ): Promise<Partial<SettingsInterface>> {
    return await settingRepository.findPublicSettings(environment);
  }

  async getSettingByKey(
    key: keyof SettingsInterface,
    environment = "production"
  ): Promise<SettingsInterface[keyof SettingsInterface] | null> {
    return await settingRepository.findByKey(key, environment);
  }

  async getSettingsByKeys(
    keys: (keyof SettingsInterface)[],
    environment = "production"
  ): Promise<Partial<SettingsInterface>> {
    return await settingRepository.findByKeys(keys, environment);
  }

  async upsertSettings(
    updates: Partial<SettingsInterface>,
    environment = "production"
  ): Promise<SettingsInterface> {
    return await settingRepository.upsertSettingsStructured(
      updates,
      environment
    );
  }
}

export default SettingService;
