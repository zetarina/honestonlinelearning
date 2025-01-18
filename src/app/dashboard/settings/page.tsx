"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Button, message, Space, Result } from "antd";
import apiClient from "@/utils/api/apiClient";
import CombinedField from "@/components/forms/inputs/CombinedField";
import { SETTINGS_GUIDE, SettingsInterface } from "@/config/settingKeys";
import { MAIL_SERVICE_KEYS } from "@/config/settings/MAIL_SERVICE_KEYS";
import { MESSAGING_SERVICE_KEYS } from "@/config/settings/MESSAGING_SERVICE_KEYS";
import { PAYMENT_SETTINGS_KEYS } from "@/config/settings/PAYMENT_SETTINGS_KEYS";
import { SITE_SETTINGS_KEYS } from "@/config/settings/SITE_SETTINGS_KEYS";
import { SOCIAL_MEDIA_KEYS } from "@/config/settings/SOCIAL_MEDIA_KEYS";
import { STORAGE_SETTINGS_KEYS } from "@/config/settings/STORAGE_SETTINGS_KEYS";
import SubLoader from "@/components/loaders/SubLoader";

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
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modifiedSettings, setModifiedSettings] = useState<
    Partial<Record<keyof SettingsInterface, any>>
  >({});

  useEffect(() => {
    const fetchSettings = async () => {
      setFetching(true);
      try {
        const response = await apiClient.get<SettingsInterface>("/settings");
        setSettings(response.data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        setError("Unable to load settings. Please try again later.");
      } finally {
        setFetching(false);
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
      await apiClient.put("/settings", { settings: updatedSettings });
      setModifiedSettings({});
      message.success("All changes saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      message.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = (keys: string[]) => {
    if (!settings) {
      return <p>No data available for these settings.</p>;
    }
    return keys.map((key) => {
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
    });
  };

  const tabsItems = Object.entries(groupedKeys).map(([key, keys]) => ({
    key,
    label: tabLabels[key],
    children: renderTabContent(keys),
  }));

  if (fetching) {
    return <SubLoader tip="Loading settings..." />;
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Result
          status="error"
          title="Error Loading Settings"
          subTitle={error}
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Tabs defaultActiveKey="SiteSettings" items={tabsItems} />
      <Space style={{ marginTop: "20px" }}>
        <Button
          type="primary"
          onClick={handleSaveAll}
          disabled={Object.keys(modifiedSettings).length === 0 || loading}
          loading={loading}
        >
          Save All Changes
        </Button>
      </Space>
    </div>
  );
};

export default SettingsPage;
