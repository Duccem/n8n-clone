"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/auth-client";
import { useEffect, useState } from "react";
import CreateOrganizationForm from "./create-organization-form";

const InitOrganizationDialog = () => {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const { data, isPending } = authClient.useListOrganizations();

  useEffect(() => {
    if (!isPending) {
      console.log("Organizations data:", data);
      console.log({ length: data?.length });
      if (data?.length === 0) {
        setShouldShowModal(true);
      }
    }
  }, [data, isPending]);

  if (!shouldShowModal) {
    return null;
  }

  return (
    <Dialog open={shouldShowModal} onOpenChange={setShouldShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Initialize Your Organization</DialogTitle>
          <DialogDescription>
            To get started, please create your organization. This will allow you
          </DialogDescription>
        </DialogHeader>
        <div className="px-0">
          <CreateOrganizationForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InitOrganizationDialog;

