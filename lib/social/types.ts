export interface SocialAccount {
  id: string;
  user_id: string;
  platform: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
}

export interface SocialClient {
  postContent(token: string, caption: string, mediaUrl: string): Promise<void>;
}
