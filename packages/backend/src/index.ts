import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

const app = new Elysia()
	.use(swagger())
	.use(staticPlugin())
	.get("/hello", () => {
		console.log(10);
		return "world" as const;
	})
	.listen(process.env.PORT as string);

console.log(`🦊 Server started at ${app.server?.url.origin}`)
	
export type App = typeof app;
