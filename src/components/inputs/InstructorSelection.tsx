import React from "react";
import { Form } from "antd";
import DynamicDropdown from "./DynamicDropdown";

const InstructorSelection: React.FC = () => {
  return (
    <DynamicDropdown
      endpoint="/instructors"
      valueKey="_id"
      labelKey="username"
      placeholder="Select an instructor"
    />
  );
};

export default InstructorSelection;
