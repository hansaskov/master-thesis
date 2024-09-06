/**
 * v0 by Vercel.
 * @see https://v0.dev/t/6Cqe6QH2QtX
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { CheckIcon, XIcon } from "lucide-react"

export default function Service() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 md:py-20 lg:py-24">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Service Agreements</h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
          Choose the perfect support plan for your business needs. Our flexible options ensure you get the right level
          of assistance.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary text-primary-foreground py-4 px-6">
            <h3 className="text-2xl font-bold">Starter</h3>
            <p className="text-lg">For small teams</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h4 className="text-xl font-semibold">$49/mo</h4>
              <p className="text-muted-foreground">Billed annually</p>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 fill-primary" />
                Email Support
              </li>
              <li className="flex items-center gap-2">
                <XIcon className="w-5 h-5 fill-primary" />
                Phone Support
              </li>
              <li className="flex items-center gap-2">
                <XIcon className="w-5 h-5 fill-primary" />
                Priority Ticket Handling
              </li>
              <li className="flex items-center gap-2">
                <XIcon className="w-5 h-5 fill-muted-foreground" />
                Dedicated Account Manager
              </li>
            </ul>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary text-primary-foreground py-4 px-6">
            <h3 className="text-2xl font-bold">Professional</h3>
            <p className="text-lg">For growing teams</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h4 className="text-xl font-semibold">$99/mo</h4>
              <p className="text-muted-foreground">Billed annually</p>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 fill-primary" />
                Email Support
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 fill-primary" />
                Phone Support
              </li>
              <li className="flex items-center gap-2">
                <XIcon className="w-5 h-5 fill-primary" />
                Priority Ticket Handling
              </li>
              <li className="flex items-center gap-2">
                <XIcon className="w-5 h-5 fill-primary" />
                Dedicated Account Manager
              </li>
            </ul>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary text-primary-foreground py-4 px-6">
            <h3 className="text-2xl font-bold">Enterprise</h3>
            <p className="text-lg">For large teams</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h4 className="text-xl font-semibold">$199/mo</h4>
              <p className="text-muted-foreground">Billed annually</p>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 fill-primary" />
                Email Support
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 fill-primary" />
                Phone Support
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 fill-primary" />
                Priority Ticket Handling
              </li>
              <li className="flex items-center gap-2">
                <XIcon className="w-5 h-5 fill-primary" />
                Dedicated Account Manager
              </li>
            </ul>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary text-primary-foreground py-4 px-6">
            <h3 className="text-2xl font-bold">Enterprise Plus</h3>
            <p className="text-lg">For the largest teams</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h4 className="text-xl font-semibold">$299/mo</h4>
              <p className="text-muted-foreground">Billed annually</p>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 fill-primary" />
                Email Support
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 fill-primary" />
                Phone Support
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 fill-primary" />
                Priority Ticket Handling
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 fill-primary" />
                Dedicated Account Manager
              </li>
            </ul>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
      </div>
      <div className="mt-12 flex justify-center">
        <Button size="lg">Contact Support</Button>
      </div>
    </div>
  )
}
