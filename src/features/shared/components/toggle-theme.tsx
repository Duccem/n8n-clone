"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

const ToggleTheme = () => {
  const { setTheme, theme } = useTheme();

  // resolvedTheme can be 'light' | 'dark' | 'system' | undefined
  const value = theme ?? "system";

  return (
    <Select value={value} onValueChange={(val) => setTheme(val)}>
      <SelectTrigger size="default" className="w-full">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <Sun className="mr-2 size-4" />
          Light
        </SelectItem>
        <SelectItem value="dark">
          <Moon className="mr-2 size-4" />
          Dark
        </SelectItem>
        <SelectItem value="system">
          <Laptop className="mr-2 size-4" />
          System
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ToggleTheme;

