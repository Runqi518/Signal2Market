import type { Skill } from "../types";

export const complianceSkill: Skill = {
  id: "compliance-risk-precheck",
  name: "合规与风险预检",
  scope: "合规",
  purpose: "在策略和素材进入发布前，识别行业、平台和产品能力层面的违规风险。",
  triggers: ["广告审核", "敏感词", "合规", "功效宣称", "投放素材", "医疗宣称"],
  principles: [
    {
      title: "能力一致",
      instruction: "检查所有文案是否超出 product_context；未声明能力必须删除或转为待验证表述。",
    },
    {
      title: "风险分级",
      instruction: "将问题分为可直接改写、需补充证明、需人工法务或专业审核、禁止发布四级。",
    },
    {
      title: "平台语境",
      instruction: "根据渠道识别搜索广告、社媒、电商、私域或销售外联的不同审核边界。",
    },
    {
      title: "保留替代写法",
      instruction: "对高风险表达给出更安全的替代表述，而不是只标红问题。",
    },
  ],
  checks: [
    {
      name: "绝对化用语",
      condition: "没有第一、最佳、永久、彻底解决等无法证明的表述",
      fallback: "改为可验证的场景化表达",
    },
    {
      name: "证明要求",
      condition: "涉及效果、数据、案例或权威背书的表达已有来源",
      fallback: "标记为需补充证明",
    },
    {
      name: "人工审核",
      condition: "涉及健康、金融、未成年人或重大功效",
      fallback: "不得直接发布",
    },
  ],
  forbidden: [
    "承诺产品未声明的能力、兼容性、数据安全等级或业务结果。",
    "规避平台规则、暗示绕过审核或使用误导性表述。",
    "将合规预检结果包装成法律意见。",
  ],
};
