"use client"

import Image from "next/image"
import Link from "next/link"
import { MoreHorizontal, ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const statusTypes = ["Active", "Offline", "Paused"] as const
type StatusType = typeof statusTypes[number]

const getStatusVariant = (status: StatusType) => {
  switch (status) {
    case 'Active':
      return 'outline'
    case 'Offline':
      return 'default'
    case 'Paused':
      return 'secondary'
  }
}

interface SystemsType {
  id: string,
  name: string,
  status: StatusType,
  location: string,
  image: string,
  lastCheck: string
}

const systems: SystemsType[] = [
  {
    id: "vp1",
    name: "VisioPointer® 1",
    status: "Active",
    location: "Production Line 1",
    image: "/placeholder.svg",
    lastCheck: "2 minutes ago"
  },
  {
    id: "vc1",
    name: "VisioCompact® 1",
    status: "Active",
    location: "Assembly Area A",
    image: "/placeholder.svg",
    lastCheck: "5 minutes ago"
  },
  {
    id: "360i1",
    name: "360 Inspector® 1",
    status: "Active",
    location: "Quality Control Station",
    image: "/placeholder.svg",
    lastCheck: "1 minute ago"
  },
  {
    id: "si1",
    name: "SmartInspector® 1",
    status: "Paused",
    location: "Packaging Line 2",
    image: "/placeholder.svg",
    lastCheck: "10 minutes ago"
  },
  {
    id: "vp2",
    name: "VisioPointer® 2",
    status: "Paused",
    location: "Production Line 2",
    image: "/placeholder.svg",
    lastCheck: "15 minutes ago"
  },
  {
    id: "vc2",
    name: "VisioCompact® 2",
    status: "Active",
    location: "Assembly Area B",
    image: "/placeholder.svg",
    lastCheck: "8 minutes ago"
  },
  {
    id: "vp2",
    name: "VisioPointer® 3",
    status: "Paused",
    location: "Production Line 2",
    image: "/placeholder.svg",
    lastCheck: "15 minutes ago"
  },
  {
    id: "vc2",
    name: "VisioPointer® 4",
    status: "Offline",
    location: "Assembly Area B",
    image: "/placeholder.svg",
    lastCheck: "5 hours ago"
  }
]

export default function Component() {
  return (<>
    <Tabs defaultValue="All">
      <TabsList>
        <TabsTrigger value="All">All</TabsTrigger>
        <TabsTrigger value="Active">Active</TabsTrigger>
        <TabsTrigger value="Paused">Paused</TabsTrigger>
        <TabsTrigger value="Offline">Offline</TabsTrigger>
      </TabsList>

    <Card className="w-full">
      <CardHeader>
        <CardTitle>Production Systems</CardTitle>
        <CardDescription>
          Monitor and manage your production systems across different factory areas.
        </CardDescription>
      </CardHeader>
      <CardContent>
      <TabsContent value="All">       
         <SystemsTable systems={systems}></SystemsTable>
      </TabsContent>
      <TabsContent value="Active">       
         <SystemsTable systems={systems.filter(({status}) => status == "Active")}></SystemsTable>
      </TabsContent>
      <TabsContent value="Paused">       
         <SystemsTable systems={systems.filter(({status}) => status == "Paused")}></SystemsTable>
      </TabsContent>
      <TabsContent value="Offline">       
         <SystemsTable systems={systems.filter(({status}) => status == "Offline")}></SystemsTable>
      </TabsContent>

      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          Showing <strong>{systems.length}</strong> of <strong>{systems.length}</strong> systems
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/systems">
            View All Systems
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
    </Tabs>

  </>)
}


function SystemsTable({systems}: {systems: SystemsType[]}) {
  return (<>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] hidden md:table-cell">
              <span className="sr-only">Image</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden md:table-cell">Last Check</TableHead>
            <TableHead >Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {systems.map((system) => (
            <TableRow key={system.id}>
              <TableCell className="hidden md:table-cell">
                <Image
                  alt={`${system.name} icon`}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={system.image}
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">{system.name}</TableCell>
              <TableCell className="">
                <Badge variant={getStatusVariant(system.status)}>
                  {system.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{system.location}</TableCell>
              <TableCell className="hidden md:table-cell">{system.lastCheck}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/systems/monitoring/abcd`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Restart System</DropdownMenuItem>
                      <DropdownMenuItem>Update Configuration</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </>)
}