"use server";

import { db } from "@/db/index";
import { users, companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user || user.password !== password) {
            return { error: "Invalid email or password" };
        }

        await createSession(user.id);
    } catch (error) {
        console.error("Login error:", error);
        return { error: "Something went wrong" };
    }

    redirect("/dashboard");
}

export async function signup(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as "technician" | "manager";
    const companyName = formData.get("company") as string; // Name for new company
    const companyIdStr = formData.get("companyId") as string; // ID for existing company
    const password = formData.get("password") as string;
    const rePassword = formData.get("rePassword") as string;

    if (!name || !email || !role || !password || !rePassword) {
        return { error: "All fields are required" };
    }

    if (!companyIdStr && !companyName) {
        return { error: "Please select or create a company" };
    }

    if (password !== rePassword) {
        return { error: "Passwords do not match" };
    }

    try {
        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return { error: "User with this email already exists" };
        }

        // Check or Create Company
        let companyId: number;

        if (companyIdStr && companyIdStr !== "new") {
            const parsedId = parseInt(companyIdStr);
            const existingCompanyById = await db.query.companies.findFirst({
                where: eq(companies.id, parsedId)
            });

            if (!existingCompanyById) {
                return { error: "Invalid Company Selected" };
            }
            companyId = parsedId;
        } else {
            // Logic for creating/finding by name (if user selected "Create new" and typed a name)
            const existingCompany = await db.query.companies.findFirst({
                where: eq(companies.name, companyName),
            });

            if (existingCompany) {
                // If they typed a name that exists, join it? Or error? 
                // Let's assume joining is fine if name matches exact
                companyId = existingCompany.id;
            } else {
                const [newCompany] = await db
                    .insert(companies)
                    .values({ name: companyName })
                    .returning({ id: companies.id });
                companyId = newCompany.id;
            }
        }

        // Create User
        const [newUser] = await db
            .insert(users)
            .values({
                name,
                email,
                password, // Plain text as requested
                role,
                companyId,
            })
            .returning({ id: users.id });

        await createSession(newUser.id);
    } catch (error) {
        console.error("Signup error:", error);
        return { error: "Something went wrong during sign up" };
    }

    redirect("/dashboard");
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}
