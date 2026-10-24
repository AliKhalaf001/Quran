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
  <title>قرآن أندرويد - المصحف الإلكتروني</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">

  <style>
    * {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Amiri', serif;
      background-color: #2b2b2b;
      color: #111;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: background-color 0.3s;
    }

    /* الشريط العلوي الشفاف */
    .app-header {
      background: rgba(13, 92, 58, 0.95);
      color: white;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
      transition: transform 0.3s ease;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    .app-header.hidden {
      transform: translateY(-100%);
    }

    .header-controls {
      display: flex;
      gap: 8px;
      align-items: center;
      width: 100%;
      justify-content: space-between;
    }

    select, button {
      font-family: inherit;
      padding: 6px 10px;
      border-radius: 6px;
      border: none;
      background: #ffffff;
      color: #0d5c3a;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
    }

    /* منطقة عرض المصحف الرئيسية */
    .mushaf-container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      background-color: #e5e0d8;
      overflow: hidden;
    }

    .page-frame {
      width: 100%;
      max-width: 550px;
      height: 100%;
      background: #fcf8f2;
      box-shadow: 0 0 20px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 15px 20px;
      position: relative;
      border-left: 2px solid #e0d8cc;
      border-right: 2px solid #e0d8cc;
    }

    /* الجزء العلوي والسفلي داخل صفحة المصحف */
    .mushaf-meta-top {
      display: flex;
      justify-content: space-between;
      font-size: 15px;
      color: #7a6a58;
      border-bottom: 1px solid #e2d9cc;
      padding-bottom: 6px;
      font-weight: bold;
    }

    .mushaf-text-area {
      flex: 1;
      padding: 15px 0;
      font-size: 23px;
      line-height: 2.3;
      text-align: justify;
      text-justify: inter-word;
      overflow-y: auto;
      color: #1a1a1a;
    }

    .mushaf-meta-bottom {
      text-align: center;
      font-size: 14px;
      color: #7a6a58;
      border-top: 1px solid #e2d9cc;
      padding-top: 6px;
      font-weight: bold;
    }

    .basmala-header {
      text-align: center;
      font-size: 24px;
      color: #0d5c3a;
      margin: 10px 0;
      font-weight: bold;
    }

    .verse {
      display: inline;
      cursor: pointer;
      border-radius: 3px;
      padding: 1px 3px;
    }

    .verse.active {
      background-color: #d8f3dc;
    }

    .verse-end {
      display: inline-block;
      width: 26px;
      height: 26px;
      line-height: 25px;
      text-align: center;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="%238c7355" stroke-width="5"/></svg>') no-repeat center center;
      background-size: contain;
      font-size: 12px;
      color: #8c7355;
      font-weight: bold;
      margin: 0 2px;
    }

    /* الشريط السفلي للتحكم الصوتي */
    .app-footer {
      background: rgba(13, 92, 58, 0.98);
      color: white;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
      transition: transform 0.3s ease;
    }

    .app-footer.hidden {
      transform: translateY(100%);
    }

    .play-btn {
      background: #d4a373;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
    }

    /* الوضع الليلـي (Night Mode) */
    body.dark-mode {
      background-color: #121212;
    }
    body.dark-mode .mushaf-container {
      background-color: #1a1a1a;
    }
    body.dark-mode .page-frame {
      background: #242424;
      border-color: #333;
      color: #e0e0e0;
    }
    body.dark-mode .mushaf-text-area {
      color: #e0e0e0;
    }
    body.dark-mode .mushaf-meta-top, 
    body.dark-mode .mushaf-meta-bottom {
      color: #aaa;
      border-color: #333;
    }
    body.dark-mode .basmala-header {
      color: #52b788;
    }
  </style>
</head>
<body>

  <!-- الشريط العلوي -->
  <div class="app-header" id="header">
    <div class="header-controls">
      <select id="surah-select" onchange="onSurahSelect()"></select>
      <select id="reciter-select">
        <option value="ar.alafasy">مشاري العفاسي</option>
        <option value="ar.husary">محمود خليل الحصري</option>
        <option value="ar.minshawi">محمد صديق المنشاوي</option>
        <option value="ar.banna">محمود علي البنا</option>
      </select>
      <button onclick="toggleDarkMode()">🌙</button>
    </div>
  </div>

  <!-- منطقة عرض صفحة المصحف -->
  <div class="mushaf-container" id="mushaf-container">
    <div class="page-frame" id="page-frame">
      <div class="mushaf-meta-top">
        <span id="juz-num">الجزء ١</span>
        <span id="surah-name">سُورَةُ البَقَرَةِ</span>
      </div>

      <div class="mushaf-text-area" id="page-content">
        <!-- يتم تحميل الآيات هنا -->
      </div>

      <div class="mushaf-meta-bottom">
        <span id="page-num">٣</span>
      </div>
    </div>
  </div>

  <!-- الشريط السفلي للتشغيل -->
  <div class="app-footer" id="footer">
    <button class="play-btn" id="play-btn" onclick="togglePlay()">▶️ استماع للصفحة</button>
    <span id="status-text" style="font-size: 13px;">الصفحة ٣</span>
    <button onclick="downloadSurah()" style="background:#e63946; color:white;">📥 تحميل</button>
  </div>

  <audio id="audio-player" style="display:none;"></audio>

  <script>
    let currentPage = 3;
    let isPlaying = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let uiVisible = true;

    const audioPlayer = document.getElementById('audio-player');

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

    function initSurahList() {
      const select = document.getElementById('surah-select');
      select.innerHTML = '';
      surahsList.forEach((name, i) => {
        const opt = document.createElement('option');
        opt.value = i + 1;
        opt.innerText = \`\${i + 1}. \${name}\`;
        select.appendChild(opt);
      });
    }

    // إخفاء/إظهار الواجهة عند النقر على الصفحة (Full Screen Toggle)
    document.getElementById('page-frame').addEventListener('click', (e) => {
      if (e.target.classList.contains('verse')) return;
      uiVisible = !uiVisible;
      document.getElementById('header').classList.toggle('hidden', !uiVisible);
      document.getElementById('footer').classList.toggle('hidden', !uiVisible);
    });

    // السحب لليمين واليسار (RTL Swiping)
    const container = document.getElementById('mushaf-container');
    container.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
    container.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); });

    function handleSwipe() {
      if (touchEndX < touchStartX - 40) nextPage(); // اليسار = الصفحة التالية
      if (touchEndX > touchStartX + 40) prevPage(); // اليمين = الصفحة السابقة
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
      document.getElementById('page-content').innerHTML = '<p style="text-align:center;">جاري تحميل الصفحة...</p>';

      try {
        const res = await fetch(\`https://api.alquran.cloud/v1/page/\${pageNum}/quran-uthmani\`);
        const data = await res.json();
        if (data.code === 200) renderPage(data.data);
      } catch (err) {
        document.getElementById('page-content').innerHTML = '<p style="text-align:center; color:red;">خطأ في الاتصال.</p>';
      }
    }

    function renderPage(data) {
      const body = document.getElementById('page-content');
      body.innerHTML = '';

      document.getElementById('page-num').innerText = data.number;
      document.getElementById('status-text').innerText = \`الصفحة \${data.number}\`;

      if (data.ayahs.length > 0) {
        document.getElementById('surah-name').innerText = 'سُورَةُ ' + data.ayahs[0].surah.name;
        document.getElementById('juz-num').innerText = 'الجزء ' + data.ayahs[0].juz;
        document.getElementById('surah-select').value = data.ayahs[0].surah.number;
      }

      let currentSurah = 0;

      data.ayahs.forEach((ayah) => {
        // إضافة البسملة كعنوان مستقل عند بداية أي سورة عدا التوبة والفاتحة
        if (ayah.surah.number !== currentSurah) {
          currentSurah = ayah.surah.number;
          if (ayah.numberInSurah === 1 && currentSurah !== 1 && currentSurah !== 9) {
            const b = document.createElement('div');
            b.className = 'basmala-header';
            b.innerText = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
            body.appendChild(b);
          }
        }

        // تنقية الآية الأولى من نص البسملة المدمجة
        let verseText = ayah.text;
        if (ayah.numberInSurah === 1 && currentSurah !== 1) {
          verseText = verseText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
        }

        const span = document.createElement('span');
        span.className = 'verse';
        span.innerHTML = \`\${verseText} <span class="verse-end">\${ayah.numberInSurah}</span> \`;
        body.appendChild(span);
      });
    }

    function togglePlay() {
      if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        document.getElementById('play-btn').innerText = '▶️ استماع للصفحة';
      } else {
        const reciter = document.getElementById('reciter-select').value;
        const surah = document.getElementById('surah-select').value;
        audioPlayer.src = \`https://cdn.islamic.network/quran/audio-surah/128/\${reciter}/\${surah}.mp3\`;
        audioPlayer.play();
        isPlaying = true;
        document.getElementById('play-btn').innerText = '⏸️ إيقاف';
      }
    }

    function onSurahSelect() {
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

    function toggleDarkMode() {
      document.body.classList.toggle('dark-mode');
    }

    function downloadSurah() {
      const reciter = document.getElementById('reciter-select').value;
      const surah = document.getElementById('surah-select').value;
      window.open(\`https://cdn.islamic.network/quran/audio-surah/128/\${reciter}/\${surah}.mp3\`, '_blank');
    }

    initSurahList();
    loadPage(currentPage);
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));