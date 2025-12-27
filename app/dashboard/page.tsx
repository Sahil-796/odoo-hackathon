import DashboardClient from '@/components/DashboardClient';
import { getCurrentUser } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // 1. Fetch User Server-Side (Secure & Fast)
    // Casting user for now as auth returns basic structure, ensuring role matches enum
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="p-8">
                <div className="bg-destructive/10 text-destructive p-4 rounded text-center">
                    User authentication failed. Please check database seeding.
                </div>
            </div>
        );
    }

    // 2. Pass User to Client Component
    // Ensure role is typed correctly or cast if DB string matches enum
    return <DashboardClient user={user as any} />;
}
