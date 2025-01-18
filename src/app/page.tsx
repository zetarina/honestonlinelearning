
"use client";
import React from "react";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedCoursesSection from "@/components/sections/FeaturedCoursesSection";
import InstructorsSection from "@/components/sections/InstructorsSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ContactUsSection from "@/components/sections/ContactUsSection";

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
