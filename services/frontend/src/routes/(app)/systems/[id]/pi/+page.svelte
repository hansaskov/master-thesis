<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { Progress } from "$lib/components/ui/progress/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";

    import Activity from "lucide-svelte/icons/activity";
    import Clock from "lucide-svelte/icons/clock";
    import Gauge from "lucide-svelte/icons/gauge";
    import BoxSelect from "lucide-svelte/icons/box-select";
    import Zap from "lucide-svelte/icons/zap";


    import CalendarIcon from "svelte-radix/Calendar.svelte";
    import { DateFormatter, type DateValue, getLocalTimeZone, today, now } from "@internationalized/date";
    import { cn } from "$lib/utils";
	import type { Selected } from "bits-ui";
	import GaugeChart from "$lib/components/GaugeChart.svelte";

    const df = new DateFormatter("en-US", { dateStyle: "medium" });

    let startDate: DateValue = today(getLocalTimeZone());
    let endDate: DateValue = now(getLocalTimeZone());
    let selectedTimeRange: Selected<String> = {value: "1hour", label: "Last hour"};

    // Mock data (replace with actual data in a real application)
    const mockData = {
        "oee": 85,
        "good parts": 9750,
        "bad parts": 250,
        "uptime": 95,
        "downtime": 5,
        "production speed": 420,
    };

    const gauges = [
        { label: 'Performance', value: 50 },
        { label: 'Quality', value: 90 },
        { label: 'Availability', value: 85 }
    ];

</script>

<div class="flex flex-col sm:flex-row sm:justify-end mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
    <div class="flex flex-col w-full sm:w-[200px]">
        <label for="time-range-select" class="text-sm font-medium mb-1">Select Time Range</label>
        <Select.Root bind:selected={selectedTimeRange}>
            <Select.Trigger id="time-range-select" class="w-full">
                <Select.Value placeholder="Select time range" />
            </Select.Trigger>
            <Select.Content>
                <Select.Item value="custom"  label="Custom"/>
                <Select.Item value="10min"   label="Last 10 minutes"/>
                <Select.Item value="1hour"   label="Last hour"/>
                <Select.Item value="8hours"  label="Last 8 hours"/>
                <Select.Item value="24hours" label="Last 24 hours"/>
            </Select.Content>
            <Select.Input hidden bind:value={selectedTimeRange} />
        </Select.Root>
    </div>

    

    {#if selectedTimeRange.value === "custom"}
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {#each [{ label: "From", date: startDate }, { label: "To", date: endDate }] as { label, date }}
                <div class="flex flex-col">
                    <label for="{label.toLowerCase()}-date" class="text-sm font-medium mb-1">{label}</label>
                    <Popover.Root>
                        <Popover.Trigger asChild let:builder>
                            <Button
                                id="{label.toLowerCase()}-date"
                                variant="outline"
                                class={cn(
                                    "w-full sm:w-[200px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                                builders={[builder]}
                            >
                                <CalendarIcon class="mr-2 h-4 w-4" />
                                <span class="truncate">
                                    {date ? df.format(date.toDate(getLocalTimeZone())) : `${label} date`}
                                </span>
                            </Button>
                        </Popover.Trigger>
                        <Popover.Content class="w-auto p-0" align="start">
                            <Calendar bind:value={date} />
                        </Popover.Content>
                    </Popover.Root>
                </div>
            {/each}
        </div>
    {/if}
</div>


<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <Card.Root class="row-span-3">
        <Card.Header class="flex flex-row items-center justify-between pb-2">
            <Card.Title class="text-lg font-medium">Radial Bar Chart</Card.Title>
            <Gauge class="text-muted-foreground h-4 w-4" />
        </Card.Header>
        <Separator class="mb-4" />
        <Card.Content >
            <GaugeChart gauges={gauges} />   
        </Card.Content>


    </Card.Root>

    {#each Object.entries(mockData) as [key, value]}
        <Card.Root class="col-span-1">
            <Card.Header class="flex flex-row items-center justify-between pb-2">
                <Card.Title class="text-lg font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</Card.Title>
                {#if key === 'oee'}
                    <Gauge class="text-muted-foreground h-4 w-4" />
                {:else if key === 'performance'}
                    <Activity class="text-muted-foreground h-4 w-4" />
                {:else if key === 'availability'}
                    <Clock class="text-muted-foreground h-4 w-4" />
                {:else if key === 'quality'}
                    <BoxSelect class="text-muted-foreground h-4 w-4" />
                {:else if key === 'production speed'}
                    <Zap class="text-muted-foreground h-4 w-4" />
                {/if}
            </Card.Header>
            <Separator class="mb-4" />
            <Card.Content>
                <div class="text-3xl font-bold">
                    {#if key === 'production speed'}
                        {value}
                    {:else if ['good parts', 'bad parts'].includes(key)}
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-sm text-muted-foreground">Good Parts</p>
                                <p class="text-2xl font-bold text-green-600">{mockData['good parts']}</p>
                            </div>
                            <div>
                                <p class="text-sm text-muted-foreground">Bad Parts</p>
                                <p class="text-2xl font-bold text-red-600">{mockData['bad parts']}</p>
                            </div>
                        </div>
                    {:else if ['uptime', 'downtime'].includes(key)}
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-sm text-muted-foreground">Uptime</p>
                                <p class="text-2xl font-bold text-green-600">{mockData['uptime']}%</p>
                            </div>
                            <div>
                                <p class="text-sm text-muted-foreground">Downtime</p>
                                <p class="text-2xl font-bold text-red-600">{mockData['downtime']}%</p>
                            </div>
                        </div>
                    {:else}
                        {value}%
                    {/if}
                </div>
                {#if key === 'productionSpeed'}
                    <p class="text-muted-foreground text-sm">products / hour</p>
                {/if}
            </Card.Content>
            {#if !['goodParts', 'badParts', 'uptime', 'downtime', 'productionSpeed'].includes(key)}
                <Card.Footer>
                    <Progress value={value} aria-label="{key} Progress" />
                </Card.Footer>
            {/if}
        </Card.Root>
    {/each}
</div>