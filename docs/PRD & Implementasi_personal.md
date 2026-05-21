# Blueprint Portofolio Website & CMS — Sukristiyo (Tayo)
## Gabungan PRD, Ringkasan Struktur Data, & Dokumen Implementasi (Status: Live)

---

## 1. Product Requirements Document (PRD)

### 1.1. Ringkasan Proyek & Tujuan
Proyek ini memodernisasi (*remake*) website portofolio pribadi **Sukristiyo (Tayo)** dari sekadar *static landing page* menjadi sistem full-stack dinamis yang didukung **Content Management System (CMS)** mandiri menggunakan **Next.js 15**.

Integrasi CMS ini memastikan Sukristiyo dapat secara independen mengelola konten utamanya tanpa menyentuh kode program (no hard-coding), termasuk Riwayat Hidup (Resume), Proyek (Portfolio), Artikel (Blog), Pesan Masuk (Contact Form), dan tautan Sosial Media.

#### Tujuan Utama:
* **Modernisasi Desain:** Mengusung estetika premium (Dark Theme, Glassmorphism, Aksen Emas) lengkap dengan Sidebar dinamis dan animasi halus berbasis Framer Motion.
* **Integrasi Konten Dinamis (CMS):** Segala informasi—mulai dari teks *About Me*, sosial media, daftar keahlian, hingga portofolio—kini tersentralisasi di dalam database.
* **Otomatisasi & Kontak:** Formulir kontak langsung mengirimkan pesan pengunjung ke dashboard admin (inbox internal).
* **Skalabilitas & Performa:** Memanfaatkan arsitektur App Router terbaru dari Next.js dipadukan dengan caching (revalidatePath) untuk responsibilitas maksimal saat dideploy di Vercel.

### 1.2. Peran Pengguna (User Roles)
1. **Pengunjung Umum / Rekruter (Visitor):**
   * Menjelajahi profil profesional, riwayat karier, dan penguasaan *tech stack* Sukristiyo.
   * Menelusuri portofolio proyek dan membaca insight teknis dari artikel blog.
   * Terhubung dengan Sukristiyo melalui tautan sosial media aktif dan *Contact Form*.
2. **Administrator / Pemilik Website (Sukristiyo):**
   * Mengakses panel admin eksklusif (*dashboard CMS*) lewat sistem *secure login*.
   * Menambah, memperbarui, atau menghapus data-data utama secara visual.
   * Mengelola kontak, portofolio, serta preferensi website dasar (termasuk foto profil dan bio).

### 1.3. Struktur Arsitektur & Teknologi Utama
* **Frontend & API Layer:** Next.js 15 (App Router) + TypeScript
* **Styling & UI:** Tailwind CSS, Shadcn/ui (Radix), Framer Motion, Lucide Icons
* **Database & ORM:** Neon PostgreSQL Serverless + Prisma ORM
* **Autentikasi Admin:** NextAuth.js v5 (Auth.js)
* **Penyimpanan Media:** Vercel Blob Storage (Gambar Proyek, Foto Profil)
* **Platform Deployment:** Vercel (`sukristiyo.my.id`)

---

## 2. Matriks Struktur Data & Status API Layer

Seluruh model database (Prisma) beserta Endpoint API fungsional telah tersedia dan berstatus **✅ SELESAI (LIVE)**.

| Komponen / Model | Deskripsi Data | CRUD Terpenuhi |
| :--- | :--- | :---: |
| `User` | Autentikasi Admin via enkripsi password (NextAuth) | ✅ |
| `SiteSettings` | Info Profil Sidebar (Nama, Foto, Kontak, Bio) | ✅ |
| `SocialLink` | Link Sosmed Dinamis (Platform, URL, Icon Lucide) yang dapat diatur via tab Settings | ✅ |
| `BlogPost` | CMS Artikel Blog (Judul, Teks, Slug, Thumbnail) | ✅ |
| `PortfolioProject` | Manajemen Portofolio (Gambar, Judul, URL Repo/Live, Kategori) | ✅ |
| `ResumeEducation` | Rekam Jejak Pendidikan formal (Instansi, Gelar, Jurusan) | ✅ |
| `ResumeExperience` | Rekam Jejak Pekerjaan & Infrastruktur Teknis | ✅ |
| `Testimonial` | Kesan/Pesan Profesional (Slider/Carousel) | ✅ |
| `Service` | Jasa Layanan di Halaman About ("What I Do") | ✅ |
| `Technology` | Daftar penguasaan *Tech Stack* | ✅ |
| `ContactMessage` | Inbox pesan masuk pengunjung situs | ✅ |
| `/api/upload` | Endpoint server untuk upload berkas ke Vercel Blob | ✅ |

---

## 3. Detail Arsitektur Tampilan (Frontend & Admin Dashboard)

### 3.1. Main Website Frontend (Public Views)
Berjalan dengan skema **2-Column Layout** asimetris yang responsif:
* **Left Column (Fixed Sidebar):**
  * Foto profil dinamis dengan efek nyala (glow-gold).
  * Data diri utama, kontak dinamis (Email, Telp, Lokasi).
  * **Social Media Icons:** Sepenuhnya *dynamic*, dikumpulkan dari tabel `SocialLink`, dirender otomatis menggunakan *library* Lucide-React.
* **Right Column (Dynamic Content Area dengan Tab Navigasi):**
  * **About:** Deskripsi ringkas, grid layanan terbungkus fitur *break-words*, grid teknologi, dan testimonial slider.
  * **Resume:** Timeline interaktif.
  * **Portfolio:** Grid proyek dengan *Isotope Filtering* (All, Web Design, Applications, dll.).
  * **Blog:** Publikasi artikel dinamis.
  * **Contact:** Akses kirim pesan secara langsung ke backend admin.

### 3.2. Admin Dashboard (Admin Area)
* **Authentication:** Sistem terproteksi di bawah segmen route `/admin/login`.
* **Dashboard (`/admin/dashboard`):** Menampilkan metrik utama dari database (Overview).
* **Manajemen CRUD Halaman Penuh:**
  * **Settings:** Memperbarui identitas web, foto profil, bio teks panjang (*whitespace-pre-wrap* didukung), dan mencakup **Manajemen Social Media Links** (Tambah/Edit Logo Dinamis) pada form yang terintegrasi di akhir halaman.
  * **Portfolio, Blog, About, Resume, Testimonials:** Antarmuka lengkap untuk melakukan *Create, Read, Update, Delete* dari entitas terpisah.
  * **Messages:** Fitur untuk membaca pesan dan menghapus spam/pesan selesai.

---

## 4. Riwayat Implementasi Akhir (Selesai Sepenuhnya)

*Seluruh fase implementasi dari awal hingga tuntas:*

1. **Phase 1: Environment & Architecture Setup ✅** 
   Inisialisasi sistem berbasis Next.js 15, Prisma ORM, Neon PostgreSQL, Tailwind, dan Vercel Blob.
2. **Phase 2: Database Modeling ✅**
   Penyusunan tabel model komprehensif, dari User, Resume, Portfolio, hingga Social Links di `prisma/schema.prisma`.
3. **Phase 3: Public UI Development ✅**
   Replikasi dan penyempurnaan desain UI modern menjadi komponen React (Client & Server Components).
4. **Phase 4: CMS Admin Building ✅**
   Membangun struktur panel backend, keamanan rute (NextAuth), UI manajemen form dengan Zod, dan integrasi API REST.
5. **Phase 5: Refinement & Bug Fixes ✅**
   - Menambahkan mekanisme **Cache Invalidation** (`revalidatePath`) agar data dari admin seketika memantul (*real-time*) di tampilan depan (Public Layout).
   - Memperbaiki dukungan spasi teks dan *word-wrapping* pada kolom *About Me* dan *Services*.
   - Integrasi *dynamic render* pada **Social Media Icons** yang digabung di dalam menu *Settings*, agar admin dapat menambah icon apapun sebebas-bebasnya.
6. **Phase 6: Live Production Deployment ✅**
   - Website kini aktif (Live) menggunakan Vercel dengan sinkronisasi CI/CD otomatis (*Auto Deploy*) ke repositori GitHub. Domain `sukristiyo.my.id` sudah sepenuhnya aktif dan mengarah ke sistem baru ini.