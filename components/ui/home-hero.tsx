// HomeHero component for dynamic import in Home page
import Image from "next/image";

export default function HomeHero() {
  return (
    <div className="w-full flex flex-col items-center">
      <Image src="/iaeste_white.png" alt="IAESTE LCMU" width={120} height={120} className="mb-6" priority />
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to IAESTE LCMU InternApp</h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">Your one-stop PWA for all things internship in Manipal.</p>
    </div>
  );
}
