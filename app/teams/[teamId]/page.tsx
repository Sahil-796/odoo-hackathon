
import { getTeam } from "@/db/teams";
import { getUsersByCompany } from "@/db/users";
import { getCurrentUser } from "@/utils/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, FileText, LayoutDashboard, Shield } from "lucide-react";
import AddMemberModal from "@/components/add-member-modal";
import RemoveMemberButton from "@/components/remove-member-button";

export default async function TeamDetailsPage({ params }: { params: Promise<{ teamId: string }> }) {
    const user = await getCurrentUser();
    if (!user) return redirect("/login");
    if (user.companyId === null) return redirect("/");

    const { teamId: teamIdStr } = await params;
    const teamId = parseInt(teamIdStr);
    if (isNaN(teamId)) return notFound();

    const team = await getTeam(teamId);
    if (!team) return notFound();

    // Access Control: User must belong to the same company
    if (team.companyId !== user.companyId) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    You do not have permission to view this team.
                </div>
            </div>
        );
    }

    const companyUsers = await getUsersByCompany(user.companyId);
    const isManager = user.role === "manager";

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-8">
            <main className="max-w-[1600px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-6">
                    <Link href="/teams" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group w-fit">
                        <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Teams
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{team.name}</h1>
                            <p className="text-muted-foreground mt-1 text-sm font-medium">Manage team members and view assigned requests.</p>
                        </div>
                        {isManager && (
                            <AddMemberModal users={companyUsers} teamId={team.id} />
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Members Section */}
                    <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
                        <div className="px-6 py-4 border-b border-border/60 flex items-center gap-3 bg-muted/30">
                            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600">
                                <Users size={18} />
                            </div>
                            <h2 className="font-bold text-base tracking-wide">Team Members</h2>
                            <span className="ml-auto bg-background border border-border/60 text-muted-foreground text-xs font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                                {team.members.length}
                            </span>
                        </div>

                        <div className="divide-y divide-border/40 flex-1">
                            {team.members.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground italic flex flex-col items-center gap-2">
                                    <Users className="w-8 h-8 opacity-20" />
                                    <span>No members in this team.</span>
                                </div>
                            ) : (
                                team.members.map(({ user: member }) => (
                                    <div key={member.id} className="p-4 flex items-center justify-between hover:bg-muted/40 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-bold text-sm ring-1 ring-primary/10 shadow-sm">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-foreground">{member.name}</div>
                                                <div className="text-xs text-muted-foreground">{member.email}</div>
                                            </div>
                                            <div className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-muted/60 text-muted-foreground uppercase tracking-wider border border-border/50">
                                                {member.role}
                                            </div>
                                        </div>
                                        {isManager && (
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <RemoveMemberButton userId={member.id} teamId={team.id} />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Requests Section */}
                    <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
                        <div className="px-6 py-4 border-b border-border/60 flex items-center gap-3 bg-muted/30">
                            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600">
                                <LayoutDashboard size={18} />
                            </div>
                            <h2 className="font-bold text-base tracking-wide">Assigned Requests</h2>
                            <span className="ml-auto bg-background border border-border/60 text-muted-foreground text-xs font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                                {team.requests.length}
                            </span>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/20 text-muted-foreground font-semibold border-b border-border/60 text-[10px] uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Subject</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                        <th className="px-6 py-3 font-semibold">Priority</th>
                                        <th className="px-6 py-3 font-semibold text-right">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {team.requests.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center text-muted-foreground italic">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="w-8 h-8 opacity-20" />
                                                    <span>No pending requests for this team.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        team.requests.map((req) => (
                                            <tr key={req.id} className="hover:bg-muted/40 transition-colors">
                                                <td className="px-6 py-4 font-medium max-w-[200px] truncate" title={req.subject}>{req.subject}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider border 
                                                        ${req.stage === 'new' ? 'bg-blue-500/10 text-blue-600 border-blue-200' :
                                                            req.stage === 'in_progress' ? 'bg-amber-500/10 text-amber-600 border-amber-200' :
                                                                req.stage === 'repaired' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' :
                                                                    'bg-red-500/10 text-red-600 border-red-200'}`}>
                                                        {req.stage ? req.stage.replace('_', ' ') : 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {req.priority && req.priority > 0 ? (
                                                        <span className="text-amber-600 font-bold text-xs flex items-center gap-1">
                                                            High
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">Normal</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground text-xs text-right font-mono">
                                                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
