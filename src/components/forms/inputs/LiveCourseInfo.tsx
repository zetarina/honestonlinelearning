import React from "react";
import { Form, Input, DatePicker } from "antd";

const LiveCourseInfo: React.FC = () => {
  return (
    <>
      <Form.Item
        label="Live Course URL"
        name="liveCourseUrl"
        rules={[{ required: true, message: "Please enter the live course URL" }]}
      >
        <Input placeholder="Enter live course URL (e.g., Zoom link)" />
      </Form.Item>
      <Form.Item
        label="Start Date"
        name="startDate"
        rules={[{ required: true, message: "Please select a start date" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="End Date"
        name="endDate"
        rules={[{ required: true, message: "Please select an end date" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
    </>
  );
};

export default LiveCourseInfo;
