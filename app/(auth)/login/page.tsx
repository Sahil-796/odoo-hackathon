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
        <>
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-bold">Welcome back</h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Enter your email to sign in to your account
                </p>
            </div>

            <form action={action} className="space-y-4">
                {state?.error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {state.error}
                    </div>
                )}

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

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <Link
                            href="#"
                            className="text-sm font-medium hover:underline text-zinc-900 dark:text-zinc-50"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full px-3 py-2 border rounded-md bg-transparent border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-2 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isPending ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium hover:underline">
                    Sign up
                </Link>
            </div>
        </>
    );
}
