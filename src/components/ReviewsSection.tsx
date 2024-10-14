// components/ReviewsSection.tsx
"use client";
import React from "react";
import { Row, Col, Card, Typography, Avatar, Rate, Carousel } from "antd";
import { useMediaQuery } from 'react-responsive';

const { Title, Text } = Typography;

interface Review {
  id: number;
  name: string;
  review: string;
  rating: number;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Alice Johnson",
    review: "This platform is amazing! The courses are well-structured and easy to follow.",
    rating: 5,
    avatar: "/images/default-avatar.webp",
  },
  {
    id: 2,
    name: "Mark Williams",
    review: "I learned so much from the Node.js course. Highly recommend it!",
    rating: 4,
    avatar: "/images/default-avatar.webp",
  },
];

const ReviewsSection = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div
      style={{
        padding: "80px 20px",
        background: "linear-gradient(180deg, #f0f2f5, #ffffff)",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
        What Our Students Say
      </Title>
      <Carousel
        autoplay
        dots={{ className: "custom-carousel-dots" }}  // Custom carousel indicators
        dotPosition="bottom"
        effect="scrollx"  // Smooth scroll effect for better UX
      >
        {reviews.map((review) => (
          <div key={review.id}>
            <Row justify="center" gutter={[24, 24]} style={{ padding: "0 20px" }}>
              <Col xs={24} sm={18} md={14} lg={10}>
                <Card
                  hoverable
                  style={{
                    maxWidth: "100%",
                    margin: "0 auto",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s",
                  }}
                  styles={{ body: { padding: "20px" }}}
                 
                >
                  <Card.Meta
                    avatar={<Avatar src={review.avatar} size={64} />}
                    title={
                      <Title level={4} style={{ marginBottom: "8px", fontSize: "18px" }}>
                        {review.name}
                      </Title>
                    }
                    description={<Rate disabled defaultValue={review.rating} style={{ marginBottom: "16px" }} />}
                  />
                  <Text style={{ display: "block", marginTop: "12px", fontSize: "16px", lineHeight: "1.6" }}>
                    {review.review}
                  </Text>
                </Card>
              </Col>
            </Row>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ReviewsSection;
