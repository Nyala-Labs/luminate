# PRD: Nyala Labs Cross-Platform Social Media Tool

## 1. Feature Overview
A unified social media management tool allowing users to:
- Create, schedule, and blast posts to multiple platforms: **Instagram, LinkedIn, Facebook, TikTok, and Xiaohongshu (Red).**
- Use **Google Drive** as the primary media storage backend.
- Share common media across posts while allowing platform-specific caption/metadata customization.
- Manage drafting, scheduling (via cron), and automated blasting.

## 2. Database Schema (Drizzle ORM)
### `social_accounts`
- `id`: UUID (PK)
- `userId`: UUID (FK)
- `platform`: 'instagram' | 'linkedin' | 'facebook' | 'tiktok' | 'xhs'
- `accessToken`: Text
- `refreshToken`: Text
- `expiresAt`: Timestamp

### `social_posts`
- `id`: UUID (PK)
- `ownerId`: UUID (FK)
- `mediaDriveId`: Text (Google Drive File ID)
- `status`: 'draft' | 'scheduled' | 'published' | 'failed'
- `scheduledAt`: Timestamp

### `post_platform_content`
- `id`: UUID (PK)
- `postId`: UUID (FK)
- `platform`: String
- `caption`: Text
- `status`: 'pending' | 'posted' | 'failed'

## 3. Flow of Posting
1. **Media Upload**: User uploads media -> Backend uploads to Google Drive -> Store File ID in `social_posts.mediaDriveId`.
2. **Content Composition**: User edits captions per platform in the UI -> Save to `post_platform_content`.
3. **Trigger**:
   - **Blast**: Trigger immediately for all platforms.
   - **Schedule**: Cron job polls `social_posts` where `scheduledAt` <= now.
4. **Execution**: Platform-specific client service fetches media from Drive, sends API request to the platform, updates status in `post_platform_content`.

## 4. UI/UX Inspiration
- **Scribble UI Reference**: Clean, card-based dashboard with minimalist sidebar navigation. Use high-contrast dark mode aesthetics.
- **Components**:
    - **Post Orchestrator**: A split-view layout. Left: Media preview & global settings. Right: Accordion or Tab list for platform-specific customization.
    - **Media Picker**: A Google Drive-integrated modal to select existing or upload new media.

## 5. Implementation Roadmap (Sub-feature Tasks)
1. **GCP Integration**: Setup Google Drive API, OAuth consent, and storage service wrapper.
2. **Schema & Auth**: Implement `drizzle` models and Auth flows for social platforms.
3. **Media Engine**: Develop Drive file picker and streaming service.
4. **API Wrappers**: Build custom service modules for IG, LinkedIn, FB, TikTok, XHS endpoints.
5. **Worker Logic**: Setup cron/queue system for scheduled posts.
6. **Dashboard UI**: Develop the "Social Blaster" interface (Post Orchestrator, Media Picker, Calendar).

## 6. Setup & API Configuration Instructions

### A. Environment Variables
Add the following to your `.env` file:

```bash
# Google Drive Storage
GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY='{...json_content...}'
GOOGLE_DRIVE_PARENT_FOLDER_ID='your_folder_id'

# Social Platform API Credentials
# Required for each platform:
INSTAGRAM_CLIENT_ID='26586544004342256'
INSTAGRAM_CLIENT_SECRET='5ad7cf62d3dbade417dd35cd38d0dfce'
INSTAGRAM_ACESSS_TOKEN="IGAF50UicvIfBBZAFk5cXNDQXVzOGdNbjdkRGs3eDZAKMDktdnZAfcFdaUWd0OFh6Y0lIa1kwTmVvZAVpfVDd5aWFjR0dqSVdUdjhjNVRMcThJZA3AwT1o5QnV6NTgxWVpDbVh6enY5OXh6dGRIbEFjY0N4M1BMUkdxbUVjNjhtdGVXdwZDZD"
LINKEDIN_CLIENT_ID='86d2j697f3yfnn'
LINKEDIN_CLIENT_SECRET='WPL_AP1.E1fmmexuQ57WdlLd.v71kfg=='
FACEBOOK_CLIENT_ID='...'
FACEBOOK_CLIENT_SECRET='...'
TIKTOK_CLIENT_ID='sbawg7s6asvko1zxop'
TIKTOK_CLIENT_SECRET='mpG5Zvp0QwKHVURDiVh3lE0nejLx1kzf'
XHS_CLIENT_ID='...'
XHS_CLIENT_SECRET='...'
```

### B. Setup Steps
1. **Google Cloud (Media Storage)**:
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/).
   - Enable "Google Drive API".
   - Generate a **Service Account** and download the JSON key.
   - Share the target folder in your Google Drive with the Service Account email (give "Editor" access).
   - Set the folder ID in `GOOGLE_DRIVE_PARENT_FOLDER_ID`.

2. **Social Platforms (API Access)**:
   - Go to the developer portal for each platform (e.g., [Meta Developers](https://developers.facebook.com/), [LinkedIn Developers](https://developer.linkedin.com/)).
   - Register a new application.
   - Register your redirect URL: `https://your-domain.com/api/auth/[platform]/callback`.
   - Configure required scopes for posting content (e.g., `pages_manage_posts`, `w_member_social`).
   - Store credentials in `.env`.

3. **Security Configuration (URGENT)**:
   - Enable RLS for all new tables:
     ```sql
     ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
     ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
     ALTER TABLE public.post_platform_content ENABLE ROW LEVEL SECURITY;
     ```
   - Define RLS policies (e.g., `CREATE POLICY "User can manage their own posts" ON social_posts ... USING (owner_id = auth.uid());`).

## 7. Recognition System
The recognition system allows team members to award points to colleagues based on their contributions, categorized by predefined tiers.

### 7.1 Tier Configuration
| Tier | Points | Approval Required |
| :--- | :--- | :--- |
| **SPARK** | 5 | No |
| **HELPER** | 25 | No |
| **BUILDER** | 100 | Yes |
| **CATALYST** | 225 | Yes |
| **ARCHITECT** | 400 | Yes |
| **LUMINARY** | 600 | Yes |

### 7.2 Awarding Flow
1. **Creation**: A user submits an award via the UI, specifying the receiver, the tier, and a justification.
2. **Processing**:
   - If the selected tier does **not** require approval, the award status is automatically set to `approved` and points are credited immediately.
   - If the tier **does** require approval, the status is set to `pending`, and it is added to the administrative moderation queue.
3. **Approval**: Administrators review pending awards.
4. **Finalization**: Once an award is approved, the system updates the recipient's record in the `reputationLedger` with the appropriate point value.

