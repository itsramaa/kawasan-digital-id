import { resolve } from 'path'
import { config } from 'dotenv'
config({ path: resolve(process.cwd(), '.env.local') })

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding dummy data...')

  // ── Service Templates ──────────────────────────────────────────
  const templateDefs = [
    { id: 'dummy-tpl-1', name: 'Landing Page Bisnis', description: 'Landing page modern untuk bisnis dengan konversi tinggi. Dilengkapi hero section, testimoni, dan CTA.', category: 'Landing Page', basePrice: 1500000, estimatedDays: 7, isFeatured: true, features: ['Hero Section', 'Testimoni', 'Contact Form', 'Mobile Responsive'] },
    { id: 'dummy-tpl-2', name: 'Toko Online UMKM', description: 'Website toko online lengkap untuk UMKM. Katalog produk, keranjang belanja, dan integrasi WhatsApp.', category: 'Ecommerce', basePrice: 3500000, estimatedDays: 14, isFeatured: true, features: ['Katalog Produk', 'Keranjang Belanja', 'WhatsApp Order', 'Admin Panel'] },
    { id: 'dummy-tpl-3', name: 'Company Profile Profesional', description: 'Website company profile elegan untuk perusahaan. Tampilkan layanan, tim, dan portofolio.', category: 'Company Profile', basePrice: 2500000, estimatedDays: 10, isFeatured: true, features: ['About Us', 'Services', 'Portfolio', 'Team Section', 'Contact'] },
    { id: 'dummy-tpl-4', name: 'Portfolio Freelancer', description: 'Website portfolio minimalis untuk freelancer dan kreator. Showcase karya terbaik Anda.', category: 'Portfolio', basePrice: 1200000, estimatedDays: 5, isFeatured: false, features: ['Portfolio Grid', 'About', 'Contact Form', 'Dark Mode'] },
    { id: 'dummy-tpl-5', name: 'Blog Personal', description: 'Platform blog personal dengan CMS sederhana. Tulis dan publish artikel dengan mudah.', category: 'Blog', basePrice: 800000, estimatedDays: 5, isFeatured: false, features: ['CMS Blog', 'Kategori', 'Search', 'RSS Feed'] },
    { id: 'dummy-tpl-6', name: 'Warung Digital UMKM', description: 'Website sederhana untuk warung dan usaha kecil. Menu digital, info lokasi, dan order online.', category: 'UMKM', basePrice: 900000, estimatedDays: 5, isFeatured: false, features: ['Menu Digital', 'Maps Embed', 'WhatsApp Order', 'Gallery'] },
  ]
  for (const tpl of templateDefs) {
    const { features, ...data } = tpl
    const created = await prisma.serviceTemplate.upsert({
      where: { id: data.id },
      update: {},
      create: { ...data, isActive: true, galleryImages: [] },
    })
    // upsert each feature
    for (let i = 0; i < features.length; i++) {
      await prisma.templateFeature.upsert({
        where: { id: `${data.id}-feat-${i}` },
        update: {},
        create: {
          id: `${data.id}-feat-${i}`,
          templateId: created.id,
          name: features[i],
          isIncluded: true,
          price: 0,
        },
      })
    }
  }
  console.log(`✅ ${templateDefs.length} service templates + features`)

  // ── Testimonials ───────────────────────────────────────────────
  const testimonialsData = [
    { clientName: 'Budi Santoso', clientCompany: 'CV Maju Jaya', rating: 5, content: 'Hasilnya melebihi ekspektasi! Website bisnis kami jadi jauh lebih profesional dan sudah banyak klien yang terkesan.' },
    { clientName: 'Siti Rahayu', clientCompany: 'Toko Kue Siti', rating: 5, content: 'Proses pengerjaan cepat dan responsif. Toko online saya sekarang sudah bisa terima order 24 jam!' },
    { clientName: 'Ahmad Fauzi', clientCompany: 'PT Berkah Digital', rating: 5, content: 'Tim Kawasan Digital sangat profesional. Company profile kami sekarang tampak jauh lebih kredibel.' },
    { clientName: 'Dewi Kusuma', clientCompany: null, rating: 4, content: 'Portfolio website saya jadi lebih rapi dan mudah di-update. Sangat puas dengan hasilnya!' },
    { clientName: 'Rizky Pratama', clientCompany: 'Warung Kopi Rizky', rating: 5, content: 'Sekarang pelanggan bisa lihat menu dan order lewat website. Omzet naik 30% sejak pakai layanan ini.' },
  ]
  for (const t of testimonialsData) {
    await prisma.testimonial.upsert({
      where: { id: `dummy-testimonial-${t.clientName.replace(/\s/g, '-').toLowerCase()}` },
      update: {},
      create: {
        id: `dummy-testimonial-${t.clientName.replace(/\s/g, '-').toLowerCase()}`,
        clientName: t.clientName,
        clientCompany: t.clientCompany,
        rating: t.rating,
        content: t.content,
        isPublished: true,
      },
    })
  }
  console.log(`✅ ${testimonialsData.length} testimonials`)

  // ── FAQs ────────────────────────────────────────────────────────
  const faqsData = [
    { question: 'Berapa lama pengerjaan website?', answer: 'Tergantung paket yang dipilih. Landing page 5-7 hari, website toko online 14 hari, dan custom project bisa 30-60 hari.', category: 'Umum' },
    { question: 'Apakah ada garansi revisi?', answer: 'Ya, setiap paket sudah termasuk 3x revisi gratis. Revisi tambahan dikenakan biaya sesuai scope perubahan.', category: 'Umum' },
    { question: 'Metode pembayaran apa yang diterima?', answer: 'Kami menerima transfer bank (BCA, Mandiri, BNI), QRIS, dan OVO/GoPay. Pembayaran dilakukan 50% di awal, 50% setelah selesai.', category: 'Pembayaran' },
    { question: 'Apakah harga sudah termasuk hosting?', answer: 'Harga paket belum termasuk hosting dan domain. Kami bisa bantu setup hosting dengan biaya tambahan mulai dari Rp 300.000/tahun.', category: 'Pembayaran' },
    { question: 'Teknologi apa yang digunakan?', answer: 'Kami menggunakan Next.js, React, dan PostgreSQL untuk website modern. WordPress untuk klien yang butuh CMS sederhana.', category: 'Teknis' },
    { question: 'Apakah website mobile-friendly?', answer: 'Ya, semua website yang kami buat sudah responsive dan dioptimasi untuk tampilan mobile dan tablet.', category: 'Teknis' },
  ]
  for (let i = 0; i < faqsData.length; i++) {
    const f = faqsData[i]
    await prisma.storeFaq.upsert({
      where: { id: `dummy-faq-${i + 1}` },
      update: {},
      create: {
        id: `dummy-faq-${i + 1}`,
        question: f.question,
        answer: f.answer,
        category: f.category,
        displayOrder: i,
        isPublished: true,
      },
    })
  }
  console.log(`✅ ${faqsData.length} FAQs`)

  // ── Clients ────────────────────────────────────────────────────
  const client1 = await prisma.client.upsert({
    where: { id: 'dummy-client-1' },
    update: {},
    create: {
      id: 'dummy-client-1',
      name: 'Budi Santoso',
      companyName: 'CV Maju Jaya',
      email: 'budi@majujaya.co.id',
      phone: '081234567890',
      industry: 'Perdagangan',
      status: 'Active',
    },
  })
  const client2 = await prisma.client.upsert({
    where: { id: 'dummy-client-2' },
    update: {},
    create: {
      id: 'dummy-client-2',
      name: 'Siti Rahayu',
      companyName: 'Toko Kue Siti',
      email: 'siti@tokokuesiiti.com',
      phone: '082345678901',
      industry: 'Kuliner',
      status: 'Active',
    },
  })
  console.log('✅ 2 clients')

  // ── Staff Users ────────────────────────────────────────────────
  const pwHash = await bcrypt.hash('Staff2026!', 10)
  await prisma.user.upsert({
    where: { email: 'sales@kawasandigital.com' },
    update: {},
    create: {
      email: 'sales@kawasandigital.com',
      name: 'Ahmad Sales',
      passwordHash: pwHash,
      role: 'sales',
      isActive: true,
    },
  })
  await prisma.user.upsert({
    where: { email: 'dev@kawasandigital.com' },
    update: {},
    create: {
      email: 'dev@kawasandigital.com',
      name: 'Rizky Developer',
      passwordHash: pwHash,
      role: 'developer',
      isActive: true,
    },
  })
  // Client user linked to client1
  const clientPwHash = await bcrypt.hash('Client2026!', 10)
  await prisma.user.upsert({
    where: { email: 'budi@majujaya.co.id' },
    update: {},
    create: {
      email: 'budi@majujaya.co.id',
      name: 'Budi Santoso',
      passwordHash: clientPwHash,
      role: 'client_admin',
      isActive: true,
      clientId: client1.id,
    },
  })
  console.log('✅ 3 staff/client users')

  // ── Inquiry ────────────────────────────────────────────────────
  const inquiry1 = await prisma.inquiry.upsert({
    where: { id: 'dummy-inquiry-1' },
    update: {},
    create: {
      id: 'dummy-inquiry-1',
      clientId: client1.id,
      title: 'Pembuatan Website Toko Online',
      description: 'Butuh website toko online untuk jualan produk kerajinan tangan.',
      budgetEstimate: 3500000,
      status: 'Won',
    },
  })
  await prisma.inquiry.upsert({
    where: { id: 'dummy-inquiry-2' },
    update: {},
    create: {
      id: 'dummy-inquiry-2',
      clientId: client2.id,
      title: 'Landing Page Promosi Kue',
      description: 'Perlu landing page untuk promosi kue lebaran.',
      budgetEstimate: 1500000,
      status: 'New',
    },
  })
  console.log('✅ 2 inquiries')

  // ── Contract ───────────────────────────────────────────────────
  const contract1 = await prisma.contract.upsert({
    where: { id: 'dummy-contract-1' },
    update: {},
    create: {
      id: 'dummy-contract-1',
      clientId: client1.id,
      title: 'Kontrak Pembuatan Toko Online CV Maju Jaya',
      status: 'Active',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-07-01'),
      totalValue: 3500000,
      signedAt: new Date('2026-05-28'),
    },
  })
  console.log('✅ 1 contract')

  // ── Project ────────────────────────────────────────────────────
  const project1 = await prisma.project.upsert({
    where: { id: 'dummy-project-1' },
    update: {},
    create: {
      id: 'dummy-project-1',
      clientId: client1.id,
      contractId: contract1.id,
      name: 'Toko Online CV Maju Jaya',
      status: 'In_Progress',
      progress: 65,
      deadline: new Date('2026-07-30'),
    },
  })
  // Tasks
  const tasksData = [
    { title: 'Setup environment & repo', status: 'Done', priority: 'High' },
    { title: 'Desain UI mockup', status: 'Done', priority: 'High' },
    { title: 'Implementasi halaman produk', status: 'In_Progress', priority: 'High' },
    { title: 'Integrasi WhatsApp order', status: 'To_Do', priority: 'Medium' },
    { title: 'Testing & QA', status: 'To_Do', priority: 'Medium' },
    { title: 'Deploy ke hosting', status: 'To_Do', priority: 'Low' },
  ]
  for (let i = 0; i < tasksData.length; i++) {
    const t = tasksData[i]
    await prisma.task.upsert({
      where: { id: `dummy-task-${i + 1}` },
      update: {},
      create: {
        id: `dummy-task-${i + 1}`,
        projectId: project1.id,
        title: t.title,
        status: t.status as any,
        priority: t.priority as any,
        isClientVisible: true,
      },
    })
  }
  console.log('✅ 1 project + 6 tasks')

  // ── Invoice ────────────────────────────────────────────────────
  await prisma.invoice.upsert({
    where: { id: 'dummy-invoice-1' },
    update: {},
    create: {
      id: 'dummy-invoice-1',
      invoiceNumber: 'INV-2026-001',
      clientId: client1.id,
      projectId: project1.id,
      amount: 1750000,
      status: 'Paid',
      dueDate: new Date('2026-06-07'),
      paidAt: new Date('2026-06-05'),
    },
  })
  await prisma.invoice.upsert({
    where: { id: 'dummy-invoice-2' },
    update: {},
    create: {
      id: 'dummy-invoice-2',
      invoiceNumber: 'INV-2026-002',
      clientId: client1.id,
      projectId: project1.id,
      amount: 1750000,
      status: 'Sent',
      dueDate: new Date('2026-07-31'),
    },
  })
  console.log('✅ 2 invoices')

  // ── Support Tickets ────────────────────────────────────────────
  await prisma.supportTicket.upsert({
    where: { id: 'dummy-ticket-1' },
    update: {},
    create: {
      id: 'dummy-ticket-1',
      ticketNumber: 'TKT-2026-001',
      clientId: client1.id,
      projectId: project1.id,
      subject: 'Gambar produk tidak tampil di mobile',
      description: 'Saat dibuka di HP, gambar produk tidak muncul. Di laptop normal.',
      priority: 'High',
      status: 'Open',
    },
  })
  await prisma.supportTicket.upsert({
    where: { id: 'dummy-ticket-2' },
    update: {},
    create: {
      id: 'dummy-ticket-2',
      ticketNumber: 'TKT-2026-002',
      clientId: client1.id,
      subject: 'Pertanyaan tentang tambah fitur payment gateway',
      description: 'Apakah bisa tambah integrasi Midtrans untuk pembayaran online?',
      priority: 'Medium',
      status: 'In_Progress',
    },
  })
  await prisma.supportTicket.upsert({
    where: { id: 'dummy-ticket-3' },
    update: {},
    create: {
      id: 'dummy-ticket-3',
      ticketNumber: 'TKT-2026-003',
      clientId: client2.id,
      subject: 'Request perubahan warna tombol',
      description: 'Minta warna tombol CTA diganti ke hijau sesuai branding baru.',
      priority: 'Low',
      status: 'Open',
    },
  })
  console.log('✅ 3 support tickets')

  // ── Domain & Hosting ───────────────────────────────────────────
  await prisma.domain.upsert({
    where: { id: 'dummy-domain-1' },
    update: {},
    create: {
      id: 'dummy-domain-1',
      clientId: client1.id,
      domainName: 'majujaya.co.id',
      registrar: 'Niagahoster',
      expiryDate: new Date('2027-06-01'),
      autoRenew: true,
      status: 'Active',
    },
  })
  await prisma.hosting.upsert({
    where: { id: 'dummy-hosting-1' },
    update: {},
    create: {
      id: 'dummy-hosting-1',
      clientId: client1.id,
      name: 'Hosting Maju Jaya',
      provider: 'Vercel',
      serverType: 'Cloud',
      expiryDate: new Date('2027-06-01'),
      status: 'Active',
    },
  })
  console.log('✅ 1 domain + 1 hosting')

  console.log('\n🎉 Dummy seed selesai!')
  console.log('\n📋 Test accounts:')
  console.log('   Admin    : admin@kawasandigital.com / KawasanAdmin2026!')
  console.log('   Sales    : sales@kawasandigital.com / Staff2026!')
  console.log('   Developer: dev@kawasandigital.com   / Staff2026!')
  console.log('   Client   : budi@majujaya.co.id      / Client2026!')
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
