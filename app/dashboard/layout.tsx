import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <DashboardShell user={{ name: session.name, role: session.role }}>
      {children}
    </DashboardShell>
  );
}

