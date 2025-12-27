import { getEquipmentsByCompanyId } from "@/db/equipments";
import { getTeams } from "@/db/teams";
import { getUsersByCompany } from "@/db/users";
import { getWorkCenters } from "@/db/work_centers";
import { getCurrentUser } from "@/utils/auth";
import CreateEquipmentModal from "@/components/create-equipment-modal";
import SearchInput from "@/components/search-input";
import Link from "next/link";
import { Hammer, Users, Monitor, MapPin, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EquipmentsPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    User not found. Please seed the database.
                </div>
            </div>
        );
    }

    if (!user.companyId) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
                    User is not associated with any company.
                </div>
            </div>
        );
    }

    const resolvedSearchParams = await searchParams;
    const search = resolvedSearchParams.search;

    const [equipments, teams, companyUsers, workCenters] = await Promise.all([
        getEquipmentsByCompanyId(user.companyId, search),
        getTeams(user.companyId),
        getUsersByCompany(user.companyId),
        getWorkCenters()
    ]);

    const usersList = companyUsers.map(u => ({ id: u.id, name: u.name }));
    const workCentersList = workCenters.map(wc => ({ id: wc.id, name: wc.name }));

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 p-6 md:p-8">
            <main className="max-w-[1600px] mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Monitor className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Asset Management</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Equipment Inventory</h1>
                        <p className="text-muted-foreground mt-1 text-sm font-medium">Track and manage equipment status, assignments, and locations.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <SearchInput placeholder="Search equipment..." />
                        {user.role === 'manager' && (
                            <div className="w-full sm:w-auto">
                                <CreateEquipmentModal
                                    teams={teams.map(t => ({ id: t.id, name: t.name }))}
                                    users={usersList}
                                    workCenters={workCentersList}
                                    companyName={user.company?.name || "My Company"}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-bold border-b border-border/60">
                                <tr>
                                    <th className="px-6 py-4 min-w-[200px]">Name & Serial</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Team</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Assigned To</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {equipments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-3 rounded-full bg-muted/50">
                                                    <Search className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <p>
                                                    {search
                                                        ? `No equipment found matching "${search}"`
                                                        : "No equipment found. Add some to get started."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    equipments.map((eq) => (
                                        <tr key={eq.id} className="hover:bg-muted/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm ring-1 ring-primary/20">
                                                        <Monitor size={18} />
                                                    </div>
                                                    <div>
                                                        <Link href={`/equipments/${eq.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                                                            {eq.name}
                                                        </Link>
                                                        <div className="text-xs text-muted-foreground font-mono mt-0.5">#{eq.serialNumber}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-200/50">
                                                    {eq.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {eq.team ? (
                                                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                        <Hammer className="w-3.5 h-3.5 text-muted-foreground opacity-70" />
                                                        {eq.team.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic opacity-70">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {eq.location ? (
                                                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground opacity-70" />
                                                        {eq.location}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground opacity-50">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {eq.employee ? (
                                                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                        <Users className="w-3.5 h-3.5 text-muted-foreground opacity-70" />
                                                        {eq.employee.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic opacity-70">Available</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/equipments/${eq.id}`}
                                                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors whitespace-nowrap"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
