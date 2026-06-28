/* =========================================================================
   앱 로직 — 어휘 / 문법 / 독해
   진행상황은 localStorage에 저장됩니다.
   ========================================================================= */

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

/* --------------------- 저장소 --------------------- */
const STORE_KEY = "gong9_eng_v1";
const store = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
const defaults = {
  vocabQuizDone: 0, vocabQuizCorrect: 0,
  grammarDone: 0, grammarCorrect: 0,
  readingDone: 0, readingCorrect: 0,
  knownWords: [],     // 외운 단어 (word 문자열)
  wrongWords: [],     // 틀린 단어 복습용
  kichul: {},         // 기출 연도별 최고점 { "2025": {best, total} }
};
for (const k in defaults) if (!(k in store)) store[k] = defaults[k];
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(store)); renderStats(); }

/* --------------------- 유틸 --------------------- */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pct = (c, t) => (t === 0 ? 0 : Math.round((c / t) * 100));

/* --------------------- 상단 통계 --------------------- */
function renderStats() {
  const totalDone = store.vocabQuizDone + store.grammarDone + store.readingDone;
  const totalCorrect = store.vocabQuizCorrect + store.grammarCorrect + store.readingCorrect;
  $("#stat-words").textContent = `${store.knownWords.length} / ${VOCAB.length}`;
  $("#stat-solved").textContent = totalDone;
  $("#stat-acc").textContent = pct(totalCorrect, totalDone) + "%";
  $("#stat-wrong").textContent = store.wrongWords.length;
}

/* --------------------- 탭 전환 --------------------- */
$$(".tab").forEach((t) => {
  t.addEventListener("click", () => {
    $$(".tab").forEach((x) => x.classList.remove("active"));
    $$(".panel").forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    $("#panel-" + t.dataset.tab).classList.add("active");
  });
});

/* =========================================================================
   1) 어휘
   ========================================================================= */
const Vocab = (() => {
  let order = [];
  let idx = 0;
  let mode = "flash"; // flash | quiz

  /* ---- 플래시카드 ---- */
  function initFlash() {
    order = shuffle(VOCAB.map((_, i) => i));
    idx = 0;
    renderFlash();
  }
  function renderFlash() {
    const v = VOCAB[order[idx]];
    const flash = $("#flash");
    flash.classList.remove("flipped");
    const known = store.knownWords.includes(v.word);
    const exHtml = v.ex.replace(new RegExp(`\\b${v.word}\\w*`, "i"), (m) => `<span class="key">${m}</span>`);
    $("#flash-front").innerHTML =
      `<div class="w">${v.word}</div><div class="pos">${v.pos}.</div><div class="hint">카드를 눌러 뜻 보기</div>`;
    $("#flash-back").innerHTML =
      `<div class="m">${v.meaning}</div><div class="ex">${exHtml}</div>`;
    $("#flash-counter").textContent = `${idx + 1} / ${order.length}`;
    $("#btn-known").textContent = known ? "✓ 외운 단어" : "외웠어요";
    $("#btn-known").classList.toggle("ghost", !known);
  }
  function flip() { $("#flash").classList.toggle("flipped"); }
  function next() { idx = (idx + 1) % order.length; renderFlash(); }
  function prev() { idx = (idx - 1 + order.length) % order.length; renderFlash(); }
  function toggleKnown() {
    const w = VOCAB[order[idx]].word;
    const i = store.knownWords.indexOf(w);
    if (i === -1) store.knownWords.push(w);
    else store.knownWords.splice(i, 1);
    save();
    renderFlash();
  }

  /* ---- 단어 퀴즈 ---- */
  let quizOrder = [], qi = 0, answered = false, sessionCorrect = 0, reviewMode = false;

  function startQuiz(review = false) {
    reviewMode = review;
    let pool = VOCAB.map((_, i) => i);
    if (review) {
      pool = VOCAB.map((v, i) => store.wrongWords.includes(v.word) ? i : -1).filter((i) => i >= 0);
      if (pool.length === 0) { alert("복습할 틀린 단어가 없습니다. 먼저 퀴즈를 풀어보세요!"); return; }
    }
    quizOrder = shuffle(pool).slice(0, review ? pool.length : 10);
    qi = 0; sessionCorrect = 0;
    $("#vquiz-setup").style.display = "none";
    $("#vquiz").style.display = "block";
    $("#vquiz-result").style.display = "none";
    renderQuiz();
  }

  function renderQuiz() {
    answered = false;
    const v = VOCAB[quizOrder[qi]];
    // 한 → 영 또는 영 → 한 랜덤
    const enToKo = Math.random() < 0.5;
    const correct = enToKo ? v.meaning : v.word;
    const prompt = enToKo ? `<b>${v.word}</b> (${v.pos}.)의 뜻은?` : `"${v.meaning}" 에 해당하는 단어는?`;
    // 보기 구성
    const distractPool = shuffle(VOCAB.filter((x) => x.word !== v.word));
    const distractors = distractPool.slice(0, 3).map((x) => (enToKo ? x.meaning : x.word));
    const opts = shuffle([correct, ...distractors]);

    $("#vquiz-prog").style.width = pct(qi, quizOrder.length) + "%";
    $("#vquiz-meta").textContent = `${reviewMode ? "복습 " : ""}${qi + 1} / ${quizOrder.length}`;
    $("#vquiz-q").innerHTML = prompt;
    const box = $("#vquiz-options");
    box.innerHTML = "";
    opts.forEach((o, i) => {
      const b = document.createElement("button");
      b.className = "option";
      b.innerHTML = `<span class="num">${i + 1}</span><span>${o}</span>`;
      b.onclick = () => pick(b, o, correct, v);
      box.appendChild(b);
    });
    $("#vquiz-exp").classList.remove("show");
    $("#vquiz-next").style.display = "none";
  }

  function pick(btn, chosen, correct, v) {
    if (answered) return;
    answered = true;
    const isCorrect = chosen === correct;
    $$("#vquiz-options .option").forEach((b) => {
      b.disabled = true;
      const txt = b.querySelector("span:last-child").textContent;
      if (txt === correct) b.classList.add("correct"); // 정답 강조
    });
    store.vocabQuizDone++;
    if (isCorrect) {
      sessionCorrect++;
      store.vocabQuizCorrect++;
      // 복습 모드에서 맞히면 틀린 목록에서 제거
      const wi = store.wrongWords.indexOf(v.word);
      if (wi >= 0) store.wrongWords.splice(wi, 1);
    } else {
      btn.classList.add("wrong");
      if (!store.wrongWords.includes(v.word)) store.wrongWords.push(v.word);
    }
    save();
    $("#vquiz-exp").innerHTML =
      `<span class="label">${v.word}</span> ${v.pos}. — <b>${v.meaning}</b><br><span class="muted">예) ${v.ex}</span>`;
    $("#vquiz-exp").classList.add("show");
    $("#vquiz-next").style.display = "inline-block";
    $("#vquiz-prog").style.width = pct(qi + 1, quizOrder.length) + "%";
  }

  function nextQuiz() {
    qi++;
    if (qi >= quizOrder.length) finishQuiz();
    else renderQuiz();
  }

  function finishQuiz() {
    $("#vquiz").style.display = "none";
    $("#vquiz-result").style.display = "block";
    const score = pct(sessionCorrect, quizOrder.length);
    $("#vquiz-score").textContent = `${sessionCorrect} / ${quizOrder.length}`;
    let msg = "조금 더 외워볼까요? 💪";
    if (score === 100) msg = "완벽합니다! 🎉";
    else if (score >= 70) msg = "잘하고 있어요! 👍";
    $("#vquiz-msg").textContent = msg;
  }

  function backToSetup() {
    $("#vquiz").style.display = "none";
    $("#vquiz-result").style.display = "none";
    $("#vquiz-setup").style.display = "block";
  }

  /* ---- 모드 전환 ---- */
  function setMode(m) {
    mode = m;
    $$("#panel-vocab .subtab").forEach((s) => s.classList.toggle("active", s.dataset.vmode === m));
    $("#vocab-flash").style.display = m === "flash" ? "block" : "none";
    $("#vocab-quiz").style.display = m === "quiz" ? "block" : "none";
    if (m === "flash") initFlash();
    else backToSetup();
  }

  function bind() {
    $("#flash").onclick = flip;
    $("#btn-next").onclick = next;
    $("#btn-prev").onclick = prev;
    $("#btn-known").onclick = (e) => { e.stopPropagation(); toggleKnown(); };
    $("#btn-shuffle").onclick = initFlash;
    $("#btn-start-quiz").onclick = () => startQuiz(false);
    $("#btn-review-quiz").onclick = () => startQuiz(true);
    $("#vquiz-next").onclick = nextQuiz;
    $("#vquiz-again").onclick = backToSetup;
    $$("#panel-vocab .subtab").forEach((s) => (s.onclick = () => setMode(s.dataset.vmode)));
    setMode("flash");
  }
  return { bind };
})();

/* =========================================================================
   2) 문법
   ========================================================================= */
const Grammar = (() => {
  let qOrder = [], qi = 0, answered = false, sessionCorrect = 0;

  function renderPoints() {
    const box = $("#grammar-points");
    box.innerHTML = GRAMMAR.points.map((p) =>
      `<details class="point"><summary>${p.title}</summary><div class="body">${p.body}</div></details>`
    ).join("");
  }

  function startQuiz() {
    qOrder = shuffle(GRAMMAR.questions.map((_, i) => i)).slice(0, 10);
    qi = 0; sessionCorrect = 0;
    $("#gquiz-setup").style.display = "none";
    $("#gquiz").style.display = "block";
    $("#gquiz-result").style.display = "none";
    renderQuiz();
  }

  function renderQuiz() {
    answered = false;
    const item = GRAMMAR.questions[qOrder[qi]];
    $("#gquiz-prog").style.width = pct(qi, qOrder.length) + "%";
    $("#gquiz-meta").textContent = `${qi + 1} / ${qOrder.length}`;
    $("#gquiz-q").innerHTML = item.q.replace(/______/g, '<span class="blank">______</span>');
    const box = $("#gquiz-options");
    box.innerHTML = "";
    item.options.forEach((o, i) => {
      const b = document.createElement("button");
      b.className = "option";
      b.innerHTML = `<span class="num">${i + 1}</span><span>${o}</span>`;
      b.onclick = () => pick(i, item);
      box.appendChild(b);
    });
    $("#gquiz-exp").classList.remove("show");
    $("#gquiz-next").style.display = "none";
  }

  function pick(i, item) {
    if (answered) return;
    answered = true;
    const buttons = $$("#gquiz-options .option");
    buttons.forEach((b, bi) => {
      b.disabled = true;
      if (bi === item.answer) b.classList.add("correct");
      else if (bi === i) b.classList.add("wrong");
    });
    store.grammarDone++;
    if (i === item.answer) { sessionCorrect++; store.grammarCorrect++; }
    save();
    $("#gquiz-exp").innerHTML = `<span class="label">해설</span> ${item.exp}`;
    $("#gquiz-exp").classList.add("show");
    $("#gquiz-next").style.display = "inline-block";
    $("#gquiz-prog").style.width = pct(qi + 1, qOrder.length) + "%";
  }

  function nextQuiz() {
    qi++;
    if (qi >= qOrder.length) finishQuiz();
    else renderQuiz();
  }

  function finishQuiz() {
    $("#gquiz").style.display = "none";
    $("#gquiz-result").style.display = "block";
    const score = pct(sessionCorrect, qOrder.length);
    $("#gquiz-score").textContent = `${sessionCorrect} / ${qOrder.length}`;
    let msg = "개념 카드를 다시 복습해 봐요 📘";
    if (score === 100) msg = "문법 완벽! 🎉";
    else if (score >= 70) msg = "좋아요, 계속 갑시다! 👍";
    $("#gquiz-msg").textContent = msg;
  }

  function backToSetup() {
    $("#gquiz").style.display = "none";
    $("#gquiz-result").style.display = "none";
    $("#gquiz-setup").style.display = "block";
  }

  function setMode(m) {
    $$("#panel-grammar .subtab").forEach((s) => s.classList.toggle("active", s.dataset.gmode === m));
    $("#grammar-study").style.display = m === "study" ? "block" : "none";
    $("#grammar-quiz").style.display = m === "quiz" ? "block" : "none";
    if (m === "quiz") backToSetup();
  }

  function bind() {
    renderPoints();
    $("#btn-start-gquiz").onclick = startQuiz;
    $("#gquiz-next").onclick = nextQuiz;
    $("#gquiz-again").onclick = backToSetup;
    $$("#panel-grammar .subtab").forEach((s) => (s.onclick = () => setMode(s.dataset.gmode)));
    setMode("study");
  }
  return { bind };
})();

/* =========================================================================
   3) 독해
   ========================================================================= */
const Reading = (() => {
  let rIdx = 0, answered = [];

  function renderList() {
    const box = $("#reading-list");
    box.innerHTML = READING.map((r, i) =>
      `<button class="option" data-r="${i}"><span class="num">${i + 1}</span><span>${r.title}</span></button>`
    ).join("");
    $$("#reading-list .option").forEach((b) => (b.onclick = () => open(+b.dataset.r)));
  }

  function open(i) {
    rIdx = i;
    answered = READING[i].questions.map(() => false);
    $("#reading-list-view").style.display = "none";
    $("#reading-detail").style.display = "block";
    renderDetail();
  }

  function renderDetail() {
    const r = READING[rIdx];
    $("#reading-title").textContent = r.title;
    $("#reading-passage").textContent = r.passage;
    const box = $("#reading-questions");
    box.innerHTML = "";
    r.questions.forEach((item, qIndex) => {
      const wrap = document.createElement("div");
      wrap.style.marginBottom = "26px";
      wrap.innerHTML = `<div class="q-text" style="font-size:16px">Q${qIndex + 1}. ${item.q}</div>`;
      const opts = document.createElement("div");
      opts.className = "options";
      item.options.forEach((o, i) => {
        const b = document.createElement("button");
        b.className = "option";
        b.innerHTML = `<span class="num">${i + 1}</span><span>${o}</span>`;
        b.onclick = () => pick(qIndex, i, item, opts, exp);
        opts.appendChild(b);
      });
      const exp = document.createElement("div");
      exp.className = "explain";
      exp.innerHTML = `<span class="label">해설</span> ${item.exp}`;
      wrap.appendChild(opts);
      wrap.appendChild(exp);
      box.appendChild(wrap);
    });
  }

  function pick(qIndex, choice, item, optsEl, expEl) {
    if (answered[qIndex]) return;
    answered[qIndex] = true;
    const buttons = $$(".option", optsEl);
    buttons.forEach((b, bi) => {
      b.disabled = true;
      if (bi === item.answer) b.classList.add("correct");
      else if (bi === choice) b.classList.add("wrong");
    });
    store.readingDone++;
    if (choice === item.answer) store.readingCorrect++;
    save();
    expEl.classList.add("show");
  }

  function back() {
    $("#reading-detail").style.display = "none";
    $("#reading-list-view").style.display = "block";
  }

  function bind() {
    renderList();
    $("#reading-back").onclick = back;
  }
  return { bind };
})();

/* =========================================================================
   4) 기출문제
   ========================================================================= */
const Kichul = (() => {
  const CIRC = ["①", "②", "③", "④"];
  let year = null, answers = {}, graded = false;

  const years = () => Object.keys(KICHUL).sort();

  function renderHome() {
    const grid = $("#year-grid");
    grid.innerHTML = "";
    years().forEach((y) => {
      const rec = store.kichul[y];
      const best = rec ? `최고 ${rec.best}/${rec.total}` : "미응시";
      const card = document.createElement("div");
      card.className = "year-card";
      card.innerHTML =
        `<div class="yr">${y}</div><div class="label">국가직 9급</div>` +
        `<div class="best ${rec ? "" : "empty"}">${best}</div>`;
      card.onclick = () => openYear(y);
      grid.appendChild(card);
    });
  }

  function openYear(y) {
    year = y; answers = {}; graded = false;
    $("#kichul-home").style.display = "none";
    $("#kichul-exam").style.display = "block";
    $("#exam-title").textContent = `${y}년 국가직 9급 영어 (20문항)`;
    $("#exam-grade").style.display = "inline-block";
    $("#exam-reset").style.display = "none";
    $("#exam-score").textContent = "";
    renderExam();
    updateProgress();
    window.scrollTo(0, 0);
  }

  function renderExam() {
    const box = $("#exam-questions");
    box.innerHTML = "";
    KICHUL[year].forEach((q) => {
      const card = document.createElement("div");
      card.className = "exam-q";
      card.id = "eq-" + q.no;
      const head = `<span class="qno">문 ${q.no}</span>`;
      const body = `<div class="qbody">${esc(q.body)}</div>`;
      const opts = document.createElement("div");
      opts.className = "options";
      for (let i = 0; i < 4; i++) {
        const b = document.createElement("button");
        b.className = "option";
        b.dataset.q = q.no; b.dataset.i = i;
        const label = q.options ? esc(q.options[i]) : "";
        b.innerHTML = `<span class="num">${CIRC[i]}</span>` + (label ? `<span>${label}</span>` : "");
        b.onclick = () => pick(q.no, i);
        opts.appendChild(b);
      }
      card.innerHTML = head + body;
      card.appendChild(opts);
      box.appendChild(card);
    });
  }

  function pick(qno, i) {
    if (graded) return;
    answers[qno] = i;
    $$(`#eq-${qno} .option`).forEach((b) =>
      b.classList.toggle("sel-opt", +b.dataset.i === i));
    updateProgress();
  }

  function updateProgress() {
    const done = Object.keys(answers).length;
    $("#exam-progress").textContent = `${done} / 20 응답`;
  }

  function grade() {
    if (graded) return;
    graded = true;
    let correct = 0;
    KICHUL[year].forEach((q) => {
      const chosen = answers[q.no];
      const card = $("#eq-" + q.no);
      $$(`#eq-${q.no} .option`).forEach((b) => {
        b.disabled = true;
        const i = +b.dataset.i;
        if (i === q.answer) b.classList.add("correct");
        else if (i === chosen) b.classList.add("wrong");
      });
      const ok = chosen === q.answer;
      if (ok) correct++;
      card.classList.add(ok ? "correct-q" : "wrong-q");
      // 헤더에 O/X 배지
      const qno = card.querySelector(".qno");
      const badge = document.createElement("span");
      badge.className = "badge " + (ok ? "ok" : "no");
      badge.textContent = ok ? "정답" : (chosen == null ? "미응답" : "오답");
      qno.after(badge);
    });
    const total = KICHUL[year].length;
    $("#exam-score").textContent = `점수 ${correct} / ${total} (${pct(correct, total)}점)`;
    $("#exam-grade").style.display = "none";
    $("#exam-reset").style.display = "inline-block";
    // 최고점 저장
    const prev = store.kichul[year];
    if (!prev || correct > prev.best) store.kichul[year] = { best: correct, total };
    save();
  }

  function esc(s) {
    return (s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  function bind() {
    renderHome();
    $("#exam-back").onclick = () => {
      $("#kichul-exam").style.display = "none";
      $("#kichul-home").style.display = "block";
      renderHome();
      window.scrollTo(0, 0);
    };
    $("#exam-grade").onclick = grade;
    $("#exam-reset").onclick = () => openYear(year);
  }
  return { bind };
})();

/* =========================================================================
   초기화
   ========================================================================= */
$("#btn-reset").onclick = () => {
  if (confirm("모든 학습 기록(외운 단어·정답률·복습 목록)을 초기화할까요?")) {
    localStorage.removeItem(STORE_KEY);
    location.reload();
  }
};

renderStats();
Kichul.bind();
Vocab.bind();
Grammar.bind();
Reading.bind();
