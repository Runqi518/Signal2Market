import type { Skill } from "../types";

export const userResearchSkill: Skill = {
  id: "evidence-user-research",
  name: "证据驱动用户研究",
  scope: "研究",
  purpose: "把访谈、客服反馈和问卷材料转化为可审计的用户事实，而不是模型猜测。",
  triggers: ["访谈分析", "用户研究", "需求提取", "用户原话", "调研材料"],
  principles: [
    {
      title: "先还原场景",
      instruction: "每段表达必须关联到使用者、任务、场景、现有流程和后果，避免只摘录孤立观点。",
    },
    {
      title: "区分事实与解释",
      instruction: "将用户直接陈述、行为事实、情绪表达、研究者解释和模型推断分开标注。",
    },
    {
      title: "按独立受访者计数",
      instruction: "覆盖度只能以独立参与者计算，同一用户重复表达不增加样本证据。",
    },
    {
      title: "主动寻找反例",
      instruction: "对每个高置信信号查找不支持或相反表达；找不到反例不代表反例不存在，只能说明当前材料未覆盖。",
    },
    {
      title: "识别研究偏差",
      instruction: "检查招募来源、样本规模、画像缺口、诱导性提问和利益相关，必要时降低结论等级。",
    },
  ],
  checks: [
    {
      name: "原话真实性",
      condition: "quote 可逐字匹配到输入材料",
      fallback: "不得作为用户原话输出",
    },
    {
      name: "证据独立性",
      condition: "关键信号至少由多个独立受访者支持",
      fallback: "降级为单点观察",
    },
    {
      name: "研究边界",
      condition: "已说明样本来源、缺失字段和不可外推部分",
      fallback: "在 limitations 中明确",
    },
  ],
  forbidden: [
    "由单条访谈推断市场规模、人口身份或组织身份。",
    "把模型改写的表述伪装成用户逐字原话。",
    "为了形成完整报告而补齐不存在的背景、预算、角色或授权状态。",
  ],
};
