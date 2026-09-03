# GAIM Internet - Official ISP Website & Core Operations Portal

A modern, high-performance web portal and management system for **GAIM Internet** (Internet Service Provider), built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Firebase Cloud Firestore**.

---

## 📑 Daftar Isi (Table of Contents)

1. [Fitur Utama (Features)](#-fitur-utama-features)
2. [Cara Akses Panel Admin](#-cara-mengakses-panel-admin)
3. [Tech Stack & Dependensi](#️-tech-stack--dependencies)
4. [Struktur Direktori (Project Structure)](#-struktur-direktori-project-structure)
5. [Tata Cara Install & Menjalankan Lokal](#-tata-cara-instalasi--pengembangan-lokal-installation)
6. [Panduan Hosting & Deployment](#-panduan-hosting--deployment-guide)
   - [A. Vercel](#a-deploy-ke-vercel-direkomendasikan)
   - [B. Netlify](#b-deploy-ke-netlify)
   - [C. Firebase Hosting](#c-deploy-ke-firebase-hosting)
   - [D. Cloudflare Pages](#d-deploy-ke-cloudflare-pages)
   - [E. VPS Linux / Nginx Pribadi](#e-deploy-ke-vps-linux-ubuntu-debian--nginx)
   - [F. Docker Container](#f-deploy-menggunakan-docker)
7. [Konfigurasi Database & Keamanan Firestore](#-konfigurasi-database--firestore-rules)

---

## 🌟 Fitur Utama (Features)

### 🌐 1. Public Landing Page (Website Publik)
- **Hero & Speed Highlights**: Menampilkan keunggulan koneksi fiber optic 100% tanpa FUP (Fair Usage Policy) dengan latensi rendah.
- **Katalog Paket Internet**: Pilihan paket *BASIC (20 Mbps / 1-5 perangkat)*, *FAMILY (50 Mbps / 1-10 perangkat)*, hingga *PREMIUM (100 Mbps / 1-15 perangkat)* dengan rincian kecepatan dan harga transparan.
- **Pengecekan Cakupan Wilayah (Coverage Area)**: Pencarian cepat ketersediaan jaringan fiber di berbagai kelurahan/kecamatan.
- **Wizard Pendaftaran Langganan**: Formulir pendaftaran pemasangan baru langsung terhubung ke WhatsApp Admin dan tersimpan ke Cloud Firestore secara real-time.
- **FAQ & Testimoni**: Informasi lengkap dan ulasan kepuasan pelanggan setia.
- **Mode Gelap / Terang (Dark/Light Theme)**: Pengalaman visual yang nyaman dan responsif di mobile, tablet, maupun desktop.

---

### 🛡️ 2. Core Operations & Admin Dashboard (Portal Admin)
Akses khusus administrator yang tersembunyi dari navigasi umum untuk memantau dan mengelola seluruh operasional ISP:
- **Ringkasan Metrik (Overview)**: Total pendapatan bulan berjalan, estimasi tagihan, jumlah pelanggan aktif, dan status utilisasi bandwidth OLT/Core Router.
- **Kelola Pendaftaran Baru**: Verifikasi, konfirmasi tanggal survey/pemasangan teknisi, dan persetujuan pelanggan baru.
- **Database Pelanggan**: Daftar pelanggan aktif, status langganan, IP Address, perangkat ONT/Router, dan riwayat paket.
- **Tagihan & Invoice**: Pembuatan invoice otomatis/manual, status pembayaran (Lunas / Menunggu Pembayaran), dan cetak invoice.
- **Laporan Keuangan & Ekspor PDF**: Rekapitulasi pendapatan operasional dengan kemampuan cetak dan unduh laporan PDF resmi via `jsPDF`.
- **Konsol Query SQL Simulator**: Terminal interaktif untuk simulasi kueri dan inspeksi dataset pelanggan.
- **Manajemen Akun Admin (RBAC)**: Pengelolaan akun staf/administrator yang tersimpan aman di koleksi Firestore `admin_users`.

---

## 🔐 Cara Mengakses Panel Admin

Untuk menjaga keamanan, tombol pintasan admin telah disembunyikan dari header dan footer halaman publik. Administrator dapat membuka portal melalui:

1. **Hash URL (Direkomendasikan)**:
   - `/#/admin`
   - `/#/admin-panel`
   - `/#/panel-admin`

   *Contoh:* `https://domain-anda.com/#/admin`

2. **Query Parameter**:
   - `?page=admin`
   - `?view=admin`
   - `?admin=true`

   *Contoh:* `https://domain-anda.com/?page=admin`

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool & Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling Engine**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animasi UI**: [Motion](https://motion.dev/)
- **Icon Set**: [Lucide React](https://lucide.dev/)
- **Database Real-time**: [Firebase Cloud Firestore v12](https://firebase.google.com/)
- **Dokumen Generator**: [jsPDF](https://github.com/parallax/jsPDF)

---

## 📁 Struktur Direktori (Project Structure)

```text
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx   # Portal & manajemen operasional ISP
│   │   ├── Coverage.tsx         # Modul cek area jangkauan
│   │   ├── FAQ.tsx              # Pertanyaan umum seputar layanan
│   │   ├── Features.tsx         # Fitur dan keunggulan koneksi
│   │   ├── Footer.tsx           # Footer halaman utama
│   │   ├── Hero.tsx             # Banner & CTA utama
│   │   ├── Navbar.tsx           # Navigasi utama dengan theme toggle
│   │   ├── OrderModal.tsx       # Wizard form registrasi pelanggan baru
│   │   ├── Packages.tsx         # Kartu daftar paket internet
│   │   ├── Steps.tsx            # Alur pemasangan internet
│   │   └── Testimonials.tsx     # Ulasan & kepuasan pelanggan
│   ├── data.ts                  # Mock seed & data utilitas awal
│   ├── firebase.ts              # Konfigurasi & koneksi Firebase SDK
│   ├── types.ts                 # Definisi tipe TypeScript
│   ├── index.css                # Styling global Tailwind CSS
│   ├── App.tsx                  # Root component & routing handler
│   └── main.tsx                 # Application entry point
├── firebase-applet-config.json  # Kredensial Firebase SDK
├── firebase-blueprint.json      # Blueprint skema database Firestore
├── firestore.rules              # Aturan keamanan database Firestore
├── index.html                   # Entry point HTML aplikasi
├── metadata.json                # Metadata AI Studio
├── package.json                 # Daftar dependensi & npm scripts
├── tsconfig.json                # Konfigurasi TypeScript
├── vite.config.ts               # Konfigurasi Vite & Tailwind plugin
└── README.md                    # Dokumentasi proyek
```

---

## 💻 Tata Cara Instalasi & Pengembangan Lokal (Installation)

### 1. Prasyarat Sistem:
- **Node.js**: Versi `18.0.0` atau yang lebih baru ([Download Node.js](https://nodejs.org/))
- **Package Manager**: npm (bawaan Node.js), yarn, pnpm, atau bun
- **Git**: Untuk mengunduh kode sumber

### 2. Langkah-langkah Instalasi:

```bash
# 1. Clone repository ke komputer Anda
git clone <URL_REPOSITORY_ANDA>

# 2. Masuk ke folder proyek
cd <NAMA_FOLDER_PROYEK>

# 3. Install seluruh dependensi paket
npm install
```

### 3. Konfigurasi Firebase:
Pastikan file `firebase-applet-config.json` di root folder berisi konfigurasi Firebase project Anda:
```json
{
  "projectId": "YOUR_PROJECT_ID",
  "appId": "YOUR_APP_ID",
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
  "firestoreDatabaseId": "YOUR_DATABASE_ID",
  "storageBucket": "YOUR_PROJECT_ID.firebasestorage.app",
  "messagingSenderId": "YOUR_SENDER_ID"
}
```

### 4. Menjalankan Server Lokal (Development):
```bash
npm run dev
```
Buka browser Anda dan akses:
- **Halaman Publik**: `http://localhost:3000`
- **Halaman Admin**: `http://localhost:3000/#/admin`

### 5. Melakukan Build untuk Produksi:
```bash
npm run build
```
Hasil build static yang siap di-deploy akan berada di folder **`dist/`**.

---

## 🌐 Panduan Hosting & Deployment Guide

Aplikasi GAIM Internet merupakan **Single Page Application (SPA)** berbasis Vite. File hasil kompilasi statis (`dist/`) dapat di-hosting di hampir seluruh platform cloud modern.

---

### A. Deploy ke Vercel (Direkomendasikan)

1. Buat akun di [Vercel](https://vercel.com/) dan hubungkan akun GitHub/GitLab Anda.
2. Pilih **"Add New Project"** dan import repository proyek ini.
3. Vercel akan secara otomatis mendeteksi framework **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Untuk memastikan routing SPA berjalan lancar, buat file `vercel.json` (opsional jika sudah menggunakan hash route):
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
5. Klik **Deploy**. Website Anda langsung online dengan HTTPS gratis!

---

### B. Deploy ke Netlify

1. Buka [Netlify](https://www.netlify.com/) dan pilih **"Add new site" > "Import an existing project"**.
2. Hubungkan repository GitHub Anda.
3. Atur konfigurasi build:
   - **Base directory**: *(kosongkan)*
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Untuk redirect SPA di Netlify, buat file `public/_redirects` dengan isi:
   ```text
   /*    /index.html   200
   ```
5. Klik **"Deploy Site"**.

---

### C. Deploy ke Firebase Hosting

1. Pasang Firebase CLI secara global di komputer Anda:
   ```bash
   npm install -g firebase-tools
   ```
2. Login ke akun Google Firebase Anda:
   ```bash
   firebase login
   ```
3. Inisialisasi Firebase Hosting di dalam folder proyek:
   ```bash
   firebase init hosting
   ```
   - Pilih project Firebase Anda yang sesuai.
   - Saat ditanya *What do you want to use as your public directory?*, ketik: `dist`
   - Saat ditanya *Configure as a single-page app (rewrite all urls to /index.html)?*, pilih: `Yes`
   - Saat ditanya *Set up automatic builds and deploys with GitHub?*, pilih `No` (atau `Yes` jika ingin CI/CD otomatis).
4. Lakukan build lalu deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

### D. Deploy ke Cloudflare Pages

1. Masuk ke dashboard [Cloudflare Pages](https://dash.cloudflare.com/).
2. Pilih **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Pilih repository GitHub / GitLab proyek ini.
4. Pada menu pengaturan build (**Build configuration**):
   - **Framework preset**: `Vite` (atau `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: *(biarkan kosong / default)*
5. **Environment Variables** (Opsional tapi disarankan):
   - Klik tab *Environment variables* dan tambahkan:
     - `NODE_VERSION`: `20`
6. File redirect SPA `public/_redirects` sudah otomatis tersedia di dalam proyek ini sehingga seluruh navigasi halaman dan hash admin `/#/admin` akan berjalan lancar tanpa error 404.
7. Klik **Save and Deploy**.

> 💡 **Catatan Penanganan Error Bun**: Jika sebelumnya Anda menemui error `Unknown lockfile version: failed to parse lockfile: 'bun.lock'`, file `bun.lock` telah dihapus dari repositori agar Cloudflare Pages menggunakan `npm` standar (`package-lock.json`) yang kompatibel 100%.

---

### E. Deploy ke VPS Linux (Ubuntu / Debian + Nginx)

Jika Anda memiliki server VPS sendiri (DigitalOcean, Linode, AWS EC2, IDCloudHost, Niagahoster, dll.):

#### 1. Build aplikasi di komputer lokal atau di server:
```bash
npm run build
```

#### 2. Unggah folder `dist/` ke direktori web server di VPS:
```bash
scp -r dist/* user@ip-server-anda:/var/www/gaim-internet/
```

#### 3. Konfigurasi Nginx (`/etc/nginx/sites-available/gaim-internet`):
```nginx
server {
    listen 80;
    server_name gaim.co.id www.gaim.co.id; # Ganti dengan domain Anda

    root /var/www/gaim-internet;
    index index.html;

    # Kompresi Gzip untuk performa kencang
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        # Fallback ke index.html untuk Single Page Application
        try_files $uri $uri/ /index.html;
    }

    # Cache asset static (CSS, JS, Gambar, Font)
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public, max-age=15552000, immutable";
    }
}
```

#### 4. Aktifkan konfigurasi Nginx dan reload:
```bash
sudo ln -s /etc/nginx/sites-available/gaim-internet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. Pasang SSL Gratis (HTTPS) dengan Certbot Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d gaim.co.id -d www.gaim.co.id
```

---

### F. Deploy Menggunakan Docker

Anda juga dapat menjalankan aplikasi dalam Docker container.

#### 1. Buat file `Dockerfile` di root direktori:
```dockerfile
# Multi-stage build
# Stage 1: Build source code
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Konfigurasi SPA rewrite Nginx
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Build dan jalankan container Docker:
```bash
# Build image
docker build -t gaim-internet:latest .

# Jalankan container di port 80
docker run -d -p 80:80 --name gaim-web gaim-internet:latest
```

---

## 🔒 Konfigurasi Database & Firestore Rules

Aplikasi ini menggunakan Firebase Firestore untuk sinkronisasi pesanan, invoice, laporan, dan otentikasi admin. 

Pastikan aturan keamanan Firestore di `firestore.rules` sudah sesuai:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Atur permission sesuai kebutuhan produksi
    }
  }
}
```
Untuk mengunggah aturan keamanan ke Firebase:
```bash
firebase deploy --only firestore:rules
```

---

## 📄 Lisensi
Hak Cipta © 2026 **GAIM Internet**. Seluruh hak cipta dilindungi undang-undang.
