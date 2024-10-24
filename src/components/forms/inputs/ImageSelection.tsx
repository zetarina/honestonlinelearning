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

const localImages: Image[] = [
  // Root level images
  {
    _id: "1",
    url: "/images/android-chrome-192x192.png",
    name: "Android Chrome 192",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    url: "/images/android-chrome-512x512.png",
    name: "Android Chrome 512",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    url: "/images/apple-touch-icon.png",
    name: "Apple Touch Icon",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    url: "/images/default-avatar.webp",
    name: "Default Avatar",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    url: "/images/favicon-16x16.png",
    name: "Favicon 16x16",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6",
    url: "/images/favicon-32x32.png",
    name: "Favicon 32x32",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "7",
    url: "/images/favicon.ico",
    name: "Favicon ICO",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "8",
    url: "/images/hero.jpg",
    name: "Hero Image",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "9",
    url: "/images/logo.png",
    name: "Logo",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  // Courses directory images
  {
    _id: "11",
    url: "/images/courses/ItCC.png",
    name: "ITCC Course",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "12",
    url: "/images/courses/MYS.png",
    name: "MYS Course",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "13",
    url: "/images/courses/PGtHR.png",
    name: "PGtHR Course",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "14",
    url: "/images/courses/SHC.png",
    name: "SHC Course",
    service: "Local",
    createdAt: new Date().toISOString(),
  },
];

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
        const allImages = [...response.data, ...localImages]; // Combine API and local images
        setImages(allImages);
        setFilteredImages(allImages);
        setVisibleImages(allImages.slice(0, batchSize));
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
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Input
          value={url}
          placeholder="image URL or path (e.g. /images/my-image.jpg)"
          onChange={handleUrlChange}
          style={{ borderRadius: "4px", flexGrow: 1 }} // Apply flex-grow here
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
