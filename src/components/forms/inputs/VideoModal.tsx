import React from "react";
import { Modal, Button, Card, Input, Form, InputNumber, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Chapter, VideoType } from "@/models/CourseModel";

const { Option } = Select;

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterIndex: number;
  chapters: Chapter[];
  setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  chapterIndex,
  chapters,
  setChapters,
}) => {
  // Safeguard: Ensure the chapter exists before accessing its videos
  const chapter = chapters[chapterIndex];

  if (!chapter) {
    return null; // Return null or handle the error when chapter is invalid
  }

  const addVideo = () => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].videos.push({
      title: "",
      url: "",
      type: VideoType.YOUTUBE,
      duration: 0,
    });
    setChapters(updatedChapters);
  };

  const removeVideo = (videoIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].videos = updatedChapters[
      chapterIndex
    ].videos.filter((_, index) => index !== videoIndex);
    setChapters(updatedChapters);
  };

  return (
    <Modal
      title="Manage Videos"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {chapter.videos.map((video, videoIndex) => (
        <Card
          key={videoIndex}
          title={`Video ${videoIndex + 1}`}
          extra={
            <Button
              type="link"
              icon={<MinusCircleOutlined />}
              onClick={() => removeVideo(videoIndex)}
            />
          }
          style={{ marginBottom: "16px" }}
        >
          <Form.Item label="Video Title">
            <Input
              value={video.title}
              onChange={(e) => {
                const updatedChapters = [...chapters];
                updatedChapters[chapterIndex].videos[videoIndex].title =
                  e.target.value;
                setChapters(updatedChapters);
              }}
            />
          </Form.Item>
          <Form.Item label="Video URL">
            <Input
              value={video.url}
              onChange={(e) => {
                const updatedChapters = [...chapters];
                updatedChapters[chapterIndex].videos[videoIndex].url =
                  e.target.value;
                setChapters(updatedChapters);
              }}
            />
          </Form.Item>
          <Form.Item label="Duration (seconds)">
            <InputNumber
              value={video.duration}
              min={1}
              onChange={(value) => {
                const updatedChapters = [...chapters];
                updatedChapters[chapterIndex].videos[videoIndex].duration =
                  value || 0;
                setChapters(updatedChapters);
              }}
            />
          </Form.Item>
          <Form.Item label="Video Type">
            <Select
              value={video.type}
              onChange={(value) => {
                const updatedChapters = [...chapters];
                updatedChapters[chapterIndex].videos[videoIndex].type = value;
                setChapters(updatedChapters);
              }}
            >
              <Option value={VideoType.YOUTUBE}>YouTube</Option>
              <Option value={VideoType.VIMEO}>Vimeo</Option>
              <Option value={VideoType.UPLOAD}>Upload</Option>
            </Select>
          </Form.Item>
        </Card>
      ))}
      <Button type="dashed" block onClick={addVideo} icon={<PlusOutlined />}>
        Add Video
      </Button>
    </Modal>
  );
};

export default VideoModal;
