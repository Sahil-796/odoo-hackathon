'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/db/schema';
import { logout } from '@/app/(auth)/actions';
import { LogOut, LayoutDashboard, Wrench, Users, Factory, Calendar, BarChart3, Monitor, ChevronDown, ShieldCheck } from 'lucide-react';

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();

    const linkBaseClass = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClass = "bg-primary/10 text-primary";
    const inactiveClass = "text-muted-foreground hover:text-foreground hover:bg-muted/40";

    return (
        <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">

                    {/* Left: Brand */}
                    <div className="flex-shrink-0 flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
                            <span className="font-bold text-xl tracking-tight text-foreground">
                                GearGuard
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        {user && (
                            <div className="hidden md:flex items-center gap-1 ml-4">
                                <Link href="/dashboard" className={`${linkBaseClass} ${pathname === '/dashboard' ? activeClass : inactiveClass}`} title="Dashboard">
                                    <LayoutDashboard size={15} />
                                    <span>Dashboard</span>
                                </Link>
                                <Link href="/maintenance-requests" className={`${linkBaseClass} ${pathname === '/maintenance-requests' ? activeClass : inactiveClass}`} title="Requests">
                                    <Wrench size={15} />
                                    <span>Requests</span>
                                </Link>

                                <div className="h-4 w-px bg-border/40 mx-1" />

                                <Link href="/calendar" className={`${linkBaseClass} ${pathname === '/calendar' ? activeClass : inactiveClass}`} title="Calendar">
                                    <Calendar size={15} />
                                    <span className="hidden lg:inline">Calendar</span>
                                </Link>

                                {/* Resources Dropdown */}
                                <div className="relative group">
                                    <button className={`${linkBaseClass} ${['/work-centers', '/equipments'].includes(pathname) ? activeClass : inactiveClass} cursor-default outline-none`}>
                                        <Factory size={15} />
                                        <span>Resources</span>
                                        <ChevronDown size={12} className="opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                                    </button>

                                    <div className="absolute top-full left-0 pt-1.5 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                                        <div className="bg-popover border border-border/60 rounded-lg shadow-lg shadow-black/5 p-1.5 flex flex-col gap-0.5">
                                            <Link href="/equipments" className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${pathname === '/equipments' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                                                <Monitor size={14} />
                                                <span>Equipment</span>
                                            </Link>
                                            <Link href="/work-centers" className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${pathname === '/work-centers' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                                                <Factory size={14} />
                                                <span>Work Centers</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/teams" className={`${linkBaseClass} ${pathname === '/teams' ? activeClass : inactiveClass}`} title="Teams">
                                    <Users size={15} />
                                    <span>Teams</span>
                                </Link>

                                <div className="h-4 w-px bg-border/40 mx-1" />

                                <Link href="/reports" className={`${linkBaseClass} ${pathname === '/reports' ? activeClass : inactiveClass}`} title="Reports">
                                    <BarChart3 size={15} />
                                    <span>Reports</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right: User Profile & Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2.5 pl-1 pr-1 py-1 rounded-full border border-transparent hover:border-border/40 hover:bg-muted/30 transition-all duration-200">
                                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary/20 to-primary/10 flex items-center justify-center text-primary text-xs font-bold ring-2 ring-background">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col pr-2 text-right hidden lg:flex">
                                        <span className="text-xs font-semibold text-foreground leading-none">{user.name}</span>
                                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium mt-0.5">{user.role}</span>
                                    </div>
                                </div>
                                <form action={logout}>
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center p-2 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                        title="Sign out"
                                    >
                                        <LogOut size={16} />
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                                    Log in
                                </Link>
                                <Link href="/signup" className="text-sm font-semibold bg-foreground text-background px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
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
