"use client";

import React, { useState } from "react";
import { Layout, Typography, List, Button, Divider, Menu, Alert } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PlayCircleOutlined,
  VideoCameraOutlined,
  DownloadOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Course } from "@/models/CourseModel";
import ReactPlayer from "react-player";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

interface CourseContentProps {
  course: Course;
}

const CourseContent: React.FC<CourseContentProps> = ({ course }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] =
    useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const screens = useBreakpoint();

  const currentChapter = course.chapters?.[selectedChapterIndex];
  const currentVideo = currentChapter?.videos[selectedVideoIndex];

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
      {/* Hamburger Menu for Mobile */}
      {!screens.lg && (
        <Button
          icon={<MenuOutlined />}
          type="primary"
          style={{
            margin: "20px",
            position: "relative",
            zIndex: 1000,
          }}
          onClick={() => setIsMobileSidebarVisible(true)}
        >
          Chapters
        </Button>
      )}

      {/* Mobile Sidebar - Fixed and Fullscreen */}
      {isMobileSidebarVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#fff",
            zIndex: 1001,
            overflowY: "scroll",
          }}
        >
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setIsMobileSidebarVisible(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 1002,
              fontSize: "18px",
            }}
          />
          <Sider
            width="100%"
            style={{
              background: "#fff",
              padding: "40px 20px",
            }}
          >
            <Title level={4}>{collapsed ? <MenuOutlined /> : "Chapters"}</Title>

            <Menu
              mode="inline"
              selectedKeys={[`${selectedChapterIndex}`]}
              items={menuItems}
              onClick={() => setIsMobileSidebarVisible(false)}
            />
          </Sider>
        </div>
      )}

      {/* Sidebar for larger screens */}
      {screens.lg && (
        <Sider
          width={250}
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={{
            background: "#fff",
            padding: "20px",
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <Button
            type="primary"
            icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: "absolute",
              top: "50%",
              right: collapsed ? "-20px" : "-10px",
              transform: "translateY(-50%)",
              zIndex: 1000,
              backgroundColor: "#1890ff",
              borderRadius: "50%",
            }}
          />
          <Title
            level={4}
            style={{
              textAlign: "center", // Centers the text or icon
              width: "100%", // Ensures full width
              marginBottom: "20px", // Optional: removes extra margin for better centering
            }}
          >
            {collapsed ? <MenuOutlined /> : "Chapters"}
          </Title>

          <Menu
            mode="inline"
            selectedKeys={[`${selectedChapterIndex}`]}
            items={menuItems}
          />
        </Sider>
      )}

      {/* Content Area */}
      <Layout style={{ padding: "20px" }}>
        <Content style={{ background: "#fff", padding: "20px" }}>
          <Title level={3}>{currentChapter?.title}</Title>
          <Divider />

          {/* Video Player */}
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

          {/* Navigation Buttons */}
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
          {/* List of videos in current chapter */}
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
          {/* Resources */}
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
