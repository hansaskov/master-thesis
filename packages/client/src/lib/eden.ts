import { edenTreaty } from "@elysiajs/eden";
import type { App } from "backend";

// ignore type error
export const api = edenTreaty<App>("http://localhost:3000");