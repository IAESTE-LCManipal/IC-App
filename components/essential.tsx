"use client";
import React from 'react';
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function Essentials() {
  return (
    <div className="max-w-5xl mx-auto px-8">
        <span className="flex justify-center mt-8 text-3xl font-bold text-white">Everyday Essentials</span>
      <HoverEffect items={Essential} />
    </div>
  );
}
export const Essential = [
  {
    title: "Wifi Password",
    description:
      "",
    link: "tel:+91 9881132571",
  },
  {
    title: "Zain Hussain",
    description:
      "Professor's Contact",
    link: "tel:+91 9711360035",
  },
];
