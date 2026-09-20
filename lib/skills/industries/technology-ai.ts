import type { Skill } from "../types";

export const technologySkill: Skill = {
  id: "industry-technology-ai",
  name: "科技与 AI GTM",
  scope: "策略",
  purpose: "为 B2B SaaS、AI 工具、开发者工具和企业软件提供证据约束的商业化判断。",
  triggers: ["SaaS", "AI", "开发者工具", "API", "企业软件", "自动化"],
  principles: [
    {
      title: "识别购买委员会",
      instruction: "区分使用者、内部推动者、经济买家、技术评估、安全或法务审批，并明确谁拥有预算与最终决策。",
    },
    {
      title: "量化业务结果",
      instruction: "优先提取节省时间、降低成本、提升收入、减少错误、降低风险等结果，并保留基线与约束。",
    },
    {
      title: "处理技术异议",
      instruction: "主动识别准确性、幻觉、集成、迁移、数据安全、权限、稳定性和供应商锁定等阻力。",
    },
    {
      title: "选择低摩擦验证渠道",
      instruction: "根据人群选择搜索、LinkedIn、行业社群、开发者社区、内容、产品内邀请或销售外联。",
    },
  ],
  checks: [
    {
      name: "价值指标",
      condition: "至少一个可量化的业务结果",
      fallback: "不要承诺 ROI",
    },
    {
      name: "AI 能力边界",
      condition: "明确辅助、自动化或自主执行的程度",
      fallback: "不得宣称完全替代人工",
    },
    {
      name: "转化动作",
      condition: "素材有 Demo、试用、激活或联系销售中的一种 CTA",
      fallback: "不要使用泛泛了解",
    },
  ],
  forbidden: [
    "没有证据时承诺准确率、节省多少人力或确定收入提升。",
    "将技术评估者和最终采购者视为同一人群。",
    "用技术功能清单代替购买者关心的业务结果。",
  ],
};
