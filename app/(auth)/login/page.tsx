"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "../actions";

const initialState = {
    error: "",
};

export default function LoginPage() {
    const [state, action, isPending] = useActionState(login, initialState);

    return (
        <div className="bg-card/30 backdrop-blur-xl border border-border/40 p-8 rounded-2xl shadow-xl ring-1 ring-white/5 space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Welcome back</h1>
                <p className="text-muted-foreground text-sm">
                    Enter your email to sign in to your maintenance account
                </p>
            </div>

            <form action={action} className="space-y-6">
                {state?.error && (
                    <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-lg text-sm flex items-center gap-2">
                        <span className="font-medium">Error:</span> {state.error}
                    </div>
                )}

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute left-3 top-2.5 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/30 border border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder:text-muted-foreground/50 text-foreground"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                                Password
                            </label>
                            <Link
                                href="#"
                                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-3 top-2.5 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/30 border border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder:text-muted-foreground/50 text-foreground"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
                >
                    {isPending ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Signing in...</span>
                        </div>
                    ) : "Sign in"}
                </button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-foreground hover:text-primary transition-colors">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
