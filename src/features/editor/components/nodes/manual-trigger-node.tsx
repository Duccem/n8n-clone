"use client";

import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <>
      <ManualTriggerSettingsDialog
        isOpen={isSettingsOpen}
        openChangeAction={setIsSettingsOpen}
      />
      <BaseTriggerNode
        {...props}
        status="initial"
        name="Http Request"
        description={"When clicked, triggers the workflow"}
        Icon={MousePointerIcon}
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

type ManualTriggerSettingsDialogProps = {
  isOpen: boolean;
  openChangeAction: (open: boolean) => void;
};

export const ManualTriggerSettingsDialog = ({
  isOpen,
  openChangeAction,
}: ManualTriggerSettingsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={openChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>
            Settings for the Manual Trigger node will go here.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex items-center justify-center h-full w-full">
          <p className="text-sm">
            There are no settings available for this node yet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

