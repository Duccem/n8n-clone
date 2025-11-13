import z from "zod";
import { authenticated } from "@/lib/api";
import { polarClient } from "@/lib/payments";
import slugify from "slugify";

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

const getCustomerState = authenticated
  .route({ method: "GET", path: "/state" })
  .handler(async ({ context }) => {
    const state = await polarClient.customers.getStateExternal({
      externalId: context.organization.id,
    });
    return { subscription: state.activeSubscriptions[0] || null };
  });

const getOrders = authenticated
  .route({ method: "GET", path: "/orders" })
  .input(
    z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
    })
  )
  .handler(async ({ context, input }) => {
    const customer = await polarClient.customers.getExternal({
      externalId: context.organization.id,
    });
    const orders = await polarClient.orders.list({
      customerId: customer.id,
      page: input.page,
      limit: input.limit,
    });
    return {
      orders: orders.result.items,
      pagination: orders.result.pagination,
    };
  });

const createBillingCustomer = authenticated
  .route({
    method: "POST",
    path: "/customer",
  })
  .handler(async ({ context }) => {
    await polarClient.customers.create({
      externalId: context.organization.id,
      email: `${slugify(context.organization.name)}@nodebase.com`,
    });
  });

export const billingRouter = authenticated.prefix("/billing").router({
  getInvoice,
  generateInvoice,
  getCustomerState,
  getOrders,
  createBillingCustomer,
});

