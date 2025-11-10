import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as auth from "./schema/auth";
import * as workflow from "./schema/workflow";
const sql = neon(process.env.DATABASE_URL!);
export const database = drizzle({
  client: sql,
  schema: {
    ...auth,
    ...workflow,
  },
});

