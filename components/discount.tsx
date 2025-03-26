"use client";
import React from 'react';
import { HoverEffect } from "@/components/ui/discounts-popup";

export default function Discounts({
    onItemClick
    }: {
    onItemClick: (item: { title: string; description: string
    }) => void }) {
    return (
    <div className="max-w-5xl mx-auto px-8">
        <span className="flex justify-center mt-8 text-3xl font-bold text-white">
            Offers Around Manipal
        </span>
        <HoverEffect items={Discount} onItemClick={onItemClick} />
    </div>
    );
}
export const Discount = [
    {
        title: "McDonald's",
        description: "Eatery",
        hidden: "Discount 1",
    },
    {
        title: "Burger King",
        description: "Eatery",
        hidden: "discount 2",
    },
    {
        title: "Superhuman",
        description: "Gym",
        hidden: "Discount 3",
    },
];
