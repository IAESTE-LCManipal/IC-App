"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import lcmu from "@/public/lcmu_white.png";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DynamicSigninForm = dynamic(() => import("@/components/ui/signin-form"), { ssr: false, loading: () => <Skeleton className="w-full h-96 rounded-lg bg-neutral-800" /> });

export default function SignIn() {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900'>
      <Suspense fallback={<Skeleton className="w-full h-96 rounded-lg bg-neutral-800" />}>
        <DynamicSigninForm />
      </Suspense>
    </div>
  );
}
