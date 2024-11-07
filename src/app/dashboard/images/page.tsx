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
} from "antd";
import { EyeOutlined, DeleteOutlined, SyncOutlined } from "@ant-design/icons";

import { ImageObj } from "@/models/ImageModel";
import apiClient from "@/utils/api/apiClient";

const ImagesListPage: React.FC = () => {
  
  const [images, setImages] = useState<ImageObj[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const batchSize = 12;

  const observerRef = useRef<HTMLDivElement | null>(null);

  // Fetch images from the server with pagination
  const fetchImages = async (search = "", page = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/images?search=${search}&page=${page}&limit=${batchSize}`
      );
      const newImages = response.data.images;
      setImages((prev) => (page === 1 ? newImages : [...prev, ...newImages]));
      setHasMore(response.data.hasMore);
    } catch (error) {
      message.error("Failed to fetch images.");
    } finally {
      setLoading(false);
    }
  };

  // Sync images with the backend
  const syncImages = async () => {
    setSyncing(true);
    try {
      const response = await apiClient.post("/images/sync");
      message.success(response.data.message);
      setPage(1);
      fetchImages(searchTerm, 1);
    } catch (error) {
      message.error("Failed to sync images.");
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await apiClient.delete(`/images/${imageId}`);
      setImages((prev) => prev.filter((img) => img._id !== imageId));
      message.success("Image deleted successfully.");
    } catch (error) {
      message.error("Failed to delete image.");
    }
  };

  const openFullImage = (url: string) => {
    window.open(url, "_blank");
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  useEffect(() => {
    fetchImages(searchTerm, 1);
  }, [searchTerm]);

  // Infinite scroll handler with Intersection Observer
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
    if (page > 1) fetchImages(searchTerm, page);
  }, [page]);

  const renderImageCard = (image: ImageObj) => (
    <List.Item key={image._id.toString()} style={{ marginBottom: 16 }}>
      <Card
        hoverable
        cover={
          <img
            alt={image.name}
            src={image.url}
            style={{
              width: "100%",
              height: "180px",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        }
        actions={[
          <Tooltip title="View Full Image" key="view">
            <Button
              icon={<EyeOutlined />}
              shape="circle"
              onClick={() => openFullImage(image.url)}
            />
          </Tooltip>,
          <Popconfirm
            title="Are you sure you want to delete this image?"
            onConfirm={() => handleDelete(image._id.toString())}
            okText="Yes"
            cancelText="No"
            key="delete"
          >
            <Tooltip title="Delete Image">
              <Button icon={<DeleteOutlined />} danger shape="circle" />
            </Tooltip>
          </Popconfirm>,
        ]}
      >
        <Card.Meta title={image.name} description={image.service} />
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
          placeholder="Search images..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ flexGrow: 1 }}
        />
        <Tooltip title="Sync Images">
          <Button
            icon={<SyncOutlined spin={syncing} />}
            onClick={syncImages}
            loading={syncing}
          />
        </Tooltip>
      </div>

      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={images}
        renderItem={renderImageCard}
        locale={{ emptyText: "No images found" }}
      />

      <div
        ref={observerRef}
        style={{
          height: "1px",
          margin: "10px 0",
          backgroundColor: "transparent",
        }}
      >
        {loading && (
          <Spin size="large" style={{ display: "block", margin: "auto" }} />
        )}
      </div>

      {!hasMore && (
        <p style={{ textAlign: "center", padding: "12px 0" }}>No more images</p>
      )}
    </div>
  );
};

export default ImagesListPage;
