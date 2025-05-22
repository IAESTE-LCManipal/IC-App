import React, { useEffect, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable, SortingState } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface LC {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  sroSlot: string;
}

export function LCsCurrentSlotTable() {
  const [data, setData] = useState<LC[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [slot, setSlot] = useState<string | null>(null);

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
    async function fetchLCs() {
      if (!slot) return;
      setLoading(true);
      const res = await fetch(`/api/lcs?slot=${slot}`);
      const json = await res.json();
      setData(json.data || []);
      setLoading(false);
    }
    fetchLCs();
  }, [slot]);

  const columns: ColumnDef<LC>[] = [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "sroSlot", header: "SRO Slot" },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!slot) return <div className="p-4">No active slot.</div>;
  if (loading) return <div className="p-4">Loading LCs for slot {slot}...</div>;

  return (
    <div className="rounded-md border p-4">
      <h2 className="text-lg font-semibold mb-2">LCs in Current Slot ({slot})</h2>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>No LCs found for this slot.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
