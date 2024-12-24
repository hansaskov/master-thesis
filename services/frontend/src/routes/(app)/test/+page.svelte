<script>
    import { Button } from "@/components/ui/button";
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
    import { TableIcon, WrenchIcon } from "lucide-svelte";
    </script>
    
    <div class="container mx-auto p-8 space-y-6">
        <header class="space-y-2">
            <h1 class="text-4xl font-bold tracking-tight">Development Dashboard</h1>
            <p class="text-muted-foreground">Access development examples and work-in-progress features</p>
        </header>
    
        <div class="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <div class="flex items-center gap-2">
                        <TableIcon class="h-5 w-5" />
                        <CardTitle>Table Example</CardTitle>
                    </div>
                    <CardDescription>
                        Complex example showcasing the powers of TanStack table
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" href="/test/table-example" class="w-full">
                        View Example
                    </Button>
                </CardContent>
            </Card>
    
            <Card>
                <CardHeader>
                    <div class="flex items-center gap-2">
                        <WrenchIcon class="h-5 w-5" />
                        <CardTitle>Spare Parts Table</CardTitle>
                    </div>
                    <CardDescription>
                        Modified TanStack table for spare parts management
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" href="/test/spare-parts" class="w-full">
                        View Table
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>