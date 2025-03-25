"use client";
import React, { useState } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Emergency from "../../components/emergency";
import InternSidebar from "../../components/internsidebar";


export default function emergency() {
    return (
        <>
        <div
        className={cn(
            "mx-auto flex w-full max-w-screen flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-[#101827] md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
             "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
        )}
        >
            <InternSidebar />
            <div className="flex h-full w-full flex-1 flex-col gap-2  border-0 bg-neutral-900">
                <Emergency />
            </div>
        </div>
        </>
    );
}
