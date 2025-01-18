"use client";

import React from "react";
import { Typography, Spin, Alert } from "antd";
import ImageComponent from "@/components/ImageComponent";
import { useSettings } from "@/contexts/SettingsContext";
import { SITE_SETTINGS_KEYS } from "@/config/settings/SITE_SETTINGS_KEYS";
import apiClient from "@/utils/api/apiClient";
import CustomCarousel from "@/components/CustomCarousel";

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

  return (
    <div style={{ padding: "60px 0", backgroundColor: "rgb(0, 21, 41)" }}>
      <Title
        level={2}
        style={{
          textAlign: "center",
          color: "white",
          marginBottom: "40px",
        }}
      >
        Meet Our Instructors
      </Title>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Spin size="large" tip="Loading instructors..." />
        </div>
      )}

      {error ? (
        <div style={{ padding: "60px 20px" }}>
          <Alert message="Error" description={error} type="error" showIcon />
        </div>
      ) : instructors.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: "white" }}>
          <Text>No instructors available at the moment.</Text>
        </div>
      ) : (
        <div style={{ margin: "0 auto" }}>
          <CustomCarousel autoplay slidesToShow={3} dots infinite>
            {instructors.map((instructor) => (
              <div
                key={instructor.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "20px",
                  margin: "0 auto",
                  height: "300px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
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
                  <Title
                    level={4}
                    style={{
                      color: "white",
                      margin: "10px 0 5px",
                    }}
                  >
                    {instructor.name}
                  </Title>
                  <Text style={{ color: "white", fontSize: "14px" }}>
                    {instructor.bio}
                  </Text>
                </div>
              </div>
            ))}
          </CustomCarousel>
        </div>
      )}
    </div>
  );
};

export default InstructorsSection;
