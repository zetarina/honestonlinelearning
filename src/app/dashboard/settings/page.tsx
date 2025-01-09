"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Button, Spin, message, Space } from "antd";
import apiClient from "@/utils/api/apiClient";
import CombinedField from "@/components/forms/inputs/CombinedField";
import { SETTINGS_GUIDE, SettingsInterface } from "@/config/settingKeys";
import { SITE_SETTINGS_KEYS } from "@/config/settings/SITE_SETTINGS_KEYS";
import { MAIL_SERVICE_KEYS } from "@/config/settings/MAIL_SERVICE_KEYS";
import { STORAGE_SETTINGS_KEYS } from "@/config/settings/STORAGE_SETTINGS_KEYS";
import { PAYMENT_SETTINGS_KEYS } from "@/config/settings/PAYMENT_SETTINGS_KEYS";
import { SOCIAL_MEDIA_KEYS } from "@/config/settings/SOCIAL_MEDIA_KEYS";
import { MESSAGING_SERVICE_KEYS } from "@/config/settings/MESSAGING_SERVICE_KEYS";

const groupedKeys = {
  SiteSettings: Object.values(SITE_SETTINGS_KEYS),
  MailService: Object.values(MAIL_SERVICE_KEYS),
  StorageSettings: Object.values(STORAGE_SETTINGS_KEYS),
  PaymentSettings: Object.values(PAYMENT_SETTINGS_KEYS),
  SocialMedia: Object.values(SOCIAL_MEDIA_KEYS),
  MessagingService: Object.values(MESSAGING_SERVICE_KEYS),
};

const tabLabels: Record<string, string> = {
  SiteSettings: "Site Settings",
  MailService: "Mail Service",
  StorageSettings: "Storage Settings",
  PaymentSettings: "Payment Settings",
  SocialMedia: "Social Media Settings",
  MessagingService: "Messaging Service Settings",
};

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [modifiedSettings, setModifiedSettings] = useState<
    Partial<Record<keyof SettingsInterface, any>>
  >({});

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<SettingsInterface>("/settings");
        setSettings(response.data);
      } catch (error) {
        message.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (key: string, value: any) => {
    setModifiedSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSettings((prev) => {
      if (!prev) return null;
      const updatedSettings = { ...prev };
      const keys = key.split(".");
      let target = updatedSettings;

      keys.forEach((k, idx) => {
        if (idx === keys.length - 1) {
          target[k] = value;
        } else {
          target[k] = target[k] || {};
          target = target[k];
        }
      });

      return updatedSettings;
    });
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const updatedSettings = { ...settings, ...modifiedSettings };
      console.log({ settings: updatedSettings });
      await apiClient.put("/settings", { settings: updatedSettings });
      setModifiedSettings({});
      message.success("All changes saved successfully!");
    } catch (error) {
      message.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = (keys: string[]) => {
    if (!settings) return null;
    return (
      <div>
        {keys.map((key) => {
          const value = settings[key];
          const config = SETTINGS_GUIDE[key];
          if (!config) return null;

          return (
            <CombinedField
              key={key}
              title={config.label || key}
              keyPrefix={key}
              config={config}
              values={value as Record<string, any>}
              onChange={handleInputChange}
            />
          );
        })}
      </div>
    );
  };

  const tabsItems = Object.entries(groupedKeys).map(([key, keys]) => ({
    key,
    label: tabLabels[key],
    children: renderTabContent(keys),
  }));

  return (
    <div>
      <Tabs defaultActiveKey="SiteSettings" items={tabsItems} />
      <Space style={{ marginTop: "20px" }}>
        <Button
          type="primary"
          onClick={handleSaveAll}
          disabled={Object.keys(modifiedSettings).length === 0}
          loading={loading}
        >
          Save All Changes
        </Button>
        {loading && <Spin />}
      </Space>
    </div>
  );
};

export default SettingsPage;
