'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path ? 'text-primary' : 'text-foreground hover:text-primary';
    };

    return (
        <nav className="flex items-center gap-6 px-6 py-3 border-b border-border text-sm font-medium text-muted-foreground bg-background">
            <div className="text-foreground font-bold text-lg mr-4">Charlie Kirk</div>
            <Link href="/dashboard" className={`${isActive('/dashboard')} transition-colors`}>
                Dashboard
            </Link>
            <Link href="/work-centers" className={`${isActive('/work-centers')} transition-colors`}>
                Work Centers
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
                Maintenance Calendar
            </Link>
            <Link href="/equipments" className={`${isActive('/equipments')} transition-colors`}>
                Equipment
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
                Reporting
            </Link>
            <Link href="/teams" className={`${isActive('/teams')} transition-colors`}>
                Teams
            </Link>
        </nav>
    );
}
