import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Modal,
  Button,
  List,
  Card,
  message,
  Spin,
  Input,
  Tooltip,
} from "antd";
import { PictureOutlined, EyeOutlined, SyncOutlined } from "@ant-design/icons";
import axios from "axios";
import { ImageObj } from "@/models/ImageModel";

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
  const observerRef = useRef<HTMLDivElement>(null); // Intersection observer ref
  const batchSize = 12;

  // Fetch images from the API
  const fetchImages = async (search: string, page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/images?search=${search}&page=${page}&limit=${batchSize}`
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
      const response = await axios.post("/api/images/sync");
      message.success(response.data.message);
      setPage(1);
      fetchImages(searchTerm, 1);
    } catch (error) {
      message.error("Failed to sync images.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    fetchImages(value, 1);
  };

  // Initialize IntersectionObserver to load more images
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: scrollableContainerRef.current, // Use scrollable container as root
        rootMargin: "100px", // Trigger slightly before reaching the bottom
        threshold: 0.1,
      }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore, loading]);

  // Fetch images when page changes
  useEffect(() => {
    if (page > 1) fetchImages(searchTerm, page);
  }, [page]);

  useEffect(() => {
    if (isModalOpen) fetchImages(searchTerm, 1);
  }, [isModalOpen, searchTerm]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Input
          value={url}
          placeholder="Image URL or path"
          onChange={(e) => setUrl(e.target.value)}
          size="large"
          style={{ flexGrow: 1 }}
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
        bodyStyle={{ padding: "16px", height: "75vh", overflow: "hidden" }}
        centered
      >
        <Input
          placeholder="Search images..."
          value={searchTerm}
          onChange={handleSearch}
          size="large"
          style={{ marginBottom: "16px" }}
        />

        <div
          ref={scrollableContainerRef}
          style={{
            height: "calc(75vh - 120px)",
            overflowY: "scroll",
            overflowX: "hidden",
            position: "relative",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={images}
            renderItem={(image) => (
              <List.Item key={image._id.toString()}>
                <div style={{ position: "relative" }}>
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
                      top: "8px",
                      right: "8px",
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                      border: "none",
                    }}
                  />
                </div>
              </List.Item>
            )}
          />

          <div ref={observerRef} style={{ height: "1px" }} />

          {loading && (
            <Spin size="large" style={{ display: "block", margin: "auto" }} />
          )}

          {!hasMore && (
            <p style={{ textAlign: "center", marginTop: "12px" }}>
              No more images
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ImageSelection;
