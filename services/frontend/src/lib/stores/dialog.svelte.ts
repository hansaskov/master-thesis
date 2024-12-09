import type { Prettify } from "elysia/types";
import type { Component } from "svelte";

type DialogVariants = "Alert" | "TypedAlert";

// Generic type for the onsubmit function
type DialogSubmitFunction<T = void, P = void> = (params?: P) => T | Promise<T>;

interface DialogData<T = void, P = void> {
    variant: DialogVariants;
    title: string;
    description: string;
    onsubmit: DialogSubmitFunction<T, P>;
}   

class DialogStore {
    public isOpen = $state(false);
    data: DialogData<any, any> | undefined = $state(undefined);

    public open<T = void, P = void>(data: Prettify<DialogData<T, P>>) {
        this.isOpen = true;
        this.data = data;
    }

    public close() {
        this.isOpen = false;
        this.data = undefined;
    }
}

export let dialogStore = new DialogStore();