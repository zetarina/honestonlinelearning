"use client";

import React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";

interface AntdStyleRegistryProps {
  children: React.ReactNode;
}

const AntdStyleRegistry: React.FC<AntdStyleRegistryProps> = ({ children }) => {
  const cache = createCache();

  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{
        __html: extractStyle(cache),
      }}
    />
  ));

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider>{children}</ConfigProvider>
    </StyleProvider>
  );
};

export default AntdStyleRegistry;
