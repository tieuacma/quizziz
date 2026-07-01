import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

/**
 * /dashboard — redirect to the role-specific sub-page.
 * This is a Server Component so it can read the session cookie safely.
 */
export default async function DashboardIndexPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    if (session.role === "teacher") redirect("/dashboard/teacher");
    redirect("/dashboard/student");
}
