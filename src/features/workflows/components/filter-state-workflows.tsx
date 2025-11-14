"use client";

import { Button } from "@/components/ui/button";
import { parseAsString, useQueryState } from "nuqs";

const FilterStateWorkflows = () => {
  const [state, setState] = useQueryState("state");
  return (
    <div className="flex flex-1 items-center gap-3 justify-end">
      <Button
        variant={!state ? "default" : "ghost"}
        onClick={() => setState(null)}
      >
        All
      </Button>
      <Button
        variant={state == "active" ? "default" : "ghost"}
        onClick={() => setState("active")}
      >
        Actives
      </Button>
      <Button
        variant={state == "archived" ? "default" : "ghost"}
        onClick={() => setState("archived")}
      >
        Archived
      </Button>
    </div>
  );
};

export default FilterStateWorkflows;

