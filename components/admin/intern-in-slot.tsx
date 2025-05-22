import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Define the Intern type
interface Professor {
  name: string;
  email: string;
  contact: string;
}

interface Intern {
  _id: string;
  fullName: string;
  internID: string;
  sroSlot: string;
  photoUrl?: string;
  professorDetails?: Professor;
}

export function InternsInCurrentSlot() {
  const [slot, setSlot] = useState<string | null>(null);
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentSlot() {
      const res = await fetch("/api/slots");
      const json = await res.json();
      const slots = json.data || [];
      const now = new Date();
      // IST is UTC+5:30
      const nowIST = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
      function isSlot(obj: unknown): obj is { from: string; to: string; slotNumber: number } {
        return typeof obj === 'object' && obj !== null && 'from' in obj && 'to' in obj && 'slotNumber' in obj;
      }
      const current = slots.find((slot: unknown) => {
        if (!isSlot(slot)) return false;
        return new Date(slot.from) <= nowIST && nowIST <= new Date(slot.to);
      });
      if (current && isSlot(current)) setSlot(current.slotNumber.toString().padStart(2, "0"));
      else setSlot(null);
    }
    fetchCurrentSlot();
  }, []);

  useEffect(() => {
    async function fetchInterns() {
      if (!slot) return;
      setLoading(true);
      const res = await fetch("/api/interns/by-sro-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sroSlot: slot }),
      });
      const json = await res.json();
      setInterns(json.data || []);
      setLoading(false);
    }
    fetchInterns();
  }, [slot]);

  if (!slot) return <div className="p-4">No active slot.</div>;
  if (loading) return <div className="p-4">Loading interns for slot {slot}...</div>;

  return (
    <div className="rounded-md border p-4">
      <h2 className="text-lg font-semibold mb-2">Interns in Current Slot ({slot})</h2>
      <ul className="max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-start gap-4">
        {interns.length === 0 ? (
          <div className="col-span-2 text-center py-8">No interns found for this slot.</div>
        ) : (
          interns.map((intern) => (
            <motion.div
              layoutId={`card-${intern.fullName}-${intern._id}`}
              key={intern._id}
              className="m-2 p-[0.7rem] flex flex-col rounded-xl cursor-pointer transition-colors duration-200 border-[3px] border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-sm"
            >
              <div className="flex gap-4 flex-col w-full rounded-xl p-4">
                <motion.div layoutId={`image-${intern.fullName}-${intern._id}`}>
                  <Image
                    width={100}
                    height={100}
                    src={intern.photoUrl || "/iaeste.png"}
                    alt={intern.fullName}
                    className="h-60 w-full rounded-lg object-cover object-top"
                    priority
                  />
                </motion.div>
                <div className="flex justify-center items-center flex-col bg-transparent dark:bg-transparent dark:text-card-foreground">
                  <motion.h3
                    layoutId={`title-${intern.fullName}-${intern._id}`}
                    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                  >
                    {intern.fullName}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${intern.internID}-${intern._id}`}
                    className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                  >
                    Country of Origin: {intern.internID}
                    <br />
                    SRO Slot: {intern.sroSlot}
                  </motion.p>
                  {intern.professorDetails?.name && (
                    <button
                      className="mt-2 px-4 py-2 text-xs rounded-full font-bold bg-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-700"
                      type="button"
                    >
                      {intern.professorDetails.name}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </ul>
    </div>
  );
}
