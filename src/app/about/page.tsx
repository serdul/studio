import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cpu, Database, FileText, Monitor } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
            <Button asChild variant="outline" size="sm">
                <Link href="/">
                <ArrowLeft className="mr-2" />
                Back to Dashboard
                </Link>
            </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary tracking-tight">How MedHotspot Works</h1>
                <p className="mt-4 text-lg text-muted-foreground">A simple explanation for the curious mind.</p>
            </div>

            <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Monitor className="w-8 h-8 text-accent"/>
                  <div>
                    <CardTitle>The Frontend (What You See)</CardTitle>
                    <CardDescription>The user interface you interact with.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                <p>
                    Imagine the app is like a digital storefront. The part you see and click on—the dashboard, the buttons, the topic lists—is the "frontend." It's built to be clean and easy to use, so you can quickly see the most important information. Its main job is to display the "hot zones" from your exam papers in a clear, organized way and to let you upload new documents.
                </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Cpu className="w-8 h-8 text-accent"/>
                    <div>
                        <CardTitle>The Backend (The "Brains")</CardTitle>
                        <CardDescription>Where the analysis happens.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                <p>
                    The "backend" is the smart assistant working behind the scenes. When you upload a document, the backend's AI (powered by Google's Gemini model) reads through it, identifies the medical topics in each question, and figures out which category it belongs to. This is the core "thinking" part of the app that does all the heavy lifting of analysis.
                </p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <FileText className="w-8 h-8 text-accent"/>
                    <div>
                        <CardTitle>How It "Reads" PDFs (OCR Simulation)</CardTitle>
                        <CardDescription>Understanding the current prototype.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                <p>
                    Right now, the app doesn't actually perform Optical Character Recognition (OCR) on the PDFs you upload. That's a complex process! Instead, to show how the AI works, it uses a pre-written list of sample medical questions. When you upload any PDF, the app pretends it "read" that PDF and uses these sample questions to feed to the AI. This is a common trick in prototypes to focus on demonstrating the most important feature—in this case, the AI's ability to classify questions.
                </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Database className="w-8 h-8 text-accent"/>
                    <div>
                        <CardTitle>Data Storage (Where Your Info Is Kept)</CardTitle>
                        <CardDescription>Local and private to your device.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                <p>
                    All the data—the topics, their frequencies, and the list of files you've uploaded—is stored directly in your web browser on your own device. It uses a browser feature called `localStorage`. Think of it like a digital notepad on your computer that only you can see. The data doesn't get sent to a central server, ensuring your information stays private to you. The downside is that if you switch to a different browser or device, the data won't come with you.
                </p>
                </CardContent>
            </Card>
            </div>

            <footer className="py-8 mt-8 text-center text-sm text-muted-foreground">
                Built with AI by Firebase Studio.
            </footer>
        </div>
      </main>
    </div>
  );
}
