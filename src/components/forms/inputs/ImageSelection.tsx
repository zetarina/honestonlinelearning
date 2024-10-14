import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, List, Card, message, Spin, Input } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import axios from "axios";

interface Image {
  _id: string;
  url: string;
  name: string;
  service: string;
  createdAt: string;
}

interface ImageSelectionProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ImageSelection: React.FC<ImageSelectionProps> = ({
  value = "",
  onChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string>(value);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleImages, setVisibleImages] = useState<Image[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const batchSize = 8;

  useEffect(() => {
    if (value !== url) {
      setUrl(value);
    }
  }, [value]);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/images");
        setImages(response.data);
        setFilteredImages(response.data);
        setVisibleImages(response.data.slice(0, batchSize));
        setImageIndex(batchSize);
      } catch (error) {
        message.error("Failed to fetch images.");
      } finally {
        setLoading(false);
      }
    };

    if (isModalOpen) {
      fetchImages();
    }
  }, [isModalOpen]);

  const loadMoreImages = () => {
    const nextBatch = filteredImages.slice(imageIndex, imageIndex + batchSize);
    setVisibleImages((prevImages) => [...prevImages, ...nextBatch]);
    setImageIndex((prevIndex) => prevIndex + batchSize);
  };

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && imageIndex < filteredImages.length) {
        loadMoreImages();
      }
    });

    const sentinel = sentinelRef.current;
    if (sentinel) observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [imageIndex, filteredImages]);

  const handleSelect = (url: string) => {
    setUrl(url);
    if (onChange) onChange(url);
    setIsModalOpen(false);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    if (onChange) onChange(value);

    const urlPattern = /^(\/|https?:\/\/)/;
    if (!urlPattern.test(value)) {
      setError(
        "Please enter a valid URL or path starting with '/' or 'http(s)://'"
      );
    } else {
      setError(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = images.filter((image) =>
      image.name.toLowerCase().includes(searchValue)
    );
    setFilteredImages(filtered);
    setVisibleImages(filtered.slice(0, batchSize));
    setImageIndex(batchSize);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Input
          value={url}
          placeholder="image URL or path (e.g. /images/my-image.jpg)"
          onChange={handleUrlChange}
          style={{ borderRadius: "4px", width: "70%" }}
        />
        <Button
          icon={<PictureOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{
            borderRadius: "4px",
            padding: "4px 12px",
            border: "1px solid #d9d9d9",
          }}
        ></Button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Modal
        title="Select Image"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Input
          placeholder="Search images..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: "16px" }}
        />

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <Spin size="large" />
          </div>
        ) : filteredImages.length === 0 ? (
          <p>No images found.</p>
        ) : (
          <>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={visibleImages}
              renderItem={(image) => (
                <List.Item key={image._id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={image.name}
                        src={image.url}
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                    }
                    onClick={() => handleSelect(image.url)}
                  >
                    <Card.Meta title={image.name} description={image.service} />
                  </Card>
                </List.Item>
              )}
            />
            {imageIndex < filteredImages.length && (
              <div
                ref={sentinelRef}
                style={{
                  height: "50px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin />
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default ImageSelection;
