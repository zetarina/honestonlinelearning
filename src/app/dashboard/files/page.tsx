"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  List,
  Card,
  message,
  Spin,
  Button,
  Popconfirm,
  Input,
  Tooltip,
  Typography,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SyncOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { FileDataAPI } from "@/models/FileModel";
import apiClient from "@/utils/api/apiClient";

const FileListPage: React.FC = () => {
  const [files, setFiles] = useState<FileDataAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const batchSize = 12;

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchFiles = async (search = "", page = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get("/files", {
        params: { search, page, limit: batchSize },
      });

      const newFiles = response.data.files;
      setFiles((prev) => (page === 1 ? newFiles : [...prev, ...newFiles]));
      setHasMore(response.data.hasMore);
    } catch (error) {
      message.error("Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  const syncFiles = async () => {
    setSyncing(true);
    try {
      const response = await apiClient.post("/files/sync");
      message.success(response.data.message);
      setPage(1);
      fetchFiles(searchTerm, 1);
    } catch (error) {
      message.error("Failed to sync files.");
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await apiClient.delete(`/files/${fileId}`);
      setFiles((prev) => prev.filter((file) => file._id !== fileId));
      message.success("File deleted successfully.");
    } catch (error) {
      message.error("Failed to delete file.");
    }
  };

  const openFile = (url: string) => {
    window.open(url, "_blank");
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  useEffect(() => {
    fetchFiles(searchTerm, 1);
  }, [searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore, loading]);

  useEffect(() => {
    if (page > 1) fetchFiles(searchTerm, page);
  }, [page]);

  const getFileThumbnail = (file: FileDataAPI) => {
    if (file.type === "image") {
      return (
        <img
          alt={file.name}
          src={file.publicUrl}
          style={{
            width: "100%",
            height: "280px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      );
    }
    if (file.type === "video") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "180px",
            background: "#000",
            color: "#fff",
            fontSize: "24px",
            borderRadius: "8px",
          }}
        >
          <VideoCameraOutlined style={{ fontSize: "48px" }} />
        </div>
      );
    }
    if (file.type === "document") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "180px",
            background: "#f5f5f5",
            fontSize: "24px",
            borderRadius: "8px",
          }}
        >
          {file.contentType && file.contentType.includes("pdf") ? (
            <FilePdfOutlined style={{ color: "red", fontSize: "48px" }} />
          ) : file.contentType && file.contentType.includes("word") ? (
            <FileWordOutlined style={{ color: "blue", fontSize: "48px" }} />
          ) : (
            <FileTextOutlined style={{ fontSize: "48px" }} />
          )}
        </div>
      );
    }
    return null;
  };

  const renderFileCard = (file: FileDataAPI) => (
    <List.Item key={file._id.toString()} style={{ marginBottom: 16 }}>
      <Card
        hoverable
        cover={getFileThumbnail(file)}
        actions={[
          <Tooltip title="View File" key="view">
            <Button
              icon={<EyeOutlined />}
              shape="circle"
              onClick={() => openFile(file.publicUrl)}
            />
          </Tooltip>,
          <Popconfirm
            title="Are you sure you want to delete this file?"
            onConfirm={() => handleDelete(file._id.toString())}
            okText="Yes"
            cancelText="No"
            key="delete"
          >
            <Tooltip title="Delete File">
              <Button icon={<DeleteOutlined />} danger shape="circle" />
            </Tooltip>
          </Popconfirm>,
        ]}
      >
        <Card.Meta title={file.name} description={file.service} />
        {/* <Typography.Text>{file.uploadedBy}</Typography.Text> */}
      </Card>
    </List.Item>
  );

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
          gap: "8px",
        }}
      >
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ flexGrow: 1 }}
        />
        <Tooltip title="Sync Files">
          <Button
            icon={<SyncOutlined spin={syncing} />}
            onClick={syncFiles}
            loading={syncing}
          />
        </Tooltip>
      </div>

      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={files}
        renderItem={renderFileCard}
        locale={{ emptyText: "No files found" }}
      />

      <div ref={observerRef} style={{ height: "1px", margin: "10px 0" }}>
        {loading && (
          <Spin size="large" style={{ display: "block", margin: "auto" }} />
        )}
      </div>

      {!hasMore && (
        <p style={{ textAlign: "center", padding: "12px 0" }}>No more files</p>
      )}
    </div>
  );
};

export default FileListPage;
