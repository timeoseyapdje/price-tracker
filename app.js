(() => {
  "use strict";

  const STORAGE_KEY = "toeicMasterHistory";
  const MAX_HISTORY = 100;

  // ---------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function formatTime(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
    } catch (e) {
      /* localStorage unavailable — history simply won't persist */
    }
  }

  // ---------------------------------------------------------------
  // Question pool: random draw with no immediate repetition
  // ---------------------------------------------------------------

  class QuestionPool {
    constructor(questions) {
      this.all = questions;
      this.pool = [];
      this.idx = 0;
      this.lastId = null;
      this._reset();
    }

    _reset() {
      let pool = shuffle(this.all);
      if (this.lastId && pool.length > 1 && pool[0].id === this.lastId) {
        [pool[0], pool[1]] = [pool[1], pool[0]];
      }
      this.pool = pool;
      this.idx = 0;
    }

    next() {
      if (this.pool.length === 0) return null;
      if (this.idx >= this.pool.length) this._reset();
      const q = this.pool[this.idx++];
      this.lastId = q.id;
      return q;
    }
  }

  // ---------------------------------------------------------------
  // DOM references
  // ---------------------------------------------------------------

  const screens = {
    setup: document.getElementById("screen-setup"),
    quiz: document.getElementById("screen-quiz"),
    results: document.getElementById("screen-results"),
    history: document.getElementById("screen-history"),
  };

  const navSetupBtn = document.getElementById("nav-setup");
  const navHistoryBtn = document.getElementById("nav-history");

  const categoryOptionsEl = document.getElementById("category-options");
  const selectAllCategoriesBtn = document.getElementById("select-all-categories");
  const selectNoneCategoriesBtn = document.getElementById("select-none-categories");
  const startSessionBtn = document.getElementById("start-session-btn");
  const setupErrorEl = document.getElementById("setup-error");
  const weakShortcutBox = document.getElementById("weak-shortcut");
  const weakShortcutList = document.getElementById("weak-shortcut-list");
  const weakShortcutBtn = document.getElementById("weak-shortcut-btn");

  const globalTimerEl = document.getElementById("global-timer");
  const globalProgressBar = document.getElementById("global-progress-bar");
  const perqTimerBlock = document.getElementById("perq-timer-block");
  const perqTimerEl = document.getElementById("perq-timer");
  const runningScoreEl = document.getElementById("running-score");
  const partBadge = document.getElementById("part-badge");
  const categoryBadge = document.getElementById("category-badge");
  const passageBox = document.getElementById("passage-box");
  const questionPrompt = document.getElementById("question-prompt");
  const choicesList = document.getElementById("choices-list");
  const feedbackBox = document.getElementById("feedback-box");
  const feedbackTitle = document.getElementById("feedback-title");
  const feedbackExplanation = document.getElementById("feedback-explanation");
  const nextQuestionBtn = document.getElementById("next-question-btn");
  const endSessionBtn = document.getElementById("end-session-btn");

  const resultScoreEl = document.getElementById("result-score");
  const resultFractionEl = document.getElementById("result-fraction");
  const resultAvgTimeEl = document.getElementById("result-avg-time");
  const categoryBreakdownEl = document.getElementById("category-breakdown");
  const weakCategoriesBox = document.getElementById("weak-categories-box");
  const weakCategoriesList = document.getElementById("weak-categories-list");
  const retryWeakBtn = document.getElementById("retry-weak-btn");
  const newSessionBtn = document.getElementById("new-session-btn");
  const viewHistoryBtn = document.getElementById("view-history-btn");

  const historyListEl = document.getElementById("history-list");
  const historyEmptyEl = document.getElementById("history-empty");
  const clearHistoryBtn = document.getElementById("clear-history-btn");
  const backToSetupBtn = document.getElementById("back-to-setup-btn");

  // ---------------------------------------------------------------
  // Setup screen: build category checkboxes
  // ---------------------------------------------------------------

  const allCategoryKeys = Object.keys(CATEGORY_LABELS);

  function buildCategoryCheckboxes() {
    categoryOptionsEl.innerHTML = "";
    allCategoryKeys.forEach((key) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "category";
      input.value = key;
      input.checked = true;
      label.appendChild(input);
      label.appendChild(document.createTextNode(CATEGORY_LABELS[key]));
      categoryOptionsEl.appendChild(label);
    });
  }
  buildCategoryCheckboxes();

  selectAllCategoriesBtn.addEventListener("click", () => {
    categoryOptionsEl.querySelectorAll("input[type=checkbox]").forEach((cb) => (cb.checked = true));
  });
  selectNoneCategoriesBtn.addEventListener("click", () => {
    categoryOptionsEl.querySelectorAll("input[type=checkbox]").forEach((cb) => (cb.checked = false));
  });

  function setCategoryCheckboxes(keys) {
    const set = new Set(keys);
    categoryOptionsEl.querySelectorAll("input[type=checkbox]").forEach((cb) => {
      cb.checked = set.has(cb.value);
    });
  }

  // ---------------------------------------------------------------
  // Weak-category shortcut on setup screen (aggregated across history)
  // ---------------------------------------------------------------

  function computeGlobalWeakCategories() {
    const history = loadHistory();
    const agg = {};
    history.forEach((session) => {
      Object.entries(session.categoryStats || {}).forEach(([cat, stat]) => {
        if (!agg[cat]) agg[cat] = { correct: 0, total: 0 };
        agg[cat].correct += stat.correct;
        agg[cat].total += stat.total;
      });
    });
    const rows = Object.entries(agg)
      .map(([cat, stat]) => ({ cat, pct: stat.total ? (stat.correct / stat.total) * 100 : 0, total: stat.total }))
      .filter((r) => r.total >= 2)
      .sort((a, b) => a.pct - b.pct);
    return rows.slice(0, 3).filter((r) => r.pct < 90).map((r) => r.cat);
  }

  function refreshWeakShortcut() {
    const weak = computeGlobalWeakCategories();
    if (weak.length === 0) {
      weakShortcutBox.classList.add("hidden");
      return;
    }
    weakShortcutBox.classList.remove("hidden");
    weakShortcutList.textContent = weak.map((c) => CATEGORY_LABELS[c]).join(", ");
    weakShortcutBtn.onclick = () => {
      setCategoryCheckboxes(weak);
      startSessionBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    };
  }

  // ---------------------------------------------------------------
  // Screen navigation
  // ---------------------------------------------------------------

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      el.classList.toggle("hidden", key !== name);
    });
    navSetupBtn.classList.toggle("active", name === "setup");
    navHistoryBtn.classList.toggle("active", name === "history");
    if (name === "history") renderHistory();
    if (name === "setup") refreshWeakShortcut();
  }

  navSetupBtn.addEventListener("click", () => {
    stopQuizTimers();
    showScreen("setup");
  });
  navHistoryBtn.addEventListener("click", () => {
    stopQuizTimers();
    showScreen("history");
  });
  backToSetupBtn.addEventListener("click", () => showScreen("setup"));

  // ---------------------------------------------------------------
  // Session state
  // ---------------------------------------------------------------

  let session = null;
  let globalIntervalId = null;
  let perqIntervalId = null;

  function stopQuizTimers() {
    if (globalIntervalId) clearInterval(globalIntervalId);
    if (perqIntervalId) clearInterval(perqIntervalId);
    globalIntervalId = null;
    perqIntervalId = null;
  }

  function readSetupConfig() {
    const duration = Number(document.querySelector('input[name="duration"]:checked').value);
    const perQ = Number(document.querySelector('input[name="perq"]:checked').value);
    const parts = Array.from(document.querySelectorAll('input[name="part"]:checked')).map((cb) => Number(cb.value));
    const categories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map((cb) => cb.value);
    return { durationMin: duration, perQSec: perQ, parts, categories };
  }

  function buildFilteredQuestions(config) {
    return QUESTIONS.filter((q) => config.parts.includes(q.part) && config.categories.includes(q.category));
  }

  startSessionBtn.addEventListener("click", () => {
    const config = readSetupConfig();
    if (config.parts.length === 0) {
      setupErrorEl.textContent = "Sélectionne au moins une partie (Part 5, 6 ou 7).";
      setupErrorEl.classList.remove("hidden");
      return;
    }
    if (config.categories.length === 0) {
      setupErrorEl.textContent = "Sélectionne au moins une catégorie.";
      setupErrorEl.classList.remove("hidden");
      return;
    }
    const filtered = buildFilteredQuestions(config);
    if (filtered.length === 0) {
      setupErrorEl.textContent = "Aucune question ne correspond à cette combinaison de filtres.";
      setupErrorEl.classList.remove("hidden");
      return;
    }
    setupErrorEl.classList.add("hidden");
    startSession(config, filtered);
  });

  function startSession(config, filteredQuestions) {
    session = {
      config,
      pool: new QuestionPool(filteredQuestions),
      currentQuestion: null,
      questionStartTime: null,
      answered: 0,
      correct: 0,
      totalTimeMs: 0,
      categoryStats: {}, // cat -> {correct, total}
      remainingGlobalSec: config.durationMin * 60,
      remainingPerqSec: config.perQSec,
      answeredCurrent: false,
      ended: false,
    };

    perqTimerBlock.classList.toggle("hidden", config.perQSec === 0);

    showScreen("quiz");
    updateGlobalTimerDisplay();
    updateRunningScore();

    globalIntervalId = setInterval(() => {
      session.remainingGlobalSec -= 1;
      updateGlobalTimerDisplay();
      if (session.remainingGlobalSec <= 0) {
        endSession();
      }
    }, 1000);

    loadNextQuestion();
  }

  function updateGlobalTimerDisplay() {
    globalTimerEl.textContent = formatTime(session.remainingGlobalSec);
    const totalSec = session.config.durationMin * 60;
    const pct = Math.max(0, (session.remainingGlobalSec / totalSec) * 100);
    globalProgressBar.style.width = pct + "%";
    globalTimerEl.style.color = session.remainingGlobalSec <= 30 ? "var(--color-danger)" : "";
  }

  function updateRunningScore() {
    runningScoreEl.textContent = `${session.correct} / ${session.answered}`;
  }

  function loadNextQuestion() {
    if (perqIntervalId) clearInterval(perqIntervalId);
    const q = session.pool.next();
    session.currentQuestion = q;
    session.questionStartTime = Date.now();
    session.answeredCurrent = false;
    session.remainingPerqSec = session.config.perQSec;

    partBadge.textContent = `Part ${q.part}`;
    categoryBadge.textContent = CATEGORY_LABELS[q.category] || q.category;

    if (q.passage) {
      passageBox.textContent = q.passage;
      passageBox.classList.remove("hidden");
    } else {
      passageBox.classList.add("hidden");
      passageBox.textContent = "";
    }

    questionPrompt.textContent = q.prompt;

    choicesList.innerHTML = "";
    const letters = ["A", "B", "C", "D"];
    q.choices.forEach((choiceText, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.innerHTML = `<span class="choice-letter">${letters[i]}</span><span>${escapeHtml(choiceText)}</span>`;
      btn.addEventListener("click", () => handleAnswer(i));
      choicesList.appendChild(btn);
    });

    feedbackBox.classList.add("hidden");

    if (session.config.perQSec > 0) {
      perqTimerEl.textContent = String(session.remainingPerqSec);
      perqIntervalId = setInterval(() => {
        session.remainingPerqSec -= 1;
        perqTimerEl.textContent = String(Math.max(0, session.remainingPerqSec));
        if (session.remainingPerqSec <= 0) {
          clearInterval(perqIntervalId);
          if (!session.answeredCurrent) handleAnswer(null); // timeout
        }
      }, 1000);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function handleAnswer(choiceIndex) {
    if (session.answeredCurrent || session.ended) return;
    session.answeredCurrent = true;
    if (perqIntervalId) clearInterval(perqIntervalId);

    const q = session.currentQuestion;
    const isCorrect = choiceIndex === q.answer;
    const timeMs = Date.now() - session.questionStartTime;

    session.answered += 1;
    if (isCorrect) session.correct += 1;
    session.totalTimeMs += timeMs;

    if (!session.categoryStats[q.category]) session.categoryStats[q.category] = { correct: 0, total: 0 };
    session.categoryStats[q.category].total += 1;
    if (isCorrect) session.categoryStats[q.category].correct += 1;

    updateRunningScore();

    const buttons = choicesList.querySelectorAll(".choice-btn");
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add("correct");
      else if (i === choiceIndex) btn.classList.add("incorrect");
    });

    feedbackBox.classList.remove("hidden");
    if (choiceIndex === null) {
      feedbackTitle.textContent = "Temps écoulé";
      feedbackTitle.className = "feedback-title incorrect";
    } else if (isCorrect) {
      feedbackTitle.textContent = "Bonne réponse !";
      feedbackTitle.className = "feedback-title correct";
    } else {
      feedbackTitle.textContent = "Mauvaise réponse";
      feedbackTitle.className = "feedback-title incorrect";
    }
    feedbackExplanation.textContent = q.explanation;
  }

  nextQuestionBtn.addEventListener("click", () => {
    if (session.ended) return;
    loadNextQuestion();
  });

  endSessionBtn.addEventListener("click", () => {
    endSession();
  });

  function endSession() {
    if (!session || session.ended) return;
    session.ended = true;
    stopQuizTimers();
    const result = buildSessionResult(session);
    persistSession(result);
    renderResults(result);
    showScreen("results");
  }

  // ---------------------------------------------------------------
  // Results
  // ---------------------------------------------------------------

  function buildSessionResult(s) {
    const pct = s.answered ? Math.round((s.correct / s.answered) * 100) : 0;
    const avgTimeSec = s.answered ? s.totalTimeMs / s.answered / 1000 : 0;

    const categoryRows = Object.entries(s.categoryStats).map(([cat, stat]) => ({
      cat,
      correct: stat.correct,
      total: stat.total,
      pct: stat.total ? Math.round((stat.correct / stat.total) * 100) : 0,
    }));
    categoryRows.sort((a, b) => a.pct - b.pct);

    const weakCategories = categoryRows
      .filter((r) => r.total >= 1 && r.pct < 80)
      .slice(0, 3)
      .map((r) => r.cat);

    return {
      date: new Date().toISOString(),
      config: s.config,
      answered: s.answered,
      correct: s.correct,
      pct,
      avgTimeSec,
      categoryStats: s.categoryStats,
      categoryRows,
      weakCategories,
    };
  }

  function persistSession(result) {
    const history = loadHistory();
    history.push(result);
    saveHistory(history);
  }

  function renderResults(result) {
    resultScoreEl.textContent = `${result.pct}%`;
    resultFractionEl.textContent = `${result.correct}/${result.answered}`;
    resultAvgTimeEl.textContent = `${result.avgTimeSec.toFixed(1)}s`;

    categoryBreakdownEl.innerHTML = "";
    if (result.categoryRows.length === 0) {
      categoryBreakdownEl.innerHTML = "<p>Aucune question répondue.</p>";
    }
    result.categoryRows.forEach((row) => {
      const div = document.createElement("div");
      div.className = "category-row";
      const barClass = row.pct < 50 ? "low" : row.pct < 80 ? "mid" : "";
      div.innerHTML = `
        <div class="category-row-top">
          <span class="category-row-name">${CATEGORY_LABELS[row.cat] || row.cat}</span>
          <span>${row.correct}/${row.total} (${row.pct}%)</span>
        </div>
        <div class="category-bar-outer"><div class="category-bar-inner ${barClass}" style="width:${row.pct}%"></div></div>
      `;
      categoryBreakdownEl.appendChild(div);
    });

    if (result.weakCategories.length > 0) {
      weakCategoriesBox.classList.remove("hidden");
      weakCategoriesList.textContent = result.weakCategories.map((c) => CATEGORY_LABELS[c]).join(", ");
      retryWeakBtn.classList.remove("hidden");
      retryWeakBtn.onclick = () => {
        const config = { ...result.config, categories: result.weakCategories };
        const filtered = buildFilteredQuestions(config);
        if (filtered.length > 0) startSession(config, filtered);
      };
    } else {
      weakCategoriesBox.classList.add("hidden");
      retryWeakBtn.classList.add("hidden");
    }
  }

  newSessionBtn.addEventListener("click", () => showScreen("setup"));
  viewHistoryBtn.addEventListener("click", () => showScreen("history"));

  // ---------------------------------------------------------------
  // History screen
  // ---------------------------------------------------------------

  function renderHistory() {
    const history = loadHistory().slice().reverse();
    historyListEl.innerHTML = "";
    historyEmptyEl.classList.toggle("hidden", history.length > 0);

    history.forEach((session) => {
      const div = document.createElement("div");
      div.className = "history-item";
      const date = new Date(session.date);
      const dateStr = date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const weakText =
        session.weakCategories && session.weakCategories.length > 0
          ? `Points faibles : ${session.weakCategories.map((c) => CATEGORY_LABELS[c] || c).join(", ")}`
          : "Aucune catégorie faible identifiée";

      div.innerHTML = `
        <div class="history-item-top">
          <span>${dateStr}</span>
          <span>${session.pct}% (${session.correct}/${session.answered})</span>
        </div>
        <div class="history-item-meta">
          Session de ${session.config.durationMin} min · timer/question : ${
        session.config.perQSec > 0 ? session.config.perQSec + "s" : "désactivé"
      } · temps moyen ${session.avgTimeSec.toFixed(1)}s
        </div>
        <div class="history-item-weak">${weakText}</div>
      `;
      historyListEl.appendChild(div);
    });
  }

  clearHistoryBtn.addEventListener("click", () => {
    if (confirm("Effacer tout l'historique des sessions ? Cette action est irréversible.")) {
      saveHistory([]);
      renderHistory();
    }
  });

  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------

  refreshWeakShortcut();
  showScreen("setup");
})();
