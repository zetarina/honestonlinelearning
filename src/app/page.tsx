
"use client";
import React from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedCoursesSection from "@/components/FeaturedCoursesSection";
import InstructorsSection from "@/components/InstructorsSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactUsSection from "@/components/ContactUsSection";

export default function HomePage(): JSX.Element {
  return (
    <div>
      <HeroSection />
      <FeaturedCoursesSection />
      <InstructorsSection />
      <ReviewsSection />
      <ContactUsSection />
    </div>
  );
}
