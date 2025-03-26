"use client";
import React from 'react';
import { HoverEffect } from "@/components/ui/card-hover-effect-popup";

export default function Essentials({
    onItemClick
    }: {
    onItemClick: (item: { title: string; description: string
    }) => void }) {
    return (
    <div className="max-w-5xl mx-auto px-8">
        <span className="flex justify-center mt-8 text-3xl font-bold text-white">
            Everyday Essentials
        </span>
        <HoverEffect items={Essential} onItemClick={onItemClick} />
    </div>
    );
}
export const Essential = [
    {
        title: "Wifi Password",
        description: "",
        hidden: "SSID: Manipal Guest \n Password: manipal@123",
    },
    {
        title: "Zain Hussain",
        description: "Professor's Contact",
        hidden: "tel:+91 8202922761 \n email@gmail.com",
    },
];
