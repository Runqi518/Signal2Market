import type { Skill } from "../types";

export const generalIndustrySkill: Skill = {
  id: "industry-general",
  name: "通用行业 GTM",
  scope: "策略",
  purpose: "在行业未知、跨行业或样本较小时保持证据边界，不使用行业刻板印象。",
  triggers: ["通用", "未知行业", "跨行业"],
  principles: [
    {
      title: "证据优先",
      instruction: "人群、场景、痛点、渠道和价值主张必须由访谈或已提供资料支持。",
    },
    {
      title: "明确未知项",
      instruction: "行业、地域、平台规则、监管要求、采购链路和价格带未知时，以待补充信息形式呈现。",
    },
  ],
  checks: [
    {
      name: "行业假设",
      condition: "没有引入未经资料支持的行业规则",
      fallback: "标记为待验证假设",
    },
  ],
  forbidden: [
    "用行业常见套路替代本次访谈证据。",
    "在缺少市场数据时输出确定性市场规模或份额。",
  ],
};
