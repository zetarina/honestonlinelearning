import React from "react";
import { Modal } from "antd";
import { keyGuides, SETTINGS_KEYS } from "@/config/settingKeys";

interface GuideBookModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const GuideBookModal: React.FC<GuideBookModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  return (
    <Modal
      title="Guide Book"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <ul>
        {Object.entries(SETTINGS_KEYS).map(([key, value]) => (
          <li key={key}>
            <strong>{value}</strong> - {keyGuides[value]}
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default GuideBookModal;
