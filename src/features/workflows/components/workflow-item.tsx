"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Workflow } from "@/features/workflows/types/workflow";
import { format, formatDistanceToNow } from "date-fns";
import { Ellipsis, WorkflowIcon } from "lucide-react";
import { useDeleteWorkflow } from "../hooks/use-workflow";
import Link from "next/link";

const WorkflowItem = ({ workflow }: { workflow: Workflow }) => {
  const { mutate, isPending } = useDeleteWorkflow(workflow.id);
  return (
    <div className="p-4 mb-2 border rounded-xl flex items-start justify-between gap-6 group cursor-pointer hover:bg-accent">
      <div className="flex items-center gap-3 flex-1">
        <div className="border rounded-xl p-3">
          <WorkflowIcon className="size-6" />
        </div>
        <div>
          <Link
            className="text-lg font-medium group-hover:underline"
            href={`/workflows/${workflow.id}`}
          >
            {workflow.name}
          </Link>
          <div className="text-sm text-muted-foreground">
            Created{" "}
            {formatDistanceToNow(new Date(workflow.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>
      </div>
      <div className="py-1 grid grid-cols-2 gap-5 flex-1">
        <div className="text-sm">
          <p className="text-lg font-light">Last run</p>
          <p className="font-medium">{format(new Date(), "PPp")}</p>
        </div>
        <div className="text-sm">
          <p className="text-lg font-light">Runs</p>
          <p className="font-medium">34</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-3 flex-1">
        <Badge variant={"outline"}>Active</Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>Edit Workflow</DropdownMenuItem>
              <DropdownMenuItem>Archive Workflow</DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => mutate()}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete Workflow"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default WorkflowItem;

