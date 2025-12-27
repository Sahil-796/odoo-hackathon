
import { getTeam } from "@/db/teams";
import { getUsersByCompany } from "@/db/users";
import { getCurrentUser } from "@/utils/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, FileText } from "lucide-react";
import AddMemberModal from "@/components/add-member-modal";
import RemoveMemberButton from "@/components/remove-member-button";

export default async function TeamDetailsPage({ params }: { params: Promise<{ teamId: string }> }) {
    const user = await getCurrentUser();
    if (!user || user.companyId === null) return redirect("/");

    const { teamId: teamIdStr } = await params;
    const teamId = parseInt(teamIdStr);
    if (isNaN(teamId)) return notFound();

    const team = await getTeam(teamId);
    if (!team) return notFound();

    // Access Control: User must belong to the same company
    if (team.companyId !== user.companyId) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                    You do not have permission to view this team.
                </div>
            </div>
        );
    }

    const companyUsers = await getUsersByCompany(user.companyId);
    const isManager = user.role === "manager";

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <main className="p-6 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Link href="/teams" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Teams
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
                            <p className="text-muted-foreground mt-1">Team Details & Management</p>
                        </div>
                        {isManager && (
                            <AddMemberModal users={companyUsers} teamId={team.id} />
                        )}
                    </div>
                </div>

                {/* Members Section */}
                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xl">
                    <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-muted/40">
                        <Users size={20} className="text-primary" />
                        <h2 className="font-bold text-lg">Team Members</h2>
                        <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            {team.users.length}
                        </span>
                    </div>

                    <div className="divide-y divide-border">
                        {team.users.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground italic">
                                No members in this team.
                            </div>
                        ) : (
                            team.users.map((member) => (
                                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground">{member.name}</div>
                                            <div className="text-sm text-muted-foreground">{member.email}</div>
                                        </div>
                                        <div className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground uppercase tracking-wider border border-border">
                                            {member.role}
                                        </div>
                                    </div>
                                    {isManager && (
                                        <RemoveMemberButton userId={member.id} teamId={team.id} />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Requests Section */}
                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xl">
                    <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-muted/40">
                        <FileText size={20} className="text-primary" />
                        <h2 className="font-bold text-lg">Assigned Requests</h2>
                        <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            {team.requests.length}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                                <tr>
                                    <th className="px-6 py-3">Subject</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Priority</th>
                                    <th className="px-6 py-3">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {team.requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground italic">
                                            No pending requests for this team.
                                        </td>
                                    </tr>
                                ) : (
                                    team.requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium">{req.subject}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                                    ${req.stage === 'new' ? 'bg-blue-100 text-blue-700' :
                                                        req.stage === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                                                            req.stage === 'repaired' ? 'bg-green-100 text-green-700' :
                                                                'bg-gray-100 text-gray-700'}`}>
                                                    {req.stage ? req.stage.replace('_', ' ') : 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {req.priority && req.priority > 0 ? (
                                                    <span className="text-amber-600 font-bold">High</span>
                                                ) : (
                                                    <span className="text-muted-foreground">Normal</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
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
