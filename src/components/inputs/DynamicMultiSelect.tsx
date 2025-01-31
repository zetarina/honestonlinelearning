"use client";

import React, { useEffect, useState } from "react";
import { Select } from "antd";
import apiClient from "@/utils/api/apiClient";
import InlineLoader from "@/components/loaders/InlineLoader";

const { Option } = Select;

interface DynamicMultiSelectProps {
  endpoint: string;
  valueKey: string;
  labelKey: string;
  placeholder?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
}

const DynamicMultiSelect: React.FC<DynamicMultiSelectProps> = ({
  endpoint,
  valueKey,
  labelKey,
  placeholder = "Select options",
  value,
  onChange,
  disabled = false,
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
      mode="multiple"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
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

export default DynamicMultiSelect;
