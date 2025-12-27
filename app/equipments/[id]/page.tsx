import { getEquipmentById } from "@/db/equipments";
import { getCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { ArrowLeft, Wrench, Calendar, User, Building, Hash, Tag, MapPin, Activity, Users as UsersIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EquipmentDetailsPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();

    // Parsing params awaits in Next15? The user previously had issues with searchParams. 
    // Usually params are also promises in new versions but let's see. 
    // Adapting to strictly awaited params if consistent with searchParams behavior just seen.
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
        return <div>Invalid ID</div>;
    }

    const equipment = await getEquipmentById(id);

    if (!equipment) {
        return (
            <div className="p-8 max-w-7xl mx-auto text-center">
                <h2 className="text-xl font-bold text-muted-foreground">Equipment not found</h2>
                <Link href="/equipments" className="text-primary hover:underline mt-4 inline-block">
                    Back to Equipment List
                </Link>
            </div>
        );
    }

    // Check optional chaining just in case, though DB query returns objects
    const maintenanceCount = equipment.maintenanceCount || 0;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 selection:bg-primary/30">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header / Breadcrumb */}
                <div className="flex items-center gap-4 mb-2">
                    <Link href="/equipments" className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-full hover:bg-muted/50">
                        <ArrowLeft size={20} />
                    </Link>
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/equipments" className="hover:text-foreground">Equipment</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{equipment.name}</span>
                    </nav>
                </div>

                {/* Main Card */}
                <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                    {/* Top Bar with Smart Button */}
                    <div className="border-b border-border bg-muted/20 p-4 flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">{equipment.name}</h1>
                                <div className="text-xs text-muted-foreground font-mono">#{equipment.serialNumber}</div>
                            </div>
                        </div>

                        {/* Smart Button */}
                        <div className="flex gap-2">
                            <Link
                                href={`/maintenance-requests?equipmentId=${equipment.id}`}
                                className="group relative flex flex-col items-center justify-center bg-background border border-border rounded-lg px-4 py-1.5 hover:bg-muted/50 hover:border-primary/50 transition-all shadow-sm active:scale-95"
                            >
                                <div className="flex items-center gap-2 text-primary font-bold text-lg">
                                    <Wrench size={18} />
                                    <span>{maintenanceCount}</span>
                                </div>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold group-hover:text-primary/80">Maintenance</span>
                            </Link>
                        </div>
                    </div>

                    {/* Details Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                            {/* Left Column */}
                            <div className="space-y-6">
                                <SectionHeader title="Identification" />

                                <DetailRow
                                    icon={<Hash size={16} />}
                                    label="Serial Number"
                                    value={equipment.serialNumber}
                                    isMono
                                />
                                <DetailRow
                                    icon={<Tag size={16} />}
                                    label="Category"
                                    value={equipment.category}
                                />
                                <DetailRow
                                    icon={<Building size={16} />}
                                    label="Company"
                                    value={user?.company?.name || "My Company"}
                                />
                                <DetailRow
                                    icon={<MapPin size={16} />}
                                    label="Used in Location"
                                    value={equipment.location || "-"}
                                />
                                <DetailRow
                                    icon={<Building size={16} />}
                                    label="Work Center"
                                    value={equipment.workCenter || "-"}
                                />
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <SectionHeader title="Assignment & Status" />

                                <DetailRow
                                    icon={<User size={16} />}
                                    label="Technician"
                                    value={equipment.defaultTechnicianId ? "Assigned" : "Unassigned"} // Ideally fetch name, but schema has ID. user relation not fully loaded unless we update query. Let's update query later if strictly needed, or just show ID for now relative to ease.
                                    valueClassName={!equipment.defaultTechnicianId ? "text-muted-foreground italic" : ""}
                                />
                                <DetailRow
                                    icon={<User size={16} />}
                                    label="Employee"
                                    value={equipment.employee?.name || "-"}
                                />
                                <DetailRow
                                    icon={<UsersIcon size={16} className="text-muted-foreground" />}
                                    label="Maintenance Team"
                                    value={equipment.team?.name || "-"}
                                />
                                <DetailRow
                                    icon={<Calendar size={16} />}
                                    label="Assigned Date"
                                    value={equipment.assignedDate ? new Date(equipment.assignedDate).toLocaleDateString() : "-"}
                                />
                                <DetailRow
                                    icon={<Calendar size={16} />}
                                    label="Scrap Date"
                                    value={equipment.scrapDate ? new Date(equipment.scrapDate).toLocaleDateString() : "-"}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-10 pt-8 border-t border-border">
                            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                Description
                            </h3>
                            <div className="bg-muted/30 rounded-lg p-4 text-sm text-foreground/80 min-h-[100px] whitespace-pre-wrap">
                                {equipment.description || <span className="text-muted-foreground italic">No description provided.</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components for cleaner UI
function SectionHeader({ title }: { title: string }) {
    return (
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/80 border-b border-primary/20 pb-2 mb-4">
            {title}
        </h3>
    );
}

function DetailRow({ icon, label, value, isMono = false, valueClassName = "" }: { icon: React.ReactNode, label: string, value: string | number, isMono?: boolean, valueClassName?: string }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2.5 text-muted-foreground">
                <span className="text-muted-foreground/70">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className={`text-sm font-medium text-foreground ${isMono ? "font-mono" : ""} ${valueClassName}`}>
                {value}
            </div>
        </div>
    );
}
