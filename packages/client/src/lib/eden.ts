import { PUBLIC_SERVER_URL } from '$env/static/public';
import { treaty } from '@elysiajs/eden'
import type { App } from "backend";


export const api = treaty<App>(PUBLIC_SERVER_URL).api