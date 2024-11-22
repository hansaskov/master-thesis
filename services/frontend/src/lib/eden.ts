import { treaty } from '@elysiajs/eden'
import type { App } from "backend";
import { dev } from "$app/environment"

const serverURL = dev ? "localhost:5173" : "localhost:3000"

const api = treaty<App>(serverURL).api

api.latest_reading.get({
    query: {
    
    }
})