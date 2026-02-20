# Domain State Machines & Workflows

## 1. Overview
This document visualizes the core business logic and lifecycle states for the Agency Internal System. These state machines must be strictly enforced by the Backend Service Layer and reflected in the Frontend UI.

## 2. Sales Lifecycle (Inquiry to Contract)

The sales process moves from an initial Inquiry to a signed Contract.

```mermaid
stateDiagram-v2
    [*] --> New: Inquiry Received
    New --> Qualified: Sales Review
    New --> Spam: Mark as Spam
    
    Qualified --> QuotationDraft: Create Quote
    Qualified --> Lost: Client Not Interested
    
    QuotationDraft --> QuotationSent: Send to Client
    QuotationSent --> QuotationAccepted: Client Approves
    QuotationSent --> QuotationRejected: Client Rejects
    QuotationSent --> QuotationDraft: Revise Quote
    
    QuotationAccepted --> ProposalDraft: Create Proposal
    ProposalDraft --> ProposalSent: Send to Client
    
    ProposalSent --> ContractGenerated: Generate Contract
    ContractGenerated --> ContractSent: Send for Signature
    
    ContractSent --> ContractSigned: Client Signs
    ContractSent --> ContractExpired: Validity Period Ends
    
    ContractSigned --> ProjectCreated: System Trigger
    ProjectCreated --> [*]
```

## 3. Project Lifecycle

Projects track the delivery of work defined in the Contract.

```mermaid
stateDiagram-v2
    [*] --> Planned: Contract Signed
    Planned --> Active: Kickoff Meeting
    
    state Active {
        [*] --> Milestone1
        Milestone1 --> Milestone2: Complete & Approve
        Milestone2 --> Milestone3
    }
    
    Active --> OnHold: Client Delay / Payment Issue
    OnHold --> Active: Issue Resolved
    
    Active --> Completed: All Milestones Approved
    Completed --> Warranty: 30-Day Support Period
    Warranty --> Archived: Project Closed
    
    Active --> Cancelled: Contract Terminated
    Cancelled --> [*]
    Archived --> [*]
```

## 4. Invoice Lifecycle

Invoices manage the financial realization of the project.

```mermaid
stateDiagram-v2
    [*] --> Draft: Milestone Approved
    Draft --> Generated: Finalize Invoice
    
    Generated --> Sent: Email to Client
    Sent --> Viewed: Client Opens Link
    
    Sent --> Paid: Payment Verified (Gateway/Manual)
    Sent --> Overdue: Due Date Passed
    Overdue --> Paid: Late Payment
    
    Paid --> [*]
    
    Sent --> Void: Admin Cancellation
    Overdue --> BadDebt: Write-off (> 90 days)
```

## 5. Support Ticket Lifecycle

Support tickets handle post-launch issues and requests.

```mermaid
stateDiagram-v2
    [*] --> Open: Client Submits Ticket
    
    Open --> Triage: Support Staff Reviews
    Triage --> InProgress: Assigned to Dev
    Triage --> PendingClient: Need More Info
    
    PendingClient --> Triage: Client Responds
    PendingClient --> Closed: No Response (7 days)
    
    InProgress --> Resolved: Fix Deployed
    Resolved --> Closed: Client Confirms / Auto-close (48h)
    
    Resolved --> InProgress: Issue Reoccurred
    
    Open --> Escalated: SLA Breach
    InProgress --> Escalated: SLA Breach
```

## 6. Milestone & Task Workflow

Granular tracking of work within a project.

```mermaid
stateDiagram-v2
    [*] --> ToDo: Created
    ToDo --> InProgress: Dev Starts Work
    
    InProgress --> Review: Dev Submits PR/Design
    Review --> Revision: PM/Client Requests Changes
    Revision --> InProgress: Rework
    
    Review --> Approved: PM/Client Accepts
    Approved --> [*]
```
