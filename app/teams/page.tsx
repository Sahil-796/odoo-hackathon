import { getCompanies, getTeams } from "@/db/teams";
import { getCurrentUser } from "@/utils/auth";
import CreateTeamModal from "../../components/create-team-modal";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
    const user = await getCurrentUser();

    if (!user) {
        return redirect("/login");
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

    const allTeams = await getTeams(user.companyId);

    const allCompanies = await getCompanies();

    const userCompany = allCompanies.find(c => c.id === user.companyId);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 p-6 md:p-8">
            <main className="max-w-[1600px] mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        {userCompany && (
                            <div className="flex items-center gap-2 mb-1">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{userCompany.name}</span>
                            </div>
                        )}
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Teams Management</h1>
                        <p className="text-muted-foreground mt-1 text-sm font-medium">Organize your workforce into functional teams.</p>
                    </div>
                    {user.role === "manager" && (
                        <CreateTeamModal
                            companyId={user.companyId}
                            companyName={userCompany?.name || "Unknown Company"}
                        />
                    )}
                </div>

                <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-bold border-b border-border/60">
                                <tr>
                                    <th className="px-6 py-4 min-w-[200px]">Team Name</th>
                                    <th className="px-6 py-4 w-full">Team Members</th>
                                    <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {allTeams.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-3 rounded-full bg-muted/50">
                                                    <Users className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <p>No teams found. Create one to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    allTeams.map((team) => (
                                        <tr key={team.id} className="hover:bg-muted/50 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                                                        {team.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold">{team.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {team.members.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {team.members.slice(0, 4).map(({ user }) => (
                                                            <div
                                                                key={user.id}
                                                                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-secondary/50 text-secondary-foreground border border-border/50"
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                                {user.name}
                                                            </div>
                                                        ))}
                                                        {team.members.length > 4 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
                                                                +{team.members.length - 4} more
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic opacity-70">No members assigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/teams/${team.id}`} className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors whitespace-nowrap">View Details</Link>
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
