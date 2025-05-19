import React, { useState, ChangeEvent, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface CreateInternModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreateInternForm {
  internID: string;
  fullName: string;
  photoUrl: string;
  startDate: string;
  endDate: string;
  sroSlot: string;
  professorName: string;
  professorEmail: string;
  professorContact: string;
}

interface CreateInternResult {
  internID: string;
  plainPassword: string;
}

export function CreateInternModal({ open, onOpenChange }: CreateInternModalProps) {
  const [form, setForm] = useState<CreateInternForm>({
    internID: "",
    fullName: "",
    photoUrl: "",
    startDate: "",
    endDate: "",
    sroSlot: "",
    professorName: "",
    professorEmail: "",
    professorContact: ""
  });
  const [result, setResult] = useState<CreateInternResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/interns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internID: form.internID,
          fullName: form.fullName,
          photoUrl: form.photoUrl,
          startDate: form.startDate,
          endDate: form.endDate,
          sroSlot: form.sroSlot,
          professorDetails: {
            name: form.professorName,
            email: form.professorEmail,
            contact: form.professorContact
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          internID: data.data.internID,
          plainPassword: data.plainPassword
        });
        setForm({
          internID: "",
          fullName: "",
          photoUrl: "",
          startDate: "",
          endDate: "",
          sroSlot: "",
          professorName: "",
          professorEmail: "",
          professorContact: ""
        });
      } else {
        setError(data.error || "Failed to create intern.");
      }
    } catch (err) {
      setError("Network error.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Intern</DialogTitle>
          <DialogDescription>Fill in the details to create a new intern. The username and password will be shown after creation.</DialogDescription>
        </DialogHeader>
        {result ? (
          <div className="space-y-2">
            <div className="font-semibold">Intern Created!</div>
            <div>Username (InternID): <span className="font-mono">{result.internID}</span></div>
            <div>Password: <span className="font-mono">{result.plainPassword}</span></div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input name="internID" placeholder="Intern ID (8 chars)" value={form.internID} onChange={handleChange} required minLength={8} maxLength={8} />
            <Input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
            <Input name="photoUrl" placeholder="Photo URL (optional)" value={form.photoUrl} onChange={handleChange} />
            <Input name="startDate" type="date" placeholder="Start Date" value={form.startDate} onChange={handleChange} required />
            <Input name="endDate" type="date" placeholder="End Date" value={form.endDate} onChange={handleChange} required />
            <Input name="sroSlot" placeholder="SRO Slot (e.g. 01)" value={form.sroSlot} onChange={handleChange} required pattern="^[0-9]{2}$" />
            <Input name="professorName" placeholder="Professor Name" value={form.professorName} onChange={handleChange} required />
            <Input name="professorEmail" placeholder="Professor Email" value={form.professorEmail} onChange={handleChange} required type="email" />
            <Input name="professorContact" placeholder="Professor Contact" value={form.professorContact} onChange={handleChange} required />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Intern"}</Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
