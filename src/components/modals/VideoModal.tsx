import React from "react";
import { Modal, Button, Card, Input, Form, InputNumber, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ChapterAPI } from "@/models/Courses/Chapeter";
import { VideoAPI, VideoType } from "@/models/Courses/Video";

const { Option } = Select;

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterIndex: number;
  chapters: ChapterAPI[];
  setChapters: React.Dispatch<React.SetStateAction<ChapterAPI[]>>;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  chapterIndex,
  chapters,
  setChapters,
}) => {
  const chapter = chapters[chapterIndex];
  if (!chapter) return null;

  const addVideo = () => {
    const updatedChapters = [...chapters];

    if (!updatedChapters[chapterIndex]) {
      return;
    }

    if (!updatedChapters[chapterIndex].videos) {
      updatedChapters[chapterIndex].videos = [];
    }

    updatedChapters[chapterIndex].videos.push({
      title: "",
      key: "",
      type: VideoType.YOUTUBE,
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

  const updateVideoField = (
    videoIndex: number,
    field: keyof VideoAPI,
    value: any
  ) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].videos[videoIndex][field] = value;
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
          <Form.Item
            label="Video Title"
            rules={[{ required: true, message: "Please enter a video title." }]}
          >
            <Input
              value={video.title}
              onChange={(e) =>
                updateVideoField(videoIndex, "title", e.target.value)
              }
            />
          </Form.Item>

          <Form.Item
            label="Video Key (URL or Identifier)"
            rules={[{ required: true, message: "Please enter a valid key!" }]}
          >
            <Input
              value={video.key}
              onChange={(e) =>
                updateVideoField(videoIndex, "key", e.target.value)
              }
            />
          </Form.Item>

          <Form.Item label="Video Type">
            <Select
              value={video.type}
              onChange={(value) => updateVideoField(videoIndex, "type", value)}
            >
              <Option value={VideoType.YOUTUBE}>YouTube</Option>
              <Option value={VideoType.AWS}>AWS</Option>
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
