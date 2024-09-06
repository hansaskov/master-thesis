'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Cpu, Truck, Camera, Thermometer, BarChart } from "lucide-react"
import { ReactNode } from "react";


interface Metric {
  name: string;
  value: string;
  unit: string;
}

interface MetricGroup {
  title: string;
  icon: ReactNode;
  metrics: Metric[];
}

interface MetricCardProps {
  title: string;
  icon: ReactNode;
  metrics: Metric[];
}

const metricGroups: MetricGroup[] = [
  {
    title: "System Metrics",
    icon: <Activity className="h-4 w-4" />,
    metrics: [
      { name: "System Version", value: "3.2.1", unit: "" },
      { name: "CPU Load", value: "45", unit: "%" },
      { name: "Processor Temperature", value: "62", unit: "°C" },
      { name: "Memory Utilization", value: "70", unit: "%" },
      { name: "Available Storage", value: "256", unit: "GB" },
      { name: "Total Disk Write", value: "1024", unit: "GB" },
      { name: "Network Latency", value: "5", unit: "ms" },
      { name: "System Uptime", value: "720", unit: "h" },
    ]
  },
  {
    title: "Hardware Metrics",
    icon: <Cpu className="h-4 w-4" />,
    metrics: [
      { name: "Motor Uptime", value: "5000", unit: "h" },
      { name: "Motor Torque", value: "150", unit: "Nm" },
      { name: "Conveyor Distance", value: "10000", unit: "m" },
      { name: "Lighting Duration", value: "3000", unit: "h" },
      { name: "Battery Level", value: "85", unit: "%" },
      { name: "Power Consumption", value: "1200", unit: "kWh" },
    ]
  },
  {
    title: "Production Metrics",
    icon: <Truck className="h-4 w-4" />,
    metrics: [
      { name: "Rejected Items", value: "52", unit: "" },
      { name: "Air Flow Rate", value: "120", unit: "m³/h" },
      { name: "Pressure", value: "101", unit: "kPa" },
      { name: "Noise Level", value: "65", unit: "dB" },
      { name: "Water Consumption", value: "500", unit: "L" },
    ]
  },
  {
    title: "Camera Metrics",
    icon: <Camera className="h-4 w-4" />,
    metrics: [
      { name: "Camera Uptime", value: "4500", unit: "h" },
      { name: "Camera Temperature", value: "35", unit: "°C" },
      { name: "Frame Errors", value: "3", unit: "" },
    ]
  },
  {
    title: "Environmental Metrics",
    icon: <Thermometer className="h-4 w-4" />,
    metrics: [
      { name: "Humidity Level", value: "45", unit: "%" },
      { name: "Ambient Temperature", value: "22", unit: "°C" },
    ]
  },
  {
    title: "Security Metrics",
    icon: <BarChart className="h-4 w-4" />,
    metrics: [
      { name: "Security Incidents", value: "0", unit: "" },
    ]
  },
]

function MetricCard({ title, icon, metrics } : MetricCardProps ) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Metric</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric, index) => (
              <TableRow key={index}>
                <TableCell className="text-left font-medium">{metric.name}</TableCell>
                <TableCell className="text-right">{metric.value} {metric.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function MonitoringDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metricGroups.map((group, index) => (
        <MetricCard key={index} title={group.title} icon={group.icon} metrics={group.metrics} />
      ))}
    </div>
  )
}