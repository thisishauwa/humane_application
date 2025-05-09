"use client";
import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Hauwa Suleiman",
    designation: "Design Engineer",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 2,
    name: "Cursor AI",
    designation: "Trusty Assistant",
    image: "/placeholder.svg?height=64&width=64",
  },
];

export default function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
} 