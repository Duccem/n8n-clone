"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth/auth-client";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import z from "zod";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  role: z.enum(["admin", "member"]),
});
const InviteMember = ({ orgId }: { orgId: string }) => {
  const form = useForm({
    defaultValues: {
      email: "",
      role: "member",
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.organization.inviteMember(
        {
          organizationId: orgId,
          email: value.email,
          role: value.role as "admin" | "member",
        },
        {
          onSuccess: () => {
            formApi.reset();
          },
        }
      );
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Member</CardTitle>
        <CardDescription>
          Invite a new member to your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="w-full flex items-center justify-between gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
        >
          <form.Field name="email">
            {(field) => (
              <div className="flex-1 flex flex-col gap-2">
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="doe@example.com"
                />
              </div>
            )}
          </form.Field>
          <form.Field name="role">
            {(field) => (
              <div className="">
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={"Role"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className=""
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Send Invitation"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
};

export default InviteMember;

