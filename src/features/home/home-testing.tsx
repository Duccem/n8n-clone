"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const HomeTesting = () => {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    initialData: {
      items: [],
    },
    queryKey: ["test"],
    queryFn: async () => {
      const res = await fetch("/api/workflows");

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      return res.json();
    },
    refetchOnWindowFocus: false,
  });
  const { mutate } = useMutation({
    mutationKey: ["create-workflow"],
    mutationFn: async () => {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "New Workflow" }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
    },
    onSuccess: () => {
      toast.success("Workflow created successfully");
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
    onError: () => {
      toast.error("Failed to create workflow");
    },
  });

  if (isPending || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full px-6 py-3">
      <div>
        <h1>content</h1>
        <div>{JSON.stringify(data)}</div>
        <Button disabled={isPending} onClick={() => mutate()}>
          Create workflow
        </Button>
      </div>
    </div>
  );
};

