import React, { useEffect, useState } from "react";
import { Form, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const InstructorSelection: React.FC = () => {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const { data } = await axios.get("/api/instructors");
        setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        message.error("Failed to load instructors.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  return (
    <Form.Item
      label="Instructor"
      name="instructorId"
      rules={[{ required: true, message: "Please select an instructor!" }]}
    >
      <Select
        placeholder="Select an instructor"
        loading={loading}
        disabled={loading}
      >
        {instructors.map((instructor) => (
          <Option key={instructor._id} value={instructor._id}>
            {instructor.username}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default InstructorSelection;
