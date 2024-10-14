"use client";

import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  message,
  Tooltip,
} from "antd";
import CacheImage from "@/components/CacheImage";
import axios from "axios";
import { ApplicationLevelCourse } from "@/models/CourseModel";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UsergroupAddOutlined } from "@ant-design/icons";
import ExpandableContent from "./ExpandableContent";

const { Title, Text } = Typography;
const { Meta } = Card;

const FeaturedCoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<ApplicationLevelCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/me/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        message.error("Failed to load courses. Please try again later.");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <Title level={3} style={{ color: "red" }}>
          Unable to load courses at this time.
        </Title>
      </div>
    );
  }

  const displayedCourses = courses.slice(0, 4);

  return (
    <div style={{ padding: "60px 20px", backgroundColor: "#f9f9f9" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
        Featured Courses
      </Title>
      <Row gutter={[24, 24]} justify="center">
        {displayedCourses.map((course) => {
          const imageUrl =
            course.thumbnailUrl || "/images/default-thumbnail.jpg";

          return (
            <Col xs={24} sm={12} lg={6} key={course._id.toString()}>
              <Card
                hoverable
                cover={
                  <div
                    style={{
                      height: "440px",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <CacheImage
                      src={imageUrl}
                      alt={course.title}
                      width={300}
                      height={300}
                      objectFit="cover"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                }
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform =
                    "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform =
                    "translateY(0px)")
                }
              >
                <Meta
                  title={
                    <Tooltip title={course.title}>
                      <Text
                        strong
                        style={{
                          fontSize: "18px",
                          display: "block",
                          whiteSpace: "normal",
                        }}
                      >
                        {course.title}
                      </Text>
                    </Tooltip>
                  }
                />
                <ExpandableContent
                  content={course.highlights}
                  linesToShow={3}
                />

                <div style={{ marginTop: "10px" }}>
                  <Tag color="blue">{course.category || "General"}</Tag>
                  <Tag color="green">{course.level || "Beginner"}</Tag>
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: "16px", color: "#ff4d4f" }}>
                    {course.price === 0
                      ? "Free"
                      : `${course.price.toLocaleString()} Points`}
                  </div>
                  <div>
                    <Tooltip title="Number of students enrolled">
                      <UsergroupAddOutlined style={{ marginRight: "4px" }} />
                      <Text type="secondary">
                        {Math.floor(Math.random() * 500) + 50}
                      </Text>
                    </Tooltip>
                  </div>
                </div>

                <Link href={`/courses/${course._id}`} passHref>
                  <Button
                    type="primary"
                    size="middle"
                    style={{
                      marginTop: "20px",
                      width: "100%",
                      borderRadius: "8px",
                      background: "#1890ff",
                      borderColor: "#1890ff",
                    }}
                  >
                    {course.isEnrolled ? "View Course" : "Buy Course"}
                  </Button>
                </Link>
              </Card>
            </Col>
          );
        })}
      </Row>

      {courses.length > 4 && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link href="/courses">
            <Button type="link">View All Courses</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeaturedCoursesSection;
