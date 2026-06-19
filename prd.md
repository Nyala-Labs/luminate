# PRD: Nyala Pulse — Lightweight Organisation Awareness System

> **Implementation Note:** This document describes a proposed feature ("Nyala Pulse"). The current database schema (`db/schema.ts`) does **not** yet contain the `happenings` or related tables proposed here. This PRD serves as the design specification for when development of this module begins.

## 1. Product Summary

Nyala Pulse is an internal event-awareness dashboard for Nyala Labs. It solves the problem where fast-moving organisational activities are too informal, uncertain, or annoying to enter into Google Calendar, causing members and leaders to lose track of what is happening.

The product should not replace Google Calendar. It should sit before Google Calendar.

Google Calendar is for confirmed, scheduled commitments. Nyala Pulse is for everything else: possible events, ongoing discussions, follow-ups, collaborations, deadlines, loose plans, external partner conversations, and things leaders need to stay aware of.

## 2. Core Problem

Nyala Labs moves quickly. Many things happen through Gmail, Google Drive, casual conversations, WhatsApp, internal meetings, and spontaneous decisions. Google Calendar becomes a chore because not every happening is ready to become a formal calendar event.

Current failure mode:

* Events are only remembered by the person involved.
* Some initiatives are discussed but not tracked.
* Google Calendar contains confirmed events, but not “what is brewing”.
* Leaders feel lost because there is no single operational feed.
* Updates are scattered across Gmail, Drive documents, meetings, and memory.
* Adding every uncertain item to Calendar creates clutter.
* Not adding them creates blindness.

## 3. Product Direction

Build a system around **Happenings**, not Calendar Events.

A Happening is any meaningful organisational activity that may require awareness, decision-making, follow-up, or eventual scheduling.

Examples:

* “Possible collaboration with Sunway Sunfest”
* “AI workshop claim follow-up with YB Michelle’s office”
* “Need to confirm venue for next youth event”
* “Finance claim pending treasurer review”
* “Someone created a proposal in Drive”
* “Event date being discussed but not confirmed”
* “External partner emailed about collaboration”
* “Upcoming internal meeting not yet formalised”

## 4. Feature Name

Primary name: **Nyala Pulse**

Alternative names:

* Org Radar
* Mission Control
* Event Radar
* Operations Pulse
* Nyala Now

Recommended: **Nyala Pulse** because it communicates “what is alive right now” without sounding too corporate.

## 5. Product Goals

### 5.1 Primary Goals

1. Give leaders a clear view of what is happening across Nyala Labs.
2. Reduce dependence on Google Calendar for early-stage or informal events.
3. Make it easy to capture updates in under 30 seconds.
4. Distinguish between vague ideas, confirmed events, and completed activities.
5. Surface what needs attention today, this week, and soon.
6. Provide a lightweight audit trail of decisions and updates.
7. Eventually integrate Gmail, Google Drive, and Google Calendar as sources of context.

### 5.2 Non-Goals

1. Do not rebuild Google Calendar.
2. Do not become a full project management tool like Notion, Linear, or Trello.
3. Do not require every member to maintain detailed tasks.
4. Do not force exact dates for uncertain activities.
5. Do not require AI automation in MVP.
6. Do not depend on WhatsApp integration for MVP.

## 6. Target Users

### 6.1 Executive / President / Vice President

Needs to know what is happening, what is stuck, what is confirmed, and what needs intervention.

Main needs:

* Fast overview
* Leadership-level summary
* “What should I care about?”
* Follow-up visibility
* Upcoming event awareness

### 6.2 Treasurer

Needs visibility on finance-related happenings, claims, reimbursements, and spending approvals.

Main needs:

* See claims linked to events
* Know what expenses are attached to which happening
* Track pending finance actions

### 6.3 Project Lead / Event Lead

Needs a lightweight place to update progress without maintaining a heavy project board.

Main needs:

* Add quick updates
* Attach Drive links
* Mark status
* Add date ranges
* Request attention from executives

### 6.4 Regular Member

Needs to know what is happening without being overwhelmed.

Main needs:

* See confirmed public-facing events
* See volunteer opportunities
* See basic event updates
* Avoid sensitive leadership discussions

## 7. Core Concept: Happening Lifecycle

Each Happening has a lifecycle.

### 7.1 Statuses

| Status             | Meaning                                                   |
| ------------------ | --------------------------------------------------------- |
| `idea`             | Someone mentioned it, not yet acted on                    |
| `exploring`        | Being discussed or checked                                |
| `pending_decision` | Needs approval, confirmation, or leadership call          |
| `confirmed`        | Happening is real and should likely be on Google Calendar |
| `active`           | Currently ongoing                                         |
| `done`             | Completed                                                 |
| `cancelled`        | No longer happening                                       |
| `archived`         | No longer relevant to active view                         |

### 7.2 Certainty Levels

| Certainty   | Meaning               |
| ----------- | --------------------- |
| `low`       | Rumour / rough idea   |
| `medium`    | Likely but not locked |
| `high`      | Very likely           |
| `confirmed` | Officially confirmed  |

### 7.3 Time Types

Not every happening has an exact time. The system should support flexible time.

| Time Type      | Example               |
| -------------- | --------------------- |
| `exact`        | 8 July 2026, 10:00 AM |
| `date_only`    | 8 July 2026           |
| `date_range`   | 8–10 July 2026        |
| `month_only`   | July 2026             |
| `quarter_only` | Q3 2026               |
| `unknown`      | No date yet           |

This is critical because forcing exact dates too early is one reason Google Calendar feels annoying.

## 8. MVP Feature Set

## 8.1 Pulse Dashboard

Route: `/dashboard/pulse`

The dashboard shows the current state of the organisation.

### Sections

1. **Now**

   * Active happenings
   * Things happening today
   * Urgent follow-ups

2. **This Week**

   * Confirmed events this week
   * Deadlines
   * Pending decisions

3. **Brewing**

   * Ideas and exploring-stage happenings
   * Things that may become events

4. **Needs Attention**

   * Items with no owner
   * Items stuck in pending decision
   * Items with stale updates
   * Items with upcoming dates but low certainty

5. **Recently Updated**

   * Feed of latest updates, comments, attachments, and status changes

### Dashboard Card Fields

Each Happening card should show:

* Title
* Status
* Certainty
* Time label
* Owner
* Category
* Last update
* Attention flag
* Source icons: manual, Gmail, Drive, Calendar
* Quick actions:

  * Update
  * Mark confirmed
  * Assign owner
  * Add follow-up
  * Convert to Calendar

## 8.2 Quick Capture

Route: `/dashboard/pulse/new`

The key design principle: capture in under 30 seconds.

### Fields

Required:

* Title
* Category
* Status

Optional:

* Description
* Time type
* Date / date range
* Owner
* Visibility
* Source link
* Tags
* Needs attention toggle
* Follow-up date

### Quick Capture UX

The first input should feel like typing a note:

> “Sunway may want us for NGO fair in July. Need to confirm donation booth details.”

The app can then ask for structured fields after initial entry.

MVP can use simple manual fields. AI parsing can come later.

## 8.3 Happening Detail Page

Route: `/dashboard/pulse/[happeningId]`

### Page Sections

1. Header

   * Title
   * Status
   * Certainty
   * Owner
   * Visibility
   * Category

2. Timeline

   * Updates
   * Status changes
   * Comments
   * Linked files
   * Linked emails
   * Calendar sync events

3. Details

   * Description
   * Dates
   * Location
   * External partners
   * Related people
   * Tags

4. Actions

   * Add update
   * Change status
   * Assign owner
   * Add Drive link
   * Add follow-up
   * Convert to Google Calendar
   * Archive

5. Related Items

   * Claims
   * Tasks
   * Documents
   * Calendar events

## 8.4 Update Feed

Route: `/dashboard/pulse/feed`

This is the organisation’s operational activity feed.

Feed item examples:

* “Joshua changed Sunfest collaboration from exploring to pending decision.”
* “Aster added Drive proposal link.”
* “Treasurer marked claim follow-up as pending.”
* “Google Calendar event linked.”
* “No update for 10 days; item marked stale.”

Feed filters:

* All
* My items
* Needs attention
* Events
* Finance
* Partnerships
* This week
* Recently confirmed

## 8.5 Attention System

The product should automatically flag happenings that need attention.

### Attention Rules

Flag a Happening if:

* Status is `pending_decision`
* No owner is assigned
* Follow-up date is today or overdue
* Happening has not been updated for more than 7 days
* Event date is within 14 days but certainty is not confirmed
* Status is `confirmed` but no Google Calendar event is linked
* It has finance claims pending approval
* It has external partner involvement but no next action

### Attention Levels

| Level       | Meaning                           |
| ----------- | --------------------------------- |
| `normal`    | No issue                          |
| `watch`     | May need review                   |
| `attention` | Needs action                      |
| `urgent`    | Needs immediate leadership action |

## 8.6 Digest

Route: `/dashboard/pulse/digest`

Generate a simple digest that leaders can copy into WhatsApp or send by email.

### Digest Types

1. Daily Pulse
2. Weekly Pulse
3. Leadership Digest
4. Public Member Digest
5. Finance Digest
6. Partner Follow-up Digest

### Example Output

```text
Nyala Pulse — Weekly Summary

Now:
- Sunfest collaboration: pending confirmation from Sunway.
- AI workshop claim: waiting for document submission.
- Internal recognition system: admin approval flow being built.

Needs Attention:
- Sunfest donation booth details need confirmation.
- Treasurer needs to review claims above RM100.
- No owner assigned for July volunteer recruitment.

Upcoming:
- 8 July: Sunfest opening ceremony.
- July: possible NGO showcase.
```

The digest should have a “Copy for WhatsApp” button.

## 8.7 Google Calendar Integration

Google Calendar should only be used once a Happening becomes confirmed.

### MVP Calendar Features

1. Link existing Google Calendar event to Happening.
2. Create Google Calendar event from confirmed Happening.
3. Show whether a confirmed Happening has calendar coverage.
4. Display linked calendar event URL.

### Rule

If status becomes `confirmed` and time type is `exact` or `date_only`, show:

> “This is confirmed. Add to Google Calendar?”

Do not force calendar creation.

## 8.8 Google Drive Integration

Drive integration helps connect proposals, receipts, documents, and planning files.

### MVP Drive Features

1. Paste Drive link into Happening.
2. Store file title, URL, file type, and added_by.
3. Show linked files on Happening detail page.

### Later Drive Features

1. Search recent Drive files.
2. Suggest files that may belong to a Happening.
3. Auto-detect new documents in selected folders.
4. Show “recent planning docs” in Pulse Dashboard.

## 8.9 Gmail Integration

Gmail integration should be later-stage, not MVP unless time allows.

### MVP Gmail Features

Manual only:

1. Paste Gmail thread link.
2. Add sender name manually.
3. Add summary manually.

### Later Gmail Features

1. Connect Gmail with extra OAuth scopes.
2. Watch for emails from known partners.
3. Suggest “new possible Happening” from email thread.
4. Add email as source evidence.
5. Generate follow-up reminders.

## 9. User Stories

## 9.1 Executive User Stories

As an executive, I want to see what is happening this week so that I do not lose track of fast-moving activities.

As an executive, I want to see pending decisions so that I know where leadership input is needed.

As an executive, I want to see unassigned happenings so that nothing floats without ownership.

As an executive, I want to generate a digest so that I can update the team quickly.

As an executive, I want confirmed happenings to be linked to Google Calendar so that formal events remain scheduled properly.

## 9.2 Event Lead User Stories

As an event lead, I want to capture a rough event idea quickly so that I do not need to create a full calendar event.

As an event lead, I want to add updates to a happening so that others know the current state.

As an event lead, I want to attach Drive links so that proposal documents are easy to find.

As an event lead, I want to mark a happening as confirmed so that it can be moved to Calendar.

## 9.3 Member User Stories

As a member, I want to see confirmed upcoming activities so that I know where I can join.

As a member, I want to avoid seeing private leadership items so that the dashboard stays relevant.

## 9.4 Treasurer User Stories

As treasurer, I want finance-related happenings to be visible so that claims and spending are not disconnected from events.

As treasurer, I want claims linked to happenings so that future audits are easier.

## 10. Permissions and Roles

Use Google Auth through Supabase.

### Roles

| Role        | Description                                                   |
| ----------- | ------------------------------------------------------------- |
| `member`    | Basic authenticated user                                      |
| `lead`      | Can create and update happenings                              |
| `executive` | Can view leadership items, approve decisions, manage settings |
| `treasurer` | Can view finance-related happenings and claim links           |
| `admin`     | Full system access                                            |

### Visibility Levels

| Visibility   | Who Can See                        |
| ------------ | ---------------------------------- |
| `public_org` | All authenticated Nyala Labs users |
| `team_only`  | Selected team or project members   |
| `leadership` | Executives and admins              |
| `finance`    | Treasurer, executives, admins      |
| `private`    | Creator, owner, admins             |

## 11. Information Architecture

### Main Navigation

```text
/dashboard
  /pulse
    /new
    /feed
    /digest
    /settings
    /[happeningId]
```

### Suggested Sidebar Label

```text
Pulse
```

Not “Calendar” and not “Events”, because this feature tracks more than formal events.

## 12. UX Requirements

## 12.1 Dashboard UX

The dashboard should feel like a command centre.

Use these top-level tabs:

```text
Now | This Week | Brewing | Needs Attention | Feed
```

### Card Design

Each card should be compact.

Example:

```text
Sunfest Collaboration
Pending Decision · High Certainty · July 2026
Owner: Joshua
Last update: 2 days ago
Needs: Confirm donation booth details
Sources: Drive · Gmail
```

### Status Colours

Use distinct visual badges, not only text.

Suggested mapping:

* Idea: grey
* Exploring: blue
* Pending decision: yellow
* Confirmed: green
* Active: purple
* Done: muted
* Cancelled: red

## 12.2 Quick Capture UX

The form should support two modes.

### Simple Mode

Fields:

* What is happening?
* Category
* Owner
* Rough date
* Needs follow-up?

### Advanced Mode

Fields:

* Description
* Status
* Certainty
* Visibility
* Tags
* External partner
* Linked Drive files
* Linked Gmail thread
* Related claims
* Notes

## 12.3 Digest UX

Digest page should have controls:

* Digest type
* Date range
* Visibility level
* Include attention items
* Include completed items
* Copy button
* Regenerate button

## 13. Data Model

Assume there is already a `users` table linked to Supabase Auth users.

## 13.1 Tables Overview

Required MVP tables:

1. `happenings`
2. `happening_updates`
3. `happening_sources`
4. `happening_participants`
5. `happening_tags`
6. `tags`
7. `follow_ups`
8. `notification_events`
9. `audit_logs`

Optional later tables:

1. `google_connections`
2. `google_calendar_links`
3. `gmail_thread_links`
4. `drive_file_links`
5. `digests`
6. `digest_items`

## 13.2 Table: happenings

```sql
create table happenings (
  id uuid primary key default gen_random_uuid(),

  org_id uuid not null,
  title text not null,
  description text,

  category text not null default 'general',
  status text not null default 'idea',
  certainty text not null default 'low',
  attention_level text not null default 'normal',

  time_type text not null default 'unknown',
  start_date date,
  end_date date,
  start_time timestamptz,
  end_time timestamptz,
  timezone text default 'Asia/Kuala_Lumpur',

  location text,
  external_partner text,

  owner_id uuid references users(id),
  created_by uuid not null references users(id),

  visibility text not null default 'public_org',

  follow_up_at timestamptz,
  last_activity_at timestamptz not null default now(),

  google_calendar_event_id text,
  google_calendar_event_url text,

  archived_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Constraints

```sql
alter table happenings
add constraint happenings_status_check
check (status in (
  'idea',
  'exploring',
  'pending_decision',
  'confirmed',
  'active',
  'done',
  'cancelled',
  'archived'
));

alter table happenings
add constraint happenings_certainty_check
check (certainty in (
  'low',
  'medium',
  'high',
  'confirmed'
));

alter table happenings
add constraint happenings_time_type_check
check (time_type in (
  'unknown',
  'exact',
  'date_only',
  'date_range',
  'month_only',
  'quarter_only'
));

alter table happenings
add constraint happenings_visibility_check
check (visibility in (
  'public_org',
  'team_only',
  'leadership',
  'finance',
  'private'
));
```

## 13.3 Table: happening_updates

```sql
create table happening_updates (
  id uuid primary key default gen_random_uuid(),

  happening_id uuid not null references happenings(id) on delete cascade,
  author_id uuid not null references users(id),

  update_type text not null default 'note',
  body text not null,

  old_status text,
  new_status text,
  old_certainty text,
  new_certainty text,

  created_at timestamptz not null default now()
);
```

Update types:

* `note`
* `status_change`
* `decision`
* `follow_up`
* `source_added`
* `calendar_linked`
* `finance_update`

## 13.4 Table: happening_sources

```sql
create table happening_sources (
  id uuid primary key default gen_random_uuid(),

  happening_id uuid not null references happenings(id) on delete cascade,

  source_type text not null,
  title text,
  url text,
  external_id text,
  metadata jsonb not null default '{}',

  added_by uuid not null references users(id),
  created_at timestamptz not null default now()
);
```

Source types:

* `manual`
* `google_drive`
* `gmail`
* `google_calendar`
* `whatsapp_manual`
* `external_link`

## 13.5 Table: happening_participants

```sql
create table happening_participants (
  id uuid primary key default gen_random_uuid(),

  happening_id uuid not null references happenings(id) on delete cascade,
  user_id uuid not null references users(id),

  role text not null default 'participant',

  created_at timestamptz not null default now(),

  unique(happening_id, user_id)
);
```

Participant roles:

* `owner`
* `participant`
* `viewer`
* `decision_maker`
* `finance_reviewer`

## 13.6 Table: tags

```sql
create table tags (
  id uuid primary key default gen_random_uuid(),

  org_id uuid not null,
  name text not null,
  color text,

  created_at timestamptz not null default now(),

  unique(org_id, name)
);
```

## 13.7 Table: happening_tags

```sql
create table happening_tags (
  happening_id uuid not null references happenings(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,

  primary key (happening_id, tag_id)
);
```

## 13.8 Table: follow_ups

```sql
create table follow_ups (
  id uuid primary key default gen_random_uuid(),

  happening_id uuid not null references happenings(id) on delete cascade,
  assigned_to uuid references users(id),
  created_by uuid not null references users(id),

  title text not null,
  description text,
  due_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## 13.9 Table: notification_events

```sql
create table notification_events (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references users(id),
  happening_id uuid references happenings(id) on delete cascade,

  type text not null,
  title text not null,
  body text,
  read_at timestamptz,

  created_at timestamptz not null default now()
);
```

## 13.10 Table: audit_logs

```sql
create table audit_logs (
  id uuid primary key default gen_random_uuid(),

  org_id uuid not null,
  actor_id uuid references users(id),

  entity_type text not null,
  entity_id uuid not null,
  action text not null,

  old_data jsonb,
  new_data jsonb,

  created_at timestamptz not null default now()
);
```

## 14. Supabase RLS Policy Direction

Enable RLS on all tables.

### Happenings Read Policy

Rules:

* `public_org`: all authenticated approved users can read.
* `team_only`: owner, participants, executives, admins can read.
* `leadership`: executives and admins can read.
* `finance`: treasurer, executives, admins can read.
* `private`: creator, owner, admins can read.

### Happenings Write Policy

Rules:

* Members can create public happenings if allowed by organisation setting.
* Leads and above can create happenings.
* Owner, creator, executives, and admins can update.
* Only executives and admins can archive leadership-level items.
* Treasurer can update finance visibility items.
* Only admins can hard delete.

## 15. Backend Architecture


## 15.2 Server Actions

Use Server Actions for internal mutations:

* Create Happening
* Update Happening
* Add update
* Add follow-up
* Mark follow-up complete
* Add source link
* Change status
* Archive Happening

## 15.3 Route Handlers

Use Route Handlers for external integrations:

* Google OAuth callbacks if needed beyond Supabase
* Calendar event creation endpoint
* Gmail push notification webhook
* Drive sync endpoint
* Cron-triggered attention recalculation

## 16. Authentication

Use Supabase Auth with Google login.

### Login Flow

1. User clicks “Continue with Google”.
2. Supabase handles Google OAuth.
3. App receives callback.
4. App checks whether email is approved.
5. If approved, create or update user profile.
6. Redirect to `/dashboard/pulse`.
7. If not approved, redirect to `/unauthorized`.

### Approved User Logic

Use an `approved_users` table if the organisation is private.

```sql
create table approved_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  invited_role text default 'member',
  invited_by uuid references users(id),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
```

On first login:

* Check `auth.users.email`.
* If email exists in `approved_users`, allow account creation.
* Assign initial role.
* Set `accepted_at`.
* If not, block access.

## 17. Attention Engine

The attention engine calculates which happenings need action.

### Function

```ts
calculateAttentionLevel(happening): "normal" | "watch" | "attention" | "urgent"
```

### Rules

Urgent:

* Follow-up overdue by more than 3 days.
* Event is within 7 days and still not confirmed.
* Status is pending decision for more than 7 days.
* Confirmed event has no calendar link and starts within 7 days.

Attention:

* No owner.
* Follow-up due today.
* No update in 7 days.
* External partner exists but no follow-up date.

Watch:

* Event has low certainty and date is within 30 days.
* Idea is older than 14 days.
* Exploring item has no linked source.

Normal:

* None of the above.

## 18. Digest Generator

The digest generator should not invent facts. It should summarise database records.

### Inputs

* Date range
* Visibility filter
* Categories
* Include completed
* Include attention items

### Output Sections

1. Now
2. Upcoming
3. Needs Attention
4. Recently Confirmed
5. Recently Completed
6. Decisions Needed
7. Finance Items

### MVP Implementation

Use deterministic templates first.

AI summarisation can be added later, but the MVP should work without AI.

## 19. Google Integration Strategy

## 19.1 MVP

Use Google only for authentication.

Manual links for:

* Google Drive files
* Gmail threads
* Google Calendar events

This keeps scope manageable.

## 19.2 Phase 2

Add Google Calendar integration.

Features:

* Create Calendar event from confirmed Happening.
* Link Calendar event to Happening.
* Sync basic event changes.
* Detect confirmed happenings without calendar coverage.

## 19.3 Phase 3

Add Google Drive integration.

Features:

* Search recent Drive files.
* Attach Drive files from picker/search.
* Suggest relevant Drive documents.

## 19.4 Phase 4

Add Gmail integration.

Features:

* Connect Gmail with explicit user consent.
* Watch selected labels or partner emails.
* Suggest possible happenings from email threads.
* Generate follow-up suggestions.

## 20. MVP Scope

## 20.1 Must Have

* Google login through Supabase
* Approved user access control
* Pulse dashboard
* Create Happening
* Edit Happening
* Happening detail page
* Add updates
* Status lifecycle
* Certainty level
* Flexible date system
* Owner assignment
* Visibility levels
* Attention flags
* Follow-ups
* Manual source links
* Digest generator
* Basic audit log

## 20.2 Should Have

* Realtime dashboard updates
* Role-based sidebar visibility
* Copy digest for WhatsApp
* Filter by category/status/owner
* Stale item detection
* Link existing Google Calendar event

## 20.3 Could Have

* Create Google Calendar event
* Drive file search
*
