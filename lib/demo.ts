import type { AnalysisResult } from "./types";

export const demoResult: AnalysisResult = {
  sample: { interviews: 18, participants: 18, profileMatch: 94 },
  evidence: [
    { id: "e1", participant: "P-07", profile: "增长负责人 · 20-50 人 SaaS", quote: "访谈做完不是没有结论，是结论到市场同学那里又要重新翻译一遍。", source: "Interview_P07.txt", location: "12:18" },
    { id: "e2", participant: "P-12", profile: "创始人 · AI 创业团队", quote: "我最需要的不是更长的报告，而是下周能直接拿去测的那几句话。", source: "Interview_P12.txt", location: "08:42" },
    { id: "e3", participant: "P-03", profile: "产品经理 · B2B SaaS", quote: "大家都说用户痛，但到底先打哪群人，没有一个统一判断。", source: "Interview_P03.txt", location: "21:06" },
    { id: "e4", participant: "P-15", profile: "用户研究员 · 企业软件", quote: "如果文案能点回原话，我才敢让市场团队直接用。", source: "Interview_P15.txt", location: "16:31" },
  ],
  segments: [
    { id: "s1", name: "研究后急需验证的增长团队", count: 8, description: "已经完成访谈，但洞察无法快速转成获客实验。", traits: ["B2B SaaS", "5-50 人团队", "已有访谈", "两周内需上线"], pain: 88, buying: 81, fit: 94, confidence: 86, score: 88, evidenceIds: ["e1", "e2", "e3"] },
    { id: "s2", name: "高频交付的研究咨询团队", count: 6, description: "需要缩短从研究交付到客户市场方案的周期。", traits: ["咨询服务", "多项目并行", "重视可追溯性"], pain: 76, buying: 74, fit: 82, confidence: 79, score: 78, evidenceIds: ["e4", "e1"] },
    { id: "s3", name: "早期方向探索团队", count: 4, description: "访谈样本较少，产品定位仍处于探索阶段。", traits: ["Pre-PMF", "样本少", "预算敏感"], pain: 71, buying: 48, fit: 75, confidence: 61, score: 65, evidenceIds: ["e2"] },
  ],
  signals: [
    { type: "痛点", label: "研究结论无法直接交付市场", coverage: 67, strength: 91, evidenceIds: ["e1", "e3"] },
    { type: "期望结果", label: "访谈结束即可获得可测试文案", coverage: 61, strength: 87, evidenceIds: ["e2"] },
    { type: "购买触发", label: "两周内需要启动新一轮获客", coverage: 44, strength: 82, evidenceIds: ["e2", "e3"] },
    { type: "购买阻力", label: "担心 AI 文案脱离用户原话", coverage: 50, strength: 78, evidenceIds: ["e4"] },
  ],
  strategy: {
    positioning: "为已完成用户访谈、即将启动增长实验的 B2B 团队，把分散的访谈证据直接变成可验证的目标人群与 GTM 素材。",
    valueProp: "不用重读几十小时访谈，15 分钟获得每句话都有证据来源的市场定位与渠道文案。",
    pillars: [
      { title: "从证据出发", body: "所有定位和文案都能回到真实受访者与原始语境。", evidenceIds: ["e4"] },
      { title: "自动选择人群", body: "综合痛点、购买信号和产品匹配度推荐优先客群。", evidenceIds: ["e3"] },
      { title: "直接进入验证", body: "同步生成落地页、广告和销售触达版本，而不是停在报告。", evidenceIds: ["e1", "e2"] },
    ],
    objection: "不是让 AI 猜用户，而是让 AI 在已有访谈和画像边界内完成结构化传导。",
  },
  assets: {
    landing: { headline: "让每一次用户访谈，直接成为下一轮增长素材", subhead: "自动找到证据最强的目标人群，将真实痛点转成可测试的定位、落地页和广告文案。", cta: "导入访谈，生成 GTM" },
    ads: [
      { label: "痛点角度", headline: "访谈做完，GTM 才刚开始？", body: "把几十小时用户原话，直接转成有证据的目标客群和可投放素材。", variable: "核心痛点" },
      { label: "效率角度", headline: "15 分钟，从访谈到第一版 GTM", body: "自动分群、识别购买信号，并生成落地页、广告与销售话术。", variable: "时间收益" },
      { label: "信任角度", headline: "不是 AI 猜测，是用户亲口说的", body: "每条定位与文案都能回到受访者原话和时间戳。", variable: "证据可信度" },
    ],
    email: { subject: "你们的用户访谈，是否还停在研究报告里？", body: "我们把访谈与受访者画像放进同一条分析链路，自动找出优先人群、购买信号，并生成可以直接测试的 GTM 素材。每个结论都能回到用户原话。要不要用你们最近的一轮访谈跑一次？" },
    social: "做完 20 场用户访谈，不该再花一周把洞察翻译成市场文案。Signal to Market 自动完成分群、目标人群推荐和 GTM 素材生成，而且每个结论都能回到用户原话。",
  },
  limitations: ["样本来自已完成访谈，不代表整体市场规模。", "4 名早期团队缺少明确预算信息。", "公开使用用户原话前仍需确认授权状态。"],
};
