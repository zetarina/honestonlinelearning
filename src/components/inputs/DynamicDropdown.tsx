import React, { useEffect, useState } from "react";
import { Select } from "antd";
import apiClient from "@/utils/api/apiClient";
import InlineLoader from "@/components/loaders/InlineLoader";

const { Option } = Select;

interface DynamicDropdownProps {
  endpoint: string;
  valueKey: string;
  labelKey: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const DynamicDropdown: React.FC<DynamicDropdownProps> = ({
  endpoint,
  valueKey,
  labelKey,
  placeholder = "Select an option",
  value,
  onChange,
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(endpoint);
        setOptions(response.data || []);
      } catch (err) {
        console.error(`Failed to fetch data from ${endpoint}:`, err);
        setError("Failed to load options.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [endpoint]);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      notFoundContent={
        <InlineLoader
          loading={loading}
          error={error}
          data={options}
          emptyMessage="No options found"
          loadingMessage="Loading options..."
        />
      }
      style={{ width: "100%" }}
    >
      {options.map((option) => (
        <Option key={option[valueKey]} value={option[valueKey]}>
          {option[labelKey]}
        </Option>
      ))}
    </Select>
  );
};

export default DynamicDropdown;
