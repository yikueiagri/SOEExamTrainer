// Reusable UI components and icons

const { useState, useEffect, useMemo, useRef } = React;

// ============ Icons (inline SVG) ============
const Icon = {
  search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>,
  flag: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22V15"/></svg>,
  close: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>,
  import: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>,
  book: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  play: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>,
  chart: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  warn: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>,
  refresh: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 15.5-6.36L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.36L3 16"/><path d="M3 21v-5h5"/></svg>,
  arrowLeft: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7M19 12H5"/></svg>,
  arrowRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  starFilled: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

// ============ Toast ============
function useToast() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2200);
    return () => clearTimeout(t);
  }, [msg]);
  const ToastView = msg ? <div className="toast">{msg}</div> : null;
  return [setMsg, ToastView];
}

// ============ Modal ============
function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={wide ? {maxWidth:920} : undefined} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          <button className="close-btn" onClick={onClose} aria-label="關閉"><Icon.close /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ============ Question Card ============
function QuestionCard({ q, index, subject, onEdit, onDelete, onFlag, allowReveal=true, defaultRevealed=false, showAI=true }) {
  const [revealed, setRevealed] = useState(defaultRevealed);
  const [selected, setSelected] = useState([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const isMulti = q.type === "multi";

  const toggle = (letter) => {
    if (revealed) return;
    setSelected(prev => {
      if (isMulti) {
        return prev.includes(letter) ? prev.filter(x => x !== letter) : [...prev, letter];
      }
      return [letter];
    });
  };

  const check = () => setRevealed(true);
  const reset = () => { setRevealed(false); setSelected([]); };

  const ansSet = new Set(q.answer);
  const selSet = new Set(selected);

  return (
    <div className={`qcard ${q.flagged ? "flagged" : ""}`}>
      <div className="q-head">
        <div className="q-meta">
          <span className="q-num">#{String(index+1).padStart(2,"0")}</span>
          <span className={`badge ${isMulti ? "badge-multi" : "badge-single"}`}>{isMulti ? "複選" : "單選"}</span>
          {q.flagged && <span className="badge badge-mistake">常錯題</span>}
          {(q.tags||[]).map(t => <span key={t} className="badge badge-tag">{t}</span>)}
        </div>
        <div className="q-actions">
          <button onClick={() => onFlag(q.id)} title={q.flagged ? "取消標記" : "標記為常錯題"}>
            {q.flagged ? <Icon.starFilled /> : <Icon.star />}
          </button>
          <button onClick={() => onEdit(q)} title="編輯"><Icon.edit /></button>
          <button onClick={() => onDelete(q.id)} title="刪除"><Icon.trash /></button>
        </div>
      </div>
      <div className="q-stem">{q.stem}</div>
      <div className="q-options">
        {q.options.map((opt, i) => {
          const L = "ABCD"[i];
          const isCorrect = ansSet.has(L);
          const isSelected = selSet.has(L);
          let cls = "q-opt";
          if (revealed) {
            if (isCorrect) cls += " correct";
            else if (isSelected) cls += " wrong";
          } else if (isSelected) {
            cls += " selected";
          }
          return (
            <button key={L} className={cls} onClick={() => toggle(L)}>
              <span className="q-opt-letter">{L}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {allowReveal && (
        <div className="q-foot">
          <div className="q-stat">
            {(q.attempts > 0) && <span><strong>{q.attempts}</strong> 次作答</span>}
            {(q.attempts > 0) && <span><strong>{q.wrongCount || 0}</strong> 次答錯</span>}
            {(q.attempts > 0) && <span>正確率 <strong>{Math.round((1 - (q.wrongCount||0)/q.attempts) * 100)}%</strong></span>}
          </div>
          <div style={{display:"flex",gap:6}}>
            {revealed
              ? <button className="btn btn-ghost" onClick={reset}><Icon.refresh />重做</button>
              : <button className="btn btn-secondary" onClick={check}>看答案</button>
            }
          </div>
        </div>
      )}

      {revealed && (
        <div className="q-reveal">
          <div className="q-reveal-title">標準答案：{q.answer.join("、")}</div>
          {q.explanation && <div>{q.explanation}</div>}
        </div>
      )}

      {revealed && showAI && (
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
          {showAIPanel
            ? <div style={{flex:"1 1 100%"}}>{React.createElement(window.AIAnalysis, { q, subjectName: subject?.name || "—", userPicked: selected, autoStart: true })}</div>
            : <button className="ai-btn claude" onClick={() => setShowAIPanel(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>
                問 Claude 老師
              </button>
          }
          {!showAIPanel && window.askGemini && (
            <button className="ai-btn gemini" onClick={() => window.askGemini(q, subject?.name || "—", selected)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              丟給 Gemini 老師
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============ Question Editor ============
function QuestionEditor({ q, subjects, defaultSubjectId, onSave, onClose }) {
  const [form, setForm] = useState(() => q ? {
    subjectId: q.subjectId,
    type: q.type,
    stem: q.stem,
    options: [...q.options, "", "", "", ""].slice(0, 4),
    answer: q.answer,
    explanation: q.explanation || "",
    tags: (q.tags || []).join("、"),
  } : {
    subjectId: defaultSubjectId || (subjects[0] && subjects[0].id),
    type: "single",
    stem: "",
    options: ["", "", "", ""],
    answer: [],
    explanation: "",
    tags: "",
  });

  const toggleAnswer = (L) => {
    setForm(f => {
      if (f.type === "single") return { ...f, answer: [L] };
      const has = f.answer.includes(L);
      return { ...f, answer: has ? f.answer.filter(x => x !== L) : [...f.answer, L].sort() };
    });
  };

  const submit = () => {
    if (!form.stem.trim()) return alert("請輸入題幹");
    const opts = form.options.map(o => o.trim()).filter(Boolean);
    if (opts.length < 2) return alert("至少需要 2 個選項");
    if (form.answer.length === 0) return alert("請選擇正確答案");
    if (form.type === "multi" && form.answer.length < 2) return alert("複選題答案至少 2 項");

    onSave({
      ...(q || {}),
      subjectId: form.subjectId,
      type: form.type,
      stem: form.stem.trim(),
      options: opts,
      answer: form.answer.filter(L => opts[L.charCodeAt(0) - 65]),
      explanation: form.explanation.trim(),
      tags: form.tags.split(/[、,，\s]+/).map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <Modal title={q ? "編輯題目" : "新增題目"} onClose={onClose} footer={
      <>
        <button className="btn btn-ghost" onClick={onClose}>取消</button>
        <button className="btn btn-primary" onClick={submit}><Icon.check />儲存</button>
      </>
    }>
      <div className="row">
        <div className="field">
          <label className="field-label">所屬科目</label>
          <select className="select" value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">題型</label>
          <select className="select" value={form.type} onChange={e => setForm({...form, type: e.target.value, answer: []})}>
            <option value="single">單選題</option>
            <option value="multi">複選題</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label">題幹</label>
        <textarea className="textarea" value={form.stem} onChange={e => setForm({...form, stem: e.target.value})} rows={3} placeholder="輸入完整題目敘述…"/>
      </div>

      <div className="field">
        <label className="field-label">選項（標準 4 個；點擊圓圈設定為正確答案）</label>
        {form.options.map((opt, i) => {
          const L = "ABCD"[i];
          const selected = form.answer.includes(L);
          return (
            <div key={L} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
              <button onClick={() => toggleAnswer(L)} style={{
                width:28, height:28, borderRadius:"50%",
                border:"1.5px solid " + (selected ? "var(--ok)" : "var(--line-strong)"),
                background: selected ? "var(--ok)" : "transparent",
                color: selected ? "#fff" : "var(--ink-3)",
                fontWeight:600, fontFamily:"JetBrains Mono", fontSize:12,
                display:"grid", placeItems:"center", flex:"none"
              }} title="點擊設為正解">{L}</button>
              <input className="input" value={opt} onChange={e => {
                const opts = [...form.options]; opts[i] = e.target.value; setForm({...form, options: opts});
              }} placeholder={`選項 ${L}…`}/>
            </div>
          );
        })}
      </div>

      <div className="field">
        <label className="field-label">解析（選填）</label>
        <textarea className="textarea" value={form.explanation} onChange={e => setForm({...form, explanation: e.target.value})} rows={3} placeholder="正解依據、條文、重點提示…"/>
      </div>

      <div className="field">
        <label className="field-label">標籤（以頓號、逗號或空白分隔）</label>
        <input className="input" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="如：ESG、第28條、115預測"/>
      </div>
    </Modal>
  );
}

// ============ Subject Editor ============
function SubjectEditor({ subject, onSave, onClose, onDelete }) {
  const [form, setForm] = useState({
    name: subject?.name || "",
    short: subject?.short || "",
    description: subject?.description || "",
    color: subject?.color || "oklch(0.55 0.13 222)",
  });
  const palette = [
    "oklch(0.55 0.13 222)",
    "oklch(0.58 0.11 200)",
    "oklch(0.55 0.12 80)",
    "oklch(0.55 0.13 30)",
    "oklch(0.55 0.13 150)",
    "oklch(0.5 0.14 310)",
    "oklch(0.5 0.12 260)",
  ];

  const submit = () => {
    if (!form.name.trim()) return alert("請輸入科目名稱");
    onSave({
      ...(subject || {}),
      name: form.name.trim(),
      short: form.short.trim() || form.name.trim().slice(0,2),
      description: form.description.trim(),
      color: form.color,
    });
  };

  return (
    <Modal title={subject ? "編輯科目" : "新增科目"} onClose={onClose} footer={
      <>
        {subject && <button className="btn btn-ghost" style={{color:"var(--warn-ink)"}} onClick={() => onDelete(subject.id)}><Icon.trash />刪除整科</button>}
        <div style={{flex:1}} />
        <button className="btn btn-ghost" onClick={onClose}>取消</button>
        <button className="btn btn-primary" onClick={submit}><Icon.check />儲存</button>
      </>
    }>
      <div className="row">
        <div className="field">
          <label className="field-label">科目全名</label>
          <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="例：企業管理概要"/>
        </div>
        <div className="field">
          <label className="field-label">簡稱（顯示用）</label>
          <input className="input" value={form.short} onChange={e => setForm({...form, short: e.target.value})} placeholder="例：企管"/>
        </div>
      </div>
      <div className="field">
        <label className="field-label">說明</label>
        <textarea className="textarea" style={{minHeight:60,fontFamily:"inherit"}} value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} placeholder="這個科目的考點範圍…"/>
      </div>
      <div className="field">
        <label className="field-label">代表色</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {palette.map(c => (
            <button key={c} onClick={() => setForm({...form, color: c})} style={{
              width:32, height:32, borderRadius:8, background:c,
              boxShadow: form.color === c ? "0 0 0 2px var(--ink), 0 0 0 4px var(--surface)" : "none",
              border:"1px solid rgba(0,0,0,.05)"
            }}/>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// Expose to other Babel-transpiled scripts
Object.assign(window, { Icon, useToast, Modal, QuestionCard, QuestionEditor, SubjectEditor });
