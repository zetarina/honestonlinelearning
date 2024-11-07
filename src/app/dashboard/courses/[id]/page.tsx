"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { message, Spin } from "antd";
import { Course } from "@/models/CourseModel";
import CourseForm from "@/components/forms/CourseForm";
import apiClient from "@/utils/api/apiClient";

const CourseEditPage: React.FC = () => {
  
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;

  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        try {
          const response = await apiClient.get(`/courses/${courseId}`);
          if (response.status === 200) {
            const data = await response.data;
            setCourseData(data);
          } else {
            message.error("Failed to fetch course data");
            router.push("/dashboard/courses");
          }
        } catch (error) {
          console.error("Error fetching course:", error);
          message.error("An error occurred while fetching the course data");
          router.push("/dashboard/courses");
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [courseId, router]);

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "0 auto", marginTop: "100px" }}
      />
    );
  }

  return courseData ? (
    <CourseForm course={courseData} />
  ) : (
    <p>Course not found</p>
  );
};

export default CourseEditPage;
