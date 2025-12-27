import DashboardClient from '@/components/DashboardClient';
import { getCurrentUser } from '@/utils/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // 1. Fetch User Server-Side (Secure & Fast)
    // Casting user for now as auth returns basic structure, ensuring role matches enum
    const user = await getCurrentUser();

    if (!user) {
        return redirect("/login");
    }

    // 2. Pass User to Client Component
    // Ensure role is typed correctly or cast if DB string matches enum
    return <DashboardClient user={user as any} />;
}
