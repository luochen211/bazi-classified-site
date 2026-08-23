import React from "react";
import {
  Check,
  ChevronRight,
  Circle,
  Copy,
  Database,
  Download,
  FileDown,
  ListChecks,
  Plus,
  Printer,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound
} from "lucide-react";
import "./workbench.css";

const STORAGE_KEY = "bazi-personal-workbench.v1";
const SELECTED_CASE_KEY = "bazi-personal-workbench.selected-case.v1";
const RAG_API_URL = import.meta.env.VITE_RAG_API_URL || "http://127.0.0.1:8765";

const stageDefinitions = [
  {
    id: "intake",
    number: "01",
    title: "能不能断",
    shortTitle: "资料校验",
    description: "先确认时间口径、问题边界与已知事实。输入不稳，后面的精细判断都不成立。",
    prompt: "核对出生资料、排盘口径与问题范围，区分已确认事实、待确认信息和当前不能判断的部分。",
    checklist: ["出生日期与时辰已确认", "公历、农历与真太阳时口径已说明", "本次只处理一个主要问题", "医疗、法律、投资等专业边界已提示"],
    guardrails: ["不知道的资料写明不知道，不用推测补齐。", "出生时辰存在误差时，先列出受影响的判断。"],
    sources: [
      ["实战流程", "/content/实战流程.md"],
      ["学习批命", "/content/学习批命.md"]
    ]
  },
  {
    id: "pattern",
    number: "02",
    title: "定格局与取用",
    shortTitle: "格局",
    description: "先写盘面事实，再给格局判断；旺衰、根气、透藏、调候与格局成败要能彼此解释。",
    prompt: "依次检查月令、得令得地得党、透藏根气、格局成败、调候与取用。发现两套判断冲突时，保留冲突并说明取舍依据。",
    checklist: ["月令与日主状态已写清", "根气、透藏与轻重已检查", "格局成败条件已列出", "用神、忌神没有脱离整体结构", "特殊格局已经过排除"],
    guardrails: ["不能只凭身强身弱直接推出吉凶。", "不能为了套格局忽略反证。"],
    sources: [
      ["格局基础", "/content/格局基础.md"],
      ["格局用神", "/content/格局用神.md"],
      ["双边用神", "/content/双边用神.md"],
      ["顺用格局", "/content/顺用格局.md"]
    ]
  },
  {
    id: "profile",
    number: "03",
    title: "命主画像",
    shortTitle: "画像",
    description: "把十神和结构翻译成现实行为，不贴标签，不把同一股力量只写成优点或缺点。",
    prompt: "根据日主、月令、主导十神和结构流通，写出行为动力、优势环境、压力反应和需要现实验证的画像。",
    checklist: ["主导十神与组合已确认", "性格判断落到了可观察行为", "优势与代价同时出现", "没有用单一十神给人贴标签"],
    guardrails: ["画像必须能通过现实问题验证。", "避免所有人都适用的宽泛描述。"],
    sources: [
      ["十神细则", "/content/十神细则.md"],
      ["十神组合断点", "/content/十神组合断点.md"],
      ["干支作用", "/content/干支作用.md"]
    ]
  },
  {
    id: "topic",
    number: "04",
    title: "六亲与所问专题",
    shortTitle: "专题",
    description: "围绕本次问题选择宫位与十神，只展开有证据的六亲、事业、感情或财运判断。",
    prompt: "先确定本次问题对应的宫位与十神，再检查生克、合冲刑害、清浊与现实关系。只回答本次所问，不扩写无关人生主题。",
    checklist: ["所问主题对应的宫位已确认", "宫、星、结构和现实关系同看", "已经区分倾向、条件和事件", "没有从一个符号直接断一个人"],
    guardrails: ["六亲不能只用一个十神替代。", "事业、财运和感情结论必须回到现实场景。"],
    sources: [
      ["婚姻方面", "/content/婚姻方面.md"],
      ["事业案例索引", "/content/事业案例索引.md"],
      ["财运案例索引", "/content/财运案例索引.md"],
      ["健康风险", "/content/健康风险.md"]
    ]
  },
  {
    id: "history",
    number: "05",
    title: "过去应事验证",
    shortTitle: "回验",
    description: "先用过去发生过的事校验判断体系，再继续推未来。没有回验，不把推测写成确定结论。",
    prompt: "围绕学业、家庭、事业、感情、财务、健康与迁移，提出少量可回答的问题，记录吻合、矛盾和无法确认之处。",
    checklist: ["已提出可验证的过去问题", "吻合与不吻合都已记录", "反证已影响后续判断权重", "没有根据客户反馈倒改原始判断"],
    guardrails: ["回验不是诱导客户补充一个能对上的故事。", "保留原始判断和后续修订记录。"],
    sources: [
      ["子平三波限", "/content/子平三波限.md"],
      ["案例总索引", "/content/案例总索引.md"],
      ["金氏大运", "/content/金氏大运.md"]
    ]
  },
  {
    id: "timing",
    number: "06",
    title: "大运流年",
    shortTitle: "运年",
    description: "原局是伏笔，大运是阶段气候，流年只负责触发。先定主题，再落时间。",
    prompt: "从原局伏笔开始，判断大运如何改变结构，再检查流年触发的宫位、十神和合冲刑害。输出条件、时间范围与不确定性。",
    checklist: ["原局伏笔已说明", "大运阶段主题已确认", "流年触发点能对应具体宫位或十神", "时间判断写明范围与不确定性"],
    guardrails: ["不能脱离原局和大运单断流年。", "避免使用必然、注定、一定发生等措辞。"],
    sources: [
      ["大运流年", "/content/大运流年.md"],
      ["流年架构", "/content/流年架构.md"],
      ["流年细表", "/content/流年细表.md"]
    ]
  },
  {
    id: "delivery",
    number: "07",
    title: "人工定稿",
    shortTitle: "交付",
    description: "把前面的判断压缩成客户能读懂、能追问、知道边界的报告，最后结论由命理师负责。",
    prompt: "汇总前六步，只保留与问题有关且有依据的内容。区分盘面事实、解释、现实建议和待核问题，删除套话与恐吓式表达。",
    checklist: ["结论与本次问题直接相关", "依据、反例和不确定性可追溯", "现实建议没有越过专业边界", "全文已由命理师人工复核"],
    guardrails: ["AI 只能生成草稿，最终判断由使用者复核。", "报告不得替代医疗、法律、心理或投资专业意见。"],
    sources: [
      ["学习批命", "/content/学习批命.md"],
      ["资料审查总表", "/content/资料审查总表.md"]
    ]
  }
];

const statusOptions = [
  ["draft", "判断中"],
  ["review", "待复核"],
  ["complete", "已交付"]
];

const confidenceOptions = ["待核", "较弱", "中等", "较强"];

const createId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `case-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const blankStage = () => ({
  facts: "",
  judgment: "",
  exclusions: "",
  evidence: null,
  confidence: "待核",
  checks: {},
  completed: false
});

const createCase = (name = "未命名命例") => {
  const now = new Date().toISOString();
  return {
    id: createId(),
    name,
    gender: "",
    birth: "",
    birthplace: "",
    timeBasis: "北京时间",
    pillars: { year: "", month: "", day: "", hour: "" },
    question: "",
    context: "",
    status: "draft",
    createdAt: now,
    updatedAt: now,
    stages: Object.fromEntries(stageDefinitions.map((stage) => [stage.id, blankStage()])),
    feedback: {
      verifiedFacts: "",
      contradictions: "",
      followUp: "",
      nextReviewDate: ""
    }
  };
};

const normalizeCase = (item) => {
  const base = createCase(item?.name || "未命名命例");
  return {
    ...base,
    ...item,
    pillars: { ...base.pillars, ...(item?.pillars || {}) },
    stages: Object.fromEntries(
      stageDefinitions.map((stage) => [stage.id, { ...blankStage(), ...(item?.stages?.[stage.id] || {}) }])
    ),
    feedback: { ...base.feedback, ...(item?.feedback || {}) }
  };
};

const readStoredCases = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.map(normalizeCase) : [];
  } catch {
    return [];
  }
};

const sourceUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
};

const completionFor = (caseItem) => {
  const completed = stageDefinitions.filter((stage) => caseItem.stages[stage.id]?.completed).length;
  return Math.round((completed / stageDefinitions.length) * 100);
};

const statusLabel = (status) => statusOptions.find(([value]) => value === status)?.[1] || "判断中";

const reportNotice = "本工作台可使用 AI 辅助整理草稿，最终内容应由命理师人工复核。内容用于传统文化研究与参考，不替代医疗、法律、心理或投资等专业意见。";

const chartText = (caseItem) => [caseItem.pillars.year, caseItem.pillars.month, caseItem.pillars.day, caseItem.pillars.hour].filter(Boolean).join(" ");

const sanitizeFileName = (name) => (name || "命例报告").replace(/[\\/:*?"<>|]/g, "-").trim();

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
};

const evidenceGroupLabels = {
  rules: "正式规则",
  exclusions: "排除与反证",
  sources: "原文证据",
  cases: "相似案例（仅校准）"
};

const evidenceSnippet = (item) => (item.claim || item.exclusions || item.excerpt || "暂无摘录")
  .replace(/\s+/g, " ")
  .trim()
  .slice(0, 600);

const evidenceToMarkdown = (evidence) => {
  if (!evidence?.groups) return "暂无已检索依据。";
  const sagLine = evidence.sag?.status === "active"
    ? `\n\nSAG 状态：${evidence.sag.version} / ${evidence.sag.strategy} / 最深 ${evidence.sag.maxHop} 跳`
    : evidence.sag?.status === "fallback"
      ? "\n\nSAG 状态：未激活，本次已回退确定性基线"
      : "";
  const groups = Object.entries(evidenceGroupLabels)
    .map(([key, label]) => {
      const items = evidence.groups[key] || [];
      if (items.length === 0) return "";
      return `### ${label}\n\n${items.map((item) => `- ${item.title}｜\`${item.path}${item.section ? `#${item.section}` : ""}\`｜${item.lineStart}-${item.lineEnd} 行\n  - 证据摘录：${evidenceSnippet(item)}`).join("\n")}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return `检索问题：${evidence.query}\n\n检索方式：${evidence.retrievalMode}${evidence.neuralEmbeddings ? "" : "（当前为非神经基线）"}${sagLine}\n\n${groups}`;
};

const buildStagePrompt = (caseItem, stage) => {
  const stageValue = caseItem.stages[stage.id];
  return `# 命例分析任务：${stage.title}

## 基本资料

- 命例：${caseItem.name || "未命名"}
- 性别：${caseItem.gender || "未填"}
- 出生资料：${caseItem.birth || "未填"} ${caseItem.birthplace || ""}
- 时间口径：${caseItem.timeBasis || "未填"}
- 四柱：${chartText(caseItem) || "未填"}
- 所问：${caseItem.question || "未填"}
- 现实背景：${caseItem.context || "未填"}

## 当前步骤

${stage.prompt}

## 已记录内容

- 盘面事实：${stageValue.facts || "暂无"}
- 当前判断：${stageValue.judgment || "暂无"}
- 反证与排除：${stageValue.exclusions || "暂无"}

## 已检索依据

${evidenceToMarkdown(stageValue.evidence)}

## 输出要求

1. 分开写“盘面事实”“可能解释”“反证与缺失信息”“建议追问”。
2. 每个结论说明依据，不引用不存在的古籍或案例。
3. 不使用“必然”“注定”“一定发生”等绝对措辞。
4. 不替代医疗、法律、心理或投资等专业意见。
5. 最终只输出草稿，保留给命理师人工复核。`;
};

const reportMarkdown = (caseItem) => {
  const sections = stageDefinitions
    .map((stage) => {
      const value = caseItem.stages[stage.id];
      return `## ${stage.number} ${stage.title}

### 盘面事实

${value.facts || "待补充"}

### 判断

${value.judgment || "待补充"}

### 反证、排除与不确定处

${value.exclusions || "待补充"}

### 已检索依据

${evidenceToMarkdown(value.evidence)}

**信心等级：** ${value.confidence}`;
    })
    .join("\n\n");

  return `# ${caseItem.name || "命例"}·八字分析报告

> ${reportNotice}

## 基本信息

- 性别：${caseItem.gender || "未填"}
- 出生资料：${caseItem.birth || "未填"} ${caseItem.birthplace || ""}
- 时间口径：${caseItem.timeBasis || "未填"}
- 四柱：${chartText(caseItem) || "未填"}
- 所问：${caseItem.question || "未填"}

${sections}

## 后续回访

### 已验证

${caseItem.feedback.verifiedFacts || "待回访"}

### 矛盾与修正

${caseItem.feedback.contradictions || "待回访"}

### 后续观察

${caseItem.feedback.followUp || "待回访"}
`;
};

function WorkbenchPage() {
  const [cases, setCases] = React.useState(readStoredCases);
  const [selectedId, setSelectedId] = React.useState(() => window.localStorage.getItem(SELECTED_CASE_KEY) || "");
  const [stageId, setStageId] = React.useState(stageDefinitions[0].id);
  const [search, setSearch] = React.useState("");
  const [toast, setToast] = React.useState("");
  const [lastSavedAt, setLastSavedAt] = React.useState("");
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [ragQuery, setRagQuery] = React.useState("");
  const [includeCases, setIncludeCases] = React.useState(false);
  const [ragStatus, setRagStatus] = React.useState("idle");
  const [ragError, setRagError] = React.useState("");
  const importRef = React.useRef(null);

  const selectedCase = cases.find((item) => item.id === selectedId) || null;
  const currentStage = stageDefinitions.find((stage) => stage.id === stageId) || stageDefinitions[0];
  const currentStageValue = selectedCase?.stages[currentStage.id] || blankStage();

  const filteredCases = cases.filter((item) => {
    const text = `${item.name} ${item.question} ${chartText(item)}`.toLowerCase();
    return text.includes(search.trim().toLowerCase());
  });

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    const now = new Date().toISOString();
    setLastSavedAt(now);
  }, [cases]);

  React.useEffect(() => {
    if (selectedCase) {
      window.localStorage.setItem(SELECTED_CASE_KEY, selectedCase.id);
      return;
    }

    if (cases.length > 0) {
      setSelectedId(cases[0].id);
    } else {
      window.localStorage.removeItem(SELECTED_CASE_KEY);
    }
  }, [cases, selectedCase]);

  React.useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  React.useEffect(() => {
    setRagQuery(currentStageValue.evidence?.query || "");
    setIncludeCases(Boolean(currentStageValue.evidence?.policy?.casesIncluded));
    setRagStatus("idle");
    setRagError("");
  }, [selectedCase?.id, currentStage.id]);

  const addCase = () => {
    const next = createCase();
    setCases((items) => [next, ...items]);
    setSelectedId(next.id);
    setStageId(stageDefinitions[0].id);
    setShowFeedback(false);
    setToast("已新建命例");
  };

  const updateCase = (patch) => {
    if (!selectedCase) return;
    setCases((items) =>
      items.map((item) => (item.id === selectedCase.id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item))
    );
  };

  const updatePillars = (key, value) => updateCase({ pillars: { ...selectedCase.pillars, [key]: value } });

  const updateStage = (patch) => {
    updateCase({
      stages: {
        ...selectedCase.stages,
        [currentStage.id]: { ...currentStageValue, ...patch }
      }
    });
  };

  const updateFeedback = (key, value) => updateCase({ feedback: { ...selectedCase.feedback, [key]: value } });

  const removeCase = () => {
    if (!selectedCase) return;
    const confirmed = window.confirm(`删除“${selectedCase.name}”？本机记录删除后无法恢复。`);
    if (!confirmed) return;
    setCases((items) => items.filter((item) => item.id !== selectedCase.id));
    setSelectedId("");
    setToast("命例已删除");
  };

  const exportBackup = () => {
    const payload = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), cases }, null, 2);
    downloadBlob(new Blob([payload], { type: "application/json" }), `八字工作台备份-${new Date().toISOString().slice(0, 10)}.json`);
    setToast("备份已导出");
  };

  const importBackup = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const payload = JSON.parse(await file.text());
      const importedCases = Array.isArray(payload) ? payload : payload.cases;
      if (!Array.isArray(importedCases)) throw new Error("invalid");
      const normalized = importedCases.map(normalizeCase);
      setCases((current) => {
        const importedById = new Map(normalized.map((item) => [item.id, item]));
        return [...normalized, ...current.filter((item) => !importedById.has(item.id))];
      });
      setSelectedId(normalized[0]?.id || selectedId);
      setToast(`已导入 ${normalized.length} 个命例`);
    } catch {
      setToast("导入失败：备份文件格式不正确");
    }
  };

  const exportMarkdown = () => {
    if (!selectedCase) return;
    downloadBlob(new Blob([reportMarkdown(selectedCase)], { type: "text/markdown;charset=utf-8" }), `${sanitizeFileName(selectedCase.name)}-分析报告.md`);
    setToast("Markdown 报告已导出");
  };

  const exportWord = async () => {
    if (!selectedCase) return;
    setToast("正在生成 Word 报告…");

    const { Document, HeadingLevel, Packer, Paragraph, TextRun } = await import("docx");
    const children = [
      new Paragraph({ text: `${selectedCase.name || "命例"}·八字分析报告`, heading: HeadingLevel.HEADING_1 }),
      new Paragraph({
        children: [
          new TextRun({
            text: reportNotice,
            italics: true,
            color: "66594D"
          })
        ]
      }),
      new Paragraph({ text: "基本信息", heading: HeadingLevel.HEADING_2 }),
      ...[
        `性别：${selectedCase.gender || "未填"}`,
        `出生资料：${selectedCase.birth || "未填"} ${selectedCase.birthplace || ""}`,
        `时间口径：${selectedCase.timeBasis || "未填"}`,
        `四柱：${chartText(selectedCase) || "未填"}`,
        `所问：${selectedCase.question || "未填"}`
      ].map((text) => new Paragraph({ text }))
    ];

    for (const stage of stageDefinitions) {
      const value = selectedCase.stages[stage.id];
      children.push(new Paragraph({ text: `${stage.number} ${stage.title}`, heading: HeadingLevel.HEADING_2 }));
      children.push(new Paragraph({ children: [new TextRun({ text: "盘面事实", bold: true })] }));
      children.push(new Paragraph({ text: value.facts || "待补充" }));
      children.push(new Paragraph({ children: [new TextRun({ text: "判断", bold: true })] }));
      children.push(new Paragraph({ text: value.judgment || "待补充" }));
      children.push(new Paragraph({ children: [new TextRun({ text: "反证、排除与不确定处", bold: true })] }));
      children.push(new Paragraph({ text: value.exclusions || "待补充" }));
      if (value.evidence?.groups) {
        children.push(new Paragraph({ children: [new TextRun({ text: "已检索依据", bold: true })] }));
        for (const [key, label] of Object.entries(evidenceGroupLabels)) {
          const evidenceItems = value.evidence.groups[key] || [];
          if (evidenceItems.length === 0) continue;
          children.push(new Paragraph({ text: label }));
          for (const item of evidenceItems) {
            children.push(new Paragraph({ text: `${item.title}｜${item.path}｜${item.lineStart}-${item.lineEnd} 行`, bullet: { level: 0 } }));
          }
        }
      }
      children.push(new Paragraph({ text: `信心等级：${value.confidence}` }));
    }

    children.push(new Paragraph({ text: "后续回访", heading: HeadingLevel.HEADING_2 }));
    children.push(new Paragraph({ text: `已验证：${selectedCase.feedback.verifiedFacts || "待回访"}` }));
    children.push(new Paragraph({ text: `矛盾与修正：${selectedCase.feedback.contradictions || "待回访"}` }));
    children.push(new Paragraph({ text: `后续观察：${selectedCase.feedback.followUp || "待回访"}` }));

    const document = new Document({
      styles: {
        default: {
          document: { run: { font: "宋体", size: 22 }, paragraph: { spacing: { line: 360, after: 160 } } },
          heading1: { run: { font: "黑体", size: 36, bold: true, color: "18120D" } },
          heading2: { run: { font: "黑体", size: 28, bold: true, color: "8F2F25" } }
        }
      },
      sections: [{ children }]
    });
    const blob = await Packer.toBlob(document);
    downloadBlob(blob, `${sanitizeFileName(selectedCase.name)}-分析报告.docx`);
    setToast("Word 报告已导出");
  };

  const copyPrompt = async () => {
    if (!selectedCase) return;
    await copyText(buildStagePrompt(selectedCase, currentStage));
    setToast(`已复制“${currentStage.title}”分析指令`);
  };

  const retrieveEvidence = async () => {
    if (!selectedCase || currentStage.id !== "pattern") return;
    const query = ragQuery.trim() || [
      currentStageValue.facts,
      chartText(selectedCase),
      selectedCase.question,
      "月令 透干 根气 旺衰 格局成败 调候 取用"
    ].filter(Boolean).join(" ");

    setRagStatus("loading");
    setRagError("");
    try {
      const response = await fetch(`${RAG_API_URL}/v1/retrieve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, stage: "pattern", limit: 6, includeCases })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `检索服务返回 ${response.status}`);
      updateStage({ evidence: payload });
      setRagQuery(query);
      setRagStatus("success");
      const total = Object.values(payload.groups || {}).reduce((sum, items) => sum + items.length, 0);
      setToast(`已取回 ${total} 条规则、反证与原文依据`);
    } catch (error) {
      setRagStatus("error");
      setRagError(error.message || "无法连接本机检索服务");
    }
  };

  const copyEvidence = async () => {
    await copyText(evidenceToMarkdown(currentStageValue.evidence));
    setToast("证据包已复制");
  };

  return (
    <main className="workbench-page page-shell">
      <div className="workbench-ui">
        <header className="workbench-toolbar">
          <div>
            <p className="workbench-kicker">个人本地工作台</p>
            <h1>命例研判</h1>
          </div>
          <div className="workbench-toolbar-actions">
            <span className="save-state">
              <Database size={15} aria-hidden="true" />
              {lastSavedAt ? `${formatDate(lastSavedAt)} 已保存至本机` : "仅保存至本机"}
            </span>
            <input accept="application/json" className="workbench-file-input" onChange={importBackup} ref={importRef} type="file" />
            <button className="workbench-icon-button" onClick={() => importRef.current?.click()} title="导入备份" type="button">
              <Upload size={17} aria-hidden="true" />
              <span>导入</span>
            </button>
            <button className="workbench-icon-button" disabled={cases.length === 0} onClick={exportBackup} title="导出备份" type="button">
              <Download size={17} aria-hidden="true" />
              <span>备份</span>
            </button>
            <button className="workbench-primary-button" onClick={addCase} type="button">
              <Plus size={17} aria-hidden="true" />
              新建命例
            </button>
          </div>
        </header>

        <div className={`workbench-layout ${selectedCase ? "has-case" : "is-empty"}`}>
          <aside className="case-sidebar" aria-label="命例列表">
            <div className="case-sidebar-head">
              <div>
                <span>命例</span>
                <strong>{cases.length}</strong>
              </div>
              <button aria-label="新建命例" onClick={addCase} type="button">
                <Plus size={17} aria-hidden="true" />
              </button>
            </div>
            <label className="case-search">
              <Search size={16} aria-hidden="true" />
              <span className="sr-only">搜索命例</span>
              <input onChange={(event) => setSearch(event.target.value)} placeholder="搜索姓名、四柱或问题" type="search" value={search} />
            </label>
            <div className="case-list">
              {filteredCases.length > 0 ? (
                filteredCases.map((item) => (
                  <button
                    className={item.id === selectedId ? "is-selected" : ""}
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setShowFeedback(false);
                    }}
                    type="button"
                  >
                    <span className="case-row-top">
                      <strong>{item.name || "未命名命例"}</strong>
                      <small>{completionFor(item)}%</small>
                    </span>
                    <span>{item.question || chartText(item) || "等待录入基本资料"}</span>
                    <span className="case-row-meta">
                      <i data-status={item.status}>{statusLabel(item.status)}</i>
                      {formatDate(item.updatedAt)}
                    </span>
                  </button>
                ))
              ) : (
                <p className="case-list-empty">{cases.length === 0 ? "还没有命例。" : "没有找到匹配记录。"}</p>
              )}
            </div>
          </aside>

          {selectedCase ? (
            <>
              <section className="case-workspace" aria-label="命例编辑区">
                <CaseIdentity caseItem={selectedCase} onChange={updateCase} onPillarChange={updatePillars} onRemove={removeCase} />

                <nav className="stage-nav" aria-label="判断流程">
                  {stageDefinitions.map((stage) => {
                    const stageValue = selectedCase.stages[stage.id];
                    return (
                      <button className={stage.id === currentStage.id ? "is-active" : ""} key={stage.id} onClick={() => setStageId(stage.id)} type="button">
                        {stageValue.completed ? <Check size={15} aria-hidden="true" /> : <Circle size={12} aria-hidden="true" />}
                        <span>{stage.number}</span>
                        {stage.shortTitle}
                      </button>
                    );
                  })}
                </nav>

                <div className="stage-editor" key={currentStage.id}>
                  <div className="stage-heading">
                    <div>
                      <p>{currentStage.number} / {stageDefinitions.length.toString().padStart(2, "0")}</p>
                      <h2>{currentStage.title}</h2>
                      <span>{currentStage.description}</span>
                    </div>
                    <label>
                      <span>信心等级</span>
                      <select value={currentStageValue.confidence} onChange={(event) => updateStage({ confidence: event.target.value })}>
                        {confidenceOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </label>
                  </div>

                  <div className="stage-fields">
                    <label>
                      <span>盘面事实</span>
                      <small>只记录可核对的排盘结果与结构。</small>
                      <textarea onChange={(event) => updateStage({ facts: event.target.value })} placeholder="例：日主得令与否、根气、透藏、宫位与冲合……" rows="6" value={currentStageValue.facts} />
                    </label>
                    <label>
                      <span>当前判断</span>
                      <small>写出结论、成立条件和现实落点。</small>
                      <textarea onChange={(event) => updateStage({ judgment: event.target.value })} placeholder="例：在什么条件下成立，如何回到命主的实际问题……" rows="8" value={currentStageValue.judgment} />
                    </label>
                    <label>
                      <span>反证、排除与不确定处</span>
                      <small>专门记录不支持当前判断的信号。</small>
                      <textarea onChange={(event) => updateStage({ exclusions: event.target.value })} placeholder="例：时辰存疑、流派口径冲突、过去反馈不支持……" rows="5" value={currentStageValue.exclusions} />
                    </label>
                  </div>

                  {currentStage.id === "pattern" ? (
                    <RagEvidencePanel
                      evidence={currentStageValue.evidence}
                      error={ragError}
                      includeCases={includeCases}
                      onCopy={copyEvidence}
                      onIncludeCasesChange={setIncludeCases}
                      onQueryChange={setRagQuery}
                      onRetrieve={retrieveEvidence}
                      query={ragQuery}
                      status={ragStatus}
                    />
                  ) : null}

                  <div className="stage-checks">
                    <div className="stage-checks-title">
                      <ListChecks size={18} aria-hidden="true" />
                      <div>
                        <strong>本步复核</strong>
                        <span>{Object.values(currentStageValue.checks).filter(Boolean).length} / {currentStage.checklist.length}</span>
                      </div>
                    </div>
                    <div>
                      {currentStage.checklist.map((item) => (
                        <label key={item}>
                          <input
                            checked={Boolean(currentStageValue.checks[item])}
                            onChange={(event) => updateStage({ checks: { ...currentStageValue.checks, [item]: event.target.checked } })}
                            type="checkbox"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="stage-actions">
                    <button className="secondary-action" onClick={copyPrompt} type="button">
                      <Copy size={17} aria-hidden="true" />
                      复制本阶段 AI 分析指令
                    </button>
                    <button className={currentStageValue.completed ? "complete-action is-complete" : "complete-action"} onClick={() => updateStage({ completed: !currentStageValue.completed })} type="button">
                      <Check size={17} aria-hidden="true" />
                      {currentStageValue.completed ? "已完成，点击重开" : "标记本步完成"}
                    </button>
                  </div>
                </div>

                <FeedbackSection caseItem={selectedCase} isOpen={showFeedback} onChange={updateFeedback} onToggle={() => setShowFeedback((value) => !value)} />
              </section>

              <aside className="evidence-inspector" aria-label="依据与交付">
                <section>
                  <p className="inspector-label">
                    <ShieldCheck size={16} aria-hidden="true" />
                    当前边界
                  </p>
                  <ul className="guardrail-list">
                    {currentStage.guardrails.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </section>

                <section>
                  <p className="inspector-label">
                    <Database size={16} aria-hidden="true" />
                    查看依据
                  </p>
                  <div className="source-list">
                    {currentStage.sources.map(([label, path]) => (
                      <a href={sourceUrl(path)} key={path} rel="noreferrer" target="_blank">
                        <span>{label}</span>
                        <ChevronRight size={15} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </section>

                <section className="delivery-panel">
                  <p className="inspector-label">
                    <FileDown size={16} aria-hidden="true" />
                    交付状态
                  </p>
                  <div className="progress-readout">
                    <strong>{completionFor(selectedCase)}%</strong>
                    <span>{stageDefinitions.filter((stage) => selectedCase.stages[stage.id].completed).length} / {stageDefinitions.length} 步完成</span>
                  </div>
                  <div className="progress-track"><i style={{ width: `${completionFor(selectedCase)}%` }} /></div>
                  <label>
                    <span>命例状态</span>
                    <select value={selectedCase.status} onChange={(event) => updateCase({ status: event.target.value })}>
                      {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                  <div className="export-actions">
                    <button onClick={exportWord} type="button"><FileDown size={16} aria-hidden="true" /> Word</button>
                    <button onClick={() => window.print()} type="button"><Printer size={16} aria-hidden="true" /> PDF</button>
                    <button onClick={exportMarkdown} type="button"><Download size={16} aria-hidden="true" /> Markdown</button>
                  </div>
                  <small>PDF 使用浏览器打印窗口保存。</small>
                </section>
              </aside>
            </>
          ) : (
            <section className="workbench-empty-state">
              <div>
                <UserRound size={28} aria-hidden="true" />
                <p>还没有命例</p>
                <h2>从一个真实问题开始</h2>
                <span>数据只保存在当前浏览器，不会自动上传。</span>
                <button className="workbench-primary-button" onClick={addCase} type="button">
                  <Plus size={17} aria-hidden="true" />
                  新建第一个命例
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      {selectedCase ? <PrintReport caseItem={selectedCase} /> : null}
      <div aria-live="polite" className={toast ? "workbench-toast is-visible" : "workbench-toast"} role="status">{toast}</div>
    </main>
  );
}

function CaseIdentity({ caseItem, onChange, onPillarChange, onRemove }) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <section className="case-identity">
      <div className="case-identity-heading">
        <div>
          <input aria-label="命例名称" onChange={(event) => onChange({ name: event.target.value })} value={caseItem.name} />
          <span>{chartText(caseItem) || "尚未录入四柱"} · {statusLabel(caseItem.status)}</span>
        </div>
        <div>
          <button onClick={() => setIsOpen((value) => !value)} type="button">{isOpen ? "收起资料" : "编辑资料"}</button>
          <button aria-label="删除当前命例" className="danger-icon" onClick={onRemove} title="删除当前命例" type="button"><Trash2 size={16} aria-hidden="true" /></button>
        </div>
      </div>

      {isOpen ? (
        <div className="case-identity-fields">
          <label>
            <span>性别</span>
            <select value={caseItem.gender} onChange={(event) => onChange({ gender: event.target.value })}>
              <option value="">未填</option>
              <option>男</option>
              <option>女</option>
              <option>其他 / 不说明</option>
            </select>
          </label>
          <label className="wide-field">
            <span>出生资料</span>
            <input onChange={(event) => onChange({ birth: event.target.value })} placeholder="例：1992-08-17 14:30" value={caseItem.birth} />
          </label>
          <label>
            <span>出生地</span>
            <input onChange={(event) => onChange({ birthplace: event.target.value })} placeholder="城市" value={caseItem.birthplace} />
          </label>
          <label>
            <span>时间口径</span>
            <select value={caseItem.timeBasis} onChange={(event) => onChange({ timeBasis: event.target.value })}>
              <option>北京时间</option>
              <option>真太阳时</option>
              <option>口径待核</option>
            </select>
          </label>
          <fieldset className="pillar-fields">
            <legend>四柱</legend>
            {[["year", "年柱"], ["month", "月柱"], ["day", "日柱"], ["hour", "时柱"]].map(([key, label]) => (
              <label key={key}>
                <span>{label}</span>
                <input maxLength="4" onChange={(event) => onPillarChange(key, event.target.value)} placeholder="甲子" value={caseItem.pillars[key]} />
              </label>
            ))}
          </fieldset>
          <label className="full-field">
            <span>本次所问</span>
            <input onChange={(event) => onChange({ question: event.target.value })} placeholder="只写一个主要问题" value={caseItem.question} />
          </label>
          <label className="full-field">
            <span>现实背景</span>
            <textarea onChange={(event) => onChange({ context: event.target.value })} placeholder="命主已确认的现实情况、已发生事件与限制条件" rows="3" value={caseItem.context} />
          </label>
        </div>
      ) : null}
    </section>
  );
}

function FeedbackSection({ caseItem, isOpen, onChange, onToggle }) {
  return (
    <section className={isOpen ? "feedback-section is-open" : "feedback-section"}>
      <button className="feedback-toggle" onClick={onToggle} type="button">
        <span>
          <strong>回访与修正</strong>
          <small>保留验证、反证与后续观察</small>
        </span>
        <ChevronRight size={18} aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="feedback-fields">
          <label>
            <span>已验证事实</span>
            <textarea onChange={(event) => onChange("verifiedFacts", event.target.value)} rows="4" value={caseItem.feedback.verifiedFacts} />
          </label>
          <label>
            <span>矛盾与修正</span>
            <textarea onChange={(event) => onChange("contradictions", event.target.value)} rows="4" value={caseItem.feedback.contradictions} />
          </label>
          <label>
            <span>后续观察</span>
            <textarea onChange={(event) => onChange("followUp", event.target.value)} rows="4" value={caseItem.feedback.followUp} />
          </label>
          <label>
            <span>下次回访日期</span>
            <input onChange={(event) => onChange("nextReviewDate", event.target.value)} type="date" value={caseItem.feedback.nextReviewDate} />
          </label>
        </div>
      ) : null}
    </section>
  );
}

function RagEvidencePanel({ evidence, error, includeCases, onCopy, onIncludeCasesChange, onQueryChange, onRetrieve, query, status }) {
  const hasEvidence = Boolean(evidence?.groups);
  return (
    <section className="rag-evidence-panel" aria-label="本机知识检索">
      <div className="rag-panel-heading">
        <div>
          <p>本机检索 · SAG 可选增强</p>
          <h3>动态串联规则，并保留反证与原文护栏</h3>
          <span>命例信息只发送到 127.0.0.1。SAG 用于跨卡扩展；总排除卡、原文优先级和案例隔离仍由本地规则强制。</span>
        </div>
        <i data-state={status}>{status === "loading" ? "检索中" : status === "success" ? "已更新" : status === "error" ? "未连接" : "本机服务"}</i>
      </div>

      <div className="rag-query-row">
        <label>
          <span className="sr-only">知识检索问题</span>
          <input
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="留空则使用四柱、盘面事实和本次所问自动组装"
            value={query}
          />
        </label>
        <button disabled={status === "loading"} onClick={onRetrieve} type="button">
          <Search size={16} aria-hidden="true" />
          {status === "loading" ? "正在检索" : "检索正式规则与反证"}
        </button>
      </div>

      <label className="rag-case-toggle">
        <input checked={includeCases} onChange={(event) => onIncludeCasesChange(event.target.checked)} type="checkbox" />
        <span>在规则和原文之后，再加入相似案例校准</span>
      </label>

      {error ? (
        <p className="rag-error">无法连接本机知识库。基线检索运行 <code>npm run dev:rag</code>，SAG 增强运行 <code>npm run dev:sag</code>。错误：{error}</p>
      ) : null}

      {hasEvidence ? (
        <>
          <div className="rag-result-summary">
            <span>{evidence.retrievalMode}</span>
            <span>{evidence.neuralEmbeddings ? "神经向量已启用" : "非神经检索基线"}</span>
            <button onClick={onCopy} type="button"><Copy size={14} aria-hidden="true" />复制证据包</button>
          </div>
          {evidence.sag?.status === "active" ? (
            <p className="sag-runtime-note" data-state="active">
              SAG {evidence.sag.version} · {evidence.sag.strategy} · 动态命中 {evidence.sag.hitCount} 个知识对象 · 最深 {evidence.sag.maxHop} 跳
            </p>
          ) : evidence.sag?.status === "fallback" ? (
            <p className="sag-runtime-note" data-state="fallback">
              SAG 当前未激活，本次已自动回退到确定性基线。{evidence.sag.error ? ` ${evidence.sag.error}` : ""}
            </p>
          ) : null}
          <div className="rag-result-groups">
            {Object.entries(evidenceGroupLabels).map(([key, label]) => {
              const items = evidence.groups[key] || [];
              if (items.length === 0) return null;
              return (
                <section data-kind={key} key={key}>
                  <h4>{label}<span>{items.length}</span></h4>
                  <div>
                    {items.map((item) => (
                      <article key={`${key}-${item.id}`}>
                        <div>
                          <strong>{item.title}</strong>
                          <small>{item.path}{item.section ? ` · ${item.section}` : ""}</small>
                        </div>
                        <p>{evidenceSnippet(item)}</p>
                        <footer>
                          <span>{item.lineStart}-{item.lineEnd} 行</span>
                          <span>相关度 {Math.min(100, Math.round(item.score * 100))}</span>
                        </footer>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      ) : (
        <p className="rag-empty">先录入可核对的盘面事实，再检索。启用 SAG 后会先找语义种子，再按共享实体扩展；系统仍会强制带回总排除卡和原文。</p>
      )}
    </section>
  );
}

function PrintReport({ caseItem }) {
  return (
    <article className="workbench-print-report">
      <header>
        <p>八字分析报告</p>
        <h1>{caseItem.name || "命例"}</h1>
        <span>{chartText(caseItem) || "四柱待补充"}</span>
      </header>
      <section>
        <h2>基本信息</h2>
        <dl>
          <div><dt>性别</dt><dd>{caseItem.gender || "未填"}</dd></div>
          <div><dt>出生资料</dt><dd>{caseItem.birth || "未填"} {caseItem.birthplace}</dd></div>
          <div><dt>时间口径</dt><dd>{caseItem.timeBasis}</dd></div>
          <div><dt>本次所问</dt><dd>{caseItem.question || "未填"}</dd></div>
        </dl>
      </section>
      {stageDefinitions.map((stage) => {
        const value = caseItem.stages[stage.id];
        return (
          <section key={stage.id}>
            <p className="print-stage-number">{stage.number}</p>
            <h2>{stage.title}</h2>
            <h3>盘面事实</h3>
            <p>{value.facts || "待补充"}</p>
            <h3>判断</h3>
            <p>{value.judgment || "待补充"}</p>
            <h3>反证、排除与不确定处</h3>
            <p>{value.exclusions || "待补充"}</p>
            {value.evidence?.groups ? (
              <>
                <h3>已检索依据</h3>
                <p>{Object.values(value.evidence.groups).flat().map((item) => `${item.title}（${item.path}）`).join("；")}</p>
              </>
            ) : null}
            <small>信心等级：{value.confidence}</small>
          </section>
        );
      })}
      <footer>{reportNotice}</footer>
    </article>
  );
}

export default WorkbenchPage;
