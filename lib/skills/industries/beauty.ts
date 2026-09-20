import type { Skill } from "../types";

export const beautySkill: Skill = {
  id: "industry-beauty",
  name: "美妆个护 GTM 与内容合规",
  scope: "素材",
  purpose: "适用于护肤、彩妆、洗护、香氛与个护品牌的人群洞察、内容种草和转化表达。",
  triggers: ["美妆", "护肤", "彩妆", "香氛", "洗护", "化妆品"],
  principles: [
    {
      title: "以状态而非标签分群",
      instruction: "按肤质或发质、困扰、使用场景、成分偏好、预算、渠道触点和使用频率识别人群。",
    },
    {
      title: "还原决策链路",
      instruction: "覆盖种草、成分理解、试用、比价、下单、搭配、复购中的真实触发和阻力。",
    },
    {
      title: "内容先于承诺",
      instruction: "优先围绕使用体验、适用场景、成分信息、质地、气味、搭配方式等可验证事实。",
    },
    {
      title: "渠道差异",
      instruction: "小红书偏经验与搜索，抖音偏场景与演示，电商详情页偏功效解释与购买决策，私域偏复购与服务。",
    },
  ],
  checks: [
    {
      name: "功效边界",
      condition: "没有医疗化、绝对化或未经证实的功效承诺",
      fallback: "改为体验或适用场景表达",
    },
    {
      name: "使用条件",
      condition: "涉及效果时说明肤质、使用频率、搭配或个体差异",
      fallback: "标记为需要更多证据",
    },
    {
      name: "创意变量",
      condition: "每个素材只验证困扰、成分、场景或证明中的一个角度",
      fallback: "拆分版本",
    },
  ],
  forbidden: [
    "使用治疗、修复疾病、永久改变、百分之百有效等医疗或绝对化表达。",
    "用个别用户的前后变化暗示所有消费者都能获得同样结果。",
    "虚构成分、认证、检测报告或达人背书。",
  ],
};
