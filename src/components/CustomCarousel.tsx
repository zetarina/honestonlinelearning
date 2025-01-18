"use client";

import React from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "@/styles/carousel.css";

interface CustomCarouselProps {
  children: React.ReactNode;
  slidesToShow?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  infinite?: boolean;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  children,
  slidesToShow = 3,
  autoplay = true,
  autoplaySpeed = 2000,
  infinite = true,
}) => {
  return (
    <div style={{ position: "relative", padding: "20px 0" }}>
      <Carousel
        autoplay={autoplay}
        autoplaySpeed={autoplaySpeed}
        dots
        arrows
        prevArrow={
          <button
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              padding: "1rem",
              height: "auto",
              width: "auto",
              cursor: "pointer",
              zIndex: 10,
              position: "absolute",
              top: "50%",
              left: "-40px",
              transform: "translateY(-50%)",
            }}
          >
            <LeftOutlined style={{ fontSize: "2rem", color: "#fff" }} />
          </button>
        }
        nextArrow={
          <button
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              padding: "1rem",
              height: "auto",
              width: "auto",
              cursor: "pointer",
              zIndex: 10,
              position: "absolute",
              top: "50%",
              right: "-40px",
              transform: "translateY(-50%)",
            }}
          >
            <RightOutlined style={{ fontSize: "2rem", color: "#fff" }} />
          </button>
        }
        infinite={infinite}
        slidesToShow={slidesToShow}
        swipeToSlide
        responsive={[
          { breakpoint: 1024, settings: { slidesToShow: 3 } },
          { breakpoint: 768, settings: { slidesToShow: 2 } },
          { breakpoint: 576, settings: { slidesToShow: 1 } },
        ]}
      >
        {children}
      </Carousel>
    </div>
  );
};

export default CustomCarousel;
