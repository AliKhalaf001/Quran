const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    const htmlPage = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>حفظ وتسميع وتصحيح القرآن الكريم</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
        <style>
            :root { --primary-color: #0d5c3f; --accent-color: #d9534f; --gold-color: #d4af37; --bg-color: #f4f7f4; }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Cairo', sans-serif; background-color: var(--bg-color); color: #333; line-height: 1.6; }
            
            .header { background: linear-gradient(135deg, var(--primary-color), #083b28); color: white; text-align: center; padding: 1rem; }
            .header h1 { font-size: 1.6rem; margin-bottom: 0.2rem; }

            .main-layout { display: flex; max-width: 1200px; margin: 15px auto; gap: 15px; padding: 0 10px; }
            
            .sidebar { width: 260px; background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); height: fit-content; }
            .sidebar h3 { font-size: 1rem; color: var(--primary-color); margin-bottom: 12px; border-bottom: 2px solid var(--bg-color); padding-bottom: 5px; }
            .tab-btn { display: block; width: 100%; padding: 12px; margin-bottom: 8px; text-align: right; background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; font-family: 'Cairo', sans-serif; font-weight: bold; font-size: 0.9rem; cursor: pointer; transition: 0.2s; }
            .tab-btn:hover, .tab-btn.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }

            .content-area { flex: 1; display: flex; flex-direction: column; gap: 15px; }
            .panel { display: none; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            .panel.active { display: block; }

            .controls-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; align-items: center; background: #f9f9f9; padding: 12px; border-radius: 8px; }
            .control-group { flex: 1; min-width: 140px; }
            .control-group label { display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 3px; }
            select, button { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; font-family: 'Cairo', sans-serif; font-size: 0.9rem; }
            
            .btn-primary { background: var(--primary-color); color: white; border: none; font-weight: bold; cursor: pointer; }
            .btn-stop-audio { background: #6c757d; color: white; border: none; font-weight: bold; cursor: pointer; }
            .btn-rec { background: var(--accent-color); color: white; border: none; font-weight: bold; cursor: pointer; }

            .quran-text { font-family: 'Amiri', serif; font-size: 1.7rem; line-height: 2.3; text-align: justify; min-height: 350px; padding: 15px; background: #fffdf9; border: 1px solid #eee; border-radius: 8px; margin-bottom: 10px; }
            .page-navigation { display: flex; justify-content: space-between; align-items: center; background: #f4f7f4; padding: 8px 15px; border-radius: 6px; font-weight: bold; }
            .page-btn { width: auto; padding: 6px 15px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; }

            .live-speech { min-height: 70px; padding: 12px; background: #f9f9f9; border-radius: 6px; margin: 10px 0; font-size: 1.2rem; border: 1px dashed #ccc; }
            .word-correct { color: green; font-weight: bold; }
            .word-error { color: red; text-decoration: underline; background-color: #ffe6e6; padding: 0 4px; border-radius: 3px; font-weight: bold; }

            @media (max-width: 768px) {
                .main-layout { flex-direction: column; }
                .sidebar { width: 100%; }
                .quran-text { font-size: 1.4rem; }
            }
        </style>
    </head>
    <body>

        <header class="header">
            <h1>حفظ وتسميع وتصحيح القرآن الكريم</h1>
            <p style="font-size: 0.85rem; opacity: 0.9;">منصة متكاملة لقراءة وتسميع القرآن الكريم مع التصحيح</p>
        </header>

        <div class="main-layout">
            <div class="sidebar">
                <h3>📌 اختر وضع الاستخدام:</h3>
                <button class="tab-btn active" onclick="switchTab(0)">📖 1. قراءة واستماع المصحف</button>
                <button class="tab-btn" onclick="switchTab(1)">🎙️ 2. التسميع والتصحيح الفوري</button>
                <button class="tab-btn" onclick="switchTab(2)">🎧 3. الاستماع للتلاوة الكاملة</button>
            </div>

            <div class="content-area">
                
                <!-- الوضع الأول: قراءة واستماع المصحف -->
                <div id="panel-0" class="panel active">
                    <h2 style="color: var(--primary-color); margin-bottom: 10px; font-size: 1.2rem;">📖 تصفح وقراءة المصحف الشريف</h2>
                    <div class="controls-row">
                        <div class="control-group">
                            <label>اختر السورة:</label>
                            <select id="surah-select-1" onchange="changeSurah()"></select>
                        </div>
                        <div class="control-group">
                            <label>اختر القارئ:</label>
                            <select id="reciter-select-1">
                                <option value="ar.alafasy">مشاري العفاسي</option>
                                <option value="ar.sudais">عبد الرحمن السديس</option>
                                <option value="ar.husary">محمود خليل الحصري</option>
                            </select>
                        </div>
                        <div class="control-group" style="display: flex; gap: 5px; flex: 1;">
                            <label>&nbsp;</label>
                            <button class="btn-primary" onclick="playFullSurah()">🔊 تشغيل</button>
                            <button class="btn-stop-audio" onclick="stopEverything()">⏹️ إيقاف</button>
                        </div>
                    </div>
                    
                    <div id="quran-page-display" class="quran-text">جاري تحميل الصفحة...</div>
                    
                    <div class="page-navigation">
                        <button class="page-btn" onclick="prevPage()">◀ الصفحة السابقة</button>
                        <span id="page-indicator">الصفحة 1</span>
                        <button class="page-btn" onclick="nextPage()">الصفحة التالية ▶</button>
                    </div>
                </div>

                <!-- الوضع الثاني: التسميع والتصحيح الفوري (بدون زر إيقاف منفصل وأزرار تبديل) -->
                <div id="panel-1" class="panel">
                    <h2 style="color: var(--primary-color); margin-bottom: 10px; font-size: 1.2rem;">🎙️ التسميع والتصحيح الفوري</h2>
                    <div class="controls-row">
                        <div class="control-group">
                            <label>اختر السورة للتسميع:</label>
                            <select id="surah-select-2" onchange="loadSurahTextForRecitation()"></select>
                        </div>
                        <div class="control-group">
                            <label>قارئ التصحيح:</label>
                            <select id="reciter-select-2">
                                <option value="ar.alafasy">مشاري العفاسي</option>
                                <option value="ar.sudais">عبد الرحمن السديس</option>
                                <option value="ar.husary">محمود خليل الحصري</option>
                            </select>
                        </div>
                    </div>

                    <div style="background: #fffdf9; padding: 15px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 15px;">
                        <h4 style="margin-bottom: 8px; font-size: 1rem; color: var(--primary-color);">آيات السورة المراد تسميعها:</h4>
                        <div id="quran-recite-display" style="font-family: 'Amiri', serif; font-size: 1.4rem; max-height: 180px; overflow-y: auto;"></div>
                    </div>

                    <div style="display:flex; gap:10px; align-items: center;">
                        <button id="start-btn" class="btn-rec" onclick="toggleRecitation()">🔴 بدء التسميع الصوتي</button>
                        <button id="audio-toggle-btn" class="btn-primary" onclick="toggleCorrectionAudio()" style="background: var(--gold-color);">🔊 استماع للآية من الشيخ</button>
                    </div>

                    <div style="margin-top:15px;">
                        <label style="font-size:0.9rem; font-weight:bold;">ما تم التقاطه وتصحيحه:</label>
                        <div id="live-speech" class="live-speech">في انتظار بدء التسميع...</div>
                    </div>
                </div>

                <!-- الوضع الثالث: الاستماع للتلاوة الكاملة -->
                <div id="panel-2" class="panel">
                    <h2 style="color: var(--primary-color); margin-bottom: 10px; font-size: 1.2rem;">🎧 مشغل تلاوات القرآن الكريم</h2>
                    <div class="controls-row">
                        <div class="control-group">
                            <label>اختر السورة:</label>
                            <select id="surah-select-3"></select>
                        </div>
                        <div class="control-group">
                            <label>اختر الشيخ:</label>
                            <select id="reciter-select-3">
                                <option value="ar.alafasy">مشاري العفاسي</option>
                                <option value="ar.sudais">عبد الرحمن السديس</option>
                                <option value="ar.husary">محمود خليل الحصري</option>
                            </select>
                        </div>
                        <div class="control-group" style="flex:0.5;">
                            <label>&nbsp;</label>
                            <button class="btn-primary" onclick="playAudioDirect()">تشغيل مباشر</button>
                        </div>
                    </div>
                    <div style="text-align: center; padding: 20px;">
                        <audio id="audio-player" controls style="width: 100%; margin-top: 15px;"></audio>
                    </div>
                </div>

            </div>
        </div>

        <script>
            let allAyahs = [];
            let currentPage = 0;
            const ayahsPerPage = 10;
            let currentAyahsText = [];
            let recognition;
            let isReciting = false;
            let globalAudio = new Audio();

            function switchTab(index) {
                stopEverything();
                document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
                    btn.classList.toggle('active', idx === index);
                });
                document.querySelectorAll('.panel').forEach((panel, idx) => {
                    panel.classList.toggle('active', idx === index);
                });
            }

            async function init() {
                try {
                    const res = await fetch('https://api.alquran.cloud/v1/surah');
                    const data = await res.json();
                    if(data.code === 200) {
                        const optionsHtml = data.data.map(s => '<option value="' + s.number + '">' + s.number + '. ' + s.name + '</option>').join('');
                        document.getElementById('surah-select-1').innerHTML = optionsHtml;
                        document.getElementById('surah-select-2').innerHTML = optionsHtml;
                        document.getElementById('surah-select-3').innerHTML = optionsHtml;
                        loadSurahPages();
                        loadSurahTextForRecitation();
                    }
                } catch(e) { console.log("خطأ في التحميل"); }
            }

            async function loadSurahPages() {
                const sNum = document.getElementById('surah-select-1').value || 1;
                currentPage = 0;
                try {
                    const res = await fetch('https://api.alquran.cloud/v1/surah/' + sNum);
                    const data = await res.json();
                    if(data.code === 200) {
                        allAyahs = data.data.ayahs;
                        renderPage();
                    }
                } catch(e) { document.getElementById('quran-page-display').innerHTML = "تعذر تحميل المصحف."; }
            }

            function changeSurah() {
                loadSurahPages();
            }

            function renderPage() {
                const display = document.getElementById('quran-page-display');
                const start = currentPage * ayahsPerPage;
                const end = start + ayahsPerPage;
                const pageAyahs = allAyahs.slice(start, end);

                if(pageAyahs.length === 0) {
                    currentPage = 0;
                    renderPage();
                    return;
                }

                let html = '';
                pageAyahs.forEach((a) => {
                    let text = a.text;
                    if (a.numberInSurah === 1 && a.number !== 1 && a.number !== 9) {
                        text = text.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '');
                    }
                    html += '<span>' + text + ' <b style="color:var(--gold-color);">(' + a.numberInSurah + ')</b> </span>';
                });
                display.innerHTML = html;
                document.getElementById('page-indicator').textContent = 'الصفحة ' + (currentPage + 1) + ' من ' + Math.ceil(allAyahs.length / ayahsPerPage);
            }

            function nextPage() {
                if((currentPage + 1) * ayahsPerPage < allAyahs.length) {
                    currentPage++;
                    renderPage();
                }
            }

            function prevPage() {
                if(currentPage > 0) {
                    currentPage--;
                    renderPage();
                }
            }

            async function loadSurahTextForRecitation() {
                const sNum = document.getElementById('surah-select-2').value || 1;
                const display = document.getElementById('quran-recite-display');
                try {
                    const res = await fetch('https://api.alquran.cloud/v1/surah/' + sNum);
                    const data = await res.json();
                    if(data.code === 200) {
                        currentAyahsText = data.data.ayahs.map(a => cleanText(a.text));
                        let html = '';
                        data.data.ayahs.forEach((a) => {
                            html += '<span>' + a.text + ' <b>(' + a.numberInSurah + ')</b> </span>';
                        });
                        display.innerHTML = html;
                    }
                } catch(e) { display.innerHTML = "خطأ في التحميل."; }
            }

            function cleanText(text) {
                return text.replace(/[\\u064B-\\u0652]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه");
            }

            // دالة الإيقاف الشاملة لإعادة الأزرار لحالتها الافتراضية وإيقاف التسجيل أو الصوت
            function stopEverything() {
                if(recognition && isReciting) {
                    try { recognition.stop(); } catch(e) {}
                }
                isReciting = false;

                globalAudio.pause();
                globalAudio.currentTime = 0;

                const audioPlayer = document.getElementById('audio-player');
                if(audioPlayer) {
                    audioPlayer.pause();
                    audioPlayer.currentTime = 0;
                }

                // إعادة ضبط شكل ونصوص أزرار التسميع والاستماع
                const startBtn = document.getElementById('start-btn');
                if(startBtn) {
                    startBtn.textContent = "🔴 بدء التسميع الصوتي";
                    startBtn.style.background = "var(--accent-color)";
                }

                const audioBtn = document.getElementById('audio-toggle-btn');
                if(audioBtn) {
                    audioBtn.textContent = "🔊 استماع للآية من الشيخ";
                    audioBtn.style.background = "var(--gold-color)";
                }
            }

            // خاصية زر التسميع كـ Toggle (يبدأ أو يوقف عند الضغط)
            function toggleRecitation() {
                if (!isReciting) {
                    stopEverything(); // إيقاف أي صوت شيخ يعمل حالياً
                    isReciting = true;
                    document.getElementById('live-speech').textContent = "جاري الاستماع لتلاوتك... (تحدث الآن)";
                    try {
                        recognition.start();
                    } catch(e) {}
                    
                    const startBtn = document.getElementById('start-btn');
                    startBtn.textContent = "⏹️ إيقاف التسجيل";
                    startBtn.style.background = "#6c757d";
                } else {
                    stopEverything(); // الضغط مرة أخرى يوقف التسجيل
                }
            }

            // خاصية زر الاستماع لصوت الشيخ كـ Toggle (يبدأ أو يوقف عند الضغط)
            function toggleCorrectionAudio() {
                if (globalAudio.paused) {
                    stopEverything(); // إيقاف أي تسجيل يعمل حالياً
                    const sNum = String(document.getElementById('surah-select-2').value || 1).padStart(3, '0');
                    const reciter = document.getElementById('reciter-select-2').value;
                    playAudioUrl(sNum, reciter);
                    
                    const audioBtn = document.getElementById('audio-toggle-btn');
                    audioBtn.textContent = "⏹️ إيقاف صوت الشيخ";
                    audioBtn.style.background = "#6c757d";
                } else {
                    stopEverything(); // الضغط مرة أخرى يوقف الصوت
                }
            }

            function playFullSurah() {
                stopEverything();
                const sNum = String(document.getElementById('surah-select-1').value || 1).padStart(3, '0');
                const reciter = document.getElementById('reciter-select-1').value;
                playAudioUrl(sNum, reciter);
            }

            function playAudioDirect() {
                stopEverything();
                const sNum = String(document.getElementById('surah-select-3').value || 1).padStart(3, '0');
                const reciter = document.getElementById('reciter-select-3').value;
                const audioPlayer = document.getElementById('audio-player');
                let server = 'server8.mp3quran.net/afs';
                if(reciter === 'ar.sudais') server = 'server11.mp3quran.net/sds';
                if(reciter === 'ar.husary') server = 'server13.mp3quran.net/husr';
                audioPlayer.src = 'https://' + server + '/' + sNum + '.mp3';
                audioPlayer.play();
            }

            function playAudioUrl(sNum, reciter) {
                let server = 'server8.mp3quran.net/afs';
                if(reciter === 'ar.sudais') server = 'server11.mp3quran.net/sds';
                if(reciter === 'ar.husary') server = 'server13.mp3quran.net/husr';
                globalAudio.src = 'https://' + server + '/' + sNum + '.mp3';
                globalAudio.play();
                
                globalAudio.onended = () => {
                    const audioBtn = document.getElementById('audio-toggle-btn');
                    if(audioBtn) {
                        audioBtn.textContent = "🔊 استماع للآية من الشيخ";
                        audioBtn.style.background = "var(--gold-color)";
                    }
                };
            }

            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'ar-SA';

                recognition.onresult = (event) => {
                    let transcript = '';
                    for (let i = 0; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    document.getElementById('live-speech').textContent = transcript;
                    checkAndCorrect(transcript);
                };

                recognition.onerror = (event) => {
                    document.getElementById('live-speech').textContent = "⚠️ خطأ في محرك الصوت: " + event.error;
                };

                recognition.onend = () => {
                    if(isReciting) {
                        // إعادة التشغيل استمرارية إذا توقف تلقائياً
                        try { recognition.start(); } catch(e) {}
                    }
                };
            }

            function checkAndCorrect(userText) {
                const cleanUserWords = cleanText(userText).trim().split(/\\s+/);
                const fullSurahClean = currentAyahsText.join(" ").split(/\\s+/);
                let highlightedHtml = "";
                let hasError = false;

                cleanUserWords.forEach((word) => {
                    if (fullSurahClean.includes(word)) {
                        highlightedHtml += '<span class="word-correct">' + word + '</span> ';
                    } else {
                        highlightedHtml += '<span class="word-error">' + word + ' (خطأ)</span> ';
                        hasError = true;
                    }
                });

                document.getElementById('live-speech').innerHTML = highlightedHtml;

                if (hasError && isReciting) {
                    stopEverything(); // إيقاف التسميع تلقائياً عند الخطأ
                    // تشغيل صوت الشيخ للتصحيح وتحديث الزر
                    const sNum = String(document.getElementById('surah-select-2').value || 1).padStart(3, '0');
                    const reciter = document.getElementById('reciter-select-2').value;
                    playAudioUrl(sNum, reciter);
                    const audioBtn = document.getElementById('audio-toggle-btn');
                    if(audioBtn) {
                        audioBtn.textContent = "⏹️ إيقاف صوت الشيخ";
                        audioBtn.style.background = "#6c757d";
                    }
                }
            }

            init();
        </script>
    </body>
    </html>
    `;
    res.send(htmlPage);
});

app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل بنجاح على: http://localhost:${PORT}`);
});