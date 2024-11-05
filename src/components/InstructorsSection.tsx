"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Carousel, Spin, Alert } from "antd";
import CacheImage from "@/components/CacheImage";
import axios from "axios";
import { useMediaQuery } from "react-responsive"; // To detect screen size

const { Title, Text } = Typography;

interface Instructor {
  id: number;
  name: string;
  bio: string;
  avatar: string;
}

const InstructorsSection: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Media queries to detect screen size
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get<Instructor[]>("/api/instructors");
        if (response.data && Array.isArray(response.data)) {
          setInstructors(response.data);
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
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "60px 0", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "60px 20px" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  // Custom function to group instructors based on the number of columns
  const groupInstructors = (instructors: Instructor[], columns: number) => {
    const groups = [];
    for (let i = 0; i < instructors.length; i += columns) {
      groups.push(instructors.slice(i, i + columns));
    }
    return groups;
  };

  // Set the number of columns based on the screen size
  const columns = isMobile ? 1 : isTablet ? 2 : 5;
  const instructorGroups = groupInstructors(instructors, columns);

  return (
    <div style={{ padding: "60px 0", backgroundColor: "rgb(0, 21, 41)" }}>
      <Title level={2} style={{ textAlign: "center", color: "white" }}>
        Meet Our Instructors
      </Title>

      {instructors && instructors.length && instructors.length > 0 ? (
        <Carousel autoplay dots={true} style={{ marginTop: "40px" }}>
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
                      <CacheImage
                        src={instructor.avatar}
                        alt={instructor.name || instructor.username}
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
                        {instructor.name || instructor.username}
                      </Title>
                      <Text style={{ color: "white" }}>{instructor.bio}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Carousel>
      ) : (
        <div style={{ textAlign: "center", padding: "20px", color: "white" }}>
          <Text>No instructors available at the moment.</Text>
        </div>
      )}
    </div>
  );
};

export default InstructorsSection;
