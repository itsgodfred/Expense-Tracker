"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export default function DatePickerInput({ value: parentDate, onValueChange }) {
  const [open, setOpen] = React.useState(false);

  const fallbackDate = parentDate
    ? new Date(parentDate)
    : new Date("2025-06-01");
  const [date, setDate] = React.useState(fallbackDate);
  const [month, setMonth] = React.useState(date);
  const [value, setValue] = React.useState(formatDate(date));

  React.useEffect(() => {
    if (parentDate) {
      const parsed = new Date(parentDate);
      if (isValidDate(parsed)) {
        setDate(parsed);
        setMonth(parsed);
        setValue(formatDate(parsed));
      }
    }
  }, [parentDate]);

  return (
    <Field className="mx-auto w-48">
      <FieldLabel htmlFor="date-required">Date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-required"
          value={value}
          placeholder="June 01, 2025"
          onChange={(e) => {
            setValue(e.target.value);
            const parsed = new Date(e.target.value);
            if (isValidDate(parsed)) {
              setDate(parsed);
              setMonth(parsed);
              if (onValueChange) onValueChange(parsed);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <InputGroupButton
                  id="date-picker"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Select date"
                >
                  <CalendarIcon />
                  <span className="sr-only">Select date</span>
                </InputGroupButton>
              }
            />
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={parentDate ? new Date(parentDate) : date}
                month={month}
                onMonthChange={setMonth}
                onSelect={(selectedDate) => {
                  if (selectedDate && isValidDate(selectedDate)) {
                    setDate(selectedDate);
                    setValue(formatDate(selectedDate));
                    if (onValueChange) onValueChange(selectedDate);
                    setOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
