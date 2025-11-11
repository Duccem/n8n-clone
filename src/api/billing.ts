import z from "zod";
import { authenticated } from ".";
import { polarClient } from "@/lib/payments";

const getInvoice = authenticated
  .route({
    method: "GET",
    path: "/invoice/:orderId",
  })
  .input(
    z.object({
      orderId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const order = await polarClient.orders.get({ id: input.orderId });

    if (!order.isInvoiceGenerated) {
      return {
        state: "not_generated",
      };
    }

    try {
      const invoice = await polarClient.orders.invoice({
        id: input.orderId,
      });

      return {
        state: "ready",
        url: invoice.url,
      };
    } catch (error) {
      return {
        state: "generating",
      };
    }
  });

const generateInvoice = authenticated
  .route({
    method: "POST",
    path: "/invoice/:orderId",
  })
  .input(
    z.object({
      orderId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const order = await polarClient.orders.get({ id: input.orderId });

    if (!order.isInvoiceGenerated) {
      return {
        state: "not_generated",
      };
    }

    try {
      const invoice = await polarClient.orders.invoice({
        id: input.orderId,
      });

      return {
        state: "ready",
        url: invoice.url,
      };
    } catch (error) {
      return {
        state: "generating",
      };
    }
  });

export const billingRouter = authenticated.prefix("/billing").router({
  getInvoice,
  generateInvoice,
});

