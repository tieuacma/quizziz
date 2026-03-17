"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

interface AuthButtonProps {
    provider: 'google' | 'github';
    children: React.ReactNode;
}

export function AuthButton({ provider, children }: AuthButtonProps) {
    const handleAuth = async () => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <Button
            onClick={handleAuth}
            variant="outline"
            className="w-full"
        >
            {children}
        </Button>
    );
}

