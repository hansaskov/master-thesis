import type { Prettify } from "elysia/types";
import type { Component, ComponentProps } from "svelte";

type Props = any

interface DialogData<TComponent extends Component<Props>> {
    title: string;
    description: string;
    component: TComponent;
    props: ComponentProps<TComponent>;
}

class DialogStore {
    public isOpen = $state(false);
    data: DialogData<Component<Props>>| undefined = $state(undefined);

    public open<TComponent extends Component<Props>>(
        data: Prettify<DialogData<TComponent>>
    ) {
        this.isOpen = true;
        this.data = data;
    }

    public close() {
        this.isOpen = false;
        this.data = undefined;
    }
}

export let dialogStore = new DialogStore();