"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

// Define the Professor type
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
  startDate?: string;
  endDate?: string;
}

export default function InternCards() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Intern | boolean | null>(null);
  const [profModal, setProfModal] = useState<Professor | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null!);

  // Separate refs for intern and professor modals
  const internModalRef = useRef<HTMLDivElement>(null!);
  const profModalRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    async function fetchInterns() {
      setLoading(true);
      // Fetch all interns from the database
      const res = await fetch("/api/interns", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      // Sort interns by sroSlot (as number)
      const sorted = (json.data || []).slice().sort((a: Intern, b: Intern) => {
        const aSlot = Number(a.sroSlot);
        const bSlot = Number(b.sroSlot);
        return aSlot - bSlot;
      });
      setInterns(sorted);
      setLoading(false);
    }
    fetchInterns();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // When intern modal closes, also close professor modal if open
  useEffect(() => {
    if (!active) setProfModal(null);
  }, [active]);

  useOutsideClick(internModalRef, () => setActive(null));
  useOutsideClick(profModalRef, () => setProfModal(null));

  return (
    <>
      {/* Intern details modal*/}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.fullName}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.fullName}-${id}`}
              ref={internModalRef}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-card dark:bg-card dark:text-card-foreground sm:rounded-3xl overflow-hidden border border-border"
            >
              <motion.div
                layoutId={`image-${active.fullName}-${id}`}
                // className="bg-muted dark:bg-muted"
              >
                <img
                  width={200}
                  height={200}
                  src={active.photoUrl || "/iaeste.png"}
                  alt={active.fullName}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>
              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.fullName}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.fullName}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.internID}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      Intern ID: {active.internID}
                      <br />
                      SRO Slot: {active.sroSlot}
                      <br />
                      Start:{" "}
                      {active.startDate
                        ? new Date(active.startDate).toLocaleDateString()
                        : "-"}
                      <br />
                      End:{" "}
                      {active.endDate
                        ? new Date(active.endDate).toLocaleDateString()
                        : "-"}
                    </motion.p>
                  </div>
                  {/* Green professor name div, clickable */}
                  <button
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-700"
                    onClick={() => setProfModal(active.professorDetails ?? null)}
                    type="button"
                  >
                    {active.professorDetails?.name}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      {/* Professor details modal */}
      <AnimatePresence>
        {profModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40">
            <motion.div
              ref={profModalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 w-full max-w-xs relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-neutral-700 dark:text-neutral-200"
                onClick={() => setProfModal(null)}
                type="button"
              >
                <CloseIconProf />
              </button>
              <h2 className="text-lg font-bold mb-2 text-green-700">
                {profModal.name}
              </h2>
              <div className="text-sm text-neutral-700 dark:text-neutral-200 mb-1">
                Email: {profModal.email}
              </div>
              <div className="text-sm text-neutral-700 dark:text-neutral-200">
                Contact: {profModal.contact}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ul className="max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-start gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-8">Loading interns...</div>
        ) : interns.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            No interns found for this slot.
          </div>
        ) : (
          interns.map((intern) => (
            <motion.div
              layoutId={`card-${intern.fullName}-${id}`}
              key={intern._id}
              onClick={() => setActive(intern)}
              className="m-2 p-[0.7rem] flex flex-col rounded-xl cursor-pointer transition-colors duration-200 border-[3px] border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-sm"
            >
              <div className="flex gap-4 flex-col w-full rounded-xl p-4">
                <motion.div layoutId={`image-${intern.fullName}-${id}`}>
                  <img
                    width={100}
                    height={100}
                    src={intern.photoUrl || "/iaeste.png"}
                    alt={intern.fullName}
                    className="h-60 w-full rounded-lg object-cover object-top"
                  />
                </motion.div>
                <div className="flex justify-center items-center flex-col bg-transparent dark:bg-transparent dark:text-card-foreground">
                  <motion.h3
                    layoutId={`title-${intern.fullName}-${id}`}
                    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                  >
                    {intern.fullName}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${intern.internID}-${id}`}
                    className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                  >
                    Country of Origin: {intern.internID}
                    <br />
                    SRO Slot: {intern.sroSlot}
                  </motion.p>
                  {/* professor name div on card, clickable for modal */}
                  {intern.professorDetails?.name && (
                    <button
                      className="mt-2 px-4 py-2 text-xs rounded-full font-bold bg-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfModal(intern.professorDetails ?? null);
                      }}
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
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export const CloseIconProf = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
