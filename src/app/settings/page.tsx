
"use client"

import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Moon, Sun, Laptop, Trash2, Paintbrush } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/page-header"
import { PageFooter } from "@/components/page-footer"

export default function SettingsPage() {
  const { setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()

  const handleClearData = () => {
    try {
      localStorage.removeItem("medHotspotData")
      toast({
        title: "Data Cleared",
        description: "All local application data has been removed.",
      })
      // Navigate to home to reload the state
      router.push("/")
    } catch (error) {
      console.error("Failed to clear data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not clear application data.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader />

      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-primary tracking-tight">Settings</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Manage your application preferences and data.
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Paintbrush className="w-6 h-6 text-accent"/>
                    Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-4">
                <Button variant="outline" onClick={() => setTheme("light")}>
                  <Sun className="mr-2" /> Light
                </Button>
                <Button variant="outline" onClick={() => setTheme("dark")}>
                  <Moon className="mr-2" /> Dark
                </Button>
                <Button variant="outline" onClick={() => setTheme("system")}>
                  <Laptop className="mr-2" /> System
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trash2 className="w-6 h-6 text-destructive"/>
                    Data Management
                </CardTitle>
                <CardDescription>
                  This action will permanently delete all your analyzed data from this browser.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Clear All Data</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your analysis data, including uploaded file lists and topic counts, from your browser's local storage.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearData}>
                        Yes, delete data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
          <PageFooter />
        </div>
      </main>
    </div>
  )
}
