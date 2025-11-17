import { Workflow } from "@/features/workflows/types/workflow";
import { Pagination } from "@/features/shared/types/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useListWorkflows = (
  page: number = 1,
  pageSize: number = 10,
  query?: string,
  state?: string
) => {
  return useQuery({
    queryKey: ["workflows", page, pageSize, query, state],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      if (query) {
        queryParams.append("query", query);
      }
      if (state) {
        queryParams.append("state", state);
      }
      const response = await fetch(
        `/api/v1/workflow?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch workflows");
      }

      const data = await response.json();
      const workflows = data?.workflows as Array<Workflow>;
      const pagination = data?.pagination as Pagination;

      return {
        items: workflows,
        pagination,
      };
    },
    placeholderData: {
      items: [] as Array<Workflow>,
      pagination: {} as Pagination,
    },
    refetchOnWindowFocus: false,
  });
};

export const useWorkflow = (workflowId: string) => {
  return useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/workflow/${workflowId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workflow");
      }

      const data = await response.json();
      return data.workflow as Workflow;
    },
    enabled: !!workflowId,
    refetchOnWindowFocus: false,
  });
};

export const useCreateWorkflow = () => {
  return useMutation({
    mutationKey: ["create-workflow"],
    mutationFn: async (name: string) => {
      const response = await fetch(`/api/v1/workflow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to create workflow");
      }
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: (error) => {
      console.error("Error creating workflow:", error);
      toast.error("Failed to create workflow. Please try again.");
    },
  });
};

export const useUpdateWorkflow = (workflowId: string) => {
  return useMutation({
    mutationKey: ["update-workflow", workflowId],
    mutationFn: async (name: string) => {
      const response = await fetch(`/api/v1/workflow/${workflowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to update workflow");
      }
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: ["workflows"] });
      ctx.client.invalidateQueries({ queryKey: ["workflow", workflowId] });
    },
    onError: (error) => {
      console.error("Error updating workflow:", error);
      toast.error("Failed to update workflow. Please try again.");
    },
  });
};

export const useDeleteWorkflow = (workflowId: string) => {
  return useMutation({
    mutationKey: ["delete-workflow", workflowId],
    mutationFn: async () => {
      const response = await fetch(`/api/v1/workflow/${workflowId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete workflow");
      }
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: (error) => {
      console.error("Error deleting workflow:", error);
      toast.error("Failed to delete workflow. Please try again.");
    },
  });
};

export const useUpdateNodesInWorkflow = (workflowId: string) => {
  return useMutation({
    mutationKey: ["update-nodes-workflow", workflowId],
    mutationFn: async (data: { nodes: Array<any>; edges: Array<any> }) => {
      const response = await fetch(`/api/v1/workflow/${workflowId}/nodes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update nodes in workflow");
      }
    },
    onError: (error) => {
      console.error("Error updating nodes in workflow:", error);
      toast.error("Failed to update nodes in workflow. Please try again.");
    },
    onSuccess: (_, __, ___, ctx) => {
      ctx.client.invalidateQueries({ queryKey: ["workflow", workflowId] });
      toast.success("Workflow nodes updated successfully");
    },
  });
};

export const useExecuteWorkflow = (workflowId: string) => {
  return useMutation({
    mutationKey: ["execute-workflow", workflowId],
    mutationFn: async () => {
      const response = await fetch(`/api/v1/workflow/${workflowId}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to execute workflow");
      }
    },
    onError: (error) => {
      console.error("Error executing workflow:", error);
      toast.error("Failed to execute workflow. Please try again.");
    },
    onSuccess: () => {
      toast.success("Workflow execution started successfully");
    },
  });
};

