import { os } from "@orpc/server";
import { z } from "zod";

export const listWorkspaces = os
  .route({
    method: "GET",
    path: "/workspace",
    summary: "List all workspaces",
    tags: ["Workspace"],
  })
  .input(z.void())
  .output(z.void())
  .handler(async ({ input }) => {
    console.log(input);
  });
