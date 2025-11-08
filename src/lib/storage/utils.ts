import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "./core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>({
    url: "/api/storage",
  });

