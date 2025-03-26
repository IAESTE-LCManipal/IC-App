"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Essentials from "@/components/essential";

export default function DialogDemo() {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ title: string; hidden: string } | null>(null);

    const handleItemClick = (item: { title: string; hidden: string }) => {
        setSelectedItem(item);
        setOpen(true); // Open the dialog when an item is clicked
    };

    return (
        <>
        <Essentials onItemClick={handleItemClick} />
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{selectedItem?.title || "Details"}</DialogTitle>
                <DialogDescription className="whitespace-pre-line">
                    {selectedItem?.hidden  || "No additional information available."}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
