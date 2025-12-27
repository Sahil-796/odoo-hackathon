import React from 'react';
import { Search, Plus, User, AlertCircle, CheckCircle2, MoreHorizontal, ChevronDown } from 'lucide-react';
import { mockMaintenanceRequests, mockUsers, mockCompanies } from '@/db/dummy_data';


export default function MaintenanceDashboard() {
    // Map mock data to the format expected by the dashboard
    const requests = mockMaintenanceRequests.map(req => {
        const employee = mockUsers.find(u => u.id === req.createdBy)?.name || 'Unknown';
        const technician = mockUsers.find(u => u.id === req.technicianId)?.name || 'Unassigned';
        const company = mockCompanies.find(c => c.id === req.companyId)?.name || 'Unknown';

        return {
            ...req,
            employee,
            technician,
            company,
            // Normalize stage for display if needed, but we can use the raw enum value for logic
            stageDisplay: req.stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        };
    });

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">



            <main className="p-6">

                {/* --- Action Bar --- */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-semibold text-sm transition-colors shadow-lg shadow-primary/5 flex items-center gap-2">
                            <Plus size={16} /> New
                        </button>
                    </div>

                    <div className="flex items-center gap-3 bg-muted/50 px-3 py-2 rounded-md border border-input w-full max-w-md focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Search size={18} className="text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder-muted-foreground"
                        />
                        <ChevronDown size={14} className="text-muted-foreground" />
                    </div>
                </div>

                {/* --- KPI Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                    {/* Card 1: Critical Equipment (Red) */}
                    <div className="bg-card rounded-xl p-6 border-l-4 border-destructive shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertCircle size={60} className="text-destructive" />
                        </div>
                        <h3 className="text-destructive font-medium mb-1">Critical Equipment</h3>
                        <div className="flex flex-col gap-1 mt-4">
                            <span className="text-4xl font-bold text-card-foreground">5 Units</span>
                            <span className="text-sm text-destructive/80">(Health &lt; 30%)</span>
                        </div>
                    </div>

                    {/* Card 2: Technician Load (Blue) */}
                    <div className="bg-card rounded-xl p-6 border-l-4 border-blue-500 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <User size={60} className="text-blue-500" />
                        </div>
                        <h3 className="text-blue-400 font-medium mb-1">Technician Load</h3>
                        <div className="flex flex-col gap-1 mt-4">
                            <span className="text-4xl font-bold text-card-foreground">85% Utilized</span>
                            <span className="text-sm text-blue-400/80">(Assign Carefully)</span>
                        </div>
                    </div>

                    {/* Card 3: Open Requests (Green) */}
                    <div className="bg-card rounded-xl p-6 border-l-4 border-green-500 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CheckCircle2 size={60} className="text-green-500" />
                        </div>
                        <h3 className="text-green-400 font-medium mb-1">Open Requests</h3>
                        <div className="flex flex-col gap-1 mt-4">
                            <span className="text-4xl font-bold text-card-foreground">12 Pending</span>
                            <span className="text-sm text-green-400/80">3 Overdue</span>
                        </div>
                    </div>

                </div>

                {/* --- List View --- */}
                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xl">
                    <table className="w-full text-left text-sm text-muted-foreground">
                        <thead className="bg-muted/50 text-foreground uppercase text-xs tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4 border-b border-border">Subjects</th>
                                <th className="px-6 py-4 border-b border-border">Employee</th>
                                <th className="px-6 py-4 border-b border-border">Technician</th>
                                <th className="px-6 py-4 border-b border-border">Category</th>
                                <th className="px-6 py-4 border-b border-border">Stage</th>
                                <th className="px-6 py-4 border-b border-border">Company</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-muted/30 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4 text-foreground font-medium">{req.subject}</td>
                                    <td className="px-6 py-4">{req.employee}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                                                {req.technician.charAt(0)}
                                            </div>
                                            {req.technician}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md bg-muted text-foreground text-xs border border-border">
                                            {req.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${req.stage === 'new' ? 'bg-blue-500/20 text-blue-400' :
                                                req.stage === 'repaired' ? 'bg-green-500/20 text-green-400' :
                                                    req.stage === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                            }`}>
                                            {req.stageDisplay}
                                        </span>

                                    </td>
                                    <td className="px-6 py-4">{req.company}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State / Footer */}
                    <div className="px-6 py-4 bg-muted/30 border-t border-border text-xs text-muted-foreground flex justify-between">
                        <span>Showing {requests.length} records</span>
                        <div className="flex gap-2">
                            <button className="hover:text-foreground">Previous</button>
                            <button className="hover:text-foreground">Next</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
