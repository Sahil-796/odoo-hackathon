export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-background to-background" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

            {/* Floating Orbs/Accents for depth */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

            {/* Content */}
            <div className="w-full max-w-[440px] relative z-10 pb-8">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">GearGuard</span>
                    </div>
                </div>
                {children}
                <div className="mt-8 text-center text-xs text-muted-foreground">
                    © 2024 GearGuard. All rights reserved.
                </div>
            </div>
        </div>
    );
}
