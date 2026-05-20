// MistakeAnalyzer — synthesizes user's accumulated wrong/flagged questions
// into a knowledge-gap diagnosis and personalized study plan.

const { useState: useStateMA, useEffect: useEffectMA } = React;

const MA_SYSTEM = `你是一位精通台灣國營事業考試的資深補習班總導師。考生會給你他「常錯」或「曾經答錯」的題目清單（包含題幹、選項、正確答案、答錯次數、標籤、所屬科目）。你的任務是：

不要逐題解析，而是從整體分析這位考生「整體的知識結構與觀念缺口」，並提出可執行的學習策略。

請嚴格依下列四個段落輸出，每段使用全形方括號標題：

【知識盲點地圖】
（找出最薄弱的 2-4 個主題或概念群，每個用一句話描述弱在哪裡。可條列。）

【觀念混淆點】
（指出 2-3 個最常混淆的觀念對比，例如「速動比率 vs 流動比率」「短期停水扣減 vs 主管機關公告門檻」。每個用 1-2 句說明易混在哪。）

【建議學習順序】
（給一份 3-5 步驟的優先學習順序，從最該補強的開始。可條列、每點 1-2 句即可。）

【鼓勵與目標】
（一句鼓勵 + 一個具體可量化的本週目標，如「本週把水法第33條相關 5 題重做一輪」。）

全程繁體中文。語氣嚴謹、清晰、具鼓勵性。`;

function buildMistakeSummary(mistakes, subjects, max = 50) {
  const trimmed = mistakes.slice(0, max);
  const bySubject = {};
  trimmed.forEach(q => {
    const subj = subjects.find(s => s.id === q.subjectId);
    const name = subj?.name || "未分類";
    if (!bySubject[name]) bySubject[name] = [];
    bySubject[name].push(q);
  });

  const lines = [
    `這位考生累積了 ${mistakes.length} 題曾答錯或被標記為常錯的題目${mistakes.length > max ? `（以下節錄前 ${max} 題）` : ""}。`,
    "",
  ];

  Object.entries(bySubject).forEach(([subjName, qs]) => {
    lines.push(`### ${subjName}（${qs.length} 題）`);
    qs.forEach((q, i) => {
      const tags = (q.tags || []).join("、");
      const opts = q.options.map((o, j) => `(${"ABCD"[j]}) ${o}`).join(" / ");
      lines.push(
        `${i+1}. [${q.type === "multi" ? "複選" : "單選"}]${tags ? `〔${tags}〕` : ""} ${q.stem}`,
        `   選項：${opts}`,
        `   標準答案：${q.answer.join("、")}　錯過 ${q.wrongCount || 0}/${q.attempts || 0} 次${q.flagged ? "　★標記" : ""}`,
      );
    });
    lines.push("");
  });

  return lines.join("\n");
}

function parseDiagSections(text) {
  const want = ["知識盲點地圖", "觀念混淆點", "建議學習順序", "鼓勵與目標"];
  const re = /(?:^|\n)\s*[【\[]\s*([^】\]\n]+?)\s*[】\]]\s*(?:（[^）]*）|\([^)]*\))?\s*\n?/g;
  const matches = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    matches.push({ title: m[1].trim(), start: m.index, end: m.index + m[0].length });
  }
  if (matches.length === 0) return [{ title: "AI 建議", body: text.trim() }];
  return matches.map((cur, i) => {
    const next = matches[i+1];
    const body = text.slice(cur.end, next ? next.start : text.length).trim();
    const hit = want.find(w => cur.title.includes(w));
    return { title: hit || cur.title, body };
  });
}

const DIAG_THEMES = [
  { kicker: "弱點掃描", glyph: "🎯", colorVar: "var(--warn-ink)", bg: "linear-gradient(135deg, oklch(0.95 0.05 30), var(--surface))" },
  { kicker: "混淆對比", glyph: "⚖️", colorVar: "var(--violet-ink, oklch(0.4 0.18 295))", bg: "linear-gradient(135deg, oklch(0.95 0.05 295), var(--surface))" },
  { kicker: "學習路徑", glyph: "🗺️", colorVar: "var(--teal-ink, oklch(0.4 0.12 195))", bg: "linear-gradient(135deg, oklch(0.95 0.04 195), var(--surface))" },
  { kicker: "本週目標", glyph: "🌱", colorVar: "var(--ok-ink, oklch(0.4 0.14 140))", bg: "linear-gradient(135deg, oklch(0.95 0.05 140), var(--surface))" },
];

function MistakeAnalyzer({ mistakes, subjects }) {
  const [provider, setProvider] = useStateMA(() => localStorage.getItem("soe_diag_provider") || "claude");
  const [state, setState] = useStateMA("idle"); // idle | loading | done | error
  const [result, setResult] = useStateMA(null);
  const [error, setError] = useStateMA(null);
  const [expanded, setExpanded] = useStateMA(false);

  useEffectMA(() => {
    localStorage.setItem("soe_diag_provider", provider);
  }, [provider]);

  const run = async () => {
    if (mistakes.length === 0) return;
    setState("loading");
    setError(null);
    try {
      const userMsg = buildMistakeSummary(mistakes, subjects, 50);
      let reply;
      if (provider === "gemini") {
        if (!window.callGeminiRaw) throw new Error("Gemini 模組尚未載入");
        reply = await window.callGeminiRaw(MA_SYSTEM, userMsg);
      } else {
        if (!window.callClaudeRaw) throw new Error("Claude 模組尚未載入");
        reply = await window.callClaudeRaw(MA_SYSTEM, userMsg, 2000);
      }
      setResult({ sections: parseDiagSections(reply), raw: reply, at: new Date() });
      setState("done");
      setExpanded(true);
    } catch (e) {
      setError(e.message || String(e));
      setState("error");
    }
  };

  const copyAll = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.raw);
  };

  if (mistakes.length === 0) return null;

  return (
    <div className="diag">
      <div className="diag-card">
        <div className="diag-head">
          <div className="diag-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1M12 20v1M5.05 5.05l.707.707M18.243 18.243l.707.707M3 12h1M20 12h1M5.05 18.95l.707-.707M18.243 5.757l.707-.707"/><path d="M8.5 16a5 5 0 1 1 7 0"/></svg>
          </div>
          <div className="diag-text">
            <div className="diag-title">AI 學習診斷</div>
            <div className="diag-sub">
              {state === "done" && result ? `${result.at.toLocaleString("zh-TW", { month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit" })} · 分析了 ${Math.min(mistakes.length, 50)} 題` : `根據你的 ${mistakes.length} 題錯題，找出知識盲點 + 給你學習計畫`}
            </div>
          </div>
          <div className="diag-actions">
            {state === "done" && (
              <>
                <button className="btn-mini" onClick={copyAll} title="複製全文">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  複製
                </button>
                <button className="btn-mini" onClick={run}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.36L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.36L3 16"/><path d="M3 21v-5h5"/></svg>
                  重新分析
                </button>
              </>
            )}
          </div>
        </div>

        {state === "idle" && (
          <div className="diag-body">
            <div className="diag-row">
              <div className="diag-row-label">選擇 AI 老師</div>
              <div className="diag-providers">
                <button
                  className={`diag-prov ${provider === "claude" ? "active claude" : ""}`}
                  onClick={() => setProvider("claude")}
                >
                  <span className="diag-prov-dot claude"></span>
                  <div>
                    <div className="diag-prov-name">Claude 老師</div>
                    <div className="diag-prov-tag mono">claude-haiku-4-5</div>
                  </div>
                </button>
                <button
                  className={`diag-prov ${provider === "gemini" ? "active gemini" : ""}`}
                  onClick={() => setProvider("gemini")}
                >
                  <span className="diag-prov-dot gemini"></span>
                  <div>
                    <div className="diag-prov-name">Gemini 老師</div>
                    <div className="diag-prov-tag mono">gemini-3.5-flash · HIGH</div>
                  </div>
                </button>
              </div>
            </div>
            <button className="diag-cta" onClick={run}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3Z"/></svg>
              開始診斷我的弱點
              <span className="diag-cta-sub mono">{mistakes.length} 題</span>
            </button>
          </div>
        )}

        {state === "loading" && (
          <div className="diag-body diag-loading">
            <div className="diag-spinner"></div>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>{provider === "claude" ? "Claude" : "Gemini"} 老師正在整理你的錯題…</div>
              <div className="mono" style={{fontSize:11.5,color:"var(--ink-3)",marginTop:3}}>找盲點、組學習計畫，預計 10–25 秒</div>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="diag-body">
            <div className="ai-error" style={{margin:0}}>診斷失敗：{error}</div>
            <div style={{marginTop:10,display:"flex",gap:6}}>
              {/設定|api|key|尚未/i.test(error || "") && (
                <button className="btn-mini" onClick={() => provider === "claude" ? window.openClaudeSettings?.() : window.dispatchEvent(new CustomEvent("__goto_gemini"))}>
                  前往設定 {provider === "claude" ? "Claude" : "Gemini"} Key
                </button>
              )}
              <button className="btn-mini" onClick={run}>重試</button>
              <button className="btn-mini" onClick={() => setState("idle")}>取消</button>
            </div>
          </div>
        )}

        {state === "done" && result && (
          <div className="diag-body diag-result">
            <div className="diag-grid">
              {result.sections.map((sec, i) => {
                const theme = DIAG_THEMES[i] || DIAG_THEMES[0];
                return (
                  <div key={i} className="diag-section" style={{background: theme.bg}}>
                    <div className="diag-section-head">
                      <span className="diag-section-glyph">{theme.glyph}</span>
                      <div>
                        <div className="diag-section-kicker mono">{theme.kicker}</div>
                        <div className="diag-section-title">{sec.title}</div>
                      </div>
                    </div>
                    <div className="diag-section-body" dangerouslySetInnerHTML={{ __html: simpleMd(sec.body) }}/>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function escapeHtmlMA(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function simpleMd(text){
  if (!text) return '';
  const lines = text.split('\n');
  let html = '';
  let listType = null;
  const flush = () => { if (listType){ html += `</${listType}>`; listType = null; } };
  for (const raw of lines){
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()){ flush(); continue; }
    const ol = line.match(/^\s*(?:\(?\d+[\.\)）]|（\d+）)\s*(.+)$/);
    const ul = line.match(/^\s*[-*・•]\s+(.+)$/);
    let inner;
    if (ol){
      if (listType !== 'ol'){ flush(); html += '<ol>'; listType = 'ol'; }
      inner = ol[1];
    } else if (ul){
      if (listType !== 'ul'){ flush(); html += '<ul>'; listType = 'ul'; }
      inner = ul[1];
    } else {
      flush();
      inner = line;
    }
    let out = escapeHtmlMA(inner);
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
    if (ol || ul) html += `<li>${out}</li>`;
    else html += `<p>${out}</p>`;
  }
  flush();
  return html;
}

window.MistakeAnalyzer = MistakeAnalyzer;
