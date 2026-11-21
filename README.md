# SIM-PUNCHLIST — Sistem Monitoring Punch List Berbasis Web

**Capstone Design Kelompok 4 (08TIDE001 / 2023 / GANJIL)**  
Program Studi Teknik Industri, Fakultas Teknik, Universitas Pamulang (2026)

## Struktur File
- `index.html` — Struktur halaman utama (dimulai dari halaman Login RBAC, Dashboard Monitoring, Data Punch List, Early Warning System, Laporan Bergambar FHO, Kelola Pengguna, dan Konfigurasi Real-Time).
- `style.css` — Desain antarmuka responsif (Desktop & Mobile) serta stylesheet cetak `@media print` untuk PDF Laporan Bergambar.
- `app.js` — Logika aplikasi lengkap: 15 dataset studi kasus latar belakang, dokumentasi foto Before–After, validasi anti-kesalahan (*Poka-Yoke*), algoritma *Early Warning*, manajemen pengguna (*editable users*), dan sinkronisasi *real-time* Firebase RTDB.
- `database.rules.json` — Konfigurasi aturan keamanan Firebase Realtime Database.

## Cara Hosting Online di GitHub Pages (Lintas Jaringan)
1. Buat repositori baru di GitHub (misalnya `sim-punchlist`).
2. Unggah file `index.html`, `style.css`, dan `app.js` ke dalam repositori tersebut.
3. Buka **Settings → Pages**, pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
4. Untuk mengaktifkan **sinkronisasi real-time antar HP/Laptop pada jaringan internet yang berbeda**, buka Firebase Console → **Realtime Database**, tempel aturan dari `database.rules.json` ke tab **Rules**, lalu masukkan URL database Anda pada menu **Sync Online & GitHub** di dalam aplikasi.

## Akun Login Default
- **Manajemen Kontraktor Utama:** `manajemen@kontraktor.co.id` / `admin123`
- **Tim Pemeliharaan Lapangan (PIC):** `anton`, `adul`, `budi`, atau `ali` (password: `pic123`)
