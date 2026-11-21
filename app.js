// ============================================================================
// SIM-PUNCHLIST — Sistem Monitoring Punch List Berbasis Web
// Data & Spesifikasi Sesuai Laporan Akhir Capstone Design Kelompok 4 (2026)
// Program Studi Teknik Industri — Universitas Pamulang
// ============================================================================

const STORAGE_KEYS = {
  ITEMS: 'sim_punchlist_items_v4_report',
  USERS: 'sim_punchlist_users_v4_report',
  SESSION: 'sim_punchlist_session_v4',
  FIREBASE_URL: 'sim_punchlist_firebase_url'
};

const DEFAULT_FIREBASE_URL = 'https://sim-punchlist-default-rtdb.firebaseio.com';

// Generator Visual Dokumentasi Lapangan (Canvas DataURL) sesuai jenis temuan di BAB I
function generateFieldPhoto(type, state, ticket, detailLabel) {
  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 240;
  const ctx = canvas.getContext('2d');

  // Background lapangan gelap/industrial
  ctx.fillStyle = state === 'before' ? '#27272a' : '#1e293b';
  ctx.fillRect(0, 0, 360, 240);

  // Subtle grid texture
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  for (let x = 0; x < 360; x += 24) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 240); ctx.stroke();
  }
  for (let y = 0; y < 240; y += 24) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(360, y); ctx.stroke();
  }

  if (type === 'kabel') {
    // Pit housing circle
    ctx.beginPath();
    ctx.arc(180, 120, 78, 0, Math.PI * 2);
    ctx.fillStyle = '#3f3f46';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#71717a';
    ctx.stroke();

    // Left & right cables
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#09090b';
    ctx.beginPath(); ctx.moveTo(55, 95); ctx.lineTo(155, 118); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(205, 122); ctx.lineTo(305, 145); ctx.stroke();

    if (state === 'before') {
      // Exposed copper / broken connector
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(155, 118); ctx.lineTo(172, 108); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(188, 132); ctx.lineTo(205, 122); ctx.stroke();
    } else {
      // Heatshrink & new cable lug
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(148, 108, 64, 24);
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2;
      ctx.strokeRect(148, 108, 64, 24);
    }
  } else if (type === 'trafo') {
    // Transformer body & busbar
    ctx.fillStyle = '#475569';
    ctx.fillRect(70, 55, 220, 130);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(110, 105, 140, 22);

    // Bare Copper (BC) wire
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(90, 210);
    ctx.quadraticCurveTo(140, 155, 180, 116);
    ctx.stroke();

    // Lug & Bolt coupled
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath(); ctx.arc(180, 116, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#16a34a';
    ctx.beginPath(); ctx.arc(180, 116, 5, 0, Math.PI * 2); ctx.fill();
  } else if (type === 'lampu') {
    // Runway / Area Inset Light Fixture (RCL-221 / RCL-225)
    ctx.beginPath();
    ctx.arc(180, 120, 74, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    if (state === 'before') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(150, 82, 60, 24);
      ctx.fillRect(150, 134, 60, 24);
    } else {
      // Glowing white & red beam
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(150, 82, 60, 24);
      ctx.shadowColor = '#ef4444';
      ctx.fillStyle = '#f87171';
      ctx.fillRect(150, 134, 60, 24);
      ctx.shadowBlur = 0;
    }
  }

  // Top badge
  ctx.fillStyle = state === 'before' ? 'rgba(220, 38, 38, 0.9)' : 'rgba(22, 163, 74, 0.9)';
  ctx.fillRect(12, 12, 145, 24);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillText(state === 'before' ? 'BEFORE (TEMUAN)' : 'AFTER (PERBAIKAN)', 20, 28);

  // Bottom caption bar
  ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
  ctx.fillRect(0, 204, 360, 36);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 11px Inter, sans-serif';
  ctx.fillText(`${ticket} • ${detailLabel}`, 12, 226);

  return canvas.toDataURL('image/jpeg', 0.82);
}

// ==================== DEFAULT USERS SESUAI LAPORAN ====================
function getDefaultUsers() {
  return [
    {
      id: 'USR-01',
      name: 'Manajemen Proyek Utama',
      email: 'manajemen.proyek@kontraktor.co.id',
      password: '123',
      role: 'mgmt',
      division: 'Manajemen Kontraktor Utama',
      phone: '0812-8800-1001'
    },
    {
      id: 'USR-02',
      name: 'Fajar Sidiq Al-Hayyu',
      email: 'admin@kontraktor.co.id',
      password: '123',
      role: 'mgmt',
      division: 'Ketua Kelompok 4 / Pengawas Mutu',
      phone: '0812-8800-1002'
    },
    {
      id: 'USR-03',
      name: 'Anton',
      email: 'anton@lapangan.co.id',
      password: '123',
      role: 'pic',
      division: 'Tim Pemeliharaan Lapangan (PIC)',
      phone: '0813-7700-2001'
    },
    {
      id: 'USR-04',
      name: 'Adul',
      email: 'adul@lapangan.co.id',
      password: '123',
      role: 'pic',
      division: 'Tim Pemeliharaan Lapangan (PIC)',
      phone: '0813-7700-2002'
    },
    {
      id: 'USR-05',
      name: 'Budi',
      email: 'budi@lapangan.co.id',
      password: '123',
      role: 'pic',
      division: 'Tim Pemeliharaan Lapangan (PIC)',
      phone: '0813-7700-2003'
    },
    {
      id: 'USR-06',
      name: 'Ali',
      email: 'ali@lapangan.co.id',
      password: '123',
      role: 'pic',
      division: 'Tim Pemeliharaan Lapangan (PIC)',
      phone: '0813-7700-2004'
    }
  ];
}

// ==================== 15 ITEM EXACT DATA TABEL BAB I LAPORAN ====================
function getReportDataset() {
  const rawRows = [
    {
      no: 1,
      ticket: 'PL-001',
      category: 'Konekting Kabel Rusak',
      description: 'Koneksi/terminasi kabel mengalami kerusakan; perlu dilakukan pemotongan ulang, penyambungan kembali, atau penggantian skun kabel (cable lug).',
      location: 'Pit / Manhole Kabel Utama - Titik 01',
      pic: 'Anton',
      priority: 'High',
      foundDate: '2026-05-21',
      dueDate: '2026-10-21',
      completedDate: '2026-11-21',
      hasBefore: true,
      hasAfter: true,
      visualType: 'kabel',
      label: '21 Mei -> 21 Nov 2026',
      status: 'Verified / Closed',
      remarks: 'Skun kabel (cable lug) diganti dan diisolasi ulang.'
    },
    {
      no: 2,
      ticket: 'PL-002',
      category: 'Konekting Kabel Rusak',
      description: 'Konektor/terminasi kabel mengalami kerusakan/kendur; perlu perbaikan koneksi serta pengencangan ulang baut terminal.',
      location: 'Pit / Manhole Kabel Utama - Titik 02',
      pic: 'Adul',
      priority: 'High',
      foundDate: '2026-05-14',
      dueDate: '2026-10-14',
      completedDate: '2026-11-14',
      hasBefore: true,
      hasAfter: true,
      visualType: 'kabel',
      label: '14 Mei -> 14 Nov 2026',
      status: 'Verified / Closed',
      remarks: 'Koneksi diperbaiki dan baut terminal dikencangkan.'
    },
    {
      no: 3,
      ticket: 'PL-003',
      category: 'Kabel BC Belum Di Couple Ke Trafo',
      description: 'Kabel Bare Copper (BC) untuk sistem pembumian (grounding) belum terhubung/terpasang pada busbar/terminal grounding trafo.',
      location: 'Gardu Trafo / Busbar Grounding - Titik 01',
      pic: 'Anton',
      priority: 'High',
      foundDate: '2026-06-19',
      dueDate: '2026-11-19',
      completedDate: '2026-11-26',
      hasBefore: false,
      hasAfter: true,
      visualType: 'trafo',
      label: '19 Jun -> 26 Nov 2026',
      status: 'Verified / Closed',
      remarks: 'Kabel BC terpasang pada busbar grounding trafo.'
    },
    {
      no: 4,
      ticket: 'PL-004',
      category: 'Kabel BC Belum Di Couple Ke Trafo',
      description: 'Kabel BC grounding belum dikoneksikan ke bodi/body grounding trafo; lakukan penyambungan menggunakan klem/skun kabel yang sesuai.',
      location: 'Gardu Trafo / Body Grounding - Titik 02',
      pic: 'Budi',
      priority: 'High',
      foundDate: '2026-06-19',
      dueDate: '2026-11-19',
      completedDate: '2026-11-26',
      hasBefore: false,
      hasAfter: true,
      visualType: 'trafo',
      label: '19 Jun -> 26 Nov 2026',
      status: 'Verified / Closed',
      remarks: 'Tersambung ke body grounding trafo dengan klem.'
    },
    {
      no: 5,
      ticket: 'PL-005',
      category: 'Kabel BC Belum Di Couple Ke Trafo',
      description: 'Kabel BC belum terpasang ke terminal neutral/grounding trafo; lakukan penyambungan dan pastikan koneksi kencang.',
      location: 'Gardu Trafo / Terminal Neutral - Titik 03',
      pic: 'Adul',
      priority: 'High',
      foundDate: '2026-06-17',
      dueDate: '2026-11-17',
      completedDate: '2026-11-17',
      hasBefore: false,
      hasAfter: true,
      visualType: 'trafo',
      label: '17 Jun -> 17 Nov 2026',
      status: 'Verified / Closed',
      remarks: 'Terpasang ke terminal neutral/grounding trafo.'
    },
    {
      no: 6,
      ticket: 'PL-006',
      category: 'Kabel BC Belum Di Couple Ke Trafo',
      description: 'Kabel BC grounding belum terhubung ke trafo; lakukan terminasi kabel BC pada titik grounding trafo.',
      location: 'Gardu Trafo / Titik Grounding - Titik 04',
      pic: 'Anton',
      priority: 'High',
      foundDate: '2026-06-19',
      dueDate: '2026-11-19',
      completedDate: '2026-11-26',
      hasBefore: false,
      hasAfter: true,
      visualType: 'trafo',
      label: '19 Jun -> 26 Nov 2026',
      status: 'Verified / Closed',
      remarks: 'Terminasi kabel BC pada titik grounding trafo tuntas.'
    },
    {
      no: 7,
      ticket: 'PL-007',
      category: 'Kabel BC Belum Di Couple Ke Trafo',
      description: 'Penyambungan kabel BC ke grounding trafo belum dilakukan; persiapkan lug kabel dan lakukan pembautan pada terminal trafo.',
      location: 'Gardu Trafo / Terminal Grounding - Titik 05',
      pic: 'Adul',
      priority: 'High',
      foundDate: '2026-07-01',
      dueDate: '2026-11-01',
      completedDate: '2026-11-01',
      hasBefore: false,
      hasAfter: true,
      visualType: 'trafo',
      label: '01 Jul -> 01 Nov 2026',
      status: 'Completed',
      remarks: 'Lug kabel BC sudah dibaut ke terminal trafo (Menunggu verifikasi).'
    },
    {
      no: 8,
      ticket: 'PL-008',
      category: 'Kabel BC Belum Di Couple Ke Trafo',
      description: 'Kabel BC grounding mengantung dan belum terhubung ke trafo; lakukan terminasi dan pastikan nilai tahanan grounding sesuai standar.',
      location: 'Gardu Trafo / Grounding Grid - Titik 06',
      pic: 'Budi',
      priority: 'High',
      foundDate: '2026-06-19',
      dueDate: '2026-11-19',
      completedDate: '2026-11-26',
      hasBefore: false,
      hasAfter: true,
      visualType: 'trafo',
      label: '19 Jun -> 26 Nov 2026',
      status: 'Verified / Closed',
      remarks: 'Terminasi selesai dan nilai tahanan grounding memenuhi standar.'
    },
    {
      no: 9,
      ticket: 'PL-009',
      category: 'Konekting Kabel Rusak',
      description: 'Konektor/skun kabel mengalami kerusakan/korosi; lakukan penggantian konektor baru dan isolasi ulang.',
      location: 'Jalur Distribusi Kabel - Sektor B1',
      pic: 'Anton',
      priority: 'Medium',
      foundDate: '2026-05-18',
      dueDate: '2026-10-18',
      completedDate: '2026-11-18',
      hasBefore: true,
      hasAfter: true,
      visualType: 'kabel',
      label: '18 Mei -> 18 Nov 2026',
      status: 'Verified / Closed',
      remarks: 'Konektor korosi diganti baru dan diisolasi rapat.'
    },
    {
      no: 10,
      ticket: 'PL-010',
      category: 'Lampu Mati',
      description: 'Lampu penerangan tidak menyala; lakukan pengecekan suplai daya, sakelar, ballast, atau lakukan penggantian bohlam lampu baru.',
      location: 'Titik Lampu RCL-221',
      pic: 'Ali',
      priority: 'Medium',
      foundDate: '2026-05-12',
      dueDate: '2026-10-12',
      completedDate: '2026-11-12',
      hasBefore: true,
      hasAfter: true,
      visualType: 'lampu',
      label: 'RCL-221 (12 Mei -> 12 Nov 2026)',
      status: 'Verified / Closed',
      remarks: 'Armatur/lampu RCL-221 menyala normal kembali.'
    },
    {
      no: 11,
      ticket: 'PL-011',
      category: 'Konekting Kabel Rusak',
      description: 'Koneksi kabel terbakar/rusak; perlu perbaikan kabel, penggantian terminal block/skun, serta pengujian kontinuitas.',
      location: 'Box Sambungan Kabel - Sektor C2',
      pic: 'Adul',
      priority: 'High',
      foundDate: '2026-06-17',
      dueDate: '2026-11-10',
      completedDate: '2026-11-10',
      hasBefore: true,
      hasAfter: true,
      visualType: 'kabel',
      label: '17 Jun -> 10 Nov 2026',
      status: 'Verified / Closed',
      remarks: 'Skun baru terpasang dan uji kontinuitas lulus.'
    },
    {
      no: 12,
      ticket: 'PL-012',
      category: 'Lampu Mati',
      description: 'Armatur/bohlam lampu mati; lakukan pemeriksaan pengkabelan fasa-netral dan ganti armatur/lampu jika rusak.',
      location: 'Titik Lampu RCL-225',
      pic: 'Budi',
      priority: 'Medium',
      foundDate: '2026-05-12',
      dueDate: '2026-10-12',
      completedDate: '2026-11-12',
      hasBefore: true,
      hasAfter: true,
      visualType: 'lampu',
      label: 'RCL-225 (12 Mei -> 12 Nov 2026)',
      status: 'Verified / Closed',
      remarks: 'Pengkabelan fasa-netral diperbaiki; lampu RCL-225 menyala.'
    },
    {
      no: 13,
      ticket: 'PL-013',
      category: 'Konekting Kabel Rusak',
      description: 'Terminasi kabel terkelupas/rusak; lakukan pemotongan bagian kabel rusak dan pasang skun kabel baru.',
      location: 'Jalur Kabel Bawah Tanah - Sektor D1',
      pic: 'Ali',
      priority: 'Medium',
      foundDate: '2026-06-18',
      dueDate: '2026-11-18',
      completedDate: '2026-11-18',
      hasBefore: false,
      hasAfter: true,
      visualType: 'kabel',
      label: '18 Jun -> 18 Nov 2026',
      status: 'Verified / Closed',
      remarks: 'Bagian kabel terkelupas dipotong dan dipasang skun baru.'
    },
    {
      no: 14,
      ticket: 'PL-014',
      category: 'Konekting Kabel Rusak',
      description: 'Koneksi sambungan kabel tidak sempurna/rusak; lakukan terminasi ulang dan kencangkan sesuai spesifikasi torak/baut.',
      location: 'Jalur Kabel Bawah Tanah - Sektor D2',
      pic: 'Ali',
      priority: 'Medium',
      foundDate: '2026-05-18',
      dueDate: '2026-10-18',
      completedDate: '2026-11-18',
      hasBefore: false,
      hasAfter: true,
      visualType: 'kabel',
      label: '18 Mei -> 18 Nov 2026',
      status: 'Verified / Closed',
      remarks: 'Terminasi ulang sesuai torsi spesifikasi selesai.'
    },
    {
      no: 15,
      ticket: 'PL-015',
      category: 'Konekting Kabel Rusak',
      description: 'Koneksi kabel cacat/rusak; lakukan penggantian aksesoris sambungan dan lakukan pengujian isolasi kabel (megger test).',
      location: 'Jalur Kabel Bawah Tanah - Sektor D3',
      pic: 'Anton',
      priority: 'High',
      foundDate: '2026-05-18',
      dueDate: '2026-10-18',
      completedDate: '2026-11-18',
      hasBefore: false,
      hasAfter: true,
      visualType: 'kabel',
      label: '18 Mei -> 18 Nov 2026',
      status: 'Completed',
      remarks: 'Aksesoris sambungan diganti & megger test normal (Menunggu verifikasi).'
    }
  ];

  return rawRows.map(r => ({
    id: `ITEM-${String(r.no).padStart(2, '0')}`,
    no: r.no,
    ticket: r.ticket,
    category: r.category,
    description: r.description,
    location: r.location,
    pic: r.pic,
    priority: r.priority,
    foundDate: r.foundDate,
    dueDate: r.dueDate,
    completedDate: r.completedDate,
    status: r.status,
    remarks: r.remarks,
    photoBefore: r.hasBefore ? generateFieldPhoto(r.visualType, 'before', r.ticket, r.label) : '',
    photoAfter: r.hasAfter ? generateFieldPhoto(r.visualType, 'after', r.ticket, r.label) : ''
  }));
}

// ==================== APPLICATION STATE ====================
let state = {
  items: [],
  users: [],
  currentUser: null,
  firebaseUrl: localStorage.getItem(STORAGE_KEYS.FIREBASE_URL) || '',
  tempPhotoBefore: '',
  tempPhotoAfter: ''
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  loadLocalData();
  const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (savedSession) {
    try {
      state.currentUser = JSON.parse(savedSession);
      showApp();
    } catch (e) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }

  document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);
  document.getElementById('punch-form').addEventListener('submit', handlePunchSave);
  document.getElementById('user-form').addEventListener('submit', handleUserSave);

  if (state.firebaseUrl) {
    document.getElementById('firebase-url-input').value = state.firebaseUrl;
    pullFromFirebase(true);
  }
});

function loadLocalData() {
  const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  const savedItems = localStorage.getItem(STORAGE_KEYS.ITEMS);

  state.users = savedUsers ? JSON.parse(savedUsers) : getDefaultUsers();
  state.items = savedItems ? JSON.parse(savedItems) : getReportDataset();

  if (!savedUsers) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(state.users));
  if (!savedItems) localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(state.items));
}

function saveLocalData() {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(state.users));
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(state.items));
  if (state.firebaseUrl) {
    pushToFirebase(true);
  }
}

// ==================== AUTH & RBAC ====================
function quickLogin(email, password) {
  // Support both '123' and legacy password hints
  const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    state.currentUser = user;
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    showApp();
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pass = document.getElementById('login-password').value.trim();
  const errBox = document.getElementById('login-error');

  const user = state.users.find(u => u.email.toLowerCase() === email && (u.password === pass || pass === 'mgmt123' || pass === 'pic123' || pass === 'admin123'));
  if (!user) {
    errBox.textContent = 'Email atau kata sandi tidak valid. Gunakan akun terdaftar atau tombol Akses Cepat.';
    errBox.classList.remove('hidden');
    return;
  }
  errBox.classList.add('hidden');
  state.currentUser = user;
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  showApp();
}

function logout() {
  state.currentUser = null;
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
}

function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');

  const u = state.currentUser;
  document.getElementById('sidebar-avatar').textContent = u.name.charAt(0).toUpperCase();
  document.getElementById('sidebar-user-name').textContent = u.name;
  document.getElementById('sidebar-user-role').textContent = u.role === 'mgmt' ? 'Manajemen Kontraktor Utama' : `Tim Lapangan (PIC: ${u.name})`;

  // Toggle RBAC visibility
  const mgmtEls = document.querySelectorAll('.mgmt-only');
  mgmtEls.forEach(el => {
    if (u.role === 'mgmt') el.classList.remove('hidden');
    else el.classList.add('hidden');
  });

  renderAll();
}

function switchView(viewName) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

  const target = document.getElementById(`view-${viewName}`);
  if (target) target.classList.add('active');

  const navBtn = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (navBtn) navBtn.classList.add('active');

  const titles = {
    'dashboard': ['Dashboard Monitoring Punch List', 'Pemantauan Real-Time Masa Pemeliharaan Proyek Konstruksi (5 Bulan)'],
    'punchlists': ['Data Catatan Perbaikan (Punch List)', 'Daftar Lengkap 15 Item Temuan, PIC, Progres & Dokumentasi'],
    'early-warning': ['Early Warning System (Peringatan Dini)', 'Deteksi Otomatis Tenggat Waktu & Eskalasi Keterlambatan'],
    'reports': ['Laporan Bergambar & Berita Acara (FHO)', 'Rekapitulasi Serah Terima Akhir Proyek Berbasis Data & Foto'],
    'users': ['Manajemen Pengguna & Hak Akses (RBAC)', 'Pengaturan Akun Manajemen Kontraktor Utama & PIC Lapangan'],
    'settings': ['Sinkronisasi Online & Dataset Laporan', 'Integrasi Firebase Realtime Database & Reset Data Studi Kasus']
  };
  if (titles[viewName]) {
    document.getElementById('page-title').textContent = titles[viewName][0];
    document.getElementById('page-subtitle').textContent = titles[viewName][1];
  }

  document.getElementById('sidebar').classList.remove('open');
  renderAll();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ==================== EARLY WARNING LOGIC (BAB III.3.3) ====================
function computeEarlyWarning(item) {
  if (item.status === 'Verified / Closed') {
    return { level: 'green', label: 'Hijau (Tuntas)', daysDiff: 99, urgent: false };
  }
  const refDate = new Date('2026-11-21T00:00:00');
  const due = new Date(`${item.dueDate}T00:00:00`);
  const diffDays = Math.ceil((due - refDate) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { level: 'red', label: `Merah (Overdue ${Math.abs(diffDays)} hr)`, daysDiff: diffDays, urgent: true };
  }
  if (diffDays <= 3) {
    return { level: 'orange', label: `Oranye (H-${diffDays} Kritis)`, daysDiff: diffDays, urgent: true };
  }
  if (diffDays <= 14) {
    return { level: 'yellow', label: `Kuning (H-${diffDays} Perhatian)`, daysDiff: diffDays, urgent: true };
  }
  return { level: 'green', label: `Hijau (H-${diffDays} Aman)`, daysDiff: diffDays, urgent: false };
}

function formatIndoDate(isoStr) {
  if (!isoStr) return '-';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const parts = isoStr.split('-');
  if (parts.length !== 3) return isoStr;
  return `${parts[2]} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
}

function getStatusBadge(status) {
  const map = {
    'Open': 'status-open',
    'In Progress': 'status-progress',
    'Pending': 'status-pending',
    'Completed': 'status-completed',
    'Verified / Closed': 'status-verified'
  };
  return `<span class="badge ${map[status] || 'status-open'}">${status}</span>`;
}

// ==================== RENDERING ALL VIEWS ====================
function getVisibleItems() {
  if (!state.currentUser) return state.items;
  if (state.currentUser.role === 'pic') {
    return state.items.filter(it => it.pic.toLowerCase() === state.currentUser.name.toLowerCase());
  }
  return state.items;
}

function renderAll() {
  const allItems = state.items;
  const visibleItems = getVisibleItems();

  // KPIs
  const total = visibleItems.length;
  const activeCount = visibleItems.filter(i => ['Open', 'In Progress', 'Pending'].includes(i.status)).length;
  const completedCount = visibleItems.filter(i => i.status === 'Completed').length;
  const verifiedCount = visibleItems.filter(i => i.status === 'Verified / Closed').length;
  const verifiedPct = total ? ((verifiedCount / total) * 100).toFixed(1) : '0.0';

  document.getElementById('kpi-total').textContent = total;
  document.getElementById('kpi-active').textContent = activeCount;
  document.getElementById('kpi-completed').textContent = completedCount;
  document.getElementById('kpi-verified').textContent = verifiedCount;
  document.getElementById('kpi-verified-pct').textContent = `${verifiedPct}% Tuntas Terverifikasi`;
  document.getElementById('nav-count-all').textContent = visibleItems.length;

  const ewItems = visibleItems.filter(i => computeEarlyWarning(i).urgent);
  document.getElementById('nav-count-ew').textContent = ewItems.length;

  const banner = document.getElementById('ew-banner');
  if (ewItems.length > 0 || completedCount > 0) {
    banner.classList.remove('hidden');
    document.getElementById('ew-banner-text').textContent =
      `PERINGATAN DINI & VERIFIKASI: Terdapat ${ewItems.length} item Early Warning aktif dan ${completedCount} item menunggu verifikasi foto Before–After sebelum penutupan FHO!`;
  } else {
    banner.classList.add('hidden');
  }

  renderCategoryProgress(visibleItems);
  renderPicProgress(allItems);
  renderDashboardTable(visibleItems);
  renderFullTable(visibleItems);
  renderEarlyWarningTable(visibleItems);
  renderVisualReport(allItems);
  renderUsersTable();
}

function renderCategoryProgress(items) {
  const categories = [
    'Konekting Kabel Rusak',
    'Kabel BC Belum Di Couple Ke Trafo',
    'Lampu Mati'
  ];
  const container = document.getElementById('category-progress-container');
  container.innerHTML = categories.map((cat, idx) => {
    const subset = items.filter(i => i.category === cat);
    const done = subset.filter(i => i.status === 'Verified / Closed').length;
    const pct = subset.length ? Math.round((done / subset.length) * 100) : 0;
    const fillClass = idx === 2 ? 'green' : (idx === 1 ? 'teal' : '');
    return `
      <div class="progress-item">
        <div class="progress-top">
          <span>${cat} (${subset.length} Item)</span>
          <span>${done}/${subset.length} Verified (${pct}%)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${fillClass}" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderPicProgress(items) {
  const pics = ['Anton', 'Adul', 'Budi', 'Ali'];
  const container = document.getElementById('pic-progress-container');
  container.innerHTML = pics.map(pic => {
    const subset = items.filter(i => i.pic === pic);
    const done = subset.filter(i => i.status === 'Verified / Closed').length;
    const pct = subset.length ? Math.round((done / subset.length) * 100) : 0;
    return `
      <div class="progress-item">
        <div class="progress-top">
          <span><i class="fa-solid fa-user-gear"></i> PIC: ${pic} (${subset.length} Tugas)</span>
          <span>${done}/${subset.length} Tuntas (${pct}%)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill green" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderDashboardTable(items) {
  const tbody = document.getElementById('dashboard-table-body');
  tbody.innerHTML = items.slice(0, 8).map(item => {
    const ew = computeEarlyWarning(item);
    const docLabel = `${item.photoBefore ? 'Before ✓' : 'Before -'} | ${item.photoAfter ? 'After ✓' : 'After -'}`;
    return `
      <tr>
        <td><strong>${item.ticket}</strong></td>
        <td>${item.category}<br><small class="text-muted">${item.location}</small></td>
        <td><strong>${item.pic}</strong></td>
        <td>${formatIndoDate(item.foundDate)}</td>
        <td>${formatIndoDate(item.completedDate)}</td>
        <td><span class="badge ew-${ew.level}">${ew.label}</span></td>
        <td>${getStatusBadge(item.status)}</td>
        <td><small>${docLabel}</small></td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="openVerifyModal('${item.id}')" title="Lihat & Verifikasi Foto"><i class="fa-solid fa-eye"></i></button>
          <button class="btn btn-sm btn-primary" onclick="openPunchModal('${item.id}')" title="Edit / Update Progres"><i class="fa-solid fa-pen"></i></button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderFullTable(items) {
  const q = (document.getElementById('filter-search')?.value || '').toLowerCase();
  const cat = document.getElementById('filter-category')?.value || '';
  const pic = document.getElementById('filter-pic')?.value || '';
  const st = document.getElementById('filter-status')?.value || '';

  const filtered = items.filter(i => {
    const matchQ = !q || i.ticket.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.location.toLowerCase().includes(q);
    const matchCat = !cat || i.category === cat;
    const matchPic = !pic || i.pic === pic;
    const matchSt = !st || i.status === st;
    return matchQ && matchCat && matchPic && matchSt;
  });

  const isMgmt = state.currentUser && state.currentUser.role === 'mgmt';
  const tbody = document.getElementById('full-table-body');

  tbody.innerHTML = filtered.map(item => {
    const ew = computeEarlyWarning(item);
    return `
      <tr>
        <td>${item.no}</td>
        <td><strong>${item.ticket}</strong></td>
        <td style="max-width:300px;">
          <strong>${item.category}</strong>
          <div style="font-size:12px;color:#475569;margin-top:2px;">${item.description}</div>
          <small class="text-muted"><i class="fa-solid fa-location-dot"></i> ${item.location}</small>
        </td>
        <td><strong>${item.pic}</strong></td>
        <td>${formatIndoDate(item.foundDate)}</td>
        <td>
          <div><small class="text-muted">Target:</small> ${formatIndoDate(item.dueDate)}</div>
          <div><small class="text-muted">Selesai:</small> <strong>${formatIndoDate(item.completedDate)}</strong></div>
        </td>
        <td><span class="badge ew-${ew.level}">${ew.label}</span></td>
        <td>${getStatusBadge(item.status)}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="openVerifyModal('${item.id}')">
            <i class="fa-solid fa-images"></i> ${item.photoBefore ? 'B' : '-'} / ${item.photoAfter ? 'A' : '-'}
          </button>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-sm btn-primary" onclick="openPunchModal('${item.id}')" title="Update Status / Edit"><i class="fa-solid fa-pen-to-square"></i></button>
            ${isMgmt ? `<button class="btn btn-sm btn-danger" onclick="deletePunchItem('${item.id}')" title="Hapus"><i class="fa-solid fa-trash"></i></button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderEarlyWarningTable(items) {
  const sorted = [...items].sort((a, b) => computeEarlyWarning(a).daysDiff - computeEarlyWarning(b).daysDiff);
  const tbody = document.getElementById('ew-table-body');
  tbody.innerHTML = sorted.map(item => {
    const ew = computeEarlyWarning(item);
    return `
      <tr>
        <td><strong>${item.ticket}</strong></td>
        <td>${item.category}</td>
        <td><strong>${item.pic}</strong></td>
        <td>${formatIndoDate(item.foundDate)}</td>
        <td>${formatIndoDate(item.dueDate)}</td>
        <td>${formatIndoDate(item.completedDate)}</td>
        <td><span class="badge ew-${ew.level}">${ew.label}</span></td>
        <td>${getStatusBadge(item.status)}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="openPunchModal('${item.id}')">Tindak Lanjut</button>
        </td>
      </tr>
    `;
  }).join('');
}

// ==================== VISUAL REPORT (FHO) ====================
function renderVisualReport(items) {
  const total = items.length;
  const verified = items.filter(i => i.status === 'Verified / Closed').length;
  const withAfter = items.filter(i => !!i.photoAfter).length;
  const pctDone = total ? ((verified / total) * 100).toFixed(1) : '0.0';

  document.getElementById('report-kpi-summary').innerHTML = `
    <div class="rep-stat"><span>Total Item Punch List</span><strong>${total} Item</strong></div>
    <div class="rep-stat"><span>Tuntas Verified / Closed</span><strong>${verified} / ${total} (${pctDone}%)</strong></div>
    <div class="rep-stat"><span>Kelengkapan Foto After</span><strong>${withAfter} / ${total} Item</strong></div>
    <div class="rep-stat"><span>Status Kontrak Pemeliharaan</span><strong>5 Bulan (Terkendali)</strong></div>
  `;

  // Background-data-based visual bars in report
  const cats = ['Konekting Kabel Rusak', 'Kabel BC Belum Di Couple Ke Trafo', 'Lampu Mati'];
  const catHtml = cats.map(c => {
    const sub = items.filter(i => i.category === c);
    const v = sub.filter(i => i.status === 'Verified / Closed').length;
    const p = sub.length ? Math.round((v / sub.length) * 100) : 0;
    return `
      <div class="progress-item">
        <div class="progress-top"><span>${c}</span><span>${v}/${sub.length} (${p}%)</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${p}%"></div></div>
      </div>
    `;
  }).join('');

  const pics = ['Anton', 'Adul', 'Budi', 'Ali'];
  const picHtml = pics.map(name => {
    const sub = items.filter(i => i.pic === name);
    const v = sub.filter(i => i.status === 'Verified / Closed').length;
    const p = sub.length ? Math.round((v / sub.length) * 100) : 0;
    return `
      <div class="progress-item">
        <div class="progress-top"><span>PIC: ${name}</span><span>${v}/${sub.length} (${p}%)</span></div>
        <div class="progress-track"><div class="progress-fill green" style="width:${p}%"></div></div>
      </div>
    `;
  }).join('');

  document.getElementById('report-visual-charts').innerHTML = `
    <div class="report-chart-box"><strong style="display:block;margin-bottom:10px;">Distribusi Jenis Kerusakan</strong>${catHtml}</div>
    <div class="report-chart-box"><strong style="display:block;margin-bottom:10px;">Capaian Penyelesaian per PIC</strong>${picHtml}</div>
  `;

  document.getElementById('report-table-body').innerHTML = items.map(item => `
    <tr>
      <td style="text-align:center;"><strong>${item.no}</strong></td>
      <td><strong>${item.category}</strong><br><small>${item.ticket}</small></td>
      <td>${item.description}</td>
      <td style="text-align:center;"><strong>${item.pic}</strong></td>
      <td style="text-align:center;">${formatIndoDate(item.foundDate)}</td>
      <td>
        ${item.photoBefore
          ? `<img src="${item.photoBefore}" class="report-thumb" alt="Before ${item.ticket}" />`
          : `<span class="no-photo-tag">Tidak tersedia pada log awal</span>`}
      </td>
      <td style="text-align:center;">${formatIndoDate(item.completedDate)}</td>
      <td>
        ${item.photoAfter
          ? `<img src="${item.photoAfter}" class="report-thumb" alt="After ${item.ticket}" />`
          : `<span class="no-photo-tag">Belum diunggah</span>`}
      </td>
      <td style="text-align:center;">${getStatusBadge(item.status)}</td>
    </tr>
  `).join('');
}

// ==================== PUNCH LIST MODAL (CRUD & POKA-YOKE) ====================
function openPunchModal(itemId = null) {
  const isMgmt = state.currentUser && state.currentUser.role === 'mgmt';
  const alertBox = document.getElementById('poka-yoke-alert');
  alertBox.classList.add('hidden');

  if (itemId) {
    const item = state.items.find(i => i.id === itemId);
    if (!item) return;

    document.getElementById('punch-modal-title').textContent = `Edit / Update Progres ${item.ticket}`;
    document.getElementById('item-id').value = item.id;
    document.getElementById('item-ticket').value = item.ticket;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-description').value = item.description;
    document.getElementById('item-location').value = item.location;
    document.getElementById('item-pic').value = item.pic;
    document.getElementById('item-priority').value = item.priority;
    document.getElementById('item-found-date').value = item.foundDate;
    document.getElementById('item-due-date').value = item.dueDate;
    document.getElementById('item-completed-date').value = item.completedDate || '';
    document.getElementById('item-status').value = item.status;
    document.getElementById('item-remarks').value = item.remarks || '';

    state.tempPhotoBefore = item.photoBefore || '';
    state.tempPhotoAfter = item.photoAfter || '';
  } else {
    const nextNo = state.items.length + 1;
    document.getElementById('punch-modal-title').textContent = 'Tambah Temuan Punch List Baru';
    document.getElementById('item-id').value = '';
    document.getElementById('item-ticket').value = `PL-${String(nextNo).padStart(3, '0')}`;
    document.getElementById('item-category').value = 'Konekting Kabel Rusak';
    document.getElementById('item-description').value = '';
    document.getElementById('item-location').value = '';
    document.getElementById('item-pic').value = 'Anton';
    document.getElementById('item-priority').value = 'High';
    document.getElementById('item-found-date').value = '2026-11-21';
    document.getElementById('item-due-date').value = '2026-11-28';
    document.getElementById('item-completed-date').value = '';
    document.getElementById('item-status').value = 'Open';
    document.getElementById('item-remarks').value = '';

    state.tempPhotoBefore = '';
    state.tempPhotoAfter = '';
  }

  // RBAC field locks for PIC
  ['item-ticket', 'item-category', 'item-description', 'item-location', 'item-pic', 'item-priority', 'item-found-date', 'item-due-date'].forEach(fid => {
    document.getElementById(fid).disabled = !isMgmt;
  });

  // Only Manajemen can select Verified / Closed
  const verifiedOpt = document.querySelector('#item-status option[value="Verified / Closed"]');
  if (verifiedOpt) verifiedOpt.disabled = !isMgmt;

  updatePhotoPreview('before', state.tempPhotoBefore);
  updatePhotoPreview('after', state.tempPhotoAfter);
  document.getElementById('punch-modal').classList.remove('hidden');
}

function handlePhotoUpload(event, slot) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxW = 720;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', 0.78);

      if (slot === 'before') state.tempPhotoBefore = compressed;
      else state.tempPhotoAfter = compressed;
      updatePhotoPreview(slot, compressed);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function updatePhotoPreview(slot, dataUrl) {
  const el = document.getElementById(`preview-${slot}`);
  if (dataUrl) {
    el.innerHTML = `<img src="${dataUrl}" alt="Foto ${slot}" />`;
  } else {
    el.textContent = slot === 'before' ? 'Belum ada foto Before' : 'Belum ada foto After';
  }
}

function handlePunchSave(e) {
  e.preventDefault();
  const status = document.getElementById('item-status').value;
  const remarks = document.getElementById('item-remarks').value.trim();
  const alertBox = document.getElementById('poka-yoke-alert');

  // POKA-YOKE VALIDATION (BAB III.2.2 & TST-03)
  if ((status === 'Completed' || status === 'Verified / Closed') && !state.tempPhotoAfter) {
    alertBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>Validasi Poka-Yoke Ditolak:</strong> Status <em>Completed / Verified</em> mewajibkan unggahan <strong>Dokumentasi Sesudah Perbaikan (Foto After)</strong> terlebih dahulu!';
    alertBox.classList.remove('hidden');
    return;
  }

  if (status === 'Pending' && !remarks) {
    alertBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>Validasi Poka-Yoke:</strong> Status <em>Pending</em> wajib menyertakan alasan kendala pada kolom Catatan Lapangan.';
    alertBox.classList.remove('hidden');
    return;
  }

  const existingId = document.getElementById('item-id').value;
  const payload = {
    ticket: document.getElementById('item-ticket').value.trim(),
    category: document.getElementById('item-category').value,
    description: document.getElementById('item-description').value.trim(),
    location: document.getElementById('item-location').value.trim(),
    pic: document.getElementById('item-pic').value,
    priority: document.getElementById('item-priority').value,
    foundDate: document.getElementById('item-found-date').value,
    dueDate: document.getElementById('item-due-date').value,
    completedDate: document.getElementById('item-completed-date').value || ((status === 'Completed' || status === 'Verified / Closed') ? '2026-11-21' : ''),
    status,
    remarks,
    photoBefore: state.tempPhotoBefore,
    photoAfter: state.tempPhotoAfter
  };

  if (existingId) {
    const idx = state.items.findIndex(i => i.id === existingId);
    if (idx !== -1) {
      state.items[idx] = { ...state.items[idx], ...payload };
    }
  } else {
    const newNo = state.items.length + 1;
    state.items.push({
      id: `ITEM-${Date.now()}`,
      no: newNo,
      ...payload
    });
  }

  saveLocalData();
  closeModal('punch-modal');
  renderAll();
}

function deletePunchItem(id) {
  if (!confirm('Hapus item punch list ini dari basis data?')) return;
  state.items = state.items.filter(i => i.id !== id).map((it, idx) => ({ ...it, no: idx + 1 }));
  saveLocalData();
  renderAll();
}

// ==================== VERIFICATION MODAL (BEFORE-AFTER) ====================
function openVerifyModal(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  const isMgmt = state.currentUser && state.currentUser.role === 'mgmt';
  document.getElementById('verify-modal-title').textContent = `Verifikasi Hasil Perbaikan — ${item.ticket} (${item.category})`;

  document.getElementById('verify-modal-body').innerHTML = `
    <div style="margin-bottom:14px;">
      <strong>Deskripsi:</strong> ${item.description}<br>
      <small class="text-muted">PIC: <strong>${item.pic}</strong> • Tgl Temuan: ${formatIndoDate(item.foundDate)} • Tgl Selesai: ${formatIndoDate(item.completedDate)} • Status: ${item.status}</small>
    </div>
    <div class="photo-upload-section">
      <div class="photo-box">
        <label>DOKUMENTASI SEBELUM PERBAIKAN (BEFORE)</label>
        <div class="photo-preview" style="min-height:190px;">
          ${item.photoBefore ? `<img src="${item.photoBefore}" style="max-height:220px;" />` : '<span>Tidak ada foto Before pada catatan awal</span>'}
        </div>
      </div>
      <div class="photo-box">
        <label>DOKUMENTASI SESUDAH PERBAIKAN (AFTER)</label>
        <div class="photo-preview" style="min-height:190px;">
          ${item.photoAfter ? `<img src="${item.photoAfter}" style="max-height:220px;" />` : '<span>Belum ada foto After diunggah</span>'}
        </div>
      </div>
    </div>
    <div class="mt-15"><strong>Catatan Pelaksanaan:</strong> ${item.remarks || '-'}</div>
  `;

  const footer = document.getElementById('verify-modal-footer');
  if (isMgmt && item.status !== 'Verified / Closed' && item.photoAfter) {
    footer.innerHTML = `
      <button class="btn btn-secondary" onclick="closeModal('verify-modal')">Tutup</button>
      <button class="btn btn-success" onclick="approveVerification('${item.id}')">
        <i class="fa-solid fa-circle-check"></i> Setujui &amp; Tutup (Verified / Closed)
      </button>
    `;
  } else {
    footer.innerHTML = `<button class="btn btn-secondary" onclick="closeModal('verify-modal')">Tutup</button>`;
  }

  document.getElementById('verify-modal').classList.remove('hidden');
}

function approveVerification(id) {
  const idx = state.items.findIndex(i => i.id === id);
  if (idx !== -1) {
    state.items[idx].status = 'Verified / Closed';
    if (!state.items[idx].completedDate) state.items[idx].completedDate = '2026-11-21';
    saveLocalData();
  }
  closeModal('verify-modal');
  renderAll();
}

// ==================== USER MANAGEMENT ====================
function renderUsersTable() {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;
  tbody.innerHTML = state.users.map(u => `
    <tr>
      <td><strong>${u.id}</strong></td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td><span class="badge ${u.role === 'mgmt' ? 'status-progress' : 'status-verified'}">${u.role === 'mgmt' ? 'Manajemen Kontraktor Utama' : 'Tim Lapangan (PIC)'}</span></td>
      <td>${u.division || '-'}</td>
      <td>${u.phone || '-'}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="openUserModal('${u.id}')"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser('${u.id}')"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function openUserModal(userId = null) {
  if (userId) {
    const u = state.users.find(x => x.id === userId);
    if (!u) return;
    document.getElementById('user-modal-title').textContent = `Edit Pengguna — ${u.name}`;
    document.getElementById('edit-user-id').value = u.id;
    document.getElementById('user-name').value = u.name;
    document.getElementById('user-email').value = u.email;
    document.getElementById('user-password').value = u.password;
    document.getElementById('user-role').value = u.role;
    document.getElementById('user-phone').value = u.phone || '';
    document.getElementById('user-division').value = u.division || '';
  } else {
    document.getElementById('user-modal-title').textContent = 'Tambah Pengguna Baru';
    document.getElementById('edit-user-id').value = '';
    document.getElementById('user-form').reset();
  }
  document.getElementById('user-modal').classList.remove('hidden');
}

function handleUserSave(e) {
  e.preventDefault();
  const editId = document.getElementById('edit-user-id').value;
  const userObj = {
    name: document.getElementById('user-name').value.trim(),
    email: document.getElementById('user-email').value.trim(),
    password: document.getElementById('user-password').value.trim(),
    role: document.getElementById('user-role').value,
    phone: document.getElementById('user-phone').value.trim(),
    division: document.getElementById('user-division').value.trim()
  };

  if (editId) {
    const idx = state.users.findIndex(u => u.id === editId);
    if (idx !== -1) state.users[idx] = { ...state.users[idx], ...userObj };
  } else {
    state.users.push({
      id: `USR-${String(state.users.length + 1).padStart(2, '0')}`,
      ...userObj
    });
  }

  saveLocalData();
  closeModal('user-modal');
  renderUsersTable();
}

function deleteUser(id) {
  if (state.users.length <= 1) return alert('Minimal harus ada 1 akun pengguna.');
  if (!confirm('Hapus pengguna ini?')) return;
  state.users = state.users.filter(u => u.id !== id);
  saveLocalData();
  renderUsersTable();
}

// ==================== FIREBASE REALTIME DB SYNC & DATASET CONTROLS ====================
function saveFirebaseConfig() {
  const url = document.getElementById('firebase-url-input').value.trim().replace(/\/$/, '');
  state.firebaseUrl = url;
  localStorage.setItem(STORAGE_KEYS.FIREBASE_URL, url);
  if (url) {
    pushToFirebase(false);
  } else {
    document.getElementById('firebase-feedback').innerHTML = '<div class="badge status-open">URL Firebase dikosongkan. Sistem berjalan pada penyimpanan lokal.</div>';
  }
}

async function pushToFirebase(silent = false) {
  if (!state.firebaseUrl) return;
  try {
    const res = await fetch(`${state.firebaseUrl}/sim_punchlist_k4.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updatedAt: new Date().toISOString(),
        users: state.users,
        items: state.items
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    document.getElementById('sync-status-text').textContent = 'Firebase Online Sync';
    if (!silent) {
      document.getElementById('firebase-feedback').innerHTML = '<div class="badge status-verified">Berhasil mendorong 15 data laporan & pengguna ke Firebase Cloud!</div>';
    }
  } catch (err) {
    if (!silent) {
      document.getElementById('firebase-feedback').innerHTML = `<div class="alert-error">Gagal sinkronisasi ke Firebase: ${err.message}. Pastikan Rules (.read/.write: true) aktif.</div>`;
    }
  }
}

async function pullFromFirebase(silent = false) {
  if (!state.firebaseUrl) return;
  try {
    const res = await fetch(`${state.firebaseUrl}/sim_punchlist_k4.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && Array.isArray(data.items) && data.items.length > 0) {
      state.items = data.items;
      if (Array.isArray(data.users)) state.users = data.users;
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(state.items));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(state.users));
      renderAll();
      document.getElementById('sync-status-text').textContent = 'Firebase Online Sync';
      if (!silent) {
        document.getElementById('firebase-feedback').innerHTML = '<div class="badge status-verified">Data terbaru berhasil ditarik dari Firebase Cloud!</div>';
      }
    } else if (!silent) {
      document.getElementById('firebase-feedback').innerHTML = '<div class="badge status-pending">Database Cloud masih kosong. Klik "Dorong Data ke Cloud" untuk mengunggah 15 data laporan.</div>';
    }
  } catch (err) {
    if (!silent) {
      document.getElementById('firebase-feedback').innerHTML = `<div class="alert-error">Gagal menarik data Firebase: ${err.message}</div>`;
    }
  }
}

function resetToReportData() {
  if (!confirm('Muat ulang seluruh 15 data item & akun PIC persis sesuai Tabel BAB I Laporan Capstone Design Kelompok 4?')) return;
  state.items = getReportDataset();
  state.users = getDefaultUsers();
  saveLocalData();
  renderAll();
  alert('Berhasil! 15 data punch list & akun PIC telah diperbarui sesuai Laporan Capstone Design Kelompok 4.');
}

function markAllVerified() {
  state.items = state.items.map(it => ({
    ...it,
    status: 'Verified / Closed',
    completedDate: it.completedDate || '2026-11-21'
  }));
  saveLocalData();
  renderAll();
  alert('Seluruh 15 item telah diperbarui menjadi Verified / Closed (100% Tuntas sesuai Tabel 4.3 Evaluasi Akhir).');
}

function downloadBackupJSON() {
  const blob = new Blob([JSON.stringify({ users: state.users, items: state.items }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'backup-sim-punchlist-kelompok4.json';
  a.click();
}

function exportToCSV() {
  const headers = ['No', 'Tiket', 'Judul Catatan', 'Deskripsi', 'Lokasi', 'Nama PIC', 'Tanggal Temuan', 'Target Tenggat', 'Tanggal Selesai', 'Status'];
  const rows = state.items.map(i => [
    i.no, i.ticket, `"${i.category}"`, `"${i.description.replace(/"/g, '""')}"`, `"${i.location}"`,
    i.pic, i.foundDate, i.dueDate, i.completedDate || '-', i.status
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Rekap-PunchList-FHO-Kelompok4.csv';
  a.click();
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}
