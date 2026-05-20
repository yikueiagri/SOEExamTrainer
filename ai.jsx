// AI analysis component — calls window.claude.complete to get exam tutor feedback,
// then renders structured sections with copy + share buttons.

const { useState: useStateAI, useRef: useRefAI } = React;

const AI_PROMPT_SYSTEM = `你是一位精通台灣國營事業考試（如台水、台電、中油、經濟部聯招）的補習班名師。針對使用者提供的題目與作答，請務必嚴格依照以下四個區塊的固定順序與標題回答，每個區塊獨立成段：

【標準答案】
（只寫正確選項與一句話結論）

【核心觀念】
（命中此題的關鍵概念，3 行以內）

【深度解析】
（逐選項分析為何對、為何錯；如果涉及法條請註明條文）

【觀念導正】
（針對考生常犯的盲點、易混淆觀念提出 2-3 個提醒，並給予鼓勵性結語）

用嚴謹但溫暖鼓勵的口吻，全程繁體中文，不要使用 markdown 標記符號（如 ** 或 ##）。`;

function buildPrompt({ stem, options, answer, userPicked, subjectName, type }) {
  const optsText = options.map((o, i) => `(${"ABCD"[i]}) ${o}`).join("\n");
  const userPart = userPicked && userPicked.length
    ? `\n\n考生作答：${userPicked.join("、")}（${userPicked.join("") === answer.join("") ? "答對" : "答錯"}）`
    : "";
  return `科目：${subjectName}
題型：${type === "multi" ? "複選題（錯一個倒扣，全錯整題 0 分）" : "單選題"}

題目：${stem}

${optsText}

標準答案：${answer.join("、")}${userPart}`;
}

function parseAIResponse(text) {
  const sections = { 標準答案: "", 核心觀念: "", 深度解析: "", 觀念導正: "" };
  const order = ["標準答案", "核心觀念", "深度解析", "觀念導正"];

  // Find each section by header
  const positions = [];
  order.forEach(label => {
    const re = new RegExp("【\\s*" + label + "\\s*】", "g");
    const m = re.exec(text);
    if (m) positions.push({ label, start: m.index, end: m.index + m[0].length });
  });
  positions.sort((a,b) => a.start - b.start);

  for (let i = 0; i < positions.length; i++) {
    const cur = positions[i];
    const next = positions[i+1];
    const body = text.slice(cur.end, next ? next.start : text.length).trim();
    sections[cur.label] = body;
  }
  // Fallback: if no headers found, dump everything into 深度解析
  if (positions.length === 0) {
    sections.深度解析 = text.trim();
  }
  return sections;
}

function AIAnalysis({ q, subjectName, userPicked, autoStart=false }) {
  const [state, setState] = useStateAI(autoStart ? "loading" : "idle"); // idle | loading | done | error
  const [result, setResult] = useStateAI(null);
  const [error, setError] = useStateAI(null);
  const [copied, setCopied] = useStateAI(false);
  const startedRef = useRefAI(false);

  const start = async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setState("loading");
    setError(null);
    try {
      const userMsg = buildPrompt({
        stem: q.stem, options: q.options, answer: q.answer,
        userPicked, subjectName, type: q.type,
      });
      if (!window.claude || !window.claude.complete) {
        throw new Error("AI 功能無法載入，請重新整理頁面再試");
      }
      const reply = await window.claude.complete({
        messages: [
          { role: "user", content: AI_PROMPT_SYSTEM + "\n\n----\n\n" + userMsg },
        ],
      });
      setResult(parseAIResponse(reply));
      setState("done");
    } catch (e) {
      setError(e.message || String(e));
      setState("error");
      startedRef.current = false; // allow retry
    }
  };

  React.useEffect(() => {
    if (autoStart) start();
    // eslint-disable-next-line
  }, []);

  const buildSharableText = () => {
    if (!result) return "";
    const labels = ["標準答案", "核心觀念", "深度解析", "觀念導正"];
    const parts = [
      `📘 ${subjectName}｜${q.type === "multi" ? "複選" : "單選"}題 觀念導正`,
      "",
      `題目：${q.stem}`,
      ...q.options.map((o,i) => `(${"ABCD"[i]}) ${o}`),
      "",
      ...labels.flatMap(l => result[l] ? [`【${l}】`, result[l], ""] : []),
      "— 國營考題複習產生",
    ];
    return parts.join("\n");
  };

  const handleCopy = async () => {
    const text = buildSharableText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const handleShare = async () => {
    const text = buildSharableText();
    if (navigator.share) {
      try {
        await navigator.share({ title: "國營考題觀念導正", text });
      } catch (e) { /* user cancelled */ }
    } else {
      // Fallback: copy
      handleCopy();
    }
  };

  if (state === "idle") {
    return (
      <button className="ai-btn claude" onClick={start} style={{marginTop:12}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>
        問 Claude 老師
      </button>
    );
  }

  if (state === "loading") {
    return (
      <div className="ai-block claude">
        <div className="ai-head">
          <div className="ai-spark claude"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg></div>
          <div>
            <div className="ai-title">Claude 老師<span className="ai-tag claude">CLAUDE HAIKU</span></div>
            <div className="ai-sub">內建即時咨詢 · 分析中…</div>
          </div>
        </div>
        <div className="ai-loading">
          <span className="ai-dot"></span><span className="ai-dot"></span><span className="ai-dot"></span>
          <span>深度思考中，請稍候約 5–15 秒</span>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="ai-block">
        <div className="ai-error">分析失敗：{error}</div>
        <div style={{padding:"0 14px 14px"}}>
          <button className="ai-btn ghost" onClick={() => { startedRef.current = false; start(); }}>重新嘗試</button>
        </div>
      </div>
    );
  }

  // done
  return (
    <div className="ai-block claude">
      <div className="ai-head">
        <div className="ai-spark claude"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg></div>
        <div>
          <div className="ai-title">Claude 老師<span className="ai-tag claude">CLAUDE HAIKU</span></div>
          <div className="ai-sub">內建即時咨詢 · {q.type === "multi" ? "複選" : "單選"}題深度解析</div>
        </div>
        <div className="ai-actions">
          <button onClick={handleCopy} title={copied ? "已複製" : "複製全文"} style={copied ? {color:"var(--ok-ink)"} : undefined}>
            {copied
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            }
          </button>
          <button onClick={handleShare} title="分享">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>
          <button onClick={() => { startedRef.current = false; start(); }} title="重新分析">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 15.5-6.36L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.36L3 16"/><path d="M3 21v-5h5"/></svg>
          </button>
        </div>
      </div>
      <div className="ai-body">
        {["標準答案","核心觀念","深度解析","觀念導正"].map(label => (
          result[label] ? (
            <div key={label} className="ai-section">
              <h4>{label}</h4>
              <p>{result[label]}</p>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}

window.AIAnalysis = AIAnalysis;
