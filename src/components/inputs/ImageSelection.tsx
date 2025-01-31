import React, { useState, useRef, useEffect, useCallback } from "react";
import { Modal, Button, List, Card, Spin, Input, Tooltip, Space } from "antd";
import { PictureOutlined, EyeOutlined, SyncOutlined } from "@ant-design/icons";
import { useImagePicker } from "@/contexts/FilePickerContext";

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
  const [hasMore, setHasMore] = useState(true);

  const { images, loading, fetchImages, syncImages } = useImagePicker();
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  /** ✅ Handle Search & Reset Pagination */
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearch = e.target.value;
      setSearchTerm(newSearch);
      setPage(1);
      fetchImages(newSearch, 1);
    },
    [fetchImages]
  );

  /** ✅ Fetch More Images on Scroll */
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          fetchImages(searchTerm, nextPage).then(() => setPage(nextPage));
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
  }, [searchTerm, page, hasMore, loading]);

  /** ✅ Refetch Images on Modal Open */
  useEffect(() => {
    if (isModalOpen) {
      fetchImages(searchTerm, 1);
      setPage(1);
    }
  }, [isModalOpen, fetchImages, searchTerm]);

  /** ✅ Handle Image Selection */
  const handleImageSelect = (imageUrl: string) => {
    onChange?.(imageUrl);
    setIsModalOpen(false);
  };

  return (
    <>
      <Space.Compact style={{ width: "100%", display: "flex" }}>
        <Input
          value={value}
          placeholder="Image URL"
          style={{
            borderRadius: "8px 0 0 8px",
          }}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Sync Images">
            <Button
              icon={<SyncOutlined />}
              onClick={syncImages}
              loading={loading}
              style={{
                backgroundColor: "#1890ff",
                color: "#fff",
                border: "none",
                borderRadius: "0",
              }}
            />
          </Tooltip>
          <Tooltip title="Choose Image">
            <Button
              icon={<PictureOutlined />}
              onClick={() => setIsModalOpen(true)}
              style={{
                backgroundColor: "#52c41a",
                color: "#fff",
                border: "none",
              }}
            />
          </Tooltip>
        </div>
      </Space.Compact>

      <Modal
        title="Select Image"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="100%"
        styles={{
          body: {
            height: "75vh",
            overflow: "hidden",
            padding: 0,
          },
        }}
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
                      src={image.publicUrl}
                      style={{
                        height: 280,
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  }
                  onClick={() => handleImageSelect(image.publicUrl)}
                >
                  <Button
                    icon={<EyeOutlined />}
                    shape="circle"
                    onClick={() => window.open(image.publicUrl, "_blank")}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      border: "none",
                    }}
                  />
                  <Card.Meta title={image.name} description={image.service} />
                </Card>
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
