'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/db/schema';
import { logout } from '@/app/(auth)/actions';
import { LogOut, User as UserIcon, LayoutDashboard, Settings, Wrench, Users, Calendar, BarChart3, Factory } from 'lucide-react';

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();

    const linkBaseClass = "relative flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium hover:bg-muted/50 group overflow-hidden border border-transparent";
    const activeClass = "bg-primary/10 text-primary hover:bg-primary/20 shadow-sm border-primary/20";
    const inactiveClass = "text-muted-foreground hover:text-foreground";

    return (
        <nav className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl border-b border-white/10 shadow-sm supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between relative">
                    {/* Left: Logo & Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105 group-hover:shadow-primary/40">
                                <span className="text-xl font-bold">G</span>
                                <div className="absolute inset-0 rounded-md ring-1 ring-inset ring-black/10"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg leading-tight tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:to-primary transition-colors duration-300">
                                    GearGuard
                                </span>
                                <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                                    Maintenance
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Navigation Links */}
                    {user && (
                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1 p-1 bg-secondary/30 rounded-md border border-border/40 backdrop-blur-sm">
                            <Link href="/dashboard" className={`${linkBaseClass} ${pathname === '/dashboard' ? activeClass : inactiveClass}`}>
                                <LayoutDashboard size={16} />
                                <span>Dashboard</span>
                            </Link>
                            <Link href="/work-centers" className={`${linkBaseClass} ${pathname === '/work-centers' ? activeClass : inactiveClass}`}>
                                <Factory size={16} />
                                <span>Work Centers</span>
                            </Link>
                            <Link href="/teams" className={`${linkBaseClass} ${pathname === '/teams' ? activeClass : inactiveClass}`}>
                                <Users size={16} />
                                <span>Teams</span>
                            </Link>
                            <Link href="/equipments" className={`${linkBaseClass} ${pathname === '/equipments' ? activeClass : inactiveClass}`}>
                                <Wrench size={16} />
                                <span>Equipment</span>
                            </Link>
                        </div>
                    )}

                    {/* Right: User Profile & Actions */}
                    <div className="flex-shrink-0 flex items-center justify-end gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-secondary/50 border border-border/50">
                                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary ring-1 ring-border border border-primary/20 shadow-sm">
                                        <span className="font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="flex flex-col hidden sm:flex pr-2">
                                        <span className="text-sm font-semibold text-foreground leading-none">{user.name}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-0.5">{user.role}</span>
                                    </div>
                                </div>

                                <form action={logout}>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-3 py-2 text-destructive hover:text-white hover:bg-destructive border border-destructive/20 hover:border-destructive rounded-md transition-all duration-200 group"
                                        title="Sign out"
                                    >
                                        <LogOut size={16} className="group-hover:stroke-current" />
                                        <span className="text-xs font-bold uppercase tracking-wide">Logout</span>
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md px-3 py-2 hover:bg-muted/50">
                                    Log in
                                </Link>
                                <Link href="/signup" className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
