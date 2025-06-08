import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DynamicHomeHero = dynamic(() => import("@/components/ui/home-hero"), { ssr: false, loading: () => <Skeleton className="w-full h-40 rounded-lg bg-neutral-800" /> });

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <section className="w-full max-w-2xl px-4 py-12 flex flex-col items-center text-center">
        <Suspense fallback={<Skeleton className="w-full h-40 rounded-lg bg-neutral-800" />}>
          <DynamicHomeHero />
        </Suspense>
      </section>
    </main>
  );
}
