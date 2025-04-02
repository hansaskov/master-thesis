import { api } from "$collections/api";
import { logger } from "@bogeychan/elysia-logger";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { env } from "elysia";

const app = new Elysia({ 
	precompile: true, 
	serve: { 
		reusePort: true // Reuse port for clustering 
	} 
})
	.get(
		".well-known/microsoft-identity-association.json",
		Bun.file("public/.well-known/microsoft-identity-association.json"),
	)
	.use(logger())
	.use(swagger({ path: "/api/swagger" }))
	.use(api)
	.listen(env.port ?? 3000);

