import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
            <div className="bg-card/40 backdrop-blur-md border border-border/60 p-12 rounded-2xl flex flex-col items-center text-center max-w-md shadow-xl">
                <div className="h-20 w-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 ring-1 ring-primary/20">
                    <CalendarIcon size={40} />
                </div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Calendar</h1>
                <p className="text-muted-foreground mb-8">
                    Schedule and track maintenance activities visually. This feature is coming soon to help you plan better.
                </p>
                <div className="px-4 py-2 bg-secondary/50 rounded-full text-xs font-semibold uppercase tracking-widest text-secondary-foreground border border-secondary">
                    Coming Soon
                </div>
            </div>
        </div>
    );
}
