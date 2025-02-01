import React from "react";
import { Modal, Button, Card, Input, Form } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ChapterAPI } from "@/models/Courses/Chapeter";
import { ResourceAPI } from "@/models/Courses/Resource";

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterIndex: number;
  chapters: ChapterAPI[];
  setChapters: React.Dispatch<React.SetStateAction<ChapterAPI[]>>;
}

const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  chapterIndex,
  chapters,
  setChapters,
}) => {
  const chapter = chapters[chapterIndex];
  if (!chapter) return null;

  const addResource = () => {
    const updatedChapters = [...chapters];

    if (!updatedChapters[chapterIndex]) {
      updatedChapters[chapterIndex] = { title: "", videos: [], resources: [] };
    }

    if (!updatedChapters[chapterIndex].resources) {
      updatedChapters[chapterIndex].resources = [];
    }

    updatedChapters[chapterIndex].resources.push({
      _id: "",
      name: "",
      downloadUrl: "",
    });

    setChapters(updatedChapters);
  };

  const removeResource = (resourceIndex: number) => {
    const updatedChapters = [...chapters];

    if (!updatedChapters[chapterIndex]) {
      return;
    }

    if (!updatedChapters[chapterIndex].resources) {
      updatedChapters[chapterIndex].resources = [];
    }

    updatedChapters[chapterIndex].resources = updatedChapters[
      chapterIndex
    ].resources.filter((_, index) => index !== resourceIndex);

    setChapters(updatedChapters);
  };

  const updateResourceField = (
    resourceIndex: number,
    field: keyof ResourceAPI,
    value: any
  ) => {
    const updatedChapters = [...chapters];

    if (!updatedChapters[chapterIndex]) {
      return;
    }

    if (!updatedChapters[chapterIndex].resources) {
      updatedChapters[chapterIndex].resources = [];
    }

    if (!updatedChapters[chapterIndex].resources[resourceIndex]) {
      return;
    }

    updatedChapters[chapterIndex].resources[resourceIndex][field] = value;
    setChapters(updatedChapters);
  };

  return (
    <Modal
      title="Manage Resources"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {chapter.resources?.map((resource, resourceIndex) => (
        <Card
          key={resourceIndex}
          title={`Resource ${resourceIndex + 1}`}
          extra={
            <Button
              type="link"
              icon={<MinusCircleOutlined />}
              onClick={() => removeResource(resourceIndex)}
            />
          }
          style={{ marginBottom: "16px" }}
        >
          <Form.Item label="Resource Name">
            <Input
              value={resource.name}
              onChange={(e) =>
                updateResourceField(resourceIndex, "name", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="Download URL">
            <Input
              value={resource.downloadUrl}
              onChange={(e) =>
                updateResourceField(
                  resourceIndex,
                  "downloadUrl",
                  e.target.value
                )
              }
            />
          </Form.Item>
        </Card>
      ))}

      <Button type="dashed" block onClick={addResource} icon={<PlusOutlined />}>
        Add Resource
      </Button>
    </Modal>
  );
};

export default ResourceModal;
