/* =========================================================
   Etkileşimli testler
   Kaynak: Yangın Güvenlik Uzmanlığı ve Periyodik Kontrol Usul ve
   Esasları Hakkında Yönetmelik Taslağı (m. 4, 5) ve EK-1.
   Taslak kesinleştiğinde buradaki değerler güncellenmelidir.
   ========================================================= */

/* ---------- Binanız periyodik kontrole tabi mi? ---------- */
function initBinaTest(id) {
  const box = document.getElementById(id);
  if (!box) return;

  box.innerHTML = `
    <div class="tool-grid">
      <div>
        <label for="bt-sinif">Binanın kullanım sınıfı</label>
        <select id="bt-sinif">
          <option value="">Seçin…</option>
          <option value="konut">Konut (apartman, site)</option>
          <option value="konaklama">Konaklama (otel, pansiyon vb.)</option>
          <option value="kurumsal">Kurumsal bina (okul, hastane, kamu binası vb.)</option>
          <option value="buro">Büro / ofis binası</option>
          <option value="ticari">Ticari bina (mağaza, AVM vb.)</option>
          <option value="toplanma">Toplanma amaçlı bina (sinema, spor salonu, ibadet yeri vb.)</option>
          <option value="endustriyel">Endüstriyel tesis (fabrika, atölye)</option>
          <option value="depolama">Depolama tesisi</option>
          <option value="yuksek">Yüksek tehlikeli yer</option>
        </select>
      </div>
      <div id="bt-detay"></div>
    </div>
    <label class="check"><input type="checkbox" id="bt-belge" checked> Binanın yapı kullanma izni veya yapı kayıt belgesi var</label>
    <div id="bt-sonuc" class="tool-result" hidden></div>`;

  const sinif = box.querySelector("#bt-sinif");
  const detay = box.querySelector("#bt-detay");
  const sonuc = box.querySelector("#bt-sonuc");
  const belge = box.querySelector("#bt-belge");

  const alanlar = {
    konut: `<label for="bt-deger">Yapı yüksekliği (metre)</label><input id="bt-deger" type="number" min="0" step="0.5" placeholder="ör. 35">`,
    konaklama: `<label for="bt-deger">Yatılan oda sayısı</label><input id="bt-deger" type="number" min="0" placeholder="ör. 40">`,
    alan: `<label for="bt-deger">Yapı inşaat alanı (m²)</label><input id="bt-deger" type="number" min="0" placeholder="ör. 2500">`,
    tehlike: `<label for="bt-deger">Tehlike sınıfı</label><select id="bt-deger"><option value="">Seçin…</option><option value="dusuk">Düşük tehlikeli</option><option value="orta">Orta tehlikeli</option><option value="yuksek">Yüksek tehlikeli</option></select>`
  };

  function alanTuru(s) {
    if (s === "konut") return "konut";
    if (s === "konaklama") return "konaklama";
    if (["kurumsal", "buro", "ticari", "toplanma"].includes(s)) return "alan";
    if (["endustriyel", "depolama"].includes(s)) return "tehlike";
    return null;
  }

  function hesapla() {
    const s = sinif.value;
    const input = box.querySelector("#bt-deger");
    const v = input ? input.value : "";
    if (!s || (alanTuru(s) && v === "")) { sonuc.hidden = true; return; }

    let r;
    if (s === "konut") {
      const h = parseFloat(v);
      if (h < 30.5) r = { kapsam: false, not: "Taslak EK-1'e göre konutlarda yalnızca yüksekliği 30,50 m ve üzeri olan binalar periyodik kontrole tabidir." };
      else if (h < 51.5) r = { kapsam: true, periyot: 5, ygu: "YGU-1, YGU-2 veya YGU-3" };
      else r = { kapsam: true, periyot: 4, ygu: "YGU-2 veya YGU-3" };
    } else if (s === "konaklama") {
      r = parseInt(v, 10) <= 25 ? { kapsam: true, periyot: 5, ygu: "YGU-1, YGU-2 veya YGU-3" } : { kapsam: true, periyot: 4, ygu: "YGU-2 veya YGU-3" };
    } else if (alanTuru(s) === "alan") {
      r = parseFloat(v) <= 1000 ? { kapsam: true, periyot: 5, ygu: "YGU-1, YGU-2 veya YGU-3" } : { kapsam: true, periyot: 4, ygu: "YGU-2 veya YGU-3" };
    } else if (alanTuru(s) === "tehlike") {
      r = { dusuk: { kapsam: true, periyot: 5, ygu: "YGU-1, YGU-2 veya YGU-3" },
            orta: { kapsam: true, periyot: 4, ygu: "YGU-2 veya YGU-3" },
            yuksek: { kapsam: true, periyot: 3, ygu: "YGU-3 ve YGU-K birlikte" } }[v];
    } else if (s === "yuksek") {
      r = { kapsam: true, periyot: 3, ygu: "YGU-3 ve YGU-K birlikte" };
    }

    if (r.kapsam && !belge.checked) {
      r = { kapsam: false, not: "Periyodik kontrol, kullanıma ilişkin belgesi (yapı kullanma izni veya yapı kayıt belgesi) bulunan yapılar için öngörülüyor. Belgesi olmayan yapıların öncelikle bu durumu çözmesi gerekir; bu konuda da destek verebiliriz." };
    }

    sonuc.hidden = false;
    sonuc.className = "tool-result " + (r.kapsam ? "yes" : "no");
    sonuc.innerHTML = r.kapsam
      ? `<strong>Binanız periyodik kontrole tabi görünüyor.</strong>
         <div class="tool-facts">
           <div><span>Kontrol sıklığı</span><b>${r.periyot} yılda bir</b></div>
           <div><span>Görev alabilecek uzman</span><b>${r.ygu}</b></div>
           <div><span>İlk başvuru dönemi</span><b>1 Ocak – 31 Aralık 2028</b></div>
         </div>
         <p>Kontrolde ilk olarak onaylı yangın projeleri, kullanım sınıfına uygunluk ve sistemlerin periyodik muayene belgeleri aranır; bunlardan biri eksikse kontrol yapılmadan durum belediyeye bildirilir. Binanız birden fazla kullanım içeriyorsa en kısa periyot uygulanır.</p>
         <a class="btn btn-primary" href="iletisim.html">Hazırlık değerlendirmesi için teklif alın</a>`
      : `<strong>Taslağa göre binanız şu an kapsam dışında görünüyor.</strong><p>${r.not}</p>
         <p>Kapsam dışında kalmak, yangın güvenliği yükümlülüklerinin olmadığı anlamına gelmez; Binaların Yangından Korunması Hakkında Yönetmelik tüm binalar için geçerlidir.</p>`;
  }

  sinif.addEventListener("change", () => {
    const t = alanTuru(sinif.value);
    detay.innerHTML = t ? alanlar[t] : "";
    const inp = box.querySelector("#bt-deger");
    if (inp) inp.addEventListener("input", hesapla), inp.addEventListener("change", hesapla);
    hesapla();
  });
  belge.addEventListener("change", hesapla);
}

/* ---------- Hangi YGU kademesine uygunsunuz? ---------- */
function initYguTest(id) {
  const box = document.getElementById(id);
  if (!box) return;

  box.innerHTML = `
    <div class="tool-grid">
      <div>
        <label for="yt-diploma">Mezuniyetiniz / mesleki unvanınız</label>
        <select id="yt-diploma">
          <option value="">Seçin…</option>
          <optgroup label="Ön lisans">
            <option value="tekniker">Makine, inşaat, elektrik veya elektrik-elektronik teknikeri</option>
            <option value="itfaiye">İtfaiyecilik (2 yıllık ön lisans)</option>
            <option value="onlisans-diger">Diğer ön lisans programları</option>
          </optgroup>
          <optgroup label="Lisans">
            <option value="muh">Mimar; inşaat, makine, elektrik, elektronik veya elektrik-elektronik mühendisi</option>
            <option value="kimya">Kimya mühendisi veya kimya lisans mezunu</option>
            <option value="lisans-diger">Diğer lisans programları (İSG, diğer mühendislik dalları vb.)</option>
          </optgroup>
        </select>
      </div>
      <div id="yt-ek"></div>
    </div>
    <div id="yt-sonuc" class="tool-result" hidden></div>`;

  const dip = box.querySelector("#yt-diploma");
  const ek = box.querySelector("#yt-ek");
  const sonuc = box.querySelector("#yt-sonuc");

  const kademe = {
    1: { ad: "YGU-1", saat: 65, yetki: "EK-1'de YGU-1'e açık yapıların periyodik kontrolü: 30,50–51,50 m konutlar, 25 oda ve altı konaklama, 1.000 m² ve altı kurumsal, büro, ticari ve toplanma binaları, düşük tehlikeli endüstriyel ve depolama tesisleri." },
    2: { ad: "YGU-2", saat: 85, yetki: "Daha geniş bir bina yelpazesinde periyodik kontrol; ayrıca yangın projelerine uygunluk görüşüne esas rapor, yapı kullanma izni aşamasında rapor ve yangın tatbikatı planlaması." },
    3: { ad: "YGU-3", saat: 40, yetki: "YGU-2'nin yetkilerine ek olarak yüksek tehlikeli yapılar (YGU-K ile birlikte) ve uluslararası standartlara göre tasarlanmış binalar." },
    K: { ad: "YGU-K", saat: 35, yetki: "Yüksek tehlikeli yapıların periyodik kontrolünde tehlikeli maddelerin tespiti ve sınıflandırılması; kontrolü YGU-3 ile birlikte yürütür." }
  };

  function kart(s, ekNot) {
    const v = kademe[s];
    return `<div class="tool-facts">
        <div><span>Uygun kademe</span><b>${v.ad}</b></div>
        <div><span>Asgari teorik eğitim</span><b>${v.saat} saat${s === 3 ? " (YGU-2 üzerine)" : ""}</b></div>
        <div><span>Sonraki adımlar</span><b>Uygulama eğitimi + Bakanlık sınavı</b></div>
      </div>
      <p><strong>Ne yapabilir?</strong> ${v.yetki}</p>${ekNot ? `<p>${ekNot}</p>` : ""}`;
  }

  function hesapla() {
    const d = dip.value;
    if (!d) { sonuc.hidden = true; return; }
    let html, ok = true;
    if (d === "tekniker" || d === "itfaiye") {
      html = `<strong>YGU-1 için başvurabilirsiniz.</strong>` + kart(1);
    } else if (d === "muh") {
      const y = box.querySelector("#yt-ygu2");
      if (y && y.checked) html = `<strong>YGU-3 için başvurabilirsiniz.</strong>` + kart(3, "YGU-3 için şart: geçerli YGU-2 belgesi ve son bir yıl içinde en az iki farklı kullanım sınıfında en az dört yangın güvenlik raporu düzenlemiş olmak.");
      else html = `<strong>YGU-2 için başvurabilirsiniz.</strong>` + kart(2, "YGU-3 doğrudan alınamaz: önce YGU-2 belgesi almanız ve son bir yıl içinde en az iki farklı kullanım sınıfında en az dört rapor düzenlemeniz gerekir.");
    } else if (d === "kimya") {
      html = `<strong>YGU-K için başvurabilirsiniz.</strong>` + kart("K");
    } else {
      ok = false;
      html = `<strong>Taslağa göre mezuniyetiniz şu an hiçbir YGU kademesinde sayılmıyor.</strong>
        <p>Taslak, YGU kademelerini belirli meslek gruplarıyla sınırlıyor. İş güvenliği uzmanlığı veya diğer mühendislik dalları tek başına yeterli görünmüyor. Nihai yönetmelikte değişiklik olabilir; <a href="egitim.html#on-basvuru">ön başvuru formumuzu</a> doldurursanız gelişmelerden haberdar ederiz.</p>`;
    }
    sonuc.hidden = false;
    sonuc.className = "tool-result " + (ok ? "yes" : "no");
    sonuc.innerHTML = html + (ok ? `<p class="small">Tüm kademelerde ortak şartlar: belirli suçlardan mahkûmiyet bulunmaması, disiplin yoluyla meslekten çıkarılmamış olmak, teorik eğitimin en az %90'ına devam ve sınavda 100 üzerinden en az 70 puan.</p>
      <a class="btn btn-primary" href="egitim.html#on-basvuru">Bu kademe için eğitime ön başvuru</a>` : "");
  }

  dip.addEventListener("change", () => {
    ek.innerHTML = dip.value === "muh"
      ? `<label class="check" style="margin-top:30px"><input type="checkbox" id="yt-ygu2"> YGU-2 belgem var ve son bir yılda en az 2 farklı kullanım sınıfında 4 rapor düzenledim</label>`
      : "";
    const c = box.querySelector("#yt-ygu2");
    if (c) c.addEventListener("change", hesapla);
    hesapla();
  });
}

/* ---------- Mevzuat takip çizelgesi ---------- */
const TAKVIM = [
  { durum: "done", when: "2026", baslik: "Taslak hazırlandı", metin: "ÇŞİDB, yönetmelik taslağını ve 9 ekini hazırladı.", etiket: "Tamamlandı" },
  { durum: "now", when: "Bekleniyor", baslik: "Resmî Gazete'de yayım", metin: "Uzmanlık, eğitim ve sınav hükümleri yayım günü yürürlüğe girer.", etiket: "Takipte" },
  { durum: "", when: "Yayımdan sonra", baslik: "Eğitim ve sınavlar", metin: "Eğitici kuruluşlar yetkilendirilir; eğitimler ve Bakanlık sınavları başlar.", etiket: "Planlanan" },
  { durum: "", when: "1 Ocak 2028", baslik: "Periyodik kontrol başlar", metin: "Binaların periyodik kontrol hükümleri yürürlüğe girer.", etiket: "Planlanan" },
  { durum: "", when: "2028 boyunca", baslik: "Geçiş yılı", metin: "Mevcut yapılar ilk başvurularını 31 Aralık 2028'e kadar yapar.", etiket: "Planlanan" }
];
function renderTakvim(id) {
  const box = document.getElementById(id);
  if (!box) return;
  box.innerHTML = `<ol class="track">${TAKVIM.map(t =>
    `<li class="${t.durum}"><span class="when">${t.when}</span><h3>${t.baslik}</h3><p>${t.metin}</p><span class="state">${t.etiket}</span></li>`).join("")}</ol>`;
}

/* ---------- Vaka dersleri ---------- */
function renderVakalar(id, { kisa = false } = {}) {
  const box = document.getElementById(id);
  if (!box || !window.VAKALAR) return;
  box.innerHTML = window.VAKALAR.map(v => `
    <article class="card case" id="vaka-${v.id}">
      <div class="case-top"><span class="tag">${v.tur}</span><span class="toll">${v.olu}<small>can kaybı</small></span></div>
      <h3 style="margin-top:12px">${v.baslik}</h3>
      <p style="font-size:.88rem;margin-bottom:10px">${v.tarih} · ${v.yer}</p>
      ${kisa ? "" : `<p>${v.ozet}</p><p style="margin-top:10px"><b style="color:var(--navy)">Tespitler:</b> ${v.tespit}</p>`}
      <div class="ygu"><b>Bir YGU neye bakardı?</b> ${kisa ? v.ygu.split(". ")[0] + "." : v.ygu}</div>
      ${kisa ? "" : `<p style="margin-top:12px;font-size:.88rem"><b style="color:var(--navy)">Yargı süreci:</b> ${v.yargi}</p>`}
      <div class="src">${kisa ? `<a href="meslek.html#vaka-${v.id}">Vakayı incele →</a>` : `Kaynak: <a href="${v.kaynak[1]}" target="_blank" rel="noopener">${v.kaynak[0]} ↗</a>`}</div>
    </article>`).join("");
}

/* ---------- Mini deneme sınavı ---------- */
function initQuiz(id) {
  const box = document.getElementById(id);
  if (!box || !window.DENEME) return;
  const Q = window.DENEME;
  let i = 0, dogru = 0;

  function soru() {
    const q = Q[i];
    box.innerHTML = `
      <div class="quiz-head"><span>Soru ${i + 1} / ${Q.length}</span><span>Doğru: ${dogru}</span></div>
      <div class="quiz-progress"><i style="width:${(i / Q.length) * 100}%"></i></div>
      <h3>${q.s}</h3>
      <div class="opts">${q.o.map((o, j) => `<button data-j="${j}">${String.fromCharCode(65 + j)}) ${o}</button>`).join("")}</div>
      <div class="why" hidden></div>
      <button class="btn btn-primary nextq" hidden>${i + 1 < Q.length ? "Sonraki soru" : "Sonucu gör"}</button>`;
    box.querySelectorAll(".opts button").forEach(b => b.onclick = () => {
      const j = +b.dataset.j;
      box.querySelectorAll(".opts button").forEach((x, k) => {
        x.disabled = true;
        if (k === q.d) x.classList.add("right");
        else if (k === j) x.classList.add("wrong");
      });
      if (j === q.d) dogru++;
      const why = box.querySelector(".why");
      why.hidden = false;
      why.innerHTML = `<b>${j === q.d ? "Doğru." : "Yanlış."}</b> ${q.a}`;
      box.querySelector(".nextq").hidden = false;
      box.querySelector(".quiz-head span:last-child").textContent = `Doğru: ${dogru}`;
    });
    box.querySelector(".nextq").onclick = () => { i++; i < Q.length ? soru() : sonuc(); };
  }

  function sonuc() {
    const puan = Math.round((dogru / Q.length) * 100);
    box.innerHTML = `
      <div style="text-align:center">
        <div class="score">${puan}</div>
        <p style="color:var(--muted)">100 üzerinden · ${Q.length} sorudan ${dogru} doğru</p>
        <h3 style="margin-top:14px">${puan >= 70 ? "Tebrikler, gerçek sınavın başarı notunu geçtiniz." : "Başarı notu 70; biraz daha hazırlık iyi olur."}</h3>
        <p style="max-width:560px;margin:0 auto 20px;color:var(--muted)">Bu kısa test, taslak yönetmeliğin temel kurallarını yoklar. Gerçek sınav teorik eğitimin tüm konularını kapsar ve en az 50 sorudan oluşur.</p>
        <div class="hero-actions"><button class="btn btn-outline again">Tekrar çöz</button><a class="btn btn-primary" href="egitim.html#on-basvuru">Hazırlık programına ön başvuru</a></div>
      </div>`;
    box.querySelector(".again").onclick = () => { i = 0; dogru = 0; soru(); };
  }
  soru();
}

/* ---------- SSS ---------- */
function renderSSS(id, list) {
  const box = document.getElementById(id);
  if (!box) return;
  box.innerHTML = list.map(i => {
    const [q, a] = Array.isArray(i) ? i : [i.s, i.c];
    return `<details class="faq"><summary>${q}</summary><div>${a}</div></details>`;
  }).join("");
}
