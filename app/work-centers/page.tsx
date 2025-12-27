import WorkCentersList from '@/components/WorkCentersList';
import { getCurrentUser } from '@/utils/auth';
import { redirect } from 'next/navigation';

export default async function WorkCentersPage() {
    const user = await getCurrentUser();
    if (!user) return redirect("/login");
    return <WorkCentersList />;
}
