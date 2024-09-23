<!-- Quality.svelte -->
<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";

    export let goodParts: number;
    export let badParts: number;
</script>

<Card class="w-full">
  <CardHeader>
    <CardTitle>Quality</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="flex flex-col space-y-4">
      <div class="flex justify-between">
        <div>
          <h4 class="text-xl font-semibold text-primary">{goodParts}</h4>
          <p class="text-sm text-muted-foreground">Good Parts</p>
        </div>
        <div>
          <h4 class="text-xl font-semibold text-destructive">{badParts}</h4>
          <p class="text-sm text-muted-foreground">Bad Parts</p>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
