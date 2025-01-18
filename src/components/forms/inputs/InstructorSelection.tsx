import React from "react";
import { Form } from "antd";
import DynamicDropdown from "./DynamicDropdown";

const InstructorSelection: React.FC = () => {
  return (
    <Form.Item
      label="Instructor"
      name="instructorId"
      rules={[{ required: true, message: "Please select an instructor!" }]}
    >
      <DynamicDropdown
        endpoint="/instructors"
        valueKey="_id"
        labelKey="username"
        placeholder="Select an instructor"
      />
    </Form.Item>
  );
};

export default InstructorSelection;
