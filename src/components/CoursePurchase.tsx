"use client";

import React, { useContext } from "react";
import {
  Card,
  Typography,
  Button,
  List,
  Divider,
  Tag,
  Row,
  Col,
  Space,
  Timeline,
  Alert,
  message,
} from "antd";
import {
  ApplicationLevelCourseAPI,
  Course,
  CourseType,
} from "@/models/CourseModel";
import apiClient from "@/utils/api/apiClient";
import { useRouter } from "next/navigation";
import ExpandableContent from "./ExpandableContent";
import { useSettings } from "@/hooks/useSettings";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import { useUser } from "@/hooks/useUser";

const { Title, Text } = Typography;

interface CoursePurchaseProps {
  course: ApplicationLevelCourseAPI;
  onPurchaseSuccess: () => void;
}

const CoursePurchase: React.FC<CoursePurchaseProps> = ({
  course,
  onPurchaseSuccess,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const { settings } = useSettings();

  const currency = settings[SETTINGS_KEYS.CURRENCY]?.toUpperCase() || "USD";

  const handlePurchase = async () => {
    if (!user) {
      message.warning("You need to login to purchase the course.");
      router.push(`/login?redirect=/courses/${course._id}`);
      return;
    }

    try {
      const response = await apiClient.post(
        `/me/courses/${course._id}/purchase`
      );

      if (response.status === 200) {
        message.success("Course purchased successfully!");
        onPurchaseSuccess();
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        const { error: errorMessage, redirectUrl } = error.response.data;

        if (errorMessage === "Insufficient points") {
          message.warning("Not enough points. Please top up your balance.");
          router.push(redirectUrl);
        } else {
          message.error(
            errorMessage || "Failed to purchase course. Please try again."
          );
        }
      } else {
        message.error("An error occurred while purchasing the course.");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <Row
        gutter={[24, 24]}
        justify="center"
        style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}
      >
        <Col xs={24} md={10}>
          <Card
            hoverable
            cover={
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            }
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Title level={3}>{course.title}</Title>
            <ExpandableContent content={course.description} linesToShow={6} />
            <Space direction="vertical" style={{ marginTop: "10px" }}>
              <Text strong>Category:</Text>{" "}
              <Tag color="blue" style={{ textTransform: "capitalize" }}>
                {course.category}
              </Tag>
              <Text strong>Level:</Text>{" "}
              <Tag color="green" style={{ textTransform: "capitalize" }}>
                {course.level}
              </Tag>
              <Text strong>Course Type:</Text>{" "}
              <Tag color="orange" style={{ textTransform: "capitalize" }}>
                {course.courseType}
              </Tag>
              <Text strong>Instructor:</Text>{" "}
              <Tag color="purple" style={{ textTransform: "capitalize" }}>
                {course.instructor?.name ||
                  course.instructor?.username ||
                  "N/A"}
              </Tag>
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
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Title level={4}>
                Price: {course.price.toLocaleString()} {currency}
              </Title>

              <Button
                type="primary"
                size="large"
                onClick={handlePurchase}
                block
              >
                Buy Course
              </Button>

              <Divider />

              {course.courseType === CourseType.SELF_PACED && (
                <div style={{ overflowY: "auto", paddingRight: "8px" }}>
                  {course.chapters?.length ? (
                    <>
                      <Title level={5}>Course Chapters</Title>
                      <Timeline>
                        {course.chapters.map((chapter, index) => (
                          <Timeline.Item key={index} color="blue">
                            <Title level={5}>{chapter.title}</Title>
                            <Text type="secondary">
                              {chapter.videos?.length ?? 0} Videos
                              {chapter.resources?.length ?? 0} Resources
                            </Text>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </>
                  ) : (
                    <Text type="secondary">This course has no chapters.</Text>
                  )}
                </div>
              )}

              {course.courseType === CourseType.LIVE &&
                course.liveCourse?.sessions?.length && (
                  <>
                    <List
                      dataSource={course.liveCourse.sessions}
                      renderItem={(session, sessionIndex) => (
                        <List.Item key={sessionIndex}>
                          <strong>{session.dayOfWeek}</strong>
                          <List
                            dataSource={session.slots}
                            renderItem={(slot, slotIndex) => (
                              <List.Item key={slotIndex}>
                                <Text>
                                  {slot.startTimeUTC} - {slot.endTimeUTC}
                                </Text>
                              </List.Item>
                            )}
                          />
                        </List.Item>
                      )}
                    />
                  </>
                )}

              <Alert
                message="Zoom links will be available after purchase."
                type="info"
                showIcon
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CoursePurchase;
