"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

interface UserProfile {
    role: string;
}

interface AuthContextType {
    user: any | null;
    profile: UserProfile | null;
    profileError: string | null;
    isAdmin: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<any | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);

    const [authLoading, setAuthLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {

        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setAuthLoading(false);
        };

        getSession();

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
                setAuthLoading(false);
            });

        return () => subscription.unsubscribe();

    }, []);

    useEffect(() => {

        const loadProfile = async () => {

            if (!user) {
                setProfile(null);
                setProfileLoading(false);
                return;
            }

            setProfileLoading(true);
            setProfileError(null);

            const { data, error } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (error || !data) {
                console.error("Profile load error:", error);
                setProfileError("Không thể tải thông tin hồ sơ");
                setProfile(null);
            } else {
                setProfile(data);
            }
            setProfileLoading(false);
        };

        loadProfile();

    }, [user]);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    const loading = authLoading || profileLoading;

    const value: AuthContextType = {
        user,
        profile,
        profileError,
        isAdmin: profile?.role === "admin",
        loading,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};