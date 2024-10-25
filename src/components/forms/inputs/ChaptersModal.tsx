import React, { useState } from "react";
import { Modal, Button, Card, Input, Form } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Chapter } from "@/models/CourseModel";
import VideoModal from "./VideoModal";
import ResourceModal from "./ResourceModal";

interface ChaptersModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>;
}

const ChaptersModal: React.FC<ChaptersModalProps> = ({
  isOpen,
  onClose,
  chapters,
  setChapters,
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isResourceModalOpen, setIsResourceModalOpen] =
    useState<boolean>(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(-1);

  const addChapter = () => {
    setChapters([...chapters, { title: "", videos: [], resources: [] }]);
  };

  const removeChapter = (chapterIndex: number) => {
    const updatedChapters = chapters.filter(
      (_, index) => index !== chapterIndex
    );
    setChapters(updatedChapters);
  };

  const openVideoModal = (index: number) => {
    setCurrentChapterIndex(index);
    setIsVideoModalOpen(true);
  };

  const openResourceModal = (index: number) => {
    setCurrentChapterIndex(index);
    setIsResourceModalOpen(true);
  };

  return (
    <Modal
      title="Manage Chapters"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20, maxHeight: "90vh", overflow: "hidden" }}
      styles={{
        body: { padding: 0 },
      }}
    >
      <div
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "24px",
        }}
      >
        {chapters.map((chapter, chapterIndex) => (
          <Card
            key={chapterIndex}
            title={`Chapter ${chapterIndex + 1}`}
            extra={
              <Button
                type="link"
                icon={<MinusCircleOutlined />}
                onClick={() => removeChapter(chapterIndex)}
              />
            }
            style={{ marginBottom: "16px" }}
          >
            <Form.Item label="Chapter Title">
              <Input
                value={chapter.title}
                onChange={(e) => {
                  const updatedChapters = [...chapters];
                  updatedChapters[chapterIndex].title = e.target.value;
                  setChapters(updatedChapters);
                }}
              />
            </Form.Item>

            <Button
              type="dashed"
              block
              onClick={() => openVideoModal(chapterIndex)}
              icon={<PlusOutlined />}
              style={{ marginBottom: "8px" }}
            >
              Manage Videos
            </Button>

            <Button
              type="dashed"
              block
              onClick={() => openResourceModal(chapterIndex)}
              icon={<PlusOutlined />}
            >
              Manage Resources
            </Button>
          </Card>
        ))}

        <Button
          type="dashed"
          block
          onClick={addChapter}
          icon={<PlusOutlined />}
        >
          Add Chapter
        </Button>
      </div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        chapterIndex={currentChapterIndex}
        chapters={chapters}
        setChapters={setChapters}
      />

      <ResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        chapterIndex={currentChapterIndex}
        chapters={chapters}
        setChapters={setChapters}
      />
    </Modal>
  );
};

export default ChaptersModal;
