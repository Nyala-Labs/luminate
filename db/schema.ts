import { pgTable, serial, text, timestamp, uuid, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const statusEnum = pgEnum('status', ['PENDING', 'ACTIVE', 'REVOKED']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  firstname: text('firstname'),
  lastname: text('lastname'),
  profilePic: text('profilePic'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  lastSignedIn: timestamp('last_signed_in'),
  status: statusEnum('status').default('PENDING').notNull(),
});

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull().unique(),
  description: text('description'),
});

export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  roleId: serial('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.roleId] }),
}));

// We'll keep posts for now so we don't break earlier setups, but point the authorId to a uuid
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  roles: many(userRoles),
  posts: many(posts),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const awards = pgTable('awards', {
  id: uuid('id').defaultRandom().primaryKey(),
  giverId: uuid('giver_id').references(() => users.id).notNull(),
  receiverId: uuid('receiver_id').references(() => users.id).notNull(),
  tierId: text('tier_id').notNull(),
  justification: text('justification').notNull(),
  evidenceUrl: text('evidence_url'),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const awardApprovals = pgTable('award_approvals', {
  id: uuid('id').defaultRandom().primaryKey(),
  awardId: uuid('award_id').references(() => awards.id),
  approverId: uuid('approver_id').references(() => users.id),
  decision: text('decision'),
  comment: text('comment'),
  stepIndex: serial('step_index'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reputationLedger = pgTable('reputation_ledger', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  awardId: uuid('award_id').references(() => awards.id),
  tierId: text('tier_id').notNull(),
  points: serial('points').notNull(),
  actionType: text('action_type'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const socialAccounts = pgTable('social_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  platform: text('platform').notNull(), // 'instagram' | 'linkedin' | 'facebook' | 'tiktok' | 'xhs'
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
});

export const socialPosts = pgTable('social_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  status: text('status').default('draft').notNull(), // 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledAt: timestamp('scheduled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const postMedia = pgTable('post_media', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').references(() => socialPosts.id, { onDelete: 'cascade' }).notNull(),
  driveFileId: text('drive_file_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const postPlatformContent = pgTable('post_platform_content', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').references(() => socialPosts.id, { onDelete: 'cascade' }).notNull(),
  platform: text('platform').notNull(),
  caption: text('caption'),
  status: text('status').default('pending').notNull(), // 'pending' | 'posted' | 'failed'
});

