"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/auth-client";
import { useUploadThing } from "@/lib/storage/utils";
import { useForm } from "@tanstack/react-form";
import { Loader2, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import slugify from "slugify";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
});

const CreateOrganizationForm = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { startUpload } = useUploadThing("organizationLogo");
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
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
      const { data } = await authClient.organization.create(
        {
          name: value.name,
          logo: logoUrl,
          slug: slugify(value.name),
        },
        {
          onSuccess: async () => {
            console.log("Organization created successfully");
          },
          onError: (ctx) => {
            toast.error(`Error creating organization: ${ctx.error.message}`);
          },
        }
      );
      await authClient.organization.setActive(
        {
          organizationId: data?.id,
        },
        {
          onSuccess: async () => {
            await fetch("api/billing/customer", { method: "POST" });
            toast.success("Organization created successfully");

            router.refresh();
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
            <Label htmlFor={field.name}>Email</Label>
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
              "Create Organización"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};

export default CreateOrganizationForm;

