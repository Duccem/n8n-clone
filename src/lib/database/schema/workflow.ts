import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const workflow = pgTable("workflow", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  name: text("name").notNull(),
});

