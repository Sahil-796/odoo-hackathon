import { getCompanies, getTeams } from "@/db/teams";
import { getCurrentUser } from "@/utils/auth";
import CreateTeamModal from "../../components/create-team-modal";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
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

    const allTeams = await getTeams(user.companyId);

    const allCompanies = await getCompanies();

    const userCompany = allCompanies.find(c => c.id === user.companyId);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <main className="p-6">
                <div className="flex flex-col gap-4 mb-8">
                    {userCompany && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-foreground">{userCompany.name}</h2>
                        </div>
                    )}
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold">Teams</h1>
                        <CreateTeamModal
                            companyId={user.companyId}
                            companyName={userCompany?.name || "Unknown Company"}
                        />
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-muted-foreground">
                            <thead className="bg-muted/50 text-foreground uppercase text-xs tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4 border-b border-border">Team Name</th>
                                    <th className="px-6 py-4 border-b border-border">Team Members</th>
                                    <th className="px-6 py-4 border-b border-border text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {allTeams.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground">
                                            No teams found. Create one to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    allTeams.map((team) => (
                                        <tr key={team.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                <Link href={`/teams/${team.id}`} className="hover:underline text-[#5ad3a1]">
                                                    {team.name}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                {team.users.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {team.users.slice(0, 3).map((user) => (
                                                            <span
                                                                key={user.id}
                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary-foreground ring-1 ring-inset ring-primary/30"
                                                            >
                                                                {user.name}
                                                            </span>
                                                        ))}
                                                        {team.users.length > 3 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground ring-1 ring-inset ring-border">
                                                                +{team.users.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic">No members</span>
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
