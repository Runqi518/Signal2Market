import type { Skill } from "../types";

export const channelAssetsSkill: Skill = {
  id: "channel-asset-adaptation",
  name: "渠道素材适配",
  scope: "素材",
  purpose: "在统一信息策略下，为落地页、广告、销售触达和社媒生成符合语境的素材。",
  triggers: ["落地页", "广告", "销售邮件", "社媒", "文案"],
  principles: [
    {
      title: "先策略后渠道",
      instruction: "先生成统一 message_strategy，再根据渠道改写标题、正文、证明和 CTA。",
    },
    {
      title: "广告单变量",
      instruction: "每个广告版本只测试一个核心变量：痛点、期望结果、可信证明、异议回应或 CTA。",
    },
    {
      title: "落地页承接",
      instruction: "落地页首屏必须与广告或外联承诺一致，避免点击后语境断裂。",
    },
    {
      title: "销售外联个性化",
      instruction: "销售触达必须结合受访者角色、触发场景和具体阻力，不使用泛泛的模板推销。",
    },
  ],
  checks: [
    {
      name: "证据下钻",
      condition: "核心素材可回到人群、信号和原始访谈",
      fallback: "标记为待验证创意",
    },
    {
      name: "版本独立",
      condition: "3 个广告版本之间只有一个核心变量不同",
      fallback: "重新拆分版本",
    },
  ],
  forbidden: [
    "同一素材混合多个用户人群或多个核心痛点。",
    "将原话改写后仍使用引号。",
    "在不同渠道输出互相矛盾的产品承诺。",
  ],
};
