"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

/**
 * PasswordInput
 * - Reuses base Input styles and behavior
 * - Adds an eye button to toggle between password/text visibility
 * - Forwards ref and all input props to the underlying input
 * - Works with FormControl Slot: id/aria props applied to the input element
 */
const PasswordInput = (({ className, type, ...props }: React.ComponentProps<"input">) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        className={cn(
          "absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground",
          "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-r-md",
        )}
        tabIndex={-1}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
});

export { PasswordInput };
