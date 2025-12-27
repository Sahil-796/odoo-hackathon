import { getCompanies, getTeams } from "@/db/teams";
import { getUserById } from "@/db/users";
import CreateTeamModal from "../../components/create-team-modal";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
    const userId = 1;
    const user = await getUserById(userId);

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

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Teams</h1>
                <CreateTeamModal companies={allCompanies} />
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50/50">
                                <th className="px-6 py-4 font-semibold text-gray-900">Team Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Team Members</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Company</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allTeams.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                        No teams found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                allTeams.map((team) => (
                                    <tr key={team.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{team.name}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {team.users.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {team.users.map((user) => (
                                                        <span
                                                            key={user.id}
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10"
                                                        >
                                                            {user.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">No members</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {team.company ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{team.company.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
