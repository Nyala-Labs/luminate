import 'server-only';
import { Readable } from 'stream';
import { google } from 'googleapis';

const PARENT_FOLDER_ID = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID!;

function getDriveClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: 'v3', auth });
}

export async function createPostFolder(accessToken: string, postId: string) {
  const drive = getDriveClient(accessToken);
  const folderMetadata = {
    name: `Post_${postId}`,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [PARENT_FOLDER_ID],
  };
  
  const folder = await drive.files.create({
    requestBody: folderMetadata,
    fields: 'id',
  });
  return folder.data.id;
}

export async function uploadMedia(accessToken: string, folderId: string, fileBuffer: Buffer, fileName: string, mimeType: string) {
  const drive = getDriveClient(accessToken);
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };
  
  const stream = Readable.from(fileBuffer);

  const media = {
    mimeType: mimeType,
    body: stream,
  };
  
  const file = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });
  return file.data.id;
}

export async function getFileMetadata(accessToken: string, fileId: string) {
  const drive = getDriveClient(accessToken);
  const file = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType, thumbnailLink, webViewLink',
  });
  return file.data;
}
