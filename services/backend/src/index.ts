import { swagger } from "@elysiajs/swagger";
import { Elysia, t } from "elysia";

const api = new Elysia()
  .onBeforeHandle(({ request }) => console.log(request.url))
  .post(
    "/hello",
    ({ body }) => `Hello, ${body.name}! You've been greeted from The server!`,
    {
      body: t.Object({
        name: t.String(),
      }),
    },
  );

const app = new Elysia({ prefix: "/api" })
  .use(swagger())
  .use(api)
  .listen(process.env.PORT as string);

console.log(`🦊 Server started at ${app.server?.url.origin}`);

export type App = typeof app;
