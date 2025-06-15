"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
    IconGiftCard,
    IconCalendarClock,
    IconAlertOctagon,
    IconSignature,
    IconMapPin,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { StaticImageData } from "next/image";

import emergency from "@/public/emergency.png";
import calendar from "@/public/calendar.png";
import essentials from "@/public/essentials.png";
import places from "@/public/places.png";
import discounts from "@/public/discounts.png";


/**
 * Intern dashboard main component.
 * Renders a grid of quick-access cards for calendar, emergencies, essentials, and places.
 *
 * @component
 * @example
 * <Dash />
 */
export default function Dash() {
    return (
        <BentoGrid className="mt-16 max-w-full mx-auto md:auto-rows-[20rem]">
        {items.map((item, i) => (
            <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={cn("[&>p:text-lg]", item.className)}
            icon={item.icon}
            href={item.href}
            />
        ))}
        </BentoGrid>
    );
}

const Skeleton = ({image,
    }: {
    image: StaticImageData;
    }) => {
    const variants = {
        initial: {
        width: 0,
        },
        animate: {
        width: "100%",
        transition: {
            duration: 0.2,
        },
        },
        hover: {
        width: ["0%", "100%"],
        transition: {
            duration: 2,
        },
        },
    };
    return (
        <motion.div
        initial="initial"
        animate="animate"
        variants={variants}
        transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
        }}
        className="flex flex-1 w-full h-full min-h-[6rem] rounded-lg relative overflow-hidden"
        >
        <Image
            src={image}
            alt="card image"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 w-full h-full"
        />
        <motion.div className="h-full w-full rounded-lg relative z-10"></motion.div>
        </motion.div>
    );
};

const items = [
    {
        title: "Calendar",
        description: (
        <span className="text-sm">
            Experience the power of AI in generating unique content.
        </span>
        ),
        header: <Skeleton image={calendar}/>,
        className: "md:col-span-1",
        icon: <IconCalendarClock className="h-5 w-5 text-neutral-500" />,
        href: "/calendar",
    },

    {
        title: "Emergencies",
        description: (
        <span className="text-sm">
            Let AI handle the proofreading of your documents.
        </span>
        ),
        header: <Skeleton image={emergency}/>,
        className: "md:col-span-1",
        icon: <IconAlertOctagon className="h-5 w-5 text-neutral-500" />,
        href: "/emergencies",
    },

    {
        title: "Essentials",
        description: (
        <span className="text-sm">
            Get AI-powered suggestions based on your writing context.
        </span>
        ),
        header: <Skeleton image={essentials}/>,
        className: "md:col-span-1",
        icon: <IconSignature className="h-5 w-5 text-neutral-500" />,
        href: "/essentials",
    },

    {
        title: "Places to Visit",
        description: (
        <span className="text-sm">
            Explore the best spots to visit in and around Manipal!
        </span>
        ),
        header: <Skeleton image={places}/>,
        className: "md:col-span-2",
        icon: <IconMapPin className="h-5 w-5 text-neutral-500" />,
        href: "/nearby",
    },

    {
        title: "Discounts around Manipal",
        description: (
        <span className="text-sm">
            Exclusive discounts around Manipal, just for you!
        </span>
        ),
        header: <Skeleton image={discounts}/>,
        className: "md:col-span-1",
        icon: <IconGiftCard className="h-5 w-5 text-neutral-500" />,
        href: "/discounts",
    },
];
