import { treaty } from '@elysiajs/eden'
import type { App } from "backend";

// ignore type error
export const api = treaty<App>("localhost:3000");