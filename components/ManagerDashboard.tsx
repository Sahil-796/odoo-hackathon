"use client";

import { useMemo } from "react";
import {
    BarChart3,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    User,
    Wrench,
    AlertCircle
} from "lucide-react";

export default function ManagerDashboard({ requests }: { requests: any[] }) {

    // Calculate specific KPIs based on real data
    const stats = useMemo(() => {
        const total = requests.length;
        const pending = requests.filter(r => r.stage !== 'repaired' && r.stage !== 'scrap').length;
        // Assuming 'priority' > 0 is critical/high or map from string if enum changed (schema has integer priority)
        // Let's assume priority > 1 is critical
        const critical = requests.filter(r => r.priority > 1).length;

        // Calculate average completion time? (Mock for now as backend calculation is complex)
        const avgTime = "4.2h";

        return [
            {
                title: "Total Requests",
                value: total.toString(),
                change: "+12%", // Mock
                trend: "up",
                icon: BarChart3,
                color: "text-blue-600",
                bg: "bg-blue-50",
            },
            {
                title: "Pending Tasks",
                value: pending.toString(),
                change: "-5%", // Mock
                trend: "down",
                icon: Clock,
                color: "text-amber-600",
                bg: "bg-amber-50",
            },
            {
                title: "Critical Issues",
                value: critical.toString(),
                change: "+2%", // Mock
                trend: "up",
                icon: AlertTriangle,
                color: "text-red-600",
                bg: "bg-red-50",
            },
            {
                title: "Avg. Resolution",
                value: avgTime,
                change: "-18%", // Mock
                trend: "down",
                icon: CheckCircle2,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
            },
        ];
    }, [requests]);

    return (
        <div className="space-y-6 p-6">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span
                                className={`text-sm font-medium px-2.5 py-1 rounded-full ${stat.trend === "up"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </h3>
                            <p className="text-2xl font-bold text-foreground mt-1">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Requests List */}
                <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm flex flex-col">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">
                            Recent Requests
                        </h2>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                                <Search className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-muted-foreground font-medium border-b border-border">
                                <tr>
                                    <th className="pb-3 pl-2">Request</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Priority</th>
                                    <th className="pb-3">Technician</th>
                                    <th className="pb-3 text-right pr-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {requests.slice(0, 5).map((request) => (
                                    <tr key={request.id} className="group hover:bg-muted/30 transition-colors">
                                        <td className="py-4 pl-2">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">
                                                    {request.subject}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {request.equipment?.name || "No Equipment"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize
                        ${request.stage === 'new' ? 'bg-blue-100 text-blue-800' :
                                                    request.stage === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                                                        request.stage === 'repaired' ? 'bg-emerald-100 text-emerald-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {request.stage.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-1.5">
                                                {request.priority > 1 ? (
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                )}
                                                <span className={`${request.priority > 1 ? 'text-red-700 font-medium' : 'text-muted-foreground'}`}>
                                                    {request.priority > 1 ? 'High' : 'Normal'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                                    {request.technician?.name?.[0] || "?"}
                                                </div>
                                                <span className="text-muted-foreground">
                                                    {request.technician?.name || "Unassigned"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right pr-2">
                                            <button className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                            No requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Scheduled Maintenance (Right Column) - Mocked for visual balance or can use real data if scheduledDate exists */}
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Scheduled for Today
                    </h2>
                    <div className="space-y-4">
                        {/* Mock Items for layout fidelity */}
                        {[1, 2, 3].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                            >
                                <div className="mt-1">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground text-sm">
                                        Preventive Check #{100 + i}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        CNC Machine 0{i + 1} • 2:00 PM
                                    </p>
                                </div>
                            </div>
                        ))}
                        <button className="w-full mt-2 py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors border border-dashed border-primary/30">
                            View Calendar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
