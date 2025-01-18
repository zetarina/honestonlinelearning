"use client";

import React from "react";
import { Row, Col, Card, Typography, Avatar, Rate, Carousel } from "antd";
import { useSettings } from "@/contexts/SettingsContext";
import { SITE_SETTINGS_KEYS } from "@/config/settings/SITE_SETTINGS_KEYS";

const { Title, Text } = Typography;

interface Review {
  name: string;
  comment: string;
}

const ReviewsSection: React.FC = () => {
  const { settings } = useSettings();

  // Safely fetch reviews from settings
  const studentReviews: Review[] =
    settings[SITE_SETTINGS_KEYS.STUDENT_REVIEWS] || [];

  // Render nothing if there are no reviews
  if (!studentReviews.length) {
    return null;
  }

  return (
    <div
      style={{
        padding: "80px 20px",
        background: "linear-gradient(180deg, #ffffff, #f0f2f5)",
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#001529",
        }}
      >
        What Our Students Say
      </Title>

      <Carousel
        autoplay
        dots={{ className: "custom-carousel-dots" }}
        dotPosition="bottom"
        style={{ paddingBottom: "10px" }}
      >
        {studentReviews.map((review, index) => (
          <div key={index}>
            <Row
              justify="center"
              align="middle"
              style={{
                marginBottom: "20px",
                minHeight: "250px", // Set a fixed height for better alignment
              }}
            >
              <Col xs={24} md={16} lg={10}>
                <Card
                  hoverable
                  style={{
                    maxWidth: "100%",
                    margin: "0 auto",
                    borderRadius: "16px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  bodyStyle={{
                    padding: "24px",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform =
                      "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform =
                      "scale(1)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Avatar
                      src={"/images/default-avatar.webp"}
                      size={72}
                      style={{
                        marginRight: "16px",
                        border: "3px solid #1890ff",
                      }}
                    />
                    <div>
                      <Title
                        level={4}
                        style={{ marginBottom: "4px", fontSize: "20px" }}
                      >
                        {review.name}
                      </Title>
                      <Rate
                        disabled
                        defaultValue={5}
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                  </div>
                  <Text
                    style={{
                      display: "block",
                      fontSize: "16px",
                      lineHeight: "1.8",
                      color: "#595959",
                    }}
                  >
                    {review.comment}
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
