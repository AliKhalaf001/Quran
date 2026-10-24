const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>تصحيح وحفظ القرآن الكريم</title>

  <!-- خط Amiri لعرض رسم المصحف الشريف -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

  <style>
    /* منع تحديد النص باللمس والماوس */
    * {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      box-sizing: border-box;
    }

    body {
      font-family: 'Amiri', 'Segoe UI', serif;
      background-color: #f7f5ed;
      margin: 0;
      padding: 0;
      color: #222;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    /* شريط التحكم العلوي المتجاوب مع الهاتف */
    .top-bar {
      background: #0d5c3a;
      color: white;
      padding: 8px 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 10;
    }

    .select-group {
      display: flex;
      gap: 6px;
      flex: 1;
      min-width: 280px;
    }

    .top-bar select {
      font-family: inherit;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid #084229;
      background: white;
      color: #0d5c3a;
      font-size: 13px;
      font-weight: bold;
      flex: 1;
    }

    /* لوحة الإرشادات والتحميل */
    .controls-panel {
      background: #eef2eb;
      padding: 6px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #dcd6c8;
      font-size: 13px;
    }

    .btn-download {
      background: #e63946;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      font-size: 12px;
      font-weight: bold;
      white-space: nowrap;
    }

    /* منطقة عرض المصحف المصممة للهواتف والشاشات */
    .mushaf-viewport {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
      touch-action: pan-y;
      padding: 5px;
    }

    .quran-page-card {
      width: 100%;
      max-width: 520px;
      height: 100%;
      background: #fffdf7;
      border: 1px solid #e2dac9;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    /* هيدر الصفحة الرسمي */
    .page-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e8e1d2;
      padding-bottom: 4px;
      font-size: 14px;
      color: #555;
      font-weight: bold;
    }

    /* نص الآيات ورسم المصحف */
    .page-body {
      flex: 1;
      padding: 10px 0;
      font-size: 22px;
      line-height: 2.2;
      text-align: justify;
      text-justify: inter-word;
      overflow-y: auto;
    }

    .basmala {
      text-align: center;
      font-size: 23px;
      margin: 8px 0;
      color: #0d5c3a;
      display: block;
      font-weight: bold;
    }

    /* الآية والتحديد */
    .verse {
      display: inline;
      cursor: pointer;
      padding: 2px 3px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .verse:hover {
      background-color: #f0e8d5;
    }

    .verse.selected {
      background-color: #d8f3dc !important;
      border: 1px solid #52b788;
    }

    .verse-number {
      display: inline-block;
      width: 26px;
      height: 26px;
      line-height: 24px;
      text-align: center;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="%230d5c3a" stroke-width="6"/></svg>') no-repeat center center;
      background-size: contain;
      font-size: 12px;
      font-weight: bold;
      color: #0d5c3a;
      margin: 0 3px;
    }

    /* فوتر الصفحة */
    .page-footer {
      text-align: center;
      border-top: 1px solid #e8e1d2;
      padding-top: 4px;
      font-size: 13px;
      color: #777;
    }

    /* مشغل الصوت السفلي المتجاوب */
    .audio-bar {
      background: #063822;
      color: white;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .btn-play {
      background: #2b9348;
      color: white;
      border: none;
      padding: 6px 14px;
      border-radius: 16px;
      font-weight: bold;
      cursor: pointer;
      font-size: 13px;
    }

    .btn-start {
      background: #457b9d;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
    }

    /* مربع البحث للتسجيلات المختارة */
    .modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      z-index: 100;
      justify-content: center;
      align-items: center;
    }

    .modal-content {
      background: white;
      padding: 15px;
      border-radius: 8px;
      width: 90%;
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .search-input {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .recitation-item {
      padding: 8px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
    }

    .recitation-item:hover {
      background: #f4f6f9;
    }
  </style>
</head>
<body>

  <!-- شريط اختيار السورة والقراء المزدوج -->
  <div class="top-bar">
    <div class="select-group">
      <select id="surah-select" onchange="onSurahChange()"></select>
      
      <!-- القائمة الأولى: مصحف كامل -->
      <select id="full-reciter-select" onchange="onFullReciterChange()">
        <option value="ar.alafasy">مشاري العفاسي</option>
        <option value="ar.husary">محمود خليل الحصري</option>
        <option value="ar.banna">محمود علي البنا</option>
        <option value="ar.minshawi">محمد صديق المنشاوي (مرتل)</option>
        <option value="ar.minshawimujawwad">محمد صديق المنشاوي (مجود)</option>
      </select>
    </div>

    <!-- القائمة الثانية: تسجيلات مختارة -->
    <div style="flex: 1; min-width: 140px;">
      <select id="partial-reciter-select" onchange="openPartialModal()">
        <option value="">اختر شيخ (تسجيلات مختارة)...</option>
        <option value="basil">باسل مؤنس</option>
        <option value="kaseb">أحمد كاسب</option>
      </select>
    </div>
  </div>

  <!-- النص المساعد المعدل وتنزيل السورة -->
  <div class="controls-panel">
    <span>💡 اسحب الصفحة لليمين/اليسار</span>
    <button onclick="downloadCurrentSurahAudio()" class="btn-download">📥 تحميل السورة صوتياً</button>
  </div>

  <!-- منطقة عرض المصحف -->
  <div class="mushaf-viewport" id="viewport">
    <div class="quran-page-card">
      <div class="page-header">
        <span id="juz-label">الجزء 1</span>
        <span id="surah-label">سُورةُ البَقَرَةِ</span>
      </div>

      <div class="page-body" id="page-body"></div>

      <div class="page-footer">
        <span id="page-number-label">٣</span>
      </div>
    </div>
  </div>

  <!-- شريط التحكم الصوتي السفلي -->
  <div class="audio-bar">
    <button class="btn-play" id="play-btn" onclick="togglePlay()">▶️ تشغيل</button>
    <span id="audio-status" style="font-size: 12px; flex:1; text-align:center;">بداية الصفحة</span>
    <button class="btn-start" onclick="playFromSurahStart()">⏮️ من أول السورة</button>
  </div>

  <!-- نافذة التفتيش واختيار التسجيلات المختارة -->
  <div class="modal" id="partial-modal">
    <div class="modal-content">
      <h3 id="modal-title" style="margin-top:0;">التسجيلات المتاحة</h3>
      <input type="text" id="search-box" class="search-input" placeholder="بحث عن سورة أو تلاوة..." oninput="filterRecitations()">
      <div id="recitations-list"></div>
      <button onclick="closePartialModal()" style="margin-top:10px; width:100%; padding:8px; background:#6c757d; color:white; border:none; border-radius:4px;">إغلاق</button>
    </div>
  </div>

  <audio id="audio-player" style="display:none;"></audio>

  <script>
    let currentPage = 3;
    let selectedVerseIndex = null;
    let isPlaying = false;
    let currentSurahNumber = 2;
    let touchStartX = 0;
    let touchEndX = 0;

    const audioPlayer = document.getElementById('audio-player');

    // قاعدة بيانات التسجيلات المختارة
    const partialData = {
      basil: [
        { title: "سورة الكهف - تلاوة خاشعة", surah: 18, url: "https://server11.mp3quran.net/basil/018.mp3" },
        { title: "سورة مريم", surah: 19, url: "https://server11.mp3quran.net/basil/019.mp3" },
        { title: "سورة طه", surah: 20, url: "https://server11.mp3quran.net/basil/020.mp3" }
      ],
      kaseb: [
        { title: "سورة يس - تلاوة مبكية", surah: 36, url: "https://server10.mp3quran.net/kaseb/036.mp3" },
        { title: "سورة الرحمن", surah: 55, url: "https://server10.mp3quran.net/kaseb/055.mp3" },
        { title: "سورة الواقعة", surah: 56, url: "https://server10.mp3quran.net/kaseb/056.mp3" }
      ]
    };

    const surahsList = [
      "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
      "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
      "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
      "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
      "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
      "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
      "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
      "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
      "التكوير", "الانفطار", "الطفيفين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
      "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاتيات",
      "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "المواعون", "الكوثر", "الكافرون", "النصر",
      "المسد", "الإخلاص", "الفلق", "الناس"
    ];

    function initSurahSelect() {
      const select = document.getElementById('surah-select');
      select.innerHTML = '';
      surahsList.forEach((name, index) => {
        const opt = document.createElement('option');
        opt.value = index + 1;
        opt.innerText = \`\${index + 1}. سورة \${name}\`;
        select.appendChild(opt);
      });
    }

    // اتجاه التصفح من اليمين إلى اليسار
    const viewport = document.getElementById('viewport');
    viewport.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
    viewport.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); });

    function handleSwipe() {
      // السحب لليسار -> الصفحة التالية
      if (touchEndX < touchStartX - 40) nextPage();
      // السحب لليمين -> الصفحة السابقة
      if (touchEndX > touchStartX + 40) prevPage();
    }

    function nextPage() {
      if (currentPage < 604) {
        currentPage++;
        loadPage(currentPage);
      }
    }

    function prevPage() {
      if (currentPage > 1) {
        currentPage--;
        loadPage(currentPage);
      }
    }

    async function loadPage(pageNum) {
      document.getElementById('page-body').innerHTML = '<p style="text-align:center;">جاري تحميل الصفحة...</p>';
      selectedVerseIndex = null;

      try {
        const res = await fetch(\`https://api.alquran.cloud/v1/page/\${pageNum}/quran-uthmani\`);
        const data = await res.json();
        if (data.code === 200) renderPage(data.data);
      } catch (err) {
        document.getElementById('page-body').innerHTML = '<p style="text-align:center; color:red;">تعذر تحميل الصفحة.</p>';
      }
    }

    function renderPage(pageData) {
      const body = document.getElementById('page-body');
      body.innerHTML = '';

      document.getElementById('page-number-label').innerText = pageData.number;
      
      if (pageData.ayahs.length > 0) {
        currentSurahNumber = pageData.ayahs[0].surah.number;
        document.getElementById('surah-label').innerText = 'سُورةُ ' + pageData.ayahs[0].surah.name;
        document.getElementById('juz-label').innerText = 'الجزء ' + pageData.ayahs[0].juz;
        document.getElementById('surah-select').value = currentSurahNumber;
      }

      let activeSurahInPage = 0;

      pageData.ayahs.forEach((ayah, idx) => {
        // إضافة البسملة كعنوان فقط واستثنائها نهائياً من سورة التوبة (رقم 9)
        if (ayah.surah.number !== activeSurahInPage) {
          activeSurahInPage = ayah.surah.number;
          if (ayah.numberInSurah === 1 && activeSurahInPage !== 1 && activeSurahInPage !== 9) {
            const basmalaDiv = document.createElement('div');
            basmalaDiv.className = 'basmala';
            basmalaDiv.innerText = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
            body.appendChild(basmalaDiv);
          }
        }

        // تنقية الآية الأولى من نص البسملة المدمجة لمنع التكرار
        let verseText = ayah.text;
        if (ayah.numberInSurah === 1 && activeSurahInPage !== 1) {
          verseText = verseText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
        }

        const span = document.createElement('span');
        span.className = 'verse';
        span.id = \`verse-\${idx}\`;
        span.innerHTML = \`\${verseText} <span class="verse-number">\${ayah.numberInSurah}</span> \`;
        span.onclick = () => selectVerse(idx, ayah);

        body.appendChild(span);
      });
    }

    function selectVerse(idx, ayah) {
      document.querySelectorAll('.verse').forEach(v => v.classList.remove('selected'));
      selectedVerseIndex = idx;
      document.getElementById(\`verse-\${idx}\`).classList.add('selected');
      document.getElementById('audio-status').innerText = \`تم تحديد الآية \${ayah.numberInSurah}\`;
    }

    function togglePlay() {
      if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        document.getElementById('play-btn').innerText = '▶️ تشغيل';
        document.getElementById('audio-status').innerText = 'متوقف';
      } else {
        playAudio();
      }
    }

    function playAudio(customUrl) {
      let audioUrl = customUrl;

      if (!audioUrl) {
        const reciter = document.getElementById('full-reciter-select').value;
        audioUrl = \`https://cdn.islamic.network/quran/audio-surah/128/\${reciter}/\${currentSurahNumber}.mp3\`;
      }

      audioPlayer.src = audioUrl;
      audioPlayer.play().then(() => {
        isPlaying = true;
        document.getElementById('play-btn').innerText = '⏸️ إيقاف مؤقت';
        document.getElementById('audio-status').innerText = 'جاري التشغيل...';
      }).catch(err => {
        alert('التلاوة غير متوفرة لهذا القارئ حالياً.');
      });
    }

    function playFromSurahStart() {
      selectedVerseIndex = null;
      document.querySelectorAll('.verse').forEach(v => v.classList.remove('selected'));
      playAudio();
    }

    function onSurahChange() {
      const surahNum = document.getElementById('surah-select').value;
      fetch(\`https://api.alquran.cloud/v1/surah/\${surahNum}\`)
        .then(res => res.json())
        .then(data => {
          if (data.data && data.data.ayahs.length > 0) {
            currentPage = data.data.ayahs[0].page;
            loadPage(currentPage);
          }
        });
    }

    function onFullReciterChange() {
      document.getElementById('partial-reciter-select').value = "";
      if (isPlaying) playAudio();
    }

    // إدارة التسجيلات المختارة
    function openPartialModal() {
      const reciterKey = document.getElementById('partial-reciter-select').value;
      if (!reciterKey) return;

      const modal = document.getElementById('partial-modal');
      const listContainer = document.getElementById('recitation-list');
      listContainer.innerHTML = '';

      const items = partialData[reciterKey] || [];
      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'recitation-item';
        div.innerText = item.title;
        div.onclick = () => {
          closePartialModal();
          // الانتقال لسورة التلاوة وتشغيلها
          document.getElementById('surah-select').value = item.surah;
          onSurahChange();
          playAudio(item.url);
        };
        listContainer.appendChild(div);
      });

      modal.style.display = 'flex';
    }

    function closePartialModal() {
      document.getElementById('partial-modal').style.display = 'none';
    }

    function filterRecitations() {
      const q = document.getElementById('search-box').value.toLowerCase();
      document.querySelectorAll('.recitation-item').forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(q) ? 'block' : 'none';
      });
    }

    function downloadCurrentSurahAudio() {
      const reciter = document.getElementById('full-reciter-select').value;
      const surahNum = document.getElementById('surah-select').value;
      const audioUrl = \`https://cdn.islamic.network/quran/audio-surah/128/\${reciter}/\${surahNum}.mp3\`;

      const a = document.createElement('a');
      a.href = audioUrl;
      a.target = '_blank';
      a.download = \`Surah_\${surahNum}.mp3\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    initSurahSelect();
    loadPage(currentPage);
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});