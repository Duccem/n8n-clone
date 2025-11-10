"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Invitation } from "better-auth/plugins";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Ban, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ListPendingInvitations = ({ orgId }: { orgId?: string }) => {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery<Invitation[]>({
    queryKey: ["pending-invitations", orgId],
    initialData: [],
    queryFn: async () => {
      // Pass orgId if supported by the client; otherwise the client should ignore unknown params.
      const { data, error } = await authClient.organization.listInvitations(
        orgId ? { query: { organizationId: orgId } } : {}
      );
      if (error) {
        throw new Error(error.message);
      }
      return (data as Invitation[]) ?? [];
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["resend-invitation"],
    mutationFn: async (invitationId: string) => {
      const { error } = await authClient.organization.cancelInvitation({
        invitationId,
      });
      if (error) {
        throw new Error(error.message);
      }
    },
  });

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  if (isError)
    return (
      <div>
        Error loading invitations: {String((error as Error)?.message ?? error)}
      </div>
    );
  if (!data || data.length === 0)
    return <div>Theres no pending invitations.</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Expire at</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((inv) => {
          const key = inv.id ?? inv.email ?? JSON.stringify(inv);
          const email = inv.email;
          const status = inv.status ?? "pending";
          const expireAt = inv.expiresAt;

          return (
            <TableRow key={key}>
              <TableCell className="font-medium">{email}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {status}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {format(expireAt ? new Date(expireAt) : new Date(), "PPpp")}
              </TableCell>
              <TableCell>
                <Button onClick={() => mutate(inv.id)}>
                  <Ban />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ListPendingInvitations;

