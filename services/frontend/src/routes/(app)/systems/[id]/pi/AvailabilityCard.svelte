<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  
    export let uptime: number;
    export let downtime: number;
  </script>
  
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Availability</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="relative pt-1">
        <div class="flex mb-2 items-center justify-between">
          <div>
            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/20">
              Uptime
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold inline-block text-primary">
              {uptime}%
            </span>
          </div>
        </div>
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
          <div style="width:{uptime}%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
        </div>
      </div>
      <div class="relative pt-1">
        <div class="flex mb-2 items-center justify-between">
          <div>
            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-destructive bg-destructive/20">
              Downtime
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold inline-block text-destructive">
              {downtime}%
            </span>
          </div>
        </div>
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-destructive/20">
          <div style="width:{downtime}%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-destructive"></div>
        </div>
      </div>
    </CardContent>
  </Card>