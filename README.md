# SIM-PUNCHLIST — Sistem Monitoring Punch List Berbasis Web
**Kelompok 4 | Kelas 08TIDE001 | Program Studi Teknik Industri — Universitas Pamulang (2026)**

## Cara Upload & Jalankan di GitHub Pages (Akses Online Lintas Jaringan)
1. Buat repository baru di GitHub (misalnya: `sim-punchlist`).
2. Ekstrak file ZIP ini dan upload file `index.html` serta `README.md` ke repository tersebut.
3. Buka menu **Settings** > **Pages** di repository GitHub Anda.
4. Pada bagian **Build and deployment** > **Branch**, pilih `main` (folder `/root`), lalu klik **Save**.
5. Tunggu 1–2 menit hingga muncul tautan publik `https://<username>.github.io/sim-punchlist/` yang dapat diakses dari laptop maupun HP dengan jaringan internet berbeda.

## Cara Mengaktifkan Sinkronisasi Real-Time Lintas Perangkat (Firebase)
1. Buka [Firebase Console](https://console.firebase.google.com/) dan buat **Realtime Database** (mode *Test Mode* atau aturan `.read: true, .write: true`).
2. Salin URL Database Anda (contoh: `https://sim-punchlist-default-rtdb.firebaseio.com`).
3. Login ke aplikasi SIM-PUNCHLIST, klik tombol **Koneksi Cloud (Firebase)** di pojok kanan atas, tempel URL tersebut, lalu klik **Simpan & Sinkronkan**.
4. Setiap perubahan status, upload foto, atau edit pengguna akan langsung tersinkronisasi secara *real-time* di seluruh perangkat.

## Akun Demo Bawaan
- **Manajemen Kontraktor Utama:** `manajemen@kontraktor.co.id` / `admin123`
- **PIC Lapangan (Anton):** `anton@lapangan.co.id` / `pic123`
- **PIC Lapangan (Adul):** `adul@lapangan.co.id` / `pic123`
- **PIC Lapangan (Budi):** `budi@lapangan.co.id` / `pic123`
- **PIC Lapangan (Ali):** `ali@lapangan.co.id` / `pic123`
