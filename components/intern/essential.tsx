"use client";

/**
 * Essentials component for displaying important info to interns.
 * Shows wifi credentials and professor contact if available.
 *
 * @param onItemClick - Callback when an essential item is clicked
 *
 * @component
 * @example
 * <Essentials onItemClick={fn} />
 */
import React from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect-popup";
import { useSession } from "next-auth/react";

export default function Essentials({
  onItemClick
}: {
  onItemClick: (item: { title: string; description: string; hidden?: string }) => void;
}) {
  const { data: session } = useSession();

  const professor = (session?.user && 'professorDetails' in session.user)
    ? (session.user as { professorDetails?: { name?: string; contact?: string; email?: string } }).professorDetails
    : undefined;
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
  ].filter(Boolean) as { title: string; description: string; hidden?: string }[];

  return (
    <div className="max-w-5xl mx-auto px-8">
      <span className="flex justify-center mt-8 text-3xl font-bold text-white">
        Everyday Essentials
      </span>
      <HoverEffect items={essentials} onItemClick={onItemClick} />
    </div>
  );
}
