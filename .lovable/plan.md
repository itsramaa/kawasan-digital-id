

# Sistem Pesan (Messaging) di Dashboard Client

## Ringkasan
Mengubah `contact_messages` menjadi backbone sistem messaging dua arah di dashboard client. Pesan dari form kontak publik masuk sebagai thread baru, dan admin bisa membalas. Client melihat semua pesan + balasan di halaman baru `/dashboard/messages` dengan tampilan inbox yang profesional.

---

## Perubahan yang Diperlukan

### 1. Database: Tabel Baru `message_replies`

Tabel balasan untuk threading pada `contact_messages`:

```text
message_replies
- id (uuid, PK)
- message_id (uuid, FK -> contact_messages.id)
- sender_type (text: 'client' | 'admin')
- sender_id (uuid, nullable -- user_id pengirim)
- body (text)
- created_at (timestamptz)
```

### 2. Database: Modifikasi `contact_messages`

Tambahkan kolom baru:
- `user_id` (uuid, nullable) -- link ke auth user jika pengirim sudah login
- `updated_at` (timestamptz, default now()) -- untuk sorting by latest activity
- `unread_count` (integer, default 0) -- jumlah balasan belum dibaca oleh client

### 3. RLS Policies

**contact_messages:**
- Client bisa SELECT pesan miliknya sendiri (WHERE user_id = auth.uid())
- Existing: Anyone can INSERT (tetap, untuk form publik)
- Client bisa UPDATE `status` dan `unread_count` pada pesan miliknya

**message_replies:**
- Client bisa SELECT balasan pada pesan miliknya
- Client bisa INSERT balasan pada pesan miliknya (sender_type = 'client')
- Internal users bisa manage semua

### 4. Update Form Kontak Publik (`ContactPage.tsx`)

- Jika user sedang login, sertakan `user_id` saat insert ke `contact_messages`
- Ini memungkinkan pesan dari form kontak muncul di dashboard client

### 5. Halaman Baru: `/dashboard/messages`

Layout inbox profesional dengan dua panel:

```text
+---------------------------+-------------------------+
| Inbox List (kiri)         | Conversation (kanan)    |
|                           |                         |
| [Search bar]              | Subject + Status        |
| [Filter: Semua/Baru/...]  | ----------------------- |
|                           | Pesan awal (bubble)     |
| > Thread 1 (unread dot)  | Balasan admin (bubble)  |
|   Thread 2               | Balasan client (bubble) |
|   Thread 3               |                         |
|                           | [Input balas + Send]    |
+---------------------------+-------------------------+
```

Fitur:
- **Inbox list**: Subject, preview pesan, tanggal, status badge, unread indicator
- **Conversation view**: Chat bubbles dua arah (client di kanan, admin di kiri)
- **Reply input**: Textarea + tombol kirim di bawah conversation
- **Search & Filter**: Cari berdasarkan subject, filter by status (new/replied/closed)
- **Empty state**: Ilustrasi + CTA "Kirim Pesan Baru" yang buka form dialog
- **Compose dialog**: Form kirim pesan baru (subject + message) dari dalam dashboard
- **Real-time**: Subscribe ke `message_replies` untuk update langsung
- **Unread badge**: Notifikasi jumlah pesan belum dibaca di navbar

### 6. Tambah "Messages" ke Navbar (`ClientLayout.tsx`)

- Tambah entry baru di `navItems`: `{ label: "Messages", path: "/dashboard/messages", icon: MessageSquare }`
- Badge kecil merah dengan angka unread di samping icon (jika ada)
- Posisi setelah "Support" atau sebelum "Support"

### 7. Route Baru (`App.tsx`)

- Tambah route: `/dashboard/messages` -> `ClientMessages`

### 8. Hook Data (`useClientMessages.ts`)

- `useClientMessages()`: Fetch semua contact_messages milik user, order by updated_at desc
- `useMessageReplies(messageId)`: Fetch semua replies untuk satu thread
- `useReplyMutation()`: Insert reply baru
- `useComposeMessage()`: Insert pesan baru dari dashboard
- `useUnreadCount()`: Count pesan dengan unread_count > 0 (untuk badge navbar)

---

## File yang Dibuat/Dimodifikasi

| File | Aksi |
|------|------|
| Database migration | Baru -- tambah kolom di `contact_messages`, buat tabel `message_replies` |
| `src/features/client/hooks/useClientMessages.ts` | Baru -- hooks data messaging |
| `src/pages/client/ClientMessages.tsx` | Baru -- halaman inbox + conversation |
| `src/pages/store/ContactPage.tsx` | Edit -- sertakan `user_id` jika login |
| `src/shared/components/layouts/ClientLayout.tsx` | Edit -- tambah Messages di navbar + badge |
| `src/App.tsx` | Edit -- tambah route `/dashboard/messages` |

---

## Detail Teknis

- Realtime subscription pada `message_replies` agar balasan admin langsung muncul tanpa refresh
- Chat bubble styling: client = `bg-primary text-primary-foreground` (kanan), admin = `bg-muted` (kiri)
- Scroll otomatis ke bawah saat ada pesan baru
- RevealCard + useScrollReveal untuk animasi masuk
- Compose dialog menggunakan pattern FormDialog yang sudah ada
- Teks UI dalam Bahasa Indonesia
- Unread badge menggunakan realtime channel untuk update count
