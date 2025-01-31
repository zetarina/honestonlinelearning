"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Tag, Tooltip, Spin } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";
import ImageComponent from "@/components/ImageComponent";
import { ApplicationLevelCourse } from "@/models/CourseModel";
import Link from "next/link";
import ExpandableContent from "../ExpandableContent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSettings } from "@/contexts/SettingsContext";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import apiClient from "@/utils/api/apiClient";
import CustomCarousel from "@/components/CustomCarousel";
import "@/styles/carousel.css";

dayjs.extend(utc);

const { Title, Text } = Typography;
const { Meta } = Card;

const FeaturedCoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<ApplicationLevelCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();

  const currency = settings[SETTINGS_KEYS.CURRENCY]?.toUpperCase() || "USD";
  const featureCoursesLimit =
    settings[SETTINGS_KEYS.HOMEPAGE]?.featureCoursesLimit || 4;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/me/courses");
        if (response.data && Array.isArray(response.data)) {
          setCourses(response.data.slice(0, featureCoursesLimit));
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [featureCoursesLimit]);

  if (loading) {
    return (
      <div style={{ padding: "40px 10px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Title level={4} style={{ color: "red" }}>
          Unable to load courses at this time.
        </Title>
      </div>
    );
  }

  // If there are no courses after loading and no error, hide the section.
  if (!loading && !error && courses.length === 0) {
    return null;
  }

  const CourseCard = (course: ApplicationLevelCourse) => {
    const imageUrl = course.thumbnailUrl || "/images/default-thumbnail.jpg";
    const isEnrollmentActive = !course.enrollmentExpired
      ? true
      : dayjs().isBefore(dayjs.utc(course.enrollmentExpired));
    const buttonLabel = isEnrollmentActive ? "View Course" : "Buy Course";

    return (
      <div
        style={{
          padding: "8px",
        }}
      >
        <Card
          hoverable
          cover={
            <ImageComponent
              src={imageUrl}
              alt={course.title || "Course Thumbnail"}
              style={{
                width: "100%",
                height: "325px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          }
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            height: "100%",
          }}
        >
          <Meta
            title={
              <Tooltip title={course.title}>
                <Text strong style={{ fontSize: "16px" }}>
                  {course.title}
                </Text>
              </Tooltip>
            }
          />
          <ExpandableContent
            content={course.highlights || "No highlights available"}
            linesToShow={2}
          />
          <div style={{ marginTop: "5px" }}>
            <Tag color="blue" style={{ fontSize: "12px" }}>
              {course.category || "General"}
            </Tag>
            <Tag color="green" style={{ fontSize: "12px" }}>
              {course.level || "Beginner"}
            </Tag>
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography.Paragraph style={{ fontSize: "14px" }}>
              {course.price === 0
                ? "Free"
                : `${course.price.toLocaleString()} ${currency}`}
            </Typography.Paragraph>
            <Tooltip title="Number of students enrolled">
              <UsergroupAddOutlined style={{ marginRight: "4px" }} />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {Math.floor(Math.random() * 500) + 50}
              </Text>
            </Tooltip>
          </div>
          <Link href={`/courses/${course._id}`}>
            <Button
              type="primary"
              size="middle"
              style={{
                marginTop: "10px",
                width: "100%",
                borderRadius: "8px",
                color: "white",
                // background: isEnrollmentActive ? "#001529" : "#ff4d4f",
                // borderColor: isEnrollmentActive ? "#001529" : "#ff4d4f",
              }}
            >
              {buttonLabel}
            </Button>
          </Link>
        </Card>
      </div>
    );
  };

  return (
    <div style={{ padding: "40px 10px" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
        Featured Courses
      </Title>
      <CustomCarousel slidesToShow={3}>
        {courses.map((course) => (
          <div
            key={course._id.toString()}
            style={{
              padding: "5px",
              margin: "0 auto",
              maxWidth: "280px",
            }}
          >
            {CourseCard(course)}
          </div>
        ))}
      </CustomCarousel>
      <div>
        <Link href="/courses" passHref>
          <p
            style={{
              display: "block",
              width: "max-content",
              margin: "0 auto",
              textDecoration: "none",
            }}
          >
            <Button
              type="primary"
              size="middle"
              style={{
                borderRadius: "8px",
                color: "white",
                background: "#001529",
              }}
            >
              View All Courses
            </Button>
          </p>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedCoursesSection;
