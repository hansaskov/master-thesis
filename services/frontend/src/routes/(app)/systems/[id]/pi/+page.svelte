<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { Progress } from "$lib/components/ui/progress/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    import AreaChart from '$lib/components/AreaChart.svelte';

    import AvailabilityCard from "./AvailabilityCard.svelte";
    import OeeCard from "./OeeCard.svelte"
    import ProductionSpeedCard from "./ProductionSpeedCard.svelte"
    import QualityCard from "./QualityCard.svelte"

    import Gauge from "lucide-svelte/icons/gauge";

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
        "oee": 54,
        "good parts": 9750,
        "bad parts": 250,
        "uptime": 95,
        "downtime": 5,
        "production speed": 420,
    };

    const gauges = [
        { label: 'Performance', value: 75, unit: '%' },
        { label: 'Quality', value: 90, unit: '%' },
        { label: 'Availability', value: 85, unit: '%' }
    ];


    function createTimeRange(hours: number): string[] {
        const now = new Date();
        return Array.from({ length: hours }, (_, i) => {
            const time = new Date(now.getTime() - (hours - 1 - i) * 60 * 60 * 1000);
            return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });
    }

    const chartsData = [
        {
            dataSets: [
                {
                    dataY: [85, 90, 95, 80, 75, 88, 92, 85, 78, 80, 70, 65],
                    label: 'OEE'
                }
            ],
            dataX: createTimeRange(12),
            title: 'OEE',
        },
        {
            dataSets: [
                {
                    dataY: [5, 7, 6, 5, 5, 4, 3, 3, 2, 2, 2, 1],
                    label: 'Downtime'
                },
                {
                    dataY: [95, 93, 94, 95, 95, 96, 97, 97, 98, 98, 98, 99],
                    label: 'Uptime'
                },
            ],
            dataX: createTimeRange(12),
            title: "Availability",
        }
    ];


</script>

<div class="flex flex-col sm:flex-row-reverse sm:justify-start mb-4 items-end gap-4 ">
   
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
            {#each [{ label: "From", date: startDate }, { label: "To", date: endDate }] as { label, date }}
                <div class="flex flex-col w-full sm:w-[200px]">
                    <label for="{label.toLowerCase()}-date" class="text-sm font-medium mb-1">{label}</label>
                    <Popover.Root>
                        <Popover.Trigger asChild let:builder>
                            <Button
                                id="{label.toLowerCase()}-date"
                                variant="outline"
                                class={cn(
                                    "justify-start text-left font-normal",
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
                            <Calendar />
                        </Popover.Content>
                    </Popover.Root>
                </div>
            {/each}
    {/if}



</div>


<div class="grid grid-cols-1 md:grid-cols-3 md:grid-rows-1 gap-4">
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
    



    <Card.Root class="md:row-span-3 md:col-span-2">
        <Card.Header class="flex flex-row items-center justify-between pb-2">
            <Card.Title class="text-lg font-medium">OEE of the {selectedTimeRange.label}</Card.Title>
            <Gauge class="text-muted-foreground h-4 w-4" />
        </Card.Header>
        <Separator class="mb-4" />
        <Card.Content >
            <AreaChart dataSets={chartsData[0].dataSets} dataX={chartsData[0].dataX} min={0} max={100}/>
        </Card.Content>
    </Card.Root>




    <AvailabilityCard uptime={mockData.uptime} downtime={mockData.downtime} />
    <ProductionSpeedCard productionSpeed={mockData["production speed"]} />
    <QualityCard goodParts={mockData["good parts"]}  badParts={mockData["bad parts"]} />
  


    <Card.Root class="md:row-span-3 md:col-span-2">
        <Card.Header class="flex flex-row items-center justify-between pb-2">
            <Card.Title class="text-lg font-medium">OEE of the {selectedTimeRange.label}</Card.Title>
            <Gauge class="text-muted-foreground h-4 w-4" />
        </Card.Header>
        <Separator class="mb-4" />
        <Card.Content >
            <AreaChart dataSets={chartsData[1].dataSets} dataX={chartsData[1].dataX} min={0} max={100}/>
        </Card.Content>
    </Card.Root>
</div>