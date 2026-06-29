/* =========================================================================
   9급 공무원 영어 — 기출 기반 학습 앱
   기출(연도별) · 어휘 · 어법 · 독해 (유형별 기출 + 해설)
   진행상황은 localStorage에 저장됩니다.
   ========================================================================= */

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const CIRC = ["①", "②", "③", "④"];

/* --------------------- 저장소 --------------------- */
const STORE_KEY = "gong9_eng_v2";
const store = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
const defaults = { solved: 0, correct: 0, knownWords: [], kichul: {}, dayN: 36, lastDay: 0, srs: {} };
for (const k in defaults) if (!(k in store)) store[k] = defaults[k];
// 기존 '외운 단어'(knownWords) -> SRS 1회 이관
if (Object.keys(store.srs).length === 0 && store.knownWords.length) {
  const now = Date.now();
  store.knownWords.forEach((w) => { store.srs[w] = { box: 2, due: now + 2 * 864e5, last: now }; });
}
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
const esc = (s) => (s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

/* --------------------- 발음(음성합성) --------------------- */
const TTS = ("speechSynthesis" in window);
let _voices = [];
function loadVoices() { if (TTS) _voices = speechSynthesis.getVoices(); }
if (TTS) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function speak(text) {
  if (!TTS || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US"; u.rate = 0.9;
  const v = _voices.find((x) => /en[-_]US/i.test(x.lang)) || _voices.find((x) => /^en/i.test(x.lang));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

const TYPE_LABEL = {
  어휘: "어휘", 어법: "어법", 생활영어: "생활영어",
  독해대의: "독해·대의", 독해빈칸: "독해·빈칸", 독해논리: "독해·논리", 독해일치: "독해·일치",
};

/* --------------------- 단어 풀 + 간격 반복(SRS) --------------------- */
const DAY_MS = 864e5;
const CAT_LABEL = { 기출: "기출", 빈출: "빈출 핵심", 실용중급: "실용·중급", 생활영어: "생활영어" };
const SRS_INTERVAL = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 }; // box별 복습 간격(일)

function deckItems() {
  const a = KICHUL_VOCAB.map((v) => ({ word: v.word, meaning: v.meaning, cat: "기출", sub: `${v.year}년 기출`, ex: "" }));
  const b = VOCAB2025.map((v) => ({ word: v.word, meaning: v.meaning, cat: v.cat, sub: CAT_LABEL[v.cat] || v.cat, ex: v.ex || "" }));
  return a.concat(b);
}
function isLearned(w) { const s = store.srs[w]; return !!s && s.box >= 1; }
function markWord(w, ok) {
  const now = Date.now();
  const s = store.srs[w] || { box: 0, due: 0 };
  if (ok) s.box = (s.box || 0) === 0 ? 1 : Math.min(s.box + 1, 5);
  else s.box = 0;
  s.due = now + (ok ? SRS_INTERVAL[s.box] : 0) * DAY_MS;
  s.last = now;
  store.srs[w] = s; save();
}
function dueItems() {
  const now = Date.now();
  return deckItems().filter((it) => { const s = store.srs[it.word]; return s && s.due <= now; });
}

/* 전 연도 문항 풀 (year 부착) */
function allQuestions() {
  const out = [];
  for (const y in KICHUL) KICHUL[y].forEach((q) => out.push({ ...q, year: y }));
  return out;
}
function byType(types) { return allQuestions().filter((q) => types.includes(q.type)); }

/* --------------------- 상단 통계 --------------------- */
const TOTAL_VOCAB = (typeof KICHUL_VOCAB !== "undefined" ? KICHUL_VOCAB.length : 0) +
                    (typeof VOCAB2025 !== "undefined" ? VOCAB2025.length : 0);
function renderStats() {
  const learned = deckItems().filter((it) => isLearned(it.word)).length;
  $("#stat-words").textContent = `${learned} / ${TOTAL_VOCAB}`;
  const due = dueItems().length;
  const rev = $("#stat-review"); if (rev) rev.textContent = due;
  $("#stat-solved").textContent = store.solved;
  $("#stat-acc").textContent = pct(store.correct, store.solved) + "%";
}

/* --------------------- 탭 전환 --------------------- */
$$(".tab").forEach((t) => {
  t.addEventListener("click", () => {
    $$(".tab").forEach((x) => x.classList.remove("active"));
    $$(".panel").forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    $("#panel-" + t.dataset.tab).classList.add("active");
    window.scrollTo(0, 0);
  });
});

/* =========================================================================
   공통: 문제풀이 세션 (카드 렌더 + 채점 + 해설)
   refs: { qEl, gradeBtn, scoreEl, resetBtn?, progEl? }
   ========================================================================= */
function Session(refs) {
  let questions = [], answers = {}, graded = false, onGraded = null;

  function load(qs, opts = {}) {
    questions = qs; answers = {}; graded = false; onGraded = opts.onGraded || null;
    render(opts);
    if (refs.gradeBtn) refs.gradeBtn.style.display = "inline-block";
    if (refs.resetBtn) refs.resetBtn.style.display = "none";
    if (refs.scoreEl) refs.scoreEl.textContent = "";
    updateProg();
  }

  function render(opts) {
    refs.qEl.innerHTML = "";
    questions.forEach((q, qi) => {
      const card = document.createElement("div");
      card.className = "exam-q";
      const yb = opts.showYear ? `<span class="yr-badge">${q.year}</span>` : "";
      const tb = opts.showType ? `<span class="type-badge">${TYPE_LABEL[q.type] || "독해"}</span>` : "";
      card.innerHTML =
        `<div class="q-head"><span class="qno">문 ${q.no}</span>${yb}${tb}</div>` +
        `<div class="qbody">${esc(q.body)}</div>`;
      const ob = document.createElement("div");
      ob.className = "options";
      for (let i = 0; i < 4; i++) {
        const b = document.createElement("button");
        b.className = "option"; b.dataset.qi = qi; b.dataset.i = i;
        const label = q.options ? esc(q.options[i]) : "";
        b.innerHTML = `<span class="num">${CIRC[i]}</span>` + (label ? `<span>${label}</span>` : "");
        b.onclick = () => pick(qi, i);
        ob.appendChild(b);
      }
      card.appendChild(ob);
      const exp = document.createElement("div");
      exp.className = "explain"; exp.dataset.exp = qi;
      exp.innerHTML = `<span class="label">해설</span> ${esc(q.exp || "해설이 없습니다.")}`;
      card.appendChild(exp);
      refs.qEl.appendChild(card);
    });
  }

  function pick(qi, i) {
    if (graded) return;
    answers[qi] = i;
    $$(`.option[data-qi="${qi}"]`, refs.qEl).forEach((b) =>
      b.classList.toggle("sel-opt", +b.dataset.i === i));
    updateProg();
  }

  function updateProg() {
    if (refs.progEl) refs.progEl.textContent = `${Object.keys(answers).length} / ${questions.length} 응답`;
  }

  function grade() {
    if (graded || !questions.length) return;
    graded = true;
    let correct = 0;
    const cards = $$(".exam-q", refs.qEl);
    questions.forEach((q, qi) => {
      const chosen = answers[qi];
      const card = cards[qi];
      $$(".option", card).forEach((b) => {
        b.disabled = true;
        const i = +b.dataset.i;
        if (i === q.answer) b.classList.add("correct");
        else if (i === chosen) b.classList.add("wrong");
      });
      const ok = chosen === q.answer;
      if (ok) correct++;
      card.classList.add(ok ? "correct-q" : "wrong-q");
      const badge = document.createElement("span");
      badge.className = "badge " + (ok ? "ok" : "no");
      badge.textContent = ok ? "정답" : (chosen == null ? "미응답" : "오답");
      card.querySelector(".qno").after(badge);
      card.querySelector(`.explain[data-exp="${qi}"]`).classList.add("show");
    });
    const total = questions.length;
    if (refs.scoreEl) refs.scoreEl.textContent = `${correct} / ${total} (${pct(correct, total)}점)`;
    if (refs.gradeBtn) refs.gradeBtn.style.display = "none";
    if (refs.resetBtn) refs.resetBtn.style.display = "inline-block";
    store.solved += total; store.correct += correct; save();
    if (onGraded) onGraded(correct, total);
    return correct;
  }

  return { load, grade, isGraded: () => graded };
}

/* =========================================================================
   1) 기출문제 (연도별)
   ========================================================================= */
const Kichul = (() => {
  let year = null;
  const sess = Session({
    qEl: $("#exam-questions"), gradeBtn: $("#exam-grade"),
    resetBtn: $("#exam-reset"), scoreEl: $("#exam-score"), progEl: $("#exam-progress"),
  });

  function renderHome() {
    const grid = $("#year-grid");
    grid.innerHTML = "";
    Object.keys(KICHUL).sort().forEach((y) => {
      const rec = store.kichul[y];
      const best = rec ? `최고 ${rec.best}/${rec.total}` : "미응시";
      const card = document.createElement("div");
      card.className = "year-card";
      card.innerHTML = `<div class="yr">${y}</div><div class="label">국가직 9급</div>` +
        `<div class="best ${rec ? "" : "empty"}">${best}</div>`;
      card.onclick = () => openYear(y);
      grid.appendChild(card);
    });
  }

  function openYear(y) {
    year = y;
    $("#kichul-home").style.display = "none";
    $("#kichul-exam").style.display = "block";
    $("#exam-title").textContent = `${y}년 국가직 9급 영어 (20문항)`;
    sess.load(KICHUL[y].map((q) => ({ ...q, year: y })), {
      showType: true,
      onGraded: (correct, total) => {
        const prev = store.kichul[y];
        if (!prev || correct > prev.best) { store.kichul[y] = { best: correct, total }; save(); }
      },
    });
    window.scrollTo(0, 0);
  }

  function bind() {
    renderHome();
    $("#exam-back").onclick = () => {
      $("#kichul-exam").style.display = "none";
      $("#kichul-home").style.display = "block";
      renderHome(); window.scrollTo(0, 0);
    };
    $("#exam-grade").onclick = () => sess.grade();
    $("#exam-reset").onclick = () => openYear(year);
  }
  return { bind };
})();

/* =========================================================================
   2) 어휘 (기출 단어덱 + 어휘 기출문제)
   ========================================================================= */
const Vocab = (() => {
  /* 단어덱 — Day 단위 학습 (하루 N개) */
  let pool = [], filter = "all", curDay = 0, dayOrder = [], idx = 0;

  function buildPool() {
    let all = deckItems();            // 공통 풀(기출+추가어휘)
    if (filter !== "all") all = all.filter((x) => x.cat === filter);
    pool = all;                       // 안정적 순서 유지 (Day 경계 고정)
  }
  const dayN = () => store.dayN || 36;
  const dayCount = () => Math.max(1, Math.ceil(pool.length / dayN()));
  const daySlice = (k) => pool.slice(k * dayN(), (k + 1) * dayN());
  const knownIn = (slice) => slice.filter((w) => isLearned(w.word)).length;

  function initDeck() { buildPool(); renderDays(); }

  function renderDays() {
    $("#deck-study").style.display = "none";
    $("#deck-days").style.display = "block";
    const known = pool.filter((w) => isLearned(w.word)).length;
    $("#deck-overall").innerHTML =
      `이 묶음 <b>${pool.length}</b>개 중 <b style="color:var(--good)">${known}</b>개 외움 · 하루 ${dayN()}개 기준 총 <b>${dayCount()}</b>일`;
    const grid = $("#day-grid");
    grid.innerHTML = "";
    for (let k = 0; k < dayCount(); k++) {
      const slice = daySlice(k);
      const kn = knownIn(slice);
      const st = kn === 0 ? "todo" : (kn >= slice.length ? "done" : "prog");
      const from = k * dayN() + 1, to = k * dayN() + slice.length;
      const card = document.createElement("div");
      card.className = "day-card " + st;
      card.innerHTML =
        `<div class="d-no">Day ${k + 1}</div>` +
        `<div class="d-range">${from}–${to}번</div>` +
        `<div class="d-prog">${kn} / ${slice.length}${st === "done" ? " ✓" : ""}</div>` +
        `<div class="d-bar"><div style="width:${pct(kn, slice.length)}%"></div></div>`;
      card.onclick = () => openDay(k);
      grid.appendChild(card);
    }
  }

  function openDay(k) {
    curDay = k; store.lastDay = k; save();
    dayOrder = daySlice(k).map((_, i) => i);   // 번호 순
    idx = 0;
    $("#deck-days").style.display = "none";
    $("#deck-study").style.display = "block";
    renderFlash(); window.scrollTo(0, 0);
  }

  function renderFlash() {
    const slice = daySlice(curDay);
    const v = slice[dayOrder[idx]];
    $("#flash").classList.remove("flipped");
    const s = store.srs[v.word];
    const mark = s && s.box >= 1 ? ` ✓` : (s && s.box === 0 ? ` 😵` : "");
    const spk = (id) => TTS ? `<button class="speak-btn" id="${id}" title="발음 듣기">🔊</button>` : "";
    $("#flash-front").innerHTML =
      `<div class="w">${esc(v.word)} ${spk("speak-word")}</div>` +
      `<div class="pos">${esc(v.sub)}${mark}</div><div class="hint">카드를 눌러 뜻 보기</div>`;
    const exLine = v.ex ? `<div class="ex">${esc(v.ex)}</div>` : "";
    $("#flash-back").innerHTML =
      `<div class="m">${esc(v.meaning || "")}</div>` + exLine +
      `<div class="ex" style="color:var(--muted);margin-top:10px">${esc(v.word)} ${spk("speak-word2")} · ${esc(v.sub)}</div>`;
    $("#flash-counter").textContent = `${idx + 1} / ${slice.length}`;
    $("#day-head").textContent = `Day ${curDay + 1} · 외움 ${knownIn(slice)}/${slice.length}`;
    $("#btn-known").textContent = s && s.box >= 1 ? "✓ 외움" : "✓ 외웠어요";
    if (TTS) {
      const onSpk = (e) => { e.stopPropagation(); speak(v.word); };
      $("#speak-word").onclick = onSpk;
      const b2 = $("#speak-word2"); if (b2) b2.onclick = onSpk;
    }
  }

  function nav(d) { const n = daySlice(curDay).length; idx = (idx + d + n) % n; renderFlash(); }
  function gotoDay(d) { const k = curDay + d; if (k >= 0 && k < dayCount()) openDay(k); }
  function shuffleDay() { dayOrder = shuffle(dayOrder); idx = 0; renderFlash(); }
  function markCurrent(ok) {
    const slice = daySlice(curDay);
    markWord(slice[dayOrder[idx]].word, ok);   // SRS 반영
    if (idx < slice.length - 1) { idx++; renderFlash(); }   // 다음 카드로
    else renderFlash();                                     // 마지막이면 상태만 갱신
  }
  function setFilter(cat) {
    filter = cat;
    $$("#deck-filter .chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === cat));
    initDeck();
  }
  function setDayN(n) {
    store.dayN = n; save();
    $$("#dayN-chips .chip").forEach((c) => c.classList.toggle("active", +c.dataset.n === n));
    renderDays();
  }
  function resume() {
    buildPool();
    let t = -1;
    for (let k = 0; k < dayCount(); k++) { const s = daySlice(k); if (knownIn(s) < s.length) { t = k; break; } }
    if (t < 0) t = dayCount() - 1;
    openDay(t);
  }

  /* 어휘 기출문제 */
  const sess = Session({ qEl: $("#vq"), gradeBtn: $("#v-grade"), scoreEl: $("#v-score") });
  function loadQuiz() {
    sess.load(shuffle(byType(["어휘"])).slice(0, 10), { showYear: true });
    window.scrollTo(0, 0);
  }

  function setMode(m) {
    $$("#panel-vocab .subtab").forEach((s) => s.classList.toggle("active", s.dataset.v === m));
    $("#v-deck").style.display = m === "deck" ? "block" : "none";
    $("#v-review").style.display = m === "review" ? "block" : "none";
    $("#v-quiz").style.display = m === "quiz" ? "block" : "none";
    if (m === "deck") initDeck();
    else if (m === "review") Review.open();
    else loadQuiz();
  }

  function bind() {
    $("#flash").onclick = () => $("#flash").classList.toggle("flipped");
    $("#btn-next").onclick = () => nav(1);
    $("#btn-prev").onclick = () => nav(-1);
    $("#btn-known").onclick = () => markCurrent(true);
    $("#btn-forgot").onclick = () => markCurrent(false);
    $("#btn-shuffle").onclick = shuffleDay;
    $("#btn-day-next").onclick = () => gotoDay(1);
    $("#btn-day-prev").onclick = () => gotoDay(-1);
    $("#day-back").onclick = renderDays;
    $("#deck-resume").onclick = resume;
    $$("#deck-filter .chip").forEach((c) => (c.onclick = () => setFilter(c.dataset.cat)));
    $$("#dayN-chips .chip").forEach((c) => (c.onclick = () => setDayN(+c.dataset.n)));
    $$("#dayN-chips .chip").forEach((c) => c.classList.toggle("active", +c.dataset.n === dayN()));
    $("#v-grade").onclick = () => sess.grade();
    $("#v-reshuffle").onclick = loadQuiz;
    $$("#panel-vocab .subtab").forEach((s) => (s.onclick = () => setMode(s.dataset.v)));
    setMode("deck");
  }
  return { bind };
})();

/* =========================================================================
   2-R) 복습 (간격 반복 SRS)
   ========================================================================= */
const Review = (() => {
  let queue = [], idx = 0;

  function show(which) {
    $("#rev-empty").style.display = which === "empty" ? "block" : "none";
    $("#rev-study").style.display = which === "study" ? "block" : "none";
    $("#rev-done").style.display = which === "done" ? "block" : "none";
  }

  function open() {
    queue = dueItems(); idx = 0;
    if (!queue.length) { show("empty"); return; }
    show("study"); render(); window.scrollTo(0, 0);
  }

  function render() {
    const v = queue[idx];
    $("#rev-flash").classList.remove("flipped");
    const spk = (id) => TTS ? `<button class="speak-btn" id="${id}" title="발음 듣기">🔊</button>` : "";
    $("#rev-front").innerHTML =
      `<div class="w">${esc(v.word)} ${spk("rev-spk")}</div>` +
      `<div class="pos">${esc(v.sub)}</div><div class="hint">카드를 눌러 뜻 보기</div>`;
    const exLine = v.ex ? `<div class="ex">${esc(v.ex)}</div>` : "";
    $("#rev-back").innerHTML =
      `<div class="m">${esc(v.meaning || "")}</div>` + exLine +
      `<div class="ex" style="color:var(--muted);margin-top:10px">${esc(v.word)} ${spk("rev-spk2")} · ${esc(v.sub)}</div>`;
    $("#rev-count").textContent = `${idx + 1} / ${queue.length}`;
    if (TTS) {
      const f = (e) => { e.stopPropagation(); speak(v.word); };
      $("#rev-spk").onclick = f; const b2 = $("#rev-spk2"); if (b2) b2.onclick = f;
    }
  }

  function mark(ok) {
    if (!queue.length) return;
    markWord(queue[idx].word, ok);
    idx++;
    if (idx >= queue.length) show("done");
    else render();
  }

  function bind() {
    $("#rev-flash").onclick = () => $("#rev-flash").classList.toggle("flipped");
    $("#rev-ok").onclick = () => mark(true);
    $("#rev-forgot").onclick = () => mark(false);
  }
  return { open, bind };
})();

/* =========================================================================
   3) 어법 (어법 기출문제 + 문법 개념)
   ========================================================================= */
const Grammar = (() => {
  const sess = Session({ qEl: $("#gq"), gradeBtn: $("#g-grade"), scoreEl: $("#g-score") });
  function loadQuiz() {
    sess.load(shuffle(byType(["어법"])).slice(0, 10), { showYear: true });
    window.scrollTo(0, 0);
  }
  function renderPoints() {
    $("#grammar-points").innerHTML = GRAMMAR.points.map((p) =>
      `<details class="point"><summary>${p.title}</summary><div class="body">${p.body}</div></details>`).join("");
  }
  function setMode(m) {
    $$("#panel-grammar .subtab").forEach((s) => s.classList.toggle("active", s.dataset.g === m));
    $("#g-quiz").style.display = m === "quiz" ? "block" : "none";
    $("#g-study").style.display = m === "study" ? "block" : "none";
    if (m === "quiz") loadQuiz();
  }
  function bind() {
    renderPoints();
    $("#g-grade").onclick = () => sess.grade();
    $("#g-reshuffle").onclick = loadQuiz;
    $$("#panel-grammar .subtab").forEach((s) => (s.onclick = () => setMode(s.dataset.g)));
    setMode("quiz");
  }
  return { bind };
})();

/* =========================================================================
   4) 독해 (유형별 기출)
   ========================================================================= */
const Reading = (() => {
  const sess = Session({ qEl: $("#rq"), gradeBtn: $("#r-grade"), scoreEl: $("#r-score") });
  const LABELS = {
    독해대의: "글의 주제·제목·요지·목적 파악",
    독해빈칸: "빈칸에 들어갈 말 추론",
    독해논리: "문장 순서·삽입·흐름",
    독해일치: "내용 일치/불일치",
  };
  let cur = "독해대의";
  function loadType(t) {
    cur = t;
    $("#r-label").textContent = LABELS[t];
    sess.load(shuffle(byType([t])).slice(0, 5), { showYear: true });
    window.scrollTo(0, 0);
  }
  function bind() {
    $("#r-grade").onclick = () => sess.grade();
    $("#r-reshuffle").onclick = () => loadType(cur);
    $$("#r-subtabs .subtab").forEach((s) => (s.onclick = () => {
      $$("#r-subtabs .subtab").forEach((x) => x.classList.remove("active"));
      s.classList.add("active");
      loadType(s.dataset.r);
    }));
    loadType("독해대의");
  }
  return { bind };
})();

/* =========================================================================
   초기화
   ========================================================================= */
$("#btn-reset").onclick = () => {
  if (confirm("모든 학습 기록(외운 단어·정답률·기출 점수)을 초기화할까요?")) {
    localStorage.removeItem(STORE_KEY);
    location.reload();
  }
};

renderStats();
Kichul.bind();
Vocab.bind();
Review.bind();
Grammar.bind();
Reading.bind();
