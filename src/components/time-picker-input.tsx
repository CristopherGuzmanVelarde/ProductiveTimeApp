
"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";

interface TimePickerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: "hours" | "minutes" | "seconds"; // Add "seconds" if needed
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onLeftFocus?: () => void;
  onRightFocus?: () => void;
}

const TimePickerInput = React.forwardRef<HTMLInputElement, TimePickerInputProps>(
  (
    { className, type = "number", picker, date, setDate, onLeftFocus, onRightFocus, ...props },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const mergedRef = (node: HTMLInputElement | null) => {
      if (internalRef) internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const getPickerValue = () => {
      if (!date) return "";
      switch (picker) {
        case "hours": return date.getHours().toString().padStart(2, "0");
        case "minutes": return date.getMinutes().toString().padStart(2, "0");
        // case "seconds": return date.getSeconds().toString().padStart(2, "0");
        default: return "";
      }
    };

    const handleValueChange = (newValue: string) => {
        const numValue = parseInt(newValue, 10);
        if (isNaN(numValue)) return;

        let newDate = date ? new Date(date) : new Date(); // Use current date/time if none exists
        newDate.setSeconds(0); // Reset seconds for simplicity unless implementing seconds picker

        switch (picker) {
            case "hours":
                if (numValue >= 0 && numValue <= 23) {
                    newDate.setHours(numValue);
                    setDate(newDate);
                    if (newValue.length === 2) onRightFocus?.(); // Auto-tab if 2 digits entered
                }
                break;
            case "minutes":
                if (numValue >= 0 && numValue <= 59) {
                    newDate.setMinutes(numValue);
                    setDate(newDate);
                    if (newValue.length === 2) onRightFocus?.(); // Or focus next if applicable
                }
                break;
            // case "seconds":
            //     if (numValue >= 0 && numValue <= 59) {
            //         newDate.setSeconds(numValue);
            //         setDate(newDate);
            //         if (newValue.length === 2) onRightFocus?.();
            //     }
            //     break;
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        switch (e.key) {
            case "ArrowRight":
                if (input.selectionStart === input.value.length) {
                    onRightFocus?.();
                    e.preventDefault();
                }
                break;
            case "ArrowLeft":
                if (input.selectionStart === 0) {
                    onLeftFocus?.();
                    e.preventDefault();
                }
                break;
            case "Backspace":
                if (input.selectionStart === 0 && input.selectionEnd === 0) {
                     // If at the beginning and Backspace is pressed, move focus left
                     onLeftFocus?.();
                     // Select all text in the left input after focusing (optional enhancement)
                     // This requires passing refs between components more directly or using a context
                     e.preventDefault();
                 }
                break;
            default:
                // Allow numbers and navigation keys
                if (!/^[0-9]$/.test(e.key) && !["ArrowUp", "ArrowDown", "Tab", "Shift", "Home", "End"].includes(e.key) && !(e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                }
                break;
        }
    };

    // Select all text on focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
        props.onFocus?.(e);
    };


    return (
      <Input
        ref={mergedRef}
        type="text" // Use text to better control input length and formatting
        inputMode="numeric" // Hint for mobile keyboards
        pattern="[0-9]*" // Basic pattern for numeric input
        id={picker}
        name={picker}
        value={getPickerValue()}
        onChange={(e) => handleValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className={cn(
          "w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:caret-black", // Adjust width as needed
          className
        )}
        maxLength={2} // Limit input to 2 digits
        {...props}
      />
    );
  }
);

TimePickerInput.displayName = "TimePickerInput";

export { TimePickerInput };
