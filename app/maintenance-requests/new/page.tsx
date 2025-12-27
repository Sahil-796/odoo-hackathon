import { getEquipmentsByCompanyId } from "@/db/equipments";
import { getTeams } from "@/db/teams";
import { getUsersByCompany } from "@/db/users";
import { getWorkCenters } from "@/db/work_centers";
import { getCurrentUser } from "@/utils/auth";
import MaintenanceRequestForm from "@/components/maintenance-request-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewMaintenanceRequestPage({ searchParams }: { searchParams: { equipmentId?: string; type?: string; scheduledDate?: string } }) {
    const user = await getCurrentUser();
    if (!user || !user.companyId) return <div>Unauthorized</div>;

    const resolvedSearchParams = await searchParams;
    const preselectedEquipmentId = resolvedSearchParams.equipmentId;
    const preselectedType = resolvedSearchParams.type;
    const preselectedDate = resolvedSearchParams.scheduledDate;

    const [equipments, teams, companyUsers, workCenters] = await Promise.all([
        getEquipmentsByCompanyId(user.companyId),
        getTeams(user.companyId),
        getUsersByCompany(user.companyId),
        getWorkCenters(),
    ]);

    // Construct initial data if params are passed
    const initialData = {
        equipmentId: preselectedEquipmentId || "",
        maintenanceScope: "equipment",
        type: preselectedType || "corrective",
        scheduledDate: preselectedDate || "",
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 selection:bg-primary/30">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-2">
                    <Link href="/maintenance-requests" className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-full hover:bg-muted/50">
                        <ArrowLeft size={20} />
                    </Link>
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/maintenance-requests" className="hover:text-foreground">Maintenance Requests</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">New</span>
                    </nav>
                </div>

                <MaintenanceRequestForm
                    equipments={equipments}
                    teams={teams}
                    users={companyUsers}
                    workCenters={workCenters}
                    currentUser={user}
                    initialData={initialData}
                />
            </div>
        </div>
    );
}
