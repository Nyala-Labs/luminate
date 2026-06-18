import { SocialClient } from '../types';

export class XiaohongshuClient implements SocialClient {
  async postContent(token: string, caption: string, mediaUrl: string): Promise<void> {
    console.log(`Posting to Xiaohongshu with token ${token}: ${caption}, ${mediaUrl}`);
  }
}
