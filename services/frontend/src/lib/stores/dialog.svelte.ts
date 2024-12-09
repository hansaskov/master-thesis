import type { Component } from "svelte";

class DialogStore{

    public isOpen = $state(false);

    title = $state<string>()
    description = $state<string>()
    children = $state<Component>()

    public open(props: {title: string, description: string, children: Component<any, {}, string>}) {
        this.isOpen = true
        this.title = props.title
        this.description = props.description
        this.children = props.children
    }

    public close() {
        this.isOpen = false
    }
}

export let dialogStore = new DialogStore()