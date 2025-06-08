// components/lc/SROChecklistModal.tsx
"use client";

import { useEffect, useState } from "react";
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
    oiacIntimation: false,
    accomodationMail: false,
    cabMail: false,
    ci: false,
    cForm: false,
    sForm: false,
    frroIfRequired: false,
    bonafideCertificate: false,
    stipend: false,
    hostelUndertaking: false,
    idCard: false,
    wifiAccess: false,
  });

  // Fetch checklist from DB when modal opens or internId changes
  useEffect(() => {
    async function fetchChecklist() {
      if (!isOpen || !internId) return;
      try {
        const res = await fetch(`/api/interns/sro-checklist?internId=${internId}`);
        const data = await res.json();
        if (data.success && data.checklist) {
          setChecklist({ ...checklist, ...data.checklist });
        } else {
          setChecklist({
            oiacIntimation: false,
            accomodationMail: false,
            cabMail: false,
            ci: false,
            cForm: false,
            sForm: false,
            frroIfRequired: false,
            bonafideCertificate: false,
            stipend: false,
            hostelUndertaking: false,
            idCard: false,
            wifiAccess: false,
          });
        }
      } catch {
        setChecklist({
          oiacIntimation: false,
          accomodationMail: false,
          cabMail: false,
          ci: false,
          cForm: false,
          sForm: false,
          frroIfRequired: false,
          bonafideCertificate: false,
          stipend: false,
          hostelUndertaking: false,
          idCard: false,
          wifiAccess: false,
        });
      }
    }
    fetchChecklist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, internId]);

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
                {(() => {
                  switch (key) {
                    case 'oiacIntimation': return 'OIAC Intimation';
                    case 'accomodationMail': return 'Accomodation Mail';
                    case 'cabMail': return 'Cab Mail';
                    case 'ci': return 'CI';
                    case 'cForm': return 'C Form';
                    case 'sForm': return 'S Form';
                    case 'frroIfRequired': return 'FRRO (If Required)';
                    case 'bonafideCertificate': return 'Bonafide Certificate';
                    case 'stipend': return 'Stipend';
                    case 'hostelUndertaking': return 'Hostel Undertaking';
                    case 'idCard': return 'ID Card';
                    case 'wifiAccess': return 'WIFI Access';
                    default: return key;
                  }
                })()}
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
