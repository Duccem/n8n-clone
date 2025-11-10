import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { helloWorld } from "@/lib/inngest/tasks/hello-world";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld],
});

