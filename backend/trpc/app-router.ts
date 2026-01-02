import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";
import { aiRouter } from "./routes/ai";
import { adminRouter } from "./routes/admin";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  ai: aiRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
