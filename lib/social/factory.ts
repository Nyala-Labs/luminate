import { SocialClient } from './types';
import { InstagramClient } from './clients/instagram';
import { LinkedInClient } from './clients/linkedin';
import { FacebookClient } from './clients/facebook';
import { TikTokClient } from './clients/tiktok';
import { XiaohongshuClient } from './clients/xiaohongshu';

export function getSocialClient(platform: string): SocialClient {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return new InstagramClient();
    case 'linkedin':
      return new LinkedInClient();
    case 'facebook':
      return new FacebookClient();
    case 'tiktok':
      return new TikTokClient();
    case 'xiaohongshu':
      return new XiaohongshuClient();
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
