import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, List, Card, message, Spin, Input, Tooltip } from "antd";
import { PictureOutlined, EyeOutlined, SyncOutlined } from "@ant-design/icons";

import { ImageObj } from "@/models/ImageModel";
import apiClient from "@/utils/api/apiClient";

interface ImageSelectionProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ImageSelection: React.FC<ImageSelectionProps> = ({
  value = "",
  onChange,
}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<ImageObj[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [url, setUrl] = useState<string>(value);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const batchSize = 12;

  useEffect(() => {
    setUrl(value);
  }, [value]);

  const fetchImages = async (search: string, page: number) => {
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

  const syncImages = async () => {
    setSyncing(true);
    try {
      await apiClient.post("/images/sync");
      message.success("Images synced successfully!");
      fetchImages(searchTerm, 1);
    } catch (error) {
      message.error("Failed to sync images.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
    fetchImages(e.target.value, 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: scrollableContainerRef.current,
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    if (page > 1) fetchImages(searchTerm, page);
  }, [page]);

  useEffect(() => {
    if (isModalOpen) fetchImages(searchTerm, 1);
  }, [isModalOpen]);

  return (
    <>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Input
          value={url}
          placeholder="Image URL or path"
          onChange={(e) => setUrl(e.target.value)}
          size="large"
          style={{ flex: 1 }}
        />
        <Tooltip title="Sync Images">
          <Button
            icon={<SyncOutlined spin={syncing} />}
            onClick={syncImages}
            size="large"
            disabled={syncing}
          />
        </Tooltip>
        <Button
          icon={<PictureOutlined />}
          onClick={() => setIsModalOpen(true)}
          size="large"
        />
      </div>

      <Modal
        title="Select Image"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="80%"
        styles={{
          body: { height: "75vh", padding: 16, overflow: "hidden" },
        }}
      >
        <Input
          placeholder="Search images..."
          value={searchTerm}
          onChange={handleSearch}
          size="large"
          style={{ marginBottom: 16 }}
        />

        <div
          ref={scrollableContainerRef}
          style={{
            height: "calc(75vh - 120px)",
            overflowY: "scroll",
            position: "relative",
          }}
        >
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
            }}
            dataSource={images}
            renderItem={(image) => (
              <List.Item key={image._id.toString()}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={image.name}
                      src={image.url}
                      style={{ height: 180, objectFit: "contain" }}
                    />
                  }
                  onClick={() => {
                    setUrl(image.url);
                    onChange?.(image.url);
                    setIsModalOpen(false);
                  }}
                >
                  <Card.Meta title={image.name} description={image.service} />
                </Card>
                <Button
                  icon={<EyeOutlined />}
                  shape="circle"
                  onClick={() => window.open(image.url, "_blank")}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    border: "none",
                  }}
                />
              </List.Item>
            )}
          />
          <div ref={observerRef} style={{ height: 1 }} />
          {loading && (
            <Spin size="large" style={{ display: "block", margin: "auto" }} />
          )}
          {!hasMore && <p style={{ textAlign: "center" }}>No more images</p>}
        </div>
      </Modal>
    </>
  );
};

export default ImageSelection;
