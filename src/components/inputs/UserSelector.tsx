import React from "react";
import DynamicDropdown from "./DynamicDropdown";

interface UserSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ value, onChange }) => {
  return (
    <DynamicDropdown
      endpoint="/users"
      valueKey="_id"
      labelKey="username"
      placeholder="Select a user"
      value={value}
      onChange={onChange}
    />
  );
};

export default UserSelector;
