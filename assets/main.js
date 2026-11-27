/* =========================================================
   SİTE AYARLARI — bilgilerinizi buradan güncelleyin
   ========================================================= */
const SITE = {
  firma: "Yangın Uzmanı Raporu",
  slogan: "Yangın güvenliğinde kariyer ve eğitim",
  alanAdi: "yanginuzmaniraporu.com",
  telefon: "+90 (212) 909 91 37",
  eposta: "sservi@takipisg.com",
  adres: "Maltepe Piazza OfficeLink, Cevizli, Tugay Yolu Cd. No: 69/A, İç Kapı No: 222, 34846 Maltepe / İstanbul",
  // YGU eğitimlerinde iş birliği yapılan, Bakanlıkça yetkilendirilmiş eğitici kuruluşun adı.
  // Boş bırakılırsa sitede "Bakanlıkça yetkilendirilmiş eğitici kuruluş" ifadesi görünür.
  egitimOrtagi: "",
  // Form gönderimleri için (ör. https://formspree.io/f/xxxx). Boşsa e-posta istemcisi açılır.
  formEndpoint: "",
  // Blog yorumları için Giscus ayarları (https://giscus.app). Boşsa yorum alanı bilgi notu gösterir.
  giscus: { repo: "", repoId: "", category: "", categoryId: "" }
};

const NAV = [
  ["meslek.html", "Meslek"],
  ["yol-haritasi.html", "Yol Haritası"],
  ["egitim.html", "Eğitim"],
  ["sorular.html", "Sorular"],
  ["blog.html", "Blog"],
  ["iletisim.html", "İletişim"],
];

/* Logo: köşesi kıvrık rapor sayfası + alev */
const LOGO = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 2.5h8.5L19 7v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V4a1.5 1.5 0 0 1 1-1.5z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/><path d="M14.5 2.5V7H19" stroke="white" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9.5c.7 2-.9 2.9-.9 4.3 0 .9.7 1.6 1.5 1.6 1 0 1.5-.8 1.3-1.9 1.2 1 1.8 2.3 1.8 3.5 0 2.1-1.7 3.5-3.7 3.5s-3.7-1.4-3.7-3.4c0-3 3.1-4.6 3.7-7.6z" fill="#8db7ff"/></svg>';
const WORDMARK = 'Yangın Uzmanı <b>Raporu</b>';
const ICON_TEL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:6px"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
const ICON_MAIL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:6px"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>';

function currentPage() {
  const p = location.pathname.split("/").pop();
  return p === "" ? "index.html" : p;
}

function storageGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function storageSet(k, v) { try { localStorage.setItem(k, v); } catch { /* yok say */ } }

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const cur = currentPage();
  const PARENT = { "yazi.html": "blog.html" };
  const links = NAV.map(([href, label]) => {
    const active = cur === href || PARENT[cur] === href;
    return `<a href="${href}" class="${active ? "active" : ""}">${label}</a>`;
  }).join("");

  // Üst iletişim çubuğu header'ın önüne eklenir
  const pre = `<div class="topbar"><div class="container">
      <div class="left">
        <a href="tel:${SITE.telefon.replace(/[^\d+]/g, "")}">${ICON_TEL}${SITE.telefon}</a>
        <a href="mailto:${SITE.eposta}" class="hide-sm">${ICON_MAIL}${SITE.eposta}</a>
      </div>
      <span class="hide-sm">${SITE.alanAdi}</span>
    </div></div>`;
  el.insertAdjacentHTML("beforebegin", pre);

  el.className = "site-header";
  el.innerHTML = `
    <div class="container">
      <a class="brand" href="index.html">
        <span class="brand-mark">${LOGO}</span>
        <span class="wordmark">${WORDMARK}<small>${SITE.slogan}</small></span>
      </a>
      <button class="nav-toggle" aria-label="Menü" onclick="document.querySelector('.nav').classList.toggle('open')">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <nav class="nav">${links}<a class="btn btn-accent" href="egitim.html#on-basvuru">Ön Başvuru</a></nav>
    </div>`;
  el.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => el.querySelector(".nav").classList.remove("open")));
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.className = "site-footer";
  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html" style="margin-bottom:14px"><span class="brand-mark">${LOGO}</span><span class="wordmark">${WORDMARK}</span></a>
          <p>Yangın Güvenlik Uzmanlığında kariyer planlayanlar için mevzuat, eğitim ve sahaya hazırlık platformu.</p>        </div>
        <div><h4>Platform</h4><ul>
          <li><a href="meslek.html">Meslek</a></li>
          <li><a href="yol-haritasi.html">Yol Haritası</a></li>
          <li><a href="egitim.html">Eğitim</a></li>
          <li><a href="sorular.html">Sorular ve Cevaplar</a></li>
          <li><a href="blog.html">Blog</a></li></ul></div>
        <div><h4>Kaynaklar</h4><ul>
          <li><a href="index.html#sunum">Mevzuat Rehberi Sunumu</a></li>
          <li><a href="sunum/ygu-mevzuat-rehberi.pdf" download>Sunum (PDF)</a></li>
          <li><a href="yol-haritasi.html#takvim">Mevzuat Takip Çizelgesi</a></li>
          <li><a href="egitim.html#deneme">Deneme Sınavı</a></li>
          <li><a href="meslek.html#vakalar">Vaka Dersleri</a></li></ul></div>
        <div><h4>İletişim</h4><ul>
          <li><a href="tel:${SITE.telefon.replace(/[^\d+]/g, "")}">${SITE.telefon}</a></li>
          <li><a href="mailto:${SITE.eposta}">${SITE.eposta}</a></li>
          <li><a href="iletisim.html">İletişim formu</a></li></ul></div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${SITE.firma}. YGU'ya ilişkin içerikler ÇŞİDB yönetmelik taslağına, bina kuralları 27.11.2026 tarihli Bina Yangın Yönetmeliği'ne dayanır.</span>
        <span><a href="kvkk.html">KVKK Aydınlatma Metni</a> · <a href="kvkk.html#cerezler">Çerezler</a> · ${SITE.alanAdi}</span>
      </div>
    </div>`;
}

/* ---------- Yardımcılar ---------- */
const AYLAR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
function tarih(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${AYLAR[d.getMonth()]} ${d.getFullYear()}`;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function byDate(a, b) { return b.tarih.localeCompare(a.tarih); }

function postCard(item, link) {
  return `
    <article class="card post-card">
      <div class="thumb"><span class="tag" style="background:rgba(255,255,255,.16);color:#fff">${esc(item.kategori)}</span></div>
      <div class="body">
        <h3><a href="${link}">${esc(item.baslik)}</a></h3>
        <p style="color:var(--muted);margin:0">${esc(item.ozet)}</p>
        <div class="meta">${tarih(item.tarih)}${item.okuma ? " · " + item.okuma + " dk okuma" : ""}</div>
      </div>
    </article>`;
}

/* ---------- Liste sayfaları ---------- */
function renderList({ data, target, link, limit, filtersEl, searchEl }) {
  const box = document.getElementById(target);
  if (!box || !data) return;
  let kategori = "Tümü", q = "";
  const sorted = [...data].sort(byDate);

  function draw() {
    let items = sorted.filter(i =>
      (kategori === "Tümü" || i.kategori === kategori) &&
      (!q || (i.baslik + " " + i.ozet).toLocaleLowerCase("tr").includes(q)));
    if (limit) items = items.slice(0, limit);
    box.innerHTML = items.length
      ? items.map(i => postCard(i, `${link}?id=${encodeURIComponent(i.id)}`)).join("")
      : `<div class="empty" style="grid-column:1/-1">Kayıt bulunamadı.</div>`;
  }

  const fEl = filtersEl && document.getElementById(filtersEl);
  if (fEl) {
    const cats = ["Tümü", ...new Set(sorted.map(i => i.kategori))];
    fEl.innerHTML = cats.map(c => `<button class="${c === kategori ? "active" : ""}">${esc(c)}</button>`).join("");
    fEl.querySelectorAll("button").forEach(b => b.onclick = () => {
      kategori = b.textContent;
      fEl.querySelectorAll("button").forEach(x => x.classList.toggle("active", x === b));
      draw();
    });
  }
  const sEl = searchEl && document.getElementById(searchEl);
  if (sEl) sEl.oninput = () => { q = sEl.value.trim().toLocaleLowerCase("tr"); draw(); };
  draw();
}

/* ---------- Detay sayfası ---------- */
function renderDetail({ data, backLink, backLabel, discussion }) {
  const id = new URLSearchParams(location.search).get("id");
  const item = data && data.find(i => i && i.id === id);
  const t = document.getElementById("detail-title");
  const m = document.getElementById("detail-meta");
  const c = document.getElementById("detail-content");
  if (!item) {
    t.textContent = "İçerik bulunamadı";
    c.innerHTML = `<p>Aradığınız içerik kaldırılmış olabilir. <a href="${backLink}">${backLabel}</a></p>`;
    return;
  }
  document.title = `${item.baslik} | ${SITE.firma}`;
  t.textContent = item.baslik;
  m.innerHTML = `<span class="tag">${esc(item.kategori)}</span> ${tarih(item.tarih)}${item.okuma ? " · " + item.okuma + " dk okuma" : ""}`;
  c.innerHTML = item.icerik + (item.kaynak ? `<p class="note"><strong>Kaynak:</strong> ${item.kaynak}</p>` : "");
  if (discussion) renderDiscussion(item);
}

function renderDiscussion(item) {
  const box = document.getElementById("discussion");
  if (!box) return;
  const g = SITE.giscus;
  if (g.repo && g.repoId && g.categoryId) {
    const s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    Object.entries({
      "data-repo": g.repo, "data-repo-id": g.repoId, "data-category": g.category,
      "data-category-id": g.categoryId, "data-mapping": "specific", "data-term": item.id,
      "data-reactions-enabled": "1", "data-input-position": "top", "data-theme": "light", "data-lang": "tr"
    }).forEach(([k, v]) => s.setAttribute(k, v));
    s.crossOrigin = "anonymous"; s.async = true;
    box.appendChild(s);
  } else {
    // Yorum sistemi bağlanmadıysa yorum alanı ziyaretçiye gösterilmez
    const wrap = document.getElementById("tartisma");
    if (wrap) wrap.remove();
  }
}

/* ---------- Formlar ---------- */
function bindForms() {
  document.querySelectorAll("form[data-form]").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const status = form.querySelector(".form-status");
      if (SITE.formEndpoint) {
        try {
          const r = await fetch(SITE.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
          if (!r.ok) throw new Error();
          form.reset();
          status.textContent = "Teşekkürler, bilgileriniz alındı. En kısa sürede size dönüş yapacağız.";
        } catch {
          status.textContent = "Gönderim sırasında bir sorun oluştu. Lütfen e-posta ile ulaşın: " + SITE.eposta;
        }
      } else {
        const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
        location.href = `mailto:${SITE.eposta}?subject=${encodeURIComponent(form.dataset.form)}&body=${encodeURIComponent(body)}`;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  bindForms();
  document.querySelectorAll("[data-site]").forEach(el => el.textContent = SITE[el.dataset.site] || "");
  document.querySelectorAll("[data-ortak]").forEach(el => {
    el.textContent = SITE.egitimOrtagi || "Bakanlıkça yetkilendirilmiş eğitici kuruluş";
  });
});
