"use client";

import { useState, useEffect } from "react";
import ManagerDashboard from "./ManagerDashboard";
import TechnicianDashboard from "./TechnicianDashboard";
import { Loader2 } from "lucide-react";

type User = {
    id: number;
    name: string;
    role: "manager" | "technician";
};

export default function DashboardClient({ user }: { user: User }) {
    const [requests, setRequests] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalTechnicians: 0, activeTechnicians: 0, criticalEquipmentCount: 0, overdueRequestCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const res = await fetch("/api/dashboard");
                if (!res.ok) throw new Error("Failed to load dashboard data");
                const data = await res.json();

                if (Array.isArray(data)) {
                    setRequests(data);
                } else {
                    setRequests(data.requests);
                    setStats(data.stats);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Render appropriate dashboard based on role
    // Default to technician if unknown, or handle error
    if (user.role === "manager") {
        return <ManagerDashboard requests={requests} stats={stats} />;
    }

    return <TechnicianDashboard requests={requests} />;
}
