// components/admin/slot-modifier.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";

interface Slot {
  _id?: string;
  slotNumber: number;
  from: string;
  to: string;
}

export default function SlotModifier() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlot, setNewSlot] = useState({ slotNumber: '', from: '', to: '' });
  const [editSlotId, setEditSlotId] = useState<string | null>(null);
  const [editSlot, setEditSlot] = useState({ slotNumber: '', from: '', to: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    setLoading(true);
    const res = await fetch("/api/slots");
    const json = await res.json();
    setSlots(json.data || []);
    setLoading(false);
  }

  async function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      // Set from to 00:00:00 and to to 23:59:59 for the selected dates
      const fromDate = new Date(newSlot.from);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(newSlot.to);
      toDate.setHours(23, 59, 59, 999);
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotNumber: Number(newSlot.slotNumber),
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create slot");
      setNewSlot({ slotNumber: '', from: '', to: '' });
      fetchSlots();
        } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  async function handleUpdateSlot(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      // Set from to 00:00:00 and to to 23:59:59 for the selected dates
      const fromDate = new Date(editSlot.from);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(editSlot.to);
      toDate.setHours(23, 59, 59, 999);
      const res = await fetch(`/api/slots/${editSlotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotNumber: Number(editSlot.slotNumber),
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update slot");
      setEditSlotId(null);
      setEditSlot({ slotNumber: '', from: '', to: '' });
      fetchSlots();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  function startEdit(slot: Slot) {
    setEditSlotId(slot._id!);
    setEditSlot({
      slotNumber: slot.slotNumber.toString(),
      from: slot.from.slice(0, 16),
      to: slot.to.slice(0, 16),
    });
  }

  function cancelEdit() {
    setEditSlotId(null);
    setEditSlot({ slotNumber: '', from: '', to: '' });
  }

  // Helper to convert DateRange to ISO strings with correct times
  function handleNewSlotDateChange(range: { from?: Date; to?: Date }) {
    setNewSlot(s => ({
      ...s,
      from: range.from ? new Date(range.from.setHours(0,0,0,0)).toISOString() : '',
      to: range.to ? new Date(range.to.setHours(23,59,59,999)).toISOString() : '',
    }));
  }
  function handleEditSlotDateChange(range: { from?: Date; to?: Date }) {
    setEditSlot(s => ({
      ...s,
      from: range.from ? new Date(range.from.setHours(0,0,0,0)).toISOString() : '',
      to: range.to ? new Date(range.to.setHours(23,59,59,999)).toISOString() : '',
    }));
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full px-2 sm:px-4 md:px-8">
      <Card className="w-full max-w-xl bg-muted/50 border-2 border-dashed border-primary">
        <CardContent className="py-4 flex flex-col gap-2">
          <h2 className="flex justify-center font-semibold text-lg mb-2">Create New Slot</h2>
          <form className="flex flex-col md:flex-row gap-2 w-full items-center" onSubmit={handleCreateSlot}>
            <Input
              type="number"
              min={1}
              max={99}
              required
              placeholder="Slot No."
              value={newSlot.slotNumber}
              onChange={e => setNewSlot(s => ({ ...s, slotNumber: e.target.value }))}
              className="w-full max-w-[120px] md:w-32"
            />
            <div className="w-full">
              <DatePickerWithRange
                value={{
                  from: newSlot.from ? new Date(newSlot.from) : undefined,
                  to: newSlot.to ? new Date(newSlot.to) : undefined,
                }}
                onChange={handleNewSlotDateChange}
                placeholderFrom="Start date"
                placeholderTo="End date"
                format="dd/MM/yyyy"
              />
            </div>
            <Button type="submit" variant="default" className="w-full max-w-[100px] md:w-auto md:ml-2 whitespace-nowrap">Create</Button>
          </form>
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </CardContent>
      </Card>


      {loading ? (
        <div className="p-4">Loading slots...</div>
      ) : (
        slots.map(slot => (
          <Card key={slot._id} className="w-[70%] flex flex-col md:flex-row items-center gap-2 p-4">
            {editSlotId === slot._id ? (
              <form className="flex flex-col md:flex-row gap-2 items-center w-full" onSubmit={handleUpdateSlot}>
                <Input
                  type="number"
                  min={1}
                  max={99}
                  required
                  value={editSlot.slotNumber}
                  onChange={e => setEditSlot(s => ({ ...s, slotNumber: e.target.value }))}
                  className="w-32"
                />
                <div className="w-full">
                  <DatePickerWithRange
                    value={{
                      from: editSlot.from ? new Date(editSlot.from) : undefined,
                      to: editSlot.to ? new Date(editSlot.to) : undefined,
                    }}
                    onChange={handleEditSlotDateChange}
                    placeholderFrom="Start date"
                    placeholderTo="End date"
                    format="dd/MM/yyyy"
                  />
                </div>
                <Button type="submit" variant="default">Save</Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row gap-2 items-center w-full justify-between">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <span className="font-semibold">Slot {slot.slotNumber}</span>
                  <span className="text-sm text-muted-foreground">{new Date(slot.from).toLocaleDateString()} - {new Date(slot.to).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => startEdit(slot)}>Edit</Button>
                  <Button variant="destructive" onClick={async () => {
                    setError(null);
                    try {
                      const res = await fetch(`/api/slots/${slot._id}`, { method: "DELETE" });
                      const data = await res.json();
                      if (!data.success) throw new Error(data.error || "Failed to delete slot");
                      fetchSlots();
                    } catch (err: unknown) {
                      setError(err instanceof Error ? err.message : 'Unknown error');
                    }
                  }}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
