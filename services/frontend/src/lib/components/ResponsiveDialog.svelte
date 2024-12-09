<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Drawer from "$lib/components/ui/drawer/index.js";
	import type { Snippet } from "svelte";
	import type { Builder } from "bits-ui";
	import { Button } from "./ui/button";
    
    let open = $state(false);
    let innerWidth = $state(window.innerWidth)
    let isDesktop = $derived(innerWidth > 768);
    
    let {title, description, children, trigger}: {
        title: string,
        description: string,
        children: Snippet,
        trigger: Snippet<[{builder: Builder}]>
    } = $props()

   </script>

   <svelte:window bind:innerWidth={innerWidth}/>
    
   {#if isDesktop}
    <Dialog.Root bind:open>
     <Dialog.Trigger asChild let:builder>
            {@render trigger({builder})}
     </Dialog.Trigger>
     <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
       <Dialog.Title>{title}</Dialog.Title>
       <Dialog.Description>
        {description}
       </Dialog.Description>
      </Dialog.Header>
      {@render children()}
     </Dialog.Content>
    </Dialog.Root>
   {:else}
   <Drawer.Root bind:open>
    <Drawer.Trigger asChild let:builder>
        {@render trigger({builder})}
    </Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header class="text-left">
        <Drawer.Title>{title}</Drawer.Title>
        <Drawer.Description>
            {description}
        </Drawer.Description>
      </Drawer.Header>
      <div class="px-4 pb-4">
        {@render children()}
        <Drawer.Footer class="pt-2">
            <Drawer.Close asChild let:builder>
              <Button variant="outline" builders={[builder]}>Cancel</Button>
            </Drawer.Close>
          </Drawer.Footer>
    </div>
    </Drawer.Content>
  </Drawer.Root>
   {/if}