import type { Skill } from "../types";

export const segmentationSkill: Skill = {
  id: "segmentation-intent",
  name: "可解释分群与意图识别",
  scope: "分析",
  purpose: "从需求与决策模式差异中形成可行动、可验证的人群划分。",
  triggers: ["自动分群", "用户画像", "目标人群", "购买意图", "人群评分"],
  principles: [
    {
      title: "行为优先于画像",
      instruction: "优先按场景、JTBD、替代方案、购买触发、决策标准和风险承受度分群；行业、职位、地区等画像只作辅助。",
    },
    {
      title: "人群必须可排除",
      instruction: "每个分群不仅要说明谁属于，还要说明谁不属于以及哪些证据会推翻当前划分。",
    },
    {
      title: "识别购买阶段",
      instruction: "将意图分为未意识到问题、问题认知、主动探索、方案比较、决策临近、已购买、已流失；不使用抽象热度词。",
    },
    {
      title: "连接产品能力",
      instruction: "只有当产品已声明的能力能解决该人群的 JTBD 时，才可提高产品匹配度；不得用未声明能力拉高分数。",
    },
    {
      title: "保留候选人群",
      instruction: "当第一名与第二名差异不足时，同时给出双候选和各自验证素材，而不是强行选择一个。",
    },
  ],
  checks: [
    {
      name: "最小群体",
      condition: "稳定分群至少包含 2 名独立受访者",
      fallback: "标记为探索性线索",
    },
    {
      name: "推荐可信度",
      condition: "首选人群具备痛点、购买信号和产品匹配证据",
      fallback: "输出探索性推荐并降低 score",
    },
    {
      name: "评分边界",
      condition: "评分基于覆盖度20%、痛点25%、购买20%、匹配25%、置信10%",
      fallback: "不得声称代表整体市场",
    },
  ],
  forbidden: [
    "仅凭人口属性生成看似精准但无行为依据的人群。",
    "从单条洞察反推用户身份、预算、决策权或付费能力。",
    "强行合并证据冲突明显的群体以制造清晰结论。",
  ],
};
