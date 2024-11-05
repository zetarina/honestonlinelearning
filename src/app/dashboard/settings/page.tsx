"use client";

import React, { useEffect, useState } from "react";
import { Button, Space, message, Spin } from "antd";
import axios from "axios";
import { PlusOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Setting } from "@/models/SettingModel";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import SettingsTable from "@/components/SettingsTable";
import SettingsModal from "@/components/SettingsModal";
import GuideBookModal from "@/components/GuideBookModal";

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [missingKeysQueue, setMissingKeysQueue] = useState<string[]>([]);
  const [isAddingMissingKey, setIsAddingMissingKey] = useState(false);
  const [currentMissingKey, setCurrentMissingKey] = useState<string | null>(null);
  const [isMissingKeysLoading, setIsMissingKeysLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/settings");
        setSettings(response.data);
      } catch (error) {
        message.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const openAddModal = () => {
    setIsModalOpen(true);
    setEditingSetting(null);
    setCurrentMissingKey(null);
    setIsAddingMissingKey(false);
  };

  const handleEdit = (setting: Setting) => {
    setCurrentMissingKey(null);
    setIsAddingMissingKey(false);
    setEditingSetting(setting);
    setIsModalOpen(true);
  };

  const missingKeys = Object.values(SETTINGS_KEYS).filter(
    (key) => !settings.some((setting) => setting.key === key)
  );

  const handleAddMissingKeys = () => {
    setIsMissingKeysLoading(true);
    setTimeout(() => {
      if (missingKeys.length > 0) {
        setMissingKeysQueue(missingKeys);
        setCurrentMissingKey(missingKeys[0]);
        setIsModalOpen(true);
        setIsAddingMissingKey(true);
      } else {
        message.info("No missing keys found.");
      }
      setIsMissingKeysLoading(false);
    }, 1000);
  };

  const onNextMissingKey = () => {
    const remainingKeys = missingKeysQueue.slice(1);
    setMissingKeysQueue(remainingKeys);
    setCurrentMissingKey(remainingKeys[0] || null);
    if (!remainingKeys.length) {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/settings/${id}`);
      setSettings(settings.filter((setting) => setting._id !== id));
      message.success("Setting deleted successfully");
    } catch (error) {
      message.error("Failed to delete setting");
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: "20px" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add New Setting
        </Button>

        {isMissingKeysLoading ? (
          <Spin />
        ) : (
          missingKeys.length > 0 && (
            <Button type="default" onClick={handleAddMissingKeys}>
              Add Missing Keys ({missingKeys.length})
            </Button>
          )
        )}

        <Button
          type="dashed"
          icon={<InfoCircleOutlined />}
          onClick={() => setIsGuideModalOpen(true)}
        >
          Guide Book
        </Button>
      </Space>

      <SettingsTable
        settings={settings}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <SettingsModal
          isModalOpen={isModalOpen}
          isAddingMissingKey={isAddingMissingKey}
          currentMissingKey={currentMissingKey}
          editingSetting={editingSetting}
          missingKeysQueue={missingKeysQueue}
          onNextMissingKey={onNextMissingKey}
          setIsModalOpen={setIsModalOpen}
          setSettings={setSettings}
        />
      )}

      {isGuideModalOpen && (
        <GuideBookModal
          isModalOpen={isGuideModalOpen}
          setIsModalOpen={setIsGuideModalOpen}
        />
      )}
    </div>
  );
};

export default SettingsPage;
