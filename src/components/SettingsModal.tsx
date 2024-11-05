import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Typography,
} from "antd";
import { Setting } from "@/models/SettingModel";
import axios from "axios";
import {
  SETTINGS_KEYS,
  SettingsVisibilityMap,
  keyGuides,
} from "@/config/settingKeys";

const { Text } = Typography;

interface SettingsModalProps {
  isModalOpen: boolean;
  isAddingMissingKey: boolean;
  currentMissingKey: string | null;
  editingSetting: Setting | null;
  missingKeysQueue: string[];
  onNextMissingKey: () => void;
  setIsModalOpen: (value: boolean) => void;
  setSettings: React.Dispatch<React.SetStateAction<Setting[]>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isModalOpen,
  isAddingMissingKey,
  currentMissingKey,
  editingSetting,
  missingKeysQueue,
  onNextMissingKey,
  setIsModalOpen,
  setSettings,
}) => {
  const [form] = Form.useForm();
  const [keyGuideText, setKeyGuideText] = useState<string>("");
  const [isPublicDisabled, setIsPublicDisabled] = useState<boolean>(false);

  // Initial setting based on editing or missing key
  useEffect(() => {
    const key = currentMissingKey || editingSetting?.key || "";
    const isPublicDefault = key
      ? SettingsVisibilityMap[key as keyof typeof SettingsVisibilityMap] ??
        false
      : false;

    setKeyGuideText(key ? keyGuides[key as keyof typeof keyGuides] : "");
    setIsPublicDisabled(isPublicDefault);

    form.setFieldsValue({
      key,
      value: editingSetting?.value || "",
      environment: editingSetting?.environment || "",
      isPublic: isPublicDefault,
    });
  }, [form, isAddingMissingKey, currentMissingKey, editingSetting]);

  // Handle new key additions by checking if it exists in SETTINGS_KEYS
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredKey = e.target.value;

    if (Object.values(SETTINGS_KEYS).includes(enteredKey as any)) {
      const guide = keyGuides[enteredKey as keyof typeof keyGuides] || "";
      const visibility =
        SettingsVisibilityMap[
          enteredKey as keyof typeof SettingsVisibilityMap
        ] ?? false;

      setKeyGuideText(guide);
      setIsPublicDisabled(visibility);

      // Update the form field with the correct `isPublic` status
      form.setFieldsValue({ isPublic: visibility });
    } else {
      setKeyGuideText("");
      setIsPublicDisabled(false);
      form.setFieldsValue({ isPublic: false });
    }
  };

  const handleSaveSetting = async (values: Setting) => {
    try {
      if (editingSetting) {
        const response = await axios.put(
          `/api/settings/${editingSetting._id}`,
          values
        );
        setSettings((prevSettings) =>
          prevSettings.map((setting) =>
            setting._id === editingSetting._id ? response.data : setting
          )
        );
        message.success("Setting updated successfully");
      } else {
        const response = await axios.post("/api/settings", values);
        setSettings((prevSettings) => [...prevSettings, response.data]);
        message.success("Setting added successfully");

        if (isAddingMissingKey) {
          onNextMissingKey();
        }
      }

      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to save setting");
    }
  };

  return (
    <Modal
      title={
        editingSetting
          ? "Edit Setting"
          : isAddingMissingKey
          ? "Add Missing Key"
          : "Add New Setting"
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Form form={form} onFinish={handleSaveSetting} layout="vertical">
        {keyGuideText && (
          <Text
            type="secondary"
            style={{ display: "block", marginBottom: "12px" }}
          >
            {keyGuideText}
          </Text>
        )}

        <Form.Item
          label="Key"
          name="key"
          rules={[{ required: true, message: "Please enter the setting key" }]}
        >
          <Input
            onChange={handleKeyChange}
            disabled={!!currentMissingKey || isAddingMissingKey}
          />
        </Form.Item>

        <Form.Item
          label="Value"
          name="value"
          rules={[
            { required: true, message: "Please enter the setting value" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Environment" name="environment">
          <Input placeholder="production" />
        </Form.Item>

        <Form.Item name="isPublic" valuePropName="checked">
          <Checkbox disabled={isPublicDisabled}>Is Public?</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editingSetting ? "Update Setting" : "Add Setting"}
          </Button>
          {isAddingMissingKey &&
            currentMissingKey &&
            missingKeysQueue.length > 1 && (
              <Button
                type="link"
                style={{ marginLeft: "10px" }}
                onClick={onNextMissingKey}
              >
                Next Missing Key
              </Button>
            )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SettingsModal;
