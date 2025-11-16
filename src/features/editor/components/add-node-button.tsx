"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { NodeSelector } from "./node-selector";

export const AddNodeButton = memo(() => {
  const [open, setOpen] = useState(false);
  return (
    <NodeSelector>
      <Button
        onClick={() => {}}
        size={"icon"}
        variant={"outline"}
        className="bg-background"
      >
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";

