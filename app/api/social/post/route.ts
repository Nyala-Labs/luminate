import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getSocialClient } from '@/lib/social/factory';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Query scheduled posts
    const now = new Date().toISOString();
    const { data: posts, error: postsError } = await supabase
      .from('social_posts')
      .select(`
        *,
        post_platform_content(*)
      `)
      .eq('status', 'scheduled')
      .lte('scheduled_at', now);

    if (postsError) {
      console.error('Error fetching scheduled posts:', postsError);
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({ message: 'No posts to process' });
    }

    // Process posts
    for (const post of posts) {
      console.log(`Processing post ${post.id}`);
      
      const contents = post.post_platform_content || [];

      for (const content of contents) {
        if (content.status !== 'pending') continue;

        try {
          // 2. Fetch token
          const { data: account, error: accountError } = await supabase
            .from('social_accounts')
            .select('access_token')
            .eq('user_id', post.owner_id)
            .eq('platform', content.platform)
            .single();

          if (accountError || !account) {
            console.error(`Error fetching account for post ${post.id}, platform ${content.platform}:`, accountError);
            continue;
          }

          // 3. Post
          const client = getSocialClient(content.platform);
          // Note: media_drive_id used as mediaUrl
          await client.postContent(account.access_token, content.caption || '', post.media_drive_id || '');

          // 4. Update status
          await supabase
            .from('post_platform_content')
            .update({ status: 'posted' })
            .eq('id', content.id);

          console.log(`Successfully posted ${post.id} to ${content.platform}`);
        } catch (err) {
          console.error(`Error posting ${post.id} to ${content.platform}:`, err);
        }
      }

      // Check if all platforms done
      await supabase
        .from('social_posts')
        .update({ status: 'posted' })
        .eq('id', post.id);
    }

    return NextResponse.json({ message: 'Processing complete' });
  } catch (error) {
    console.error('Unhandled error in social post route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
