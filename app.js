/**
 * ============================================================================
 * SIM-PUNCHLIST — SISTEM MONITORING PUNCH LIST BERBASIS WEB
 * Kelompok 4 Teknik Industri — Universitas Pamulang (08TIDE001 / 2026)
 *
 * Fitur Utama:
 * 1. Autentikasi Login & Role-Based Access Control (Manajemen Utama vs PIC)
 * 2. 15 Dataset Studi Kasus Sesuai Latar Belakang + Dokumentasi Gambar Before/After
 * 3. Sinkronisasi Real-Time Lintas Jaringan (Firebase Realtime Database REST + SSE)
 *    serta Sinkronisasi Multi-Tab Lokal (BroadcastChannel + LocalStorage)
 * 4. Validasi Anti-Kesalahan (Poka-Yoke): Wajib Foto After untuk status Completed
 * 5. Early Warning Engine Otomatis (Hijau, Kuning, Oranye, Merah)
 * 6. Kelola Pengguna (Tambah/Edit/Hapus Akun) & Laporan Bergambar (Print PDF/Excel)
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    DATA: 'sim_punchlist_data_v2',
    SESSION: 'sim_punchlist_session_v2',
    FIREBASE_URL: 'sim_punchlist_firebase_url_v2'
  };

  // ==========================================================================
  // 1. GENERATOR DOKUMENTASI VISUAL LAPANGAN (CANVAS DATA URL)
  // Menghasilkan ilustrasi foto teknis lapangan yang realistis untuk 15 item
  // ==========================================================================
  function generateTechnicalPhoto(category, stage, codeLabel) {
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');

    // Latar belakang tekstur lapangan (aspal / tanah / beton gardu)
    if (category === 'lampu') {
      ctx.fillStyle = stage === 'before' ? '#26292e' : '#090d16';
    } else if (category === 'bc') {
      ctx.fillStyle = '#3b332b';
    } else {
      ctx.fillStyle = '#2b3036';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tekstur bintik permukaan
    for (let i = 0; i < 450; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.12)';
      ctx.fillRect((i * 73) % 360, (i * 41) % 250, 2, 2);
    }

    if (category === 'kabel') {
      // Lubang pit / handhole koneksi kabel
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(180, 125, 82, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(180, 125, 76, 0, Math.PI * 2);
      ctx.fill();

      if (stage === 'before') {
        // Kabel terkelupas / konektor rusak
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(95, 155);
        ctx.lineTo(162, 130);
        ctx.moveTo(205, 118);
        ctx.lineTo(268, 95);
        ctx.stroke();

        // Serabut tembaga terbuka & percikan merah
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(162, 130);
        ctx.lineTo(176, 122);
        ctx.moveTo(162, 130);
        ctx.lineTo(174, 136);
        ctx.stroke();

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(148, 105, 68, 44);
      } else {
        // Konektor & heatshrink terisolasi rapi
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.moveTo(95, 155);
        ctx.lineTo(268, 95);
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.save();
        ctx.translate(182, 125);
        ctx.rotate(-0.33);
        ctx.fillRect(-34, -10, 68, 20);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(-10, -10, 20, 20);
        ctx.restore();
      }
    } else if (category === 'bc') {
      // Busbar Grounding Trafo
      ctx.fillStyle = '#b45309';
      ctx.fillRect(55, 95, 250, 26);
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(180, 108, 8, 0, Math.PI * 2);
      ctx.fill();

      if (stage === 'before') {
        // Kabel Bare Copper menggantung belum di-couple
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(130, 225);
        ctx.quadraticCurveTo(155, 170, 210, 165);
        ctx.stroke();

        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(210, 165);
        ctx.lineTo(180, 116);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        // Kabel BC terpasang skun & baut kencang ke busbar trafo
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(130, 225);
        ctx.quadraticCurveTo(150, 155, 180, 115);
        ctx.stroke();

        // Skun / Lug & Mur Baut
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(170, 98, 20, 22);
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(180, 108, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Armatur Lampu Penerangan Runway / Area (RCL-221 / RCL-225)
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(180, 125, 68, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(180, 125, 56, 0, Math.PI * 2);
      ctx.fill();

      if (stage === 'before') {
        // Lampu mati (gelap)
        ctx.fillStyle = '#334155';
        ctx.fillRect(156, 85, 48, 18);
        ctx.fillRect(156, 147, 48, 18);
      } else {
        // Lampu menyala terang (putih & merah)
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 22;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(156, 85, 48, 18);

        ctx.shadowColor = '#ef4444';
        ctx.fillStyle = '#f87171';
        ctx.fillRect(156, 147, 48, 18);
        ctx.shadowBlur = 0;
      }
    }

    // Label timestamp dokumentasi lapangan di pojok bawah
    ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
    ctx.fillRect(0, 220, 360, 30);
    ctx.fillStyle = stage === 'before' ? '#fca5a5' : '#6ee7b7';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(
      `${stage === 'before' ? 'BEFORE' : 'AFTER'} • ${codeLabel}`,
      12,
      239
    );

    return canvas.toDataURL('image/jpeg', 0.82);
  }

  // ==========================================================================
  // 2. DATA AWAL PENGGUNA & 15 ITEM PUNCH LIST SESUAI LATAR BELAKANG
  // ==========================================================================
  function createDefaultUsers() {
    return [
      {
        id: 'usr-mgmt-1',
        name: 'Fajar Sidiq Al-Hayyu (Manajemen)',
        username: 'manajemen@kontraktor.co.id',
        password: 'admin123',
        role: 'mgmt',
        phone: 'Project Manager • Kontraktor Utama'
      },
      {
        id: 'usr-pic-anton',
        name: 'Anton',
        username: 'anton',
        password: 'pic123',
        role: 'pic',
        phone: 'Tim Pemeliharaan Elektrikal & Terminasi'
      },
      {
        id: 'usr-pic-adul',
        name: 'Adul',
        username: 'adul',
        password: 'pic123',
        role: 'pic',
        phone: 'Tim Pemeliharaan Jaringan Kabel'
      },
      {
        id: 'usr-pic-budi',
        name: 'Budi',
        username: 'budi',
        password: 'pic123',
        role: 'pic',
        phone: 'Tim Pemeliharaan Grounding & Penerangan'
      },
      {
        id: 'usr-pic-ali',
        name: 'Ali',
        username: 'ali',
        password: 'pic123',
        role: 'pic',
        phone: 'Tim Pemeliharaan Armatur & Koneksi'
      }
    ];
  }

  function createDefaultPunchLists() {
    const rawItems = [
      {
        no: 1,
        ticket: 'PL-001',
        category: 'kabel',
        title: 'Konekting Kabel Rusak',
        description: 'Koneksi/terminasi kabel mengalami kerusakan; perlu dilakukan pemotongan ulang, penyambungan kembali, atau penggantian skun kabel (cable lug).',
        pic: 'Anton',
        priority: 'High',
        foundDate: '2026-05-21',
        dueDate: '2026-10-15',
        completedDate: '2026-10-12',
        status: 'Verified/Closed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 2,
        ticket: 'PL-002',
        category: 'kabel',
        title: 'Konekting Kabel Rusak',
        description: 'Konektor/terminasi kabel mengalami kerusakan/kendur; perlu perbaikan koneksi serta pengencangan ulang baut terminal.',
        pic: 'Adul',
        priority: 'High',
        foundDate: '2026-05-14',
        dueDate: '2026-10-14',
        completedDate: '2026-10-10',
        status: 'Verified/Closed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 3,
        ticket: 'PL-003',
        category: 'bc',
        title: 'Kabel BC Belum Di Couple Ke Trafo',
        description: 'Kabel Bare Copper (BC) untuk sistem pembumian (grounding) belum terhubung/terpasang pada busbar/terminal grounding trafo.',
        pic: 'Anton',
        priority: 'High',
        foundDate: '2026-06-19',
        dueDate: '2026-11-26',
        completedDate: '',
        status: 'In Progress',
        hasBefore: true,
        hasAfter: false
      },
      {
        no: 4,
        ticket: 'PL-004',
        category: 'bc',
        title: 'Kabel BC Belum Di Couple Ke Trafo',
        description: 'Kabel BC grounding belum dikoneksikan ke bodi/body grounding trafo; lakukan penyambungan menggunakan klem/skun kabel yang sesuai.',
        pic: 'Budi',
        priority: 'High',
        foundDate: '2026-06-19',
        dueDate: '2026-11-26',
        completedDate: '2026-11-20',
        status: 'Completed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 5,
        ticket: 'PL-005',
        category: 'bc',
        title: 'Kabel BC Belum Di Couple Ke Trafo',
        description: 'Kabel BC belum terpasang ke terminal neutral/grounding trafo; lakukan penyambungan dan pastikan koneksi kencang.',
        pic: 'Adul',
        priority: 'High',
        foundDate: '2026-06-17',
        dueDate: '2026-10-17',
        completedDate: '2026-10-15',
        status: 'Verified/Closed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 6,
        ticket: 'PL-006',
        category: 'bc',
        title: 'Kabel BC Belum Di Couple Ke Trafo',
        description: 'Kabel BC grounding belum terhubung ke trafo; lakukan terminasi kabel BC pada titik grounding trafo.',
        pic: 'Anton',
        priority: 'Medium',
        foundDate: '2026-06-19',
        dueDate: '2026-11-23',
        completedDate: '',
        status: 'Pending',
        pendingReason: 'Menunggu pengiriman tambahan klem grounding tembaga ukuran 50mm.',
        hasBefore: true,
        hasAfter: false
      },
      {
        no: 7,
        ticket: 'PL-007',
        category: 'bc',
        title: 'Kabel BC Belum Di Couple Ke Trafo',
        description: 'Penyambungan kabel BC ke grounding trafo belum dilakukan; persiapkan lug kabel dan lakukan pembautan pada terminal trafo.',
        pic: 'Adul',
        priority: 'High',
        foundDate: '2026-07-01',
        dueDate: '2026-11-01',
        completedDate: '2026-10-29',
        status: 'Verified/Closed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 8,
        ticket: 'PL-008',
        category: 'bc',
        title: 'Kabel BC Belum Di Couple Ke Trafo',
        description: 'Kabel BC grounding menggantung dan belum terhubung ke trafo; lakukan terminasi dan pastikan nilai tahanan grounding sesuai standar.',
        pic: 'Budi',
        priority: 'High',
        foundDate: '2026-06-19',
        dueDate: '2026-11-26',
        completedDate: '2026-11-21',
        status: 'Completed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 9,
        ticket: 'PL-009',
        category: 'kabel',
        title: 'Konekting Kabel Rusak',
        description: 'Konektor/skun kabel mengalami kerusakan/korosi; lakukan penggantian konektor baru dan isolasi ulang.',
        pic: 'Anton',
        priority: 'High',
        foundDate: '2026-05-18',
        dueDate: '2026-10-18',
        completedDate: '2026-10-16',
        status: 'Verified/Closed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 10,
        ticket: 'PL-010',
        category: 'lampu',
        title: 'Lampu Mati (Titik RCL-221)',
        description: 'Lampu penerangan tidak menyala; lakukan pengecekan suplai daya, sakelar, ballast, atau lakukan penggantian bohlam lampu baru.',
        pic: 'Ali',
        priority: 'High',
        foundDate: '2026-05-12',
        dueDate: '2026-10-12',
        completedDate: '2026-10-10',
        status: 'Verified/Closed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 11,
        ticket: 'PL-011',
        category: 'kabel',
        title: 'Konekting Kabel Rusak',
        description: 'Koneksi kabel terbakar/rusak; perlu perbaikan kabel, penggantian terminal block/skun, serta pengujian kontinuitas.',
        pic: 'Adul',
        priority: 'Medium',
        foundDate: '2026-06-17',
        dueDate: '2026-11-10',
        completedDate: '2026-11-08',
        status: 'Verified/Closed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 12,
        ticket: 'PL-012',
        category: 'lampu',
        title: 'Lampu Mati (Titik RCL-225)',
        description: 'Armatur/bohlam lampu mati; lakukan pemeriksaan pengkabelan fasa-netral dan ganti armatur/lampu jika rusak.',
        pic: 'Budi',
        priority: 'High',
        foundDate: '2026-05-12',
        dueDate: '2026-10-12',
        completedDate: '2026-10-11',
        status: 'Verified/Closed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 13,
        ticket: 'PL-013',
        category: 'kabel',
        title: 'Konekting Kabel Rusak',
        description: 'Terminasi kabel terkelupas/rusak; lakukan pemotongan bagian kabel rusak dan pasang skun kabel baru.',
        pic: 'Ali',
        priority: 'Medium',
        foundDate: '2026-06-18',
        dueDate: '2026-11-18',
        completedDate: '2026-11-17',
        status: 'Verified/Closed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 14,
        ticket: 'PL-014',
        category: 'kabel',
        title: 'Konekting Kabel Rusak',
        description: 'Koneksi sambungan kabel tidak sempurna/rusak; lakukan terminasi ulang dan kencangkan sesuai spesifikasi torak/baut.',
        pic: 'Ali',
        priority: 'Medium',
        foundDate: '2026-05-18',
        dueDate: '2026-11-18',
        completedDate: '2026-11-18',
        status: 'Verified/Closed',
        hasBefore: true,
        hasAfter: true
      },
      {
        no: 15,
        ticket: 'PL-015',
        category: 'kabel',
        title: 'Konekting Kabel Rusak',
        description: 'Koneksi kabel cacat/rusak; lakukan penggantian aksesoris sambungan dan lakukan pengujian isolasi kabel (megger test).',
        pic: 'Anton',
        priority: 'High',
        foundDate: '2026-05-18',
        dueDate: '2026-11-18',
        completedDate: '2026-11-18',
        status: 'Verified/Closed',
        hasBefore: true,
        hasAfter: true
      }
    ];

    return rawItems.map((item) => ({
      id: `pl-item-${item.no}`,
      no: item.no,
      ticket: item.ticket,
      category: item.category,
      title: item.title,
      description: item.description,
      pic: item.pic,
      priority: item.priority,
      foundDate: item.foundDate,
      dueDate: item.dueDate,
      completedDate: item.completedDate,
      status: item.status,
      pendingReason: item.pendingReason || '',
      photoBefore: item.hasBefore
        ? generateTechnicalPhoto(item.category, 'before', `${item.ticket} (${item.foundDate})`)
        : '',
      photoAfter: item.hasAfter
        ? generateTechnicalPhoto(item.category, 'after', `${item.ticket} (${item.completedDate || 'Selesai'})`)
        : '',
      logs: [
        {
          time: `${item.foundDate} 08:30`,
          actor: 'Manajemen Kontraktor Utama',
          note: `Temuan dicatat dengan status Open dan ditugaskan kepada PIC ${item.pic}.`
        },
        ...(item.status === 'Verified/Closed'
          ? [
              {
                time: `${item.completedDate} 15:45`,
                actor: item.pic,
                note: 'Perbaikan selesai & foto After diunggah (Status: Completed).'
              },
              {
                time: `${item.completedDate} 17:10`,
                actor: 'Manajemen Kontraktor Utama',
                note: 'Hasil foto Before-After diverifikasi sesuai standar (Verified/Closed).'
              }
            ]
          : item.status === 'Completed'
          ? [
              {
                time: `${item.completedDate} 14:20`,
                actor: item.pic,
                note: 'Perbaikan selesai & foto After diunggah. Menunggu verifikasi Manajemen.'
              }
            ]
          : item.status === 'Pending'
          ? [
              {
                time: `${item.foundDate} 11:00`,
                actor: item.pic,
                note: `Status Pending: ${item.pendingReason}`
              }
            ]
          : [
              {
                time: `${item.foundDate} 10:15`,
                actor: item.pic,
                note: 'Pekerjaan diterima dan sedang dieksekusi di lapangan (In Progress).'
              }
            ])
      ]
    }));
  }

  // ==========================================================================
  // 3. STATE APLIKASI & ENGINE SINKRONISASI REAL-TIME
  // ==========================================================================
  let appState = {
    users: [],
    punchLists: [],
    updatedAt: 0
  };

  let currentUser = null;
  let firebaseUrl = localStorage.getItem(STORAGE_KEYS.FIREBASE_URL) || '';
  let eventSource = null;
  let isSyncingFromRemote = false;
  let tempItemBefore = '';
  let tempItemAfter = '';
  let tempProgressBefore = '';
  let tempProgressAfter = '';

  // BroadcastChannel untuk sinkronisasi real-time antar tab browser secara instan
  const bcChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('sim_punchlist_realtime') : null;
  if (bcChannel) {
    bcChannel.onmessage = (ev) => {
      if (ev.data && ev.data.type === 'STATE_UPDATED') {
        loadFromLocalStorage();
        refreshAllUI();
      }
    };
  }

  function loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DATA);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.punchLists)) {
          appState = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Gagal membaca storage lokal:', e);
    }
    appState = {
      users: createDefaultUsers(),
      punchLists: createDefaultPunchLists(),
      updatedAt: Date.now()
    };
    saveState(false);
  }

  function saveState(pushToCloud = true) {
    appState.updatedAt = Date.now();
    try {
      localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(appState));
    } catch (e) {
      showToast('Peringatan: Kapasitas penyimpanan lokal penuh. Gunakan ukuran foto lebih kecil.', 'error');
    }

    if (bcChannel) {
      bcChannel.postMessage({ type: 'STATE_UPDATED', updatedAt: appState.updatedAt });
    }

    if (pushToCloud && firebaseUrl && !isSyncingFromRemote) {
      pushStateToFirebase();
    }
  }

  // ==========================================================================
  // 4. FIREBASE REALTIME DATABASE REST + SSE (LINTAS PERANGKAT & JARINGAN)
  // ==========================================================================
  function normalizeFirebaseUrl(url) {
    if (!url) return '';
    return url.trim().replace(/\/+$/, '');
  }

  async function pushStateToFirebase() {
    const base = normalizeFirebaseUrl(firebaseUrl);
    if (!base) return;
    try {
      const res = await fetch(`${base}/sim_punchlist_v2.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appState)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      updateSyncIndicators(true, 'Online Real-Time (Firebase)');
    } catch (err) {
      console.error('Firebase push error:', err);
      updateSyncIndicators(false, 'Gagal Sync Cloud (Cek Rules/URL)');
    }
  }

  async function connectFirebaseRealtime(url, initialMerge = true) {
    const base = normalizeFirebaseUrl(url);
    if (!base) return;

    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    try {
      const res = await fetch(`${base}/sim_punchlist_v2.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const remoteData = await res.json();

      if (remoteData && Array.isArray(remoteData.punchLists) && remoteData.punchLists.length > 0) {
        isSyncingFromRemote = true;
        appState = {
          users: Array.isArray(remoteData.users) && remoteData.users.length ? remoteData.users : appState.users,
          punchLists: remoteData.punchLists,
          updatedAt: remoteData.updatedAt || Date.now()
        };
        saveState(false);
        isSyncingFromRemote = false;
        refreshAllUI();
        showToast('Data real-time berhasil dimuat dari Firebase!', 'success');
      } else if (initialMerge) {
        await pushStateToFirebase();
        showToast('Database cloud kosong — 15 data lokal berhasil diunggah ke Firebase!', 'success');
      }

      // Langganan perubahan real-time via Server-Sent Events (SSE)
      eventSource = new EventSource(`${base}/sim_punchlist_v2.json`);
      eventSource.addEventListener('put', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload && payload.data && Array.isArray(payload.data.punchLists)) {
            if ((payload.data.updatedAt || 0) > (appState.updatedAt || 0)) {
              isSyncingFromRemote = true;
              appState = payload.data;
              saveState(false);
              isSyncingFromRemote = false;
              refreshAllUI();
              showToast('Pembaruan data real-time diterima dari pengguna lain.', 'success');
            }
          }
        } catch (parseErr) {
          console.warn('SSE parse warning:', parseErr);
        }
      });

      eventSource.onerror = () => {
        updateSyncIndicators(false, 'Menyambung ulang Firebase...');
      };

      updateSyncIndicators(true, 'Online Real-Time (Firebase)');
    } catch (err) {
      updateSyncIndicators(false, 'Koneksi Firebase Gagal');
      showToast('Tidak dapat terhubung ke Firebase. Pastikan URL benar dan Rules .read/.write = true.', 'error');
    }
  }

  function updateSyncIndicators(isOnline, labelText) {
    const loginBadge = document.getElementById('login-sync-badge');
    const topIndicator = document.getElementById('topbar-sync-indicator');
    const topText = document.getElementById('topbar-sync-text');

    if (loginBadge) {
      loginBadge.className = `sync-pill ${isOnline ? 'sync-online' : 'sync-local'}`;
      loginBadge.innerHTML = `<i class="fa-solid ${isOnline ? 'fa-cloud-check' : 'fa-circle-dot'}"></i> ${labelText}`;
    }
    if (topIndicator && topText) {
      topIndicator.className = `sync-pill ${isOnline ? 'sync-online' : 'sync-local'}`;
      topText.textContent = labelText;
    }
  }

  // ==========================================================================
  // 5. ALGORITMA EARLY WARNING SYSTEM & HELPER FORMAT
  // ==========================================================================
  function calculateEarlyWarning(item) {
    if (item.status === 'Verified/Closed') {
      return {
        zone: 'green',
        badgeClass: 'ew-green',
        label: 'Hijau (Tuntas)',
        deltaText: 'Selesai'
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(item.dueDate);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        zone: 'red',
        badgeClass: 'ew-red',
        label: `Merah (Overdue H+${Math.abs(diffDays)})`,
        deltaText: `${diffDays} hari`
      };
    }
    if (diffDays <= 3) {
      return {
        zone: 'orange',
        badgeClass: 'ew-orange',
        label: `Oranye (Kritis H-${diffDays})`,
        deltaText: `${diffDays} hari`
      };
    }
    if (diffDays <= 14) {
      return {
        zone: 'yellow',
        badgeClass: 'ew-yellow',
        label: `Kuning (Perhatian H-${diffDays})`,
        deltaText: `${diffDays} hari`
      };
    }
    return {
      zone: 'green',
      badgeClass: 'ew-green',
      label: `Hijau (Aman H-${diffDays})`,
      deltaText: `${diffDays} hari`
    };
  }

  function getStatusBadgeHtml(status) {
    const map = {
      Open: 'badge-open',
      'In Progress': 'badge-progress',
      Pending: 'badge-pending',
      Completed: 'badge-completed',
      'Verified/Closed': 'badge-verified'
    };
    return `<span class="badge ${map[status] || 'badge-open'}">${escapeHtml(status)}</span>`;
  }

  function formatDateIndo(dateStr) {
    if (!dateStr) return '-';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const mIdx = parseInt(parts[1], 10) - 1;
    return `${parts[2]} ${months[mIdx] || parts[1]} ${parts[0]}`;
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function compressImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxW = 720;
          const scale = img.width > maxW ? maxW / img.width : 1;
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 3600);
  }

  // ==========================================================================
  // 6. AUTENTIKASI LOGIN & KONTROL PERAN (RBAC)
  // ==========================================================================
  function initLoginEvents() {
    const loginForm = document.getElementById('login-form');
    const togglePass = document.getElementById('toggle-password');
    const passInput = document.getElementById('login-password');
    const errBox = document.getElementById('login-error');

    togglePass.addEventListener('click', () => {
      const isPwd = passInput.type === 'password';
      passInput.type = isPwd ? 'text' : 'password';
      togglePass.innerHTML = `<i class="fa-solid ${isPwd ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
    });

    document.querySelectorAll('.btn-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.getElementById('login-identity').value = chip.dataset.user;
        document.getElementById('login-password').value = chip.dataset.pass;
        errBox.classList.add('hidden');
      });
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const identity = document.getElementById('login-identity').value.trim().toLowerCase();
      const pwd = document.getElementById('login-password').value;

      const matched = appState.users.find(
        (u) =>
          (u.username.toLowerCase() === identity || u.name.toLowerCase() === identity) &&
          u.password === pwd
      );

      if (!matched) {
        errBox.textContent = 'Username/Email atau kata sandi tidak sesuai. Gunakan akun terdaftar atau tombol Akses Cepat Demo.';
        errBox.classList.remove('hidden');
        return;
      }

      errBox.classList.add('hidden');
      currentUser = matched;
      sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(matched));
      enterApplication();
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
      currentUser = null;
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
      document.getElementById('app-shell').classList.add('hidden');
      document.getElementById('login-screen').classList.remove('hidden');
      document.getElementById('login-password').value = '';
    });
  }

  function enterApplication() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');

    document.getElementById('sidebar-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('sidebar-user-name').textContent = currentUser.name;
    document.getElementById('sidebar-user-role').textContent =
      currentUser.role === 'mgmt' ? 'Manajemen Kontraktor Utama' : 'Tim Lapangan (PIC)';

    // Terapkan RBAC visibility
    const isMgmt = currentUser.role === 'mgmt';
    document.querySelectorAll('.mgmt-only').forEach((el) => {
      el.classList.toggle('hidden', !isMgmt);
    });

    refreshAllUI();
  }

  // ==========================================================================
  // 7. NAVIGASI VIEW & RENDER SEMUA KOMPONEN UI
  // ==========================================================================
  function switchView(viewName) {
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    document.querySelectorAll('.view-section').forEach((sec) => {
      sec.classList.add('hidden');
    });
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.remove('hidden');

    const titles = {
      dashboard: ['Dashboard Monitoring Punch List', 'Masa Pemeliharaan Resmi: 5 Bulan • Pemantauan Progres Real-Time'],
      punchlists: ['Data Terpusat Punch List', 'Pengelolaan Temuan, Penugasan PIC, dan Validasi Foto Before–After'],
      'early-warning': ['Early Warning System (Peringatan Dini)', 'Deteksi Otomatis Tenggat Waktu Sebelum Masa Pemeliharaan Berakhir'],
      reports: ['Laporan Rekapitulasi Bergambar (FHO)', 'Dokumen Pemeriksaan Akhir dengan Bukti Foto Sebelum & Sesudah Perbaikan'],
      users: ['Kelola Akun Pengguna & Hak Akses', 'Pengaturan Akun Manajemen Kontraktor Utama dan Tim Pemeliharaan Lapangan'],
      'realtime-config': ['Sinkronisasi Online Real-Time & GitHub', 'Konfigurasi Firebase Realtime Database untuk Akses Lintas Jaringan']
    };

    if (titles[viewName]) {
      document.getElementById('page-title').textContent = titles[viewName][0];
      document.getElementById('page-subtitle').textContent = titles[viewName][1];
    }

    document.getElementById('sidebar').classList.remove('open');
  }

  function refreshAllUI() {
    if (!currentUser) return;
    populatePicDropdowns();
    renderDashboard();
    renderPunchListTable();
    renderEarlyWarningView();
    renderIllustratedReport();
    renderUsersTable();
    document.getElementById('firebase-url-input').value = firebaseUrl;
  }

  function populatePicDropdowns() {
    const picNames = Array.from(
      new Set([
        ...appState.users.filter((u) => u.role === 'pic').map((u) => u.name),
        ...appState.punchLists.map((p) => p.pic)
      ])
    );

    const filterPic = document.getElementById('filter-pic');
    const reportPic = document.getElementById('report-filter-pic');
    const itemPic = document.getElementById('item-pic');

    const prevFilter = filterPic.value || 'ALL';
    const prevReport = reportPic.value || 'ALL';

    filterPic.innerHTML = `<option value="ALL">Semua PIC</option>` +
      picNames.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');
    filterPic.value = prevFilter;

    reportPic.innerHTML = `<option value="ALL">Semua PIC</option>` +
      picNames.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');
    reportPic.value = prevReport;

    itemPic.innerHTML = picNames
      .map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`)
      .join('');
  }

  // --- Render Dashboard ---
  function renderDashboard() {
    const items = appState.punchLists;
    const total = items.length;
    const verified = items.filter((i) => i.status === 'Verified/Closed').length;
    const pending = items.filter((i) => i.status === 'Pending').length;
    const active = items.filter((i) => ['Open', 'In Progress', 'Pending'].includes(i.status)).length;
    const warnings = items.filter((i) => {
      const ew = calculateEarlyWarning(i);
      return ['yellow', 'orange', 'red'].includes(ew.zone);
    });

    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-active').textContent = active;
    document.getElementById('kpi-pending-sub').textContent = `${pending} Item Pending Kendala`;
    document.getElementById('kpi-warning').textContent = warnings.length;
    document.getElementById('kpi-verified').textContent = verified;
    const pct = total > 0 ? Math.round((verified / total) * 100) : 0;
    document.getElementById('kpi-verified-pct').textContent = `${pct}% Tuntas Terverifikasi`;

    document.getElementById('nav-count-total').textContent = total;
    document.getElementById('nav-count-warn').textContent = warnings.length;

    // Banner Early Warning
    const ewBanner = document.getElementById('dashboard-ew-banner');
    if (warnings.length > 0) {
      ewBanner.classList.remove('hidden');
      document.getElementById('dashboard-ew-text').textContent =
        `Terdapat ${warnings.length} item punch list mendekati batas tenggat atau melewati jadwal masa pemeliharaan 5 bulan!`;
    } else {
      ewBanner.classList.add('hidden');
    }

    // Grafik Progres per Kategori
    const categories = [
      { key: 'kabel', label: 'Konekting Kabel Rusak', color: '#2563eb' },
      { key: 'bc', label: 'Kabel BC Belum Di Couple Ke Trafo', color: '#0d9488' },
      { key: 'lampu', label: 'Lampu Penerangan Mati', color: '#16a34a' }
    ];

    const catContainer = document.getElementById('category-progress-container');
    catContainer.innerHTML = categories
      .map((cat) => {
        const subset = items.filter((i) => i.category === cat.key);
        const done = subset.filter((i) => i.status === 'Verified/Closed').length;
        const p = subset.length > 0 ? Math.round((done / subset.length) * 100) : 0;
        return `
          <div class="cat-progress-item">
            <div class="cat-progress-top">
              <span>${cat.label} (${subset.length} Item)</span>
              <span>${done}/${subset.length} Tuntas (${p}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${p}%; background:${cat.color};"></div>
            </div>
          </div>
        `;
      })
      .join('');

    // Feed Notifikasi Early Warning & Antrean Verifikasi
    const feedContainer = document.getElementById('dashboard-alert-feed');
    const awaitingVerify = items.filter((i) => i.status === 'Completed');
    const feedCards = [];

    warnings.forEach((w) => {
      const ew = calculateEarlyWarning(w);
      feedCards.push(`
        <div class="feed-item feed-${ew.zone}">
          <div>
            <strong>${escapeHtml(w.ticket)} • ${escapeHtml(w.pic)}</strong><br/>
            <span>${escapeHtml(w.title)} — <b>${ew.label}</b></span>
          </div>
          <button class="btn btn-sm btn-outline" onclick="window.openProgressModal('${w.id}')">Cek</button>
        </div>
      `);
    });

    awaitingVerify.forEach((v) => {
      feedCards.push(`
        <div class="feed-item feed-blue">
          <div>
            <strong>${escapeHtml(v.ticket)} • Siap Verifikasi Foto</strong><br/>
            <span>PIC ${escapeHtml(v.pic)} telah mengunggah foto After.</span>
          </div>
          <button class="btn btn-sm btn-primary" onclick="window.openProgressModal('${v.id}')">Verifikasi</button>
        </div>
      `);
    });

    feedContainer.innerHTML = feedCards.length
      ? feedCards.join('')
      : `<div class="alert alert-info">Seluruh item dalam kondisi terkendali dan tidak ada peringatan kritis.</div>`;

    // Tabel Ringkas Dashboard (8 item prioritas/terbaru)
    const tbody = document.getElementById('dashboard-table-body');
    tbody.innerHTML = items.slice(0, 8).map((item) => renderPunchListRow(item, true)).join('');
  }

  // --- Render Tabel Lengkap Punch List ---
  function renderPunchListTable() {
    const query = (document.getElementById('filter-search').value || '').toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const picFilter = document.getElementById('filter-pic').value;

    const filtered = appState.punchLists.filter((item) => {
      const matchQuery =
        item.ticket.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.pic.toLowerCase().includes(query);
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchPic = picFilter === 'ALL' || item.pic === picFilter;
      return matchQuery && matchStatus && matchPic;
    });

    const tbody = document.getElementById('punchlist-table-body');
    tbody.innerHTML = filtered.length
      ? filtered.map((item) => renderPunchListRow(item, false)).join('')
      : `<tr><td colspan="10" class="text-center text-muted">Tidak ada catatan punch list yang sesuai filter.</td></tr>`;
  }

  function renderPunchListRow(item, compact) {
    const ew = calculateEarlyWarning(item);
    const isMgmt = currentUser && currentUser.role === 'mgmt';

    const photoThumbs = `
      <div class="thumb-pair">
        <div class="thumb-box" title="Klik untuk perbesar Foto Before" onclick="window.openLightbox('${item.id}', 'before')">
          ${
            item.photoBefore
              ? `<img src="${item.photoBefore}" alt="Before" /><span class="thumb-tag">Before</span>`
              : `<span class="thumb-empty">No Before</span>`
          }
        </div>
        <div class="thumb-box" title="Klik untuk perbesar Foto After" onclick="window.openLightbox('${item.id}', 'after')">
          ${
            item.photoAfter
              ? `<img src="${item.photoAfter}" alt="After" /><span class="thumb-tag">After</span>`
              : `<span class="thumb-empty">No After</span>`
          }
        </div>
      </div>
    `;

    const actionBtns = `
      <div class="btn-group-row">
        <button class="btn btn-sm btn-primary" onclick="window.openProgressModal('${item.id}')" title="Update Progres & Foto">
          <i class="fa-solid fa-camera"></i> Update
        </button>
        ${
          isMgmt
            ? `<button class="btn btn-sm btn-outline" onclick="window.openEditItemModal('${item.id}')" title="Edit Detail"><i class="fa-solid fa-pen"></i></button>
               <button class="btn btn-sm btn-danger" onclick="window.deletePunchListItem('${item.id}')" title="Hapus"><i class="fa-solid fa-trash"></i></button>`
            : ''
        }
      </div>
    `;

    if (compact) {
      return `
        <tr>
          <td><strong>${escapeHtml(item.ticket)}</strong></td>
          <td>
            <strong>${escapeHtml(item.title)}</strong>
            <div class="text-muted text-sm">${escapeHtml(item.description.slice(0, 72))}...</div>
          </td>
          <td><strong>${escapeHtml(item.pic)}</strong></td>
          <td>${formatDateIndo(item.foundDate)}</td>
          <td>${formatDateIndo(item.dueDate)}</td>
          <td><span class="badge ${ew.badgeClass}">${ew.label}</span></td>
          <td>${getStatusBadgeHtml(item.status)}</td>
          <td>${photoThumbs}</td>
          <td><button class="btn btn-sm btn-outline" onclick="window.openProgressModal('${item.id}')">Detail / Foto</button></td>
        </tr>
      `;
    }

    return `
      <tr>
        <td><strong>${escapeHtml(item.ticket)}</strong></td>
        <td style="min-width:240px;">
          <strong>${escapeHtml(item.title)}</strong>
          <div class="text-muted text-sm">${escapeHtml(item.description)}</div>
          ${item.pendingReason ? `<div class="text-sm" style="color:#b45309;margin-top:3px;">Kendala: ${escapeHtml(item.pendingReason)}</div>` : ''}
        </td>
        <td><strong>${escapeHtml(item.pic)}</strong></td>
        <td>${formatDateIndo(item.foundDate)}</td>
        <td>${formatDateIndo(item.dueDate)}</td>
        <td>${formatDateIndo(item.completedDate)}</td>
        <td><span class="badge ${ew.badgeClass}">${ew.label}</span></td>
        <td>${getStatusBadgeHtml(item.status)}</td>
        <td>${photoThumbs}</td>
        <td>${actionBtns}</td>
      </tr>
    `;
  }

  // --- Render Early Warning View ---
  function renderEarlyWarningView() {
    const tbody = document.getElementById('ew-table-body');
    const sorted = [...appState.punchLists].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    tbody.innerHTML = sorted
      .map((item) => {
        const ew = calculateEarlyWarning(item);
        return `
          <tr>
            <td><strong>${escapeHtml(item.ticket)}</strong></td>
            <td><strong>${escapeHtml(item.title)}</strong></td>
            <td>${escapeHtml(item.pic)}</td>
            <td>${formatDateIndo(item.dueDate)}</td>
            <td><strong>${ew.deltaText}</strong></td>
            <td><span class="badge ${ew.badgeClass}">${ew.label}</span></td>
            <td>${getStatusBadgeHtml(item.status)}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="window.openProgressModal('${item.id}')">
                Tindak Lanjut &amp; Foto
              </button>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  // --- Render Laporan Bergambar (FHO) ---
  function renderIllustratedReport() {
    const statusFilter = document.getElementById('report-filter-status').value;
    const picFilter = document.getElementById('report-filter-pic').value;

    const filtered = appState.punchLists.filter((item) => {
      const matchPic = picFilter === 'ALL' || item.pic === picFilter;
      if (statusFilter === 'ALL') return matchPic;
      if (statusFilter === 'Verified/Closed') return matchPic && item.status === 'Verified/Closed';
      return matchPic && item.status !== 'Verified/Closed';
    });

    const total = filtered.length;
    const verified = filtered.filter((i) => i.status === 'Verified/Closed').length;
    const withAfter = filtered.filter((i) => Boolean(i.photoAfter)).length;

    document.getElementById('report-print-date').textContent = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    document.getElementById('report-printed-by').textContent = currentUser ? currentUser.name : 'Manajemen';

    document.getElementById('report-summary-strip').innerHTML = `
      <div class="rep-stat"><span>Total Item Laporan</span><strong>${total} Catatan</strong></div>
      <div class="rep-stat"><span>Terverifikasi (Closed)</span><strong>${verified} Item (${total ? Math.round((verified / total) * 100) : 0}%)</strong></div>
      <div class="rep-stat"><span>Kelengkapan Foto After</span><strong>${withAfter} / ${total} Foto</strong></div>
      <div class="rep-stat"><span>Status Kontrak</span><strong>Masa Pemeliharaan 5 Bln</strong></div>
    `;

    const tbody = document.getElementById('report-table-body');
    tbody.innerHTML = filtered
      .map(
        (item, idx) => `
        <tr>
          <td class="text-center"><strong>${idx + 1}</strong><br/><span class="text-sm text-muted">${escapeHtml(item.ticket)}</span></td>
          <td><strong>${escapeHtml(item.title)}</strong></td>
          <td>${escapeHtml(item.description)}</td>
          <td class="text-center"><strong>${escapeHtml(item.pic)}</strong></td>
          <td class="text-center">${formatDateIndo(item.foundDate)}</td>
          <td class="text-center">
            ${
              item.photoBefore
                ? `<img src="${item.photoBefore}" alt="Before ${escapeHtml(item.ticket)}" class="report-img" />`
                : `<div class="report-no-img">Tidak ada foto awal</div>`
            }
          </td>
          <td class="text-center">${formatDateIndo(item.completedDate)}</td>
          <td class="text-center">
            ${
              item.photoAfter
                ? `<img src="${item.photoAfter}" alt="After ${escapeHtml(item.ticket)}" class="report-img" />`
                : `<div class="report-no-img">Belum ada foto sesudah</div>`
            }
          </td>
          <td class="text-center">${getStatusBadgeHtml(item.status)}</td>
        </tr>
      `
      )
      .join('');
  }

  // --- Render Tabel Kelola Pengguna ---
  function renderUsersTable() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = appState.users
      .map(
        (u, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${escapeHtml(u.name)}</strong></td>
          <td><code>${escapeHtml(u.username)}</code></td>
          <td><code>${escapeHtml(u.password)}</code></td>
          <td>
            <span class="badge ${u.role === 'mgmt' ? 'badge-info' : 'badge-verified'}">
              ${u.role === 'mgmt' ? 'Manajemen Kontraktor Utama' : 'Tim Lapangan (PIC)'}
            </span>
          </td>
          <td>${escapeHtml(u.phone || '-')}</td>
          <td>
            <div class="btn-group-row">
              <button class="btn btn-sm btn-outline" onclick="window.openEditUserModal('${u.id}')">
                <i class="fa-solid fa-user-pen"></i> Edit
              </button>
              <button class="btn btn-sm btn-danger" onclick="window.deleteUserAccount('${u.id}')">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `
      )
      .join('');
  }

  // ==========================================================================
  // 8. AKSI CRUD PUNCH LIST, POKA-YOKE FOTO & KELOLA PENGGUNA
  // ==========================================================================
  window.openEditItemModal = function (itemId) {
    const item = appState.punchLists.find((p) => p.id === itemId);
    if (!item) return;

    document.getElementById('modal-item-title').textContent = `Edit Catatan Punch List (${item.ticket})`;
    document.getElementById('item-id').value = item.id;
    document.getElementById('item-ticket').value = item.ticket;
    document.getElementById('item-title').value = item.title;
    document.getElementById('item-description').value = item.description;
    document.getElementById('item-pic').value = item.pic;
    document.getElementById('item-priority').value = item.priority || 'High';
    document.getElementById('item-status').value = item.status;
    document.getElementById('item-found-date').value = item.foundDate;
    document.getElementById('item-due-date').value = item.dueDate;
    document.getElementById('item-completed-date').value = item.completedDate || '';

    tempItemBefore = item.photoBefore || '';
    tempItemAfter = item.photoAfter || '';
    document.getElementById('preview-item-before').innerHTML = tempItemBefore ? `<img src="${tempItemBefore}" alt="Before" />` : '';
    document.getElementById('preview-item-after').innerHTML = tempItemAfter ? `<img src="${tempItemAfter}" alt="After" />` : '';

    document.getElementById('modal-item-form').classList.remove('hidden');
  };

  function openNewItemModal() {
    const nextNo = appState.punchLists.length + 1;
    const ticket = `PL-${String(nextNo).padStart(3, '0')}`;
    const todayIso = new Date().toISOString().split('T')[0];

    document.getElementById('modal-item-title').textContent = 'Input Catatan Punch List Baru';
    document.getElementById('form-punchlist-item').reset();
    document.getElementById('item-id').value = '';
    document.getElementById('item-ticket').value = ticket;
    document.getElementById('item-found-date').value = todayIso;
    document.getElementById('item-due-date').value = '2026-11-30';
    tempItemBefore = '';
    tempItemAfter = '';
    document.getElementById('preview-item-before').innerHTML = '';
    document.getElementById('preview-item-after').innerHTML = '';

    document.getElementById('modal-item-form').classList.remove('hidden');
  }

  window.deletePunchListItem = function (itemId) {
    if (!confirm('Hapus catatan punch list ini secara permanen?')) return;
    appState.punchLists = appState.punchLists.filter((p) => p.id !== itemId);
    saveState(true);
    refreshAllUI();
    showToast('Catatan punch list berhasil dihapus.', 'success');
  };

  // Modal Update Progres & Verifikasi Foto Before-After (Poka-Yoke)
  window.openProgressModal = function (itemId) {
    const item = appState.punchLists.find((p) => p.id === itemId);
    if (!item) return;

    const isMgmt = currentUser && currentUser.role === 'mgmt';
    document.getElementById('progress-item-id').value = item.id;
    document.getElementById('modal-progress-title').textContent = `Eksekusi & Verifikasi — ${item.ticket}`;
    document.getElementById('progress-item-summary').innerHTML = `
      <strong>${escapeHtml(item.title)}</strong> (PIC: <b>${escapeHtml(item.pic)}</b>)<br/>
      <span class="text-sm text-muted">${escapeHtml(item.description)}</span>
    `;

    const statusSelect = document.getElementById('progress-status');
    statusSelect.value = item.status;
    document.getElementById('opt-verified-status').disabled = !isMgmt;

    document.getElementById('progress-completed-date').value =
      item.completedDate || new Date().toISOString().split('T')[0];
    document.getElementById('progress-remarks').value = item.pendingReason || '';
    document.getElementById('progress-error-msg').classList.add('hidden');

    tempProgressBefore = item.photoBefore || '';
    tempProgressAfter = item.photoAfter || '';
    renderProgressPhotoFrames();

    const quickVerifyBtn = document.getElementById('btn-quick-verify');
    if (isMgmt && item.status === 'Completed' && tempProgressAfter) {
      quickVerifyBtn.classList.remove('hidden');
    } else {
      quickVerifyBtn.classList.add('hidden');
    }

    const auditList = document.getElementById('progress-audit-list');
    auditList.innerHTML = (item.logs || [])
      .map((l) => `<li><strong>[${escapeHtml(l.time)}] ${escapeHtml(l.actor)}:</strong> ${escapeHtml(l.note)}</li>`)
      .join('');

    document.getElementById('modal-progress').classList.remove('hidden');
  };

  function renderProgressPhotoFrames() {
    const beforeFrame = document.getElementById('progress-before-frame');
    const afterFrame = document.getElementById('progress-after-frame');

    beforeFrame.innerHTML = tempProgressBefore
      ? `<img src="${tempProgressBefore}" alt="Foto Before" />`
      : `<span>Belum ada Foto Before</span>`;

    afterFrame.innerHTML = tempProgressAfter
      ? `<img src="${tempProgressAfter}" alt="Foto After" />`
      : `<span>Wajib unggah Foto After sebelum Completed</span>`;
  }

  window.openLightbox = function (itemId, stage) {
    const item = appState.punchLists.find((p) => p.id === itemId);
    if (!item) return;
    const src = stage === 'before' ? item.photoBefore : item.photoAfter;
    if (!src) {
      showToast(`Foto ${stage === 'before' ? 'Sebelum' : 'Sesudah'} perbaikan belum tersedia.`, 'error');
      return;
    }
    document.getElementById('lightbox-title').textContent =
      `${item.ticket} — Dokumentasi ${stage === 'before' ? 'Sebelum Perbaikan (Before)' : 'Sesudah Perbaikan (After)'}`;
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox-caption').textContent = `${item.title} • PIC: ${item.pic}`;
    document.getElementById('modal-lightbox').classList.remove('hidden');
  };

  // --- Kelola Pengguna (Editable Users) ---
  window.openEditUserModal = function (userId) {
    const u = appState.users.find((x) => x.id === userId);
    if (!u) return;
    document.getElementById('modal-user-title').textContent = `Edit Akun Pengguna (${u.name})`;
    document.getElementById('edit-user-id').value = u.id;
    document.getElementById('user-fullname').value = u.name;
    document.getElementById('user-username').value = u.username;
    document.getElementById('user-password').value = u.password;
    document.getElementById('user-role').value = u.role;
    document.getElementById('user-phone').value = u.phone || '';
    document.getElementById('modal-user-form').classList.remove('hidden');
  };

  window.deleteUserAccount = function (userId) {
    if (currentUser && currentUser.id === userId) {
      showToast('Tidak dapat menghapus akun yang sedang aktif digunakan.', 'error');
      return;
    }
    if (!confirm('Hapus akun pengguna ini?')) return;
    appState.users = appState.users.filter((u) => u.id !== userId);
    saveState(true);
    refreshAllUI();
    showToast('Akun pengguna berhasil dihapus.', 'success');
  };

  // ==========================================================================
  // 9. BINDING EVENT LISTENERS FORM & EKSPOR
  // ==========================================================================
  function initAppEvents() {
    // Sidebar & Navigasi
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
    document.querySelectorAll('[data-goto]').forEach((btn) => {
      btn.addEventListener('click', () => switchView(btn.dataset.goto));
    });
    document.getElementById('open-sidebar').addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('open');
    });
    document.getElementById('close-sidebar').addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
    });

    // Tutup Modal
    document.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.close).classList.add('hidden');
      });
    });

    // Tombol Input Item Baru
    document.getElementById('btn-add-punchlist-top').addEventListener('click', openNewItemModal);
    document.getElementById('btn-add-punchlist-table').addEventListener('click', openNewItemModal);

    // Filter Tabel & Laporan
    ['filter-search', 'filter-status', 'filter-pic'].forEach((id) => {
      document.getElementById(id).addEventListener('input', renderPunchListTable);
      document.getElementById(id).addEventListener('change', renderPunchListTable);
    });
    ['report-filter-status', 'report-filter-pic'].forEach((id) => {
      document.getElementById(id).addEventListener('change', renderIllustratedReport);
    });

    // Upload Foto di Modal Form Item
    document.getElementById('item-photo-before-input').addEventListener('change', async (e) => {
      if (e.target.files[0]) {
        tempItemBefore = await compressImageFile(e.target.files[0]);
        document.getElementById('preview-item-before').innerHTML = `<img src="${tempItemBefore}" alt="Before" />`;
      }
    });
    document.getElementById('item-photo-after-input').addEventListener('change', async (e) => {
      if (e.target.files[0]) {
        tempItemAfter = await compressImageFile(e.target.files[0]);
        document.getElementById('preview-item-after').innerHTML = `<img src="${tempItemAfter}" alt="After" />`;
      }
    });

    // Submit Form Tambah/Edit Item Punch List
    document.getElementById('form-punchlist-item').addEventListener('submit', (e) => {
      e.preventDefault();
      const editId = document.getElementById('item-id').value;
      const ticket = document.getElementById('item-ticket').value.trim();
      const title = document.getElementById('item-title').value.trim();
      const description = document.getElementById('item-description').value.trim();
      const pic = document.getElementById('item-pic').value;
      const priority = document.getElementById('item-priority').value;
      const status = document.getElementById('item-status').value;
      const foundDate = document.getElementById('item-found-date').value;
      const dueDate = document.getElementById('item-due-date').value;
      const completedDate = document.getElementById('item-completed-date').value;

      if ((status === 'Completed' || status === 'Verified/Closed') && !tempItemAfter) {
        showToast('Validasi Poka-Yoke: Unggah Foto After terlebih dahulu untuk status Completed/Verified!', 'error');
        return;
      }

      const lowerTitle = title.toLowerCase();
      const category = lowerTitle.includes('bc') || lowerTitle.includes('trafo')
        ? 'bc'
        : lowerTitle.includes('lampu')
        ? 'lampu'
        : 'kabel';

      const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

      if (editId) {
        const idx = appState.punchLists.findIndex((p) => p.id === editId);
        if (idx !== -1) {
          appState.punchLists[idx] = {
            ...appState.punchLists[idx],
            ticket,
            category,
            title,
            description,
            pic,
            priority,
            status,
            foundDate,
            dueDate,
            completedDate,
            photoBefore: tempItemBefore,
            photoAfter: tempItemAfter,
            logs: [
              ...(appState.punchLists[idx].logs || []),
              { time: nowStr, actor: currentUser.name, note: `Data item diperbarui (Status: ${status}).` }
            ]
          };
        }
        showToast(`Item ${ticket} berhasil diperbarui & disinkronkan.`, 'success');
      } else {
        appState.punchLists.unshift({
          id: `pl-${Date.now()}`,
          no: appState.punchLists.length + 1,
          ticket,
          category,
          title,
          description,
          pic,
          priority,
          foundDate,
          dueDate,
          completedDate,
          status,
          pendingReason: '',
          photoBefore: tempItemBefore,
          photoAfter: tempItemAfter,
          logs: [
            { time: nowStr, actor: currentUser.name, note: `Temuan baru dicatat & ditugaskan ke ${pic}.` }
          ]
        });
        showToast(`Temuan baru ${ticket} berhasil ditambahkan!`, 'success');
      }

      saveState(true);
      refreshAllUI();
      document.getElementById('modal-item-form').classList.add('hidden');
    });

    // Upload Foto di Modal Progress (Poka-Yoke)
    document.getElementById('progress-upload-before').addEventListener('change', async (e) => {
      if (e.target.files[0]) {
        tempProgressBefore = await compressImageFile(e.target.files[0]);
        renderProgressPhotoFrames();
      }
    });
    document.getElementById('progress-upload-after').addEventListener('change', async (e) => {
      if (e.target.files[0]) {
        tempProgressAfter = await compressImageFile(e.target.files[0]);
        renderProgressPhotoFrames();
        document.getElementById('progress-error-msg').classList.add('hidden');
      }
    });

    // Tombol Verifikasi Cepat oleh Manajemen
    document.getElementById('btn-quick-verify').addEventListener('click', () => {
      document.getElementById('progress-status').value = 'Verified/Closed';
      document.getElementById('form-progress-update').dispatchEvent(new Event('submit'));
    });

    // Submit Update Progres Lapangan
    document.getElementById('form-progress-update').addEventListener('submit', (e) => {
      e.preventDefault();
      const itemId = document.getElementById('progress-item-id').value;
      const newStatus = document.getElementById('progress-status').value;
      const compDate = document.getElementById('progress-completed-date').value;
      const remarks = document.getElementById('progress-remarks').value.trim();
      const errEl = document.getElementById('progress-error-msg');

      // ATURAN POKA-YOKE 1: Wajib Foto After untuk status Completed / Verified
      if ((newStatus === 'Completed' || newStatus === 'Verified/Closed') && !tempProgressAfter) {
        errEl.textContent =
          'VALIDASI POKA-YOKE DITOLAK: Anda wajib mengunggah Foto Sesudah Perbaikan (After) sebelum mengubah status menjadi Completed!';
        errEl.classList.remove('hidden');
        return;
      }

      // ATURAN POKA-YOKE 2: Wajib Alasan jika status Pending
      if (newStatus === 'Pending' && !remarks) {
        errEl.textContent = 'Harap isi catatan alasan kendala apabila status dipilih Pending.';
        errEl.classList.remove('hidden');
        return;
      }

      // ATURAN RBAC: Hanya Manajemen yang bisa Verified/Closed
      if (newStatus === 'Verified/Closed' && currentUser.role !== 'mgmt') {
        errEl.textContent = 'Akses Ditolak: Hanya Manajemen Kontraktor Utama yang berwenang menyetujui Verified/Closed.';
        errEl.classList.remove('hidden');
        return;
      }

      const idx = appState.punchLists.findIndex((p) => p.id === itemId);
      if (idx === -1) return;

      const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const item = appState.punchLists[idx];

      appState.punchLists[idx] = {
        ...item,
        status: newStatus,
        completedDate: newStatus === 'Completed' || newStatus === 'Verified/Closed' ? compDate : item.completedDate,
        pendingReason: newStatus === 'Pending' ? remarks : '',
        photoBefore: tempProgressBefore,
        photoAfter: tempProgressAfter,
        logs: [
          ...(item.logs || []),
          {
            time: nowStr,
            actor: currentUser.name,
            note: `Status diubah menjadi ${newStatus}${remarks ? ` — Catatan: ${remarks}` : ''}`
          }
        ]
      };

      saveState(true);
      refreshAllUI();
      document.getElementById('modal-progress').classList.add('hidden');
      showToast(`Progres ${item.ticket} diperbarui ke ${newStatus} secara real-time!`, 'success');
    });

    // Kelola Pengguna (Tambah / Edit)
    document.getElementById('btn-open-add-user').addEventListener('click', () => {
      document.getElementById('modal-user-title').textContent = 'Tambah Pengguna Baru';
      document.getElementById('form-user-account').reset();
      document.getElementById('edit-user-id').value = '';
      document.getElementById('modal-user-form').classList.remove('hidden');
    });

    document.getElementById('form-user-account').addEventListener('submit', (e) => {
      e.preventDefault();
      const editId = document.getElementById('edit-user-id').value;
      const name = document.getElementById('user-fullname').value.trim();
      const username = document.getElementById('user-username').value.trim();
      const password = document.getElementById('user-password').value.trim();
      const role = document.getElementById('user-role').value;
      const phone = document.getElementById('user-phone').value.trim();

      if (editId) {
        const idx = appState.users.findIndex((u) => u.id === editId);
        if (idx !== -1) {
          appState.users[idx] = { ...appState.users[idx], name, username, password, role, phone };
          if (currentUser && currentUser.id === editId) {
            currentUser = appState.users[idx];
            sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
            document.getElementById('sidebar-user-name').textContent = currentUser.name;
          }
        }
        showToast(`Data pengguna ${name} berhasil diperbarui.`, 'success');
      } else {
        appState.users.push({
          id: `usr-${Date.now()}`,
          name,
          username,
          password,
          role,
          phone
        });
        showToast(`Pengguna baru ${name} berhasil ditambahkan.`, 'success');
      }

      saveState(true);
      refreshAllUI();
      document.getElementById('modal-user-form').classList.add('hidden');
    });

    // Cetak PDF Bergambar & Ekspor Excel
    document.getElementById('btn-print-report').addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-export-excel').addEventListener('click', () => {
      const headers = ['No', 'Nomor Tiket', 'Judul Catatan', 'Deskripsi', 'Nama PIC', 'Tanggal Temuan', 'Batas Tenggat', 'Tanggal Selesai', 'Status', 'Foto Before', 'Foto After'];
      const rows = appState.punchLists.map((item, i) => [
        i + 1,
        item.ticket,
        item.title,
        item.description,
        item.pic,
        item.foundDate,
        item.dueDate,
        item.completedDate || '-',
        item.status,
        item.photoBefore ? 'Terlampir' : 'Kosong',
        item.photoAfter ? 'Terlampir' : 'Kosong'
      ]);

      const csvContent =
        '﻿' +
        [headers, ...rows]
          .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
          .join('
');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Laporan_PunchList_FHO_Kelompok4.csv`;
      link.click();
      showToast('File rekapitulasi Excel (.CSV) berhasil diunduh.', 'success');
    });

    // Konfigurasi Firebase Real-Time & Backup/Restore
    document.getElementById('btn-save-firebase').addEventListener('click', () => {
      const url = normalizeFirebaseUrl(document.getElementById('firebase-url-input').value);
      if (!url || !url.startsWith('https://')) {
        showToast('Masukkan URL Firebase Realtime Database yang valid (diawali https://).', 'error');
        return;
      }
      firebaseUrl = url;
      localStorage.setItem(STORAGE_KEYS.FIREBASE_URL, firebaseUrl);
      connectFirebaseRealtime(firebaseUrl, true);
    });

    document.getElementById('btn-disconnect-firebase').addEventListener('click', () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      firebaseUrl = '';
      localStorage.removeItem(STORAGE_KEYS.FIREBASE_URL);
      document.getElementById('firebase-url-input').value = '';
      updateSyncIndicators(false, 'Lokal Aktif');
      showToast('Koneksi Firebase diputuskan. Beralih ke penyimpanan lokal.', 'info');
    });

    document.getElementById('btn-backup-json').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(appState, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Backup_SIM_PUNCHLIST_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      showToast('Backup data JSON beserta seluruh foto berhasil diunduh.', 'success');
    });

    document.getElementById('input-restore-json').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const restored = JSON.parse(ev.target.result);
          if (!restored || !Array.isArray(restored.punchLists)) {
            throw new Error('Format file backup tidak valid.');
          }
          appState = {
            users: Array.isArray(restored.users) ? restored.users : appState.users,
            punchLists: restored.punchLists,
            updatedAt: Date.now()
          };
          saveState(true);
          refreshAllUI();
          showToast('Data berhasil dipulihkan dari file backup JSON!', 'success');
        } catch (err) {
          showToast('Gagal memulihkan JSON: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-reset-demo-data').addEventListener('click', () => {
      if (!confirm('Reset seluruh data kembali ke 15 dataset studi kasus latar belakang?')) return;
      appState = {
        users: createDefaultUsers(),
        punchLists: createDefaultPunchLists(),
        updatedAt: Date.now()
      };
      saveState(true);
      refreshAllUI();
      showToast('Data berhasil dikembalikan ke 15 studi kasus latar belakang.', 'success');
    });
  }

  // ==========================================================================
  // 10. INISIALISASI SAAT HALAMAN DIMUAT
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    initLoginEvents();
    initAppEvents();

    if (firebaseUrl) {
      connectFirebaseRealtime(firebaseUrl, false);
    }

    const savedSession = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (savedSession) {
      try {
        const parsedUser = JSON.parse(savedSession);
        const validUser = appState.users.find((u) => u.id === parsedUser.id);
        if (validUser) {
          currentUser = validUser;
          enterApplication();
        }
      } catch (e) {
        sessionStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    }
  });
})();
