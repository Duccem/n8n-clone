"use client";

import { Button } from "@/components/ui/button";
import { useCreateWorkflow } from "../hooks/use-workflow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const CreateWorkflow = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {" "}
          <PlusCircle /> Add Workflow
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new workflow.
          </DialogDescription>
        </DialogHeader>
        <CreateWorkflowForm
          onCreate={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
});

const CreateWorkflowForm = ({ onCreate }: { onCreate: () => void }) => {
  const { mutate, isPending } = useCreateWorkflow();
  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value.name, {
        onSuccess: () => {
          onCreate();
        },
      });
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(e);
      }}
      className="w-full flex flex-col gap-4"
    >
      <form.Field name="name">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Name</Label>
            <Input
              id={field.name}
              name={field.name}
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="My Workflow"
            />
            {field.state.meta.errors.map((error) => (
              <p key={error?.message} className="text-red-500">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>
      <form.Subscribe>
        {(state) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!state.canSubmit || state.isSubmitting || isPending}
          >
            {state.isSubmitting || isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Workflow"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};

