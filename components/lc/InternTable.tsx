// components/lc/InternTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

// Intern type based on MongoDB schema
interface Intern {
  _id: string;
  internID: string;
  fullName: string;
  photoUrl: string;
  startDate: string;
  endDate: string;
  sroSlot?: string; // This might come from a separate collection
  professorDetails: {
    name: string;
    email: string;
    contact: string;
  };
}

interface InternTableProps {
  onOpenChecklist: (internId: string, internName: string) => void;
}

export function InternTable({ onOpenChecklist }: InternTableProps) {
  const { data: session } = useSession();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const fetchInterns = async () => {
      if (!session?.user) return;
      // Get the LC's slot number
      const sroSlot = (session.user && 'sroSlot' in session.user)
        ? (session.user as { sroSlot?: string }).sroSlot
        : undefined;
      if (!sroSlot) return;
      try {
        setLoading(true);
        // Fetch interns whose stay overlaps with the LC's slot
        const response = await fetch('/api/interns/by-active-slot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slotNumber: sroSlot }),
        });
        const data = await response.json();
        if (data.success) {
          setInterns(data.data);
        } else {
          console.error("Failed to fetch interns:", data.error);
        }
      } catch (error) {
        console.error("Error fetching interns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, [session]);

  const columnHelper = createColumnHelper<Intern>();

  const handleOpenChecklist = (intern: Intern) => {
    onOpenChecklist(intern._id, intern.fullName);
  };

  const columns = [
    columnHelper.accessor("internID", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Intern ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("fullName", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("startDate", {
      header: "Start Date",
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("endDate", {
      header: "End Date",
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("professorDetails.name", {
      header: "Professor",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor(row => row, {
      id: "actions",
      header: "SRO Checklist",
      cell: info => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenChecklist(info.getValue())}
        >
          SRO Checklist
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: interns,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (loading) {
    return <div className="flex justify-center p-4">Loading interns...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No interns found for your SRO slot.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
