// Main App
const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp, useRef: useRefApp } = React;

const AIAnalysis = window.AIAnalysis;

const STORAGE_KEY = "soe-exam-v1";

function uid(){ return Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-4); }

function loadState() {
  // 合併 seed v1 與後續匯入的題庫（seed_v2 等）
  const allSeed = [
    ...(window.SEED_QUESTIONS || []),
    ...(window.SEED_QUESTIONS_V2 || []),
  ];

  let parsed = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.subjects && p.questions) parsed = p;
    }
  } catch(e) { console.warn("Failed to load:", e); }

  if (parsed) {
    // Merge: 新的 seed_id 自動加入，已存在則保留使用者紀錄
    const existingIds = new Set(parsed.questions.map(q => q.seed_id).filter(Boolean));
    const toAdd = allSeed.filter(s => s.seed_id && !existingIds.has(s.seed_id));
    if (toAdd.length > 0) {
      const newQs = toAdd.map(q => ({
        id: uid(),
        flagged: false,
        attempts: 0,
        wrongCount: 0,
        createdAt: Date.now(),
        ...q,
      }));
      parsed = { ...parsed, questions: [...parsed.questions, ...newQs] };
    }
    return parsed;
  }

  // First load — seed everything
  return {
    subjects: window.SEED_SUBJECTS.map(s => ({...s})),
    questions: allSeed.map(q => ({
      id: uid(),
      flagged: false,
      attempts: 0,
      wrongCount: 0,
      createdAt: Date.now(),
      ...q,
    })),
  };
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
}

// ============ Practice Mode ============
function PracticeMode({ questions, subjects, config, onUpdateQuestion, onExit }) {
  const [idx, setIdx] = useStateApp(0);
  const [selected, setSelected] = useStateApp([]);
  const [revealed, setRevealed] = useStateApp(false);
  const [score, setScore] = useStateApp({ correct: 0, partial: 0, wrong: 0, points: 0 });
  const [done, setDone] = useStateApp(false);
  const [order] = useStateApp(() => {
    const indices = questions.map((_, i) => i);
    const shuffled = (config?.order === "sequential") ? indices : indices.sort(() => Math.random() - 0.5);
    const count = Math.min(config?.count || indices.length, indices.length);
    return shuffled.slice(0, count);
  });

  if (questions.length === 0) {
    return (
      <div className="practice-shell">
        <div className="empty">
          <div className="empty-mark"><Icon.play /></div>
          <div className="empty-title">沒有可練習的題目</div>
          <div className="empty-sub">先在「題庫」頁面新增或匯入題目，再回來開始實戰模擬。</div>
          <button className="btn btn-secondary" onClick={onExit} style={{marginTop:18}}>返回</button>
        </div>
      </div>
    );
  }

  const q = questions[order[idx]];
  const isMulti = q.type === "multi";
  const ansSet = new Set(q.answer);
  const selSet = new Set(selected);

  const toggle = (L) => {
    if (revealed) return;
    setSelected(prev => {
      if (isMulti) return prev.includes(L) ? prev.filter(x => x !== L) : [...prev, L];
      return [L];
    });
  };

  const judge = () => {
    if (selected.length === 0) return;
    // Score: single = 2pts; multi = partial scoring per Taiwan SOE rules:
    //   全對 +2分；錯選任一項 → 0分（保守示範用，依考試規則「錯一個倒扣」是該題分數歸零）
    const allCorrect = selected.length === q.answer.length && selected.every(l => ansSet.has(l));
    const hasWrong = selected.some(l => !ansSet.has(l));
    let result, points;
    if (allCorrect) { result = "correct"; points = 2; }
    else if (!hasWrong && selected.length < q.answer.length) {
      // Partial right (no wrong picks) — give half credit
      result = "partial"; points = 1;
    } else { result = "wrong"; points = 0; }

    setScore(s => ({
      correct: s.correct + (result === "correct" ? 1 : 0),
      partial: s.partial + (result === "partial" ? 1 : 0),
      wrong: s.wrong + (result === "wrong" ? 1 : 0),
      points: s.points + points,
    }));

    onUpdateQuestion(q.id, prev => ({
      attempts: (prev.attempts || 0) + 1,
      wrongCount: (prev.wrongCount || 0) + (result === "correct" ? 0 : 1),
      flagged: prev.flagged || result === "wrong",
      lastWrongAt: result === "correct" ? prev.lastWrongAt : Date.now(),
    }));

    setRevealed(true);
  };

  const next = () => {
    if (idx + 1 >= order.length) { setDone(true); return; }
    setIdx(idx + 1);
    setSelected([]);
    setRevealed(false);
  };

  if (done) {
    const total = order.length * 2;
    const pct = Math.round((score.points / total) * 100);
    return (
      <div className="practice-shell">
        <div className="practice-card" style={{textAlign:"center"}}>
          <div style={{fontFamily:"JetBrains Mono",fontSize:12,letterSpacing:".14em",textTransform:"uppercase",color:"var(--ink-3)"}}>練習完成</div>
          <div style={{fontFamily:"Noto Serif TC",fontSize:72,fontWeight:700,letterSpacing:"-.02em",margin:"12px 0 8px",color: pct >= 80 ? "var(--ok-ink)" : pct >= 60 ? "var(--ink)" : "var(--warn-ink)"}}>
            {score.points}<span style={{color:"var(--ink-3)",fontSize:32}}> / {total}</span>
          </div>
          <div style={{color:"var(--ink-2)",fontSize:14,marginBottom:24}}>得分率 {pct}%</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
            <div className="stat-card"><div className="stat-label" style={{color:"var(--ok-ink)"}}>全對</div><div className="stat-value">{score.correct}</div></div>
            <div className="stat-card"><div className="stat-label" style={{color:"oklch(0.5 0.12 70)"}}>部分</div><div className="stat-value">{score.partial}</div></div>
            <div className="stat-card"><div className="stat-label" style={{color:"var(--warn-ink)"}}>答錯</div><div className="stat-value">{score.wrong}</div></div>
          </div>
          <button className="btn btn-primary" onClick={onExit}>返回題庫</button>
        </div>
      </div>
    );
  }

  return (
    <div className="practice-shell">
      <div className="practice-progress">
        <button className="btn btn-ghost" onClick={onExit} style={{padding:"6px 10px"}}><Icon.close />結束練習</button>
        <div className="progress-bar"><div className="progress-fill" style={{width: `${((idx+1)/order.length)*100}%`}}/></div>
        <div className="progress-text">{idx+1} / {order.length}</div>
        <div className={`score-pill ${score.wrong > score.correct ? "bad" : ""}`}>{score.points} 分</div>
      </div>

      <div className="practice-card">
        <div className="q-meta" style={{marginBottom:16}}>
          <span className={`badge ${isMulti ? "badge-multi" : "badge-single"}`}>{isMulti ? "複選題" : "單選題"}</span>
          {(q.tags||[]).slice(0,3).map(t => <span key={t} className="badge badge-tag">{t}</span>)}
          <div style={{marginLeft:"auto",fontFamily:"JetBrains Mono",fontSize:11,color:"var(--ink-3)"}}>{(subjects.find(s => s.id === q.subjectId) || {}).short}</div>
        </div>
        <div className="q-stem" style={{fontSize:17,lineHeight:1.75,marginBottom:18}}>{q.stem}</div>
        <div className="q-options">
          {q.options.map((opt, i) => {
            const L = "ABCD"[i];
            const isCorrect = ansSet.has(L);
            const isSelected = selSet.has(L);
            let cls = "q-opt";
            if (revealed) {
              if (isCorrect) cls += " correct";
              else if (isSelected) cls += " wrong";
            } else if (isSelected) cls += " selected";
            return (
              <button key={L} className={cls} onClick={() => toggle(L)} style={{padding:"12px 16px",fontSize:14.5}}>
                <span className="q-opt-letter">{L}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="q-reveal" style={{marginTop:18}}>
            <div className="q-reveal-title">標準答案：{q.answer.join("、")}</div>
            {q.explanation && <div style={{marginTop:4}}>{q.explanation}</div>}
          </div>
        )}

        {revealed && React.createElement(AIAnalysis, {
          q, subjectName: (subjects.find(s => s.id === q.subjectId) || {}).name || "—",
          userPicked: selected, autoStart: false,
        })}

        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:22}}>
          {!revealed
            ? <button className="btn btn-primary" disabled={selected.length === 0} onClick={judge} style={{opacity: selected.length === 0 ? 0.4 : 1}}>送出 <Icon.arrowRight /></button>
            : <button className="btn btn-primary" onClick={next}>下一題 <Icon.arrowRight /></button>
          }
        </div>
      </div>
    </div>
  );
}

// ============ Import Modal ============
function ImportModal({ subjects, defaultSubjectId, onClose, onConfirm }) {
  const [text, setText] = useStateApp("");
  const [subjectId, setSubjectId] = useStateApp(defaultSubjectId || subjects[0]?.id);
  const [preview, setPreview] = useStateApp(null);

  const parse = () => {
    const result = window.parseQuestionsFromText(text);
    setPreview(result);
  };

  const confirm = () => {
    if (!preview || preview.questions.length === 0) return;
    onConfirm(preview.questions.map(q => ({ ...q, subjectId })));
  };

  return (
    <Modal title="匯入題目" wide onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>取消</button>
        {!preview
          ? <button className="btn btn-primary" onClick={parse} disabled={!text.trim()} style={{opacity:!text.trim()?0.4:1}}>解析預覽</button>
          : <button className="btn btn-primary" onClick={confirm} disabled={preview.questions.length===0}>確認匯入 {preview.questions.length} 題</button>
        }
      </>
    }>
      {!preview ? (
        <>
          <div className="field">
            <label className="field-label">匯入到科目</label>
            <select className="select" value={subjectId} onChange={e => setSubjectId(e.target.value)}>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field-label">貼上考題文字</label>
            <textarea className="textarea" style={{minHeight:280}} value={text} onChange={e => setText(e.target.value)} placeholder={`支援格式範例：

Q1. 依《自來水法》第2條規定，自來水事業之主管機關，在中央應為下列哪一個機關？
(A) 內政部
(B) 衛生福利部
(C) 水利主管機關
(D) 環境保護部
標準答案：(C)
解析：依《自來水法》第2條第1項…

Q2. ...
`}/>
            <div className="field-help">
              支援題號格式：Q1.、1.、1)；選項格式：(A)、A.、A)；答案行關鍵字：標準答案／答案／正解。複選題答案請寫 ABCD 或 A、B、C、D。
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <span className="badge badge-single" style={{padding:"4px 10px"}}>已解析 {preview.questions.length} 題</span>
            {preview.errors.length > 0 && <span className="badge badge-mistake" style={{padding:"4px 10px"}}>{preview.errors.length} 個警告</span>}
            <button className="btn btn-ghost" style={{marginLeft:"auto"}} onClick={() => setPreview(null)}><Icon.arrowLeft />重新解析</button>
          </div>
          {preview.errors.length > 0 && (
            <div className="q-reveal" style={{borderLeftColor:"var(--warn)",marginBottom:14,background:"var(--warn-soft)"}}>
              <div className="q-reveal-title" style={{color:"var(--warn-ink)"}}>解析警告</div>
              {preview.errors.map((e,i) => <div key={i} style={{fontSize:12}}>{e}</div>)}
            </div>
          )}
          {preview.questions.map((q, i) => (
            <div key={i} className="qcard" style={{marginBottom:10,padding:"14px 16px"}}>
              <div className="q-meta" style={{marginBottom:8}}>
                <span className="q-num">#{i+1}</span>
                <span className={`badge ${q.type === "multi" ? "badge-multi" : "badge-single"}`}>{q.type === "multi" ? "複選" : "單選"}</span>
                <span className="badge badge-tag">答：{q.answer.join("")}</span>
              </div>
              <div style={{fontSize:13.5,marginBottom:6}}>{q.stem}</div>
              <div style={{fontSize:12.5,color:"var(--ink-2)",lineHeight:1.7}}>
                {q.options.map((o,j) => <div key={j}>({"ABCD"[j]}) {o}</div>)}
              </div>
            </div>
          ))}
        </>
      )}
    </Modal>
  );
}

// ============ Stats View ============
function StatsView({ questions, subjects }) {
  const attempted = questions.filter(q => q.attempts > 0);
  const totalAttempts = questions.reduce((a,q) => a + (q.attempts||0), 0);
  const totalWrong = questions.reduce((a,q) => a + (q.wrongCount||0), 0);
  const flagged = questions.filter(q => q.flagged).length;
  const accuracy = totalAttempts > 0 ? Math.round((1 - totalWrong / totalAttempts) * 100) : 0;

  const bySubject = subjects.map(s => {
    const subQ = questions.filter(q => q.subjectId === s.id);
    const subAttempts = subQ.reduce((a,q) => a + (q.attempts||0), 0);
    const subWrong = subQ.reduce((a,q) => a + (q.wrongCount||0), 0);
    return {
      ...s,
      total: subQ.length,
      attempts: subAttempts,
      wrong: subWrong,
      accuracy: subAttempts > 0 ? Math.round((1 - subWrong / subAttempts) * 100) : null,
      flagged: subQ.filter(q => q.flagged).length,
    };
  });

  // Most missed
  const mostMissed = [...questions].filter(q => (q.wrongCount||0) > 0).sort((a,b) => (b.wrongCount||0) - (a.wrongCount||0)).slice(0,5);

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">題目總數</div>
          <div className="stat-value">{questions.length}</div>
          <div className="stat-sub">{subjects.length} 個科目</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">已練習</div>
          <div className="stat-value">{attempted.length}</div>
          <div className="stat-sub">累積 {totalAttempts} 次作答</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">整體正確率</div>
          <div className="stat-value" style={{color: accuracy >= 80 ? "var(--ok-ink)" : accuracy >= 60 ? "var(--ink)" : "var(--warn-ink)"}}>{totalAttempts ? `${accuracy}%` : "—"}</div>
          <div className="stat-sub">{totalWrong} 次答錯</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">常錯題數</div>
          <div className="stat-value" style={{color:"var(--warn-ink)"}}>{flagged}</div>
          <div className="stat-sub">已標記為複習重點</div>
        </div>
      </div>

      <div style={{fontFamily:"Noto Serif TC",fontSize:18,fontWeight:600,marginBottom:14}}>各科進度</div>
      <div style={{display:"grid",gap:10,marginBottom:32}}>
        {bySubject.map(s => (
          <div key={s.id} className="qcard" style={{padding:"18px 22px",marginBottom:0}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:10,height:36,borderRadius:3,background:s.color}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14.5}}>{s.name}</div>
                <div style={{fontSize:12,color:"var(--ink-3)",marginTop:2,fontFamily:"JetBrains Mono"}}>
                  {s.total} 題 · {s.attempts} 次作答 · {s.flagged} 常錯
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"Noto Serif TC",fontSize:24,fontWeight:600,color:s.accuracy === null ? "var(--ink-3)" : s.accuracy >= 80 ? "var(--ok-ink)" : s.accuracy >= 60 ? "var(--ink)" : "var(--warn-ink)"}}>
                  {s.accuracy === null ? "—" : `${s.accuracy}%`}
                </div>
                <div style={{fontSize:11,color:"var(--ink-3)",fontFamily:"JetBrains Mono"}}>正確率</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mostMissed.length > 0 && (
        <>
          <div style={{fontFamily:"Noto Serif TC",fontSize:18,fontWeight:600,marginBottom:14}}>最常答錯的題目</div>
          <div style={{display:"grid",gap:10}}>
            {mostMissed.map(q => {
              const subj = subjects.find(s => s.id === q.subjectId);
              return <MostMissedCard key={q.id} q={q} subj={subj} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}

function MostMissedCard({ q, subj }) {
  const [showAIPanel, setShowAIPanel] = useStateApp(false);
  return (
    <div className="qcard" style={{padding:"14px 18px",marginBottom:0}}>
      <div className="q-meta" style={{marginBottom:6}}>
        <span className="badge badge-tag">{subj?.short || "—"}</span>
        <span className={`badge ${q.type === "multi" ? "badge-multi" : "badge-single"}`}>{q.type === "multi" ? "複選" : "單選"}</span>
        <span className="badge badge-mistake">錯 {q.wrongCount} 次 / {q.attempts}</span>
        <span className="badge badge-tag">答：{q.answer.join("")}</span>
      </div>
      <div style={{fontSize:13.5,color:"var(--ink-2)",lineHeight:1.6,marginBottom:8}}>{q.stem}</div>
      {showAIPanel
        ? React.createElement(AIAnalysis, { q, subjectName: subj?.name || "—", autoStart: true })
        : <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button className="ai-btn claude" onClick={() => setShowAIPanel(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>
              問 Claude 老師
            </button>
            {window.askGemini && (
              <button className="ai-btn gemini" onClick={() => window.askGemini(q, subj?.name || "—", [])}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                丟給 Gemini 老師
              </button>
            )}
          </div>
      }
    </div>
  );
}

// ============ Practice Setup Modal ============
function PracticeSetupModal({ pool, sourceLabel, onClose, onStart }) {
  const total = pool.length;
  const singleCount = pool.filter(q => q.type === "single").length;
  const multiCount = pool.filter(q => q.type === "multi").length;
  const flaggedCount = pool.filter(q => q.flagged).length;

  // Auto-pick a reasonable default count
  const presets = [10, 20, 30, 50, total].filter((v, i, arr) => v > 0 && v <= total && arr.indexOf(v) === i);
  const defaultCount = presets.find(p => p >= 10) || total;

  const [count, setCount] = useStateApp(defaultCount);
  const [order, setOrder] = useStateApp("random"); // random | sequential
  const [filter, setFilter] = useStateApp("all"); // all | single | multi | flagged
  const [customCount, setCustomCount] = useStateApp("");

  const filtered = useMemoApp(() => {
    if (filter === "single") return pool.filter(q => q.type === "single");
    if (filter === "multi") return pool.filter(q => q.type === "multi");
    if (filter === "flagged") return pool.filter(q => q.flagged);
    return pool;
  }, [pool, filter]);

  const effectiveCount = Math.min(count, filtered.length);
  const filteredEmpty = filtered.length === 0;

  const start = () => {
    if (filteredEmpty) return;
    onStart({
      count: effectiveCount,
      order,
      filter,
      pool: filtered,
    });
  };

  return (
    <Modal title="開始練習" onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>取消</button>
        <button className="btn btn-primary" disabled={filteredEmpty} onClick={start}>
          <Icon.play />開始 {effectiveCount} 題練習
        </button>
      </>
    }>
      <div style={{
        display:"flex", alignItems:"center", gap:10, marginBottom:18,
        padding:"12px 14px", background:"var(--surface-2)", borderRadius:10,
        fontSize:13, color:"var(--ink-2)"
      }}>
        <span style={{fontFamily:"JetBrains Mono",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:"var(--ink-3)"}}>來源</span>
        <strong style={{color:"var(--ink)"}}>{sourceLabel}</strong>
        <span style={{marginLeft:"auto",fontFamily:"JetBrains Mono",fontSize:11.5,color:"var(--ink-3)"}}>
          共 {total} 題 · 單 {singleCount} / 複 {multiCount} / 常錯 {flaggedCount}
        </span>
      </div>

      <div className="field">
        <label className="field-label">範圍篩選</label>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[
            { k:"all", label:`全部 (${total})` },
            { k:"single", label:`單選 (${singleCount})` },
            { k:"multi", label:`複選 (${multiCount})` },
            { k:"flagged", label:`常錯 (${flaggedCount})` },
          ].map(f => (
            <button
              key={f.k}
              className={`chip ${filter === f.k ? "active" : ""}`}
              onClick={() => setFilter(f.k)}
              disabled={(f.k === "single" && singleCount === 0) || (f.k === "multi" && multiCount === 0) || (f.k === "flagged" && flaggedCount === 0)}
              style={{opacity: ((f.k === "single" && singleCount === 0) || (f.k === "multi" && multiCount === 0) || (f.k === "flagged" && flaggedCount === 0)) ? 0.4 : 1}}
            >{f.label}</button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="field-label">題目數量 <span style={{color:"var(--ink-3)",fontWeight:400,fontSize:11.5}}>（最多 {filtered.length} 題）</span></label>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          {[10, 20, 30, 50].filter(p => p <= filtered.length).map(p => (
            <button
              key={p}
              className={`chip ${count === p && customCount === "" ? "active" : ""}`}
              onClick={() => { setCount(p); setCustomCount(""); }}
            >{p} 題</button>
          ))}
          {filtered.length > 0 && (
            <button
              className={`chip ${count === filtered.length && customCount === "" ? "active" : ""}`}
              onClick={() => { setCount(filtered.length); setCustomCount(""); }}
            >全部 ({filtered.length})</button>
          )}
          <input
            type="number"
            min="1"
            max={filtered.length}
            placeholder="自訂"
            value={customCount}
            onChange={e => {
              const v = e.target.value;
              setCustomCount(v);
              const n = parseInt(v, 10);
              if (!isNaN(n) && n > 0) setCount(Math.min(n, filtered.length));
            }}
            style={{
              width:88, padding:"6px 10px", borderRadius:18,
              border:"1px solid var(--line-strong)", background:"var(--surface)",
              fontSize:12, fontFamily:"JetBrains Mono", color:"var(--ink)",
              textAlign:"center"
            }}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">出題順序</label>
        <div style={{display:"flex",gap:6}}>
          <button className={`chip ${order === "random" ? "active" : ""}`} onClick={() => setOrder("random")}>
            🎲 隨機順序
          </button>
          <button className={`chip ${order === "sequential" ? "active" : ""}`} onClick={() => setOrder("sequential")}>
            ↓ 依題庫順序
          </button>
        </div>
      </div>

      {filteredEmpty && (
        <div style={{
          padding:"12px 14px",borderRadius:10,
          background:"var(--warn-soft)",color:"var(--warn-ink)",
          fontSize:12.5,marginTop:8
        }}>
          目前篩選條件下沒有可練習的題目，請放寬篩選範圍。
        </div>
      )}

      <div style={{
        padding:"14px 16px", borderRadius:12,
        background:"linear-gradient(135deg, var(--accent-soft), oklch(0.96 0.04 70))",
        marginTop:18, fontSize:13, color:"var(--accent-ink)",
        lineHeight:1.6
      }}>
        將從 {sourceLabel} 中以「{order === "random" ? "隨機" : "依序"}」方式出 <strong>{effectiveCount}</strong> 題
        {filter !== "all" && (filter === "single" ? "單選題" : filter === "multi" ? "複選題" : "常錯題")}
        ，作答後可顯示標準答案、解析與 AI 觀念導正。
      </div>
    </Modal>
  );
}

// ============ Main App ============
function App() {
  const [state, setState] = useStateApp(loadState);
  const [activeSubjectId, setActiveSubjectId] = useStateApp(() => state.subjects[0]?.id);
  const [view, setView] = useStateApp("bank"); // bank | practice | mistakes | stats | gemini
  const [search, setSearch] = useStateApp("");
  const [typeFilter, setTypeFilter] = useStateApp("all"); // all | single | multi
  const [tagFilter, setTagFilter] = useStateApp(null);
  const [editingQ, setEditingQ] = useStateApp(null); // {} = new, {id:...} = edit
  const [editingSubj, setEditingSubj] = useStateApp(null);
  const [showImport, setShowImport] = useStateApp(false);
  const [practiceSetup, setPracticeSetup] = useStateApp(null); // null | { source: 'bank' | 'mistakes', defaults }
  const [practiceConfig, setPracticeConfig] = useStateApp(null);
  const [showClaudeSettings, setShowClaudeSettings] = useStateApp(false);
  useEffectApp(() => {
    const fn = () => setShowClaudeSettings(true);
    window.addEventListener("__open_claude_settings", fn);
    return () => window.removeEventListener("__open_claude_settings", fn);
  }, []);
  const [toast, ToastView] = useToast();

  useEffectApp(() => { saveState(state); }, [state]);

  // Subject ops
  const addSubject = (subj) => {
    const id = "sub_" + uid();
    setState(s => ({...s, subjects: [...s.subjects, { ...subj, id }]}));
    setActiveSubjectId(id);
    setEditingSubj(null);
    toast("已新增科目「" + subj.name + "」");
  };
  const updateSubject = (subj) => {
    setState(s => ({...s, subjects: s.subjects.map(x => x.id === subj.id ? subj : x)}));
    setEditingSubj(null);
    toast("科目已更新");
  };
  const deleteSubject = (id) => {
    const subj = state.subjects.find(s => s.id === id);
    const count = state.questions.filter(q => q.subjectId === id).length;
    if (!confirm(`確定刪除科目「${subj.name}」？將同時刪除底下 ${count} 題題目。`)) return;
    setState(s => ({
      subjects: s.subjects.filter(x => x.id !== id),
      questions: s.questions.filter(q => q.subjectId !== id),
    }));
    if (activeSubjectId === id) setActiveSubjectId(state.subjects[0]?.id);
    setEditingSubj(null);
    toast("已刪除科目");
  };

  // Question ops
  const saveQuestion = (q) => {
    if (q.id) {
      setState(s => ({...s, questions: s.questions.map(x => x.id === q.id ? {...x, ...q} : x)}));
      toast("題目已更新");
    } else {
      setState(s => ({...s, questions: [...s.questions, { ...q, id: uid(), flagged: false, attempts: 0, wrongCount: 0, createdAt: Date.now() }]}));
      toast("已新增題目");
    }
    setEditingQ(null);
  };
  const deleteQuestion = (id) => {
    if (!confirm("確定刪除此題？")) return;
    setState(s => ({...s, questions: s.questions.filter(q => q.id !== id)}));
    toast("題目已刪除");
  };
  const toggleFlag = (id) => {
    setState(s => ({...s, questions: s.questions.map(q => q.id === id ? {...q, flagged: !q.flagged} : q)}));
  };
  const updateQuestionStats = (id, updater) => {
    setState(s => ({...s, questions: s.questions.map(q => q.id === id ? {...q, ...updater(q)} : q)}));
  };
  const importQuestions = (qs) => {
    const newQs = qs.map(q => ({ ...q, id: uid(), flagged: false, attempts: 0, wrongCount: 0, createdAt: Date.now() }));
    setState(s => ({...s, questions: [...s.questions, ...newQs]}));
    setShowImport(false);
    toast(`已匯入 ${qs.length} 題`);
  };

  // Active subject and filtering
  const activeSubject = state.subjects.find(s => s.id === activeSubjectId);
  const subjectQuestions = useMemoApp(() => {
    if (view === "mistakes") return state.questions.filter(q => q.flagged || (q.wrongCount||0) > 0);
    return state.questions.filter(q => q.subjectId === activeSubjectId);
  }, [state.questions, activeSubjectId, view]);

  const allTags = useMemoApp(() => {
    const set = new Set();
    subjectQuestions.forEach(q => (q.tags||[]).forEach(t => set.add(t)));
    return [...set].sort();
  }, [subjectQuestions]);

  const visibleQuestions = useMemoApp(() => {
    return subjectQuestions.filter(q => {
      if (typeFilter === "flagged") {
        if (!q.flagged) return false;
      } else if (typeFilter !== "all" && q.type !== typeFilter) {
        return false;
      }
      if (tagFilter && !(q.tags||[]).includes(tagFilter)) return false;
      if (search.trim()) {
        const s = search.trim().toLowerCase();
        if (!q.stem.toLowerCase().includes(s) && !q.options.some(o => o.toLowerCase().includes(s))) return false;
      }
      return true;
    });
  }, [subjectQuestions, typeFilter, tagFilter, search]);

  const subjectStats = useMemoApp(() => state.subjects.map(s => ({
    ...s,
    count: state.questions.filter(q => q.subjectId === s.id).length,
    flagged: state.questions.filter(q => q.subjectId === s.id && q.flagged).length,
  })), [state]);

  const mistakeCount = state.questions.filter(q => q.flagged || (q.wrongCount||0) > 0).length;

  // Mobile sidebar
  const [navOpen, setNavOpen] = useStateApp(false);
  const closeNav = () => setNavOpen(false);

  // 「丟給 Gemini」作為 global function，讓題目卡可以呼叫
  const [geminiPending, setGeminiPending] = useStateApp(null);
  useEffectApp(() => {
    window.askGemini = (q, subjectName, picked) => {
      setGeminiPending({ q, subjectName, picked, ts: Date.now() });
      setView("gemini");
      setNavOpen(false);
    };
  }, []);

  // ===== Render =====
  if (view === "practice") {
    const pmQuestions = practiceConfig?.pool || (visibleQuestions.length > 0 ? visibleQuestions : subjectQuestions);
    return (
      <div className="app" style={{gridTemplateColumns:"1fr"}}>
        <div className="main" style={{maxWidth:"100%",padding:"32px 24px"}}>
          <PracticeMode
            questions={pmQuestions}
            subjects={state.subjects}
            config={practiceConfig}
            onUpdateQuestion={updateQuestionStats}
            onExit={() => setView("bank")}
          />
        </div>
        {ToastView}
      </div>
    );
  }

  return (
    <div className="app">
      {/* Mobile top bar */}
      <div className="mobile-bar">
        <button className="btn btn-ghost" onClick={() => setNavOpen(true)} style={{padding:"6px 10px"}} aria-label="開啟選單">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
        <div className="brand">
          <div className="brand-mark">水</div>
          <div>
            <div className="brand-title">{activeSubject?.short || "國營考題複習"}</div>
            <div className="brand-sub">{view === "stats" ? "Stats" : view === "mistakes" ? "Mistakes" : "Question Bank"}</div>
          </div>
        </div>
        <div style={{width:38}}/>
      </div>
      <div className={`sidebar-scrim ${navOpen ? "open" : ""}`} onClick={closeNav}/>

      {/* Sidebar */}
      <aside className={`sidebar ${navOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">水</div>
          <div>
            <div className="brand-title">國營考題複習</div>
            <div className="brand-sub">SOE Exam Trainer</div>
          </div>
        </div>

        <div>
          <div className="nav-label">AI 老師</div>
          <div className="nav-item" onClick={() => { setView("gemini"); closeNav(); }} style={view === "gemini" ? {background:"var(--ink)",color:"var(--surface)",fontWeight:500} : undefined}>
            <span className="sensei-dot gemini"></span>
            <span>Gemini 老師</span>
            <span className="nav-count" style={view === "gemini" ? {background:"rgba(255,255,255,.15)",color:"#fff"} : undefined}>API</span>
          </div>
          <div className="nav-item" onClick={() => { setShowClaudeSettings(true); closeNav(); }} title="點題目卡上的「問 Claude 老師」使用；點這裡設定 API Key">
            <span className="sensei-dot claude"></span>
            <span>Claude 老師</span>
            <span className="nav-count">設定</span>
          </div>
        </div>

        <div>
          <div className="nav-label">總覽</div>
          <div className="nav-item" onClick={() => { setView("stats"); closeNav(); }} style={view === "stats" ? {background:"var(--ink)",color:"var(--surface)",fontWeight:500} : undefined}>
            <Icon.chart />
            <span>學習統計</span>
            <span className="nav-count" style={view === "stats" ? {background:"rgba(255,255,255,.15)",color:"#fff"} : undefined}>{state.questions.length}</span>
          </div>
          <div className="nav-item" onClick={() => { setView("mistakes"); closeNav(); }} style={view === "mistakes" ? {background:"var(--ink)",color:"var(--surface)",fontWeight:500} : undefined}>
            <Icon.flag />
            <span>錯題複習</span>
            <span className="nav-count" style={view === "mistakes" ? {background:"rgba(255,255,255,.15)",color:"#fff"} : undefined}>{mistakeCount}</span>
          </div>
        </div>

        <div style={{flex:1,minHeight:0,overflowY:"auto",margin:"0 -8px",padding:"0 8px"}}>
          <div className="nav-label">科目</div>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {subjectStats.map(s => (
              <div
                key={s.id}
                className={`subject-item ${view === "bank" && activeSubjectId === s.id ? "active" : ""}`}
                onClick={() => { setActiveSubjectId(s.id); setView("bank"); setTagFilter(null); closeNav(); }}
                onDoubleClick={() => setEditingSubj(s)}
                title="雙擊可編輯"
              >
                <div className="subject-dot" style={{background:s.color}}/>
                <div className="subject-name">{s.name}</div>
                <div className="subject-meta">{s.count}</div>
              </div>
            ))}
            <button className="btn-add-subject" onClick={() => setEditingSubj({})} style={{marginTop:8}}>
              <Icon.plus />新增科目
            </button>
          </div>
        </div>

        <div style={{fontSize:11,color:"var(--ink-3)",lineHeight:1.55,padding:"0 8px",fontFamily:"JetBrains Mono"}}>
          v1.0 · 資料儲存在本機<br/>
          複選題依答錯倒扣機制計分
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        {view === "gemini" && React.createElement(window.GeminiTeacher, { subjects: state.subjects, pending: geminiPending, onConsumePending: () => setGeminiPending(null) })}

        {view === "stats" && (
          <>
            <div className="crumb">總覽 / 統計</div>
            <h1 className="page-title">學習統計</h1>
            <p className="page-sub">追蹤各科進度、找出最常答錯的題目，把時間花在刀口上。</p>
            <div style={{height:32}}/>
            <StatsView questions={state.questions} subjects={state.subjects} />
          </>
        )}

        {view === "mistakes" && (
          <>
            <div className="crumb">總覽 / 錯題本</div>
            <div className="page-header">
              <div>
                <h1 className="page-title">錯題複習</h1>
                <p className="page-sub">收集你答錯過或手動標記的題目，集中火力突破弱點。記得：複選題寧可少選、不要亂猜。</p>
              </div>
              {mistakeCount > 0 && (
                <div className="header-actions">
                  <button className="btn btn-primary" onClick={() => setPracticeSetup({ source:"mistakes", pool: subjectQuestions })}><Icon.play />立即練習錯題</button>
                </div>
              )}
            </div>
            <div style={{height:24}}/>
            {subjectQuestions.length > 0 && window.MistakeAnalyzer && (
              <React.Fragment>
                {React.createElement(window.MistakeAnalyzer, { mistakes: subjectQuestions, subjects: state.subjects })}
                <div style={{height:24}}/>
              </React.Fragment>
            )}
            {subjectQuestions.length === 0 ? (
              <div className="empty">
                <div className="empty-mark"><Icon.star /></div>
                <div className="empty-title">目前沒有錯題</div>
                <div className="empty-sub">當你在練習中答錯，或手動點擊題目上的星號標記，題目就會出現在這裡。</div>
              </div>
            ) : (
              subjectQuestions.map((q, i) => (
                <QuestionCard
                  key={q.id} q={q} index={i}
                  subject={state.subjects.find(s => s.id === q.subjectId)}
                  onEdit={setEditingQ}
                  onDelete={deleteQuestion}
                  onFlag={toggleFlag}
                />
              ))
            )}
          </>
        )}

        {view === "bank" && activeSubject && (
          <>
            <div className="crumb">
              <span style={{display:"inline-block",width:8,height:8,borderRadius:2,background:activeSubject.color,marginRight:8,verticalAlign:"middle"}}/>
              科目 / {activeSubject.short}
            </div>
            <div className="page-header">
              <div>
                <h1 className="page-title">{activeSubject.name}</h1>
                <p className="page-sub">{activeSubject.description || "點擊題目右上角圖示可編輯、刪除或標記為常錯題。"}</p>
              </div>
              <div className="header-actions">
                <button className="btn btn-ghost" onClick={() => setEditingSubj(activeSubject)}><Icon.edit />編輯科目</button>
                <button className="btn btn-secondary" onClick={() => setShowImport(true)}><Icon.import />匯入</button>
                <button className="btn btn-secondary" onClick={() => setEditingQ({})}><Icon.plus />新增</button>
                <button className="btn btn-primary" onClick={() => setPracticeSetup({ source:"bank", pool: visibleQuestions.length > 0 ? visibleQuestions : subjectQuestions })} disabled={subjectQuestions.length === 0}><Icon.play />開始練習</button>
              </div>
            </div>

            <div className="tabs">
              <div className={`tab ${typeFilter === "all" ? "active" : ""}`} onClick={() => setTypeFilter("all")}>全部 <span className="tab-count">{subjectQuestions.length}</span></div>
              <div className={`tab ${typeFilter === "single" ? "active" : ""}`} onClick={() => setTypeFilter("single")}>單選 <span className="tab-count">{subjectQuestions.filter(q => q.type === "single").length}</span></div>
              <div className={`tab ${typeFilter === "multi" ? "active" : ""}`} onClick={() => setTypeFilter("multi")}>複選 <span className="tab-count">{subjectQuestions.filter(q => q.type === "multi").length}</span></div>
              <div className={`tab ${typeFilter === "flagged" ? "active" : ""}`} onClick={() => setTypeFilter("flagged")} style={{color: typeFilter === "flagged" ? undefined : "var(--ink-3)"}}>常錯 <span className="tab-count">{subjectQuestions.filter(q => q.flagged).length}</span></div>
            </div>

            <div className="filter-bar">
              <div className="search">
                <span className="search-icon"><Icon.search /></span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋題幹、選項…"/>
              </div>
              {allTags.length > 0 && (
                <>
                  <span style={{fontSize:11.5,color:"var(--ink-3)",fontFamily:"JetBrains Mono",letterSpacing:".08em"}}>TAGS</span>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",maxWidth:"100%"}}>
                    {tagFilter && <button className="chip active" onClick={() => setTagFilter(null)}>清除</button>}
                    {allTags.slice(0, 12).map(t => (
                      <button key={t} className={`chip ${tagFilter === t ? "active" : ""}`} onClick={() => setTagFilter(tagFilter === t ? null : t)}>{t}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {visibleQuestions.length === 0 ? (
              <div className="empty">
                <div className="empty-mark"><Icon.book /></div>
                <div className="empty-title">{subjectQuestions.length === 0 ? "這個科目還沒有題目" : "找不到符合條件的題目"}</div>
                <div className="empty-sub">{subjectQuestions.length === 0 ? "用「匯入」功能貼上整段考題，或「新增」一題一題輸入。" : "試試清除搜尋與篩選條件。"}</div>
                {subjectQuestions.length === 0 && (
                  <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:18}}>
                    <button className="btn btn-secondary" onClick={() => setEditingQ({})}><Icon.plus />新增一題</button>
                    <button className="btn btn-primary" onClick={() => setShowImport(true)}><Icon.import />匯入題目</button>
                  </div>
                )}
              </div>
            ) : (
              (visibleQuestions).map((q, i) => (
                <QuestionCard
                  key={q.id} q={q} index={i}
                  subject={activeSubject}
                  onEdit={setEditingQ}
                  onDelete={deleteQuestion}
                  onFlag={toggleFlag}
                />
              ))
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {editingQ && (
        <QuestionEditor
          q={editingQ.id ? editingQ : null}
          subjects={state.subjects}
          defaultSubjectId={activeSubjectId}
          onSave={saveQuestion}
          onClose={() => setEditingQ(null)}
        />
      )}
      {editingSubj && (
        <SubjectEditor
          subject={editingSubj.id ? editingSubj : null}
          onSave={editingSubj.id ? updateSubject : addSubject}
          onDelete={deleteSubject}
          onClose={() => setEditingSubj(null)}
        />
      )}
      {showImport && (
        <ImportModal
          subjects={state.subjects}
          defaultSubjectId={activeSubjectId}
          onClose={() => setShowImport(false)}
          onConfirm={importQuestions}
        />
      )}
      {practiceSetup && (
        <PracticeSetupModal
          pool={practiceSetup.pool}
          sourceLabel={practiceSetup.source === "mistakes" ? "錯題複習" : (activeSubject?.name || "題庫")}
          onClose={() => setPracticeSetup(null)}
          onStart={(cfg) => { setPracticeConfig(cfg); setPracticeSetup(null); setView("practice"); }}
        />
      )}
      {showClaudeSettings && window.ClaudeSettingsModal && React.createElement(window.ClaudeSettingsModal, {
        onClose: () => setShowClaudeSettings(false)
      })}
      {ToastView}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
