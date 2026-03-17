import { createServerClient } from "@supabase/ssr";
import { supabase } from "./supabase/client";
import { cookies } from "next/headers";

export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Profile fetch error:", error);
        return null;
    }

    return data;
}

export async function upsertUserProfile(userId: string, role: string = "user") {
    const { error } = await supabase
        .from("profiles")
        .upsert({
            id: userId,
            email: "",
            full_name: "",
            role,
        });

    if (error) console.error("Profile upsert error:", error);
}

export async function isAdmin() {
    try {
        const cookieStore = await cookies();

        const supabaseServer = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                },
            }
        );

        const {
            data: { user },
        } = await supabaseServer.auth.getUser();

        if (!user) return false;

        const profile = await getUserProfile(user.id);

        return profile?.role === "admin";
    } catch {
        return false;
    }
}