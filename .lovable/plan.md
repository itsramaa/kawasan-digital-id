

# Maksimalisasi Client Portal Berdasarkan Docs + Skills

## Ringkasan

Refactor dan enhancement menyeluruh pada Client Portal agar sesuai dengan PRD, UI/UX Documentation, dan domain state machines. Mengikuti prinsip KISS, DRY, SOLID, dan SRP dengan memanfaatkan skills: `tailwind-patterns`, `react-patterns`, `clean-architecture`, dan `design-system-patterns`.

---

## Analisis Gap: Apa yang Ada vs Apa yang Dibutuhkan

| Fitur (dari PRD Section 2.2/5.2/7) | Status Saat Ini | Aksi |
|---|---|---|
| Dashboard: Project summary, action items, invoice/payment, recent activity | Partial (ada KPI + pie chart tapi tidak ada action items & recent activity) | Enhance |
| Projects: Milestones + client-visible tasks + progress timeline | Partial (ada milestones, belum ada client-visible tasks) | Enhance |
| Invoices: Paid/outstanding + payment history + overdue indicators | Partial (tabel basic) | Enhance |
| Support: Ticket CRUD + SLA countdown + ticket detail | Partial (ada tapi SLA visual kurang) | Enhance |
| Account: Profile + notification preferences | Partial (ada profile, tidak ada notification prefs) | Minor enhance |
| Contracts: View own contracts (PRD 6.0 row: Client = R) | Missing | Create baru |
| Payments: View own payment history (PRD 6.0 row: Client = R) | Missing | Create baru |
| Domains/Hosting: View own infra (PRD 6.0 row: Client = R) | Missing | Create baru |

---

## Rencana Implementasi

### 1. Refactor Types (SRP - Single file per concern)

Pecah `src/features/client/types/index.ts` menjadi types yang lebih jelas dan tambahkan types baru:

- `ClientContract` - untuk contracts view
- `ClientPayment` - untuk payment history
- `ClientDomain` - untuk domain info
- `ClientHosting` - untuk hosting info
- Update existing types dengan field yang lebih lengkap sesuai PRD

### 2. Buat Custom Hooks Baru (DRY - Reuse pattern)

Semua hooks mengikuti pola yang sudah ada (`useClientProjects`, dll):

- `useClientContracts` - fetch contracts via `supabase.from("contracts")`
- `useClientPayments` - fetch payments via join `invoices -> payments`
- `useClientDomains` - fetch domains
- `useClientHostings` - fetch hostings
- `useClientActivity` - recent activity aggregator (gabung dari projects, invoices, tickets terbaru)

### 3. Halaman Baru

#### 3a. ClientContracts.tsx
- Tabel kontrak aktif klien dengan kolom: Contract title, Status, Start date, End date, Total value
- StatusBadge sesuai state machine (Draft, Signed, Active, Completed, Suspended, Terminated)
- Reuse `DataTable` component (DRY)

#### 3b. ClientPayments.tsx
- History pembayaran klien dengan kolom: Invoice #, Amount, Payment date, Method, Reference
- Grouped by invoice (optional)
- Reuse `DataTable` + `KPICard` component

#### 3c. ClientInfrastructure.tsx
- Dua section: Domains + Hostings milik klien
- Domain: domain_name, status, expiry_date dengan overdue indicators (red border jika < 30 hari)
- Hosting: name, provider, status, expiry_date
- Sesuai PRD section 10.5 Domain Expiration Alerts

### 4. Enhancement Halaman Existing

#### 4a. ClientDashboard.tsx
Tambahkan:
- **Action Items widget**: Pending approvals dari milestones (status = "Submitted"), overdue invoices
- **Recent Activity timeline**: 5 event terbaru gabungan dari projects/invoices/tickets
- **Contract renewal alert**: Kontrak expiring < 60 hari
- **Domain expiry alert**: Domain expiring < 30 hari

#### 4b. ClientProjects.tsx
Tambahkan:
- **Client-visible tasks**: Tampilkan tasks dengan `is_client_visible = true` di bawah milestones
- **Timeline indicator**: Visual deadline proximity (red jika overdue)
- **Progress bar enhancement**: Warna berubah sesuai status (green jika on-track, red jika overdue)

#### 4c. ClientInvoices.tsx
Tambahkan:
- **Overdue visual treatment**: Red left border + "X days overdue" text (sesuai UI/UX doc 10.2)
- **Payment status column**: Tampilkan paid_at atau overdue days
- **Sortable columns**: Due date ascending default (overdue di atas)

#### 4d. ClientSupport.tsx
Tambahkan:
- **SLA visual indicator**: Countdown timer jika ada `sla_deadline`
- **Priority color coding**: Sesuai UI/UX doc (Critical = red pulsing badge)
- **Project selector**: Filter tickets by project saat membuat ticket baru (tambah field project_id di form)
- Refactor: Pindahkan ticket creation logic ke `useClientTicketMutation` yang sudah ada (DRY - hapus duplikasi mutation di page)

#### 4e. ClientAccount.tsx
- Minor: Tambahkan company info dari `clients` table (read-only)
- Tampilkan client company_name, industry, email

### 5. Update Navigation & Routing

#### 5a. ClientLayout.tsx
Tambahkan nav items baru:
- Contracts (`/client/contracts`)
- Payments (`/client/payments`) 
- Infrastructure (`/client/infrastructure`)

#### 5b. App.tsx
Tambahkan routes:
- `/client/contracts` -> `ClientContracts`
- `/client/payments` -> `ClientPayments`
- `/client/infrastructure` -> `ClientInfrastructure`

### 6. Shared Component Enhancement

#### 6a. EmptyState component baru
Sesuai UI/UX doc 12.9: Icon (64px) + headline + description + optional action button.
Reusable across all client pages.

#### 6b. AlertBanner component baru
Sesuai UI/UX doc 10.1: Critical (red), Warning (yellow), Info (blue).
Digunakan di Dashboard untuk overdue alerts dan domain expiry.

---

## Detail Teknis

### File Structure (sesuai project-structure.md)

```text
src/features/client/
  types/index.ts          -- Updated with new types
  hooks/
    useClientProjects.ts  -- Existing
    useClientInvoices.ts  -- Existing
    useClientTickets.ts   -- Existing (refactored)
    useClientContracts.ts -- NEW
    useClientPayments.ts  -- NEW
    useClientDomains.ts   -- NEW
    useClientHostings.ts  -- NEW
    useClientActivity.ts  -- NEW (dashboard aggregator)
    useClientProfileMutation.ts -- Existing
  components/
    EmptyState.tsx        -- NEW (reusable empty state)
    AlertBanner.tsx       -- NEW (reusable alert)
    ActivityTimeline.tsx  -- NEW (recent activity list)

src/pages/client/
  ClientDashboard.tsx     -- Enhanced
  ClientProjects.tsx      -- Enhanced
  ClientInvoices.tsx      -- Enhanced
  ClientSupport.tsx       -- Refactored (remove duplicate mutation)
  ClientAccount.tsx       -- Minor enhance
  ClientContracts.tsx     -- NEW
  ClientPayments.tsx      -- NEW
  ClientInfrastructure.tsx -- NEW
```

### Prinsip yang Diterapkan

- **KISS**: Setiap halaman baru mengikuti pola yang sudah terbukti (ClientLayout + DataTable/KPICard)
- **DRY**: Reuse DataTable, StatusBadge, KPICard, FormDialog; Hapus duplikasi mutation di ClientSupport
- **SOLID/SRP**: Setiap hook menangani satu entity. Setiap component punya satu tanggung jawab
- **Tailwind patterns skill**: Semantic colors only, mobile-first responsive, consistent spacing (4/6/8/12/16), hover states on all interactive elements
- **React patterns skill**: Custom hooks untuk logic, presentational components untuk UI, derived state tanpa useEffect

### Styling (dari tailwind-patterns rules)

- Semua warna menggunakan semantic tokens (`bg-card`, `text-primary`, `border-border`)
- Responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Interactive states: `hover:shadow-md transition-shadow`, `hover:opacity-90`
- Overdue rows: `border-l-4 border-l-status-error` (sudah ada pattern di ClientInvoices)
- Touch targets minimum 44px

