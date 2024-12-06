import { treaty } from "@elysiajs/eden";
import type { App } from "backend";

// Get the hostname of the current web page
const hostname = window.location.hostname;

export const api = treaty<App>(hostname).api;

