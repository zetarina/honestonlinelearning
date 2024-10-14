import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Checkbox } from "antd";
import { Setting } from "@/models/SettingModel";

interface SettingsModalProps {
  isModalOpen: boolean;
  isAddingMissingKey: boolean;
  currentMissingKey: string | null;
  editingSetting: Setting | null;
  missingKeysQueue: string[];
  onNextMissingKey: () => void;
  setIsModalOpen: (value: boolean) => void;
  setSettings: (settings: Setting[]) => void;
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
      });
    } else if (editingSetting) {
      form.setFieldsValue({
        key: editingSetting.key,
        value: editingSetting.value,
      });
    }
  }, [currentMissingKey, editingSetting, form, isAddingMissingKey]);

  const handleSaveSetting = async (values: any) => {
    if (isAddingMissingKey) {
      onNextMissingKey();
    } else {
      setIsModalOpen(false);
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
      <Form
        form={form}
        onFinish={handleSaveSetting}
        layout="vertical"
        initialValues={{
          key: currentMissingKey || editingSetting?.key || "",
          value: editingSetting?.value || "",
        }}
      >
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
          <Checkbox /> Is Public?
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
