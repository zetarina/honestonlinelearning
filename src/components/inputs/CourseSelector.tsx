import React from "react";
import DynamicDropdown from "./DynamicDropdown";

interface CourseSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({ value, onChange }) => {
  return (
    <DynamicDropdown
      endpoint="/courses"
      valueKey="_id"
      labelKey="title"
      placeholder="Select a course"
      value={value}
      onChange={onChange}
    />
  );
};

export default CourseSelector;
