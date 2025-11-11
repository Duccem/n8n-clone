import InvoiceList from "@/features/billing/components/invoice-list";
import ManageSubscription from "@/features/billing/components/manage-subscription";
import { Usage } from "@/features/billing/components/usage-metrics";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 w-1/2 p-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and view your billing history.
        </p>
      </div>
      <ManageSubscription />
      <Usage />
      <InvoiceList />
    </div>
  );
}

