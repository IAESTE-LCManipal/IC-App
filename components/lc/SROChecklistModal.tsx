// components/lc/SROChecklistModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SROChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  internId: string;
  internName: string;
}

export function SROChecklistModal({ isOpen, onClose, internId, internName }: SROChecklistModalProps) {
  const [checklist, setChecklist] = useState({
    documentationReviewed: false,
    initialMeetingCompleted: false,
    projectAssigned: false,
    weeklyCheckInsScheduled: false,
    midtermEvaluationCompleted: false,
    finalEvaluationCompleted: false,
  });

  const handleSave = async () => {
    try {
      // Save the checklist to your database
      const response = await fetch('/api/interns/sro-checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          internId,
          checklist,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
      } else {
        console.error("Failed to save checklist:", data.error);
      }
    } catch (error) {
      console.error("Error saving checklist:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>SRO Checklist for {internName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(checklist).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={value}
                onCheckedChange={(checked) =>
                  setChecklist({...checklist, [key]: checked === true})
                }
              />
              <Label htmlFor={key}>
                {key.replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())}
              </Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
