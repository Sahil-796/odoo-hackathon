export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side: Form */}
            <div className="flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
                <div className="w-full max-w-[400px] space-y-6">
                    {children}
                </div>
            </div>

            {/* Right side: Branding/Image */}
            <div className="hidden lg:flex flex-col justify-center p-12 bg-zinc-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                <div className="relative z-10 space-y-6 max-w-lg">
                    <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-6 h-6 text-zinc-900"
                        >
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Manage your maintenance team with confidence.
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Streamline operations, track work orders, and boost efficiency with our comprehensive maintenance management solution.
                    </p>
                </div>
            </div>
        </div>
    );
}
