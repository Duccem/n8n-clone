import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { executeWorkflow } from "@/features/workflows/functions/run-workflow";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [executeWorkflow],
});

