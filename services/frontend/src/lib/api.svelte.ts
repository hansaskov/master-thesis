import { treaty } from "@elysiajs/eden";
import type { App } from "backend";

const hostname = "/localhost"

export const api = treaty<App>(hostname).api




