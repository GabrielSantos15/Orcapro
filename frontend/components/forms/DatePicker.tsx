"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useThemeColor } from "@/app/context/ThemeContext";

interface DatePickerProps {
  value?: string;
  onChange: (date?: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const selectedDate = value ? new Date(value) : undefined;
  const { theme } = useThemeColor();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[150px] justify-start text-left font-normal bg-[var(--bg-surface)] border-hidden",
            !selectedDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />

          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecione"}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={`theme-${theme} w-auto p-0 bg-[var(--bg-surface)] border-[var(--primary-color)]`}
        align="start"

      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) =>
            onChange(date ? format(date, "yyyy-MM-dd") : undefined)
          }
          locale={ptBR}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
