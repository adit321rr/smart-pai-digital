# SMART PAI Digital

SMART PAI Digital adalah platform edukasi modern yang dirancang untuk mendukung transformasi digital Pendidikan Agama Islam. Aplikasi ini memfasilitasi distribusi materi pembelajaran, publikasi ilmiah, manajemen kegiatan, serta interaksi komunitas secara terpusat dan terintegrasi.

## Arsitektur Sistem

Aplikasi ini dibangun menggunakan arsitektur Full-Stack Javascript modern dengan pemisahan antara layanan sisi klien (Frontend) dan sisi server (Backend).

* **Frontend:** React.js (Vite), Tailwind CSS, React Router DOM
* **Backend:** Node.js, Express.js, Multer
* **Database:** PostgreSQL (Di-host melalui Supabase)
* **ORM:** Prisma
* **Cloud Storage:** Supabase Storage (Manajemen aset gambar dan dokumen PDF)
* **Autentikasi:** JSON Web Token (JWT) dan bcrypt untuk enkripsi kata sandi

## Fitur Utama

1. **Sistem Autentikasi dan Otorisasi**
   Manajemen akses pengguna yang aman dengan pemisahan peran antara `ADMIN` dan `MEMBER`.
2. **Koleksi E-Book dan Modul Pembelajaran**
   Distribusi materi digital dengan fitur unggah dokumen PDF dan sampul buku yang terintegrasi langsung dengan Supabase Storage.
3. **Pusat Publikasi Ilmiah**
   Direktori terstruktur untuk jurnal, artikel ilmiah, dan hasil penelitian.
4. **Manajemen Webinar**
   Sistem penjadwalan seminar daring lengkap dengan tautan pertemuan dan poster kegiatan.
5. **Tutorial dan Panduan Interaktif**
   Modul pembelajaran komprehensif berbasis video dan dokumen pendukung.
6. **Komunitas Interaktif**
   Pusat diskusi antar pengguna dan integrasi grup komunikasi (WhatsApp) melalui pemindaian QR Code.
7. **Blog dan Artikel**
   Media berbagi informasi dan tips dengan sistem interaksi kolom komentar.

## Panduan Instalasi Lokal (Local Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di komputer lokal Anda.

### Persyaratan Sistem
* Node.js (Versi 16 atau lebih baru disarankan)
* Git
* Akun Supabase (Untuk Database dan Storage)

### 1. Kloning Repositori
```bash
git clone [https://github.com/UsernameGitHubKamu/smart-pai-digital.git](https://github.com/UsernameGitHubKamu/smart-pai-digital.git)
cd smart-pai-digital

2. Konfigurasi Backend

Pindah ke direktori backend dan instal dependensi:

Bash
cd backend
npm install

Buat file .env di dalam root folder backend dan sesuaikan nilainya dengan kredensial Anda:

Cuplikan kode
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres"
JWT_SECRET="masukkan_rahasia_jwt_anda_disini"
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_KEY="[YOUR-ANON-KEY]"
Sinkronisasi skema database dan jalankan server pengembangan:

Bash
npx prisma db push
npm run dev
Server backend akan berjalan pada https://smart-pai-digital.vercel.app.

3. Konfigurasi Frontend

Buka sesi terminal baru, pindah ke direktori frontend, dan instal dependensi:

Bash
cd frontend
npm install
Jalankan server pengembangan sisi klien:

Bash
npm run dev
Aplikasi klien dapat diakses melalui http://localhost:5173.

Hak Cipta © 2026 SMART PAI Digital. Dikembangkan untuk kemajuan Pendidikan Agama Islam di era digital.


*(Catatan: Jangan lupa ubah bagian `UsernameGitHubKamu` di bagian Kloning Repositori dengan username GitHub kamu yang asli ya).*

Jika sudah di-*save*, kamu bisa langsung *commit* dan *push* ke GitHub dengan cara yang sama. Tampilannya akan langsung terlihat sangat rapi, akademis, dan meyakinkan di halaman depan repositori kamu. Beri tahu saya jika sudah terunggah, dan kita langsung masuk ke tahap *deploy* Render!