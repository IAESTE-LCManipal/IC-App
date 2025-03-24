"use client";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { LogOut} from "lucide-react";
import { IconArrowLeft } from "@tabler/icons-react";

import lcmu from "@/public/lcmu_white.png";

interface InternProfileProps {
  name: string;
  id: string;
  startDate: Date;
  endDate: Date;
  photoUrl?: string;
  onLogout?: () => void;
}

export default function InternProfile({
  name,
  id,
  startDate,
  endDate,
  photoUrl,
  onLogout = () => console.log("Logout clicked"),
}: InternProfileProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const router = useRouter();


    return (
        <div className="flex justify-center items-center min-h-screen bg-[#0f0f17]">
        <Card className="w-[400px] bg-[#1a1a2e] text-white border border-[#2a2a3e] rounded-lg overflow-hidden">
            <CardContent className="px-6 pb-6">
                <Button
                variant="ghost"
                className="flex items-center text-gray-300 hover:text-white p-0 ml-0 mt-4 mb-2 bg-transparent hover:bg-transparent"
                
                onClick={() => router.back()}
                >
                <IconArrowLeft size={20} className=" mt-[6%]" />
                <span>Back</span>
                </Button>
            <div className="flex justify-center mb-6">
                <Image src={lcmu} alt="IAESTE Logo" width={250} height={200} />
            </div>
            <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-[#2a2a3e]">
                <AvatarImage src={photoUrl} alt={name} />
                <AvatarFallback className="bg-[#2a2a3e] text-white text-xl">
                    {name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-1">{name}</h2>
                {/* <p className="text-[#8f8f9d] text-sm">Intern Profile</p> */}
            </div>
            <div className="space-y-4">
                <div className="bg-[#252538] p-3 rounded-xl">
                {/* <p className="text-[#8f8f9d] text-sm mb-1">Intern ID</p> */}
                <p className="flex font-medium justify-center">{id}</p>
                </div>
                <div className="bg-[#252538] p-3 rounded-xl">
                <p className="flex justify-center text-[#8f8f9d] text-sm mb-2">Internship Duration</p>
                <div className="flex flex-col justify-center items-center">
                    <p className="font-medium">{formatDate(startDate)}</p>
                        <p className="font-normal">-</p>
                    {/* <p className="text-[#8f8f9d] text-sm mb-1">End Date</p> */}
                    <p className="font-medium">{formatDate(endDate)}</p>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <Button
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-[9px]"
                onClick={onLogout}
                >
                <LogOut size={16} className="mr-2" />
                Logout
                </Button>
            </div>
            </CardContent>
        </Card>
        </div>
    );
}
