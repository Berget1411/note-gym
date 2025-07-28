import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { auth } from "./lib/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { openai } from "@ai-sdk/openai";
import { serve } from "@hono/node-server";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { stream } from "hono/streaming";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  })
);

app.get("/", (c) => {
  return c.text("OK");
});

app.post("/chat", async (c) => {
  const { messages }: { messages: UIMessage[] } = await c.req.json();
  const result = streamText({
    model: openai("gpt-4o"),
    system:
      "You are a helpful assistant that can answer questions and help with tasks.",
    messages: convertToModelMessages(messages),
  });

  // Return the UI message stream response directly for useChat compatibility
  return result.toUIMessageStreamResponse();
});

export default app;
