"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth/auth-client";
import { useUploadThing } from "@/lib/storage/utils";
import { useForm } from "@tanstack/react-form";
import type { User } from "better-auth";
import { Loader2, Pencil, UserCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import z from "zod";

export const UserDetails = () => {
  const { data, isPending, refetch } = authClient.useSession();
  if (isPending) {
    return <UserDetailsSkeleton />;
  }
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <UserUpdateForm user={data?.user!} refetch={refetch} />
      </CardHeader>
    </Card>
  );
};

export const UserDetailsSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading user...</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="w-full" />
        <Skeleton className="w-full" />
      </CardContent>
    </Card>
  );
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const UserUpdateForm = ({
  user,
  refetch,
}: {
  user: User;
  refetch?: VoidFunction;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.image || null
  );
  const { startUpload } = useUploadThing("userAvatar");
  const form = useForm({
    defaultValues: {
      name: user.name,
    },
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      let logoUrl = "";
      if (file) {
        const res = await startUpload([file]);
        if (res) {
          logoUrl = res[0].ufsUrl;
        }
      }
      await authClient.updateUser(
        {
          name: value.name,
          image: logoUrl || user.image || "",
        },
        {
          onSuccess: () => {
            toast.success("Organization updated successfully");
            refetch?.();
          },
          onError: (ctx) => {
            toast.error(`Error updating organization: ${ctx.error.message}`);
          },
        }
      );
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit(e);
      }}
      className="flex flex-col w-full gap-4 mt-6"
    >
      <div className="flex items-center gap-4">
        {imagePreview ? (
          <div className="size-16 p-0 rounded-xl border flex justify-center items-center overflow-hidden">
            <img
              src={imagePreview || ""}
              alt=""
              className="object-cover w-full aspect-square rounded-xl"
            />
          </div>
        ) : (
          <div className="size-16 p-3 rounded-xl border flex justify-center items-center">
            <UserCircle />
          </div>
        )}
        <Button type="button" onClick={() => fileRef.current?.click()}>
          Upload Logo
        </Button>
        <input
          type="file"
          name=""
          id=""
          className="hidden"
          ref={fileRef}
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result) {
                  setImagePreview(event.target.result as string);
                }
              };
              reader.readAsDataURL(e.target.files[0]);
            }
          }}
        />
      </div>
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
              placeholder="doe@example.com"
            />
            {field.state.meta.errors.map((error) => (
              <p key={error?.message} className="text-red-500">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>
      <div className="space-y-2">
        <Label htmlFor={"email"}>Email</Label>
        <Input
          id={"email"}
          name={"email"}
          type="text"
          value={user.email}
          disabled
        />
      </div>
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
              "Update Account"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};

