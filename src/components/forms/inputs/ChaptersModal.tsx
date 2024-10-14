import React, { useState } from "react";
import { Modal, Button, Card, Input, Form } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Chapter } from "@/models/CourseModel";
import VideoModal from "./VideoModal";

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
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(-1);

  const addChapter = () => {
    // Ensure that each new chapter has initialized videos and resources arrays
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

  return (
    <Modal
      title="Manage Chapters"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
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
          >
            Manage Videos
          </Button>
        </Card>
      ))}
      <Button type="dashed" block onClick={addChapter} icon={<PlusOutlined />}>
        Add Chapter
      </Button>
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        chapterIndex={currentChapterIndex}
        chapters={chapters}
        setChapters={setChapters}
      />
    </Modal>
  );
};

export default ChaptersModal;
