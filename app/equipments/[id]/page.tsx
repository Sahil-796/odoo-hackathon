import { getEquipmentById } from "@/db/equipments";
import { getCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { ArrowLeft, Wrench, Calendar, User, Building, Hash, Tag, MapPin, Activity, Users as UsersIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EquipmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
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

    const maintenanceCount = equipment.maintenanceCount || 0;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header / Breadcrumb */}
                <div className="flex flex-col gap-4">
                    <Link href="/equipments" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group w-fit">
                        <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Equipment
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-xl shadow-lg overflow-hidden">
                    {/* Top Bar with Smart Button */}
                    <div className="border-b border-border/60 bg-muted/30 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/10">
                                <Activity size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">{equipment.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-mono text-muted-foreground bg-background/50 border border-border/50 px-1.5 py-0.5 rounded">#{equipment.serialNumber}</span>
                                    <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-medium">
                                        {equipment.category}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Smart Button */}
                        <Link
                            href={`/maintenance-requests?equipmentId=${equipment.id}`}
                            className="group relative flex items-center gap-3 bg-background border border-border/60 rounded-xl pl-4 pr-5 py-2.5 hover:bg-muted/50 hover:border-primary/50 transition-all shadow-sm active:scale-[0.98]"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <span className={`text-xl font-bold ${maintenanceCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                    {maintenanceCount}
                                </span>
                            </div>
                            <div className="h-8 w-px bg-border/60" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground group-hover:text-primary transition-colors">Active Requests</span>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Wrench size={12} />
                                    <span>Manage Maintenance</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Details Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">

                            {/* Left Column */}
                            <div className="space-y-6">
                                <SectionHeader title="Identification Data" />

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
                                    label="Physical Location"
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
                                    label="Default Technician"
                                    value={equipment.defaultTechnicianId ? "Technician Assigned" : "Unassigned"}
                                    valueClassName={!equipment.defaultTechnicianId ? "text-muted-foreground italic" : "text-emerald-600 font-medium"}
                                />
                                <DetailRow
                                    icon={<User size={16} />}
                                    label="Assigned Employee"
                                    value={equipment.employee?.name || "Available"}
                                    valueClassName={!equipment.employee ? "text-emerald-600 font-medium italic" : ""}
                                />
                                <DetailRow
                                    icon={<UsersIcon size={16} />}
                                    label="Maintenance Team"
                                    value={equipment.team?.name || "-"}
                                />
                                <DetailRow
                                    icon={<Calendar size={16} />}
                                    label="Assignment Date"
                                    value={equipment.assignedDate ? new Date(equipment.assignedDate).toLocaleDateString() : "-"}
                                />
                                <DetailRow
                                    icon={<Calendar size={16} />}
                                    label="Target Scrap Date"
                                    value={equipment.scrapDate ? new Date(equipment.scrapDate).toLocaleDateString() : "-"}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-12 pt-8 border-t border-border/60">
                            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                                <Activity size={16} className="text-primary" />
                                Description & Notes
                            </h3>
                            <div className="bg-muted/20 border border-border/40 rounded-lg p-5 text-sm leading-relaxed text-foreground/90 min-h-[100px] whitespace-pre-wrap">
                                {equipment.description || <span className="text-muted-foreground italic opacity-70">No description provided for this equipment.</span>}
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
        <div className="flex items-center gap-3 pb-2 mb-2 border-b border-border/40">
            <div className="h-1 w-6 bg-primary rounded-full"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {title}
            </h3>
        </div>
    );
}

function DetailRow({ icon, label, value, isMono = false, valueClassName = "" }: { icon: React.ReactNode, label: string, value: string | number, isMono?: boolean, valueClassName?: string }) {
    return (
        <div className="flex items-center justify-between group py-1.5">
            <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-1.5 rounded-md bg-muted/40 text-muted-foreground/80 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                    {icon}
                </div>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className={`text-sm text-foreground ${isMono ? "font-mono text-xs" : "font-medium"} ${valueClassName}`}>
                {value}
            </div>
        </div>
    );
}
