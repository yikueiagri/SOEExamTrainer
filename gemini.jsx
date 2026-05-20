// Gemini 老師 — full-page Gemini-based exam solver
// Uses gemini-3.5-flash via v1beta with thinkingLevel: HIGH
// Persists API key + last question in localStorage.

const { useState: useStateG, useEffect: useEffectG, useRef: useRefG } = React;

const GEMINI_STORE = "soe_gemini_v1";

const GEMINI_SYSTEM = (scope) => `你是一位精通國營事業考試（如台電、中油、台水、經濟部聯招）的補習班名師。${scope === "auto" ? "" : `此題屬於【${scope}】考試範疇。`}請嚴格依序回答四個段落，每段使用全形方括號標題：

【標準答案】
（直接給最終答案；選擇題寫選項與內容；計算題寫最終數值；簡答題寫關鍵句。）

【核心觀念】
（這題在測驗哪個觀念？用 2-4 句話講清楚。）

【深度解析】
（完整推導或解題步驟，使用條列或編號，必要時用 **粗體** 強調關鍵字。）

【觀念導正】
（考生最常見的盲點與錯誤想法，並提出記憶口訣或快速判斷法。）

語氣嚴謹、清晰、具鼓勵性，使用繁體中文。`;

// ---- helpers ----
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function inlineMd(s){
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  out = out.replace(/==([^=]+)==/g, '<mark>$1</mark>');
  return out;
}
function mdToHtml(text){
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
    if (ol){
      if (listType !== 'ol'){ flush(); html += '<ol>'; listType = 'ol'; }
      html += `<li>${inlineMd(ol[1])}</li>`;
    } else if (ul){
      if (listType !== 'ul'){ flush(); html += '<ul>'; listType = 'ul'; }
      html += `<li>${inlineMd(ul[1])}</li>`;
    } else {
      flush();
      html += `<p>${inlineMd(line)}</p>`;
    }
  }
  flush();
  return html;
}
function parseSections(raw){
  const re = /(?:^|\n)\s*[【\[]\s*([^】\]\n]+?)\s*[】\]]\s*(?:（[^）]*）|\([^)]*\))?\s*\n?/g;
  const matches = [];
  let m;
  while ((m = re.exec(raw)) !== null){
    matches.push({ title: m[1].trim(), start: m.index, end: m.index + m[0].length });
  }
  if (matches.length === 0) return [];
  const want = ['標準答案','核心觀念','深度解析','觀念導正'];
  return matches.map((cur, i) => {
    const next = matches[i+1];
    const body = raw.slice(cur.end, next ? next.start : raw.length).trim();
    const hit = want.find(w => cur.title.includes(w));
    return { title: hit || cur.title, body };
  });
}

const SEC_DEF = [
  { key:'標準答案', kicker:'STEP 01' },
  { key:'核心觀念', kicker:'STEP 02' },
  { key:'深度解析', kicker:'STEP 03' },
  { key:'觀念導正', kicker:'STEP 04' },
];

function formatQuestionForGemini(q, subjectName, picked){
  if (!q || !q.stem) return "";
  const opts = (q.options || []).map((o, i) => `(${"ABCD"[i]}) ${o}`).join("\n");
  const ansLine = q.answer && q.answer.length ? `\n（題庫標準答案：${q.answer.join("、")}）` : "";
  const userLine = picked && picked.length ? `\n（我的作答：${picked.join("、")}）` : "";
  return `科目：${subjectName}　題型：${q.type === "multi" ? "複選題" : "單選題"}

${q.stem}

${opts}${ansLine}${userLine}

請依四段式格式（標準答案／核心觀念／深度解析／觀念導正）解析這題。`;
}

// ============ Component ============
function GeminiTeacher({ subjects, pending, onConsumePending }){
  const [apiKey, setApiKey] = useStateG(() => localStorage.getItem(GEMINI_STORE + "_apiKey") || "");
  const [keyDraft, setKeyDraft] = useStateG(apiKey);
  const [keyEditing, setKeyEditing] = useStateG(!apiKey);
  const [question, setQuestion] = useStateG(() => localStorage.getItem(GEMINI_STORE + "_q") || "");
  const [scope, setScope] = useStateG(() => localStorage.getItem(GEMINI_STORE + "_scope") || "auto");
  const [busy, setBusy] = useStateG(false);
  const [result, setResult] = useStateG(null); // raw text
  const [error, setError] = useStateG(null);
  const [ts, setTs] = useStateG(null);
  const textareaRef = useRefG(null);

  // 處理 pending（從題卡丟過來）
  useEffectG(() => {
    if (!pending) return;
    const filled = formatQuestionForGemini(pending.q, pending.subjectName, pending.picked);
    setQuestion(filled);
    setResult(null); setError(null);
    onConsumePending?.();
    // 自動 focus + 滾到 composer
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }, [pending]);

  // persist
  useEffectG(() => { localStorage.setItem(GEMINI_STORE + "_q", question); }, [question]);
  useEffectG(() => { localStorage.setItem(GEMINI_STORE + "_scope", scope); }, [scope]);

  const saveKey = () => {
    const v = keyDraft.trim();
    setApiKey(v);
    localStorage.setItem(GEMINI_STORE + "_apiKey", v);
    setKeyEditing(!v);
  };

  const solve = async () => {
    const key = apiKey || keyDraft.trim();
    if (!key){ alert("請先輸入 Gemini API Key"); return; }
    const q = question.trim();
    if (!q){ alert("請輸入考題內容"); return; }
    if (key !== apiKey){ setApiKey(key); localStorage.setItem(GEMINI_STORE + "_apiKey", key); setKeyEditing(false); }

    setBusy(true); setError(null); setResult(null);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`;
    const payload = {
      systemInstruction: { parts: [{ text: GEMINI_SYSTEM(scope) }] },
      contents: [{ role: 'user', parts: [{ text: q }] }],
      config: { thinkingConfig: { thinkingLevel: 'HIGH' } }
    };

    try{
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok){
        const err = await r.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${r.status}`);
      }
      const data = await r.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "（沒有取得回覆內容）";
      setResult(text);
      setTs(new Date());
    } catch (e){
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter"){ e.preventDefault(); solve(); }
  };

  const copyAll = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
  };

  const sections = result ? parseSections(result) : [];

  return (
    <div className="gemini-page">
      <div className="crumb">AI 老師 / Gemini</div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="g-title-mark">G</span>
            Gemini 老師
          </h1>
          <p className="page-sub">貼上任何考題，<strong>gemini-3.5-flash</strong> 會依「標準答案 → 核心觀念 → 深度解析 → 觀念導正」四步驟回答。也可以從題庫卡片按「丟給 Gemini 老師」自動帶入。</p>
        </div>
        <div className="header-actions">
          <span className="pill">
            <span className="pill-dot"></span>
            gemini-3.5-flash · HIGH
          </span>
        </div>
      </div>

      {/* API Key vault */}
      <div className={`g-keyvault ${apiKey ? "locked" : ""}`}>
        <div className="g-kv-icon">
          {apiKey
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="4"/><path d="m10.85 12.15 7.65-7.65"/><path d="m18 8 3-3"/><path d="m15 5 3-3"/></svg>}
        </div>
        <div className="g-kv-text">
          <div className="g-kv-label">{apiKey && !keyEditing ? "Gemini API Key 已綁定本機" : "Gemini API Key"}</div>
          <div className="g-kv-sub">
            {apiKey && !keyEditing
              ? <>儲存在 localStorage · <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com</a></>
              : <>從 Google AI Studio 取得 · <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">前往取得</a></>
            }
          </div>
        </div>
        {keyEditing
          ? <>
              <input
                className="g-kv-input mono"
                type="password"
                placeholder="AIza..."
                value={keyDraft}
                onChange={e => setKeyDraft(e.target.value)}
                autoComplete="off"
                onKeyDown={e => { if (e.key === "Enter") saveKey(); }}
              />
              <button className="btn-mini primary" onClick={saveKey}>儲存</button>
            </>
          : <button className="btn-mini" onClick={() => { setKeyDraft(apiKey); setKeyEditing(true); }}>更換</button>
        }
      </div>

      {/* Composer */}
      <div className="g-composer">
        <div className="g-composer-inner">
          <div className="g-composer-head">
            <div className="g-ch-title">考題輸入</div>
            {question.length > 0 && (
              <button className="g-clear" onClick={() => setQuestion("")} title="清空">
                <Icon.close />
              </button>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={onKey}
            placeholder={`例：（台電）三相平衡 Y 接電源，線電壓為 380V，每相負載阻抗為 10∠30° Ω，求線電流大小？

（中油企管）何謂 SWOT 分析？請說明其在企業策略制定中的應用。`}
          />
        </div>
        <div className="g-composer-foot">
          <div className="g-scope">
            {["auto","台電","中油","台水","經濟部聯招"].map(s => (
              <button key={s} className={`g-chip ${scope === s ? "active" : ""}`} onClick={() => setScope(s)}>
                {s === "auto" ? "自動判斷" : s}
              </button>
            ))}
          </div>
          <div className="g-cta">
            <span className="g-hint mono"><kbd>⌘/Ctrl</kbd>+<kbd>↵</kbd></span>
            <button className="g-solve" onClick={solve} disabled={busy}>
              {busy
                ? <><span className="g-spinner"/>解析中…</>
                : <>開始解析<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg></>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Quick examples */}
      {!result && !busy && !question && (
        <div className="g-quick">
          <span className="g-quick-label mono">範例 ＞</span>
          {[
            "一台四極、60Hz 之三相感應電動機，滿載時轉差率為 0.04，求其轉子轉速為多少 rpm？",
            "請說明 Porter 五力分析的五個構面，並以便利商店產業為例說明。",
            "水的硬度單位 ppm 是如何計算的？暫時硬度與永久硬度的差別？",
          ].map((ex, i) => (
            <button key={i} className="g-quick-item" onClick={() => { setQuestion(ex); textareaRef.current?.focus(); }}>
              {ex.length > 22 ? ex.slice(0, 22) + "…" : ex}
            </button>
          ))}
        </div>
      )}

      {/* Result */}
      <div className="g-result">
        {busy && (
          <div className="g-loading-card">
            <div className="g-loading-spin"/>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>Gemini 老師深度思考中…</div>
              <div className="mono" style={{fontSize:12,color:"var(--ink-3)",marginTop:3}}>thinkingLevel = HIGH · 約 8–20 秒</div>
            </div>
          </div>
        )}

        {error && (
          <div className="g-err">
            <div className="g-err-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
              <div className="g-err-title">解析失敗</div>
              <div className="g-err-msg mono">{error}</div>
              {error.includes("model") && (
                <div style={{fontSize:11.5,color:"var(--ink-3)",marginTop:6,lineHeight:1.5}}>
                  提示：如果 gemini-3.5-flash 在你的帳號下還無法使用，可以暫時改用 gemini-2.5-flash（修改 gemini.jsx 內的 URL）。
                </div>
              )}
            </div>
          </div>
        )}

        {result && !busy && (
          <>
            <div className="g-result-head">
              <div>
                <div className="g-result-title">解析結果</div>
                <div className="mono" style={{fontSize:11.5,color:"var(--ink-3)",marginTop:3}}>
                  {ts ? ts.toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"}) : ""} · gemini-3.5-flash · thinkingLevel HIGH
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn-mini" onClick={copyAll}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  複製全文
                </button>
                <button className="btn-mini" onClick={solve}>
                  <Icon.refresh />重新解析
                </button>
              </div>
            </div>
            <div className="g-sections">
              {sections.length > 0
                ? sections.map((sec, i) => {
                    const def = SEC_DEF.find(d => d.key === sec.title) || SEC_DEF[i] || SEC_DEF[0];
                    return (
                      <div key={i} className={`g-sec g-sec-${i+1}`}>
                        <div className="g-sec-head">
                          <div className="g-sec-num">{i+1}</div>
                          <div>
                            <div className="g-sec-kicker mono">{def.kicker}</div>
                            <div className="g-sec-title">{sec.title}</div>
                          </div>
                        </div>
                        <div className="g-sec-body" dangerouslySetInnerHTML={{ __html: mdToHtml(sec.body) }}/>
                      </div>
                    );
                  })
                : (
                  <div className="g-sec g-sec-raw">
                    <div className="g-sec-head">
                      <div className="g-sec-num">∎</div>
                      <div>
                        <div className="g-sec-kicker mono">RAW OUTPUT</div>
                        <div className="g-sec-title">完整回應</div>
                      </div>
                    </div>
                    <div className="g-sec-body" dangerouslySetInnerHTML={{ __html: mdToHtml(result) }}/>
                  </div>
                )
              }
            </div>
          </>
        )}

        {!result && !busy && !error && (
          <div className="empty">
            <div className="empty-mark">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div className="empty-title">等你貼題</div>
            <div className="empty-sub">輸入考題或從題庫卡片按「丟給 Gemini 老師」，結果會分四段卡片呈現。</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Generic Gemini caller exposed for cross-component use.
async function callGeminiRaw(systemPrompt, userMsg) {
  const key = localStorage.getItem(GEMINI_STORE + "_apiKey") || "";
  if (!key) throw new Error("尚未設定 Gemini API Key — 請先到 sidebar「Gemini 老師」貼上 Key。");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`;
  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userMsg }] }],
    config: { thinkingConfig: { thinkingLevel: "HIGH" } },
  };
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${r.status}`);
  }
  const data = await r.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "（沒有取得回覆內容）";
}
window.callGeminiRaw = callGeminiRaw;

window.GeminiTeacher = GeminiTeacher;
