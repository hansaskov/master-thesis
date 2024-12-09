<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Drawer from "$lib/components/ui/drawer/index.js";
	import type { Snippet } from "svelte";
	import type { Builder } from "bits-ui";
	import { Button } from "./ui/button";
	import { dialogStore } from "$lib/stores/dialog.svelte";
  

    let innerWidth = $state(window.innerWidth)
    let isDesktop = $derived(innerWidth > 768);

   </script>

   <svelte:window bind:innerWidth={innerWidth}/>
    
   {#if isDesktop}
    <Dialog.Root bind:open={dialogStore.isOpen}>
     <Dialog.Trigger />
     <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
       <Dialog.Title>{dialogStore.title}</Dialog.Title>
       <Dialog.Description>
        {dialogStore.description}
       </Dialog.Description>
      </Dialog.Header>
      {#if dialogStore.children}
        <dialogStore.children />
      {/if}      
     </Dialog.Content>
    </Dialog.Root>
   {:else}
   <Drawer.Root bind:open={dialogStore.isOpen}>
    <Dialog.Trigger />
    <Drawer.Content>
      <Drawer.Header class="text-left">
        <Drawer.Title>{dialogStore.title}</Drawer.Title>
        <Drawer.Description>
          {dialogStore.description}
        </Drawer.Description>
      </Drawer.Header>
      <div class="px-4 pb-4">
        {#if dialogStore.children}
          <dialogStore.children />
        {/if}         
    </div>
    </Drawer.Content>
  </Drawer.Root>
   {/if}