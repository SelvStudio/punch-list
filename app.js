/* ==========================================================================
   SIM-PUNCHLIST — Real-Time Web Application Logic (GitHub Pages + Firebase)
   Kelompok 4 — Teknik Industri Universitas Pamulang
   ========================================================================== */

// 1. DATASET AWAL (15 ITEM STUDI KASUS PROYEK KONSTRUKSI)
const INITIAL_PUNCH_LISTS = [
  { id: "PL-001", title: "Konekting Kabel Rusak", desc: "Koneksi/terminasi kabel mengalami kerusakan; pemotongan ulang, penyambungan kembali & penggantian skun kabel (cable lug).", pic: "Anton", foundDate: "2026-05-21", dueDate: "2026-10-21", completedDate: "2026-10-21", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Skun kabel diganti dan diisolasi sesuai standar." },
  { id: "PL-002", title: "Konekting Kabel Rusak", desc: "Konektor/terminasi kabel mengalami kerusakan/kendur; perbaikan koneksi serta pengencangan ulang baut terminal.", pic: "Adul", foundDate: "2026-05-14", dueDate: "2026-10-14", completedDate: "2026-10-14", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Terminal dikencangkan dan diuji kontinuitas." },
  { id: "PL-003", title: "Kabel BC Belum Di Couple Ke Trafo", desc: "Kabel Bare Copper (BC) untuk sistem pembumian (grounding) belum terhubung/terpasang pada busbar/terminal grounding trafo.", pic: "Lala", foundDate: "2026-06-19", dueDate: "2026-11-19", completedDate: "", status: "In Progress", beforePhoto: "", afterPhoto: "", remarks: "Sedang pemasangan lug kabel BC pada busbar trafo." },
  { id: "PL-004", title: "Kabel BC Belum Di Couple Ke Trafo", desc: "Kabel BC grounding belum dikoneksikan ke bodi/body grounding trafo; penyambungan menggunakan klem/skun kabel.", pic: "Lili", foundDate: "2026-06-19", dueDate: "2026-10-26", completedDate: "2026-10-25", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Klem BC terpasang kencang pada body grounding trafo." },
  { id: "PL-005", title: "Kabel BC Belum Di Couple Ke Trafo", desc: "Kabel BC belum terpasang ke terminal neutral/grounding trafo; penyambungan dan pengencangan koneksi.", pic: "Adi", foundDate: "2026-06-17", dueDate: "2026-10-17", completedDate: "2026-10-16", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Terkoneksi ke terminal neutral grounding." },
  { id: "PL-006", title: "Kabel BC Belum Di Couple Ke Trafo", desc: "Kabel BC grounding belum terhubung ke trafo; terminasi kabel BC pada titik grounding trafo.", pic: "Raka", foundDate: "2026-06-19", dueDate: "2026-10-26", completedDate: "2026-10-24", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Terminasi BC selesai dan diverifikasi." },
  { id: "PL-007", title: "Kabel BC Belum Di Couple Ke Trafo", desc: "Penyambungan kabel BC ke grounding trafo belum dilakukan; persiapkan lug kabel dan pembautan terminal trafo.", pic: "Andri", foundDate: "2026-07-01", dueDate: "2026-11-16", completedDate: "2026-11-14", status: "Completed", beforePhoto: "", afterPhoto: "", remarks: "Lug kabel BC sudah dibaut ke trafo, menunggu verifikasi." },
  { id: "PL-008", title: "Kabel BC Belum Di Couple Ke Trafo", desc: "Kabel BC grounding menggantung dan belum terhubung ke trafo; terminasi dan pengukuran tahanan grounding.", pic: "Amira", foundDate: "2026-06-19", dueDate: "2026-11-21", completedDate: "", status: "Open", beforePhoto: "", afterPhoto: "", remarks: "Menunggu jadwal pemadaman singkat trafo." },
  { id: "PL-009", title: "Konekting Kabel Rusak", desc: "Konektor/skun kabel mengalami kerusakan/korosi; penggantian konektor baru dan isolasi ulang.", pic: "Asep", foundDate: "2026-06-18", dueDate: "2026-10-18", completedDate: "2026-10-18", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Konektor baru terpasang dan terisolasi kedap air." },
  { id: "PL-010", title: "Lampu Mati", desc: "Lampu penerangan tidak menyala (RCL-221); pengecekan suplai daya, sakelar, ballast, dan penggantian bohlam.", pic: "Ali", foundDate: "2026-05-12", dueDate: "2026-10-12", completedDate: "2026-10-10", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Lampu RCL-221 sudah menyala normal." },
  { id: "PL-011", title: "Konekting Kabel Rusak", desc: "Koneksi kabel terbakar/rusak; perbaikan kabel, penggantian terminal block/skun, serta pengujian kontinuitas.", pic: "Aca", foundDate: "2026-06-17", dueDate: "2026-10-10", completedDate: "2026-10-09", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Skun baru terpasang, hasil uji kontinuitas baik." },
  { id: "PL-012", title: "Lampu Mati", desc: "Armatur/bohlam lampu mati (RCL-225); pemeriksaan pengkabelan fasa-netral dan penggantian armatur.", pic: "Dul", foundDate: "2026-05-12", dueDate: "2026-10-12", completedDate: "2026-10-11", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Lampu RCL-225 menyala terang setelah penggantian." },
  { id: "PL-013", title: "Konekting Kabel Rusak", desc: "Terminasi kabel terkelupas/rusak; pemotongan bagian kabel rusak dan pemasangan skun kabel baru.", pic: "Ramzi", foundDate: "2026-06-18", dueDate: "2026-10-18", completedDate: "2026-10-17", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Terminasi ulang selesai." },
  { id: "PL-014", title: "Konekting Kabel Rusak", desc: "Koneksi sambungan kabel tidak sempurna/rusak; terminasi ulang dan pengencangan sesuai spesifikasi baut.", pic: "Rehan", foundDate: "2026-06-18", dueDate: "2026-10-18", completedDate: "2026-10-18", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Sambungan kabel diperbaiki & diisolasi." },
  { id: "PL-015", title: "Konekting Kabel Rusak", desc: "Koneksi kabel cacat/rusak; penggantian aksesoris sambungan dan pengujian isolasi kabel (megger test).", pic: "Rizal", foundDate: "2026-06-18", dueDate: "2026-10-18", completedDate: "2026-10-18", status: "Verified/Closed", beforePhoto: "", afterPhoto: "", remarks: "Megger test lulus, item diverifikasi." }
];

const INITIAL_LOGS = [
  { timestamp: "2026-11-14 09:15", ticket: "PL-007", actor: "Andri (PIC)", transition: "In Progress -> Completed", remarks: "Lug kabel BC sudah dibaut ke trafo & foto After diunggah." },
  { timestamp: "2026-10-21 14:30", ticket: "PL-001", actor: "Manajemen Utama", transition: "Completed -> Verified/Closed", remarks: "Foto Before-After sesuai standar teknis." }
];

// 2. STATE APLIKASI
let punchLists = [];
let progressLogs = [];
let currentUser = { role: "mgmt", picName: "ALL", email: "manajemen.proyek@kontraktor.co.id" };
let firebaseDb = null;
let isCloudConnected = false;

let tempBeforeBase64 = "";
let tempAfterBase64 = "";

// 3. INISIALISASI SAAT HALAMAN DIMUAT
$(document).ready(function () {
  populatePicDropdowns();
  initStorageAndSync();
  bindEvents();
});

function populatePicDropdowns() {
  const pics = [...new Set(INITIAL_PUNCH_LISTS.map(i => i.pic))].sort();
  pics.forEach(p => {
    $("#loginPicName").append(`<option value="${p}">${p}</option>`);
    $("#filterPic").append(`<option value="${p}">${p}</option>`);
  });
}

// 4. SINKRONISASI DATA (FIREBASE REALTIME DB ATAU LOCALSTORAGE FALLBACK)
function initStorageAndSync() {
  const savedCloudUrl = localStorage.getItem("sim_punchlist_firebase_url");
  if (savedCloudUrl) {
    $("#firebaseDbUrlInput").val(savedCloudUrl);
    connectFirebase(savedCloudUrl);
  } else {
    loadFromLocalStorage();
  }
}

function loadFromLocalStorage() {
  isCloudConnected = false;
  updateSyncIndicators(false);
  const localItems = localStorage.getItem("sim_punchlist_items");
  const localLogs = localStorage.getItem("sim_punchlist_logs");

  if (localItems) {
    punchLists = JSON.parse(localItems);
    progressLogs = localLogs ? JSON.parse(localLogs) : [...INITIAL_LOGS];
  } else {
    punchLists = JSON.parse(JSON.stringify(INITIAL_PUNCH_LISTS));
    progressLogs = JSON.parse(JSON.stringify(INITIAL_LOGS));
    saveToLocalStorage();
  }
  renderAll();
}

function saveToLocalStorage() {
  localStorage.setItem("sim_punchlist_items", JSON.stringify(punchLists));
  localStorage.setItem("sim_punchlist_logs", JSON.stringify(progressLogs));
}

function connectFirebase(dbUrl) {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp({ databaseURL: dbUrl });
    }
    firebaseDb = firebase.database();

    // Listener Real-Time untuk Punch Lists
    firebaseDb.ref("punch_lists").on("value", (snapshot) => {
      const val = snapshot.val();
      if (val) {
        punchLists = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
      } else {
        // Seed initial data to Firebase if empty
        firebaseDb.ref("punch_lists").set(INITIAL_PUNCH_LISTS);
        punchLists = JSON.parse(JSON.stringify(INITIAL_PUNCH_LISTS));
      }
      isCloudConnected = true;
      updateSyncIndicators(true);
      renderAll();
    });

    // Listener Real-Time untuk Progress Logs
    firebaseDb.ref("progress_logs").on("value", (snapshot) => {
      const val = snapshot.val();
      if (val) {
        progressLogs = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
      } else {
        firebaseDb.ref("progress_logs").set(INITIAL_LOGS);
        progressLogs = JSON.parse(JSON.stringify(INITIAL_LOGS));
      }
      renderAuditLogs();
    });
  } catch (err) {
    alert("Gagal menghubungkan ke Firebase URL: " + err.message);
    loadFromLocalStorage();
  }
}

function persistData() {
  if (isCloudConnected && firebaseDb) {
    firebaseDb.ref("punch_lists").set(punchLists);
    firebaseDb.ref("progress_logs").set(progressLogs);
  } else {
    saveToLocalStorage();
    renderAll();
  }
}

function updateSyncIndicators(online) {
  if (online) {
    $("#loginSyncStatus").html('<span class="sync-dot sync-online"></span>Terhubung Cloud Real-Time (Multi-Jaringan Aktif)');
    $("#topbarSyncBadge")
      .removeClass("badge-warning")
      .addClass("badge-success")
      .html('<span class="sync-dot sync-online"></span>Cloud Real-Time Aktif (Lintas Jaringan)');
  } else {
    $("#loginSyncStatus").html('<span class="sync-dot sync-local"></span>Mode Lokal (Klik "Atur Cloud Sync" untuk Lintas Jaringan)');
    $("#topbarSyncBadge")
      .removeClass("badge-success")
      .addClass("badge-warning")
      .html('<span class="sync-dot sync-local"></span>Mode Lokal (Single Device)');
  }
}

// 5. ALGORITMA EARLY WARNING SYSTEM (4 ZONA KENDALI)
function computeEarlyWarning(item) {
  if (item.status === "Verified/Closed") {
    return { label: "Tuntas (Aman)", badgeClass: "badge-ew-green", isUrgent: false };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(item.dueDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `Merah (Overdue ${Math.abs(diffDays)} hr)`, badgeClass: "badge-ew-red", isUrgent: true };
  } else if (diffDays <= 3) {
    return { label: `Oranye (Kritis H-${diffDays})`, badgeClass: "badge-ew-orange", isUrgent: true };
  } else if (diffDays <= 14) {
    return { label: `Kuning (Perhatian H-${diffDays})`, badgeClass: "badge-ew-yellow", isUrgent: false };
  } else {
    return { label: `Hijau (Normal H-${diffDays})`, badgeClass: "badge-ew-green", isUrgent: false };
  }
}

function getStatusPill(status) {
  const map = {
    "Open": "st-open",
    "In Progress": "st-progress",
    "Pending": "st-pending",
    "Completed": "st-completed",
    "Verified/Closed": "st-verified"
  };
  return `<span class="status-pill ${map[status] || 'st-open'}">${status}</span>`;
}

// 6. RENDERING KOMPONEN ANTARMUKA
function getVisibleItems() {
  if (currentUser.role === "pic" && currentUser.picName !== "ALL") {
    return punchLists.filter(i => i.pic.toLowerCase() === currentUser.picName.toLowerCase());
  }
  return punchLists;
}

function renderAll() {
  const items = getVisibleItems();
  $("#navCountBadge").text(items.length);

  // Hitung KPI
  const total = items.length;
  const active = items.filter(i => ["Open", "In Progress", "Pending"].includes(i.status)).length;
  const verified = items.filter(i => i.status === "Verified/Closed").length;
  const urgentItems = items.filter(i => computeEarlyWarning(i).isUrgent);

  $("#kpiTotal").text(total);
  $("#kpiActive").text(active);
  $("#kpiWarning").text(urgentItems.length);
  $("#kpiVerified").text(verified);
  const pct = total > 0 ? ((verified / total) * 100).toFixed(1) : 0;
  $("#kpiVerifiedPct").text(`${pct}% tuntas terverifikasi`);

  renderCategoryProgress(items);
  renderEarlyWarningPanel(urgentItems);
  renderDashboardTable(items);
  renderFullListTable(items);
  renderReportTable(items);
  renderAuditLogs();
  updateNextTicketNumber();
}

function renderCategoryProgress(items) {
  const categories = [
    { name: "Konekting Kabel Rusak", keyword: "Konekting", color: "bg-primary" },
    { name: "Kabel BC Belum Di Couple Ke Trafo", keyword: "Kabel BC", color: "bg-info" },
    { name: "Lampu Penerangan Mati", keyword: "Lampu", color: "bg-success" }
  ];

  let html = "";
  categories.forEach(cat => {
    const matched = items.filter(i => i.title.toLowerCase().includes(cat.keyword.toLowerCase()));
    const done = matched.filter(i => i.status === "Verified/Closed").length;
    const tot = matched.length;
    const p = tot > 0 ? Math.round((done / tot) * 100) : 0;

    html += `
      <div class="mb-3">
        <div class="d-flex justify-content-between small font-weight-bold mb-1">
          <span>${cat.name} (${tot} Item)</span>
          <span>${done}/${tot} Verified (${p}%)</span>
        </div>
        <div class="progress" style="height: 12px; border-radius: 6px;">
          <div class="progress-bar ${cat.color}" role="progressbar" style="width: ${p}%"></div>
        </div>
      </div>
    `;
  });
  $("#categoryProgressContainer").html(html);
}

function renderEarlyWarningPanel(urgentItems) {
  if (urgentItems.length === 0) {
    $("#earlyWarningPanel").html(`
      <div class="text-center text-success py-4">
        <i class="fas fa-check-circle fa-2x mb-2"></i>
        <div class="font-weight-bold">Tidak Ada Item Kritis / Terlambat</div>
        <div class="small text-muted">Seluruh pekerjaan terkendali dalam masa pemeliharaan 5 bulan.</div>
      </div>
    `);
    return;
  }

  let html = "";
  urgentItems.forEach(item => {
    const ew = computeEarlyWarning(item);
    html += `
      <div class="p-2 mb-2 rounded border d-flex justify-content-between align-items-center" style="background:#fff5f5;">
        <div>
          <div class="font-weight-bold small">${item.id} — ${item.title} (PIC: ${item.pic})</div>
          <span class="badge ${ew.badgeClass}">${ew.label}</span>
        </div>
        <button class="btn btn-xs btn-sm btn-outline-danger" onclick="openItemModal('${item.id}')">Tindak Lanjut</button>
      </div>
    `;
  });
  $("#earlyWarningPanel").html(html);
}

function renderDashboardTable(items) {
  let rows = "";
  items.forEach(item => {
    const ew = computeEarlyWarning(item);
    const photoStatus = (item.beforePhoto && item.afterPhoto)
      ? '<span class="text-success font-weight-bold"><i class="fas fa-images"></i> Before & After</span>'
      : (item.afterPhoto ? '<span class="text-info">After Ada</span>' : '<span class="text-muted">Belum Lengkap</span>');

    rows += `
      <tr>
        <td class="font-weight-bold">${item.id}</td>
        <td>
          <div class="font-weight-bold">${item.title}</div>
          <div class="text-muted text-truncate" style="max-width:260px;">${item.desc}</div>
        </td>
        <td>${item.pic}</td>
        <td>${item.dueDate}</td>
        <td><span class="badge ${ew.badgeClass} px-2 py-1">${ew.label}</span></td>
        <td>${getStatusPill(item.status)}</td>
        <td>${photoStatus}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-primary" onclick="openItemModal('${item.id}')">
            <i class="fas fa-edit"></i> Detail / Update
          </button>
        </td>
      </tr>
    `;
  });
  $("#dashboardTableBody").html(rows);
}

function renderFullListTable(items) {
  const q = ($("#searchInput").val() || "").toLowerCase();
  const st = $("#filterStatus").val();
  const pic = $("#filterPic").val();

  const filtered = items.filter(item => {
    const matchQ = item.id.toLowerCase().includes(q) || item.title.toLowerCase().includes(q) || item.pic.toLowerCase().includes(q);
    const matchSt = (st === "ALL") || (item.status === st);
    const matchPic = (pic === "ALL") || (item.pic === pic);
    return matchQ && matchSt && matchPic;
  });

  let rows = "";
  filtered.forEach(item => {
    const ew = computeEarlyWarning(item);
    rows += `
      <tr>
        <td class="font-weight-bold">${item.id}</td>
        <td class="font-weight-bold">${item.title}</td>
        <td>${item.desc}</td>
        <td>${item.pic}</td>
        <td>${item.foundDate}</td>
        <td>${item.dueDate}</td>
        <td><span class="badge ${ew.badgeClass}">${ew.label}</span></td>
        <td>${getStatusPill(item.status)}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-primary" onclick="openItemModal('${item.id}')">Buka</button>
        </td>
      </tr>
    `;
  });
  $("#fullListTableBody").html(rows || '<tr><td colspan="9" class="text-center text-muted py-3">Data tidak ditemukan.</td></tr>');
}

function renderReportTable(items) {
  let rows = "";
  items.forEach((item, idx) => {
    rows += `
      <tr>
        <td class="text-center">${idx + 1}</td>
        <td class="font-weight-bold">${item.id}</td>
        <td>${item.title}</td>
        <td>${item.desc}</td>
        <td>${item.pic}</td>
        <td>${item.foundDate}</td>
        <td>${item.completedDate || "-"}</td>
        <td class="font-weight-bold">${item.status}</td>
        <td>${item.afterPhoto ? "Terlampir (Valid)" : "Dokumentasi Lapangan"}</td>
      </tr>
    `;
  });
  $("#reportTableBody").html(rows);
}

function renderAuditLogs() {
  let rows = "";
  progressLogs.slice().reverse().forEach(log => {
    rows += `
      <tr>
        <td>${log.timestamp}</td>
        <td class="font-weight-bold">${log.ticket}</td>
        <td>${log.actor}</td>
        <td><span class="badge badge-info">${log.transition}</span></td>
        <td>${log.remarks}</td>
      </tr>
    `;
  });
  $("#auditLogTableBody").html(rows);
}

function updateNextTicketNumber() {
  const num = punchLists.length + 1;
  $("#newTicket").val(`PL-${String(num).padStart(3, "0")}`);
}

// 7. KOMPRESI GAMBAR OTOMATIS AGAR CEPAT SYNC KE CLOUD
function compressImageFile(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const MAX_W = 640;
      const scale = Math.min(1, MAX_W / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// 8. MODAL DETAIL, POKA-YOKE VALIDATION & VERIFIKASI
window.openItemModal = function (itemId) {
  const item = punchLists.find(i => i.id === itemId);
  if (!item) return;

  $("#editItemId").val(item.id);
  $("#modalItemTitle").text(`${item.id} — ${item.title} (PIC: ${item.pic})`);
  $("#modalItemMeta").html(`
    <strong>Deskripsi Teknis:</strong> ${item.desc}<br/>
    <strong>Tanggal Temuan:</strong> ${item.foundDate} &nbsp;|&nbsp; <strong>Batas Tenggat:</strong> ${item.dueDate}
  `);

  tempBeforeBase64 = item.beforePhoto || "";
  tempAfterBase64 = item.afterPhoto || "";

  $("#beforePhotoBox").html(tempBeforeBase64 ? `<img src="${tempBeforeBase64}" alt="Before" />` : '<span class="text-muted small">Belum ada foto Before</span>');
  $("#afterPhotoBox").html(tempAfterBase64 ? `<img src="${tempAfterBase64}" alt="After" />` : '<span class="text-muted small">Belum ada foto After</span>');

  $("#uploadBeforeInput").val("");
  $("#uploadAfterInput").val("");
  $("#editItemStatus").val(item.status);
  $("#editItemRemarks").val(item.remarks || "");
  $("#pokaYokeAlert").hide();

  // RBAC: Hanya Manajemen yang dapat menyetujui status Verified/Closed atau menghapus item
  if (currentUser.role === "mgmt") {
    $(".mgmt-option").prop("disabled", false);
    $("#deleteItemBtn").show();
  } else {
    $(".mgmt-option").prop("disabled", true);
    $("#deleteItemBtn").hide();
  }

  $("#itemDetailModal").modal("show");
};

// 9. EVENT HANDLERS
function bindEvents() {
  // Login Role Toggle
  $("#loginRole").on("change", function () {
    if ($(this).val() === "pic") {
      $("#picSelectGroup").slideDown(150);
      $("#loginEmail").val("tim.lapangan@kontraktor.co.id");
    } else {
      $("#picSelectGroup").slideUp(150);
      $("#loginEmail").val("manajemen.proyek@kontraktor.co.id");
    }
  });

  // Login Submit
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    const role = $("#loginRole").val();
    const picName = $("#loginPicName").val();
    currentUser = {
      role: role,
      picName: role === "pic" ? picName : "ALL",
      email: $("#loginEmail").val()
    };

    if (role === "mgmt") {
      $("#sidebarUserRole").text("Role: Manajemen Kontraktor Utama");
      $(".mgmt-only").show();
    } else {
      $("#sidebarUserRole").text(`Role: Tim Lapangan (${picName === "ALL" ? "Semua PIC" : picName})`);
      $(".mgmt-only").hide();
    }

    $("#loginView").hide();
    $("#appView").show();
    renderAll();
  });

  $("#logoutBtn").on("click", function () {
    $("#appView").hide();
    $("#loginView").show();
  });

  // Navigation Tabs
  $(".sidebar .nav-link").on("click", function () {
    const tabId = $(this).data("tab");
    if (tabId) switchTab(tabId);
  });

  $("#openSidebarBtn").on("click", () => $("#sidebarMenu").addClass("show"));
  $("#closeSidebarBtn").on("click", () => $("#sidebarMenu").removeClass("show"));

  // Filter Listeners
  $("#searchInput, #filterStatus, #filterPic").on("input change", () => renderFullListTable(getVisibleItems()));
  $("#clearFilterBtn").on("click", () => {
    $("#searchInput").val("");
    $("#filterStatus").val("ALL");
    $("#filterPic").val("ALL");
    renderFullListTable(getVisibleItems());
  });

  // Add New Punch List Item
  $("#addPunchForm").on("submit", function (e) {
    e.preventDefault();
    const fileInput = $("#newBeforePhoto")[0];
    const finalizeAdd = (beforeImg) => {
      const newItem = {
        id: $("#newTicket").val(),
        title: $("#newTitle").val(),
        desc: $("#newDesc").val(),
        pic: $("#newPic").val(),
        foundDate: $("#newFoundDate").val(),
        dueDate: $("#newDueDate").val(),
        completedDate: "",
        status: "Open",
        beforePhoto: beforeImg,
        afterPhoto: "",
        remarks: "Item baru dicatat oleh Manajemen."
      };
      punchLists.push(newItem);
      progressLogs.push({
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        ticket: newItem.id,
        actor: "Manajemen Utama",
        transition: "Baru -> Open",
        remarks: `Ditugaskan ke PIC ${newItem.pic}`
      });
      persistData();
      this.reset();
      switchTab("tabDashboard");
    };

    if (fileInput.files && fileInput.files[0]) {
      compressImageFile(fileInput.files[0], finalizeAdd);
    } else {
      finalizeAdd("");
    }
  });

  // Upload Photo Listeners inside Modal
  $("#uploadBeforeInput").on("change", function () {
    if (this.files && this.files[0]) {
      compressImageFile(this.files[0], (b64) => {
        tempBeforeBase64 = b64;
        $("#beforePhotoBox").html(`<img src="${b64}" alt="Before" />`);
      });
    }
  });

  $("#uploadAfterInput").on("change", function () {
    if (this.files && this.files[0]) {
      compressImageFile(this.files[0], (b64) => {
        tempAfterBase64 = b64;
        $("#afterPhotoBox").html(`<img src="${b64}" alt="After" />`);
        $("#pokaYokeAlert").hide();
      });
    }
  });

  // Save Changes with Poka-Yoke Photo Enforcement
  $("#saveItemChangesBtn").on("click", function () {
    const id = $("#editItemId").val();
    const idx = punchLists.findIndex(i => i.id === id);
    if (idx === -1) return;

    const newStatus = $("#editItemStatus").val();
    const newRemarks = $("#editItemRemarks").val();

    // ATURAN POKA-YOKE: Tolak status Completed / Verified jika Foto After kosong
    if ((newStatus === "Completed" || newStatus === "Verified/Closed") && !tempAfterBase64) {
      $("#pokaYokeAlert").slideDown(150);
      return;
    }

    const oldStatus = punchLists[idx].status;
    punchLists[idx].status = newStatus;
    punchLists[idx].remarks = newRemarks;
    punchLists[idx].beforePhoto = tempBeforeBase64;
    punchLists[idx].afterPhoto = tempAfterBase64;

    if ((newStatus === "Completed" || newStatus === "Verified/Closed") && !punchLists[idx].completedDate) {
      punchLists[idx].completedDate = new Date().toISOString().slice(0, 10);
    }

    progressLogs.push({
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      ticket: id,
      actor: currentUser.role === "mgmt" ? "Manajemen Utama" : `${punchLists[idx].pic} (PIC)`,
      transition: `${oldStatus} -> ${newStatus}`,
      remarks: newRemarks || "Pembaruan progres lapangan."
    });

    persistData();
    $("#itemDetailModal").modal("hide");
  });

  // Delete Item (Manajemen Only)
  $("#deleteItemBtn").on("click", function () {
    const id = $("#editItemId").val();
    if (confirm(`Hapus item ${id} dari basis data?`)) {
      punchLists = punchLists.filter(i => i.id !== id);
      persistData();
      $("#itemDetailModal").modal("hide");
    }
  });

  // Cloud Sync Configuration Modal
  $("#saveCloudConfigBtn").on("click", function () {
    const url = $("#firebaseDbUrlInput").val().trim();
    if (!url) {
      alert("Masukkan URL Firebase Realtime Database terlebih dahulu.");
      return;
    }
    localStorage.setItem("sim_punchlist_firebase_url", url);
    $("#cloudConfigModal").modal("hide");
    connectFirebase(url);
  });

  $("#disconnectCloudBtn").on("click", function () {
    localStorage.removeItem("sim_punchlist_firebase_url");
    location.reload();
  });

  // Reset Demo Data
  $("#resetDemoBtn").on("click", function () {
    if (confirm("Kembalikan seluruh data ke 15 item studi kasus awal?")) {
      punchLists = JSON.parse(JSON.stringify(INITIAL_PUNCH_LISTS));
      progressLogs = JSON.parse(JSON.stringify(INITIAL_LOGS));
      persistData();
    }
  });

  // Export Excel (.XLSX)
  $("#exportExcelBtn").on("click", function () {
    const exportRows = getVisibleItems().map((item, idx) => ({
      "No": idx + 1,
      "Nomor Tiket": item.id,
      "Judul Catatan": item.title,
      "Deskripsi Perbaikan": item.desc,
      "Nama PIC": item.pic,
      "Tanggal Temuan": item.foundDate,
      "Batas Tenggat": item.dueDate,
      "Tanggal Selesai": item.completedDate || "-",
      "Status Akhir": item.status,
      "Catatan Verifikasi": item.remarks
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap_Punch_List_FHO");
    XLSX.writeFile(wb, "Berita_Acara_Punch_List_FHO.xlsx");
  });
}

window.switchTab = function (tabId) {
  $(".app-tab").hide();
  $(`#${tabId}`).fadeIn(150);
  $(".sidebar .nav-link").removeClass("active");
  $(`.sidebar .nav-link[data-tab="${tabId}"]`).addClass("active");
  $("#sidebarMenu").removeClass("show");
};
