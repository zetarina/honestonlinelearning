// components/CourseContent.tsx
"use client";
import React, { useState } from "react";
import { Layout, Typography, List, Button, Divider, Menu, Alert } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PlayCircleOutlined,
  VideoCameraOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Course, Chapter, Video, VideoType } from "@/models/CourseModel"; // Adjust the path accordingly
import ReactPlayer from "react-player"; // Make sure `react-player` is installed

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

interface CourseContentProps {
  course: Course;
}

const CourseContent: React.FC<CourseContentProps> = ({ course }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);

  const currentChapter = course.chapters?.[selectedChapterIndex];
  const currentVideo = currentChapter?.videos[selectedVideoIndex];

  // Handle the live session scenario
  if (course.isLive && course.liveCourseUrl) {
    return (
      <Layout style={{ minHeight: "100vh", padding: "20px" }}>
        <Content style={{ background: "#fff", padding: "20px" }}>
          <Title level={2}>{course.title}</Title>
          <Text>{course.description}</Text>
          <Divider />

          <Alert
            message="This course is currently live."
            description="You can join the live session using the link below."
            type="info"
            showIcon
          />

                    <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              type="primary"
              icon={<VideoCameraOutlined />}
              size="large"
              href={course.liveCourseUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Live Session
            </Button>
          </div>

                    {course.zoomLinks && course.zoomLinks.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <Divider />
              <Title level={4}>Other Zoom Links for Upcoming Sessions:</Title>
              <List
                itemLayout="horizontal"
                dataSource={course.zoomLinks}
                renderItem={(link, index) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Zoom Link {index + 1}
                        </a>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
        </Content>
      </Layout>
    );
  }

  // Handling pre-recorded course with chapters and videos
  const handleNextVideo = () => {
    if (selectedVideoIndex < (currentChapter?.videos.length || 0) - 1) {
      setSelectedVideoIndex(selectedVideoIndex + 1);
    } else if (selectedChapterIndex < (course.chapters?.length || 0) - 1) {
      setSelectedChapterIndex(selectedChapterIndex + 1);
      setSelectedVideoIndex(0);
    }
  };

  const handlePrevVideo = () => {
    if (selectedVideoIndex > 0) {
      setSelectedVideoIndex(selectedVideoIndex - 1);
    } else if (selectedChapterIndex > 0) {
      const previousChapter = course.chapters?.[selectedChapterIndex - 1];
      if (previousChapter && previousChapter.videos.length > 0) {
        setSelectedChapterIndex(selectedChapterIndex - 1);
        setSelectedVideoIndex(previousChapter.videos.length - 1);
      }
    }
  };

  const handleChapterChange = (chapterIndex: number) => {
    setSelectedChapterIndex(chapterIndex);
    setSelectedVideoIndex(0);
  };
  const menuItems = course.chapters?.map((chapter, index) => ({
    key: index,
    icon: <PlayCircleOutlined />,
    label: chapter.title,
    onClick: () => handleChapterChange(index),
  }));
  return (
    <Layout style={{ minHeight: "100vh" }}>
            <Sider
        width={250}
        style={{
          background: "#fff",
          padding: "20px",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <Title level={4}>Chapters</Title>
        <Menu
          mode="inline"
          selectedKeys={[`${selectedChapterIndex}`]}
          items={menuItems}
        />
        ;
      </Sider>

            <Layout style={{ padding: "20px" }}>
        <Content style={{ background: "#fff", padding: "20px" }}>
          <Title level={3}>{currentChapter?.title}</Title>
          <Divider />

                    <div style={{ position: "relative", marginBottom: "20px" }}>
            {currentVideo && (
              <ReactPlayer
                url={currentVideo.url}
                controls={true}
                width="100%"
                height="500px"
                config={{
                  youtube: { playerVars: { showinfo: 1 } },
                  vimeo: { playerOptions: { title: true } },
                }}
              />
            )}
          </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="primary"
              disabled={selectedChapterIndex === 0 && selectedVideoIndex === 0}
              onClick={handlePrevVideo}
              icon={<LeftOutlined />}
            >
              Previous
            </Button>
            <Button
              type="primary"
              disabled={
                selectedChapterIndex === course.chapters!.length - 1 &&
                selectedVideoIndex === currentChapter!.videos.length - 1
              }
              onClick={handleNextVideo}
              icon={<RightOutlined />}
            >
              Next
            </Button>
          </div>

                    <Divider />
          <Title level={4}>Videos in this Chapter</Title>
          <List
            itemLayout="horizontal"
            dataSource={currentChapter?.videos}
            renderItem={(video, index) => (
              <List.Item
                onClick={() => setSelectedVideoIndex(index)}
                style={{
                  cursor: "pointer",
                  background:
                    index === selectedVideoIndex ? "#e6f7ff" : "transparent",
                }}
              >
                <List.Item.Meta
                  title={video.title}
                  description={`Duration: ${video.duration} mins`}
                />
              </List.Item>
            )}
          />

                    <Divider />
          <Title level={4}>Resources</Title>
          {currentChapter?.resources.length ? (
            <List
              itemLayout="horizontal"
              dataSource={currentChapter.resources}
              renderItem={(resource, index) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <a
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button type="link" icon={<DownloadOutlined />}>
                          Download Resource {index + 1}
                        </Button>
                      </a>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Text>No resources available for this chapter.</Text>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CourseContent;
