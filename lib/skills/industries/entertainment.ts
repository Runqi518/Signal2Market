import type { Skill } from "../types";

export const entertainmentSkill: Skill = {
  id: "industry-entertainment",
  name: "娱乐内容 GTM",
  scope: "策略",
  purpose: "适用于游戏、影视、音乐、直播、社交娱乐和内容社区的增长与商业表达。",
  triggers: ["游戏", "影视", "音乐", "直播", "内容", "创作者", "社区"],
  principles: [
    {
      title: "识别消费角色",
      instruction: "区分观看者、互动者、创作者、传播者、付费者和社区组织者，不同角色的任务不同。",
    },
    {
      title: "还原情绪动机",
      instruction: "从放松、陪伴、成就感、身份认同、社交连接、稀缺内容或创作表达中选择主导动机。",
    },
    {
      title: "区分漏斗指标",
      instruction: "将拉新点击、首次消费、连续活跃、分享传播、付费转化和留存分开判断。",
    },
    {
      title: "内容验证单角度",
      instruction: "每版素材只验证情绪价值、身份认同、稀缺性、社交参与或创作成就中的一个角度。",
    },
  ],
  checks: [
    {
      name: "用户价值",
      condition: "素材能说明用户为何现在参与或付费",
      fallback: "不要只强调曝光量",
    },
    {
      name: "未成年人保护",
      condition: "不存在不当定向、诱导充值或夸大奖励",
      fallback: "禁止发布",
    },
    {
      name: "生命周期指标",
      condition: "已区分拉新、激活、留存、分享与付费",
      fallback: "不得用一个 CTR 代替内容价值",
    },
  ],
  forbidden: [
    "诱导未成年人付费、沉迷或进行不适当定向。",
    "夸大概率、收益、奖励或虚拟资产价值。",
    "把高曝光误判为用户留存或商业成功。",
  ],
};
