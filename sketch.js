/**
 * VIRTUAL LAB LISTRIK ARUS SEARAH (DC) - Fase F
 * Kurikulum Merdeka - Fisika XII
 * Format: Single File p5.js Ready Sketch with Structured Modules
 */

/* ========================================================================= */
/* SECTION 1: GLOBAL STATE & PHYSICS CONFIGURATION                           */
/* ========================================================================= */

// Active Sub-Materi State
let currentSubMateri = 'ohm';
let showElectronFlow = true;
let showVectors = true;
let animOffset = 0;

// Kelompok 10 Team Identity Data
let teamInfo = {
  groupName: "Kelompok 10",
  classInfo: "Sains Komputasi",
  members: [
    { name: "Adinda Amelia", noAbsen: "140820260023" },
    { name: "Rizki Syahfina B", noAbsen: "140820260026" },
    { name: "Wiji Susilowati", noAbsen: "140820260041" },
    ]
};

// Physics Simulation Parameters
let physicsState = {
  // Sub 1: Hukum Ohm
  voltage: 12.0,      // Volt
  resistance: 10.0,   // Ohm
  loadType: 'ohmic',  // 'ohmic', 'filament', 'diode'
  
  // Sub 2: Hambatan Jenis Kawat
  material: 'tembaga', // 'tembaga', 'aluminium', 'nikrom', 'karbon'
  length: 50.0,        // meter
  area: 2.0,           // mm^2
  temperature: 25.0,   // Celsius

  // Sub 3: Seri-Paralel Lampu
  circuitMode: 'seri', // 'seri', 'paralel', 'campuran'
  vSource: 12.0,
  rLampu1: 10.0,
  rLampu2: 10.0,
  rLampu3: 10.0,
  sw1: true,
  sw2: true,
  sw3: true,

  // Sub 4: Kirchhoff
  v1: 12.0,
  v2: 6.0,
  rk1: 10.0,
  rk2: 20.0,
  rk3: 30.0,

  // Sub 5: Daya Listrik & CO2
  deviceType: 'ac',
  deviceCount: 2,
  devicePower: 400,    // Watt
  hoursPerDay: 8,      // Jam
  kwhTariff: 1444.70   // Rp/kWh
};

// Material Resistivity Database (at 20°C)
const materialData = {
  tembaga: { name: 'Tembaga (Copper)', rho0: 1.68e-8, alpha: 0.00386, color: '#f97316' },
  aluminium: { name: 'Aluminium', rho0: 2.82e-8, alpha: 0.0039, color: '#94a3b8' },
  nikrom: { name: 'Nikrom (Ni-Cr)', rho0: 100.0e-8, alpha: 0.0004, color: '#ec4899' },
  karbon: { name: 'Karbon (Carbon)', rho0: 3500.0e-8, alpha: -0.0005, color: '#475569' }
};

// Log LKPD Table Storage
let tableDataLog = [];

// Learning Topics Database
const subMateriDatabase = {
  ohm: {
    title: "1. Hukum Ohm & Karakteristik Ohmik vs Non-Ohmik",
    pemantik: "Mengapa hambatan listrik pada lampu pijar dapat berubah saat suhunya makin panas?",
    misi: [
      "1. Ubah nilai Tegangan (V) dari 2V hingga 24V, amati perubahan nilai Arus (I).",
      "2. Bandingkan grafik V-I pada Resistor Ohmik (linier) vs Lampu Filamen (non-linier).",
      "3. Catat sekurang-kurangnya 3 data pengamatan ke dalam tabel LKPD."
    ],
    quiz: {
      q: "Jika tegangan baterai dilipatgandakan menjadi 2x lipat pada resistor ideal, apa yang terjadi pada arus listrik?",
      a: ["Arus menjadi 2x lebih besar", "Arus menjadi 1/2 kali", "Arus tetap sama", "Arus menjadi 4x lebih besar"],
      correct: 0,
      exp: "Menurut Hukum Ohm (I = V/R), Arus (I) berbanding lurus secara linier dengan Tegangan (V)."
    },
    theory: `
      <p><b class="text-brand-600">Hukum Ohm</b> menyatakan bahwa arus listrik (<code class="text-amber-600 font-mono">I</code>) sebanding dengan beda potensial (<code class="text-blue-600 font-mono">V</code>) dan berbanding terbalik dengan hambatan (<code class="text-rose-600 font-mono">R</code>).</p>
      <div class="bg-slate-100 p-2.5 rounded-lg border border-slate-200 font-mono text-center text-brand-700 font-bold my-2">
        V = I × R &nbsp;|&nbsp; I = V / R
      </div>
      <p><b class="text-emerald-600">Komponen Ohmik:</b> R konstan (Grafik V-I garislurus).</p>
      <p><b class="text-rose-600">Komponen Non-Ohmik:</b> R berubah akibat pengaruh suhu dan potensial.</p>
    `
  },
  kawat: {
    title: "2. Hambatan Jenis Kawat Penghantar (R = ρ·L/A)",
    pemantik: "Mengapa kabel transmisi listrik jarak jauh tebal dan berbahan alumunium/tembaga murni?",
    misi: [
      "1. Amati efek perubahan Panjang Kawat (L) terhadap nilai Hambatan (R).",
      "2. Perbesar Luas Penampang (A) kawat dan amati kemudahan aliran elektron.",
      "3. Naikkan Suhu (T) kawat dan perhatikan getaran termal atom logam."
    ],
    quiz: {
      q: "Manakah tindakan yang paling efektif untuk memperkecil hambatan kawat penghantar?",
      a: ["Memperbesar luas penampang (A) dan memperpendek kawat (L)", "Memperpanjang kawat dan memanaskannya", "Mengecilkan luas penampang A", "Menggunakan kawat Karbon"],
      correct: 0,
      exp: "Hambatan R berbanding terbalik dengan Luas Penampang (A) dan berbanding lurus dengan Panjang (L)."
    },
    theory: `
      <p>Hambatan kawat dipengaruhi oleh <b class="text-brand-600">hambatan jenis (ρ)</b>, <b class="text-rose-600">panjang (L)</b>, dan <b class="text-amber-600">luas penampang (A)</b>.</p>
      <div class="bg-slate-100 p-2.5 rounded-lg border border-slate-200 font-mono text-center text-rose-600 font-bold my-2">
        R = ρ × (L / A)
      </div>
      <p>Suhu (T): <code class="text-slate-700 font-mono">ρ(T) = ρ₀ × [1 + α(T - 20°C)]</code>.</p>
    `
  },
  seri_paralel: {
    title: "3. Rangkaian Kombinasi Seri-Paralel Lampu",
    pemantik: "Mengapa instalasi listrik rumah tangga selalu dirangkai secara paralel, bukan seri?",
    misi: [
      "1. Bandingkan kecerahan lampu pada konfigurasi Seri vs Paralel.",
      "2. Matikan sakelar salah satu cabang pada rangkaian paralel dan amati lampu cabang lain.",
      "3. Hitung hambatan total pengganti (R_total) pada kedua mode."
    ],
    quiz: {
      q: "Pada 3 lampu paralel, jika 1 lampu dipadamkan, bagaimana dengan 2 lampu lainnya?",
      a: ["Lampu lain tetap menyala terang", "Lampu lain ikut mati total", "Lampu lain menjadi redup", "Lampu lain meledak"],
      correct: 0,
      exp: "Paralel memiliki jalur independen sehingga tiap cabang menerima tegangan sumber penuh."
    },
    theory: `
      <p><b class="text-amber-600">Rangkaian Seri:</b> Arus sama (I_tot = I1 = I2), Hambatan bertambah besar.</p>
      <p><b class="text-brand-600">Rangkaian Paralel:</b> Tegangan sama (V_tot = V1 = V2), Hambatan total makin kecil.</p>
    `
  },
  kirchhoff: {
    title: "4. Hukum I & II Kirchhoff (Rangkaian Majemuk Dual Loop)",
    pemantik: "Bagaimana cara memprediksi arah aliran arus pada rangkaian dengan dua sumber baterai berbeda?",
    misi: [
      "1. Atur nilai Baterai E1 dan E2 dengan tegangan yang berbeda.",
      "2. Amati simpul persimpangan (Junction) dan verifikasi Σ I_masuk = Σ I_keluar.",
      "3. Perhatikan arah panah vektor arus pada masing-masing cabang."
    ],
    quiz: {
      q: "Hukum II Kirchhoff merupakan bentuk hukum kekekalan dari besaran apa?",
      a: ["Kekekalan Energi Listrik", "Kekekalan Massa", "Kekekalan Momentum", "Kekekalan Gaya Magnet"],
      correct: 0,
      exp: "Hukum II Kirchhoff (Sigma V = 0) didasarkan pada kekekalan energi potensial listrik."
    },
    theory: `
      <p><b class="text-amber-600">Hukum I Kirchhoff:</b> Σ I_masuk = Σ I_keluar pada simpul persimpangan.</p>
      <p><b class="text-brand-600">Hukum II Kirchhoff:</b> Σ E + Σ (I × R) = 0 pada loop tertutup.</p>
    `
  },
  daya: {
    title: "5. Daya Listrik, Energi & Dampak Lingkungan (CO₂)",
    pemantik: "Bagaimana perilaku hemat listrik di rumah dapat secara langsung mengurangi emisi karbon bumi?",
    misi: [
      "1. Pilih jenis alat listrik rumah tangga (AC, Kulkas, TV, Lampu LED).",
      "2. Geser lama pemakaian harian dan amati estimasi tagihan PLN bulanan.",
      "3. Amati estimasi Emisi Karbon (CO₂) yang dihasilkan dalam 1 bulan."
    ],
    quiz: {
      q: "1 kWh (Kilo Watt Hour) setara dengan konsumsi energi listrik sebesar berapa Joule?",
      a: ["3,600,000 Joule (3.6 MJ)", "1,000 Joule", "360,000 Joule", "100,000 Joule"],
      correct: 0,
      exp: "1 kWh = 1,000 Watt x 3,600 detik = 3,600,000 Joule."
    },
    theory: `
      <p><b class="text-emerald-600">Daya Listrik (P):</b> Laju energi listrik (P = V × I).</p>
      <p><b class="text-amber-600">Energi Listrik (E):</b> E = P × t (kWh).</p>
      <p><b class="text-rose-600">Emisi Karbon:</b> 1 kWh listrik ~0.85 kg emisi CO₂.</p>
    `
  }
};

/* ========================================================================= */
/* SECTION 2: STYLES & DOM UI GENERATOR                                      */
/* ========================================================================= */

function injectExternalStyles() {
  if (!document.getElementById('tailwind-cdn')) {
    const twScript = document.createElement('script');
    twScript.id = 'tailwind-cdn';
    twScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(twScript);
  }

  if (!document.getElementById('fontawesome-cdn')) {
    const faLink = document.createElement('link');
    faLink.id = 'fontawesome-cdn';
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(faLink);
  }

  if (!document.getElementById('google-fonts-cdn')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'google-fonts-cdn';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap';
    document.head.appendChild(fontLink);
  }

  const styleTag = document.createElement('style');
  styleTag.textContent = `
    body { background-color: #f8fafc; color: #1e293b; font-family: 'Plus Jakarta Sans', sans-serif; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    input[type=range] { -webkit-appearance: none; background: #e2e8f0; border-radius: 8px; height: 8px; }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; height: 20px; width: 20px; border-radius: 50%;
      background: #4f46e5; cursor: pointer; box-shadow: 0 2px 6px rgba(79, 70, 229, 0.4);
      transition: all 0.2s ease-in-out;
    }
    input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.15); background: #4338ca; }
    .bg-brand-50 { background-color: #f0f3ff; }
    .bg-brand-100 { background-color: #e0e7ff; }
    .bg-brand-600 { background-color: #4338ca; }
    .bg-brand-700 { background-color: #3730a3; }
    .text-brand-500 { color: #4f46e5; }
    .text-brand-600 { color: #4338ca; }
    .text-brand-700 { color: #3730a3; }
    .border-brand-200 { border-color: #c7d2fe; }
    .text-physics-voltage { color: #2563eb; }
    .text-physics-current { color: #d97706; }
    .text-physics-resistance { color: #e11d48; }
  `;
  document.head.appendChild(styleTag);
}

function createVirtualLabDOM() {
  injectExternalStyles();

  let rootContainer = document.getElementById('vlab-root');
  if (!rootContainer) {
    rootContainer = document.createElement('div');
    rootContainer.id = 'vlab-root';
    rootContainer.className = 'min-h-screen flex flex-col justify-between selection:bg-brand-500 selection:text-white';
    document.body.appendChild(rootContainer);
  }

  rootContainer.innerHTML = `
    <!-- TOP NAVIGATION HEADER -->
    <header class="bg-gradient-to-r from-indigo-950 via-indigo-800 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
            <i class="fa-solid fa-bolt text-amber-300 text-xl"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="bg-amber-400 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Kurikulum Merdeka</span>
              <span class="bg-emerald-400 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Virtual Lab Physics</span>
            </div>
            <h1 class="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
              LABORATORIUM VIRTUAL <span class="text-amber-300">LISTRIK DC</span>
            </h1>
          </div>
        </div>

        <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
          <label for="subMateriSelect" class="text-xs font-semibold text-amber-200 px-2 flex items-center gap-1.5">
            <i class="fa-solid fa-flask text-amber-300"></i>
            <span class="hidden sm:inline">Pilih Topik Sub-Materi:</span>
          </label>
          <select id="subMateriSelect" onchange="window.onSubMateriChange(this.value)" class="bg-slate-900/90 text-white font-medium text-xs sm:text-sm rounded-lg px-3 py-1.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-300 transition cursor-pointer">
            <option value="ohm">1. Hukum Ohm & Karakteristik Ohmik/Non-Ohmik</option>
            <option value="kawat">2. Hambatan Jenis Kawat Penghantar (R = ρ·L/A)</option>
            <option value="seri_paralel">3. Rangkaian Kombinasi Seri-Paralel Lampu</option>
            <option value="kirchhoff">4. Hukum I & II Kirchhoff (Rangkaian Majemuk)</option>
            <option value="daya">5. Daya Listrik, Energi & Dampak CO₂</option>
          </select>
        </div>

        <div class="flex items-center space-x-2">
          <button onclick="window.resetSimulationParameters()" class="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-lg border border-white/20 transition flex items-center gap-1.5">
            <i class="fa-solid fa-rotate-right text-amber-300"></i>
            <span class="hidden md:inline">Reset</span>
          </button>
          <button onclick="window.scrollToSection('lkpd-section')" class="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs px-3.5 py-2 rounded-lg shadow-md transition flex items-center gap-1.5">
            <i class="fa-solid fa-file-pen"></i>
            <span>LKPD Digital</span>
          </button>
        </div>
      </div>
    </header>

    <!-- MAIN DASHBOARD CONTENT -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">

      <!-- SECTION: KELOMPOK 10 COVER & MEMBER INPUT CARD -->
      <section class="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-indigo-700/50 relative overflow-hidden">
        <!-- Background Illustration Decorative Elements -->
        <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <i class="fa-solid fa-atom text-[220px] text-amber-300"></i>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          <!-- Left Cover Illustration & Identity -->
          <div class="md:col-span-5 space-y-3 border-b md:border-b-0 md:border-r border-indigo-700/60 pb-4 md:pb-0 md:pr-6">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-extrabold text-2xl shadow-lg">
                10
              </div>
              <div>
                <span class="bg-indigo-500/40 text-amber-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-300/30">
                  KELOMPOK PENYUSUN PRAKTIKUM
                </span>
                <h2 id="teamHeaderTitle" class="text-xl font-extrabold text-white tracking-tight mt-0.5">
                  VIRTUAL LAB PHYSICS
                </h2>
              </div>
            </div>

            <!-- Material Physics Illustration Grid -->
            <div class="bg-indigo-950/60 rounded-xl p-3 border border-indigo-700/40 grid grid-cols-4 gap-2 text-center text-xs">
              <div class="p-2 bg-indigo-900/50 rounded-lg flex flex-col items-center justify-center border border-indigo-700/30">
                <i class="fa-solid fa-car-battery text-amber-400 text-lg mb-1"></i>
                <span class="text-[10px] text-indigo-200">Sumber V</span>
              </div>
              <div class="p-2 bg-indigo-900/50 rounded-lg flex flex-col items-center justify-center border border-indigo-700/30">
                <i class="fa-solid fa-plug-circle-bolt text-emerald-400 text-lg mb-1"></i>
                <span class="text-[10px] text-indigo-200">Arus (I)</span>
              </div>
              <div class="p-2 bg-indigo-900/50 rounded-lg flex flex-col items-center justify-center border border-indigo-700/30">
                <i class="fa-solid fa-lightbulb text-yellow-300 text-lg mb-1"></i>
                <span class="text-[10px] text-indigo-200">Hambatan R</span>
              </div>
              <div class="p-2 bg-indigo-900/50 rounded-lg flex flex-col items-center justify-center border border-indigo-700/30">
                <i class="fa-solid fa-leaf text-teal-400 text-lg mb-1"></i>
                <span class="text-[10px] text-indigo-200">Eko-Daya</span>
              </div>
            </div>
            
            <p class="text-xs text-indigo-200 leading-relaxed">
              
            </p>
          </div>

          <!-- Right Member Inputs Form -->
          <div class="md:col-span-7 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <i class="fa-solid fa-users-gear"></i> Daftar Anggota Kelompok 10
              </h3>
              <span class="text-[10px] text-indigo-300 bg-indigo-900/80 px-2 py-0.5 rounded border border-indigo-700">
                Otomatis tersimpan di Laporan
              </span>
            </div>

            <!-- Member Inputs Grid -->
            <div id="teamMembersContainer" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <!-- Dynamically populated member input rows -->
            </div>
          </div>

        </div>
      </section>

      <!-- APERSEPSI & PEMANTIK CARD -->
      <div id="promptCard" class="bg-gradient-to-r from-amber-500/10 via-indigo-50 to-emerald-500/10 border border-amber-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-start space-x-3">
          <div class="p-3 bg-amber-400 text-slate-900 rounded-xl shadow-md shrink-0">
            <i class="fa-solid fa-lightbulb text-xl"></i>
          </div>
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">Pertanyaan Pemantik</span>
            <p id="pemantikText" class="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
              "Mengapa saat kita menyalakan banyak peralatan listrik secara bersamaan di rumah, lampu kadang redup?"
            </p>
          </div>
        </div>
        <button onclick="window.toggleRefleksiModal()" class="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition shrink-0 flex items-center gap-2">
          <i class="fa-solid fa-brain"></i>
          <span>Kuis Refleksi Konsep</span>
        </button>
      </div>

      <!-- MAIN LAB GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <!-- LEFT CONTROL PANEL -->
        <div class="lg:col-span-4 space-y-5">

          <!-- Theory Card -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-md space-y-2.5">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 class="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-2">
                <i class="fa-solid fa-book-bookmark"></i> Konsep Fisika
              </h2>
              <span class="text-[10px] bg-brand-50 text-brand-600 font-mono px-2 py-0.5 rounded border border-brand-200">Landasan Teori</span>
            </div>
            <div id="materiContent" class="text-xs text-slate-600 leading-relaxed space-y-2"></div>
          </div>

          <!-- Realtime Sensor Output Gauge Card -->
          <div class="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-lg border border-indigo-900 space-y-2.5">
            <div class="flex items-center justify-between border-b border-indigo-800/80 pb-2">
              <h3 class="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <i class="fa-solid fa-gauge-high"></i> Output Hasil Ukur Sensor
              </h3>
              <span class="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live Sensor
              </span>
            </div>
            <div id="liveReadingsContainer" class="grid grid-cols-2 gap-2.5 font-mono text-xs"></div>
          </div>

          <!-- Control Parameters Slider Card -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-md space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <i class="fa-solid fa-sliders text-brand-600"></i> Panel Kontrol Variabel
              </h3>
              <span class="text-[10px] text-slate-400 font-mono">Slider Control</span>
            </div>
            <div id="controlsContainer" class="space-y-3.5"></div>
          </div>

        </div>

        <!-- RIGHT CANVAS VISUALIZATION HOLDER -->
        <div class="lg:col-span-8 space-y-4">

          <!-- Canvas Container Card -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-md flex flex-col items-center relative">
            <div class="w-full flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
              <div class="flex items-center space-x-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span id="canvasTitle" class="text-xs sm:text-sm font-bold text-slate-800 tracking-wide">
                  Visualisasi Rangkaian Listrik
                </span>
              </div>
              <div class="flex items-center space-x-4 text-xs font-medium text-slate-600">
                <label class="flex items-center space-x-1.5 cursor-pointer hover:text-brand-600 transition">
                  <input type="checkbox" id="chkElectronFlow" checked onchange="window.toggleElectronFlow(this.checked)" class="rounded text-brand-600 focus:ring-brand-500">
                  <span>Aliran Elektron</span>
                </label>
                <label class="flex items-center space-x-1.5 cursor-pointer hover:text-brand-600 transition">
                  <input type="checkbox" id="chkShowVectors" checked onchange="window.toggleVectors(this.checked)" class="rounded text-amber-500 focus:ring-amber-500">
                  <span>Label Tegangan & Arus</span>
                </label>
              </div>
            </div>

            <!-- Canvas Container Frame with Proportional Strict Bounds -->
            <div id="p5-canvas-holder" class="w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex justify-center items-center relative min-h-[380px] max-h-[420px]">
              <!-- p5 Canvas will be injected here -->
            </div>

            <div class="w-full flex flex-wrap items-center justify-between gap-2 mt-3 px-1 text-xs text-slate-500">
              <div class="flex items-center gap-1.5">
                <span class="text-amber-600 font-semibold"><i class="fa-solid fa-circle-info mr-1"></i>Catatan Frame:</span>
                <span>Seluruh simulasi dan grafik otomatis terkunci di dalam bingkai p5.js.</span>
              </div>
              <button onclick="window.logCurrentDataToTable()" class="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-3.5 py-1.5 rounded-lg shadow transition flex items-center gap-1.5">
                <i class="fa-solid fa-plus text-amber-300"></i> Catat Ke LKPD
              </button>
            </div>
          </div>

          <!-- MISI EKSPLORASI TASK -->
          <div class="bg-gradient-to-r from-emerald-500/10 via-teal-50 to-blue-500/10 border border-emerald-200/80 rounded-2xl p-4 shadow-sm">
            <h4 class="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2 mb-2">
              <i class="fa-solid fa-list-check text-emerald-600"></i> Misi Praktikum Terbimbing
            </h4>
            <div id="misiTaskContent" class="text-xs text-slate-700 space-y-1"></div>
          </div>

        </div>

      </div>

      <!-- LKPD TABLE SECTION -->
      <section id="lkpd-section" class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span class="bg-brand-100 text-brand-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">Instrumen Evaluasi LKPD</span>
            <h2 class="text-base font-extrabold text-slate-800 flex items-center gap-2 mt-1">
              <i class="fa-solid fa-table-cells text-brand-600"></i> Tabel Pengamatan Hasil Praktikum Virtual
            </h2>
          </div>
          <div class="flex items-center space-x-2">
            <button onclick="window.logCurrentDataToTable()" class="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow transition flex items-center gap-1">
              <i class="fa-solid fa-plus"></i> Tambah Data
            </button>
            <button onclick="window.clearTableData()" class="bg-slate-100 hover:bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-lg border border-slate-200 transition flex items-center gap-1">
              <i class="fa-solid fa-trash-can"></i> Bersihkan
            </button>
          </div>
        </div>

        <div class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full text-left text-xs font-sans">
            <thead class="bg-slate-50 text-slate-700 uppercase font-mono tracking-wider border-b border-slate-200">
              <tr>
                <th class="p-2.5 text-center w-10">No</th>
                <th class="p-2.5">Topik Percobaan</th>
                <th class="p-2.5 text-physics-voltage font-bold">Variabel Bebas (Input)</th>
                <th class="p-2.5 text-physics-resistance font-bold">Variabel Kontrol</th>
                <th class="p-2.5 text-physics-current font-bold">Hasil Ukur Sensor</th>
                <th class="p-2.5">Analisis & Catatan Siswa</th>
                <th class="p-2.5 text-center w-12">Aksi</th>
              </tr>
            </thead>
            <tbody id="tableBody" class="divide-y divide-slate-100 text-slate-700"></tbody>
          </table>
        </div>
      </section>

      <!-- REFLECTION & CONCLUSION SECTION -->
      <section class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md space-y-4">
        <div class="border-b border-slate-100 pb-2">
          <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-pen-nib text-amber-500"></i> Analisis & Kesimpulan Praktikum Kelompok 10
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label for="inputKesimpulan" class="block text-xs font-bold uppercase text-brand-600 tracking-wider">
              1. Temuan Utama & Kesimpulan Fisika:
            </label>
            <textarea id="inputKesimpulan" rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition" placeholder="Tuliskan kesimpulan kelompok Anda mengenai hubungan antar variabel fisika..."></textarea>
          </div>
          <div class="space-y-1.5">
            <label for="inputSaran" class="block text-xs font-bold uppercase text-emerald-600 tracking-wider">
              2. Penerapan Nyata & Solusi Hemat Energi:
            </label>
            <textarea id="inputSaran" rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="Tuliskan rekomendasi tindakan nyata penghematan energi listrik dan penurunan emisi karbon..."></textarea>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <span class="text-xs text-slate-500 flex items-center gap-1.5">
            <i class="fa-solid fa-circle-check text-emerald-500"></i> Laporan LKPD siap diunduh / dicetak.
          </span>
          <div class="flex items-center space-x-2">
            <button onclick="window.downloadReportSummary()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition flex items-center gap-1.5">
              <i class="fa-solid fa-download text-brand-600"></i> Unduh Laporan (.txt)
            </button>
            <button onclick="window.print()" class="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5">
              <i class="fa-solid fa-print"></i> Cetak Portfolio LKPD
            </button>
          </div>
        </div>
      </section>

    </main>

    <!-- REFLECTION QUIZ MODAL -->
    <div id="refleksiModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-3 border border-slate-100">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <div class="flex items-center space-x-2">
            <div class="p-1.5 bg-amber-100 text-amber-700 rounded-lg"><i class="fa-solid fa-brain"></i></div>
            <h3 class="font-bold text-slate-800 text-sm">Uji Pemahaman Konsep</h3>
          </div>
          <button onclick="window.toggleRefleksiModal()" class="text-slate-400 hover:text-slate-600 text-lg p-1"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div id="quizContainer" class="space-y-3"></div>
        <div class="flex justify-end pt-2 border-t border-slate-100">
          <button onclick="window.toggleRefleksiModal()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-1.5 rounded-lg">Tutup</button>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION CONTAINER -->
    <div id="toastContainer" class="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none"></div>

    <!-- FOOTER -->
    <footer class="bg-slate-900 text-slate-400 py-6 mt-10 border-t border-slate-800 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-slate-300">Virtual Lab Listrik DC &copy; Kelompok 10 - Pembelajaran Fisika Interaktif</p>
        <div class="flex items-center space-x-4">
          <span><i class="fa-solid fa-code text-brand-500 mr-1"></i>p5.js Engine</span>
          <span><i class="fa-solid fa-shield-halved text-emerald-400 mr-1"></i>Responsive & Bounded</span>
        </div>
      </div>
    </footer>
  `;

  renderTeamMembersUI();
}

/* ========================================================================= */
/* SECTION 3: KELOMPOK 10 COVER & MEMBER MANAGEMENT                          */
/* ========================================================================= */

function renderTeamMembersUI() {
  const container = document.getElementById('teamMembersContainer');
  if (!container) return;

  container.innerHTML = teamInfo.members.map((m, idx) => `
    <div class="bg-indigo-950/70 border border-indigo-700/50 rounded-xl p-2 flex items-center space-x-2">
      <span class="w-6 h-6 rounded-lg bg-amber-400 text-slate-900 font-bold text-[11px] flex items-center justify-center shrink-0">
        ${idx + 1}
      </span>
      <div class="flex-1 grid grid-cols-3 gap-1.5">
        <input type="text" value="${m.name}" placeholder="Nama Siswa" onchange="window.updateTeamMember(${idx}, 'name', this.value)" class="col-span-2 bg-indigo-900/60 text-white text-xs rounded px-2 py-1 border border-indigo-700/60 focus:outline-none focus:ring-1 focus:ring-amber-300">
        <input type="text" value="${m.noAbsen}" placeholder="No Absen" onchange="window.updateTeamMember(${idx}, 'noAbsen', this.value)" class="col-span-1 bg-indigo-900/60 text-amber-300 text-xs font-mono font-bold rounded px-1.5 py-1 text-center border border-indigo-700/60 focus:outline-none focus:ring-1 focus:ring-amber-300">
      </div>
    </div>
  `).join('');
}

window.updateTeamMember = function(idx, key, value) {
  if (teamInfo.members[idx]) {
    teamInfo.members[idx][key] = value;
  }
};

/* ========================================================================= */
/* SECTION 4: INTERACTIVE UI CONTROLLERS & EVENT HANDLERS                   */
/* ========================================================================= */

window.onSubMateriChange = function(val) {
  currentSubMateri = val;
  const info = subMateriDatabase[val];

  const titleEl = document.getElementById('canvasTitle');
  const pemantikEl = document.getElementById('pemantikText');
  const materiEl = document.getElementById('materiContent');
  
  if (titleEl) titleEl.innerText = info.title;
  if (pemantikEl) pemantikEl.innerText = `"${info.pemantik}"`;
  if (materiEl) materiEl.innerHTML = info.theory;

  const taskContainer = document.getElementById('misiTaskContent');
  if (taskContainer) {
    taskContainer.innerHTML = info.misi.map(m => `<p class="flex items-start gap-1.5"><i class="fa-solid fa-circle-check text-emerald-500 mt-0.5"></i><span>${m}</span></p>`).join('');
  }

  window.renderControlsForSubMateri();
  window.renderQuizContent();
};

window.toggleElectronFlow = function(val) { showElectronFlow = val; };
window.toggleVectors = function(val) { showVectors = val; };

window.resetSimulationParameters = function() {
  physicsState.voltage = 12.0;
  physicsState.resistance = 10.0;
  physicsState.loadType = 'ohmic';
  physicsState.length = 50.0;
  physicsState.area = 2.0;
  physicsState.temperature = 25.0;
  physicsState.vSource = 12.0;
  physicsState.rLampu1 = 10.0; physicsState.rLampu2 = 10.0; physicsState.rLampu3 = 10.0;
  physicsState.sw1 = true; physicsState.sw2 = true; physicsState.sw3 = true;
  physicsState.v1 = 12.0; physicsState.v2 = 6.0;
  physicsState.rk1 = 10.0; physicsState.rk2 = 20.0; physicsState.rk3 = 30.0;

  window.renderControlsForSubMateri();
  window.showToast('Parameter simulasi berhasil di-reset!', 'info');
};

window.renderControlsForSubMateri = function() {
  const container = document.getElementById('controlsContainer');
  if (!container) return;
  let html = '';

  if (currentSubMateri === 'ohm') {
    html = `
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold">
          <label class="text-physics-voltage font-bold">Tegangan Baterai (V):</label>
          <span id="val_voltage" class="font-mono text-brand-600 font-bold">${physicsState.voltage} V</span>
        </div>
        <input type="range" min="1" max="24" step="0.5" value="${physicsState.voltage}" oninput="window.updateParam('voltage', this.value, 'val_voltage', 'V')" class="w-full">
      </div>
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold">
          <label class="text-physics-resistance font-bold">Hambatan Resistor (R):</label>
          <span id="val_resistance" class="font-mono text-brand-600 font-bold">${physicsState.resistance} Ω</span>
        </div>
        <input type="range" min="1" max="50" step="1" value="${physicsState.resistance}" oninput="window.updateParam('resistance', this.value, 'val_resistance', 'Ω')" class="w-full">
      </div>
      <div class="space-y-1 pt-1">
        <label class="text-xs font-bold text-slate-700">Komponen Beban:</label>
        <div class="grid grid-cols-3 gap-1.5">
          <button onclick="window.setLoadType('ohmic')" class="py-1.5 text-xs font-bold rounded-lg border transition ${physicsState.loadType==='ohmic'?'bg-brand-600 text-white border-brand-600':'bg-slate-50 text-slate-700 border-slate-200'}">Resistor</button>
          <button onclick="window.setLoadType('filament')" class="py-1.5 text-xs font-bold rounded-lg border transition ${physicsState.loadType==='filament'?'bg-amber-500 text-white border-amber-500':'bg-slate-50 text-slate-700 border-slate-200'}">Lampu</button>
          <button onclick="window.setLoadType('diode')" class="py-1.5 text-xs font-bold rounded-lg border transition ${physicsState.loadType==='diode'?'bg-rose-600 text-white border-rose-600':'bg-slate-50 text-slate-700 border-slate-200'}">Dioda</button>
        </div>
      </div>
    `;
  } else if (currentSubMateri === 'kawat') {
    html = `
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-700">Bahan Kawat:</label>
        <select onchange="window.updateParam('material', this.value)" class="w-full bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg p-2 border border-slate-200">
          <option value="tembaga" ${physicsState.material==='tembaga'?'selected':''}>Tembaga (Copper)</option>
          <option value="aluminium" ${physicsState.material==='aluminium'?'selected':''}>Aluminium</option>
          <option value="nikrom" ${physicsState.material==='nikrom'?'selected':''}>Nikrom (Ni-Cr)</option>
          <option value="karbon" ${physicsState.material==='karbon'?'selected':''}>Karbon</option>
        </select>
      </div>
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold">
          <label class="text-brand-600 font-bold">Panjang L (m):</label>
          <span id="val_length" class="font-mono text-brand-600 font-bold">${physicsState.length} m</span>
        </div>
        <input type="range" min="5" max="200" step="5" value="${physicsState.length}" oninput="window.updateParam('length', this.value, 'val_length', 'm')" class="w-full">
      </div>
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold">
          <label class="text-rose-600 font-bold">Luas A (mm²):</label>
          <span id="val_area" class="font-mono text-brand-600 font-bold">${physicsState.area} mm²</span>
        </div>
        <input type="range" min="0.5" max="10.0" step="0.5" value="${physicsState.area}" oninput="window.updateParam('area', this.value, 'val_area', 'mm²')" class="w-full">
      </div>
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold">
          <label class="text-amber-600 font-bold">Suhu T (°C):</label>
          <span id="val_temp" class="font-mono text-brand-600 font-bold">${physicsState.temperature} °C</span>
        </div>
        <input type="range" min="0" max="100" step="1" value="${physicsState.temperature}" oninput="window.updateParam('temperature', this.value, 'val_temp', '°C')" class="w-full">
      </div>
    `;
  } else if (currentSubMateri === 'seri_paralel') {
    html = `
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-700">Konfigurasi Rangkaian:</label>
        <div class="grid grid-cols-3 gap-1.5">
          <button onclick="window.setCircuitMode('seri')" class="py-1.5 text-xs font-bold rounded-lg border transition ${physicsState.circuitMode==='seri'?'bg-brand-600 text-white border-brand-600':'bg-slate-50 text-slate-700 border-slate-200'}">Seri</button>
          <button onclick="window.setCircuitMode('paralel')" class="py-1.5 text-xs font-bold rounded-lg border transition ${physicsState.circuitMode==='paralel'?'bg-amber-500 text-white border-amber-500':'bg-slate-50 text-slate-700 border-slate-200'}">Paralel</button>
          <button onclick="window.setCircuitMode('campuran')" class="py-1.5 text-xs font-bold rounded-lg border transition ${physicsState.circuitMode==='campuran'?'bg-emerald-600 text-white border-emerald-600':'bg-slate-50 text-slate-700 border-slate-200'}">Campuran</button>
        </div>
      </div>
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold">
          <label class="text-physics-voltage font-bold">Tegangan V (Volt):</label>
          <span id="val_vSource" class="font-mono text-brand-600 font-bold">${physicsState.vSource} V</span>
        </div>
        <input type="range" min="3" max="24" step="1" value="${physicsState.vSource}" oninput="window.updateParam('vSource', this.value, 'val_vSource', 'V')" class="w-full">
      </div>
      <div class="grid grid-cols-3 gap-1.5 pt-1 text-center">
        <div>
          <span class="text-[10px] font-bold text-slate-500 block">Lampu 1</span>
          <button onclick="window.toggleSwitch(1)" class="w-full py-1 text-xs font-bold rounded mt-1 border ${physicsState.sw1?'bg-emerald-100 text-emerald-800 border-emerald-300':'bg-rose-100 text-rose-800 border-rose-300'}">${physicsState.sw1?'ON':'OFF'}</button>
        </div>
        <div>
          <span class="text-[10px] font-bold text-slate-500 block">Lampu 2</span>
          <button onclick="window.toggleSwitch(2)" class="w-full py-1 text-xs font-bold rounded mt-1 border ${physicsState.sw2?'bg-emerald-100 text-emerald-800 border-emerald-300':'bg-rose-100 text-rose-800 border-rose-300'}">${physicsState.sw2?'ON':'OFF'}</button>
        </div>
        <div>
          <span class="text-[10px] font-bold text-slate-500 block">Lampu 3</span>
          <button onclick="window.toggleSwitch(3)" class="w-full py-1 text-xs font-bold rounded mt-1 border ${physicsState.sw3?'bg-emerald-100 text-emerald-800 border-emerald-300':'bg-rose-100 text-rose-800 border-rose-300'}">${physicsState.sw3?'ON':'OFF'}</button>
        </div>
      </div>
    `;
  } else if (currentSubMateri === 'kirchhoff') {
    html = `
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold">
          <label class="text-brand-600 font-bold">Baterai E1 Kiri (V):</label>
          <span id="val_v1" class="font-mono text-brand-600 font-bold">${physicsState.v1} V</span>
        </div>
        <input type="range" min="2" max="24" step="1" value="${physicsState.v1}" oninput="window.updateParam('v1', this.value, 'val_v1', 'V')" class="w-full">
      </div>
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold">
          <label class="text-amber-600 font-bold">Baterai E2 Kanan (V):</label>
          <span id="val_v2" class="font-mono text-brand-600 font-bold">${physicsState.v2} V</span>
        </div>
        <input type="range" min="2" max="24" step="1" value="${physicsState.v2}" oninput="window.updateParam('v2', this.value, 'val_v2', 'V')" class="w-full">
      </div>
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold">
          <label class="text-rose-600 font-bold">Resistor R1 (Ω):</label>
          <span id="val_rk1" class="font-mono text-brand-600 font-bold">${physicsState.rk1} Ω</span>
        </div>
        <input type="range" min="5" max="50" step="1" value="${physicsState.rk1}" oninput="window.updateParam('rk1', this.value, 'val_rk1', 'Ω')" class="w-full">
      </div>
    `;
  } else if (currentSubMateri === 'daya') {
    html = `
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-700">Perangkat Listrik Rumah:</label>
        <select onchange="window.updateDeviceSelection(this.value)" class="w-full bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg p-2 border border-slate-200">
          <option value="ac" ${physicsState.deviceType==='ac'?'selected':''}>AC Inverter (400 W)</option>
          <option value="kulkas" ${physicsState.deviceType==='kulkas'?'selected':''}>Kulkas 2 Pintu (150 W)</option>
          <option value="tv" ${physicsState.deviceType==='tv'?'selected':''}>Smart TV LED (80 W)</option>
          <option value="lampu" ${physicsState.deviceType==='lampu'?'selected':''}>Lampu LED Hemat (15 W)</option>
        </select>
      </div>
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold">
          <label class="text-brand-600 font-bold">Jumlah Unit:</label>
          <span id="val_deviceCount" class="font-mono text-brand-600 font-bold">${physicsState.deviceCount} Unit</span>
        </div>
        <input type="range" min="1" max="10" step="1" value="${physicsState.deviceCount}" oninput="window.updateParam('deviceCount', this.value, 'val_deviceCount', 'Unit')" class="w-full">
      </div>
      <div class="space-y-1">
        <div class="flex justify-between text-xs font-semibold">
          <label class="text-amber-600 font-bold">Durasi Pemakaian / Hari:</label>
          <span id="val_hoursPerDay" class="font-mono text-brand-600 font-bold">${physicsState.hoursPerDay} Jam</span>
        </div>
        <input type="range" min="1" max="24" step="1" value="${physicsState.hoursPerDay}" oninput="window.updateParam('hoursPerDay', this.value, 'val_hoursPerDay', 'Jam')" class="w-full">
      </div>
    `;
  }
  container.innerHTML = html;
};

window.updateParam = function(key, val, displayId, unit) {
  physicsState[key] = parseFloat(val) || val;
  if (displayId && document.getElementById(displayId)) {
    document.getElementById(displayId).innerText = `${val} ${unit}`;
  }
};

window.setLoadType = function(type) { physicsState.loadType = type; window.renderControlsForSubMateri(); };
window.setCircuitMode = function(mode) { physicsState.circuitMode = mode; window.renderControlsForSubMateri(); };
window.toggleSwitch = function(num) { physicsState[`sw${num}`] = !physicsState[`sw${num}`]; window.renderControlsForSubMateri(); };
window.updateDeviceSelection = function(type) {
  physicsState.deviceType = type;
  const powers = { ac: 400, kulkas: 150, tv: 80, lampu: 15 };
  physicsState.devicePower = powers[type] || 100;
  window.renderControlsForSubMateri();
};

window.showToast = function(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  const bgColors = {
    info: 'bg-indigo-900 border-indigo-700 text-white',
    success: 'bg-emerald-900 border-emerald-700 text-white',
    warning: 'bg-amber-900 border-amber-700 text-white'
  };

  toast.className = `p-3 px-4 rounded-xl border shadow-xl text-xs font-semibold flex items-center space-x-2 pointer-events-auto transition-all duration-300 ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `<i class="fa-solid fa-circle-info text-amber-300"></i> <span>${msg}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
};

window.scrollToSection = function(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

window.logCurrentDataToTable = function() {
  let row = { sub: subMateriDatabase[currentSubMateri].title.split('.')[1], vBebas: '', vTerikat: '', vHasil: '', catatan: '' };

  if (currentSubMateri === 'ohm') {
    const I = (physicsState.voltage / physicsState.resistance).toFixed(2);
    row.vBebas = `Tegangan V = ${physicsState.voltage} V`;
    row.vTerikat = `Resistor R = ${physicsState.resistance} Ω (${physicsState.loadType})`;
    row.vHasil = `Arus I = ${I} A`;
    row.catatan = `Arus sebanding dengan tegangan V.`;
  } else if (currentSubMateri === 'kawat') {
    const mat = materialData[physicsState.material];
    const rho = mat.rho0 * (1 + mat.alpha * (physicsState.temperature - 20));
    const R = (rho * physicsState.length) / (physicsState.area * 1e-6);
    row.vBebas = `Bahan = ${mat.name}, L = ${physicsState.length} m`;
    row.vTerikat = `Luas A = ${physicsState.area} mm², Suhu = ${physicsState.temperature} °C`;
    row.vHasil = `Hambatan R = ${R.toFixed(3)} Ω`;
    row.catatan = `Panjang & suhu memperbesar R; Luas A memperkecil R.`;
  } else if (currentSubMateri === 'seri_paralel') {
    row.vBebas = `Mode = ${physicsState.circuitMode.toUpperCase()}, V = ${physicsState.vSource} V`;
    row.vTerikat = `Sakelar L1(${physicsState.sw1?'ON':'OFF'}) L2(${physicsState.sw2?'ON':'OFF'}) L3(${physicsState.sw3?'ON':'OFF'})`;
    row.vHasil = `Kecerahan Terukur`;
    row.catatan = `Rangkaian paralel mempertahankan tegangan cabang.`;
  } else if (currentSubMateri === 'daya') {
    const totalW = physicsState.deviceCount * physicsState.devicePower;
    const dailyKWh = (totalW * physicsState.hoursPerDay) / 1000;
    const monthlyCost = dailyKWh * 30 * physicsState.kwhTariff;
    row.vBebas = `${physicsState.deviceCount}x ${physicsState.deviceType.toUpperCase()} (${physicsState.devicePower} W)`;
    row.vTerikat = `Durasi = ${physicsState.hoursPerDay} Jam/Hari`;
    row.vHasil = `${dailyKWh.toFixed(2)} kWh/hari = Rp ${monthlyCost.toLocaleString('id-ID')}/bln`;
    row.catatan = `Pengurangan durasi menekan emisi CO2 & tagihan.`;
  }

  tableDataLog.push(row);
  window.renderTableBody();
  window.showToast('Data berhasil dicatat ke dalam LKPD!', 'success');
};

window.renderTableBody = function() {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;
  if (tableDataLog.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-5 text-center text-slate-400 italic">
          Belum ada data pengamatan yang dicatat. Klik tombol <b>"Tambah Data"</b> di atas.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = tableDataLog.map((r, idx) => `
    <tr class="hover:bg-slate-50 transition">
      <td class="p-2.5 text-center font-mono font-bold text-slate-400">${idx + 1}</td>
      <td class="p-2.5 font-semibold text-brand-600">${r.sub}</td>
      <td class="p-2.5 font-mono text-physics-voltage font-semibold">${r.vBebas}</td>
      <td class="p-2.5 font-mono text-physics-resistance font-semibold">${r.vTerikat}</td>
      <td class="p-2.5 font-mono text-physics-current font-bold">${r.vHasil}</td>
      <td class="p-2.5 text-slate-600">
        <input type="text" value="${r.catatan}" onchange="window.updateRowNote(${idx}, this.value)" class="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500">
      </td>
      <td class="p-2.5 text-center">
        <button onclick="window.deleteRow(${idx})" class="text-rose-500 hover:text-rose-700 p-1"><i class="fa-solid fa-trash-can"></i></button>
      </td>
    </tr>
  `).join('');
};

window.updateRowNote = function(idx, val) { if (tableDataLog[idx]) tableDataLog[idx].catatan = val; };
window.deleteRow = function(idx) { tableDataLog.splice(idx, 1); window.renderTableBody(); window.showToast('Baris dihapus.', 'warning'); };
window.clearTableData = function() { tableDataLog = []; window.renderTableBody(); window.showToast('Tabel dibersihkan.', 'info'); };

window.toggleRefleksiModal = function() {
  const modal = document.getElementById('refleksiModal');
  if (modal) modal.classList.toggle('hidden');
};

window.renderQuizContent = function() {
  const qData = subMateriDatabase[currentSubMateri].quiz;
  const container = document.getElementById('quizContainer');
  if (!container) return;
  
  container.innerHTML = `
    <p class="text-xs font-semibold text-slate-800">${qData.q}</p>
    <div class="space-y-1.5 pt-1">
      ${qData.a.map((opt, i) => `
        <button onclick="window.checkQuizAnswer(${i})" class="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:bg-brand-50 hover:border-brand-300 text-xs text-slate-700 transition flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-slate-100 border text-center font-bold text-[10px] flex items-center justify-center shrink-0">${String.fromCharCode(65+i)}</span>
          <span>${opt}</span>
        </button>
      `).join('')}
    </div>
    <div id="quizFeedback" class="hidden p-2.5 rounded-xl text-xs font-semibold"></div>
  `;
};

window.checkQuizAnswer = function(selectedIdx) {
  const qData = subMateriDatabase[currentSubMateri].quiz;
  const feedback = document.getElementById('quizFeedback');
  if (!feedback) return;
  feedback.classList.remove('hidden', 'bg-emerald-100', 'text-emerald-800', 'bg-rose-100', 'text-rose-800');

  if (selectedIdx === qData.correct) {
    feedback.classList.add('bg-emerald-100', 'text-emerald-800');
    feedback.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> <b>Benar!</b> ${qData.exp}`;
  } else {
    feedback.classList.add('bg-rose-100', 'text-rose-800');
    feedback.innerHTML = `<i class="fa-solid fa-circle-xmark text-rose-600 mr-1.5"></i> <b>Kurang Tepat.</b> ${qData.exp}`;
  }
};

window.downloadReportSummary = function() {
  const k = document.getElementById('inputKesimpulan')?.value || 'Belum diisi';
  const s = document.getElementById('inputSaran')?.value || 'Belum diisi';

  let text = `========================================================================\n`;
  text += ` LAPORAN PRAKTIKUM VIRTUAL FISIKA LISTRIK ARUS SEARAH (DC)\n`;
  text += ` ${teamInfo.groupName.toUpperCase()} - CLASS: ${teamInfo.classInfo}\n`;
  text += `========================================================================\n\n`;
  text += `ANGGOTA KELOMPOK 10:\n`;
  teamInfo.members.forEach((m, idx) => {
    text += ` ${idx + 1}. ${m.name || '-'} (No. Absen: ${m.noAbsen || '-'})\n`;
  });
  text += `\nWaktu Praktikum : ${new Date().toLocaleString('id-ID')}\n\n`;
  text += `--- DATA TABEL PENGAMATAN LKPD ---\n`;
  
  tableDataLog.forEach((r, i) => {
    text += `${i+1}. [${r.sub}]\n   Input Variable   : ${r.vBebas}\n   Kontrol Variable : ${r.vTerikat}\n   Hasil Ukur Sensor: ${r.vHasil}\n   Catatan Analisis : ${r.catatan}\n\n`;
  });

  text += `--- ANALISIS & KESIMPULAN KELOMPOK ---\n${k}\n\n`;
  text += `--- REKOMENDASI HEMAT ENERGI & JEJAK KARBON ---\n${s}\n`;

  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Laporan_Kelompok10_ListrikDC_${Date.now()}.txt`;
  a.click();
};

/* ========================================================================= */
/* SECTION 5: P5.JS SETUP & MAIN DRAW LOOP                                   */
/* ========================================================================= */

function setup() {
  createVirtualLabDOM();

  const holder = document.getElementById('p5-canvas-holder');
  const w = holder ? Math.max(320, holder.clientWidth || 660) : 660;
  const h = 380;
  
  const canvas = createCanvas(w, h);
  if (holder) canvas.parent('p5-canvas-holder');
  
  frameRate(60);

  window.renderTableBody();
  window.onSubMateriChange('ohm');
}

function windowResized() {
  const holder = document.getElementById('p5-canvas-holder');
  if (holder) {
    const w = Math.max(320, holder.clientWidth);
    resizeCanvas(w, 380);
  }
}

function draw() {
  background(15, 23, 42); // Dark Board Background
  animOffset += 1.5;

  drawLabGrid();

  // Render bounded sub-materi visualization
  if (currentSubMateri === 'ohm') drawSubOhm();
  else if (currentSubMateri === 'kawat') drawSubKawat();
  else if (currentSubMateri === 'seri_paralel') drawSubSeriParalel();
  else if (currentSubMateri === 'kirchhoff') drawSubKirchhoff();
  else if (currentSubMateri === 'daya') drawSubDaya();

  updateLiveReadingsUI();
}

function drawLabGrid() {
  stroke(30, 41, 59, 100);
  strokeWeight(1);
  for (let x = 0; x < width; x += 30) line(x, 0, x, height);
  for (let y = 0; y < height; y += 30) line(0, y, width, y);
}

/* ========================================================================= */
/* SECTION 6: SUB-MATERI 1 (HUKUM OHM) VISUALIZATION                         */
/* ========================================================================= */

function drawSubOhm() {
  const V = physicsState.voltage;
  const R = physicsState.resistance;
  let I = V / R;

  if (physicsState.loadType === 'filament') I = Math.sqrt(V) / (R * 0.35);
  else if (physicsState.loadType === 'diode') I = V > 2.0 ? Math.exp((V - 2.0) * 0.35) : 0.01;

  // Strictly proportional bounding limits
  const plotWidth = Math.min(130, width * 0.22);
  const left = 35;
  const right = Math.max(left + 150, width - plotWidth - 40);
  const top = 50;
  const bottom = height - 75;

  // Circuit Cable Loop Frame
  stroke(37, 99, 235);
  strokeWeight(3.5);
  noFill();
  rect(left, top, right - left, bottom - top, 14);

  // Battery Component
  drawBatteryComponent(left, (top + bottom) / 2, V);

  // Load Component
  drawLoadComponent((left + right) / 2, top, R, I, physicsState.loadType);

  // Ammeter Component
  drawAmmeterComponent(right, (top + bottom) / 2, I);

  // Voltmeter Branch
  drawVoltmeterBranch(left + 30, right - 30, bottom, V);

  // Electron Flow Simulation
  if (showElectronFlow && I > 0.01) {
    drawElectronDrift(left, right, top, bottom, I);
  }

  // Strictly Bounded V-I Plot on the Right
  const plotX = width - plotWidth - 15;
  const plotY = 40;
  const plotH = Math.min(140, height - 80);
  drawVIPlot(plotX, plotY, plotWidth, plotH, V, I, physicsState.loadType);
}

/* ========================================================================= */
/* SECTION 7: SUB-MATERI 2 (HAMBATAN KAWAT) VISUALIZATION                    */
/* ========================================================================= */

function drawSubKawat() {
  const mat = materialData[physicsState.material];
  const L = physicsState.length; const A = physicsState.area; const T = physicsState.temperature;
  const rhoT = mat.rho0 * (1 + mat.alpha * (T - 20));
  const R = (rhoT * L) / (A * 1e-6);

  // Title inside canvas top-left
  fill(250, 204, 21); noStroke(); fontMono(); textSize(12); textAlign(LEFT, TOP);
  text(`Bahan Kawat: ${mat.name}`, 20, 15);

  const meterW = 100;
  const wireX = 35;
  const maxWireWidth = Math.max(80, width - meterW - 70);
  const wireY = height / 2;
  const wireLenPixel = map(L, 5, 200, 60, maxWireWidth);
  const wireThickness = map(A, 0.5, 10, 10, 40);

  // Kawat Body
  stroke(mat.color); strokeWeight(2); fill(color(mat.color + '44'));
  rect(wireX, wireY - wireThickness / 2, wireLenPixel, wireThickness, wireThickness / 4);

  // Atomic Lattice Vibration inside bounded wire
  fill(239, 68, 68); noStroke();
  const vibAmp = map(T, 0, 100, 0.5, 4.5);
  for (let x = wireX + 10; x < wireX + wireLenPixel - 8; x += 18) {
    for (let y = wireY - wireThickness / 2 + 6; y <= wireY + wireThickness / 2 - 6; y += 10) {
      let vibX = sin(frameCount * 0.2 + x) * vibAmp;
      let vibY = cos(frameCount * 0.2 + y) * vibAmp;
      ellipse(x + vibX, y + vibY, 4, 4);
    }
  }

  // Bounded Ohmmeter Display
  const meterX = Math.min(width - meterW - 15, wireX + wireLenPixel + 15);
  drawDigitalOhmmeter(meterX, wireY - 35, R);
}

/* ========================================================================= */
/* SECTION 8: SUB-MATERI 3 (SERI-PARALEL) VISUALIZATION                      */
/* ========================================================================= */

function drawSubSeriParalel() {
  const V = physicsState.vSource;
  const left = 50; const right = width - 50;
  const top = 60; const bottom = height - 80;

  stroke(37, 99, 235); strokeWeight(3.5); noFill();

  if (physicsState.circuitMode === 'seri') {
    // Single Loop Frame
    rect(left, top, right - left, bottom - top, 14);
    drawBatteryComponent(left, (top + bottom) / 2, V);

    const step = (right - left - 60) / 3;
    if (physicsState.sw1) drawLampuGlow(left + 40 + step * 0.5, top, 10, 1.2, "L1");
    if (physicsState.sw2) drawLampuGlow(left + 40 + step * 1.5, top, 10, 1.2, "L2");
    if (physicsState.sw3) drawLampuGlow(left + 40 + step * 2.5, top, 10, 1.2, "L3");
  } else if (physicsState.circuitMode === 'paralel') {
    // Parallel Branch Lines
    line(left, top, left, bottom);
    line(right, top, right, bottom);
    drawBatteryComponent(left, (top + bottom) / 2, V);

    const branchY1 = top + (bottom - top) * 0.2;
    const branchY2 = top + (bottom - top) * 0.5;
    const branchY3 = top + (bottom - top) * 0.8;

    line(left, branchY1, right, branchY1);
    line(left, branchY2, right, branchY2);
    line(left, branchY3, right, branchY3);

    const midX = (left + right) / 2;
    if (physicsState.sw1) drawLampuGlow(midX, branchY1, 10, 1.5, "L1");
    if (physicsState.sw2) drawLampuGlow(midX, branchY2, 10, 1.5, "L2");
    if (physicsState.sw3) drawLampuGlow(midX, branchY3, 10, 1.5, "L3");
  } else {
    // Campuran Mode
    rect(left, top, right - left, bottom - top, 14);
    drawBatteryComponent(left, (top + bottom) / 2, V);
    const midX = (left + right) / 2;
    line(midX, top, midX, bottom);

    if (physicsState.sw1) drawLampuGlow(left + (midX - left) / 2, top, 10, 1.2, "L1");
    if (physicsState.sw2) drawLampuGlow(midX + (right - midX) / 2, top + 30, 10, 1.2, "L2");
    if (physicsState.sw3) drawLampuGlow(midX + (right - midX) / 2, bottom - 30, 10, 1.2, "L3");
  }
}

/* ========================================================================= */
/* SECTION 9: SUB-MATERI 4 (KIRCHHOFF) VISUALIZATION                         */
/* ========================================================================= */

function drawSubKirchhoff() {
  const left = 45, right = width - 45;
  const mid = (left + right) / 2;
  const top = 55, bottom = height - 65;

  stroke(37, 99, 235); strokeWeight(3.5); noFill();
  rect(left, top, mid - left, bottom - top, 12);
  rect(mid, top, right - mid, bottom - top, 12);

  drawBatteryComponent(left, (top + bottom) / 2, physicsState.v1);
  drawBatteryComponent(right, (top + bottom) / 2, physicsState.v2);
  drawLoadComponent((left + mid) / 2, top, physicsState.rk1, 0.8, 'ohmic');

  // Bounded Junction Nodes
  fill(245, 158, 11); noStroke(); 
  ellipse(mid, top, 12, 12); 
  ellipse(mid, bottom, 12, 12);

  fill(248, 250, 252); fontMono(); textSize(10); textAlign(CENTER); 
  text("Simpul A", mid, top - 10);
  text("Simpul B", mid, bottom + 15);
}

/* ========================================================================= */
/* SECTION 10: SUB-MATERI 5 (DAYA & CARBON) VISUALIZATION                     */
/* ========================================================================= */

function drawSubDaya() {
  const totalW = physicsState.deviceCount * physicsState.devicePower;
  const dailyKWh = (totalW * physicsState.hoursPerDay) / 1000;
  const monthlyCost = dailyKWh * 30 * physicsState.kwhTariff;
  const monthlyCarbon = dailyKWh * 30 * 0.85;

  const cardW = Math.min(480, width - 40);
  const cardX = (width - cardW) / 2;
  const cardY = 35;
  const cardH = height - 70;

  fill(30, 41, 59); stroke(245, 158, 11); strokeWeight(2.5);
  rect(cardX, cardY, cardW, cardH, 14);

  fill(250, 204, 21); noStroke(); fontMono(); textSize(13); textAlign(CENTER, TOP);
  text("⚡ SMART METER PLN & JEJAK KARBON CO₂ ⚡", width / 2, cardY + 15);

  const innerW = cardW - 40;
  const innerX = width / 2 - innerW / 2;
  fill(15, 23, 42); stroke(37, 99, 235); strokeWeight(2);
  rect(innerX, cardY + 45, innerW, 120, 10);

  fill(56, 189, 248); fontMono(); textSize(18); textAlign(CENTER, CENTER);
  text(`${dailyKWh.toFixed(3)} kWh / Hari`, width / 2, cardY + 75);
  
  textSize(11); fill(16, 185, 129);
  text(`Estimasi Tagihan: Rp ${Math.round(monthlyCost).toLocaleString('id-ID')} / Bulan`, width / 2, cardY + 105);
  
  fill(239, 68, 68);
  text(`Estimasi CO₂: ~${monthlyCarbon.toFixed(1)} kg CO₂ / Bulan`, width / 2, cardY + 130);
}

/* ========================================================================= */
/* SECTION 11: COMMON RENDER HELPERS & GAUGES                               */
/* ========================================================================= */

function drawBatteryComponent(x, y, vVal) {
  push();
  translate(x, y);
  fill(30, 41, 59); stroke(248, 250, 252); strokeWeight(2);
  rect(-14, -24, 28, 48, 6);
  fill(225, 29, 72); rect(-7, -29, 14, 5, 2);
  fill(250, 204, 21); noStroke(); textAlign(CENTER, CENTER); fontMono(); textSize(10);
  text(`${vVal.toFixed(1)}V`, 0, 0);
  pop();
}

function drawLoadComponent(x, y, rVal, iVal, type) {
  push();
  translate(x, y);
  if (type === 'ohmic') {
    fill(30, 41, 59); stroke(225, 29, 72); strokeWeight(2.5);
    rect(-30, -14, 60, 28, 6);
    fill(248, 250, 252); noStroke(); textAlign(CENTER, CENTER); fontMono(); textSize(10);
    text(`R=${rVal}Ω`, 0, 0);
  } else if (type === 'filament') {
    const glowR = map(iVal, 0, 3, 12, 45);
    noStroke(); fill(250, 204, 21, map(glowR, 12, 45, 30, 200));
    ellipse(0, 0, glowR, glowR);
    stroke(250, 204, 21); fill(30, 41, 59); strokeWeight(2);
    ellipse(0, 0, 26, 26);
  } else {
    fill(225, 29, 72); stroke(225, 29, 72);
    triangle(-10, -8, -10, 8, 6, 0);
    strokeWeight(2.5); line(6, -8, 6, 8);
  }
  pop();
}

function drawAmmeterComponent(x, y, iVal) {
  push();
  translate(x, y);
  fill(15, 23, 42); stroke(217, 119, 6); strokeWeight(2.5);
  ellipse(0, 0, 38, 38);
  fill(250, 204, 21); noStroke(); textAlign(CENTER, CENTER); fontMono(); textSize(10);
  text(`${iVal.toFixed(2)}A`, 0, 0);
  pop();
}

function drawVoltmeterBranch(x1, x2, yBase, vVal) {
  push();
  stroke(250, 204, 21, 150); strokeWeight(1.5);
  line(x1, yBase, x1, yBase + 28); line(x2, yBase, x2, yBase + 28); line(x1, yBase + 28, x2, yBase + 28);
  const midX = (x1 + x2) / 2;
  fill(15, 23, 42); stroke(37, 99, 235); strokeWeight(2);
  ellipse(midX, yBase + 28, 34, 34);
  fill(248, 250, 252); noStroke(); textAlign(CENTER, CENTER); fontMono(); textSize(9);
  text(`${vVal.toFixed(1)}V`, midX, yBase + 28);
  pop();
}

function drawElectronDrift(left, right, top, bottom, iVal) {
  fill(245, 158, 11); noStroke();
  const speed = constrain(iVal * 2.0, 0.4, 8);
  const totalLen = 2 * (right - left) + 2 * (bottom - top);
  for (let d = 0; d < totalLen; d += 22) {
    let pos = (d + animOffset * speed) % totalLen;
    let x, y;
    if (pos < (right - left)) { x = left + pos; y = top; }
    else if (pos < (right - left) + (bottom - top)) { x = right; y = top + (pos - (right - left)); }
    else if (pos < 2 * (right - left) + (bottom - top)) { x = right - (pos - (right - left) - (bottom - top)); y = bottom; }
    else { x = left; y = bottom - (pos - 2 * (right - left) - (bottom - top)); }
    ellipse(x, y, 5, 5);
  }
}

function drawVIPlot(px, py, pw, ph, vCur, iCur, type) {
  push(); translate(px, py);
  fill(30, 41, 59, 230); stroke(51, 65, 85); strokeWeight(1.5);
  rect(0, 0, pw, ph, 8);
  stroke(148, 163, 184); line(15, ph - 12, pw - 12, ph - 12); line(15, ph - 12, 15, 12);
  fill(148, 163, 184); noStroke(); textSize(8); text("V", pw - 8, ph - 10); text("I", 10, 10);
  strokeWeight(2); noFill();
  if (type === 'ohmic') { stroke(37, 99, 235); line(15, ph - 12, pw - 15, 15); }
  else if (type === 'filament') {
    stroke(245, 158, 11); beginShape();
    for (let x = 15; x <= pw - 15; x += 3) {
      let normV = map(x, 15, pw - 15, 0, 1);
      let y = map(Math.sqrt(normV), 0, 1, ph - 12, 15);
      vertex(x, y);
    } endShape();
  }
  let ptX = map(vCur, 0, 24, 15, pw - 15);
  let ptY = map(iCur, 0, 3, ph - 12, 15);
  fill(239, 68, 68); noStroke(); ellipse(ptX, ptY, 6, 6);
  pop();
}

function drawDigitalOhmmeter(x, y, rVal) {
  push(); translate(x, y);
  fill(30, 41, 59); stroke(79, 70, 229); strokeWeight(2.5);
  rect(0, 0, 95, 65, 8);
  fill(248, 250, 252); noStroke(); textAlign(CENTER, TOP); fontMono(); textSize(9);
  text("OHMMETER", 47.5, 8);
  fill(250, 204, 21); textSize(11);
  text(`${rVal < 1 ? rVal.toFixed(3) : rVal.toFixed(2)} Ω`, 47.5, 34);
  pop();
}

function drawLampuGlow(x, y, rVal, iVal, label) {
  push(); translate(x, y);
  fill(250, 204, 21, 180); noStroke(); ellipse(0, 0, 34, 34);
  stroke(250, 204, 21); fill(30, 41, 59); strokeWeight(2); ellipse(0, 0, 22, 22);
  fill(248, 250, 252); noStroke(); textAlign(CENTER); fontMono(); textSize(9);
  text(label, 0, -15);
  pop();
}

function fontMono() {
  textFont('JetBrains Mono');
}

function updateLiveReadingsUI() {
  const container = document.getElementById('liveReadingsContainer');
  if (!container) return;

  let html = '';
  if (currentSubMateri === 'ohm') {
    const V = physicsState.voltage; const R = physicsState.resistance; const I = V / R; const P = V * I;
    html = `
      <div class="bg-indigo-900/60 p-2 rounded-lg border border-indigo-800">
        <span class="text-[9px] text-indigo-300 block">Tegangan (V)</span>
        <span class="text-xs font-bold text-blue-400">${V.toFixed(1)} V</span>
      </div>
      <div class="bg-indigo-900/60 p-2 rounded-lg border border-indigo-800">
        <span class="text-[9px] text-indigo-300 block">Hambatan (R)</span>
        <span class="text-xs font-bold text-rose-400">${R.toFixed(1)} Ω</span>
      </div>
      <div class="bg-indigo-900/60 p-2 rounded-lg border border-indigo-800">
        <span class="text-[9px] text-indigo-300 block">Arus Listrik (I)</span>
        <span class="text-xs font-bold text-amber-400">${I.toFixed(2)} A</span>
      </div>
      <div class="bg-indigo-900/60 p-2 rounded-lg border border-indigo-800">
        <span class="text-[9px] text-indigo-300 block">Daya Disipasi (P)</span>
        <span class="text-xs font-bold text-emerald-400">${P.toFixed(1)} W</span>
      </div>
    `;
  } else {
    html = `
      <div class="bg-indigo-900/60 p-2 rounded-lg border border-indigo-800 col-span-2">
        <span class="text-[9px] text-indigo-300 block">Status Sensor Virtual</span>
        <span class="text-xs font-bold text-emerald-400">Aktif & Bounded</span>
      </div>
    `;
  }
  container.innerHTML = html;
}