"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Workflow } from "@/features/workflows/types/workflow";
import { Loader2, Pencil, X } from "lucide-react";
import { useRef, useState } from "react";
import { useUpdateWorkflow } from "../hooks/use-workflow";

const WorkflowName = ({ workflow }: { workflow: Workflow }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(workflow.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync, isPending } = useUpdateWorkflow(workflow.id);

  const handleUpdate = async () => {
    if (name === workflow.name) {
      setEditing(false);
      return;
    }

    try {
      await mutateAsync(name);
    } catch (error) {
      setName(workflow.name);
    } finally {
      setEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdate();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={name}
          onKeyDown={handleKeyDown}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-md p-1 w-fit"
          autoFocus
          disabled={isPending}
        />
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setEditing(!editing)}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin" /> : <X />}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-xl font-bold">{workflow.name}</p>
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => setEditing(!editing)}
      >
        <Pencil />
      </Button>
    </div>
  );
};

export default WorkflowName;

