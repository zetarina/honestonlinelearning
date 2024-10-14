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
  const [isMissingKeysLoading, setIsMissingKeysLoading] = useState(false); // New loading state for missing keys

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

  // Open modal for adding a new setting
  const openAddModal = () => {
    setIsModalOpen(true);
    setEditingSetting(null);
    setCurrentMissingKey(null);
    setIsAddingMissingKey(false);
  };

  // Check for missing keys and populate queue
  const missingKeys = Object.values(SETTINGS_KEYS).filter(
    (key) => !settings.some((setting) => setting.key === key)
  );

  // Handle adding missing keys with loading state
  const handleAddMissingKeys = () => {
    setIsMissingKeysLoading(true); // Start loading for missing keys
    setTimeout(() => {
      if (missingKeys.length > 0) {
        setMissingKeysQueue(missingKeys);
        setCurrentMissingKey(missingKeys[0]);
        setIsModalOpen(true);
        setIsAddingMissingKey(true);
      } else {
        message.info("No missing keys found.");
      }
      setIsMissingKeysLoading(false); // Stop loading after calculating
    }, 1000); // Simulate a delay to show loading
  };

  // Handle moving to the next missing key
  const onNextMissingKey = () => {
    const remainingKeys = missingKeysQueue.slice(1);
    setMissingKeysQueue(remainingKeys);
    setCurrentMissingKey(remainingKeys[0] || null);
    if (!remainingKeys.length) {
      setIsModalOpen(false); // Close modal if no more missing keys
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
        onEdit={setEditingSetting}
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
          onNextMissingKey={onNextMissingKey} // Pass onNextMissingKey as prop
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
