/* =========================================================
   Sunum görüntüleyici (ana sayfa)
   Slayt görselleri: sunum/slayt-01.png … ; PDF: sunum/ygu-mevzuat-rehberi.pdf
   Slayt sayısı veya başlıklar değişirse SLAYTLAR listesini güncelleyin.
   ========================================================= */
const SLAYTLAR = [
  "Binalarda Periyodik Yangın Denetimi",
  "Sunumun akışı",
  "Bölüm 01 · Mesleğin tanımı ve görev alanı",
  "Yangın Güvenlik Uzmanı kimdir?",
  "Düzenleme neden gerekli?",
  "Uzmanın üstlendiği dört iş",
  "Bölüm 02 · Hukuki çerçeve ve yürürlük",
  "Hükümler hangi tarihte devreye giriyor?",
  "Dayanak ve ilişkili düzenlemeler",
  "Denetimde başvurulan standartlar",
  "Bölüm 03 · Denetime tabi yapılar",
  "Hangi yapı, ne sıklıkla, kim tarafından?",
  "Denetim nasıl yürütülür?",
  "Bölüm 04 · Uzmanlık kademeleri",
  "Dört kademe bir bakışta",
  "Genel şartlar ve muafiyet",
  "Eğitim müfredatı (EK-2)",
  "Bölüm 05 · Yetkilendirme süreci",
  "Yetki belgesine altı aşama",
  "Hangi evrak, hangi kurallar?",
  "Sınavdan sonra neler olur?",
  "Görev ve ödeme nasıl işler?",
  "Tarafsızlık kuralları",
  "Bölüm 06 · Uygulamada merak edilenler",
  "Uzman, bir şirkete bağlı olmadan görev alabilir mi?",
  "Yetki belgesi için iş deneyimi aranıyor mu?",
  "Eğitimin tamamı uzaktan tamamlanabilir mi?",
  "Uzmanın görevi itfaiyeninkinden nasıl ayrışır?",
  "İSG uzmanlığı belgesi tek başına yeterli mi?",
  "Hazırlığa bugünden başlayın"
];

function initSunum(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;
  const src = i => `sunum/slayt-${String(i + 1).padStart(2, "0")}.png`;
  const n = SLAYTLAR.length;
  let cur = 0, gorunur = false;

  root.innerHTML = `
    <div class="viewer">
      <div class="viewer-stage">
        <img src="${src(0)}" alt="">
        <button class="viewer-nav prev" aria-label="Önceki slayt"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button class="viewer-nav next" aria-label="Sonraki slayt"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg></button>
      </div>
      <div class="viewer-bar">
        <div><span class="counter"></span> · <span class="title"></span></div>
        <div class="actions">
          <button type="button" class="fs">Tam ekran</button>
          <a href="sunum/ygu-mevzuat-rehberi.pdf" download>PDF indir</a>
        </div>
      </div>
    </div>
    <div class="thumbs strip">${SLAYTLAR.map((t, i) =>
      `<button data-i="${i}" aria-label="Slayt ${i + 1}: ${t}"><img src="${src(i)}" alt="" loading="lazy"><span>${i + 1}. ${t}</span></button>`).join("")}</div>`;

  const viewer = root.querySelector(".viewer");
  const img = root.querySelector(".viewer-stage img");
  const prev = root.querySelector(".prev"), next = root.querySelector(".next");
  const strip = root.querySelector(".thumbs");

  function show(i) {
    cur = Math.max(0, Math.min(n - 1, i));
    img.src = src(cur);
    img.alt = `Slayt ${cur + 1}: ${SLAYTLAR[cur]}`;
    root.querySelector(".counter").textContent = `${cur + 1} / ${n}`;
    root.querySelector(".title").textContent = SLAYTLAR[cur];
    prev.disabled = cur === 0;
    next.disabled = cur === n - 1;
    strip.querySelectorAll("button").forEach((b, j) => b.classList.toggle("active", j === cur));
    const act = strip.querySelector("button.active");
    if (act) strip.scrollTo({ left: act.offsetLeft - strip.clientWidth / 2 + act.clientWidth / 2, behavior: "smooth" });
    if (cur + 1 < n) new Image().src = src(cur + 1);
  }

  prev.onclick = () => show(cur - 1);
  next.onclick = () => show(cur + 1);
  strip.addEventListener("click", e => {
    const b = e.target.closest("button[data-i]");
    if (b) show(+b.dataset.i);
  });
  root.querySelector(".fs").onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (viewer.requestFullscreen) viewer.requestFullscreen();
  };

  // Klavye okları yalnızca sunum ekranda görünürken çalışır
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(es => { gorunur = es[0].isIntersecting; }, { threshold: 0.5 }).observe(viewer);
  }
  document.addEventListener("keydown", e => {
    if (!(gorunur || document.fullscreenElement)) return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
    if (e.key === "ArrowRight") { show(cur + 1); e.preventDefault(); }
    if (e.key === "ArrowLeft") { show(cur - 1); e.preventDefault(); }
  });

  let x0 = null;
  img.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  img.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  show(0);
}
