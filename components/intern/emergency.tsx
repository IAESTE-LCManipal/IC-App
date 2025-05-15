"use client";
import React from 'react';
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function Emergency() {
    return (
    <div className="max-w-5xl mx-auto px-8">
        <span className="flex justify-center mt-8 text-3xl font-bold text-white">Emergency Contacts</span>
      <HoverEffect items={projects} />
    </div>
  );
}
  export const projects = [
  {
    title: "Vineet Nijamkar",
    description:
      "Incoming Coordinator",
    link: "tel:+91 9881132571",
  },
  {
    title: "Ritam Goyal",
    description:
      "Incoming Coordinator",
    link: "tel:+91 9711360035",
  },
  {
    title: "KMC",
    description:
      "Hospital Ambulance",
    link: "tel:+91 8202922761",
  },
  {
    title: "Police",
    description:
      "Manipal Police Station",
    link: "tel:+91 8202570328",
  },
];
