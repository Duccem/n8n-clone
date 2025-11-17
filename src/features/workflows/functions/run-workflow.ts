import { inngest } from "@/lib/inngest";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
    step.sleep("wait a second", 1); // Simulate some processing time

    const { workflowId, organizationId } = event.data;

    // Here you would add the logic to actually execute the workflow
    console.log(
      `Executing workflow ${workflowId} for organization ${organizationId}`
    );
  }
);

