import { pgTable, serial, text, timestamp, uuid, pgEnum, primaryKey, numeric, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const statusEnum = pgEnum('status', ['PENDING', 'ACTIVE', 'REVOKED']);
export const claimStatusEnum = pgEnum('claim_status', ['DRAFT', 'SUBMITTED', 'TREASURER_REVIEW', 'TREASURER_APPROVED', 'EXECUTIVE_REVIEW', 'APPROVED', 'WAITING_FOR_PAYMENT', 'PAID', 'CLOSED', 'REJECTED']);
export const stageEnum = pgEnum('stage', ['treasurer', 'executive']);
export const actionEnum = pgEnum('action', ['approved', 'rejected', 'forwarded']);

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

// --- Pulse Tables ---

export const happeningStatusEnum = pgEnum('happening_status', [
  'idea', 'exploring', 'pending_decision', 'confirmed', 
  'active', 'done', 'cancelled', 'archived'
]);

export const happeningCertaintyEnum = pgEnum('happening_certainty', ['low', 'medium', 'high', 'confirmed']);
export const happeningVisibilityEnum = pgEnum('happening_visibility', ['public_org', 'team_only', 'leadership', 'finance', 'private']);

export const happenings = pgTable('happenings', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull().default('general'),
  status: happeningStatusEnum('status').default('idea').notNull(),
  certainty: happeningCertaintyEnum('certainty').default('low').notNull(),
  visibility: happeningVisibilityEnum('visibility').default('public_org').notNull(),
  ownerId: uuid('owner_id').references(() => users.id),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const happeningUpdates = pgTable('happening_updates', {
  id: uuid('id').defaultRandom().primaryKey(),
  happeningId: uuid('happening_id').references(() => happenings.id, { onDelete: 'cascade' }).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  updateType: text('update_type').default('note').notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const happeningSources = pgTable('happening_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  happeningId: uuid('happening_id').references(() => happenings.id, { onDelete: 'cascade' }).notNull(),
  sourceType: text('source_type').notNull(),
  title: text('title'),
  url: text('url'),
  addedBy: uuid('added_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notificationEvents = pgTable('notification_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  happeningId: uuid('happening_id').references(() => happenings.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  body: text('body'),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Existing Tables ---

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

export const claims = pgTable('claims', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  submittedBy: uuid('submitted_by').references(() => users.id).notNull(),
  totalAmount: numeric('total_amount').notNull(),
  status: claimStatusEnum('status').default('DRAFT').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const claimItems = pgTable('claim_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  claimId: uuid('claim_id').references(() => claims.id, { onDelete: 'cascade' }).notNull(),
  description: text('description').notNull(),
  amount: numeric('amount').notNull(),
  category: text('category').notNull(),
  eventId: text('event_id'),
});

export const claimReceipts = pgTable('claim_receipts', {
  id: uuid('id').defaultRandom().primaryKey(),
  claimId: uuid('claim_id').references(() => claims.id, { onDelete: 'cascade' }).notNull(),
  driveFileId: text('drive_file_id').notNull(),
  driveUrl: text('drive_url').notNull(),
  uploadedBy: uuid('uploaded_by').references(() => users.id).notNull(),
  status: text('status').default('PENDING').notNull(),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const claimPayments = pgTable('claim_payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  claimId: uuid('claim_id').references(() => claims.id, { onDelete: 'cascade' }).notNull(),
  paidBy: uuid('paid_by').references(() => users.id).notNull(),
  amount: numeric('amount').notNull(),
  proofDriveFileId: text('proof_drive_file_id').notNull(),
  proofDriveUrl: text('proof_drive_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const claimApprovals = pgTable('claim_approvals', {
  id: uuid('id').defaultRandom().primaryKey(),
  claimId: uuid('claim_id').references(() => claims.id, { onDelete: 'cascade' }).notNull(),
  stage: stageEnum('stage').notNull(),
  action: actionEnum('action').notNull(),
  actorId: uuid('actor_id').references(() => users.id).notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  action: text('action').notNull(),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  actorId: uuid('actor_id').references(() => users.id),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  ipAddress: text('ip_address'),
});

export const claimsRelations = relations(claims, ({ one, many }) => ({
  submittedBy: one(users, { fields: [claims.submittedBy], references: [users.id] }),
  items: many(claimItems),
  receipts: many(claimReceipts),
  approvals: many(claimApprovals),
}));

export const claimItemsRelations = relations(claimItems, ({ one }) => ({
  claim: one(claims, { fields: [claimItems.claimId], references: [claims.id] }),
}));

export const claimReceiptsRelations = relations(claimReceipts, ({ one }) => ({
  claim: one(claims, { fields: [claimReceipts.claimId], references: [claims.id] }),
  uploadedBy: one(users, { fields: [claimReceipts.uploadedBy], references: [users.id] }),
}));

export const claimApprovalsRelations = relations(claimApprovals, ({ one }) => ({
  claim: one(claims, { fields: [claimApprovals.claimId], references: [claims.id] }),
  actor: one(users, { fields: [claimApprovals.actorId], references: [users.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, { fields: [auditLogs.actorId], references: [users.id] }),
}));
