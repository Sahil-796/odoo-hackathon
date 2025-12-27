import { getEquipmentsByCompanyId } from "@/db/equipments";
import { getTeams } from "@/db/teams";
import { getUsersByCompany } from "@/db/users";
import { getWorkCenters } from "@/db/work_centers";
import { getCurrentUser } from "@/utils/auth";
import CreateEquipmentModal from "@/components/create-equipment-modal";
import SearchInput from "@/components/search-input";
import Link from "next/link";
import { Hammer, Users, Monitor, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EquipmentsPage({ searchParams }: { searchParams: { search?: string } }) {
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
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <main className="p-6">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Monitor className="w-6 h-6 text-primary" />
                                Equipment
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Manage equipment inventory for your company.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <SearchInput placeholder="Search equipment..." />
                            {user.role === 'manager' && (
                                <CreateEquipmentModal
                                    teams={teams.map(t => ({ id: t.id, name: t.name }))}
                                    users={usersList}
                                    workCenters={workCentersList}
                                    companyName={user.company?.name || "My Company"}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-muted-foreground">
                            <thead className="bg-muted/50 text-foreground uppercase text-xs tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4 border-b border-border">Name & Serial</th>
                                    <th className="px-6 py-4 border-b border-border">Category</th>
                                    <th className="px-6 py-4 border-b border-border">Team</th>
                                    <th className="px-6 py-4 border-b border-border">Location</th>
                                    <th className="px-6 py-4 border-b border-border">Assigned To</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {equipments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            {searchParams.search
                                                ? `No equipment found matching "${searchParams.search}"`
                                                : "No equipment found. Add some to get started."}
                                        </td>
                                    </tr>
                                ) : (
                                    equipments.map((eq) => (
                                        <tr key={eq.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <Link href={`/equipments/${eq.id}`} className="font-medium text-foreground hover:underline hover:text-primary transition-colors">
                                                    {eq.name}
                                                </Link>
                                                <div className="text-xs text-muted-foreground font-mono mt-0.5">#{eq.serialNumber}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                                                    {eq.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {eq.team ? (
                                                    <div className="flex items-center gap-1.5 text-foreground">
                                                        <Hammer className="w-3 h-3 text-muted-foreground" />
                                                        {eq.team.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {eq.location ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3 h-3 text-muted-foreground" />
                                                        {eq.location}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {eq.employee ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Users className="w-3 h-3 text-muted-foreground" />
                                                        {eq.employee.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic">Available</span>
                                                )}
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
