import { getCompanies } from "@/lib/data";
import SignupForm from "@/components/auth/SignupForm";

export default async function SignupPage() {
    const companies = await getCompanies();

    return (
        <>
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-bold">Create an account</h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Enter your information to get started
                </p>
            </div>

            <SignupForm companies={companies} />
        </>
    );
}
