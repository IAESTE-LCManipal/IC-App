"use client";

import React from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect-popup";
import { useSession } from "next-auth/react";

export default function Essentials({
  onItemClick
}: {
  onItemClick: (item: { title: string; description: string; hidden: string }) => void;
}) {
  const { data: session } = useSession();

  const professor = session?.user?.professorDetails;
  const essentials = [
    {
      title: "Wifi Password",
      description: "",
      hidden: "SSID: Manipal Guest\nPassword: manipal@123",
    },
    professor && {
      title: professor.name || "Professor",
      description: "Professor's Contact",
      hidden: `Phone: ${professor.contact}\nEmail: ${professor.email}`,
    },
  ].filter(Boolean); // removes undefined if professor is null

  return (
    <div className="max-w-5xl mx-auto px-8">
      <span className="flex justify-center mt-8 text-3xl font-bold text-white">
        Everyday Essentials
      </span>
      <HoverEffect items={essentials} onItemClick={onItemClick} />
    </div>
  );
}
