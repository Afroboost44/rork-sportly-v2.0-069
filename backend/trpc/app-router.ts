import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";
import { aiRouter } from "./routes/ai";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
