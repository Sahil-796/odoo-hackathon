import { db } from "@/db/index";
import SignupForm from "@/components/auth/signup-form";

export default async function SignupPage() {
    // Fetch all companies to populate the dropdown
    const companiesList = await db.query.companies.findMany({
        columns: {
            id: true,
            name: true,
        },
        orderBy: (companies, { asc }) => [asc(companies.name)],
    });

    return <SignupForm companies={companiesList} />;
}
