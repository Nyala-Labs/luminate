'use client';

import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';

export function SignInWithGoogleButton() {
  async function handleSignIn() {
    const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'https://www.googleapis.com/auth/drive.file',
        },
      });
  }

  return (
    <Button onClick={handleSignIn} className="w-full">
      Sign in with Google
    </Button>
  );
}
