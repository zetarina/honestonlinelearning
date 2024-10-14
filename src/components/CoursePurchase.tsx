"use client";
import React from "react";
import {
  Card,
  Typography,
  Button,
  message,
  List,
  Divider,
  Tag,
  Row,
  Col,
  Space,
  Timeline,
  Alert,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { Course } from "@/models/CourseModel";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ExpandableContent from "./ExpandableContent";

const { Title, Paragraph, Text } = Typography;

interface CoursePurchaseProps {
  course: Course;
  onPurchaseSuccess: () => void;
}

const CoursePurchase: React.FC<CoursePurchaseProps> = ({
  course,
  onPurchaseSuccess,
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handlePurchase = async () => {
    if (!session?.user) {
      message.warning("You need to login to purchase the course.");
      router.push(`/login?redirect=/courses/${course._id}`);
      return;
    }

    try {
      const response = await axios.post(
        `/api/me/courses/${course._id}/purchase`
      );

      if (response.status === 200) {
        message.success("Course purchased successfully!");
        onPurchaseSuccess();
      } else {
        message.error("Failed to purchase course. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred while purchasing the course.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "20px" }}>
      <Row
        gutter={[24, 24]}
        justify="center"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          width: "100%",
        }}
      >
                <Col xs={24} md={10}>
          <Card
            hoverable
            cover={
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            }
            bodyStyle={{ padding: "16px" }}
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            <Title level={3}>{course.title}</Title>
            <ExpandableContent content={course.description} linesToShow={6} />
            <Space direction="vertical" style={{ marginTop: "10px" }}>
              <Text strong>Category:</Text>{" "}
              <Tag color="blue">{course.category}</Tag>
              <Text strong autoCapitalize="true">
                Level:
              </Text>{" "}
              <Tag color="green">{course.level}</Tag>
              <Text strong>Instructor:</Text>{" "}
              <Tag color="purple">{course.instructor?.username || "N/A"}</Tag>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={14}>
          <Card
            title="Course Details"
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
            styles={{
              body: { padding: "16px", flexGrow: 1 },
            }}
          >
            <Space direction="vertical" style={{ width: "100%", flexGrow: 1 }}>
              <Title level={4}>
                Price: {course.price.toLocaleString()} MMK
              </Title>
              <Button
                type="primary"
                size="large"
                onClick={handlePurchase}
                style={{
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                  padding: "0 40px",
                  height: "45px",
                  fontSize: "16px",
                }}
                block
              >
                Buy Course
              </Button>

              <Divider />

                            <div
                style={{
                  // maxHeight: "300px",
                  overflowY: "auto",
                  paddingRight: "8px",
                }}
              >
                {course.chapters && course.chapters.length > 0 ? (
                  <>
                    <Title level={5}>Course Chapters</Title>
                    <Timeline style={{ padding: "10px" }}>
                      {course.chapters.map((chapter, chapterIndex) => (
                        <Timeline.Item key={chapterIndex} color="blue">
                          <Title level={5}>{chapter.title}</Title>
                          <Text type="secondary">
                            {chapter.videos.length} Videos,{" "}
                            {chapter.resources.length} Resources
                          </Text>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </>
                ) : (
                  <Alert
                    message="No chapters available for this course."
                    type="info"
                    showIcon
                  />
                )}
              </div>

                            {course.zoomLinks && course.zoomLinks.length > 0 && (
                <>
                  <Divider />
                  <div
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      paddingRight: "8px",
                    }}
                  >
                    <Title level={5}>Zoom Links</Title>
                    <List
                      dataSource={course.zoomLinks}
                      renderItem={(zoomLink, index) => (
                        <List.Item>
                          <a
                            href={zoomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button type="link" icon={<LinkOutlined />}>
                              Zoom Session {index + 1}
                            </Button>
                          </a>
                        </List.Item>
                      )}
                    />
                  </div>
                </>
              )}

              {course.isLive && (
                <>
                  <Divider />
                  <Alert
                    message="This course includes live sessions!"
                    description={
                      <>
                        {course.liveSessionStart && (
                          <Text>
                            Live Session Start:{" "}
                            {new Date(course.liveSessionStart).toLocaleString()}
                          </Text>
                        )}
                        <br />
                        {course.liveSessionEnd && (
                          <Text>
                            Live Session End:{" "}
                            {new Date(course.liveSessionEnd).toLocaleString()}
                          </Text>
                        )}
                      </>
                    }
                    type="success"
                    showIcon
                  />
                </>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CoursePurchase;
