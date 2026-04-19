import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { PawPrint, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "404 – Page Not Found | PetoPhilia",
}

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6">
        <PawPrint size={44} />
      </div>
      <h1 className="text-7xl font-black text-primary mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        Looks like this page wandered off. Let's get you back on the right path.
      </p>
      <Link href="/">
        <Button size="lg" className="gap-2">
          <ArrowLeft size={16} /> Back to Home
        </Button>
      </Link>
    </div>
  )
}
