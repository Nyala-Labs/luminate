import { SocialClient } from '../types';

export class TikTokClient implements SocialClient {
  async postContent(token: string, caption: string, mediaUrl: string): Promise<void> {
    console.log(`Posting to TikTok with token ${token}: ${caption}, ${mediaUrl}`);
  }
}
