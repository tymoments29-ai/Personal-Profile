# Sukristiyo (Tayo) - Personal Portfolio & CMS

Selamat datang di repositori kode sumber *website* portofolio pribadi Sukristiyo. Proyek ini dibangun menggunakan **Next.js 15 (App Router)** dan dilengkapi dengan sistem manajemen konten mandiri (CMS) lengkap berbasis **Prisma** dan **Neon PostgreSQL**.

Website Live: [https://sukristiyo.my.id](https://sukristiyo.my.id)

## 📖 Dokumentasi Teknis

Semua dokumentasi teknis mendetail, termasuk Arsitektur Aplikasi dan *Product Requirements Document* (PRD), telah dirapikan ke dalam folder `docs/`.

- [PRD & Implementasi Detail](./docs/PRD%20&%20Implementasi_personal.md)

## 🚀 Fitur Utama

- **Public Frontend:** Layout asimetris responsif dengan *glassmorphism*, dark mode, dan integrasi animasi halus (Framer Motion).
- **Backend Admin (CMS):** Sistem *dashboard* tertutup dengan autentikasi (NextAuth) untuk mengelola portofolio, artikel blog, kotak masuk kontak, riwayat hidup, tautan sosial media, pengaturan web, dsb.
- **Teknologi Caching Modern:** Terintegrasi penuh dengan `revalidatePath` Next.js untuk pembaharuan data seketika tanpa kompromi performa.
- **Upload File Cloud:** Terintegrasi dengan Vercel Blob untuk penyimpanan foto profil dan aset gambar portofolio.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS + UI Components (Shadcn UI, Base UI, Framer Motion)
- **Database:** Neon PostgreSQL Serverless
- **ORM:** Prisma
- **Autentikasi:** Auth.js (NextAuth v5)
- **Penyimpanan (Storage):** Vercel Blob Storage

## 💻 Panduan Menjalankan Secara Lokal

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/sukristiyo/about-me-v1.git
   ```
2. **Install dependency:**
   ```bash
   npm install
   ```
3. **Konfigurasi Environment Variables:**
   Siapkan file `.env` di *root directory* dan lengkapi konfigurasi database serta auth:
   ```env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   AUTH_SECRET="your-secret-key"
   BLOB_READ_WRITE_TOKEN="vercel-blob-token"
   ```
4. **Jalankan Sinkronisasi Database:**
   ```bash
   npx prisma db push
   ```
5. **Mulai mode pengembangan (Development):**
   ```bash
   npm run dev
   ```
6. **Buka di browser:** Navigasi ke [http://localhost:3000](http://localhost:3000).

---
*Dikembangkan dengan semangat untuk efisiensi, performa, dan desain modern.*
