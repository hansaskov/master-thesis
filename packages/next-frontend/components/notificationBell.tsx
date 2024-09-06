import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotificationBell() {
  return (
    <Button variant="outline" size="icon" className="ml-auto h-9 w-9 bg-background">
    <Bell className="h-4 w-4" />
    <span className="sr-only">Toggle notifications</span>
  </Button>
  )
}