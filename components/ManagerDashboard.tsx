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


    return (
        <div className="space-y-6 p-6">

            {/* Stats Grid */}
            {/* Dashboard Graph: Requests per Equipment Category */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                    Requests per Equipment Category
                </h3>

                {Object.keys(requests.reduce((acc, r) => {
                    const cat = r.equipment?.category || "Uncategorized";
                    acc[cat] = (acc[cat] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>)).length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
                        No data available to chart.
                    </div>
                ) : (
                    <div className="flex items-end gap-8 px-4 pb-2">
                        {Object.entries(requests.reduce((acc, r) => {
                            const cat = r.equipment?.category || "Uncategorized";
                            acc[cat] = (acc[cat] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>))
                            .sort(([, a], [, b]) => (b as number) - (a as number)) // Sort descending
                            .map(([category, count], idx) => {
                                const countNum = count as number;
                                // Find max for scaling
                                const max = Math.max(...Object.values(requests.reduce((acc, r) => {
                                    const cat = r.equipment?.category || "Uncategorized";
                                    acc[cat] = (acc[cat] || 0) + 1;
                                    return acc;
                                }, {} as Record<string, number>)) as number[]);

                                const heightPercentage = max > 0 ? (countNum / max) * 100 : 0;
                                const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-red-500", "bg-purple-500"];

                                return (
                                    <div key={category} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="h-48 w-full flex items-end justify-center relative">
                                            {/* Background Track (optional) */}
                                            <div className="absolute inset-0 bg-muted/20 rounded-t-lg" />

                                            <div
                                                style={{ height: `${heightPercentage}%` }}
                                                className={`w-full max-w-[60px] rounded-t-lg ${colors[idx % colors.length]} opacity-80 group-hover:opacity-100 transition-all duration-300 relative`}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap z-10 pointer-events-none">
                                                    {countNum} Requests
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center h-10">
                                            <span className="block text-sm font-medium text-foreground truncate max-w-[100px]" title={category}>
                                                {category}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{countNum}</span>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
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
