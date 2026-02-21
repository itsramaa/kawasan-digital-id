

# Insert Dummy Data untuk Semua Flow Client Portal

## Ringkasan
Insert data dummy yang lengkap ke database agar semua halaman client portal (Dashboard, Projects, Invoices, Payments, Orders, Contracts, Infrastructure, Support) menampilkan data yang realistis dan semua flow berjalan dengan baik.

---

## Masalah Saat Ini

1. **Test user (`test@gmail.com`) memiliki `client_id: null`** di tabel profiles -- artinya semua RLS policy yang menggunakan `get_user_client_id()` mengembalikan null, sehingga user tidak bisa melihat data apapun di portal client.
2. **Test user tidak punya role** di tabel `user_roles` -- beberapa fitur mungkin bergantung pada pengecekan role.
3. **Tabel `orders` kosong** -- halaman Pesanan tidak menampilkan apa-apa.
4. **Tabel `activity_logs` kosong** -- timeline aktivitas di dashboard kosong.
5. **Data payments hanya 2 record** -- kurang bervariasi.

---

## Langkah-langkah Insert Data

### 1. Update Profile Test User
Hubungkan test user ke client **PT Maju Sejahtera** (`a1b2c3d4-0001-4000-a000-000000000001`), update nama lengkap.

```sql
UPDATE profiles 
SET client_id = 'a1b2c3d4-0001-4000-a000-000000000001',
    full_name = 'Budi Santoso',
    phone = '+62-812-3456-7890'
WHERE user_id = 'e36854cb-9e1c-4b48-88b8-181700d6ae2c';
```

### 2. Insert Role untuk Test User
Tambahkan role `client_admin` agar user dikenali sebagai client.

```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('e36854cb-9e1c-4b48-88b8-181700d6ae2c', 'client_admin');
```

### 3. Insert Orders (3 pesanan)
Insert pesanan dengan berbagai status dan pembayaran, terhubung ke service templates yang sudah ada.

- Order 1: Completed + Paid (Company Profile Website)
- Order 2: In Progress + Paid (E-Commerce Starter)
- Order 3: Pending + Unpaid (Landing Page Pro)

### 4. Insert Payments Tambahan (2 record baru)
Tambah variasi payment untuk invoice yang sudah ada, dengan metode berbeda (Credit Card, Bank Transfer).

### 5. Insert Activity Logs (5-6 record)
Aktivitas terbaru untuk client PT Maju Sejahtera yang tampil di dashboard:
- Proyek baru dimulai
- Invoice dibuat
- Payment diterima
- Ticket di-submit
- Milestone disetujui

### 6. Insert Client-Visible Tasks
Update beberapa task yang sudah ada agar `is_client_visible = true`, sehingga muncul di halaman projects client.

---

## Detail Teknis

### Tabel yang Dimodifikasi (Data Only -- Tanpa Schema Change)
| Tabel | Operasi | Jumlah |
|-------|---------|--------|
| `profiles` | UPDATE | 1 record |
| `user_roles` | INSERT | 1 record |
| `orders` | INSERT | 3 records |
| `payments` | INSERT | 2 records |
| `activity_logs` | INSERT | 6 records |
| `tasks` | UPDATE | 4 records (set is_client_visible) |

### Data Sudah Cukup (Tidak Perlu Insert Lagi)
| Tabel | Status |
|-------|--------|
| `clients` | 5 records ada, PT Maju Sejahtera sebagai client utama |
| `projects` | 4 records, 2 milik PT Maju Sejahtera |
| `contracts` | 2 records milik PT Maju Sejahtera |
| `invoices` | 5 records, 3 milik PT Maju Sejahtera |
| `milestones` | 6 records, 4 di project Maju Sejahtera |
| `tasks` | 6 records, 5 di project Maju Sejahtera |
| `domains` | 5 records, 2 milik PT Maju Sejahtera |
| `hostings` | 5 records, 2 milik PT Maju Sejahtera |
| `support_tickets` | 5 records, 2 milik PT Maju Sejahtera |

### Pendekatan
- Semua insert menggunakan tool insert (bukan migration) karena ini operasi data, bukan schema change
- Tidak ada perubahan schema/struktur database
- Tidak ada perubahan kode -- hanya data
- Setelah insert, semua halaman client portal akan menampilkan data karena RLS policy sudah benar, hanya perlu `client_id` di profile

