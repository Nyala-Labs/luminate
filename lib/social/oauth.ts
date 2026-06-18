import { createClient } from '@/utils/supabase/server';
import { SocialAccount } from './types';

export async function getSocialAccount(userId: string, platform: string): Promise<SocialAccount | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', platform)
    .single();

  if (error || !data) return null;
  return data as SocialAccount;
}

export async function updateSocialAccountTokens(
  id: string,
  accessToken: string,
  refreshToken: string | null,
  expiresAt: string
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from('social_accounts')
    .update({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    })
    .eq('id', id);
}
