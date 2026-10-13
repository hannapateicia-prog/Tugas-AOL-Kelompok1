/* ========== BalitaKu - script.js ========== */
(function () {
  "use strict";

  /* ---------- Data (ganti dengan data dari backend/API) ---------- */
  var KEY = "balitaku-data";
  var S = {
    aktif: 1,
    anak: [{
      id: 1, nama: "Fadhil Nurazka", lahir: "2025-07-13", jk: "L", ortu: "Ibu Siti Nurazka", alamat: "Kesawan, Medan",
      pengukuran: [
        { bulan: 0, kg: 3.4, tb: 50 }, { bulan: 3, kg: 6.2, tb: 60 }, { bulan: 6, kg: 7.6, tb: 66 },
        { bulan: 9, kg: 8.8, tb: 71 }, { bulan: 12, kg: 9.5, tb: 75 }, { bulan: 15, kg: 10.0, tb: 79 }
      ],
      imun: ["HB-0", "BCG", "Polio 1", "DPT-HB-Hib 1", "Polio 2", "DPT-HB-Hib 2", "Polio 3", "DPT-HB-Hib 3", "Polio 4", "Campak/MR"]
    }],
    antrean: [
      { no: "A-01", nama: "Aisyah Putri", st: "Selesai" }, { no: "A-02", nama: "Rafi Pratama", st: "Selesai" },
      { no: "A-03", nama: "Dinda Lestari", st: "Dipanggil" }, { no: "A-04", nama: "Naufal Hakim", st: "Menunggu" }
    ],
    tiket: null
  };
  try { var raw = localStorage.getItem(KEY); if (raw) S = JSON.parse(raw); } catch (e) {}
  function simpan() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  var VAKSIN = [
    ["HB-0", "Saat lahir"], ["BCG", "Usia 1 bulan"], ["Polio 1", "Usia 1 bulan"], ["DPT-HB-Hib 1", "Usia 2 bulan"],
    ["Polio 2", "Usia 2 bulan"], ["DPT-HB-Hib 2", "Usia 3 bulan"], ["Polio 3", "Usia 3 bulan"],
    ["DPT-HB-Hib 3", "Usia 4 bulan"], ["Polio 4", "Usia 4 bulan"], ["Campak/MR", "Usia 9 bulan"],
    ["DPT-HB-Hib lanjutan", "Usia 18 bulan"], ["MR lanjutan", "Usia 18 bulan"]
  ];
  var ARTIKEL = [
    { k: "Imunisasi", ic: "💉", j: "Pentingnya Imunisasi Dasar", r: "Ketahui jadwal imunisasi anak agar terlindung dari penyakit.",
      b: ["Imunisasi membantu tubuh anak mengenali dan melawan penyakit berbahaya sebelum anak benar-benar sakit.", "Imunisasi dasar lengkap diberikan sejak lahir sampai usia 18 bulan di Posyandu atau Puskesmas.", ["Bawa buku KIA setiap kunjungan", "Anak boleh diimunisasi saat batuk pilek ringan", "Demam ringan setelah imunisasi itu wajar; beri minum lebih banyak"], "Bila anak tertinggal jadwal, jangan menunggu. Segera tanyakan ke kader atau bidan."] },
    { k: "Kesehatan", ic: "🌡️", t: 1, j: "Tips Mengatasi Demam Tinggi", r: "Langkah di rumah dan kapan harus ke dokter.",
      b: ["Demam adalah cara tubuh melawan infeksi. Yang penting adalah menjaga anak tetap nyaman.", ["Pakaikan baju tipis dan longgar", "Beri minum sedikit-sedikit tapi sering", "Kompres dengan air hangat, bukan air dingin", "Beri obat penurun demam sesuai petunjuk tenaga kesehatan"], "Segera ke dokter bila demam lebih dari 3 hari, anak kejang, sangat lemas, sulit bernapas, atau bayi di bawah 3 bulan demam."] },
    { k: "Gizi", ic: "🥣", t: 1, j: "MPASI Pertama untuk Bayi 6 Bulan", r: "Mulai makanan pendamping ASI dengan tepat.",
      b: ["Mulai usia 6 bulan, ASI saja tidak cukup. Bayi perlu makanan pendamping (MPASI).", ["Mulai dari bubur halus, 2-3 sendok makan", "Tambahkan protein hewani: telur, ikan, hati ayam", "Kenalkan satu bahan baru setiap 3 hari", "Jangan beri gula dan garam berlebihan"], "Teruskan ASI sampai usia 2 tahun atau lebih."] },
    { k: "Tumbuh Kembang", ic: "📏", j: "Cara Membaca Kurva Pertumbuhan", r: "Pahami arti warna hijau, kuning, dan merah muda.",
      b: ["Kurva membandingkan berat badan anak dengan standar WHO untuk usia yang sama.", ["Area hijau: berat badan normal", "Area kuning: di atas normal, perlu dipantau", "Area merah muda: di bawah normal, konsultasikan ke kader atau bidan"], "Yang terpenting adalah arah kurva. Anak yang naik teratur sudah baik, meski di bawah median."] }
  ];

  /* ---------- Bantuan ---------- */
  var $ = function (s) { return document.querySelector(s); };
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(n) { return String(n).replace(".", ","); }
  function aktif() { return S.anak.filter(function (a) { return a.id === S.aktif; })[0] || S.anak[0]; }
  function usia(lahir) {
    var l = new Date(lahir), n = new Date();
    return Math.max(0, (n.getFullYear() - l.getFullYear()) * 12 + n.getMonth() - l.getMonth() - (n.getDate() < l.getDate() ? 1 : 0));
  }
  function teksUsia(b) { return b >= 24 ? Math.floor(b / 12) + " thn " + (b % 12) + " bln" : b + " bulan"; }
  function inisial(n) { return n.split(" ").slice(0, 2).map(function (x) { return x[0]; }).join("").toUpperCase(); }
  function toast(t) { var e = $("#toast"); e.textContent = t; e.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(function () { e.classList.remove("show"); }, 2600); }
  function pilihAnakHTML(id) {
    return '<select id="' + id + '" aria-label="Pilih anak">' + S.anak.map(function (a) {
      return '<option value="' + a.id + '"' + (a.id === S.aktif ? " selected" : "") + ">" + esc(a.nama) + "</option>";
    }).join("") + "</select>";
  }

  /* ---------- Acuan WHO & status ---------- */
  var BULAN = [0, 3, 6, 9, 12, 15, 18, 21, 24];
  var BATAS_BAWAH = [2.5, 5.0, 6.4, 7.1, 7.7, 8.3, 8.8, 9.2, 9.7];
  var MEDIAN = [3.31, 6.4, 7.9, 8.9, 9.6, 10.3, 10.9, 11.5, 12.2];
  var BATAS_ATAS = [4.3, 8.0, 9.8, 10.9, 12.0, 13.0, 13.7, 14.5, 15.3];
  function interp(arr, b) {
    for (var i = 0; i < BULAN.length - 1; i++) if (b >= BULAN[i] && b <= BULAN[i + 1]) {
      var t = (b - BULAN[i]) / (BULAN[i + 1] - BULAN[i]); return arr[i] + (arr[i + 1] - arr[i]) * t;
    }
    return arr[arr.length - 1];
  }
  function status(b, kg) {
    if (kg < interp(BATAS_BAWAH, b)) return { teks: "Di bawah normal", cls: "bad", badge: "Berat badan di bawah normal" };
    if (kg > interp(BATAS_ATAS, b)) return { teks: "Di atas normal", cls: "warn", badge: "Berat badan di atas normal" };
    return { teks: "Normal", cls: "ok", badge: "Berat badan normal" };
  }
  function terakhir(a) { var d = a.pengukuran; return d.length ? d[d.length - 1] : null; }

  /* ---------- Grafik ---------- */
  var X0 = 38, X1 = 456, Y0 = 195, YTOP = 10, PX = 11.5625, NS = "http://www.w3.org/2000/svg";
  function sx(m) { return X0 + (Math.min(m, 24) / 24) * (X1 - X0); }
  function sy(kg) { return Math.max(YTOP, Y0 - kg * PX); }
  function el(n, at, p) { var e = document.createElementNS(NS, n); for (var k in at) e.setAttribute(k, at[k]); if (p) p.appendChild(e); return e; }
  function smooth(pts) {
    var d = "M" + pts[0][0].toFixed(1) + "," + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += " C" + [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]].map(function (n) { return n.toFixed(1); }).join(",");
    }
    return d;
  }
  function toPts(a) { return a.map(function (kg, i) { return [sx(BULAN[i]), sy(kg)]; }); }
  function drawChart() {
    var plot = $("#plot"), xa = $("#xaxis"); if (!plot) return;
    plot.innerHTML = ""; xa.innerHTML = "";
    var up = toPts(BATAS_ATAS), mid = toPts(MEDIAN), lo = toPts(BATAS_BAWAH), upPath = smooth(up);
    el("path", { "class": "z-hi", d: upPath + " L" + X1 + "," + YTOP + " L" + X0 + "," + YTOP + " Z" }, plot);
    var back = smooth(lo.slice().reverse()).replace(/^M[^C]+/, "");
    el("path", { "class": "z-ok", d: upPath + " L" + lo[lo.length - 1][0] + "," + lo[lo.length - 1][1].toFixed(1) + " " + back + " Z" }, plot);
    el("path", { "class": "z-lo", d: smooth(lo) + " L" + X1 + "," + Y0 + " L" + X0 + "," + Y0 + " Z" }, plot);
    el("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: "var(--axis)", "stroke-opacity": ".5" }, plot);
    el("line", { x1: X0, y1: YTOP, x2: X0, y2: Y0, stroke: "var(--axis)", "stroke-opacity": ".5" }, plot);
    BULAN.forEach(function (m) {
      el("line", { x1: sx(m), y1: Y0, x2: sx(m), y2: Y0 + 3, stroke: "var(--axis)" }, plot);
      el("text", { x: sx(m), y: 209 }, xa).textContent = m;
    });
    el("path", { d: smooth(mid), fill: "none", stroke: "var(--median)", "stroke-width": 1.5, "stroke-dasharray": "4 3" }, plot);
    var d = aktif().pengukuran; if (!d.length) return;
    el("polyline", { points: d.map(function (p) { return sx(p.bulan).toFixed(1) + "," + sy(p.kg).toFixed(1); }).join(" "), fill: "none", stroke: "var(--primary)", "stroke-width": 2.5, "stroke-linejoin": "round", "stroke-linecap": "round" }, plot);
    d.forEach(function (p, i) {
      var last = i === d.length - 1;
      el("circle", { "class": "pt" + (last ? " last" : ""), cx: sx(p.bulan), cy: sy(p.kg), r: last ? 4.5 : 3.5 }, plot).appendChild(el("title", {})).textContent = p.bulan + " bulan: " + fmt(p.kg) + " kg" + (last ? " (terbaru)" : "");
    });
  }

  /* ---------- Menu ---------- */
  var ic = {
    home: '<rect x="3.5" y="3.5" width="7" height="8" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="5" rx="1.5"/><rect x="13.5" y="11.5" width="7" height="9" rx="1.5"/><rect x="3.5" y="14.5" width="7" height="6" rx="1.5"/>',
    queue: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5.5 5h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"/>',
    people: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    art: '<path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M9 12h6M9 16h6M9 8h3"/>',
    rec: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M8.5 14.5l2.2 2.2 4.3-4.4"/>'
  };
  var NAV = [
    { v: "dashboard", l: "Dashboard", s: "Beranda", i: "home" }, { v: "antrean", l: "Antrean", s: "Antrean", i: "queue" },
    { v: "peserta", l: "Peserta", s: "Peserta", i: "people" }, { v: "artikel", l: "Artikel Edukasi", s: "Artikel", i: "art" },
    { v: "rekam", l: "Rekam Kesehatan", s: "Rekam", i: "rec" }
  ];
  var cur = "dashboard";
  function renderNav() {
    function make(short) {
      return NAV.map(function (n) {
        var on = n.v === cur;
        return '<a href="#' + n.v + '" data-act="nav" data-v="' + n.v + '"' + (on ? ' class="active" aria-current="page"' : "") + '><svg viewBox="0 0 24 24">' + ic[n.i] + "</svg>" + (short ? n.s : n.l) + "</a>";
      }).join("");
    }
    $("#navSide").innerHTML = make(false); $("#navBottom").innerHTML = make(true);
  }

  /* ---------- Tampilan ---------- */
  var V = {};
  V.dashboard = function () {
    var a = aktif(), l = terakhir(a), s = l ? status(l.bulan, l.kg) : null;
    return '<h1>Selamat datang di <b>BalitaKu</b>!</h1><p class="sub">Kelola informasi pertumbuhan anak dengan mudah.</p>' +
      '<div class="quick">' +
      q("antrean", "🎫", "Ambil Antrean") + q("tambahAnak", "👶", "Daftarkan Anak") + q("tambahCek", "⚖️", "Input Checkup") + q("artikel", "📖", "Baca Artikel") + "</div>" +
      '<div class="stats"><div class="stat"><small>Usia terakhir</small><strong>' + (l ? teksUsia(l.bulan) : "–") + '</strong></div>' +
      '<div class="stat"><small>Berat badan</small><strong>' + (l ? fmt(l.kg) + " kg" : "–") + '</strong></div>' +
      '<div class="stat"><small>Status gizi</small><strong class="' + (s ? s.cls : "") + '">' + (s ? s.teks : "–") + "</strong></div></div>" +
      '<div class="grid"><div class="col">' +
      '<section class="card"><h2>Jadwal Kunjungan Selanjutnya</h2><div class="visit"><div class="ico">📅</div><div><div class="name">' + esc(a.nama) + '</div><div class="place">Posyandu Kesawan</div><div class="time">25 Oktober 2026, 09.30</div><button class="link" data-act="nav" data-v="antrean">Ambil nomor antrean →</button></div></div></section>' +
      '<section class="card"><h2 style="margin-bottom:14px">Artikel Edukasi</h2>' + [0, 1].map(function (i) {
        return '<article class="art"><div class="info"><h3>' + ARTIKEL[i].j + "</h3><p>" + ARTIKEL[i].r + '</p><button class="link" data-act="baca" data-i="' + i + '">Baca sekarang</button></div><div class="tile' + (ARTIKEL[i].t ? " o" : "") + '">' + ARTIKEL[i].ic + "</div></article>";
      }).join("") + "</section></div>" +
      '<section class="card"><div class="kurva-head"><h2>Kurva Pertumbuhan ' + esc(a.nama.split(" ")[0]) + '</h2>' + (s ? '<span class="badge ' + (s.cls === "ok" ? "" : s.cls) + '">' + s.badge + "</span>" : "") + "</div>" +
      '<svg class="chart" viewBox="0 0 479 232" role="img" aria-label="Kurva pertumbuhan berat badan ' + esc(a.nama) + (s ? ". " + s.badge : "") + '."><g id="plot"></g>' +
      '<g text-anchor="end"><text x="32" y="13">16</text><text x="32" y="59">12</text><text x="32" y="105">8</text><text x="32" y="152">4</text><text x="32" y="198">0</text></g>' +
      '<text x="6" y="103" transform="rotate(-90 6 103)" text-anchor="middle">Berat badan (kg)</text><g id="xaxis" text-anchor="middle"></g><text x="247" y="224" text-anchor="middle">Usia (bulan)</text></svg>' +
      '<div class="legend"><span class="it"><i class="ln" style="background:var(--primary)"></i>' + esc(a.nama) + '</span><span class="it"><i class="ln" style="background:var(--median)"></i>Median WHO</span><span class="it"><i class="sq" style="background:var(--z-ok)"></i>Normal</span><span class="it"><i class="sq" style="background:var(--z-lo)"></i>Di bawah normal</span><span class="it"><i class="sq" style="background:var(--z-hi)"></i>Di atas normal</span></div>' +
      '<p class="note">Kurva diperbarui otomatis setelah kader menginput hasil checkup.</p></section></div>';
  };
  function q(act, ico, t) { var nav = act === "antrean" || act === "artikel"; return '<button class="q" data-act="' + (nav ? "nav" : act) + '"' + (nav ? ' data-v="' + act + '"' : "") + '><span class="ic">' + ico + "</span>" + t + "</button>"; }

  V.antrean = function () {
    var t = S.tiket, now = S.antrean.filter(function (x) { return x.st === "Dipanggil"; })[0] || S.antrean.filter(function (x) { return x.st === "Menunggu"; })[0];
    return '<div class="page-head"><div><h1><b>Antrean</b> Posyandu</h1><p class="sub">Ambil nomor antrean dari rumah, lalu datang saat nomor Anda hampir dipanggil.</p></div></div>' +
      '<div class="grid"><div class="col">' +
      (t ? '<div class="ticket"><small>Nomor antrean Anda</small><div class="no">' + esc(t.no) + "</div><p>" + esc(t.nama) + "<br>Posyandu Kesawan · " + esc(t.tgl) + '</p></div><button class="btn ghost block" data-act="batalAntre">Batalkan antrean</button>' :
        '<section class="card"><h2 style="margin-bottom:14px">Ambil Nomor Antrean</h2><div class="field"><label for="aAnak">Anak yang akan diperiksa</label>' + pilihAnakHTML("aAnak") + '</div><div class="field"><label for="aTgl">Tanggal kunjungan</label><input type="date" id="aTgl" value="2026-10-25"></div><button class="btn block" data-act="ambilAntrean">🎫 Ambil Nomor Antrean</button></section>') +
      "</div>" +
      '<section class="card"><h2 style="margin-bottom:14px">Antrean Hari Ini</h2>' + (now ? '<div class="now"><span>Sedang dilayani</span><b>' + now.no + "</b></div>" : "") +
      '<ul class="queue">' + S.antrean.map(function (x) {
        var cls = x.st === "Selesai" ? "" : x.st === "Dipanggil" ? "warn" : "mut";
        return '<li class="' + (t && t.no === x.no ? "me" : "") + '"><span class="n">' + x.no + '</span><span class="nm">' + esc(x.nama) + (t && t.no === x.no ? " (Anda)" : "") + '</span><span class="pill ' + (x.st === "Selesai" ? "" : cls) + '" style="margin:0">' + x.st + "</span></li>";
      }).join("") + "</ul></section></div>";
  };

  V.peserta = function () {
    return '<div class="page-head"><div><h1><b>Peserta</b> Posyandu</h1><p class="sub">Daftar anak yang terdaftar. Ketuk kartu untuk memilih anak.</p></div><button class="btn" data-act="tambahAnak">＋ Daftarkan Anak</button></div>' +
      '<input class="search" id="cari" type="search" placeholder="Cari nama anak…" aria-label="Cari nama anak"><div class="kids" id="kids">' + kidsHTML("") + "</div>";
  };
  function kidsHTML(f) {
    var r = S.anak.filter(function (a) { return a.nama.toLowerCase().indexOf(f.toLowerCase()) > -1; });
    if (!r.length) return '<div class="card empty" style="grid-column:1/-1">Tidak ada anak dengan nama tersebut.</div>';
    return r.map(function (a) {
      var l = terakhir(a), s = l ? status(l.bulan, l.kg) : null;
      return '<button class="kid' + (a.id === S.aktif ? " on" : "") + '" data-act="pilih" data-id="' + a.id + '" style="text-align:left;cursor:pointer"><span class="av">' + inisial(a.nama) + '</span><span class="info"><h3>' + esc(a.nama) + "</h3><p>" + (a.jk === "L" ? "Laki-laki" : "Perempuan") + " · " + teksUsia(usia(a.lahir)) + "<br>Orang tua: " + esc(a.ortu) + "</p>" +
        (s ? '<span class="pill ' + (s.cls === "ok" ? "" : s.cls) + '">' + s.teks + "</span>" : '<span class="pill mut">Belum ditimbang</span>') + (a.id === S.aktif ? ' <span class="pill mut">Dipilih</span>' : "") + "</span></button>";
    }).join("");
  }

  var kat = "Semua";
  V.artikel = function () {
    var ks = ["Semua"].concat(ARTIKEL.map(function (a) { return a.k; }));
    return '<div class="page-head"><div><h1><b>Artikel</b> Edukasi</h1><p class="sub">Bacaan singkat dan mudah dipahami seputar kesehatan anak.</p></div></div>' +
      '<div class="chips">' + ks.map(function (k) { return '<button class="chip' + (k === kat ? " on" : "") + '" data-act="kat" data-k="' + k + '">' + k + "</button>"; }).join("") + "</div>" +
      '<div class="art-list">' + ARTIKEL.map(function (a, i) {
        if (kat !== "Semua" && a.k !== kat) return "";
        return '<button class="art-card" data-act="baca" data-i="' + i + '"><span class="tile' + (a.t ? " o" : "") + '">' + a.ic + '</span><span class="tag">' + a.k + "</span><h3>" + a.j + "</h3><p>" + a.r + "</p></button>";
      }).join("") + "</div>";
  };

  V.rekam = function () {
    var a = aktif(), d = a.pengukuran.slice().reverse();
    return '<div class="page-head"><div><h1><b>Rekam</b> Kesehatan</h1><p class="sub">Riwayat timbang, tinggi badan, dan imunisasi.</p></div><button class="btn" data-act="tambahCek">＋ Input Checkup</button></div>' +
      '<div class="sel-bar"><label for="rAnak" style="font-weight:700">Anak:</label>' + pilihAnakHTML("rAnak") + "</div>" +
      '<h2 class="sec-title">Riwayat Checkup</h2><section class="card tbl-wrap">' + (d.length ? "<table><thead><tr><th>Usia</th><th>Berat</th><th>Tinggi</th><th>Status</th></tr></thead><tbody>" + d.map(function (p) {
        var s = status(p.bulan, p.kg); return "<tr><td>" + teksUsia(p.bulan) + "</td><td>" + fmt(p.kg) + " kg</td><td>" + (p.tb ? fmt(p.tb) + " cm" : "–") + '</td><td><span class="pill ' + (s.cls === "ok" ? "" : s.cls) + '" style="margin:0">' + s.teks + "</span></td></tr>";
      }).join("") + "</tbody></table>" : '<div class="empty">Belum ada data. Ketuk “Input Checkup” untuk menambah.</div>') + "</section>" +
      '<h2 class="sec-title">Imunisasi <span style="font-weight:500;color:var(--muted);font-size:15px">(' + a.imun.length + " dari " + VAKSIN.length + ' selesai)</span></h2><section class="card"><ul class="imun">' + VAKSIN.map(function (v) {
        var d2 = a.imun.indexOf(v[0]) > -1;
        return '<li class="' + (d2 ? "done" : "") + '"><button data-act="imun" data-n="' + v[0] + '" aria-pressed="' + d2 + '"><span class="box">' + (d2 ? "✓" : "") + '</span><span class="t"><b>' + v[0] + "</b><small>" + v[1] + "</small></span><span class=\"pill " + (d2 ? "" : "mut") + '" style="margin:0">' + (d2 ? "Sudah" : "Belum") + "</span></button></li>";
      }).join("") + "</ul></section>";
  };

  /* ---------- Render halaman ---------- */
  function go(v) {
    if (!V[v]) v = "dashboard";
    cur = v; renderNav();
    $("#view").innerHTML = V[v]();
    $("#topTitle").textContent = NAV.filter(function (n) { return n.v === v; })[0].l;
    if (v === "dashboard") drawChart();
    window.scrollTo(0, 0);
  }
  function refresh() { go(cur); }

  /* ---------- Pop-up ---------- */
  var onClose = null;
  function modal(judul, html, wide) {
    $("#mTitle").textContent = judul; $("#mBody").innerHTML = html;
    document.querySelector(".sheet").className = "sheet" + (wide ? " wide" : "");
    $("#modal").hidden = false;
    var f = $("#mBody input,#mBody select,#mBody .btn"); if (f) f.focus();
  }
  function tutup() { $("#modal").hidden = true; $("#mBody").innerHTML = ""; }

  function formAnak() {
    modal("Daftarkan Anak Baru",
      '<form id="fAnak" novalidate><div class="field"><label for="fNama">Nama lengkap anak</label><input id="fNama" required autocomplete="off" placeholder="Contoh: Aisyah Putri"></div>' +
      '<div class="field"><label for="fLahir">Tanggal lahir</label><input type="date" id="fLahir" required max="2026-10-13"></div>' +
      '<div class="field"><label>Jenis kelamin</label><div class="seg"><label><input type="radio" name="jk" value="L" checked><span>👦 Laki-laki</span></label><label><input type="radio" name="jk" value="P"><span>👧 Perempuan</span></label></div></div>' +
      '<div class="field"><label for="fOrtu">Nama orang tua</label><input id="fOrtu" required autocomplete="off"></div>' +
      '<div class="field"><label for="fAlamat">Alamat</label><input id="fAlamat" autocomplete="off"></div><p id="fErr" class="bad" style="margin-bottom:10px;font-weight:600"></p>' +
      '<div class="actions"><button type="button" class="btn ghost" data-act="tutup">Batal</button><button class="btn" type="submit">Simpan</button></div></form>');
    $("#fAnak").addEventListener("submit", function (e) {
      e.preventDefault();
      var n = $("#fNama").value.trim(), l = $("#fLahir").value, o = $("#fOrtu").value.trim();
      if (!n || !l || !o) { $("#fErr").textContent = "Mohon isi nama anak, tanggal lahir, dan nama orang tua."; return; }
      var id = Date.now();
      S.anak.push({ id: id, nama: n, lahir: l, jk: document.querySelector('input[name="jk"]:checked').value, ortu: o, alamat: $("#fAlamat").value.trim(), pengukuran: [], imun: [] });
      S.aktif = id; simpan(); tutup(); toast("✓ " + n + " berhasil didaftarkan"); go("peserta");
    });
  }

  function formCek() {
    var a = aktif();
    modal("Input Hasil Checkup",
      '<form id="fCek" novalidate><div class="field"><label for="cAnak">Anak</label>' + pilihAnakHTML("cAnak") + "</div>" +
      '<div class="field"><label for="cBln">Usia saat ditimbang (bulan)</label><input id="cBln" type="number" inputmode="numeric" min="0" max="60" value="' + usia(a.lahir) + '"></div>' +
      '<div class="row2"><div class="field"><label for="cKg">Berat (kg)</label><input id="cKg" type="number" inputmode="decimal" step="0.1" min="1" max="30"></div><div class="field"><label for="cTb">Tinggi (cm)</label><input id="cTb" type="number" inputmode="decimal" step="0.1" min="30" max="130"></div></div>' +
      '<p id="cErr" class="bad" style="margin-bottom:10px;font-weight:600"></p><div class="actions"><button type="button" class="btn ghost" data-act="tutup">Batal</button><button class="btn" type="submit">Simpan</button></div></form>');
    $("#cAnak").addEventListener("change", function () { S.aktif = +this.value; $("#cBln").value = usia(aktif().lahir); });
    $("#fCek").addEventListener("submit", function (e) {
      e.preventDefault();
      var b = parseInt($("#cBln").value, 10), kg = parseFloat($("#cKg").value.replace(",", ".")), tb = parseFloat($("#cTb").value.replace(",", "."));
      if (isNaN(b) || isNaN(kg)) { $("#cErr").textContent = "Mohon isi usia dan berat badan."; return; }
      var an = aktif(); an.pengukuran = an.pengukuran.filter(function (p) { return p.bulan !== b; });
      an.pengukuran.push({ bulan: b, kg: kg, tb: isNaN(tb) ? 0 : tb });
      an.pengukuran.sort(function (x, y) { return x.bulan - y.bulan; });
      simpan(); tutup(); var s = status(b, kg); toast("✓ Tersimpan. " + s.badge); go(cur === "rekam" ? "rekam" : "dashboard");
    });
  }

  function baca(i) {
    var a = ARTIKEL[i];
    modal(a.j, '<div class="reader"><span class="tag" style="margin-bottom:14px;display:inline-block">' + a.k + "</span>" + a.b.map(function (x) {
      return typeof x === "string" ? "<p>" + x + "</p>" : "<ul>" + x.map(function (li) { return "<li>" + li + "</li>"; }).join("") + "</ul>";
    }).join("") + '</div><button class="btn block" data-act="tutup">Selesai membaca</button>', true);
  }

  /* ---------- Aksi ---------- */
  document.addEventListener("click", function (e) {
    if (e.target.id === "modal") return tutup();
    var t = e.target.closest("[data-act]"); if (!t) return;
    var act = t.getAttribute("data-act");
    if (t.tagName === "A") e.preventDefault();
    if (act === "nav") go(t.getAttribute("data-v"));
    else if (act === "tutup") tutup();
    else if (act === "tambahAnak") formAnak();
    else if (act === "tambahCek") formCek();
    else if (act === "baca") baca(+t.getAttribute("data-i"));
    else if (act === "kat") { kat = t.getAttribute("data-k"); refresh(); }
    else if (act === "pilih") { S.aktif = +t.getAttribute("data-id"); simpan(); $("#kids").innerHTML = kidsHTML($("#cari").value); toast("Dipilih: " + aktif().nama); }
    else if (act === "imun") {
      var a = aktif(), n = t.getAttribute("data-n"), k = a.imun.indexOf(n);
      if (k > -1) a.imun.splice(k, 1); else a.imun.push(n);
      simpan(); refresh();
    }
    else if (act === "ambilAntrean") {
      var an = S.anak.filter(function (x) { return x.id === +$("#aAnak").value; })[0], tgl = $("#aTgl").value;
      if (!tgl) return toast("Pilih tanggal kunjungan dulu");
      var no = "A-" + ("0" + (S.antrean.length + 1)).slice(-2), d = new Date(tgl);
      S.antrean.push({ no: no, nama: an.nama, st: "Menunggu" });
      S.tiket = { no: no, nama: an.nama, tgl: d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) };
      simpan(); toast("✓ Nomor antrean " + no + " didapat"); refresh();
    }
    else if (act === "batalAntre") {
      modal("Batalkan antrean?", '<p style="margin-bottom:16px;font-size:16px">Nomor ' + S.tiket.no + ' akan dihapus dari daftar.</p><div class="actions"><button class="btn ghost" data-act="tutup">Tidak</button><button class="btn" data-act="yaBatal">Ya, batalkan</button></div>');
    }
    else if (act === "yaBatal") { S.antrean = S.antrean.filter(function (x) { return x.no !== S.tiket.no; }); S.tiket = null; simpan(); tutup(); toast("Antrean dibatalkan"); refresh(); }
    else if (act === "logout") {
      modal("Keluar dari BalitaKu?", '<p style="margin-bottom:16px;font-size:16px">Anda perlu masuk lagi untuk membuka data anak.</p><div class="actions"><button class="btn ghost" data-act="tutup">Batal</button><button class="btn" data-act="yaKeluar">Ya, keluar</button></div>');
    }
    else if (act === "yaKeluar") {
      tutup(); $(".app").innerHTML = '<div class="content" style="text-align:center;padding-top:15vh"><div style="font-size:64px">👋</div><h1><b>Sampai jumpa!</b></h1><p class="sub" style="margin:8px auto 24px">Anda sudah keluar dari BalitaKu.</p><button class="btn" onclick="location.reload()">Masuk lagi</button></div>';
      $("#navBottom").hidden = true;
    }
  });
  document.addEventListener("input", function (e) { if (e.target.id === "cari") $("#kids").innerHTML = kidsHTML(e.target.value); });
  document.addEventListener("change", function (e) {
    if (e.target.id === "rAnak") { S.aktif = +e.target.value; simpan(); refresh(); }
    if (e.target.id === "aAnak") { S.aktif = +e.target.value; }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("#modal").hidden) tutup(); });
  window.addEventListener("hashchange", function () { var v = location.hash.slice(1); if (v !== cur) go(v); });

  /* ---------- Tema terang/gelap ---------- */
  (function () {
    var root = document.documentElement, btn = $("#themeBtn");
    try { var sv = localStorage.getItem("balitaku-theme"); if (sv) root.setAttribute("data-theme", sv); } catch (e) {}
    btn.addEventListener("click", function () {
      var c = root.getAttribute("data-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), n = c === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", n); try { localStorage.setItem("balitaku-theme", n); } catch (e) {}
    });
  })();

  go(location.hash.slice(1) || "dashboard");

  // Tambah hasil checkup dari luar, mis. BalitaKu.tambahPengukuran(18, 10.9)
  window.BalitaKu = { tambahPengukuran: function (b, kg) { var a = aktif(); a.pengukuran.push({ bulan: b, kg: kg, tb: 0 }); a.pengukuran.sort(function (x, y) { return x.bulan - y.bulan; }); simpan(); refresh(); } };
})();