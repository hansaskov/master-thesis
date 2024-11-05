import { swagger } from "@elysiajs/swagger";
import { Elysia, error, t } from "elysia";
import { Queries, Schema, Table } from "./db/model";
import { db } from "./db/postgres";

const api = new Elysia().onBeforeHandle(({ request }) => console.log(request.url));

const app = new Elysia({ prefix: "/api" })
	.use(swagger())
	.use(api)
	.listen(process.env.PORT as string);

console.log(`🦊 Server started at ${app.server?.url.origin}`);

export type App = typeof app;
