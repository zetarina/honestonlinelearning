"use client";

import React, { useState } from "react";
import {
  Layout,
  Typography,
  List,
  Button,
  Divider,
  Menu,
  Alert,
  Space,
  Card,
  Row,
  Col,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PlayCircleOutlined,
  VideoCameraOutlined,
  DownloadOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Course, CourseType, VideoType } from "@/models/CourseModel";
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
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const screens = useBreakpoint();
  const currentChapter = course.chapters?.[selectedChapterIndex];
  const currentVideo = currentChapter?.videos[selectedVideoIndex];

  const renderVideoPlayer = (video: { key: string; type: string }) => (
    <ReactPlayer
      url={
        video.type === VideoType.YOUTUBE
          ? `https://youtu.be/${video.key}`
          : `https://aws.bucket.url/${video.key}`
      }
      controls
      width="100%"
      height="500px"
    />
  );

  const renderLiveCourse = () => {
    const currentTime = Date.now(); // Get the current time

    return (
      <Layout
        style={{
          minHeight: "100vh",
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Content
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={2} style={{ marginBottom: "10px" }}>
            {course.title}
          </Title>
          <Text style={{ fontSize: "16px", color: "#555" }}>
            {course.description}
          </Text>
          <Divider style={{ margin: "20px 0" }} />

          <Row gutter={[16, 16]} style={{ display: "flex" }}>
            {course.liveCourse?.sessions.map((session) => (
              <Col key={session.dayOfWeek} span={8}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%", // Ensure the card takes full height
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    background: "#f9f9f9",
                  }}
                >
                  <Title
                    level={4}
                    style={{ marginBottom: "10px", textAlign: "center" }}
                  >
                    {session.dayOfWeek}
                  </Title>
                  <div>
                    {session.slots.map((slot, index) => {
                      const slotStartTime = new Date(
                        slot.startTimeUTC
                      ).getTime(); // Convert start time to timestamp

                      return (
                        <Space
                          key={index}
                          style={{
                            marginBottom: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "500",
                              color: "#333",
                              flex: 1,
                            }}
                          >
                            {`${slot.startTimeUTC} - ${slot.endTimeUTC}`}
                          </Text>
                          {currentTime >= slotStartTime ? ( // Check if current time is past the slot start time
                            <Button
                              type="primary"
                              href={slot.zoomLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              icon={<VideoCameraOutlined />}
                              style={{ marginLeft: "10px" }}
                              ghost
                            >
                              Join Session
                            </Button>
                          ) : (
                            <Text style={{ color: "#999" }}>
                              Session Not Started
                            </Text>
                          )}
                        </Space>
                      );
                    })}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    );
  };

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
      setSelectedChapterIndex(selectedChapterIndex - 1);
      setSelectedVideoIndex(previousChapter.videos.length - 1);
    }
  };

  const handleChapterChange = (index: number) => {
    setSelectedChapterIndex(index);
    setSelectedVideoIndex(0);
  };

  const menuItems = course.chapters?.map((chapter, index) => ({
    key: index,
    icon: <PlayCircleOutlined />,
    label: chapter.title,
    onClick: () => handleChapterChange(index),
  }));

  if (course.courseType === CourseType.LIVE) {
    return renderLiveCourse();
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!screens.lg && (
        <Button
          icon={<MenuOutlined />}
          type="primary"
          onClick={() => setIsMobileSidebarVisible(true)}
          style={{ margin: "20px" }}
        >
          Chapters
        </Button>
      )}

      {isMobileSidebarVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#fff",
            overflowY: "scroll",
          }}
        >
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setIsMobileSidebarVisible(false)}
            style={{ position: "absolute", top: "20px", right: "20px" }}
          />
          <Sider width="100%" style={{ background: "#fff", padding: "20px" }}>
            <Menu
              mode="inline"
              selectedKeys={[`${selectedChapterIndex}`]}
              items={menuItems}
            />
          </Sider>
        </div>
      )}

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
            style={{ marginBottom: 16 }}
          />
          <Menu
            mode="inline"
            selectedKeys={[`${selectedChapterIndex}`]}
            items={menuItems}
          />
        </Sider>
      )}

      <Layout style={{ padding: "20px" }}>
        <Content style={{ background: "#fff", padding: "20px" }}>
          <Title level={3}>{currentChapter?.title}</Title>
          <Divider />

          {currentVideo && renderVideoPlayer(currentVideo)}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
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
              onClick={handleNextVideo}
              icon={<RightOutlined />}
            >
              Next
            </Button>
          </div>

          <Divider />
          <Title level={4}>Resources</Title>
          <List
            dataSource={currentChapter?.resources || []}
            renderItem={(resource) => (
              <List.Item>
                <Button
                  type="link"
                  href={resource.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<DownloadOutlined />}
                >
                  {resource.name}
                </Button>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CourseContent;
