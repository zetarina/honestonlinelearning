import React, { useEffect, useState } from "react";
import { Select, Spin, message } from "antd";
import apiClient from "@/utils/api/apiClient";

const { Option } = Select;

interface CourseSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({ value, onChange }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/courses");
        setCourses(response.data);
      } catch (error) {
        message.error("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="Select a course"
      notFoundContent="No courses found"
    >
      {courses.map((course: any) => (
        <Option key={course._id} value={course._id}>
          {course.title}
        </Option>
      ))}
    </Select>
  );
};

export default CourseSelector;
