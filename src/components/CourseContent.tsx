"use client";

import React, { useState } from "react";
import { Layout, Menu, Drawer, Button, Typography, Divider, List } from "antd";
import {
  PlayCircleOutlined,
  MenuOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import ReactPlayer from "react-player";
import { useMediaQuery } from "react-responsive";
import { Course, VideoType } from "@/models/CourseModel";

const { Sider, Content } = Layout;
const { Title } = Typography;

interface CourseContentProps {
  course: Course;
}

const CourseContent: React.FC<CourseContentProps> = ({ course }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 767 });

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
      height={isMobile ? "250px" : "500px"}
    />
  );

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
      setSelectedVideoIndex(previousChapter?.videos.length - 1 || 0);
    }
  };

  const handleChapterChange = (index: number) => {
    setSelectedChapterIndex(index);
    setSelectedVideoIndex(0);
    setDrawerVisible(false);
  };

  const menuItems = course.chapters?.map((chapter, index) => ({
    key: index,
    icon: <PlayCircleOutlined />,
    label: chapter.title,
    onClick: () => handleChapterChange(index),
  }));

  return (
    <Layout style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {isMobile ? (
        <>
          <Button
            icon={<MenuOutlined />}
            type="primary"
            onClick={() => setDrawerVisible(true)}
            style={{ margin: "20px" }}
          >
            Chapters
          </Button>

          <Drawer
            placement="left"
            closable={false}
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={220}
          >
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setDrawerVisible(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 1,
                color: "black",
              }}
            />
            <Menu
              mode="inline"
              selectedKeys={[`${selectedChapterIndex}`]}
              items={menuItems}
            />
          </Drawer>
        </>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={350}
          trigger={null}
          style={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "24px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {!collapsed && (
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                Chapters
              </span>
            )}

            <Button
              type="primary"
              icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>

          <Menu
            mode="inline"
            style={{ flex: 1, width: "100%" }}
            selectedKeys={[`${selectedChapterIndex}`]}
            items={menuItems}
          />
        </Sider>
      )}

      <Layout
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Content style={{ flex: 1, padding: "20px" }}>
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
