"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({
  className,
  value,
  onChange,
  placeholderFrom = "Start date",
  placeholderTo = "End date",
  format = "dd/MM/yyyy",
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: { from?: Date; to?: Date };
  onChange?: (range: { from?: Date; to?: Date }) => void;
  placeholderFrom?: string;
  placeholderTo?: string;
  format?: string;
}) {
  // Use controlled value from props, fallback to undefined
  const [date, setDate] = React.useState<{ from?: Date; to?: Date } | undefined>(undefined);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  function handleSelect(range: DateRange | undefined) {
    setDate(range);
    onChange?.(range ?? {});
  }

  // Responsive width and style
  return (
    <div className={cn("w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              // Responsive width and padding
              "w-full sm:w-[300px] justify-start text-left font-normal px-3 py-2 border border-input bg-white dark:bg-muted/50 rounded-md shadow-sm",
              !date?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
            <span className="truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {formatDate(date.from, format)} <span className="mx-1">-</span> {formatDate(date.to, format)}
                  </>
                ) : (
                  formatDate(date.from, format)
                )
              ) : (
                <span className="text-gray-400">{placeholderFrom} - {placeholderTo}</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full sm:w-auto p-0 z-50" align="start">
          <div className="sm:min-w-[340px]">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date as DateRange | undefined}
              onSelect={handleSelect}
              numberOfMonths={typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 2}
              className="rounded-lg border bg-white dark:bg-muted/50 p-2 shadow-lg"
            />
            <div className="flex justify-end p-2">
              <Button size="sm" variant="ghost" onClick={() => handleSelect(undefined)}>
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function formatDate(date: Date, formatStr: string) {
  // Use date-fns format, fallback to dd/MM/yyyy
  try {
    return format(date, formatStr || "dd/MM/yyyy");
  } catch {
    return date.toLocaleDateString("en-GB");
  }
}
