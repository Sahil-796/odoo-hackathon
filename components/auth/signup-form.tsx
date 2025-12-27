"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signup } from "@/app/(auth)/actions";

interface SignupFormProps {
    companies: { id: number; name: string }[];
}

const initialState = {
    error: "",
};

export default function SignupForm({ companies = [] }: SignupFormProps) {
    const [state, action, isPending] = useActionState(signup, initialState);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

    const isCreatingNew = selectedCompanyId === "new";

    return (
        <div className="bg-card/30 backdrop-blur-xl border border-border/40 p-8 rounded-2xl shadow-xl ring-1 ring-white/5 space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Create an account</h1>
                <p className="text-muted-foreground text-sm">
                    Enter your information to get started with GearGuard
                </p>
            </div>

            <form action={action} className="space-y-5">
                {state?.error && (
                    <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-lg text-sm flex items-center gap-2">
                        <span className="font-medium">Error:</span> {state.error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                            Full Name
                        </label>
                        <div className="relative group">
                            <div className="absolute left-3 top-2.5 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/30 border border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder:text-muted-foreground/50 text-foreground"
                            />
                        </div>
                    </div>

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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="role" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                                Role
                            </label>
                            <div className="relative">
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/30 border border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-foreground appearance-none"
                                >
                                    <option value="technician">Technician</option>
                                    <option value="manager">Manager</option>
                                </select>
                                <div className="absolute right-3 top-3 text-muted-foreground pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="companySelect" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                                Company
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-muted-foreground z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </div>
                                <select
                                    id="companySelect"
                                    name="companyId"
                                    required
                                    className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-secondary/30 border border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-foreground appearance-none"
                                    value={selectedCompanyId}
                                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                                >
                                    <option value="" disabled>Select a company</option>
                                    <option value="new" className="font-semibold text-primary">+ Create New Company</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-3 text-muted-foreground pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conditional Input for New Company Name */}
                    {isCreatingNew && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                                New Company Name
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-2.5 text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /></svg>
                                </div>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    placeholder="Enter your company name"
                                    required={isCreatingNew}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/30 border border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder:text-muted-foreground/50 text-foreground"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-3 top-2.5 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/30 border border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder:text-muted-foreground/50 text-foreground"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="rePassword" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-3 top-2.5 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                            </div>
                            <input
                                id="rePassword"
                                name="rePassword"
                                type="password"
                                required
                                minLength={6}
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
                            <span>Creating account...</span>
                        </div>
                    ) : "Create account"}
                </button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-foreground hover:text-primary transition-colors">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
