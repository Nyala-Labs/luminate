# Finance Claim System PRD

## 1. Purpose

A controlled reimbursement system for a youth society to manage financial claims with audit-safe traceability, role-based approvals, and document-backed expenses.

The system ensures:
- Every claim is attributable
- Every approval is recorded
- Every payment is traceable
- Receipts are immutable once submitted
- Approval thresholds are enforced

---

## 2. Core Principles

1. Segregation of duties:
   - Submitter ≠ Approver ≠ Payer

2. Full audit traceability:
   - Every state change is logged

3. Receipt-backed claims:
   - No claim is valid without supporting documents

4. Threshold-based escalation:
   - RM100 rule for executive approval

---

## 3. Roles & Permissions

### Member
- Create claim
- Upload receipts
- View own claims

### Treasurer
- Review all claims
- Approve/reject claims ≤ RM100
- Forward claims > RM100

### Executive
- Approve/reject escalated claims (> RM100)

### Admin (optional)
- Manage users
- Configure thresholds
- View audit logs

### Auditor (read-only)
- View all claims
- View all logs
- Export reports

---

## 4. Claim Types

- Reimbursement
- Advance (optional future)
- Petty expense (optional)
- Operational expense

All types follow same approval pipeline.

---

## 5. Claim Workflow

### State Machine

DRAFT → SUBMITTED → TREASURER_REVIEW → TREASURER_APPROVED → (EXECUTIVE_REVIEW if > RM100) → APPROVED → PAID → CLOSED

Rejected state possible from any stage.

---

## 6. Approval Rules

### Rule A: Treasurer Mandatory
All claims must pass treasurer review.

### Rule B: Executive Threshold
If total_amount > RM100:
- requires executive approval

Else:
- auto skip executive stage

---

## 7. UI/UX SPECIFICATION

### 7.1 Claim Creation Page

Components:
- Claim title input
- Expense type dropdown
- Line-item table

#### Line Item Model
- description
- amount
- category
- optional event link

#### Receipt Upload UI

- Multi-upload dropzone
- Google Drive integration
- Each receipt displayed as:

Receipt Card:
- thumbnail preview
- file name
- linked amount (optional mapping)
- remove button

---

### 7.2 Claim Summary Panel (Right Side / Modal)

Displays live calculation:
Total Claim: RM 180

Item 1: RM 80
Item 2: RM 100

Warnings:
- “Requires Executive Approval” if > RM100

---

### 7.3 Claim Detail Page

Sections:

#### Header
- Claim ID
- Status badge
- Created by
- Date

#### Receipt Carousel (IMPORTANT UI)

Horizontal scroll cards:
- image preview
- amount tag
- open in Drive button

#### Expense Breakdown Table

| Item | Category | Amount |

#### Approval Timeline (audit view)

Vertical timeline:
- Submitted
- Treasurer review
- Executive review
- Payment

Each step includes:
- user
- timestamp
- action
- comment

---

### 7.4 Treasurer Dashboard

Queue-based UI:

Tabs:
- Pending Review
- Approved
- Rejected

Each claim card shows:
- total amount
- submitter
- receipt count
- “Review” button

---

### 7.5 Executive Dashboard

Only escalated claims:

Filters:
- > RM100
- awaiting approval

UI:
- simplified approval view
- focus on justification + total

---

### 7.6 Payment Screen (Treasurer only)

- mark as paid
- upload payment proof
- enter transaction reference

---

## 8. Data Model (Supabase/Postgres)

### users
- id (uuid)
- name
- email
- role (member | treasurer | executive | admin | auditor)
- created_at

---

### claims
- id (uuid)
- title
- description
- submitted_by (fk users)
- total_amount (numeric)
- status (enum)
- created_at
- updated_at

---

### claim_items
- id
- claim_id
- description
- amount
- category
- event_id (nullable)

---

### claim_receipts
- id
- claim_id
- drive_file_id
- drive_url
- uploaded_by
- created_at

---

### claim_approvals
- id
- claim_id
- stage (treasurer | executive)
- action (approved | rejected | forwarded)
- actor_id
- comment
- created_at

---

### audit_logs (immutable)
- id
- entity_type
- entity_id
- action
- old_value (json)
- new_value (json)
- actor_id
- timestamp
- ip_address

---

## 9. State Transition Rules (Backend Enforcement)

1. SUBMITTED → TREASURER_REVIEW only
2. TREASURER_REVIEW → TREASURER_APPROVED or REJECTED
3. If amount > 100:
   - TREASURER_APPROVED → EXECUTIVE_REVIEW
4. EXECUTIVE_REVIEW → APPROVED or REJECTED
5. APPROVED → PAID
6. PAID → CLOSED (locked)

---

## 10. Business Logic Layer

### Compute total claim
sum(claim_items.amount)

### Determine approval route
if total <= 100:
    skip executive
else:
    require executive

---

## 11. Google Drive Integration

Rules:
- each receipt stored as file_id
- no raw URLs as source of truth
- claim_receipts table links file to claim
- files must be immutable after submission

---

## 12. Security Requirements

- Role-based access control (RBAC)
- Row-level security in Supabase
- Immutable audit logs
- No deletion of claims (only voiding)

---

## 13. Reporting Module

- Monthly expense report
- Claim distribution by category
- Treasurer approval speed metrics
- Executive approval backlog

---

## 14. Edge Cases

- Missing receipts → auto flag
- Duplicate receipt hash → reject
- Partial approval → not allowed
- Editing after submission → disallowed (new revision only)

---

## 15. Non-functional Requirements

- Audit-safe
- Mobile responsive
- Offline tolerance for submission drafts
- Fast retrieval (<300ms queries)

---

## 16. Future Extensions

- Budget system
- Purchase request module
- Multi-society support
- Bank API integration