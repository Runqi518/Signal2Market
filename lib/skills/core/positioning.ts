import type { Skill } from "../types";

export const positioningSkill: Skill = {
  id: "positioning-messaging",
  name: "证据约束定位与信息策略",
  scope: "策略",
  purpose: "把真实人群、任务和痛点转成统一、可验证的定位与信息架构。",
  triggers: ["定位", "Messaging", "价值主张", "品牌表达", "产品叙事"],
  principles: [
    {
      title: "先选择参照系",
      instruction: "明确用户在访谈中提到的替代方案，再说明产品在什么任务上更优，避免脱离竞争语境的空洞定位。",
    },
    {
      title: "从结果而非功能出发",
      instruction: "价值主张优先表达用户获得的结果、减少的成本或降低的风险，再用产品能力作为支撑。",
    },
    {
      title: "建立信息支柱",
      instruction: "围绕一到三个可被证据支撑的支柱组织信息，每个支柱对应用户场景、痛点、期望结果和可信证明。",
    },
    {
      title: "处理核心异议",
      instruction: "优先回应访谈中出现频率高且可能阻断购买的异议，如迁移成本、信任、价格、安全、学习成本。",
    },
    {
      title: "控制能力承诺",
      instruction: "所有承诺必须在 product_context 的能力边界内；未知能力只能作为待验证方向。",
    },
  ],
  checks: [
    {
      name: "绑定关系",
      condition: "每条表达绑定人群、场景、痛点、期望结果",
      fallback: "不得作为正式素材",
    },
    {
      name: "证据来源",
      condition: "核心主张有 evidenceIds",
      fallback: "标记为假设",
    },
    {
      name: "产品边界",
      condition: "未超出产品能力说明",
      fallback: "删除该承诺或提示补充产品上下文",
    },
  ],
  forbidden: [
    "使用“最好用、革命性、行业第一、完全替代人工”等没有证据支撑的绝对化表达。",
    "将用户的愿望改写成产品已经实现的确定性结果。",
    "为不同渠道分别生成彼此冲突的核心价值主张。",
  ],
};
