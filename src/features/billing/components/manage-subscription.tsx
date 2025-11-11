"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { useQuery } from "@tanstack/react-query";
import Prices from "./plans-dialog";
import { CustomerStateSubscription } from "@polar-sh/sdk/models/components/customerstatesubscription.js";
import { useEffect, useState } from "react";

const products = [
  {
    name: "Pro Plan",
    productId: "294b1789-0f2e-46dd-8fb0-6ac15d7b58c9",
  },
  {
    name: "Basic Plan",
    productId: "294b1789-0f2e-46dd-8fb0-6ac15d7b58c9",
  },
];

const ManageSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<{
    productId: string;
    name: string;
  } | null>(null);
  const { data, isPending } = useQuery<{
    subscription: CustomerStateSubscription;
  } | null>({
    queryKey: ["organization-subscription"],
    initialData: null,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data: state } = await authClient.customer.state();
      if (!state?.activeSubscriptions?.length) {
        return null;
      }
      return {
        subscription: state?.activeSubscriptions[0],
      };
    },
  });

  useEffect(() => {
    if (data?.subscription) {
      const product = products.find(
        (p) => p.productId === data.subscription!.productId
      );
      if (product) {
        setSelectedPlan(product);
      }
    } else {
      setSelectedPlan(null);
    }
  }, [data]);

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {!data
            ? "No Active Subscription"
            : `Subscription: ${selectedPlan?.name ?? "Unknown Plan"}`}
        </CardTitle>
      </CardHeader>
      <CardFooter>
        {!selectedPlan || selectedPlan?.name === "Basic Plan" ? (
          <Prices />
        ) : (
          <Button
            className="h-9"
            onClick={async () => {
              await authClient.customer.portal();
            }}
          >
            Manage your subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ManageSubscription;

