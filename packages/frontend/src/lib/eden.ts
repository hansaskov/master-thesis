import { treaty } from '@elysiajs/eden'
import type { App } from "backend";
import { dev } from "$app/environment"

const serverURL = dev ? "localhost:5173" : "localhost:3000"

export const api = treaty<App>(serverURL).api