# SIM-PUNCHLIST — Sistem Monitoring Punch List Berbasis Web
**Capstone Design / Perancangan Sistem Terpadu — Kelompok 4 (Teknik Industri, Universitas Pamulang)**

Aplikasi web responsif untuk memantau dan mengelola penyelesaian *punch list* selama masa pemeliharaan proyek konstruksi (5 bulan), dilengkapi **Sinkronisasi Real-Time Lintas Jaringan**, **Early Warning System Otomatis**, **Validasi Foto Before–After (Poka-Yoke)**, serta **Ekspor Laporan FHO (Excel & PDF)**.

---

## Cara Deploy ke GitHub Pages & Aktifkan Real-Time Lintas Jaringan (3 Langkah)

### Langkah 1: Upload ke GitHub & Aktifkan GitHub Pages
1. Masuk ke akun [GitHub](https://github.com) Anda dan buat repository baru bernama `sim-punchlist` (pilih **Public**).
2. Klik **Add file -> Upload files**, lalu unggah seluruh file di dalam folder ini (`index.html`, `style.css`, `app.js`, `README.md`) dan klik **Commit changes**.
3. Buka menu **Settings -> Pages** di repository tersebut.
4. Pada bagian **Build and deployment -> Source**, pilih **Deploy from a branch**, pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
5. Tunggu ±1 menit hingga muncul tautan publik Anda, misalnya:
   `https://username-anda.github.io/sim-punchlist/`
   Tautan ini sudah bisa dibuka dari HP (jaringan seluler 4G/5G) maupun Laptop (WiFi berbeda).

### Langkah 2: Hubungkan Database Real-Time Gratis (Firebase) agar Sinkron Antar-Perangkat
Secara default aplikasi berjalan dalam **Mode Lokal (Demo)**. Agar perubahan dari HP Tim Lapangan (PIC) langsung muncul secara **real-time** di Laptop Manajemen pada jaringan internet yang berbeda:
1. Buka [Firebase Console](https://console.firebase.google.com/) menggunakan akun Google, lalu klik **Add project** (beri nama `sim-punchlist`).
2. Di menu kiri, pilih **Build -> Realtime Database -> Create Database**.
3. Pilih lokasi server (misal: `asia-southeast1` Singapura) dan pilih **Start in test mode** -> **Enable**.
4. Salin **Reference URL** database Anda (contoh: `https://sim-punchlist-default-rtdb.asia-southeast1.firebasedatabase.app`).
5. Buka aplikasi web Anda di GitHub Pages, klik tombol **"Pengaturan Cloud Sync"** di pojok kanan atas, tempelkan URL Firebase tersebut, lalu klik **Simpan & Hubungkan**.

### Langkah 3: Akun Uji Coba (RBAC)
* **Peran Manajemen Kontraktor Utama:** Akses penuh (Tambah temuan baru, tetapkan PIC, tinjau perbandingan foto Before–After, setujui status *Verified/Closed*, dan ekspor laporan FHO).
* **Peran Tim Pemeliharaan Lapangan (PIC):** Pilih nama PIC (misal: *Anton, Lala, Andri, Ali*, dll.), perbarui status progres (`In Progress`, `Pending`, `Completed`), dan unggah foto dokumentasi lapangan.
