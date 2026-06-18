import { SocialClient } from '../types';

export class FacebookClient implements SocialClient {
  async postContent(token: string, caption: string, mediaUrl: string): Promise<void> {
    console.log(`Posting to Facebook with token ${token}: ${caption}, ${mediaUrl}`);
  }
}
