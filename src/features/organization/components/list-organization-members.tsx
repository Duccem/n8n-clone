"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Loader2, Trash } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const ListOrganizationMembers = () => {
  const { data: session } = authClient.useSession();
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pending-invitations"],
    initialData: [],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data, error } =
        await authClient.organization.getFullOrganization();
      if (error) {
        throw new Error(error.message);
      }
      return data.members ?? [];
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-member"],
    mutationFn: async (memberId: string) => {
      const { error } = await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
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
        Error cargando invitaciones:{" "}
        {String((error as Error)?.message ?? error)}
      </div>
    );
  if (!data || data.length === 0)
    return <div>No hay invitaciones pendientes.</div>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((member) => {
          return (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.user.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {member.user.email}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {member.role}
              </TableCell>
              <TableCell>
                {
                  session?.user.id !== member.userId && (
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={isPending}
                      onClick={() => mutate(member.id!)}
                    >
                      <Trash className="size-4" />
                    </Button>
                  ) /* Prevent user from deleting themselves */
                }
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ListOrganizationMembers;

