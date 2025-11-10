"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const DeleteOrganization = () => {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await authClient.organization.delete({
        organizationId: activeOrg?.id ?? "",
      });
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Organization</CardTitle>
        <CardDescription>
          This action cannot be undone. This will permanently delete the
          organization and all of its data.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          className="w-full"
          variant={"destructive"}
          onClick={() => mutate()}
        >
          {isPending ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            "Delete Organization"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeleteOrganization;

