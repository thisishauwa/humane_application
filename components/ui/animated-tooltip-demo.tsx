"use client";
import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Hauwa Suleiman",
    designation: "Design Engineer",
    image: "/hauwa.png",
  },
  {
    id: 2,
    name: "Cursor AI",
    designation: "Trusty Assistant",
    image: "/cdnlogo.com_cursor.svg",
  },
];

export default function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
} 