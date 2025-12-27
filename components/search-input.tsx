"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Search } from "lucide-react";

export default function SearchInput({ placeholder = "Search..." }: { placeholder?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [isPending, startTransition] = useTransition();

    // Debounce logic could be added here, but for now simple transition
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const currentSearch = searchParams.get("search") || "";
            if (currentSearch === searchTerm) return;

            const params = new URLSearchParams(searchParams.toString());
            if (searchTerm) {
                params.set("search", searchTerm);
            } else {
                params.delete("search");
            }
            startTransition(() => {
                router.replace(`?${params.toString()}`);
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, router, searchParams]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
                type="text"
                placeholder={placeholder}
                className="pl-9 w-64 bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}
