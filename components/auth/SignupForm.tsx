"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signup } from "@/app/(auth)/actions";

interface Company {
    id: number;
    name: string;
}

interface SignupFormProps {
    companies: Company[];
}

const initialState = {
    error: "",
};

export default function SignupForm({ companies }: SignupFormProps) {
    const [state, action, isPending] = useActionState(signup, initialState);
    const [selectedCompany, setSelectedCompany] = useState<string>("");
    const [isNewCompany, setIsNewCompany] = useState(false);

    const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "new") {
            setIsNewCompany(true);
            setSelectedCompany("");
        } else {
            setIsNewCompany(false);
            setSelectedCompany(value);
        }
    };

    return (
        <>
            <form action={action} className="space-y-4">
                {state?.error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {state.error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        className="w-full px-3 py-2 border rounded-md bg-transparent border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="w-full px-3 py-2 border rounded-md bg-transparent border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="role" className="block text-sm font-medium">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            required
                            className="w-full px-3 py-2 border rounded-md bg-transparent border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        >
                            <option value="technician">Technician</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="company-select" className="block text-sm font-medium">
                            Company
                        </label>
                        {/* The actual input sent to the server */}
                        {!isNewCompany && (
                            <input
                                type="hidden"
                                name="company"
                                value={selectedCompany}
                            />
                        )}

                        <select
                            id="company-select"
                            required={!isNewCompany}
                            className="w-full px-3 py-2 border rounded-md bg-transparent border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            onChange={handleCompanyChange}
                            defaultValue=""
                        >
                            <option value="" disabled>Select a company</option>
                            {companies.map((c) => (
                                <option key={c.id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                            <option value="new">+ Create New Company</option>
                        </select>
                    </div>
                </div>

                {isNewCompany && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <label htmlFor="new-company-name" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            New Company Name
                        </label>
                        <input
                            id="new-company-name"
                            name="company" // This will override the hidden input if this field is present? No, duplicate names in form data.
                            // Actually, simpler logic: if isNewCompany, render this input with name="company".
                            // If NOT isNewCompany, render hidden input with name="company" and value=selected.
                            type="text"
                            placeholder="Enter new company name"
                            required
                            className="w-full px-3 py-2 border rounded-md bg-transparent border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border rounded-md bg-transparent border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="rePassword" className="block text-sm font-medium">
                        Confirm Password
                    </label>
                    <input
                        id="rePassword"
                        name="rePassword"
                        type="password"
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border rounded-md bg-transparent border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-2 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isPending ? "Creating account..." : "Create account"}
                </button>
            </form>

            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="font-medium hover:underline">
                    Sign in
                </Link>
            </div>
        </>
    );
}
