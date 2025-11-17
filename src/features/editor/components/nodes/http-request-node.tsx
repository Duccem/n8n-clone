"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon, Loader2 } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type HTTPRequestNodeData = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

type HTTPRequestNodeType = Node<HTTPRequestNodeData>;

export const HTTPRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const { data } = props;
  const description = data?.endpoint
    ? `${data.method || "GET"}: ${data.endpoint}`
    : "No endpoint configured";

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              endpoint: values.endpoint,
              method: values.method,
              body: values.body,
            },
          };
        }
        return node;
      })
    );
    setIsSettingsOpen(false);
  };
  return (
    <>
      <HTTPRequestSettingsDialog
        isOpen={isSettingsOpen}
        openChangeAction={setIsSettingsOpen}
        onSubmitAction={handleSubmit}
        data={data}
      />
      <BaseExecutionNode
        {...props}
        status="initial"
        name="Http Request"
        description={description}
        Icon={GlobeIcon}
        id={props.id}
        onDoubleClick={() => {
          setIsSettingsOpen(true);
        }}
        onSettings={() => {
          setIsSettingsOpen(true);
        }}
      />
    </>
  );
});

const formSchema = z.object({
  endpoint: z.url("Please enter a valid URL"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string(),
});

type HTTPRequestSettingsDialogProps = {
  isOpen: boolean;
  openChangeAction: (open: boolean) => void;
  onSubmitAction: (data: z.infer<typeof formSchema>) => void;
  data?: HTTPRequestNodeData;
};

export const HTTPRequestSettingsDialog = ({
  isOpen,
  openChangeAction,
  onSubmitAction,
  data,
}: HTTPRequestSettingsDialogProps) => {
  const form = useForm({
    defaultValues: {
      endpoint: data?.endpoint ?? "",
      method: data?.method ?? "GET",
      body: data?.body ?? "{}",
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      onSubmitAction({
        endpoint: value.endpoint,
        method: value.method as "GET" | "POST" | "PUT" | "DELETE",
        body: value.body,
      });
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={openChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Settings for the HTTP Request node will go here.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
          className="flex flex-col gap-8 mt-4"
        >
          <form.Field name="endpoint">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>URL</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://api.example.com/data"
                />
                <p className="text-xs text-gray-500">
                  Static url or use {"{{variables}}"} for simple values or{" "}
                  {"{{json var}}"} for JSON properties.
                </p>
              </div>
            )}
          </form.Field>
          <form.Field name="method">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>HTTP method</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(e) => field.handleChange(e as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the HTTP method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
          <form.Subscribe>
            {(state) =>
              state.values.method === "POST" ||
              state.values.method === "PUT" ? (
                <form.Field name="body">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Body</Label>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="{}"
                      />
                    </div>
                  )}
                </form.Field>
              ) : null
            }
          </form.Subscribe>
          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
};

