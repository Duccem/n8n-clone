"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { format } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const InvoiceList = () => {
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["orders"],
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `/api/v1/billing/orders?page=${pageParam}&limit=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      const orders = data?.orders!;
      const pagination = data?.pagination!;

      const ordersWithMetadata = {
        data: orders?.map((order: any) => ({
          id: order.id,
          createdAt: order.createdAt,
          amount: {
            amount: order.totalAmount,
            currency: order.currency,
          },
          status: order.status,
          product: {
            name: order?.product?.name,
          },
          invoiceId: order.isInvoiceGenerated ? order.id : null,
        })),
        meta: {
          hasNextPage:
            (pageParam ? Number(pageParam) : 1) < (pagination?.maxPage ?? 10),
          cursor:
            (pageParam ? Number(pageParam) : 1) < (pagination?.maxPage ?? 10)
              ? (pageParam ? Number(pageParam) : 1) + 1
              : undefined,
        },
      };
      return ordersWithMetadata;
    },
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => meta?.cursor,
  });
  const tableData = useMemo(() => {
    return data?.pages.flatMap((page) => page?.data ?? []) ?? [];
  }, [data]);
  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium leading-none tracking-tight mb-4">
        Orders
      </h2>
      <Card>
        <CardContent>
          <div className="w-full">
            <Table>
              <OrdersTableHeader />
              <TableBody>
                {tableData.length <= 0 ? (
                  <OrdersTableEmpty />
                ) : (
                  tableData.map((order) => (
                    <TableRow key={order.id} className="h-[45px]">
                      <TableCell className="w-[120px] text-sm text-muted-foreground">
                        {format(order.createdAt, "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="w-[100px] font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: order.amount.currency,
                        }).format(order.amount.amount / 100)}
                      </TableCell>
                      <TableCell className="w-[120px]">
                        <OrderStatus status={order.status} />
                      </TableCell>
                      <TableCell className="w-[140px] text-sm">
                        {order.product?.name || "N/A"}
                      </TableCell>
                      <TableCell className="w-[100px] text-right">
                        <ActionsMenu order={order} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {hasNextPage && (
              <div className="flex items-center justify-center mt-6">
                <Button
                  onClick={() => fetchNextPage()}
                  variant="outline"
                  className="w-full"
                >
                  {isFetching ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Load more"
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceList;

function OrdersTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[120px]">Date</TableHead>
        <TableHead className="w-[100px]">Amount</TableHead>
        <TableHead className="w-[120px]">Status</TableHead>
        <TableHead className="w-[140px]">Product</TableHead>
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

function OrdersTableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-32 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </TableCell>
    </TableRow>
  );
}

function OrderStatus({
  status,
  className,
}: {
  status?: string;
  className?: string;
}) {
  if (!status) {
    return null;
  }

  return (
    <div
      className={cn(
        "px-2 py-0.5 rounded-full cursor-default font-mono inline-flex max-w-full text-[11px]",
        status === "paid" &&
          "text-[#00C969] bg-[#DDF1E4] dark:text-[#00C969] dark:bg-[#00C969]/10",
        status === "pending" &&
          "bg-[#FFD02B]/10 text-[#FFD02B] dark:bg-[#FFD02B]/10 dark:text-[#FFD02B]",
        (status === "cancelled" || status === "canceled") &&
          "text-[#878787] bg-[#F2F1EF] text-[10px] dark:text-[#878787] dark:bg-[#1D1D1D]",
        status === "failed" &&
          "text-[#1D1D1D] bg-[#878787]/10 dark:text-[#F5F5F3] dark:bg-[#F5F5F3]/10",
        className
      )}
    >
      <span className="line-clamp-1 truncate inline-block capitalize">
        {status}
      </span>
    </div>
  );
}

function ActionsMenu({ order }: { order: any }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [shouldPoll, setShouldPoll] = useState(false);
  const [_progress, setProgress] = useState(0);
  const [pollCount, setPollCount] = useState(0);
  const { data: invoiceStatus, error: invoiceError } = useQuery({
    queryKey: ["invoice-status", order.id],
    enabled: shouldPoll,
    refetchInterval: shouldPoll ? 2000 : false,
    refetchIntervalInBackground: false,
    queryFn: async () => {
      const response = await fetch(`/api/v1/billing/invoice/${order.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch invoice status");
      }
      const data = await response.json();
      return data as {
        state: "not_generated" | "generating" | "ready";
        url?: string;
      };
    },
  });
  const downloadInvoiceMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/v1/billing/invoice/${order.id}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch invoice");
      }
      const data = await response.json();
      return data as {
        state: "not_generated" | "generating" | "ready";
        url?: string;
      };
    },
    onSuccess: (data) => {
      if (data.state === "ready" && data.url) {
        downloadInvoice(data.url);
      } else if (data.state === "generating") {
        toast.info("Generating invoice...", { duration: 4000 });
        setProgress(10);
        setPollCount(0);
        setShouldPoll(true);
      }
    },
    onError: (ctx) => {
      toast.error("Download failed, please try again.");
      setIsDownloading(false);
      setShouldPoll(false);
      setProgress(0);
      setPollCount(0);
    },
  });
  useEffect(() => {
    if (!shouldPoll || !invoiceStatus) return;

    toast.dismiss();
    if (invoiceStatus.state === "ready" && invoiceStatus.url) {
      setShouldPoll(false);
      downloadInvoice(invoiceStatus.url);
      setIsDownloading(false);
      setProgress(100);
      setPollCount(0);
    } else if (invoiceStatus.state == "generating") {
      setPollCount((count) => count + 1);
      const newProgress = Math.min(90, 10 + pollCount * 8);
      setProgress(newProgress);
      toast.info(`Generating invoice... (${newProgress}%)`, { duration: 4000 });
    }
  }, [invoiceStatus, shouldPoll, order.id, pollCount]);
  useEffect(() => {
    if (invoiceError && shouldPoll) {
      setShouldPoll(false);
      setIsDownloading(false);
      setProgress(0);
      setPollCount(0);
      toast.dismiss();
      toast.error("Download failed, please try again.");
    }
  }, [invoiceError, shouldPoll]);
  useEffect(() => {
    if (shouldPoll) {
      const timeout = setTimeout(() => {
        setShouldPoll(false);
        setIsDownloading(false);
        setProgress(0);
        setPollCount(0);
        toast.dismiss();
        toast.error("Download timed out, please try again.");
      }, 120000);
      return () => clearTimeout(timeout);
    }
  }, [shouldPoll]);
  const handleDownload = useCallback(() => {
    setIsDownloading(true);
    downloadInvoiceMutation.mutate(order.id);
  }, [downloadInvoiceMutation, order.id]);
  return (
    <Button onClick={handleDownload} disabled={isDownloading} variant={"ghost"}>
      {isDownloading ? <Loader2 className="animate-spin" /> : <Download />}
    </Button>
  );
}

const downloadInvoice = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "invoice.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

