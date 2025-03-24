"use client";
import InternProfile from "@/components/profile";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();

    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logging out...");
        router.push('/signin');

      };

  return (
    <InternProfile
      name="John Doe"
      id="INT-2025-001"
      startDate={new Date(2025, 2, 1)} // March 1, 2025
      endDate={new Date(2025, 7, 31)} // August 31, 2025
      photoUrl="/path/to/intern-photo.jpg"
      onLogout={handleLogout}
    />
  );
}
