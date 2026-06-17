# Updated PRD — Nyala Labs Recognition & Reputation System

## 1. Overview
An immutable, narrative-driven internal recognition system replacing raw point metrics with qualitative achievement categories and a structured Hall of Fame. It focuses on cultural alignment rather than gamification.

## 2. Goals & Anti-Goals
- **Goals:** Decentralized recognition, clear tier definitions, auditability, cultural alignment.
- **Non-Goals:** Financial rewards, public leaderboards, superficial badging.

## 3. Tiered Recognition Structure
| Tier | Points | Role Focus |
| :--- | :--- | :--- |
| **Spark** | 0–10 | Proactive micro-assistance. |
| **Helper** | 10–50 | Dependable, consistent support. |
| **Builder** | 50–150 | Tangible output/shipment. |
| **Catalyst** | 150–300 | Multi-contributor coordination. |
| **Architect** | 300–500 | System/Process design. |
| **Luminary** | 500+ | Institutional impact. |

## 4. Enhanced User Journey
### 4.1 Recognition Flow
1. **Initiation:** Giver selects recipient, tier, and provides a specific context-rich justification (minimum 50 chars).
2. **Context Enrichment:** The UI fetches recent relevant activity (commits, PRs, etc.) as potential "evidence links."
3. **Automated Validation:** System enforces anti-abuse (cooldowns, no self-award, duplicate hash check).
4. **Routing:**
   - **Spark/Helper:** Auto-approved.
   - **Builder:**Sent to `Executive Level` role queue.
   - **Catalyst/Architect:** Sent to `Executive Level` role queue.
   - **Luminary:** Sent to `Executive Level` role queue.
5. **Ledgering:** Immutable write to `reputation_ledger`.
6. **Notification:** Recipient notified via email/webhook with the Giver's narrative.

## 5. Data Model Integration
Integration with existing `users` table via `foreign keys`.

### 5.1 Enhanced SQL Schema
```sql
-- Core Awards Table
CREATE TABLE awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    giver_id UUID REFERENCES users(id) NOT NULL,
    receiver_id UUID REFERENCES users(id) NOT NULL,
    tier_id VARCHAR(32) NOT NULL,
    justification TEXT NOT NULL,
    evidence_url TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, escalated
    created_at TIMESTAMP DEFAULT NOW()
);

-- Approval Workflow
CREATE TABLE award_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    award_id UUID REFERENCES awards(id),
    approver_id UUID REFERENCES users(id),
    decision VARCHAR(10),
    comment TEXT,
    step_index INT, -- Supports multi-step approval
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 6. Advanced Admin Features
- **/dashboard/recognition/admin:**
  - **Approval Queue:** Grid view of all pending items with filters by tier/approver.
  - **Audit Dashboard:** Full history of who approved what and when.
  - **Tier Config:** Dynamically adjust point thresholds (requires admin/executive privilege).
  - **Abuse Monitoring:** Flag accounts with high Giver-Receiver reciprocity (potential collusion).

## 7. Hall of Fame Integration
Triggered by an event listener on the `reputation_ledger`. When a user crosses a tier threshold (e.g., hits 500+), an entry is automatically drafted into the Hall of Fame archetype table, awaiting an "Archetype Title" customization by an Admin.

## 8. Implementation Steps
1. **Migrations:** Apply SQL schema changes using `supabase_apply_migration`.
2. **Middleware:** Enforce `requireRole("Executive Level")` for all administrative routes in `/dashboard/recognition/admin`.
3. **UI/UX:** Build the Award Modal (giver side) and Approval Queue (admin side) using Shadcn UI.
4. **Events:** Implement Supabase Edge Function to handle notification triggers upon approval.
