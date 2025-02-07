"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Result, Button, Card } from "antd";
import CourseForm from "@/components/forms/CourseForm";
import apiClient from "@/utils/api/apiClient";
import SubLoader from "@/components/loaders/SubLoader";
import { CourseAPI } from "@/models/CourseModel";

const CourseEditPage: React.FC = () => {
  const [courseData, setCourseData] = useState<CourseAPI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;

  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await apiClient.get(`/courses/${courseId}`);
          if (response.status === 200) {
            setCourseData(response.data);
          } else {
            setError("Failed to fetch course data");
          }
        } catch (error) {
          console.error("Error fetching course:", error);
          setError("An error occurred while fetching the course data");
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    } else {
      setError("Invalid course ID.");
      setLoading(false);
    }
  }, [courseId]);

  return (
    <>
      {loading ? (
        <SubLoader tip="Loading course..." />
      ) : error ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Card>
            <Result
              status="error"
              title="Error"
              subTitle={error}
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/dashboard/courses")}
                >
                  Back to Courses
                </Button>
              }
            />
          </Card>
        </div>
      ) : courseData ? (
        <CourseForm course={courseData} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Card>
            <Result
              status="warning"
              title="Course Not Found"
              subTitle="The course does not exist or has been removed."
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/dashboard/courses")}
                >
                  Back to Courses
                </Button>
              }
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default CourseEditPage;
