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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>تصحيح وحفظ القرآن الكريم</title>

  <!-- خط Amiri لعرض المصحف بشكل مجود وأنيق -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

  <style>
    /* منع التحديد واللمس المزعج */
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

    /* شريط التحكم العلوي */
    .top-bar {
      background: #0d5c3a;
      color: white;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 10;
    }

    .top-bar select, .top-bar button {
      font-family: inherit;
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #084229;
      background: white;
      color: #0d5c3a;
      font-size: 14px;
      font-weight: bold;
    }

    .top-bar button {
      background: #d4a373;
      color: white;
      border: none;
      cursor: pointer;
    }

    /* إطار إعدادات القارئ والتحميل */
    .controls-panel {
      background: #eef2eb;
      padding: 8px 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #dcd6c8;
      font-size: 14px;
    }

    /* حاوية المصحف وسحب الصفحات */
    .mushaf-viewport {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
      touch-action: pan-y;
    }

    .quran-page-card {
      width: 100%;
      max-width: 500px;
      height: 96%;
      background: #fffdf7;
      border: 1px solid #e2dac9;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      border-radius: 8px;
      padding: 15px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s ease-out;
      position: relative;
    }

    /* هيدر الصفحة الرسمي (الجزء واسم السورة) */
    .page-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e8e1d2;
      padding-bottom: 6px;
      font-size: 16px;
      color: #555;
      font-weight: bold;
    }

    /* نص القرآن والآيات */
    .page-body {
      flex: 1;
      padding: 15px 0;
      font-size: 23px;
      line-height: 2.3;
      text-align: justify;
      text-justify: inter-word;
      overflow-y: auto;
    }

    .basmala {
      text-align: center;
      font-size: 24px;
      margin: 10px 0;
      color: #0d5c3a;
      display: block;
    }

    /* الآية ورقمها */
    .verse {
      display: inline;
      cursor: pointer;
      padding: 2px 4px;
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
      width: 28px;
      height: 28px;
      line-height: 26px;
      text-align: center;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="%230d5c3a" stroke-width="6"/></svg>') no-repeat center center;
      background-size: contain;
      font-size: 13px;
      font-weight: bold;
      color: #0d5c3a;
      margin: 0 4px;
    }

    /* فوتر الصفحة (رقم الصفحة) */
    .page-footer {
      text-align: center;
      border-top: 1px solid #e8e1d2;
      padding-top: 6px;
      font-size: 14px;
      color: #777;
    }

    /* مشغل الصوت والتحكم */
    .audio-bar {
      background: #063822;
      color: white;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .btn-play {
      background: #2b9348;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 20px;
      font-weight: bold;
      cursor: pointer;
    }

    .btn-download {
      background: #e63946;
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      font-size: 13px;
    }
  </style>
</head>
<body>

  <!-- شريط اختيار السورة والجزء -->
  <div class="top-bar">
    <div>
      <select id="surah-select" onchange="onSurahChange()">
        <!-- سيتم ملء 114 سورة تلقائياً -->
      </select>
    </div>
    <div>
      <select id="reciter-select" onchange="onReciterChange()">
        <option value="ar.alafasy">مشاري العفاسي</option>
        <option value="ar.husary">محمود خليل الحصري</option>
        <option value="ar.banna">محمود علي البنا</option>
        <option value="ar.minshawi">محمد صديق المنشاوي (مرتل)</option>
        <option value="ar.minshawimujawwad">محمد صديق المنشاوي (مجود)</option>
        <option value="ar.basil">باسل مؤنس (تسجيلات مختارة)</option>
        <option value="ar.kaseb">أحمد كاسب (تسجيلات مختارة)</option>
      </select>
    </div>
  </div>

  <!-- خيارات الاستماع والتحميل -->
  <div class="controls-panel">
    <span>💡 اسحب الصفحة لليمين/اليسار للتقليب</span>
    <button onclick="downloadCurrentSurahAudio()" class="btn-download">📥 تحميل السورة صوتياً</button>
  </div>

  <!-- عرض الصفحة المصحفية -->
  <div class="mushaf-viewport" id="viewport">
    <div class="quran-page-card" id="quran-card">
      <div class="page-header">
        <span id="juz-label">الجزء 1</span>
        <span id="surah-label">سُورةُ البَقَرَةِ</span>
      </div>

      <div class="page-body" id="page-body">
        <!-- يتم عرض الآيات هنا -->
      </div>

      <div class="page-footer">
        <span id="page-number-label">٣</span>
      </div>
    </div>
  </div>

  <!-- شريط التحكم الصوتي السفلي -->
  <div class="audio-bar">
    <button class="btn-play" id="play-btn" onclick="togglePlay()">▶️ تشغيل</button>
    <span id="audio-status" style="font-size: 13px;">جاهز للتشغيل</span>
    <button onclick="playFromSurahStart()" style="background:#457b9d; color:white; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;">⏮️ من أول السورة</button>
  </div>

  <audio id="audio-player" style="display:none;"></audio>

  <script>
    let currentPage = 3;
    let selectedVerseIndex = null;
    let isPlaying = false;
    let touchStartX = 0;
    let touchEndX = 0;

    const audioPlayer = document.getElementById('audio-player');

    // قائمة السور لتغذية الاختيار
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

    // تهيئة القائمة
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

    // سحب وتمرير الصفحات لليمين واليسار (Swipe)
    const viewport = document.getElementById('viewport');
    viewport.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });

    viewport.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        // سحب لليسار -> الصفحة التالية
        nextPage();
      }
      if (touchEndX > touchStartX + 50) {
        // سحب لليمين -> الصفحة السابقة
        prevPage();
      }
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

    // تحميل آيات صفحة معينة من API القرآن الكريم
    async function loadPage(pageNum) {
      document.getElementById('page-body').innerHTML = '<p style="text-align:center;">جاري تحميل الصفحة...</p>';
      selectedVerseIndex = null;

      try {
        const res = await fetch(\`https://api.alquran.cloud/v1/page/\${pageNum}/quran-uthmani\`);
        const data = await res.json();
        
        if (data.code === 200) {
          renderPage(data.data);
        }
      } catch (err) {
        document.getElementById('page-body').innerHTML = '<p style="text-align:center; color:red;">تعذر تحميل الصفحة، تحقق من الاتصال.</p>';
      }
    }

    function renderPage(pageData) {
      const body = document.getElementById('page-body');
      body.innerHTML = '';

      document.getElementById('page-number-label').innerText = pageData.number;
      
      if (pageData.ayahs.length > 0) {
        document.getElementById('surah-label').innerText = 'سُورةُ ' + pageData.ayahs[0].surah.name;
        document.getElementById('juz-label').innerText = 'الجزء ' + pageData.ayahs[0].juz;
        document.getElementById('surah-select').value = pageData.ayahs[0].surah.number;
      }

      // إضافة البسملة مستقلة إذا كانت بداية سورة جديدة في الصفحة (عدا الفاتحة والتوبة)
      let currentSurahNum = 0;

      pageData.ayahs.forEach((ayah, idx) => {
        if (ayah.surah.number !== currentSurahNum) {
          currentSurahNum = ayah.surah.number;
          if (ayah.numberInSurah === 1 && currentSurahNum !== 1 && currentSurahNum !== 9) {
            const basmalaDiv = document.createElement('div');
            basmalaDiv.className = 'basmala';
            basmalaDiv.innerText = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
            body.appendChild(basmalaDiv);
          }
        }

        // تنظيف نص الآية من البسملة المدمجة إذا كانت الآية الأولى
        let verseText = ayah.text;
        if (ayah.numberInSurah === 1 && currentSurahNum !== 1) {
          verseText = verseText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
        }

        const span = document.createElement('span');
        span.className = 'verse';
        span.id = \`verse-\${idx}\`;
        span.innerHTML = \`\${verseText} <span class="verse-number">\${ayah.numberInSurah}</span> \`;
        
        // عند الضغط لتحديد آية
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

    // التشغيل والاستماع
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

    function playAudio() {
      const reciter = document.getElementById('reciter-select').value;
      const surahNum = document.getElementById('surah-select').value;
      
      // رابط التلاوة حسب السورة والقارئ
      const audioUrl = \`https://cdn.islamic.network/quran/audio-surah/128/\${reciter}/\${surahNum}.mp3\`;
      
      audioPlayer.src = audioUrl;
      audioPlayer.play().then(() => {
        isPlaying = true;
        document.getElementById('play-btn').innerText = '⏸️ إيقاف مؤقت';
        document.getElementById('audio-status').innerText = 'جاري التشغيل...';
      }).catch(err => {
        alert('التلاوة الصوتية غير متوفرة لهذا القارئ حالياً.');
      });
    }

    function playFromSurahStart() {
      selectedVerseIndex = null;
      document.querySelectorAll('.verse').forEach(v => v.classList.remove('selected'));
      playAudio();
    }

    function onSurahChange() {
      const surahNum = document.getElementById('surah-select').value;
      // جلب رقم الصفحة الأولى لهذه السورة
      fetch(\`https://api.alquran.cloud/v1/surah/\${surahNum}\`)
        .then(res => res.json())
        .then(data => {
          if (data.data && data.data.ayahs.length > 0) {
            currentPage = data.data.ayahs[0].page;
            loadPage(currentPage);
          }
        });
    }

    function onReciterChange() {
      if (isPlaying) {
        playAudio();
      }
    }

    // تحميل السورة صوتياً على الهاتف
    function downloadCurrentSurahAudio() {
      const reciter = document.getElementById('reciter-select').value;
      const surahNum = document.getElementById('surah-select').value;
      const audioUrl = \`https://cdn.islamic.network/quran/audio-surah/128/\${reciter}/\${surahNum}.mp3\`;

      const a = document.createElement('a');
      a.href = audioUrl;
      a.target = '_blank';
      a.download = \`Surah_\${surahNum}_\${reciter}.mp3\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // بدء التطبيق عند الفتح
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