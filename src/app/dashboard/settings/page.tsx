"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Tabs, Button, message, Space, Result } from "antd";
import apiClient from "@/utils/api/apiClient";
import CombinedField from "@/components/inputs/CombinedField";
import { SETTINGS_GUIDE, SettingsInterface } from "@/config/settingKeys";
import { MAIL_SERVICE_SETTINGS_KEYS } from "@/config/settings/MAIL_SERVICE_KEYS";
import { MESSAGING_SERVICE_SETTINGS_KEYS } from "@/config/settings/MESSAGING_SERVICE_KEYS";
import { PAYMENT_SETTINGS_KEYS } from "@/config/settings/PAYMENT_SETTINGS_KEYS";
import { GLOBAL_SETTINGS_KEYS } from "@/config/settings/GLOBAL_SETTINGS_KEYS";
import { SOCIAL_MEDIA_SETTINGS_KEYS } from "@/config/settings/SOCIAL_MEDIA_KEYS";
import { FIREBASE_SETTINGS_KEYS } from "@/config/settings/STORAGE_SETTINGS_KEYS";
import { DESIGN_SCHEMA_SETTINGS_KEYS } from "@/config/settings/DESIGN_SCHEMA_KEYS";

import SubLoader from "@/components/loaders/SubLoader";
import { debounce } from "lodash";

const groupedKeys = {
  Global: Object.values(GLOBAL_SETTINGS_KEYS),
  MailService: Object.values(MAIL_SERVICE_SETTINGS_KEYS),
  Firebase: Object.values(FIREBASE_SETTINGS_KEYS),
  Payment: Object.values(PAYMENT_SETTINGS_KEYS),
  SocialMedia: Object.values(SOCIAL_MEDIA_SETTINGS_KEYS),
  MessagingService: Object.values(MESSAGING_SERVICE_SETTINGS_KEYS),
  DesignSchema: Object.values(DESIGN_SCHEMA_SETTINGS_KEYS),
};

const tabLabels: Record<string, string> = {
  Global: "Site Settings",
  MailService: "Mail Service",
  Firebase: "Firebase Settings",
  Payment: "Payment Settings",
  SocialMedia: "Social Media Settings",
  MessagingService: "Messaging Service Settings",
  DesignSchema: "Design Schema Settings",
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

  const debouncedHandleInputChange = useMemo(
    () =>
      debounce((key: string, value: any, type: string) => {
        const shouldDebounce = ["color"].includes(type);

        const updateSettings = () => {
          setModifiedSettings((prev) => ({
            ...prev,
            [key]: value,
          }));

          setSettings((prev) => {
            if (!prev) return null;

            const updatedSettings: SettingsInterface = { ...prev };

            const keys = key.split(".") as (keyof SettingsInterface)[];
            let target: any = updatedSettings;

            keys.forEach((k, idx) => {
              if (idx === keys.length - 1) {
                target[k] = value;
              } else {
                if (!target[k]) target[k] = {};
                target = target[k];
              }
            });

            return updatedSettings;
          });
        };

        if (!shouldDebounce) {
          updateSettings();
        } else {
          debounce(updateSettings, 50)();
        }
      }, 50),
    []
  );

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

  const renderTabContent = (keys: (keyof SettingsInterface)[]) => {
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
          onChange={debouncedHandleInputChange}
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
