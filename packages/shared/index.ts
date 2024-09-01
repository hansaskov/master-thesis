import { edenTreaty } from "@elysiajs/eden";
import type { App } from "backend";

// ignore type error
export const eden = (url: string) => edenTreaty<App>(url);