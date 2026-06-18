import { SocialClient } from '../types';

export class LinkedInClient implements SocialClient {
  async postContent(token: string, caption: string, mediaUrl: string): Promise<void> {
    console.log(`Posting to LinkedIn with token ${token}: ${caption}, ${mediaUrl}`);
  }
}
