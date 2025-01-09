import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, List, Card, Spin, Input, Tooltip } from "antd";
import { PictureOutlined, EyeOutlined, SyncOutlined } from "@ant-design/icons";
import { useImagePicker } from "@/contexts/ImagePickerContext";

interface ImageSelectionProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ImageSelection: React.FC<ImageSelectionProps> = ({
  value = "",
  onChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const { images, loading, fetchImages, syncImages } = useImagePicker();
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
    fetchImages(e.target.value, 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchImages(searchTerm, page + 1);
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
  }, [searchTerm, page]);

  useEffect(() => {
    if (isModalOpen) {
      fetchImages(searchTerm, 1);
    }
  }, [isModalOpen]);

  const handleImageSelect = (imageUrl: string) => {
    onChange?.(imageUrl);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "1px solid #d9d9d9",
        }}
      >
        <Input
          value={value}
          placeholder="Image URL"
          onChange={(e) => onChange?.(e.target.value)}
          size="large"
          style={{
            flex: 1,
            border: "none",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        />
        <Tooltip title="Sync Images">
          <Button
            icon={<SyncOutlined />}
            onClick={syncImages}
            size="large"
            style={{
              backgroundColor: "#1890ff",
              color: "#fff",
              border: "none",
            }}
          />
        </Tooltip>
        <Button
          icon={<PictureOutlined />}
          onClick={() => setIsModalOpen(true)}
          size="large"
          style={{
            backgroundColor: "#52c41a",
            color: "#fff",
            border: "none",
          }}
        />
        {value && (
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #d9d9d9",
              backgroundColor: "#f0f0f0",
              marginLeft: "12px",
            }}
          >
            <img
              src={value}
              alt="Selected"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = ""; // Fallback for invalid URLs
              }}
            />
          </div>
        )}
      </div>

      <Modal
        title="Select Image"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="80%"
        styles={{
          body: {
            height: "75vh",
            overflow: "hidden",
            padding: "16px",
          },
        }} // Updated to use styles.body
      >
        <Input
          placeholder="Search images..."
          value={searchTerm}
          onChange={handleSearch}
          size="large"
          style={{
            marginBottom: "16px",
            borderRadius: "8px",
            border: "1px solid #d9d9d9",
          }}
        />

        <div
          ref={scrollableContainerRef}
          style={{
            height: "calc(75vh - 100px)",
            overflowY: "scroll",
            position: "relative",
            padding: "8px",
            backgroundColor: "#fafafa",
            borderRadius: "8px",
            border: "1px solid #d9d9d9",
          }}
        >
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={images}
            renderItem={(image) => (
              <List.Item key={image._id as string}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={image.name}
                      src={image.url}
                      style={{
                        height: 180,
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  }
                  onClick={() => handleImageSelect(image.url)}
                />
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
        </div>
      </Modal>
    </>
  );
};

export default ImageSelection;
