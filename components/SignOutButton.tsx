'use client';

import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  }

  return (
    <Button onClick={handleSignOut} variant="outline">
      Sign Out
    </Button>
  );
}
