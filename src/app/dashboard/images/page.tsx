"use client";

import React, { useEffect, useState } from 'react';
import { List, Card, message, Spin } from 'antd';
import axios from 'axios';

interface Image {
  _id: string;
  url: string;
  name: string;
  service: string;
  createdAt: string;
}

const ImagesListPage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/images');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
        message.error('Failed to fetch images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Uploaded Images" loading={loading}>
        {loading ? (
          <Spin tip="Loading images..." />
        ) : images.length === 0 ? (
          <p>No images found.</p>
        ) : (
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={images}
            renderItem={(image) => (
              <List.Item key={image._id}>
                <Card
                  cover={<img alt={image.name} src={image.url} style={{ height: '200px', objectFit: 'cover' }} />}
                >
                  <Card.Meta title={image.name} description={image.service} />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default ImagesListPage;
