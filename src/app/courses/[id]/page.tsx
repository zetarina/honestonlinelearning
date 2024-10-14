"use client";

import React, { useEffect, useCallback, useMemo, useContext } from "react";
import { useParams } from "next/navigation";
import { message, Card, Typography, Button } from "antd";
import CourseContent from "@/components/CourseContent";
import CoursePurchase from "@/components/CoursePurchase";
import UserContext from "@/contexts/UserContext";
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner";

const { Title, Text } = Typography;

const CoursePage: React.FC = () => {
  const { id: courseId } = useParams();
  const { refreshUser, user } = useContext(UserContext);

  const [course, setCourse] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null); // Track error as a string message

  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const courseResponse = await axios.get(`/api/me/courses/${courseId}`);
      
      // If course is not found, handle 404 or empty data
      if (!courseResponse.data) {
        setError("not-found");
      } else {
        setCourse(courseResponse.data);
      }
    } catch (err) {
      setError("network"); // Handle network or API errors
      message.error("Failed to load course data.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handlePurchaseSuccess = useCallback(() => {
    message.success("Course purchased successfully!");
    fetchCourseData();
    refreshUser();
  }, [fetchCourseData, refreshUser]);

  const courseContent = useMemo(() => {
    if (loading) {
      return <LoadingSpinner />;
    }

    // Handle network or API error
    if (error === "network") {
      return (
        <Card
          style={{
            maxWidth: 600,
            margin: "100px auto",
            textAlign: "center",
            padding: 24,
          }}
        >
          <Title level={3}>Failed to Load Course</Title>
          <Text>There was a problem fetching the course data. Please check your connection or try again later.</Text>
          <Button
            onClick={fetchCourseData}
            type="primary"
            style={{ marginTop: 16 }}
          >
            Retry
          </Button>
        </Card>
      );
    }

    // Handle course not found scenario
    if (error === "not-found" || !course) {
      return (
        <Card
          style={{
            maxWidth: 600,
            margin: "100px auto",
            textAlign: "center",
            padding: 24,
          }}
        >
          <Title level={3}>Course Not Found</Title>
          <Text>
            Sorry, we couldn&apos;t find the course you&apos;re looking for. It may have been removed or you don&apos;t have access.
          </Text>
          <Button
            type="primary"
            style={{
              marginTop: 24,
              padding: "0 24px",
              height: "40px",
              fontSize: "16px",
            }}
            href="/courses"
          >
            Go Back to Courses
          </Button>
        </Card>
      );
    }

    // Render course content or purchase section
    return course.isEnrolled ? (
      <CourseContent course={course} />
    ) : (
      <CoursePurchase
        course={course}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
    );
  }, [loading, error, course, fetchCourseData, handlePurchaseSuccess]);

  return (
    <div style={{ backgroundColor: "#f9f9f9", paddingBottom: "60px" }}>
      {courseContent}
    </div>
  );
};

export default CoursePage;
