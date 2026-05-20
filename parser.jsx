// Parser — turns pasted Chinese exam text into question objects.
// Supports flexible formats with Q1./1./Q1 numbering, (A)/A./A) option markers,
// and 「標準答案：X」or「答案：X」 answer lines.

function parseQuestionsFromText(raw) {
  if (!raw || !raw.trim()) return { questions: [], errors: [] };

  // Normalize: full-width to half-width for key markers, strip BOM
  let text = raw.replace(/\uFEFF/g, "");
  // Normalize line endings
  text = text.replace(/\r\n?/g, "\n");

  const questions = [];
  const errors = [];

  // Split into question blocks. Look for Q1./Q1 / 1./１． etc at line start OR after blank space.
  // Heuristic: split on /(?:^|\s)Q?(\d{1,3})[\.、:：]?\s*/m  -- but keep numbers.
  // Use a regex with capture groups to find question starts.
  const blockSplitter = /(?:^|\n)\s*[QqＱ]?\s*(\d{1,3})[\.、．:：\)]\s+/g;

  // Find all matches
  const matches = [];
  let m;
  while ((m = blockSplitter.exec(text)) !== null) {
    matches.push({ idx: m.index + m[0].length, num: parseInt(m[1], 10), startOfMatch: m.index });
  }
  if (matches.length === 0) {
    // Try a looser single-question parse — maybe user pasted one question without numbering
    const single = parseSingleBlock(text, 1);
    if (single.ok) return { questions: [single.q], errors: [] };
    return { questions: [], errors: ["找不到題號，請確認格式包含 Q1.、1. 或 1) 等開頭"] };
  }

  // Slice each block
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].idx;
    const end = i + 1 < matches.length ? matches[i+1].startOfMatch : text.length;
    const body = text.slice(start, end).trim();
    const result = parseSingleBlock(body, matches[i].num);
    if (result.ok) questions.push(result.q);
    else errors.push(`Q${matches[i].num}: ${result.err}`);
  }
  return { questions, errors };
}

function parseSingleBlock(body, num) {
  if (!body.trim()) return { ok: false, err: "空白題目" };

  // Find tags section first (tag-like 標籤：xxx)
  let tags = [];
  const tagMatch = body.match(/(?:標籤|tags?)[:：]\s*([^\n]+)/i);
  if (tagMatch) {
    tags = tagMatch[1].split(/[、,，\s]+/).filter(Boolean);
    body = body.replace(tagMatch[0], "");
  }

  // Find answer
  const ansMatch = body.match(/(?:標準答案|參考答案|答案|正解|Answer)[:：]?\s*\(?([A-Da-d、,，\s]+)\)?/);
  let answer = [];
  if (ansMatch) {
    answer = (ansMatch[1].toUpperCase().match(/[A-D]/g) || []);
  }

  // Find explanation (出題官解析 / 解析 / 解說)
  let explanation = "";
  const explMatch = body.match(/(?:出題官解析|解析|解說|說明)[:：]?\s*([\s\S]*?)$/);
  if (explMatch) {
    explanation = explMatch[1].trim();
    // Stop at next answer/section marker if present
    explanation = explanation.split(/(?:標準答案|參考答案|答案|正解|Answer)[:：]/)[0].trim();
  }

  // Now, what's left before 標準答案 is the stem + options
  let head = body;
  if (ansMatch) head = body.slice(0, body.indexOf(ansMatch[0]));
  head = head.trim();

  // Extract options
  // Options can be: (A) ... (B) ...  / A. ... B. ... / A) ... / Ａ．
  // Greedy approach: capture each option block from one marker to the next
  const optRe = /(?:^|\n|\s)[\(（]?([A-Da-d])[\)）\.、：:]\s*([^\n]*?)(?=(?:[\(（]?[A-Da-d][\)）\.、：:]\s)|$)/g;
  // The above regex is fragile. Use a simpler approach: split on /[\(（]?([A-D])[\)）\.、：:]\s*/
  const optParts = [];
  const optRegex = /[\(（]?([A-Da-d])[\)）\.、：:]\s*/g;
  let lastIdx = -1, lastLetter = null;
  let mm;
  while ((mm = optRegex.exec(head)) !== null) {
    if (lastLetter !== null) {
      optParts.push({ letter: lastLetter, text: head.slice(lastIdx, mm.index).trim() });
    }
    lastLetter = mm[1].toUpperCase();
    lastIdx = mm.index + mm[0].length;
  }
  if (lastLetter !== null) {
    optParts.push({ letter: lastLetter, text: head.slice(lastIdx).trim() });
  }

  // Need at least 2 options; ideally 4 (A,B,C,D)
  const stem = lastLetter !== null
    ? head.slice(0, head.indexOf(optParts[0] ? findOptionMarker(head, optParts[0].letter) : "")).trim()
    : head.trim();

  // De-dupe letters; ensure A→D order
  const byLetter = {};
  optParts.forEach(p => { if (!byLetter[p.letter]) byLetter[p.letter] = p.text; });
  const options = ["A","B","C","D"].map(L => byLetter[L]).filter(Boolean);

  if (!stem) return { ok: false, err: "未偵測到題幹文字" };
  if (options.length < 2) return { ok: false, err: `選項不足（偵測到 ${options.length} 個）` };
  if (answer.length === 0) return { ok: false, err: "未偵測到答案行" };

  // Clean stem of any residual leading colon or whitespace
  const cleanStem = stem.replace(/^[、，,；;:：\s]+/, "").replace(/[\s]+$/, "");

  const type = answer.length >= 2 ? "multi" : "single";

  return {
    ok: true,
    q: {
      type,
      stem: cleanStem,
      options,
      answer,
      explanation,
      tags,
    }
  };
}

function findOptionMarker(text, letter) {
  // Find the marker for letter A, B, C, D in text
  const re = new RegExp("[\\(（]?" + letter + "[\\)）\\.、：:]");
  const m = text.match(re);
  return m ? m[0] : "";
}

window.parseQuestionsFromText = parseQuestionsFromText;
