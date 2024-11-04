"use client";

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Tag, Typography, Button, Space, Tooltip } from "antd";
import Link from "next/link";
import axios from "axios";
import { ApplicationLevelCourse } from "@/models/CourseModel";
import LoadingSpinner from "@/components/LoadingSpinner";
import CacheImage from "@/components/CacheImage";
import ExpandableContent from "@/components/ExpandableContent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// Extend Day.js with the UTC plugin
dayjs.extend(utc);

const { Meta } = Card;
const { Title, Text } = Typography;

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<ApplicationLevelCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/me/courses");
        if (response.data && Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.error("Unexpected API response format", response);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!courses || courses.length === 0) {
    return <p>No courses available.</p>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
        Available Courses
      </Title>
      <div style={{ flex: 1 }}>
        <Row gutter={[24, 24]} justify="center">
          {courses.map((course) => {
            const isEnrollmentActive = !course.enrollmentExpired
              ? true
              : dayjs().isBefore(dayjs.utc(course.enrollmentExpired));

            const buttonLabel = course.isEnrollmentPermanent
              ? "Lifetime Access"
              : isEnrollmentActive
              ? "View Course"
              : "Buy Course";

            const buttonType = isEnrollmentActive ? "primary" : "default";

            return (
              <Col key={course?._id?.toString()} xs={24} sm={12} md={8} lg={8}>
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
                      {course.thumbnailUrl ? (
                        <CacheImage
                          src={course.thumbnailUrl}
                          alt={course.title || "Course Thumbnail"}
                          width={300}
                          height={300}
                          objectFit="cover"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                          No Image Available
                        </div>
                      )}
                    </div>
                  }
                  style={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    transition: "box-shadow 0.3s",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.boxShadow =
                      "0 4px 20px rgba(0, 0, 0, 0.2)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.1)")
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
                          {course.title || "Untitled Course"}
                        </Text>
                      </Tooltip>
                    }
                  />

                  <ExpandableContent
                    content={course.highlights || "No highlights available"}
                    linesToShow={3}
                  />

                  <div style={{ marginTop: 8 }}>
                    <Tag color="blue">{course.category || "Uncategorized"}</Tag>
                    <Tag color="green">{course.level || "All Levels"}</Tag>
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
                      {course.price === 0
                        ? "Free"
                        : course.price
                        ? `${course.price.toLocaleString()} MMK`
                        : "Price not available"}
                    </Text>
                  </div>

                  <Space
                    style={{
                      marginTop: 12,
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Link href={`/courses/${course?._id}`} passHref>
                      <Button type={buttonType} size="small">
                        {buttonLabel}
                      </Button>
                    </Link>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default CoursesPage;
