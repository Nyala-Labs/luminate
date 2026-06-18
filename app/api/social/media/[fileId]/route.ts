import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.provider_token;
  
  if (!accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  const drive = google.drive({ version: 'v3', auth });

  try {
    const response = await drive.files.get(
      {
        fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    );

    return new NextResponse(response.data as unknown as ReadableStream, {
      headers: {
        'Content-Type': response.headers['content-type'] || 'image/jpeg',
      },
    });
  } catch (error) {
    console.error('Error proxying Google Drive media:', error);
    return new NextResponse("Failed to fetch media", { status: 500 });
  }
}
