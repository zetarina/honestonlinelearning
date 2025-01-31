"use client";
import React from "react";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedCoursesSection from "@/components/sections/FeaturedCoursesSection";
import InstructorsSection from "@/components/sections/InstructorsSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ContactUsSection from "@/components/sections/ContactUsSection";

interface Section {
  id: string;
  component: React.ReactNode;
}

const sections: Section[] = [
  { id: "hero", component: <HeroSection /> },
  { id: "courses", component: <FeaturedCoursesSection /> },
  { id: "instructors", component: <InstructorsSection /> },
  { id: "reviews", component: <ReviewsSection /> },
  { id: "contact", component: <ContactUsSection /> },
];

export default function HomePage(): JSX.Element {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id}>{section.component}</section>
      ))}
    </>
  );
}
