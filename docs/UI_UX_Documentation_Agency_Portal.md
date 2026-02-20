# UI/UX DOCUMENTATION
## Hybrid Internal + Client Portal Web Application

**Website Development Agency Operational System**

**Complete Design System & Implementation-Ready Specifications**

*February 2026*

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Information Architecture](#2-information-architecture)
3. [Role-Based Experience Mapping](#3-role-based-experience-mapping)
4. [Lifecycle Visualization Strategy](#4-lifecycle-visualization-strategy)
5. [Dashboard Strategy](#5-dashboard-strategy)
6. [Workflow-Driven Page Structure](#6-workflow-driven-page-structure)
7. [Data Density & Table Strategy](#7-data-density--table-strategy)
8. [Versioning & Change History UI](#8-versioning--change-history-ui)
9. [File & Asset Management UX](#9-file--asset-management-ux)
10. [Error Handling & Alert System](#10-error-handling--alert-system)
11. [Audit Log & Activity Timeline UX](#11-audit-log--activity-timeline-ux)
12. [Design System Foundation](#12-design-system-foundation)
13. [Responsive & Layout Strategy](#13-responsive--layout-strategy)
14. [Scalability & Phase 2 Readiness](#14-scalability--phase-2-readiness)

---

# 1. Design Principles

This operational system must prioritize clarity, efficiency, and data integrity above visual aesthetics. Every design decision must serve the primary user goal: managing complex project lifecycles with minimal cognitive load and maximum error prevention.

## 1.1 UX Philosophy for Operational Systems

Operational systems differ fundamentally from consumer software. Users are subject-matter experts performing critical business tasks under time pressure. The interface must be:

- **Information-First**: Data visibility precedes navigation. The interface reveals what needs attention immediately, not through progressive disclosure.
- **Task-Centric**: Interface organization maps directly to business workflows, not to data structures or technical architecture.
- **Unambiguous State Representation**: Every entity's status must be instantly recognizable. Ambiguity requires additional queries and introduces error risk.
- **Reversibility-Aware**: Distinguish between reversible actions (edit, delete) and irreversible actions (send, publish) with explicit confirmation architecture.
- **Audit-Transparent**: Every significant state change must be traceable through the audit log. UI design must support traceability requirements.

## 1.2 Data Clarity Principles

Data must be presented without abstraction or summarization that obscures operational reality.

- **Show Source Data**: Always display original source values (e.g., invoice amount) alongside derived values (e.g., outstanding balance).
- **Qualify Dates**: Every timestamp must include both date and time. Relative time labels (e.g., '2 days ago') are insufficient for operational tasks.
- **Surface Constraints**: Workflow rules, SLA definitions, and approval thresholds must be visible at the point of action.
- **Expose Relationships**: When an entity is locked/read-only, the UI must identify what is blocking it and provide navigation to the blocking entity.

## 1.3 Error Prevention Principles

Errors in operational systems create cascading business consequences (e.g., incorrect invoice, broken contract, missed SLA). Prevention must precede recovery.

- **Constraints-Based Design**: Make invalid states unselectable (greyed out, hidden) rather than selectable and error-checked.
- **Confirmation Escalation**: Confirmation dialog complexity increases with action severity. Deleting a customer is more dangerous than deleting a note.
- **Related Entity Cascades**: Before allowing an action, surface all dependent entities that will be affected.
- **Duplicate Prevention**: For critical entities (Contracts, Invoices), provide explicit duplicate detection at creation time.

## 1.4 Lifecycle Visibility Strategy

All 30+ lifecycle models must be visually unified under consistent status representation principles.

- **Status Badges Are Scannable**: Color + Icon + Text. Users must identify status in under 100ms without reading text.
- **Timeline Integration**: Every entity with a deadline must show timeline position relative to current date.
- **State Transition Clarity**: The list view must indicate which state transitions are available for the current user and entity state.
- **SLA Integration**: SLA status overrides visual priority. An overdue SLA must dominate the visual hierarchy.

---

# 2. Information Architecture

## 2.1 Main Navigation Structure

Navigation is organized by operational domain, not by technical system. All navigation is persistent (sidebar + top bar) to maintain context.

### Primary Navigation Domains (Sidebar)

- **Dashboard**: Personal KPI dashboard (internal role-specific; simplified client view)
- **Sales**: Leads, Opportunities, Proposals, Quotations, Contracts
- **Projects**: Active Projects, Tasks, Milestones, Timelines, Revisions
- **Finance**: Invoices, Payments, Expenses, Reports
- **Support**: SLA Tickets, Issues, Asset Management
- **Team**: Resources, Capacity, Assignments
- **Infrastructure**: Domains, Hosting, Environments, Deployments
- **Settings**: Admin, Roles, Permissions, Audit

### Reasoning for Grouping

Domains are grouped by business process phase (Sales → Projects → Finance → Support), not by data type. This mirrors the customer lifecycle: acquire → deliver → monetize → retain. Internal teams navigate this same sequence. Clients navigate only Projects, Finance, and Support—the phases they participate in.

## 2.2 Sidebar Hierarchy

Sidebar uses collapsible groups. Primary domains (Sales, Projects, Finance, Support, Team, Infrastructure) are always visible. Tertiary views collapse under their parent domain.

### Sidebar Organization Example

```
Sales (expandable)
  ├─ Pipeline
  ├─ Opportunities
  ├─ Proposals
  └─ Contracts

Projects (expandable)
  ├─ Active Projects
  ├─ Tasks
  └─ Timelines

Finance (expandable)
  ├─ Invoices
  ├─ Payments
  └─ Expenses

Support (expandable)
  ├─ SLA Tickets
  └─ Support Issues
```

## 2.3 Internal vs Client Navigation Separation

### Client Portal Navigation (Restricted Set)

- **My Dashboard**: Project progress, pending approvals, payment status
- **Projects**: Only their assigned projects, tasks, revisions
- **Invoices**: Only their invoices (paid/outstanding)
- **Support**: Only their tickets and support interactions
- **Account**: Profile, notifications, communication preferences

### Sidebar Behavior - Client vs Internal

The client sidebar is a strict subset. No Settings, Team, Finance reporting, or Infrastructure. The internal portal may collapse unrelated domains (e.g., developers hide Finance), but all domains remain accessible via search or admin override.

## 2.4 Settings Architecture

### Organizational Settings (Admin Only)

- **System Configuration**: SLA definitions, workflow rules, status taxonomy
- **User Management**: Teams, roles, permissions, access logs
- **Integrations**: API keys, webhook management, third-party services
- **Audit & Compliance**: Activity logs, data export, retention policies

### Personal Settings (All Users)

- **Profile**: Name, email, phone, default locale, timezone
- **Notifications**: Email, in-app, SMS preferences; quiet hours
- **Display**: Sidebar collapse, theme, default list views

---

# 3. Role-Based Experience Mapping

## 3.1 Role Definitions & Data Boundaries

### Sales Role

**Accessible**: Pipeline, Opportunities, Proposals, Contracts, Quotations, Documents  
**Hidden**: Project tasks detail, infrastructure, team capacity  
**Read-only**: Finance reports (invoices, payments)

### Project Manager Role

**Accessible**: All Projects, Tasks, Milestones, Timelines, Revisions, Team assignments  
**Hidden**: Financial details (invoice amounts), Sales pipeline  
**Read-only**: Contract terms (can reference, cannot modify)

### Developer Role

**Accessible**: Assigned tasks, Revisions (for their assigned projects), Infrastructure (their assigned environments)  
**Hidden**: Sales, Financial, Team capacity details  
**Read-only**: Project scope, acceptance criteria

### Finance Role

**Accessible**: Invoices, Payments, Expenses, Financial reports, Contract terms (for pricing)  
**Hidden**: Project internals, Team capacity details  
**Read-only**: Project status (for context), Sales pipeline (for contract visibility)

### Support/Operations Role

**Accessible**: SLA Tickets, Domain/Infrastructure status, Capacity reports  
**Hidden**: Sales opportunities, Financial details  
**Read-only**: Project status, Contract SLA terms

### Admin Role

**Accessible**: Everything  
**Read-write**: All modules, Settings, Audit logs, User management

### Client Role

**Accessible**: Their assigned projects only, their invoices only, their support tickets only  
**Hidden**: Other clients' data, team internals, financial analysis, infrastructure  
**Read-write**: Project approval (revisions, milestones), support ticket creation

## 3.2 Role-Permission UI Behavior Matrix

| Entity Action | Sales | PM | Developer | Finance | Support | Admin | Client |
|---|---|---|---|---|---|---|---|
| View Pipeline | RW | R | – | R | – | RW | – |
| Create Opportunity | RW | – | – | – | – | RW | – |
| Approve Proposal | RW | R | – | R | RW | RW | – |
| View Project Tasks | R | RW | RW | R | R | RW | R |
| Update Task Status | – | RW | RW | – | – | RW | – |
| View Invoice | R | R | – | RW | – | RW | R |
| Record Payment | – | – | – | RW | – | RW | – |
| Create SLA Ticket | – | R | – | – | RW | RW | RW |
| Manage Users | – | – | – | – | – | RW | – |
| View Audit Log | – | – | – | – | – | RW | – |

**Legend**: RW = Read-Write | R = Read-Only | – = No Access

## 3.3 UI Behavior Based on Role

### Visible/Hidden Elements

When a user lacks permission for a module or action:

- **If entire module**: Hide from sidebar. No dead links.
- **If action on entity**: Disable button (show with tooltip explaining permission). Do not hide the button (it causes confusion about whether the feature exists).
- **If viewing restricted data**: Show the entity but with sensitive fields redacted. Example: Developer viewing a contract sees delivery dates but not pricing.

### Approval Authority Visualization

When an entity requires approval:

- Show approval status badge (e.g., 'Awaiting PM Approval').
- Display approver name and deadline in the detail panel.
- If user is the approver: Highlight with prominent action buttons (Approve / Request Revision).
- If user is not the approver: Show read-only view with timeline of approvals.

---

# 4. Lifecycle Visualization Strategy

The system manages 30+ distinct lifecycles. All must follow unified visualization principles while accommodating domain-specific semantics.

## 4.1 Status Badge Design Rules

### Badge Composition

- **Icon (left)**: Symbolic representation of status category (e.g., checkmark for complete, hourglass for pending, X for rejected).
- **Color (background)**: Semantic meaning (green=success, yellow=caution, red=error, blue=neutral, purple=pending approval).
- **Text (label)**: Status name (max 2 words). Example: 'Awaiting Approval', 'In Progress'.

### Badge Color Mapping (Unified Across All Entities)

| Status Category | Color (Hex) | Icon | Examples |
|---|---|---|---|
| Completed/Success | #10B981 | ✓ | Approved, Closed, Paid, Deployed |
| In Progress/Active | #3B82F6 | ⚙ | In Progress, Active, Processing |
| Pending Action | #F59E0B | ⏳ | Awaiting Approval, Pending Review |
| Blocked/On Hold | #8B5CF6 | ◆ | On Hold, Blocked, Requires Revision |
| Overdue/Critical | #EF4444 | ⚠ | Overdue, SLA Violated, Rejected |
| Cancelled/Inactive | #6B7280 | ✕ | Cancelled, Archived, Closed (negative) |

## 4.2 Icon Mapping Logic

Icons are semantically consistent within status categories. All pending states use hourglass (⏳). All approved states use checkmark (✓). Users rapidly pattern-match based on icon before reading text.

### Icon Library for Status Badges

- **✓** = Approved, Completed, Confirmed
- **⏳** = Pending, Awaiting, In Review
- **⚙** = In Progress, Processing, Active
- **✕** = Cancelled, Rejected, Removed
- **◆** = On Hold, Blocked, Paused
- **⚠** = Overdue, Alert, SLA Violation

## 4.3 Timeline Visualization Pattern

All time-sensitive entities (Proposals, Contracts, Projects, Milestones, SLA Tickets) display timeline context. The timeline shows:

- Current date line (red, always visible)
- Start date (if applicable)
- Due/deadline date (color-coded: green if future, red if past)
- Current position relative to deadline (percentage complete, days remaining)

### Timeline Display Locations

- **List view**: Compact timeline sparkline (50px wide) in rightmost column.
- **Detail view**: Expanded timeline with dates, milestones, status checkpoints.

## 4.4 State Transition UX Pattern

Not all state transitions are valid. The UI enforces valid paths through a workflow state machine.

### Transition Rules Enforcement

- Valid transitions from current state are available as clickable actions.
- Invalid transitions are disabled (greyed out) with a tooltip explaining why.
- Example: A 'Draft' proposal can transition to 'Sent' or 'Cancelled' but not to 'Paid'.

### Transition Action Placement

- **Primary action** (next logical step): Large primary button (blue, top-right of detail panel).
- **Secondary transitions**: Dropdown menu or secondary buttons.
- **Destructive transitions** (Reject, Cancel): Red buttons, grouped separately from success actions.

## 4.5 Confirmation Rules

### Confirmation Dialog Triggers

- **Irreversible actions** (e.g., Invoice → Finalized, Contract → Signed): Always require confirmation.
- **High-impact transitions** (e.g., Client-visible changes): Require confirmation + reason field.
- **Reversible actions** (e.g., Task → In Progress): No confirmation required; undo available for 60 seconds.

### Confirmation Dialog Content

- **Confirmation text**: Explicitly state what will happen and who will be notified.
- **Reason field**: For major state changes (visible to stakeholders), provide a reason/notes field.
- **Affected entities**: If the transition cascades (e.g., cancelling a contract affects invoices), list them.

## 4.6 Forbidden State Transitions - Handling

If a user attempts a forbidden transition:

- **Disabled state**: Button is greyed out with tooltip: 'Cannot transition to [state] while [blocker entity] is in [state].'
- **Blocker link**: Tooltip includes a link to the blocking entity (e.g., 'View pending approval').
- **Example**: A Project cannot move to 'Completed' while any Task is 'In Progress'. The UI shows: 'Complete Project (disabled: 3 tasks in progress)' with a link to the Tasks tab.

## 4.7 Escalation Indicators

When an entity is overdue or SLA-violating, it must be visually escalated above its normal status priority.

### Escalation Visual Rules

- **SLA overdue**: Status badge becomes red (regardless of underlying status). Example: 'SLA Violated' badge overrides 'In Progress' badge.
- **Deadline overdue**: Timeline shows red background. Row highlight: Light red background.
- **Approval delayed**: 'Awaiting Approval' badge pulses (animated) if overdue by 1+ day.
- **Payment overdue**: Row shows red left border. 'Overdue X days' text in red next to amount.

## 4.8 Overdue Visualization

### Overdue States Across Lifecycle Models

- **Proposal**: Show 'Valid Until [date]' with countdown. If expired, status becomes 'Expired'.
- **Contract**: Show 'Ends [date]' with 60-day pre-expiration warning.
- **Milestone**: Show 'Due [date]' with red background if past due. Highlight 'X days overdue'.
- **Invoice**: Show 'Due [date]' | 'X days overdue' in red if unpaid beyond due date.
- **SLA Ticket**: Show 'Response due [time] (X hours remaining)'. Red background if < 1 hour.

---

# 5. Dashboard Strategy

## 5.1 Internal Dashboard (Role-Specific)

### Sales Dashboard

- **Pipeline Summary**: Deals by stage (visual funnel), total value, conversion rate month-to-date.
- **Proposals Awaiting Action**: List of proposals pending signature/approval, ordered by deadline.
- **Upcoming Renewals**: Contracts expiring in next 60 days.
- **Personal KPIs**: Closed deals (this month), pipeline value, client retention rate.

### PM Dashboard

- **Active Projects**: Project list with status, timeline, resource allocation.
- **Milestone Timeline**: Visual Gantt-style view of upcoming milestones (30-day window).
- **Tasks Awaiting Review**: Revisions pending approval, status change requests.
- **Resource Capacity**: Team utilization (% allocated across active projects).

### Developer Dashboard

- **My Tasks**: Assigned tasks (filtered by current project), sorted by deadline.
- **Pending Revision Requests**: Client feedback waiting for implementation.
- **Deployment Status**: Recent deployments, infrastructure issues (if infrastructure access).

### Finance Dashboard

- **Outstanding Invoices**: Total outstanding, aged breakdown (current, 30 days, 60+ days).
- **Revenue Summary**: Monthly revenue (actual vs forecast), gross margin.
- **Upcoming Expenses**: Invoices due, payment obligations.

## 5.2 Client Dashboard

### Client Portal Dashboard (Simplified)

- **Project Summary**: Their active projects, timeline position, milestone status.
- **Action Items**: Pending approvals (revisions, milestones), awaiting client feedback.
- **Invoice & Payment**: Outstanding invoices, payment history, payment method.
- **Recent Activity**: Latest project updates, comment threads they're involved in.

## 5.3 Widget Layout Structure

### Grid System: 12-column responsive layout

- **Desktop (1400px+)**: Full 12-column grid
- **Tablet (768px-1400px)**: 2-column layout
- **Mobile**: 1-column stack

### Widget Sizing Rules

- **KPI Summary**: 3 columns (4 cols × 3 = 12). Cards show: title, current value, change %, trend sparkline.
- **Charts** (Pipeline, Timeline): 6 columns. Min height 250px.
- **Lists** (Pending actions): 6-12 columns. Max 8 rows visible; pagination or 'View all' link.

## 5.4 Alert Panel Logic

### Alert Hierarchy on Dashboard

- **Critical (top)**: SLA violations, overdue payments, deployment failures. Red background, persistent until resolved.
- **Warning (middle)**: Deadline approaching (24 hours), approval delayed. Yellow background.
- **Info (bottom)**: New milestones, completed tasks, system updates. Blue background.

### Alert Dismissal & Persistence

- **Critical**: Must be acknowledged (not just dismissed). Reappears on next login if unresolved.
- **Warning/Info**: Dismissible. Does not reappear.

## 5.5 Real-Time vs Batch Metrics

### Real-Time Metrics

- Task status changes (in-progress, completed)
- New approvals, comments, mentions
- SLA threshold violations
- Deployment status

### Batch Metrics (Updated Daily at Midnight)

- Revenue, forecast, aged receivables
- Project health score
- Team utilization, capacity

### Real-Time Indicator

Widget header shows '(Real-time)' or '(Updated [time])' to clarify refresh cadence.

## 5.6 Drill-Down Behavior

Every dashboard widget is interactive. Clicking into a widget drills down to the filtered list view.

- Click 'Awaiting Approval' KPI → Filtered list of only entities in 'Awaiting Approval' state.
- Click timeline bar → Calendar view of that time period.
- Click team member name → Their capacity/availability view.

---

# 6. Workflow-Driven Page Structure

## 6.1 List Page Layout

### Standard List Page Components (Top to Bottom)

- **Breadcrumb**: Navigational context. Example: Dashboard > Sales > Opportunities
- **Page title + subtitle**: Title is entity type (e.g., 'Contracts'). Subtitle shows current filter/view (e.g., 'Active Contracts (23)').
- **Primary action button (top-right)**: 'New [Entity]' (blue). Single-click creates entity or opens creation modal.
- **Secondary actions (top-right, after primary)**: Export, Print, Bulk actions (if selected). Collapsed into dropdown if space-constrained.
- **Filter bar**: Quick filters (status, date range, assignee). 'Advanced Filter' link opens side panel.
- **Search bar**: Entity-scoped full-text search (searches name, ID, description).
- **View toggle**: List, Card, Timeline, Kanban (if applicable). Remembered per user per module.
- **Sort/column menu**: Dropdown to customize visible columns, sort order.
- **Table**: Entity rows. Left column: selection checkbox. Status badge in 2nd column. Name/ID in 3rd. Remaining columns: context (date, owner, value).
- **Pagination**: Bottom-right. Show 'Showing 1-25 of 247 results'. Options: 25, 50, 100 rows per page.

## 6.2 Detail Page Layout

### Detail Page Structure (3-Column Layout)

- **Left panel (3 cols)**: Main entity details. Tabs: Overview, Timeline, Activity, Audit.
- **Center panel (6 cols)**: Related entities. Example: For a Contract detail, show Invoices, Payments, Milestones.
- **Right panel (3 cols)**: Side panel with: Status badge, quick facts (owner, dates, value), approval status, action buttons.

### Top-Right Action Button Layout

- **Primary action** (next workflow state): Large blue button. Example: 'Approve', 'Send', 'Deploy'.
- **Secondary actions**: Smaller secondary buttons or dropdown. Example: 'Request Revision', 'Schedule'.
- **Destructive action**: Red button, grouped separately. Example: 'Cancel Contract', 'Reject'.
- **Edit toggle**: Pencil icon to enter edit mode (if user has edit permission).

## 6.3 Edit Mode vs View Mode Behavior

### View Mode (Default)

- All fields are read-only text displays.
- Edit button (pencil icon, top-right) enables edit mode.
- Color: Subtle gray text on white background. Field labels bold, values regular weight.

### Edit Mode

- Editable fields become form inputs (text, dropdowns, date pickers).
- Non-editable fields remain read-only (e.g., 'Created by', 'Created date').
- Changed fields show blue highlight or left border.
- Bottom-right buttons: 'Save' (primary blue) and 'Cancel' (secondary gray).
- On save: Page returns to view mode. Toast confirmation: 'Contract updated successfully' (top-right).

## 6.4 Primary / Secondary / Dangerous Action Placement

### Action Priority

- **Primary** (next workflow step): Large, prominent, blue button, top of action cluster.
- **Secondary** (alternative flows, non-critical): Medium gray buttons, below primary.
- **Dangerous** (irreversible, cascading impacts): Red buttons, visually separated (spacing or divider).

### Example: Contract Detail Page Action Layout

```
[ PRIMARY: Approve / Send / Finalize ] (large blue button)

[ Secondary: Request Revision ] [ Create Milestone ] (medium gray buttons, in row)

---

[ DANGEROUS: Cancel Contract ] [ Delete ] (red buttons)
```

## 6.5 Tab Structure

### Standard Tab Set (Left Panel, Detail Page)

- **Overview**: Entity details (form fields, key facts).
- **Timeline**: Chronological view of status changes, milestones, key dates.
- **Activity**: Comments, mentions, collaborative notes.
- **Audit**: Change history (who changed what, when). Visible to admins + entity owner.

### Additional Tabs (Conditional, Based on Entity)

- **Revisions**: For Proposals, Contracts (version history).
- **Approvals**: For entities requiring multi-step approval.
- **Documents**: File attachments, related assets.

## 6.6 Side Panel Usage

### Right-Side Panel (Persistent, Always Visible)

- **Status summary**: Badge, current state, next steps.
- **Quick facts**: Owner, dates, value, SLA status.
- **Approval chain**: Visual timeline of approvals (who, when, status).
- **Related entities**: Links to parent, child, linked entities (e.g., Contract side panel shows linked Invoices).
- **Action buttons**: Primary + secondary actions.

## 6.7 Drawer vs Modal Decision Rules

### Use Drawer When:

- Opening a detail view from a list (side-by-side context).
- Editing a single entity without losing list context.
- Action that doesn't require full-page context (e.g., add a comment, assign a task).

### Use Modal When:

- Confirmation dialog (destructive action, critical decision).
- Creating a new entity (need focus, multi-step form).
- Data selection (e.g., select multiple clients for bulk action).

---

# 7. Data Density & Table Strategy

## 7.1 Default Pagination

**Default**: 25 rows per page. **Options**: 25, 50, 100, 250. Remember user's selection per module.

**Rationale**: 25 rows is scannable on a single viewport. More rows require scrolling and increase cognitive load. Users performing operational tasks (reviewing status, finding outliers) benefit from pagination over infinite scroll.

## 7.2 Sorting Rules

### Default Sort Order (by Entity Type)

- **Contracts**: By end date (descending). Expiring soon = high priority.
- **Invoices**: By due date (ascending). Overdue = top.
- **Tasks**: By deadline (ascending). Due soon = top.
- **Opportunities**: By probability × value (descending). Highest-value next steps = top.

### Click-to-Sort Column Headers

- Column header is clickable. First click = ascending. Second click = descending. Third click = remove sort.
- Visual indicator: Small arrow icon (↑↓) in header showing sort direction.
- Multi-sort: Hold Shift + click multiple columns to sort by secondary/tertiary fields.

## 7.3 Filtering System

### Quick Filter Bar

- **Status**: Dropdown, multi-select. Shows badge colors inline.
- **Date range**: Preset buttons (Last 7 days, Last 30 days, This month, Custom range).
- **Owner/Assignee**: Dropdown or search (if > 10 options).
- Applied filters show as removable tags above the table. 'Clear all filters' link at end.

## 7.4 Advanced Filter Logic

### Advanced Filter Panel (Side Panel, Drawer)

- Opened via 'Advanced Filter' link next to quick filters.
- Allows complex queries: 'Status = Active AND Owner = [User] AND Created date > 30 days ago'.
- Operators: equals, not equals, contains, greater than, less than, between, is empty.
- Add/remove rows: + button to add filter row. X button to remove.
- Logic operators: AND (default), OR between filter rows.
- Save filters: Named filters (e.g., 'My Overdue Tasks') for quick re-application.

## 7.5 Search Scope

### Search Bar Behavior

- **Entity-scoped**: Searching on a list page searches only that entity type.
- **Fields searched**: Name, ID, description, key fields. Do NOT search all fields (too slow, too noisy).
- **Live search**: Results update as user types (debounced by 300ms).
- **Global search** (top navigation bar): Cross-entity search. Scoped by module. Results show entity type badge.

## 7.6 Column Customization

### Column Customization Menu

- Accessed via settings icon (gear) in table header.
- Checkbox list: Toggle column visibility. Drag to reorder.
- Defaults: Pre-select sensible default columns. Allow user to customize and remember.
- Save view: 'Save this view' button to persist column layout, sort, and filters under a custom name.

## 7.7 Bulk Action UX

### Bulk Action Flow

- **Row selection**: Checkbox in leftmost column. Click to select individual rows. Click header checkbox to select all on page (not all results).
- **Selection feedback**: Selected rows highlight (light blue background). Row count displayed: 'X rows selected'.
- **Bulk action menu**: Appears above table when rows selected. Actions: Assign, Change status, Delete, Export, Print.
- **Confirmation**: Bulk actions require confirmation (count of affected rows shown in dialog).
- **Progress**: For long-running bulk ops, show progress bar or toast with count. Example: 'Updating 47 invoices... (12/47 complete)'.

## 7.8 Export UX

### Export Functionality

- **Export button**: Top-right, near primary action. Opens dropdown: CSV, Excel, PDF.
- **Scope**: Includes current filter + sort + visible columns.
- **Row limit**: Export all rows (no pagination limit) unless > 10,000 rows (show warning, allow continue).
- **File naming**: 'Invoices_2025-02-19.csv' (entity + date).

---

# 8. Versioning & Change History UI

## 8.1 Version Selector UX

### Entities with Versioning: Proposals, Quotations, Contracts, Pricing

- **Version selector** in right side panel. Dropdown: 'Version 3 of 5 (Current)'.
- **Clicking** opens version list: Each version shows date, author, change summary, status.
- **Select previous version**: Content switches to that version (read-only). Header shows 'Viewing Version 2 (from [date])'—in yellow alert box to warn it's not current.
- **Revert to previous**: Button to rollback to selected version (triggers confirmation, creates new version).

## 8.2 Version Comparison Strategy

### Comparison Modal/Panel

- Accessed via 'Compare versions' link in version list.
- Side-by-side layout: Version A (left) and Version B (right).
- Changed fields highlighted: Green (addition), Red (deletion), Yellow (modification).
- Unchanged fields: Greyed out or collapsible to focus on changes.
- Slider control: Drag timeline slider to show versions at different dates.

## 8.3 Change Highlight Behavior

### Inline Change Highlighting (Detail View)

- When viewing current version: Fields changed in most recent version show a subtle blue left border.
- Tooltip on hover: Shows previous value + change date + author.
- Example: Contract 'End date' field shows blue border. Hover reveals: 'Changed from 2025-12-31 to 2026-12-31 on Feb 10 by Jane Doe'.

## 8.4 Revision Comment Thread Design

### Revision Comments (Contract/Proposal Revisions Tab)

- Each revision (version) has a comment thread attached.
- Comments show: Author, timestamp, comment text, [Like], [Reply] buttons.
- Threaded replies: Indented under parent comment. Visual nesting depth < 2 levels.
- Mentions: @mention syntax triggers notification to mentioned user.
- Unresolved comments: Checkbox to mark resolved. Unresolved comments shown with red icon.

## 8.5 Audit Log Integration

### Audit Log in Timeline Tab

- Timeline tab shows all state changes + version history + comments in chronological order.
- Each audit entry: Icon, timestamp, action (e.g., 'Version 3 created'), actor, summary.
- Click entry: Expands to show before/after values for changed fields.

---

# 9. File & Asset Management UX

## 9.1 Upload Interaction

### File Upload Interface

- **Drag-and-drop zone**: Designated area labeled 'Drag files here or click to browse'. Border dashed, subtle background color.
- **Click to browse**: Opens system file picker.
- **Drag-over feedback**: Zone highlights (brightens) when file is dragged over.
- **Multiple files**: Support batch upload (5+ files at once).

## 9.2 File Validation UX

### Validation Rules

- **File type**: Only allowed types (e.g., PDF, PNG, XLSX). Invalid types rejected with inline error.
- **File size**: Max 20MB. File exceeding limit shows error before upload starts.
- **Duplicate check**: If file with same name exists, show 'File exists' dialog. Options: Replace, Keep both (rename), Cancel.

### Validation Error Display

- File appears in upload queue with red error icon. Tooltip: 'File type not supported (requires PDF)'.
- User can remove file from queue and try another.

## 9.3 Resolution Warning UX

### Image Resolution Validation

- For images: If resolution < 1920 × 1080, show warning: 'Image resolution is 800 × 600. Recommended: 1920 × 1080 or higher for web display.'
- User can proceed anyway or re-upload higher-resolution image.

## 9.4 Version Overwrite vs Incremental Version

### File Versioning Strategy

- **Overwrite (default)**: Uploading file with same name replaces existing file. Prompted in dialog with confirmation.
- **Incremental version**: User option to 'Keep as new version'. Original file remains accessible. New version timestamp appended to name or tracked separately.

## 9.5 Asset Checklist Design

### Asset Checklist (Projects, Deliverables)

- Project detail page includes 'Deliverables' or 'Assets' tab.
- Checklist format: List of required assets (e.g., 'Homepage design', 'Mobile mockup', 'Content files').
- Each item: Checkbox (unchecked = not uploaded, checked = uploaded), asset name, file count (if multiple), approval status.
- Upload button per asset: Opens upload modal for that asset type.
- Progress indicator: 'X of Y deliverables uploaded'.

## 9.6 Approval Visualization (Assets)

### File Approval State

- Each uploaded file shows approval badge: 'Approved', 'Pending Approval', 'Rejected'.
- If pending: Show approver name + deadline. If approved: Show approver name + approval date.
- Client-facing: If file is rejected, show rejection reason and allow re-upload.

---

# 10. Error Handling & Alert System

## 10.1 Alert Severity Levels

### Critical (Red)

- SLA violation, payment failure, system error, data corruption.
- Display: Modal dialog or prominent top-of-page alert. Requires acknowledgment.
- Persistence: Remains until resolved or explicitly dismissed.

### Warning (Yellow)

- Deadline approaching (< 24 hours), approval delay, incomplete data.
- Display: In-page banner or toast notification (top-right, 5-second auto-dismiss).
- Dismissible: User can dismiss; does not reappear.

### Info (Blue)

- Action completed successfully, new milestone, system update.
- Display: Toast notification (top-right, 3-second auto-dismiss).
- Dismissible: Can dismiss early.

## 10.2 Overdue Indicators

### Overdue Visual Treatment (Across All Entities)

- **List view**: Red left border (4px). Text color red for 'X days overdue'.
- **Status badge**: Becomes red 'OVERDUE' if past deadline.
- **Detail view**: Red alert box with overdue notice. Example: 'This invoice is 5 days overdue. Follow up required.'
- **Sort priority**: Overdue items float to top of list (default sort).

## 10.3 SLA Violation Visualization

### SLA Violation Indicators

- Ticket/Issue with violated SLA: Status badge = 'SLA VIOLATED' (red).
- SLA timer: Shows as red countdown (e.g., 'SLA expired 2 hours ago').
- Alert on dashboard: 'X tickets with SLA violations' appears in red alert panel.

## 10.4 Payment Failure Alerts

### Payment Failure UX

- Invoice with failed payment: Status shows 'Payment Failed' (red badge). Line below shows failure reason + retry button.
- Notification sent to: Invoice owner (internal), Client (external), Finance team.
- Retry options: Update payment method + retry, or manual payment entry (if allowed).

## 10.5 Domain Expiration Alerts

### Domain/Infrastructure Alerts

- Domain expiring within 30 days: Infrastructure dashboard shows alert 'Domain [name] expires in X days'.
- Domain expired: Status shows 'EXPIRED' (red). All projects using this domain show warning banner.
- Notification: Sent to PM + Admin on day 30, day 10, day 1.

## 10.6 Notification Center Logic

### Notification Center (Bell Icon, Top Navigation)

- Dropdown list of recent notifications (last 7 days). Oldest at bottom.
- Notification item: Icon (type), title, timestamp, action link.
- Unread notifications: Bold text, light background highlight.
- Click notification: Navigate to entity + highlight relevant section.
- Mark as read: Hover to show 'X' button to dismiss.
- 'View all': Link to notification center page (full history, filtering).

---

# 11. Audit Log & Activity Timeline UX

## 11.1 Timeline Format

### Activity Timeline (Detail Page, Timeline Tab)

- **Vertical timeline**: Left spine (vertical line), events to right of spine.
- **Each event**: Icon, timestamp, action description, actor name.
- **Event icons**: Status change (badge), approval (checkmark), comment (speech bubble), file upload (document), creation (plus).
- **Chronological**: Most recent at top (reverse chronological). Timestamps in user's timezone.

## 11.2 Before/After Comparison

### Field-Level Change Display

- For data changes (e.g., status transition, value update): Timeline entry shows before/after values.
- Format: '[Field] changed from [old value] to [new value]'.
- Old value: Red strikethrough. New value: Green highlight.
- Expandable: Multiple field changes in one action grouped. Click to expand all changes.

## 11.3 Filtering Capabilities

### Timeline Filters

- **Event type**: Checkboxes for Status Changes, Comments, Approvals, File Uploads, etc.
- **Actor**: Filter by user who made the change.
- **Date range**: Select range to focus on specific period.

## 11.4 Entity-Scoped vs Global Logs

### Scope Options

- **Entity-scoped**: Timeline tab on entity detail shows only changes to that entity.
- **Global audit log**: Settings > Audit page shows all system changes (admin only). Filterable by entity type, user, date, action.

## 11.5 Visibility by Role

### Audit Log Access Control

- **Entity owner**: Can see full timeline for their entities.
- **Admins**: Can see all audit logs for all entities.
- **Other users**: Cannot access audit log for entities they don't own (except comments/activity visible to them).
- **Client**: Cannot access internal audit logs. Only see activity directly related to them (approvals, comments mentioning them).

---

# 12. Design System Foundation

## 12.1 Typography Scale

### Font Family

- **Primary**: Inter or Roboto (sans-serif, system font stack). Provides operational clarity.
- **Monospace**: Courier New or Monaco for code, IDs, amounts (improves scannability).

### Size Scale (in pixels)

| Usage | Size (px) | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| Display (Page Title) | 40 | Bold | 1.2 | -0.5px |
| Heading 1 | 32 | Bold | 1.2 | 0 |
| Heading 2 | 26 | Bold | 1.3 | 0 |
| Heading 3 | 22 | Bold | 1.4 | 0 |
| Body (Regular) | 16 | Regular | 1.5 | 0 |
| Body (Small) | 14 | Regular | 1.5 | 0 |
| Caption | 12 | Regular | 1.4 | 0.5px |
| Label (Form) | 14 | Medium | 1.5 | 0 |
| Button Text | 16 | Medium | 1.5 | 0 |

## 12.2 Spacing System (8px Grid)

### Spacing Scale

All spacing is a multiple of 8px: 0, 8, 16, 24, 32, 40, 48, 56, 64px.

- **Margin**: Space outside component. Example: 16px below heading.
- **Padding**: Space inside component. Example: 16px padding inside button.

### Common Spacing Values

- **xs**: 8px (tight spacing between related elements)
- **sm**: 16px (standard spacing between sections)
- **md**: 24px (spacing between major sections)
- **lg**: 32px (top-level spacing)

## 12.3 Color System (Updated)

The design system utilizes a semantic color strategy with dedicated Light and Dark modes to ensure optimal readability and aesthetic consistency.

### Light Mode Palette
| Semantic Role | Hex Code | Usage |
|---|---|---|
| **Background** | `#FAFAF6` | Main application background (Canvas) |
| **Surface** | `#FFFFFF` | Cards, Modals, Sidebar, Header (Clean white for contrast) |
| **Primary** | `#3D6CB9` | Primary Buttons, Active States, Key Links |
| **Secondary** | `#00D1FF` | Secondary Buttons, Accents, Highlights |
| **Accent** | `#00FFF0` | Brand moments, gradients, notification dots |
| **Text Primary** | `#212121` | Headings, Body text (High contrast) |
| **Text Secondary** | `#323232` | Captions, Placeholders, Disabled text |

### Dark Mode Palette
| Semantic Role | Hex Code | Usage |
|---|---|---|
| **Background** | `#212121` | Main application background (Deep Grey) |
| **Surface** | `#323232` | Cards, Modals, Sidebar, Inputs |
| **Primary** | `#14FFEC` | Primary Buttons, Call-to-Actions (High visibility) |
| **Secondary** | `#0D7377` | Secondary actions, muted accents |
| **Accent** | `#00D1FF` | Link hovers, focus rings (Shared with Light Secondary) |
| **Text Primary** | `#FAFAF6` | Headings, Body text (Light Cream) |
| **Text Secondary** | `#A1A1AA` | Captions, Metadata (Muted Grey) |

### Semantic Status Colors (Shared)
| Status | Color | Usage |
|---|---|---|
| **Success** | `#10B981` | Completed, Paid, Approved |
| **Warning** | `#F59E0B` | Pending, Review Needed |
| **Error** | `#EF4444` | Overdue, Rejected, Failed |
| **Info** | `#3D6CB9` | Processing, Active (Aligned with Primary) |

## 12.4 Component Library Structure

### Component Categories

- **Navigation**: Sidebar, top bar, breadcrumb
- **Forms**: Text input, dropdown, checkbox, radio, date picker, toggle
- **Buttons**: Primary, secondary, tertiary, danger, disabled
- **Data Display**: Table, card, badge, timeline, status indicator
- **Feedback**: Alert, toast, dialog, tooltip, loading
- **Layout**: Container, grid, sidebar, panel

## 12.5 Button Hierarchy

### Button Types & Usage

#### Primary Button (Blue, Solid)

- **Use**: Next workflow step (Approve, Send, Deploy, Create).
- **Size**: 40px height. Padding: 12px horizontal.
- **One primary button per action cluster.**

#### Secondary Button (Gray, Outline)

- **Use**: Alternative actions (Save as draft, Request revision).
- **Size**: 40px height. Border: 1px gray.

#### Tertiary Button (Text Only)

- **Use**: Low-priority actions (Learn more, View details, Cancel).
- **No background. Underlined text. Blue color.**

#### Danger Button (Red, Solid)

- **Use**: Destructive actions (Delete, Cancel, Reject).
- **Size**: 40px height. Grouped separately from success actions.

## 12.6 Form Validation Patterns

### Real-Time Validation

- Validate on blur (field loses focus) for least intrusive experience.
- Show error icon + message below field. Text in red.
- Example: Email field with invalid format shows: '✗ Invalid email format' in red.

### Form Submission

- Validate all fields on submit. Highlight invalid fields with red border + error message.
- Disable submit button during submission. Show loading spinner.
- On success: Show toast confirmation + navigate away or reset form.

## 12.7 Confirmation Dialog Rules

### Dialog Components

- **Title**: Clear, specific action. Example: 'Delete Invoice #INV-001?'
- **Message**: Explain consequence. 'Deleting this invoice cannot be undone. This will affect financial reports.'
- **Buttons**: Confirm (red for destructive), Cancel (gray). Confirm button is secondary focus (not auto-focused).
- **Destructive confirmation**: Require typing entity name or code to confirm (prevents accidental clicks).

## 12.8 Toast Notification Rules

### Toast Style & Behavior

- **Position**: Top-right corner. 16px from edge.
- **Size**: Max 400px wide. Single line or 2 lines max.
- **Auto-dismiss**: Success/Info toasts dismiss after 3 seconds. Warning toasts: 5 seconds. Critical: persistent (no auto-dismiss).
- **Close button**: X icon to dismiss early.
- **Stack**: Multiple toasts stack vertically with 8px gap.

## 12.9 Empty State Strategy

### Empty State Design

- **Show when**: List has zero results OR no data exists for a view.
- **Components**: Icon (large, 64px), headline, description, optional action button.
- **Example**: 'No projects yet' with icon. Description: 'Create a new project to get started.' Button: 'New Project'.
- **Centered in available space. Prominent but not alarming.**

## 12.10 Loading State Behavior

### Loading Indicators

- **Skeleton loader**: For list/table loads, show shimmer placeholder rows.
- **Spinner**: For modal dialogs, page transitions. Centered with text 'Loading...'.
- **Progress bar**: For long operations (> 2 sec). Show estimated time remaining.
- **Never**: Show progress for < 500ms (perceived as jank). Always allow cancel for > 30 sec operations.

---

# 13. Responsive & Layout Strategy

## 13.1 Desktop-First Approach

The system is designed primarily for desktop (1400px+). This is appropriate for operational systems where users spend 6+ hours in the interface daily. Mobile is secondary.

## 13.2 Sidebar Behavior

### Desktop (> 1400px)

- Sidebar always visible. Width: 280px. Content width: 100% - 280px.
- Collapse button (< >) to minimize to icons only (64px width). State persisted per user.

### Tablet (768px - 1400px)

- Sidebar hidden by default. Hamburger menu (☰) opens slide-out sidebar overlay.
- Sidebar closes on navigation.

### Mobile (< 768px)

- Sidebar not recommended. Mobile should access web via responsive site or native app. If must support mobile: Hamburger menu, full-screen overlay sidebar.

## 13.3 Collapsible Sections

### Accordion Pattern

- Related data grouped in collapsible sections. Example: Contract detail has sections for 'Parties', 'Terms', 'Pricing', 'Milestones'.
- Expand/collapse via chevron icon (> / v). One section open at a time (recommended) or allow multiple open.
- Remember user's expansion preference.

## 13.4 Multi-Tab Usability

### Tab Navigation

- Tabs (Overview, Timeline, Activity, Audit) should not overflow. If > 5 tabs, use dropdown 'More tabs'.
- Active tab indicated with colored underline (blue).
- Tab content loads immediately (not lazy-loaded to avoid perceived slowness).

## 13.5 Large Data Table Handling

### Table Responsiveness

- **On small screens**: Prioritize essential columns. Hide secondary columns behind 'Show more' expandable rows.
- **Horizontal scroll**: Allow if necessary, but with sticky first column (name/ID).
- **Card layout**: On tablets, consider switching to card layout instead of table for readability.

---

# 14. Scalability & Phase 2 Readiness

## 14.1 Modular Navigation Architecture

The sidebar navigation structure is designed to expand without restructuring. New modules (Security, Backup, Integration) will be added as additional domain groups without disrupting existing navigation.

### Future Module: Security Management

- **Navigation path**: Settings > Security
- **Interface**: User roles & permissions matrix, password policies, 2FA configuration, audit logs.

### Future Module: Backup & Recovery

- **Navigation path**: Settings > Backup
- **Interface**: Schedule configuration, backup history timeline, restore options.

### Future Module: Integration Management

- **Navigation path**: Settings > Integrations
- **Interface**: Third-party service connections, webhook management, sync status.

## 14.2 API Key Management Scalability

### API Key UI Pattern

- **Settings > API Keys**: List of generated keys, creation date, last used, revoke action.
- **Generate new key**: Modal with scopes (read, write), environments (dev, staging, production).
- **Key display**: Show once on creation (copyable), never again (force regenerate if lost).

## 14.3 Multi-Tenant Support

### Multi-Tenant Readiness

- **Current state**: Single-tenant (one agency = one instance).
- **Phase 2 readiness**: All entities are scoped by tenant (organization). Permission checks include tenant scope.
- **Tenant switcher**: Top-right dropdown to switch between managed tenants (if user has multiple).
- **Account hierarchy**: Parent company can manage sub-organizations (visually separated).

## 14.4 Multi-Currency Support

### Currency Architecture

- **Current**: USD assumed throughout.
- **Phase 2**: All amounts display with currency symbol (e.g., '$1,234', '€500'). Settings configure base currency + conversion rates.
- **Invoice detail**: Shows invoice currency explicitly. Multi-currency invoices show line-item currency + base conversion.
- **Reporting**: Dashboard metrics allow currency filter or show in reporting currency.

## 14.5 Report Builder Framework

### Extensible Reporting

- **Current**: Predefined dashboards and KPIs.
- **Phase 2**: Report builder allows users to create custom reports. Drag-and-drop metrics, filters, grouping.
- **Saved reports**: Store custom reports, schedule email delivery.

## 14.6 Workflow Automation Framework

### Automation Engine (Future)

- **Current**: Manual state transitions.
- **Phase 2**: Rules engine to trigger actions on state change. Example: 'When contract signed, auto-create first milestone' or 'When invoice 30 days overdue, send escalation email'.
- **UI**: Settings > Automation Rules. Rule builder: If [condition], then [action].

## 14.7 Design System Extensibility

### Component Library Growth

- All components (buttons, forms, tables, modals) are versioned. Phase 2 may introduce new component variants without breaking existing usage.
- **Dark mode**: Color system designed to support dark mode (all colors have dark equivalents pre-defined).
- **Localization**: All text strings externalized for multi-language support.

---

## 15. Design System & Implementation Specs

### 15.1. Tech Stack & Libraries
- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS v3.4+
- **Component Primitives**: Radix UI (Headless accessibility)
- **Component Library**: shadcn/ui (Customizable, copy-paste components)
- **Icons**: Lucide React
- **Animation**: Framer Motion (for micro-interactions)
- **Fonts**: Inter (Sans-serif) for UI, JetBrains Mono for code blocks.

### 15.2. Color Palette (Semantic Tokens)
Using CSS variables for theme switching (Light/Dark mode).

| Token | Light Mode (Hex) | Dark Mode (Hex) | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `#ffffff` | `#09090b` | Page background |
| `--foreground` | `#020817` | `#f8fafc` | Default text |
| `--primary` | `#0f172a` | `#f8fafc` | Primary actions, active states |
| `--primary-foreground` | `#f8fafc` | `#020817` | Text on primary |
| `--secondary` | `#f1f5f9` | `#1e293b` | Secondary actions, backgrounds |
| `--destructive` | `#ef4444` | `#7f1d1d` | Delete, Critical errors |
| `--muted` | `#f1f5f9` | `#1e293b` | Disabled states, placeholders |
| `--accent` | `#f1f5f9` | `#1e293b` | Hover effects, accents |

### 15.3. Typography Scale
| Class | Size | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `text-4xl` | 2.25rem | 2.5rem | 800 | Marketing Headings |
| `text-3xl` | 1.875rem | 2.25rem | 700 | Page Titles (h1) |
| `text-2xl` | 1.5rem | 2rem | 600 | Section Headers (h2) |
| `text-xl` | 1.25rem | 1.75rem | 600 | Card Titles (h3) |
| `text-base` | 1rem | 1.5rem | 400/500 | Body text |
| `text-sm` | 0.875rem | 1.25rem | 400 | Metadata, captions |
| `text-xs` | 0.75rem | 1rem | 400 | Labels, badges |

### 15.4. Spacing System
Based on Tailwind's 4px grid.
- **Container Padding**: `p-4 md:p-6 lg:p-8`
- **Component Gap**: `gap-4` (Standard), `gap-2` (Tight), `gap-8` (Section)
- **Section Margin**: `my-8`

### 15.5. Accessibility (A11y) Standards
- **Compliance**: WCAG 2.1 AA Level.
- **Focus Management**: All interactive elements must have visible `:focus-visible` rings.
- **Keyboard Nav**: Full keyboard support (Tab, Enter, Space, Arrows) for all components.
- **Screen Readers**:
  - `aria-label` for icon-only buttons.
  - `aria-expanded` for accordions/dropdowns.
  - `role="status"` for live updates (toasts).
- **Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text/graphics.

### 15.6. Responsive Breakpoints
- **Mobile (sm)**: `< 640px` (Stack layout, hamburger menu, full-width modals)
- **Tablet (md)**: `640px - 1024px` (2-col grids, simplified tables)
- **Desktop (lg)**: `1024px - 1280px` (Sidebar visible, complex tables)
- **Wide (xl)**: `> 1280px` (Max-width containers, 4-col grids)

### 15.7. Micro-Interactions
- **Hover**: Subtle background shift (`bg-accent`) or scale (`scale-105`) for cards.
- **Active**: Button press depth (`scale-95`).
- **Loading**: Skeletons for initial load, Spinners for action states.
- **Transitions**: `duration-200 ease-in-out` for most UI changes.

---

## 16. Wireframe Concepts (Visual)

### 16.1. Dashboard (Admin)

```mermaid
mockup
    title "Admin Dashboard - Overview"
    h1 "Dashboard"
    
    input "Search..."
    
    user "Admin User"
    
    row
        col
            text "Revenue YTD"
            h2 "$125,000"
            text "+12% vs last month"
        col
            text "Active Projects"
            h2 "8"
            text "2 due this week"
        col
            text "Pending Invoices"
            h2 "$12,450"
            text "3 overdue"
    
    row
        col
            h3 "Recent Activity"
            text "New Inquiry: PT. Maju Mundur (Web Dev)"
            text "Invoice #INV-2024-001 Paid"
            text "Milestone 'Design Phase' Approved"
            text "Ticket #TKT-992 Created by Client A"
        col
            h3 "Quick Actions"
            button "New Invoice"
            button "Create Project"
            button "Add Client"
```

### 16.2. Kanban Board (Project Management)

```mermaid
mockup
    title "Project: Website Redesign - Kanban Board"
    
    dropdown "Filter: All Tasks"
    button "New Task"
    
    row
        col
            h3 "Backlog (5)"
            text "Setup Analytics"
            text "Privacy Policy Page"
        col
            h3 "To Do (3)"
            text "Homepage Hero Section"
            text "Contact Form Integration"
        col
            h3 "In Progress (2)"
            text "About Us Page (Dev)"
            text "Mobile Menu (Design)"
        col
            h3 "Review (1)"
            text "Footer Implementation"
        col
            h3 "Done (12)"
            text "Setup Repo"
            text "Deploy Staging"
```

### 16.3. Client Portal (Home)

```mermaid
mockup
    title "Client Portal - Welcome"
    
    h1 "Welcome back, John Doe"
    
    row
        col
            h3 "Active Project: Corporate Website"
            text "Status: In Progress (65%)"
            text "Next Milestone: Frontend Development (Due: Feb 28)"
            button "View Project Details"
    
    row
        col
            h3 "Recent Invoices"
            text "INV-002 - $2,500 - UNPAID (Due Tomorrow)"
            text "INV-001 - $1,000 - PAID"
            button "Pay Now"
    
    button "Get Support"
```

### 16.4. Component Interaction States

#### Button States
- **Default**: `bg-primary text-primary-foreground hover:bg-primary/90`
- **Loading**: `disabled opacity-50 cursor-not-allowed` + Spinner
- **Disabled**: `bg-muted text-muted-foreground`

#### Input Field States
- **Default**: `border-input bg-background`
- **Focus**: `ring-2 ring-ring ring-offset-2`
- **Error**: `border-destructive text-destructive focus:ring-destructive`
- **Success**: `border-green-500` (Phase 2)

---

## 17. Interactive Prototypes & Handoff

### 17.1. Prototype Strategy
- **Figma**: High-fidelity interactive prototypes will be maintained in Figma.
- **Storybook**: Component-level isolation for developing and testing interaction states (hover, focus, loading, error).
- **Preview Deployments**: Vercel/Netlify previews for every Pull Request to validate responsive behavior on real devices.

### 17.2. Developer Handoff
- **Design Tokens**: All colors, typography, and spacing exported as JSON/CSS variables.
- **Assets**: SVG icons and optimized images exported to `/public/assets`.
- **Specs**:
  - **Grid**: 12-column grid system.
  - **Spacing**: 4px baseline grid.
  - **Transitions**: 200ms ease-in-out default.

---

## Appendix: Implementation Checklist

This documentation serves as the definitive specification for UI/UX design. The following checklist ensures design handoff completeness:

- [ ] Design system file created (Figma): All colors, typography, spacing, components.
- [ ] Component library built: Button, form inputs, tables, modals, alerts (all variants).
- [ ] Page templates: List, Detail, Edit, Create (for each major entity type).
- [ ] Workflow state diagrams: Visual representation of valid state transitions for each lifecycle.
- [ ] Responsive breakpoint tests: Desktop, tablet, mobile previews.
- [ ] Interaction specification: Click paths, form submission, error states.
- [ ] Accessibility audit: Color contrast, keyboard navigation, screen reader support.
- [ ] Developer handoff: HTML/CSS starter files, style documentation, API contract.

---

**End of Documentation**
