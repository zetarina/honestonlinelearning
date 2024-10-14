"use client";

import React, { useEffect, useCallback, useMemo, useContext } from "react";
import { useParams } from "next/navigation";
import { Spin, message, Card, Typography, Button } from "antd";
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
  const [error, setError] = React.useState(false);

  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(false);
      const courseResponse = await axios.get(`/api/me/courses/${courseId}`);
      setCourse(courseResponse.data);
    } catch (error) {
      setError(true);
      message.error("Failed to load course data");
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

    if (error) {
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
          <Text>There was a problem fetching the course data.</Text>
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

    if (!course) {
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
            Sorry, we couldn&apos;t find the course you&apos;re looking for.
          </Text>
        </Card>
      );
    }

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
