const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تصحيح وحفظ القرآن الكريم</title>
  <style>
    /* منع تحديد النصوص في المصحف */
    * {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f9;
      margin: 0;
      padding: 0;
      color: #333;
    }

    .header {
      background: linear-gradient(135deg, #0d5c3a, #063822);
      color: white;
      text-align: center;
      padding: 25px 15px;
    }

    .header h1 {
      margin: 0;
      font-size: 26px;
    }

    .header p {
      margin-top: 8px;
      font-size: 14px;
      opacity: 0.9;
    }

    .container {
      max-width: 800px;
      margin: 20px auto;
      padding: 0 15px;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .btn {
      display: inline-block;
      width: 100%;
      padding: 12px;
      margin: 8px 0;
      background-color: #0d5c3a;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      text-align: center;
    }

    .btn-secondary {
      background-color: #d4a373;
    }

    .btn-danger {
      background-color: #e63946;
    }

    .quran-display {
      font-family: 'Amiri', 'Traditional Arabic', serif;
      font-size: 24px;
      line-height: 2.2;
      text-align: justify;
      border: 1px solid #e0e0e0;
      padding: 20px;
      border-radius: 8px;
      background-color: #fffdf9;
    }

    /* تنسيق الكلمات الخاطئة والمصحيحة برسم المصحف */
    .word-error {
      color: #d90429 !important;
      background-color: #ffccd5;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: bold;
    }

    .word-correct {
      color: #2b9348;
    }

    select {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
      margin-bottom: 15px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 16px;
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>تصحيح وحفظ القرآن الكريم</h1>
    <p>منصة متكاملة لقراءة وتصحيح القرآن الكريم مع التصحيح</p>
  </div>

  <div class="container">
    <div class="card">
      <h3>📌 اختر وضع الاستخدام:</h3>
      <button class="btn" onclick="switchTab('read')">📖 1. قراءة واستماع المصحف</button>
      <button class="btn btn-secondary" onclick="switchTab('recite')">🎙️ 2. التسميع والتصحيح الفوري</button>
    </div>

    <!-- قسم القراءة والاستماع -->
    <div id="read-tab" class="card">
      <h3>📖 تصفح وقراءة المصحف الشريف</h3>
      
      <label>اختر السورة:</label>
      <select id="surah-select" onchange="loadSurahPages()">
        <option value="1">1. سورة الفاتحة</option>
        <option value="3">3. سورة آل عمران</option>
      </select>

      <label>اختر القارئ:</label>
      <select id="reciter-select">
        <option value="ar.alafasy">مشاري العفاسي</option>
        <option value="ar.husary">محمود خليل الحصري</option>
      </select>

      <div id="quran-text" class="quran-display">
        <!-- يتم تحميل الآيات هنا -->
      </div>

      <div style="margin-top: 15px; display: flex; gap: 10px;">
        <button class="btn" onclick="playCurrentPageAudio()">▶️ استماع من الصفحة الحالية</button>
        <button class="btn btn-secondary" onclick="stopAudio()">⏹️ إيقاف</button>
      </div>
      <audio id="audio-player" style="display:none;"></audio>
    </div>

    <!-- قسم التسميع والتصحيح الصوتي -->
    <div id="recite-tab" class="card" style="display:none;">
      <h3>🎙️ اختر السورة للتسميع:</h3>
      <select id="recite-surah-select">
        <option value="1">1. سورة الفاتحة</option>
      </select>

      <div id="recite-verses" class="quran-display" style="margin-bottom: 15px;">
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ (1) ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ (2) ٱلرَّحْمَٰنِ ٱلرَّحِيمِ (3) مَٰلِكِ يَوْمِ ٱلدِّينِ (4) إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (5) ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ (6) صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ
      </div>

      <button id="start-recite-btn" class="btn btn-danger" onclick="toggleRecitation()">🔴 بدء التسميع الصوتي</button>

      <h4>ما تم التقاطه وتصحيحه:</h4>
      <div id="recitation-result" class="quran-display" style="min-height: 50px;">
        <!-- نتائج التسميع تظهر هنا -->
      </div>
    </div>
  </div>

  <script>
    let currentVerses = [];
    let audioPlayer = document.getElementById('audio-player');
    let isRecollecting = false;
    let recognition;

    // التنقل بين الأقسام
    function switchTab(tab) {
      document.getElementById('read-tab').style.display = tab === 'read' ? 'block' : 'none';
      document.getElementById('recite-tab').style.display = tab === 'recite' ? 'block' : 'none';
    }

    // 1. تشغيل الصوت بدءاً من أول آية في الصفحة/السورة المعروضة حالياً
    function playCurrentPageAudio() {
      const reciter = document.getElementById('reciter-select').value;
      const surah = document.getElementById('surah-select').value;
      
      // جلب ملف الصوت لبداية الصفحة الحالية
      const audioUrl = \`https://cdn.islamic.network/quran/audio/128/\${reciter}/1.mp3\`; 
      audioPlayer.src = audioUrl;
      audioPlayer.play();
    }

    function stopAudio() {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }

    // 2. خوارزمية التسميع الصوتي وتنقية النصوص للمقارنة
    function normalizeText(text) {
      return text
        .replace(/[\u064B-\u065F\u0670]/g, '') // إزالة التشكيل للمقارنة فقط
        .replace(/[أإآٱ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/[^\w\sء-ي]/g, '')
        .trim();
    }

    function toggleRecitation() {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('المتصفح لا يدعم التعرف على الصوت، يرجى استخدام متصفح Chrome.');
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!isRecollecting) {
        recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
          isRecollecting = true;
          document.getElementById('start-recite-btn').innerText = '⏹️ إيقاف التسميع';
        };

        recognition.onresult = (event) => {
          let spokenText = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            spokenText += event.results[i][0].transcript;
          }
          compareAndDisplay(spokenText);
        };

        recognition.start();
      } else {
        recognition.stop();
        isRecollecting = false;
        document.getElementById('start-recite-btn').innerText = '🔴 بدء التسميع الصوتي';
      }
    }

    // مقارنة النص وعرض الكلمة بالتشكيل الأصلي مع تلوين الخطأ
    function compareAndDisplay(spokenText) {
      const originalText = document.getElementById('recite-verses').innerText;
      const originalWords = originalText.split(/\s+/);
      const spokenWords = normalizeText(spokenText).split(/\s+/);

      let resultHtml = '';

      originalWords.forEach((originalWordWithTashkeel, index) => {
        const cleanOriginal = normalizeText(originalWordWithTashkeel);
        const cleanSpoken = spokenWords[index] || '';

        if (cleanSpoken && cleanOriginal !== cleanSpoken) {
          resultHtml += \`<span class="word-error">\${originalWordWithTashkeel} (خطأ)</span> \`;
        } else if (cleanSpoken && cleanOriginal === cleanSpoken) {
          resultHtml += \`<span class="word-correct">\${originalWordWithTashkeel}</span> \`;
        }
      });

      document.getElementById('recitation-result').innerHTML = resultHtml || spokenText;
    }
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});