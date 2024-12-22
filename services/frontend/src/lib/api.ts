import { treaty } from '@elysiajs/eden';
import type { App } from 'backend';

// Get the hostname of the current web page
const host = window.location.host;
// const host = page.url.host;

export const api = treaty<App>(host).api;
