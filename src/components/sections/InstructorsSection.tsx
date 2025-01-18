"use client";

import React from "react";
import { Row, Col, Typography, Carousel, Spin, Alert } from "antd";
import ImageComponent from "@/components/ImageComponent";
import { useMediaQuery } from "react-responsive";
import { useSettings } from "@/contexts/SettingsContext";
import { SITE_SETTINGS_KEYS } from "@/config/settings/SITE_SETTINGS_KEYS";
import apiClient from "@/utils/api/apiClient";

const { Title, Text } = Typography;

interface Instructor {
  id: number;
  name: string;
  bio: string;
  avatar: string;
}

const InstructorsSection: React.FC = () => {
  const { settings } = useSettings();
  const maxInstructorsCount =
    settings[SITE_SETTINGS_KEYS.MAX_INSTRUCTORS_COUNT] || 5;

  const [instructors, setInstructors] = React.useState<Instructor[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Media queries to detect screen size
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  React.useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await apiClient.get<Instructor[]>("/instructors");
        if (response.data && Array.isArray(response.data)) {
          setInstructors(response.data.slice(0, maxInstructorsCount));
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err: any) {
        console.error("Failed to fetch instructors:", err);
        setError("Unable to load instructors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [maxInstructorsCount]);

  // Group instructors for carousel slides based on the number of columns
  const columns = isMobile ? 1 : isTablet ? 2 : 5;
  const groupInstructors = (instructors: Instructor[], columns: number) => {
    const groups = [];
    for (let i = 0; i < instructors.length; i += columns) {
      groups.push(instructors.slice(i, i + columns));
    }
    return groups;
  };
  const instructorGroups = groupInstructors(instructors, columns);

  return (
    <div style={{ padding: "60px 0", backgroundColor: "rgb(0, 21, 41)" }}>
      <Title level={2} style={{ textAlign: "center", color: "white" }}>
        Meet Our Instructors
      </Title>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Spin size="large" tip="Loading instructors..." />
        </div>
      )}

      {error ? (
        <div style={{ padding: "60px 20px" }}>
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
          />
        </div>
      ) : instructors.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: "white" }}>
          <Text>No instructors available at the moment.</Text>
        </div>
      ) : (
        <Carousel autoplay dots={{ className: "custom-carousel-dots" }}>
          {instructorGroups.map((group, index) => (
            <div key={index}>
              <Row justify="center" gutter={[24, 24]}>
                {group.map((instructor) => (
                  <Col key={instructor.id} xs={24} sm={12} md={8} lg={4}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      <ImageComponent
                        src={instructor.avatar}
                        alt={instructor.name}
                        width={120}
                        height={120}
                        objectFit="cover"
                        style={{
                          borderRadius: "50%",
                          border: "4px solid #1890ff",
                          marginBottom: "10px",
                        }}
                        priority
                      />
                      <Title level={4} style={{ color: "white" }}>
                        {instructor.name}
                      </Title>
                      <Text style={{ color: "white" }}>{instructor.bio}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default InstructorsSection;
