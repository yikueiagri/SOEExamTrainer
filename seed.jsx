// Seed data - initial questions parsed from the user's provided exam material.

const SEED_SUBJECTS = [
  {
    "id": "biz",
    "name": "企業管理概要",
    "short": "企管",
    "color": "oklch(0.55 0.13 222)",
    "description": "管理學派、企業機能（行銷/生產/人資/財務）、戰略分析、現代管理趨勢"
  },
  {
    "id": "water",
    "name": "自來水法及營業章程",
    "short": "水法",
    "color": "oklch(0.58 0.11 200)",
    "description": "純法規背誦：數字、罰則、定義、權責、例外狀況"
  },
  {
    "id": "lang",
    "name": "國文及英文",
    "short": "國英",
    "color": "oklch(0.55 0.12 80)",
    "description": "國學常識、應用文、書信題辭、英文文法、職場情境對話"
  }
];

const SEED_QUESTIONS = [
  {
    "subjectId": "biz",
    "type": "single",
    "tags": [
      "ESG",
      "永續經營",
      "115預測"
    ],
    "stem": "隨著全球對環境保護的重視，台水公司也積極推動 ESG 永續治理。下列關於 ESG 三大構面的指標分類，何者「不屬於」環境（Environmental）構面的評估範疇？",
    "options": [
      "溫室氣體排放與碳中和進程",
      "水資源循環利用與廢棄物管理",
      "生物多樣性維護",
      "職場勞工安全與多元包容人權標準"
    ],
    "answer": [
      "D"
    ],
    "explanation": "選項 (D) 的勞工安全、人權、多元包容屬於 S（Social，社會責任）構面，而非 E（Environmental，環境）構面。",
    "seed_id": "seed_biz_01"
  },
  {
    "subjectId": "biz",
    "type": "multi",
    "tags": [
      "SWOT",
      "TOWS",
      "策略矩陣",
      "115預測"
    ],
    "stem": "企業在進行外部環境與內部條件分析時，常將 SWOT 分析延伸為 TOWS 交叉矩陣以擬定具體戰略。下列關於 TOWS 矩陣策略配適的敘述，哪些選項完全正確？",
    "options": [
      "SO策略（增長戰略）：企業應投入資源，運用內部優勢來極大化外部機會",
      "ST策略（多元化戰略）：企業應利用內部優勢，來規避或降低外部威脅的衝擊",
      "WO策略（扭轉戰略）：企業應利用外部機會，來克服、改善或彌補內部的劣勢",
      "WT策略（防禦戰略）：企業面臨內部劣勢與外部威脅雙重夾擊，應採取收縮或退出策略以將風險降到最低"
    ],
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "TOWS 矩陣常見策略為 SO（運用優勢掌握機會）、ST（運用優勢降低威脅，部分教材稱多元化或抗威脅策略）、WO（改善弱勢掌握機會）、WT（降低弱勢並避開威脅），故四項皆屬常見說明。",
    "seed_id": "seed_biz_02"
  },
  {
    "subjectId": "biz",
    "type": "single",
    "tags": [
      "BEP",
      "損益兩平",
      "規劃工具"
    ],
    "stem": "台水公司在規畫年度營運目標時，若欲計算出在既定的固定成本與變動成本下，當年度「水費收入總額」恰好等於「總營運成本」時的最低供水量，此管理學上的規畫工具稱為：",
    "options": [
      "線性規劃 (Linear Programming)",
      "計畫評核術 (PERT)",
      "損益兩平分析 (Break-Even Analysis)",
      "因素分析 (Factor Analysis)"
    ],
    "answer": [
      "C"
    ],
    "explanation": "損益兩平點（BEP）即利潤為零（總收入＝總成本）的臨界點分析。",
    "seed_id": "seed_biz_03"
  },
  {
    "subjectId": "biz",
    "type": "single",
    "tags": [
      "安索夫矩陣",
      "Ansoff",
      "行銷戰略"
    ],
    "stem": "許多傳統茶飲店近年面臨市場飽和，紛紛選擇「沿用原有的茶飲產品」，但積極開拓先前未曾接觸過的「海外東南亞市場」。依據安索夫（Ansoff）產品市場擴張矩陣，這屬於哪種戰略？",
    "options": [
      "市場滲透 (Market Penetration)",
      "市場開發 (Market Development)",
      "產品開發 (Product Development)",
      "多角化 (Diversification)"
    ],
    "answer": [
      "B"
    ],
    "explanation": "現有產品 × 新市場 = 市場開發（Market Development）。",
    "seed_id": "seed_biz_04"
  },
  {
    "subjectId": "biz",
    "type": "single",
    "tags": [
      "JIT",
      "豐田",
      "精實生產"
    ],
    "stem": "豐田汽車（Toyota）開創的精實生產系統中，強調「只有在下游製程有需求時，才向前游製程看板提領物料」，藉此達成零庫存與降低浪費的目的。此生產管理邏輯稱為：",
    "options": [
      "物料需求規劃 (MRP)",
      "即時存貨系統 (JIT)",
      "企業資源規劃 (ERP)",
      "批量生產系統 (Batch Production)"
    ],
    "answer": [
      "B"
    ],
    "explanation": "JIT 利用「拉式（Pull）系統」與看板管理，是現代作業管理的核心考點。",
    "seed_id": "seed_biz_05"
  },
  {
    "subjectId": "biz",
    "type": "single",
    "tags": [
      "速動比率",
      "財務比率"
    ],
    "stem": "若某企業的流動資產為 100 萬（其中存貨佔了 30 萬、預付費用佔 10 萬），流動負債為 50 萬，則該企業的「速動比率（Quick Ratio）」應為多少？",
    "options": [
      "200%",
      "140%",
      "120%",
      "60%"
    ],
    "answer": [
      "C"
    ],
    "explanation": "速動比率 = (流動資產 − 存貨 − 預付費用) ÷ 流動負債 = (100 − 30 − 10) ÷ 50 = 120%。",
    "seed_id": "seed_biz_06"
  },
  {
    "subjectId": "biz",
    "type": "single",
    "tags": [
      "赫茲伯格",
      "雙因素理論",
      "激勵"
    ],
    "stem": "依據赫茲伯格（Herzberg）提出的雙因素理論（Two-Factor Theory），下列哪一項因素若獲得改善，「只能消除員工的不滿，但無法真正達到激勵、提升工作績效」的效果？",
    "options": [
      "充滿挑戰性的工作內容",
      "工作所帶來的成就感與讚賞",
      "薪資福利、公司政策與工作環境",
      "職位晉升與未來的發展機會"
    ],
    "answer": [
      "C"
    ],
    "explanation": "薪資、工作環境、公司政策屬於「保健因素」，改善只能維持現狀、消除不滿，無法激勵。",
    "seed_id": "seed_biz_07"
  },
  {
    "subjectId": "biz",
    "type": "single",
    "tags": [
      "ESG"
    ],
    "stem": "當企業在決策時，全面評估其對環境（Environment）、社會（Social）與公司治理（Governance）的衝擊與承擔，這在現代管理學中統稱為：",
    "options": [
      "MBO",
      "TQM",
      "BCG",
      "ESG"
    ],
    "answer": [
      "D"
    ],
    "explanation": "ESG 三大支柱對應環境、社會、公司治理，是現代管理學最熱門的永續治理關鍵字。",
    "seed_id": "seed_biz_08"
  },
  {
    "subjectId": "biz",
    "type": "multi",
    "tags": [
      "波特",
      "競爭策略"
    ],
    "stem": "麥可·波特（Michael Porter）教授除了提出著名的五力分析外，也提出了三種「總體競爭策略（Generic Strategies）」。下列哪些策略屬於其範疇？",
    "options": [
      "成本領導策略 (Cost Leadership)",
      "差異化策略 (Differentiation)",
      "集中化策略 (Focus)",
      "藍海策略 (Blue Ocean)"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "藍海策略由金偉燦提出，不屬於波特的古典理論範疇。",
    "seed_id": "seed_biz_09"
  },
  {
    "subjectId": "biz",
    "type": "multi",
    "tags": [
      "決策偏誤",
      "認知偏差"
    ],
    "stem": "管理者在面臨決策時，常因心理認知偏差而導致決策失誤。下列關於決策偏誤（Decision Biases）的名詞敘述，哪些選項正確？",
    "options": [
      "沉沒成本謬誤：決策者在做新決策時，過度考慮過去已經投入且無法回收的資源",
      "承諾升級：即便已有明確證據顯示先前的決策是錯誤的，管理者卻因面子或責任感而持續對該錯誤項目追加投入資源",
      "錨定效應：決策者過度依賴最初接收到的片面資訊，進而限制了後續對全面資料的客觀評估",
      "有限理性：人在決策時具有完美的資訊搜集能力，能做出絕對理性且利潤最大化的最完美方案"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "有限理性由賽門（Simon）提出，強調人受限於資訊、時間、大腦，僅能追求「滿意方案」。",
    "seed_id": "seed_biz_10"
  },
  {
    "subjectId": "biz",
    "type": "multi",
    "tags": [
      "矩陣式組織",
      "組織結構"
    ],
    "stem": "關於「矩陣式組織結構（Matrix Structure）」的特點，下列哪些敘述完全正確？",
    "options": [
      "它打破了傳統法約爾（Fayol）所主張的「指揮統一原則」",
      "員工通常會同時接受「功能部門主管」與「專案項目主管」的雙重指揮",
      "它的優點是具有高度的彈性，能跨部門快速調動資源以因應外部環境變化",
      "它的缺點是權責分明、階級嚴明，容易導致部門間推諉、死板且缺乏橫向溝通"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "(D) 為官僚／機械式組織的缺點，並非矩陣式組織。",
    "seed_id": "seed_biz_11"
  },
  {
    "subjectId": "biz",
    "type": "multi",
    "tags": [
      "STP",
      "行銷"
    ],
    "stem": "下列關於 STP 內容的拆解，哪些選項正確？",
    "options": [
      "S 代表市場區隔 (Market Segmentation)，將大市場依消費者特徵切分為數個同質小市場",
      "T 代表目標市場選擇 (Target Marketing)，評估並挑選出一或多個最具潛力的小市場投入",
      "P 代表產品定位 (Product Positioning)，在目標消費者心中建立獨特且無法取代的品牌形象",
      "S 代表善因行銷 (Cause-Related Marketing)，強調結合社會公益來銷售產品"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "(D) 將 S 解釋為善因行銷屬於故意混淆的干擾項。",
    "seed_id": "seed_biz_12"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "第2條",
      "主管機關"
    ],
    "stem": "依《自來水法》第2條規定，自來水事業之主管機關，在中央應為下列哪一個機關？",
    "options": [
      "內政部",
      "衛生福利部",
      "水利主管機關",
      "環境保護部"
    ],
    "answer": [
      "C"
    ],
    "explanation": "《自來水法》第2條第1項：自來水事業之主管機關在中央為水利主管機關（即經濟部水利署）。",
    "seed_id": "seed_water_01"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "專營權",
      "第28條"
    ],
    "stem": "依《自來水法》第28條規定，自來水事業專營權之有效期間為多久？",
    "options": [
      "十年",
      "二十年",
      "三十年",
      "四十年"
    ],
    "answer": [
      "C"
    ],
    "explanation": "專營權有效期間為三十年。",
    "seed_id": "seed_water_02"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "營業章程",
      "一度水"
    ],
    "stem": "依《台灣自來水公司營業章程》第22條規定，用戶用水量以度數計算，所謂的「一度」水量是指多少？",
    "options": [
      "每一立方公尺",
      "每十立方公尺",
      "每百立方公尺",
      "每千立方公尺"
    ],
    "answer": [
      "A"
    ],
    "explanation": "每立方公尺水量為一度。",
    "seed_id": "seed_water_03"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "臨時用水",
      "保證金"
    ],
    "stem": "依《台灣自來水公司營業章程》第38條規定，申請臨時用水者應繳付水費保證金，其數額依法應以預估幾個月之水費為基準？",
    "options": [
      "一個月",
      "二個月",
      "三個月",
      "六個月"
    ],
    "answer": [
      "B"
    ],
    "explanation": "臨時用水保證金以預估二個月之水費為準。",
    "seed_id": "seed_water_04"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "遲延繳付費",
      "寬限期"
    ],
    "stem": "依《台灣自來水公司營業章程》第33條規定，自來水用戶逾繳費期限於幾日內繳費者，可免計遲延繳付費？",
    "options": [
      "3天",
      "5天",
      "7天",
      "14天"
    ],
    "answer": [
      "C"
    ],
    "explanation": "逾繳費期限七天內繳費者免計遲延繳付費。",
    "seed_id": "seed_water_05"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "竊水",
      "罰則",
      "刑期"
    ],
    "stem": "依《自來水法》第98條規定，有竊水行為者，依法最高可處幾年以下有期徒刑？",
    "options": [
      "一年",
      "二年",
      "三年",
      "五年"
    ],
    "answer": [
      "D"
    ],
    "explanation": "竊水行為人處五年以下有期徒刑、拘役或五百元以下罰金。",
    "seed_id": "seed_water_06"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "追償",
      "竊水"
    ],
    "stem": "依《自來水法》第71條規定，自來水事業對於竊水者，應按其所裝用水設備及供水狀況等，追償多久期間之水費？",
    "options": [
      "3個月以上6個月以下",
      "3個月以上1年以下",
      "6個月以上1年以下",
      "1年以上2年以下"
    ],
    "answer": [
      "B"
    ],
    "explanation": "對於竊水者追償三個月以上一年以下之水費。",
    "seed_id": "seed_water_07"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "外線",
      "定義"
    ],
    "stem": "依《台灣自來水公司營業章程》第11條規定，在未設置總量水器時，用戶用水設備之「外線」是指何處至量水器間之設備？",
    "options": [
      "淨水廠",
      "配水管",
      "導水管",
      "分水栓"
    ],
    "answer": [
      "B"
    ],
    "explanation": "外線指配水管至量水器（水量計、水表）間之設備。",
    "seed_id": "seed_water_08"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "超收",
      "罰鍰倍數"
    ],
    "stem": "依《自來水法》第104條規定，自來水事業於法令核定之營業規則外，向用戶收取任何費用者，處其超收總額幾倍之罰鍰？",
    "options": [
      "1倍",
      "2倍",
      "3倍",
      "5倍"
    ],
    "answer": [
      "C"
    ],
    "explanation": "處超收總額三倍之罰鍰。",
    "seed_id": "seed_water_09"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "停水",
      "基本費扣減"
    ],
    "stem": "依《台灣自來水公司營業章程》第32條規定，本公司因不可抗力之事由致停止供水連續超過多少小時者，當月基本費按停水日數比例扣減？",
    "options": [
      "12小時",
      "24小時",
      "48小時",
      "72小時"
    ],
    "answer": [
      "B"
    ],
    "explanation": "連續超過二十四小時者，當月基本費按停水日數比例扣減。",
    "seed_id": "seed_water_10"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "市政公共用水",
      "減收"
    ],
    "stem": "依《台灣自來水公司營業章程》第36條規定，市政公共用水之水費，按普通用水水價減收百分之多少？",
    "options": [
      "20%",
      "30%",
      "50%",
      "60%"
    ],
    "answer": [
      "C"
    ],
    "explanation": "市政公共用水之水費，按普通用水水價減收百分之五十。",
    "seed_id": "seed_water_11"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "違規用水",
      "追收"
    ],
    "stem": "依《台灣自來水公司營業章程》第35條規定，用戶未經申請私自變更用水用途，如費率高於變更前者，台水公司最高得追收幾個月之水費差額？",
    "options": [
      "3個月",
      "4個月",
      "5個月",
      "6個月"
    ],
    "answer": [
      "D"
    ],
    "explanation": "得視情節追收水費差額，最高以六個月為限。",
    "seed_id": "seed_water_12"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "按口計費"
    ],
    "stem": "依《台灣自來水公司營業章程》第29條規定，因特殊情形採按口計費之普通用水用戶，其水費以每人每月多少度計算？",
    "options": [
      "3度",
      "5度",
      "6度",
      "8度"
    ],
    "answer": [
      "B"
    ],
    "explanation": "按口計費以每人每月五度計算。",
    "seed_id": "seed_water_13"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "臨時用水",
      "加收"
    ],
    "stem": "依《台灣自來水公司營業章程》第37條規定，除了「違章臨時用水」外，其餘臨時用水之水費應按普通用水水價加收百分之幾收取？",
    "options": [
      "20%",
      "30%",
      "40%",
      "50%"
    ],
    "answer": [
      "D"
    ],
    "explanation": "違章臨時用水加收20%，其餘臨時用水均加收50%。",
    "seed_id": "seed_water_14"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "繳費期限"
    ],
    "stem": "依《台灣自來水公司營業章程》第33條規定，用戶應繳納之水費，應於通知之繳費日起算幾日內之繳費期限繳付？",
    "options": [
      "14日",
      "21日",
      "30日",
      "60日"
    ],
    "answer": [
      "B"
    ],
    "explanation": "用戶應繳水費應於通知繳費日起二十一日內繳付。",
    "seed_id": "seed_water_15"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "停水",
      "公告"
    ],
    "stem": "依《自來水法》第62條及營業章程第5條規定，自來水事業若有特殊情形，必須連續停水達多少小時以上時，應先申請所在地主管機關核准，並公告周知？",
    "options": [
      "12小時",
      "24小時",
      "36小時",
      "48小時"
    ],
    "answer": [
      "A"
    ],
    "explanation": "連續停水達十二小時以上或定時供水者，應先申請主管機關核准並公告周知。",
    "seed_id": "seed_water_16"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "水籍註銷"
    ],
    "stem": "依《台灣自來水公司營業章程》第9條規定，用戶申辦停用或因欠費被停止供水，若逾多久時間未復用者，本公司得逕行註銷其水籍？",
    "options": [
      "半年",
      "一年",
      "二年",
      "三年"
    ],
    "answer": [
      "C"
    ],
    "explanation": "停用或停止供水逾二年未復用者，得註銷其水籍。",
    "seed_id": "seed_water_17"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "量水器",
      "故障"
    ],
    "stem": "依《台灣自來水公司營業章程》第25條規定，若「大用水戶及機關用戶」之量水器發生故障致計量不準，本公司得按其失效前幾期之正常用水平均度數核算水費？",
    "options": [
      "一期",
      "兩期",
      "三期",
      "四期"
    ],
    "answer": [
      "C"
    ],
    "explanation": "一般用戶按前兩期，大用水戶及機關用戶按失效前三期之正常用水平均度數核算。",
    "seed_id": "seed_water_18"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "遲延繳付費",
      "下限"
    ],
    "stem": "依《台灣自來水公司營業章程》第33條規定，用戶若逾期繳費被加收遲延繳付費，若經計算後其遲延繳付費未滿多少元者，一律以該金額計收？",
    "options": [
      "新台幣五元",
      "新台幣十元",
      "新台幣二十元",
      "免予計收"
    ],
    "answer": [
      "A"
    ],
    "explanation": "遲延繳付費未滿新台幣五元者，以新台幣五元計。",
    "seed_id": "seed_water_19"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "自用自來水設備",
      "第21條"
    ],
    "stem": "依《自來水法》第21條規定，所稱「自用自來水設備」，是指專供自用之自來水設備，且其每日出水能力（出水量）在多少立方公尺以上者？",
    "options": [
      "二十立方公尺",
      "三十立方公尺",
      "五十立方公尺",
      "六十立方公尺"
    ],
    "answer": [
      "B"
    ],
    "explanation": "專供自用且出水量每日在三十立方公尺以上者。",
    "seed_id": "seed_water_20"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "停水",
      "催繳"
    ],
    "stem": "依據《台灣自來水公司營業章程》第39條規定，用戶若有欠繳應付各項費用之情形，經台水公司限期催繳後仍不清付者，逾期達多久時間，台水公司得予停止供水？",
    "options": [
      "半個月",
      "一個月",
      "二個月",
      "三個月"
    ],
    "answer": [
      "B"
    ],
    "explanation": "自來水法第 67 條規定，自來水事業對消防用水不得收取水費；對其他有關市政之公共用水應予以優待，其優待辦法由所在地主管機關訂定之。因此不是由中央主管機關會同內政部訂定。",
    "seed_id": "seed_water_21"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "市政公共用水",
      "權責"
    ],
    "stem": "依《自來水法》第67條規定，市政公共用水之優待辦法，依法應由下列何者定之？",
    "options": [
      "經濟部（中央主管機關）",
      "自來水事業所在地之直轄市、縣（市）政府",
      "中央主管機關會同內政部",
      "水價評議委員會"
    ],
    "answer": [
      "C"
    ],
    "explanation": "自來水法第67條：市政公共用水之優待辦法，由中央主管機關會同內政部定之。考生常誤選地方政府。",
    "seed_id": "seed_water_22"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "水源保育與回饋費"
    ],
    "stem": "依《自來水法》第 12-2 條規定，於水質水量保護區內取用地面水或地下水之公共給水公用事業，得於其公用事業費用（水費）之外，附徵多少比例之費額？",
    "options": [
      "百分之一以上百分之五以下",
      "百分之三以上百分之十以下",
      "百分之五以上百分之十五以下",
      "百分之七以上百分之二十以下"
    ],
    "answer": [
      "C"
    ],
    "explanation": "得於公用事業費用外附徵百分之五以上百分之十五以下之費額。",
    "seed_id": "seed_water_23"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "復水",
      "基本費"
    ],
    "stem": "若某用戶因欠費被停止供水，在其停水原因消滅並申請復水時，若其「停水期間在二年以下者」，除復水費及積欠費用外，應按用水設備口徑繳納停水期間多少比例之基本費？",
    "options": [
      "全額繳納",
      "三分之二基本費",
      "二分之一基本費",
      "免予繳納"
    ],
    "answer": [
      "C"
    ],
    "explanation": "營業章程第9條第2項：應按用水設備口徑，繳納停水期間二分之一基本費。",
    "seed_id": "seed_water_24"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "遲延繳付費",
      "加收比例"
    ],
    "stem": "依《台灣自來水公司營業章程》第 33 條規定，用戶若逾期繳納水費，自繳費期限截止後起算，於第幾天起至第十四天繳費者，台水公司將按應繳水費之「百分之一」加收遲延繳付費？",
    "options": [
      "第五天",
      "第七天",
      "第八天",
      "第十五天"
    ],
    "answer": [
      "C"
    ],
    "explanation": "逾期 7 天內免計；自第八天起至第十四天繳費者，加收百分之一遲延費。",
    "seed_id": "seed_water_25"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "臨時用水",
      "違章"
    ],
    "stem": "下列哪一種臨時用水種類，「並非」加收百分之五十，而是「按普通用水水價加收百分之二十」計收水費？",
    "options": [
      "建物改建用水",
      "以建築執照申請之工程用水",
      "經前臺灣省政府核准之違章臨時用水",
      "經主管機關核准之短期活動用水"
    ],
    "answer": [
      "C"
    ],
    "explanation": "違章臨時用水加收20%，其餘臨時用水均加收50%。",
    "seed_id": "seed_water_26"
  },
  {
    "subjectId": "water",
    "type": "single",
    "tags": [
      "水質水量保護區",
      "例外"
    ],
    "stem": "依《自來水法》第 11 條規定，下列哪一項行為「並未」明確列在該條文所列舉的禁止或限制行為中？",
    "options": [
      "高爾夫球場之興建或擴建",
      "核能或其他能源之開發、放射性廢棄物儲存場所之興建",
      "居民非營利之家用生活耕作或非營利公共設施",
      "土石採取或探礦、採礦致污染水源"
    ],
    "answer": [
      "C"
    ],
    "explanation": "第11條第2項但書：居民生活或地方公共建設所必要且經主管機關核准者，不在此限。",
    "seed_id": "seed_water_27"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "供水種類"
    ],
    "stem": "依《台灣自來水公司營業章程》第4條規定，本公司所規範之供水種類包括下列哪些選項？",
    "options": [
      "農業用水",
      "工業用水",
      "船舶用水",
      "臨時用水"
    ],
    "answer": [
      "B",
      "C",
      "D"
    ],
    "explanation": "六種供水種類：普通、工業、商業、船舶、市政公共、臨時用水，「不包含」農業用水。",
    "seed_id": "seed_water_28"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "代收費用"
    ],
    "stem": "依《台灣自來水公司營業章程》第26條規定，下列哪些費用屬於台水公司「得依法隨水費附徵或代收」之費用項目？",
    "options": [
      "水源保育與回饋費",
      "清除處理費",
      "污水下水道使用費",
      "水污染防治費"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "得代收：水源保育與回饋費、清除處理費、污水下水道使用費；水污染防治費非屬代收範圍。",
    "seed_id": "seed_water_29"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "水質水量保護區"
    ],
    "stem": "依《自來水法》第11條規定，主管機關劃定公布水質水量保護區後，依法應禁止或限制下列哪些貽害水質與水量之行為？",
    "options": [
      "濫伐林木或濫墾土地",
      "設置垃圾掩埋場或焚化爐",
      "興建或擴建高爾夫球場",
      "露營或一般觀光健行"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "一般觀光健行或露營未列在法定的禁止或限制行為中。",
    "seed_id": "seed_water_30"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "稅賦減免"
    ],
    "stem": "依《自來水法》第12-1條規定，水質水量保護區依都市計畫程序劃定為水源特定區者，其土地應視限制程度減免下列哪些稅賦？",
    "options": [
      "土地增值稅",
      "贈與稅",
      "遺產稅",
      "所得稅"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "營業章程第 26 條規定，除水費外，水源保育與回饋費、清除處理費、污水下水道使用費等得隨同水費收取；現行章程亦包含代管或接管之操作維護費。本題選項中 D 水污染防治費非屬此列。",
    "seed_id": "seed_water_31"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "專營權證"
    ],
    "stem": "依《自來水法》第27條規定，自來水事業專營權證上應明確載明下列哪些事項？",
    "options": [
      "水權證字號",
      "供水區域",
      "資本總額",
      "預估營業收入"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "專營權證應載明：名稱及所在地、負責人、水權證字號、供水區域、主要供水設備、資本總額等；預估營業收入不屬於記載項目。",
    "seed_id": "seed_water_32"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "必要設備",
      "第43條"
    ],
    "stem": "依《自來水法》第43條規定，自來水事業依法應具有必要之設備，下列哪些選項屬於法律規定的必要設備？",
    "options": [
      "取水設備及貯水設備",
      "導水設備及淨水設備",
      "送水設備及配水設備",
      "海水淡化設備"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "必要設備：取水、貯水、導水、淨水、送水、配水（共六大設備）。",
    "seed_id": "seed_water_33"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "停水事由"
    ],
    "stem": "依《台灣自來水公司營業章程》第39條規定，用戶有下列哪些情形之一時，台水公司得予停止供水？",
    "options": [
      "有竊水行為，證據確實者",
      "欠繳應付各費逾期二個月，經限期催繳仍不清付者",
      "無正當理由拒絕本公司檢查其用水設備或用水情形者",
      "月用水度數連續三個月出現暴增者"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "用水度數暴增不屬於可依法停水的事由。",
    "seed_id": "seed_water_34"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "竊水行為"
    ],
    "stem": "依《台灣自來水公司營業章程》第40條及《自來水法》第98條規定，下列哪些行為屬於依法認定的「竊水」行為？",
    "options": [
      "未經本公司許可，在本公司供水管線上取水者",
      "繞越所裝量水器私接水管者",
      "毀損或改變量水器之構造致量水器失效或不準確者",
      "用戶自行雇用不具證照之技工更換內線水龍頭者"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "自行更換水龍頭與竊水無涉。",
    "seed_id": "seed_water_35"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "臨時用水",
      "分類"
    ],
    "stem": "依《台灣自來水公司營業章程》第37條規定，下列哪些選項屬於台水公司規定的「臨時用水」分類範疇？",
    "options": [
      "建物改建：建築物拆除或重建時之短期用水",
      "工程用水：以建築執照申請之工程用水",
      "違章臨時用水：經前臺灣省政府核准之違章建築用水",
      "農業灌溉：因天旱臨時申請之農業救荒用水"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "農業灌溉不屬於台水規定的臨時用水分類。",
    "seed_id": "seed_water_36"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "白晝檢查"
    ],
    "stem": "依《台灣自來水公司營業章程》第18條規定，台水公司得派穿著制服並配戴識別證之員工或委外承攬人員或委外承攬人員，於「白晝」非有正當理由用戶不得拒絕進入執行下列哪些事項？",
    "options": [
      "查錄用水量",
      "檢查用戶用水設備",
      "封印、裝表或換表",
      "向用戶進行民意滿意度問卷調查"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "法定不得拒絕之檢查事項：檢查用水設備、查錄用水量、裝拆換表、封印、取締違章用水；並不包含推銷或問卷調查。",
    "seed_id": "seed_water_37"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "停水扣減"
    ],
    "stem": "依《台灣自來水公司營業章程》第32條規定，當發生不可抗力之事由導致台水公司必須停止供水時，關於用戶水費的扣減機制，下列哪些選項的敘述完全正確？",
    "options": [
      "停止供水連續超過二十四小時者，當月份「基本費」按停水日數比例扣減",
      "停水日數連續超過七十二小時者，另按停水一日扣減一日「用水費」",
      "同一停水事件累積停水超過六日者，另按停水一日扣減一日「用水費」",
      "用戶因不可抗力停水導致工廠停工之營業損失，得向台水公司申請全額民事賠償"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "依法允許之停水，不得要求任何損失賠償（自來水法第62條第2項及章程第5條第3項）。",
    "seed_id": "seed_water_38"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "竊水",
      "消防栓"
    ],
    "stem": "依《自來水法》第98條與《台灣自來水公司營業章程》第40條規定，下列哪些具體行為在法律定義上「即構成竊水行為」？",
    "options": [
      "未經自來水事業許可，在供水管線上取水者",
      "繞越所裝量水器私接水管者",
      "毀損或改變量水器之構造或用其他方式致量水器失效或不準確者",
      "因發生火災，附近居民未經許可自行開啟公用消防栓進行緊急滅火者"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "「未經許可擅自開啟消火栓取水者為竊水。但因消防需要而開啟，不在此限。」緊急滅火不屬於竊水。",
    "seed_id": "seed_water_39"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "承裝商",
      "違規處分"
    ],
    "stem": "依最新修正之《自來水法》規定，下列關於自來水管承裝商違規處分的敘述，哪些選項正確？",
    "options": [
      "自來水管承裝技術員工於施工時，未隨身攜帶工作證者，原登記政府應予警告處分",
      "承裝商違反規定，一年內受警告處分三次以上者，原登記政府應予六個月以上二年以下停業處分",
      "承裝商若出售或轉借營業許可證書給他人頂替使用者，主管機關應廢止其營業許可",
      "經依法廢止營業許可之承裝商，五年內不得再行申請許可"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "依第 93-3 條第 2 項：經廢止許可者，是「三年內」不得再行申請許可，而非五年。",
    "seed_id": "seed_water_40"
  },
  {
    "subjectId": "water",
    "type": "multi",
    "tags": [
      "簡易自來水事業"
    ],
    "stem": "依《自來水法》第 110 條規定，對於特定規模以下之「簡易自來水事業」，下列關於其規模界線之敘述，哪些正確？",
    "options": [
      "每日供水量在三千立方公尺以下之簡易自來水事業，得不適用本法有關民營股份有限公司之組織限制",
      "每日供水量在三百立方公尺以下之簡易自來水事業，得不適用本法有關聘僱技術人員資格之考驗限制",
      "每日供水量在三千立方公尺以下之簡易自來水事業，完全不適用本法，不受任何主管機關管理",
      "簡易自來水事業得由所有權人或管理委員會代表人申請自來水事業同意後，由自來水事業代管或接管其供水系統；代管或接管時設備移交依第 110-1 條辦理。"
    ],
    "answer": [
      "A",
      "B",
      "D"
    ],
    "explanation": "雖豁免部分法條，但仍須由直轄市或縣（市）主管機關另行訂定自治法規進行管理；故 (C) 錯誤。",
    "seed_id": "seed_water_41"
  },
  {
    "subjectId": "lang",
    "type": "single",
    "tags": [
      "應用文",
      "題辭"
    ],
    "stem": "台水營業所的陳課長近日「新居落成」，同仁們欲合資合購一面匾額送至其府上祝賀。下列哪一個題辭最適切？",
    "options": [
      "杏林春暖",
      "華堂煥彩",
      "業紹陶朱",
      "駕返西池"
    ],
    "answer": [
      "B"
    ],
    "explanation": "(A) 用於醫界開業；(B) 用於祝賀新居落成（正解）；(C) 用於祝賀商業開幕；(D) 用於哀悼老年女喪。",
    "seed_id": "seed_lang_01"
  },
  {
    "subjectId": "lang",
    "type": "single",
    "tags": [
      "英文文法",
      "動名詞"
    ],
    "stem": "The supervisor suggested ________ the regular safety inspection of the underground water pipes to prevent potential water leakage.",
    "options": [
      "to implement",
      "implementing",
      "implemented",
      "implement"
    ],
    "answer": [
      "B"
    ],
    "explanation": "動詞 suggest（建議）後若直接跟動詞，必須使用動名詞（V-ing），故選 (B) implementing。",
    "seed_id": "seed_lang_02"
  },
  {
    "subjectId": "lang",
    "type": "single",
    "tags": [
      "啟封詞",
      "書信"
    ],
    "stem": "台水公司的王經理因績效卓越，於年中榮升為總公司處長，同仁們欲合資贈送祝賀匾額。下列題辭何者「絕不可」用於賀人升遷？",
    "options": [
      "啟",
      "芳啟",
      "敬啟",
      "大啟"
    ],
    "answer": [
      "C"
    ],
    "explanation": "「德業長昭」屬哀悼男喪用語，用於升遷祝賀極為失禮，故為最不宜使用者。",
    "seed_id": "seed_lang_03"
  },
  {
    "subjectId": "lang",
    "type": "single",
    "tags": [
      "題辭",
      "升遷"
    ],
    "stem": "台水公司的王經理因績效卓越，於年中榮升為總公司處長，同仁們欲合資贈送祝賀匾額。下列題辭何者最不適合用於「賀人升遷」？",
    "options": [
      "青雲直上",
      "業紹陶朱",
      "功在桑梓",
      "德業長昭"
    ],
    "answer": [
      "D"
    ],
    "explanation": "(D)「德業長昭」是專用於「哀悼男喪」的輓聯題辭，絕不可用於升遷。",
    "seed_id": "seed_lang_04"
  },
  {
    "subjectId": "lang",
    "type": "single",
    "tags": [
      "古代文學家",
      "蘇軾"
    ],
    "stem": "閱讀下列這段文句，請根據情境與風格，判斷其評述的古代文學家是哪一位？「他的一生波瀾壯闊，雖因反對王安石新法而屢遭貶謫，最遠曾被貶至惠州與儋州。然而他生性豁達，在黃州時更寫下了流傳千古的赤壁賦與念奴嬌，其詞開創了宋代豪放派之先河。」",
    "options": [
      "韓愈",
      "柳宗元",
      "歐陽脩",
      "蘇軾"
    ],
    "answer": [
      "D"
    ],
    "explanation": "由「反對新法」、「黃州」、「赤壁賦」、「豪放派」鎖定蘇東坡（蘇軾）。",
    "seed_id": "seed_lang_05"
  },
  {
    "subjectId": "lang",
    "type": "single",
    "tags": [
      "英文單字",
      "conserve"
    ],
    "stem": "Because of the prolonged drought, the local government strongly urged citizens to ________ water in their daily lives.",
    "options": [
      "consume",
      "conserve",
      "contaminate",
      "convert"
    ],
    "answer": [
      "B"
    ],
    "explanation": "conserve（節約、保護）符合「節約用水」之意。",
    "seed_id": "seed_lang_06"
  },
  {
    "subjectId": "lang",
    "type": "single",
    "tags": [
      "英文文法",
      "suggest"
    ],
    "stem": "The engineer suggested ________ the old valves immediately to avoid water leakage in the residential area.",
    "options": [
      "replacement",
      "to replace",
      "replacing",
      "replaced"
    ],
    "answer": [
      "C"
    ],
    "explanation": "動詞 suggest 之後若直接加動詞作為受詞，必須使用動名詞（V-ing）。",
    "seed_id": "seed_lang_07"
  },
  {
    "subjectId": "lang",
    "type": "single",
    "tags": [
      "情境會話",
      "客訴"
    ],
    "stem": "Clerk: Good morning! Water Corporation. How can I help you? Customer: Hello, I noticed a sudden surge in my water bill this month, but my family's water usage hasn't changed. Clerk: ________. I can arrange for a technician to inspect your meter for leaks.",
    "options": [
      "I can't afford it",
      "I'm sorry to hear that",
      "It's none of my business",
      "Thanks for the vote of confidence"
    ],
    "answer": [
      "B"
    ],
    "explanation": "客戶抱怨水費突增，店員最合適的應答為「I'm sorry to hear that」，隨後提出解決方案。",
    "seed_id": "seed_lang_08"
  },
  {
    "subjectId": "lang",
    "type": "multi",
    "tags": [
      "年齡代稱"
    ],
    "stem": "古語中的年齡代稱常出現在國文考題中。下列關於年齡代稱與實際歲數的配對，哪些選項完全正確？",
    "options": [
      "及笄之年：女子滿十五歲",
      "束髮之年：男子滿十五歲",
      "弱冠之年：男子滿二十歲",
      "不惑之年：人滿五十歲"
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "「不惑之年」依孔子論述是指「四十歲」，五十歲為知天命之年。",
    "seed_id": "seed_lang_09"
  },
  {
    "subjectId": "lang",
    "type": "multi",
    "tags": [
      "儒墨",
      "諸子百家"
    ],
    "stem": "儒家與墨家在戰國時期並稱為兩大「顯學」，思想多有交鋒。下列關於儒、墨兩家主張的比較，哪些選項正確？",
    "options": [
      "墨子曾學習儒學，後因不滿其繁文縟節而自創墨家學派，故墨子為儒家之人",
      "儒家主張「仁愛」，強調愛有差等；墨家主張「兼愛」，強調愛無差等",
      "儒家重視禮樂並主張厚葬；墨家則極力反對音樂（非樂）並提倡節葬",
      "儒家深信鬼神並常言天道；墨家則排斥鬼神且罕言天命"
    ],
    "answer": [
      "B",
      "C"
    ],
    "explanation": "(A) 墨子為墨家創始人；(D) 正好相反，儒家罕言天道，墨家明鬼、天志。",
    "seed_id": "seed_lang_10"
  },
  {
    "subjectId": "lang",
    "type": "multi",
    "tags": [
      "英文文法",
      "讓步"
    ],
    "stem": "Mr. Lin was assigned to lead the new water pipeline construction project. ________ his health issues, he successfully completed it on time. （請選出文意正確之連接詞/介系詞短語）",
    "options": [
      "Despite",
      "In spite of",
      "Although",
      "Because of"
    ],
    "answer": [
      "A",
      "B"
    ],
    "explanation": "Despite / In spite of 為介系詞短語，後接名詞短語；Although 為連接詞需接子句；Because of 文意不符。",
    "seed_id": "seed_lang_11"
  },
  {
    "subjectId": "lang",
    "type": "multi",
    "tags": [
      "英文單字",
      "影響"
    ],
    "stem": "Tim looks really stressed lately because his heavy workload is starting to ________ his family life and health.（請選出可填入空格、且語意完全正確的動詞選項）",
    "options": [
      "affect",
      "influence",
      "defend",
      "impact"
    ],
    "answer": [
      "A",
      "B",
      "D"
    ],
    "explanation": "affect / influence / impact 均有「影響」之意；defend（防禦）文意不符。",
    "seed_id": "seed_lang_12"
  },
  {
    "subjectId": "lang",
    "type": "multi",
    "tags": [
      "公文",
      "書信"
    ],
    "stem": "關於現代公文程式條例與傳統書信的用語規範，下列哪些選項的敘述完全正確？",
    "options": [
      "寫信給自己的直系長輩（如父母）時，信封上的啟封詞應使用「敬啟」",
      "行政機關間「平行文」時（如台水公司行文至各縣市政府），期望及目的用語宜用「請 查照」",
      "在書信中提及自己的兒子時，對外人的謙稱可以用「小犬」",
      "寫信給師長或長輩時，結尾的申候祝語（問候語）宜選用「敬請 鈞安」"
    ],
    "answer": [
      "B",
      "C",
      "D"
    ],
    "explanation": "(A) 錯誤：寫「敬啟」等於命令長輩「恭敬地開啟信件」，是大不敬。給長輩信封應寫「鈞啟」或「大啟」。",
    "seed_id": "seed_lang_13"
  }
];

window.SEED_SUBJECTS = SEED_SUBJECTS;
window.SEED_QUESTIONS = SEED_QUESTIONS;
