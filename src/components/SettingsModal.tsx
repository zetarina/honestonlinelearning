import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Checkbox, message } from "antd";
import { Setting } from "@/models/SettingModel";
import axios from "axios";

interface SettingsModalProps {
  isModalOpen: boolean;
  isAddingMissingKey: boolean;
  currentMissingKey: string | null;
  editingSetting: Setting | null;
  missingKeysQueue: string[];
  onNextMissingKey: () => void;
  setIsModalOpen: (value: boolean) => void;
  setSettings: React.Dispatch<React.SetStateAction<Setting[]>>; // Corrected type
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

  useEffect(() => {
    if (isAddingMissingKey && currentMissingKey) {
      form.setFieldsValue({
        key: currentMissingKey,
        value: "",
        isPublic: false, // Default value for the checkbox
      });
    } else if (editingSetting) {
      form.setFieldsValue({
        key: editingSetting.key,
        value: editingSetting.value,
        environment: editingSetting.environment,
        isPublic: editingSetting.isPublic ?? false, // Ensure it's boolean
      });
    } else {
      form.resetFields();
    }
  }, [form, isAddingMissingKey, currentMissingKey, editingSetting]);

  const handleSaveSetting = async (values: Setting) => {
    try {
      if (editingSetting) {
        const response = await axios.put(`/api/settings/${editingSetting._id}`, values);
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
        <Form.Item
          label="Key"
          name="key"
          rules={[{ required: true, message: "Please enter the setting key" }]}
        >
          <Input disabled={!!currentMissingKey || isAddingMissingKey} />
        </Form.Item>
        <Form.Item
          label="Value"
          name="value"
          rules={[{ required: true, message: "Please enter the setting value" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Environment" name="environment">
          <Input placeholder="production" />
        </Form.Item>
        <Form.Item name="isPublic" valuePropName="checked">
          <Checkbox>Is Public?</Checkbox>
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
