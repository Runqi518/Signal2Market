import type { Skill } from "../types";

export const experimentSkill: Skill = {
  id: "experiment-learning-loop",
  name: "GTM 实验与学习闭环",
  scope: "实验",
  purpose: "让每一条策略和素材都能通过真实市场结果被验证、保留或淘汰。",
  triggers: ["实验", "A/B 测试", "投放验证", "数据回流", "增长验证"],
  principles: [
    {
      title: "先写假设",
      instruction: "实验必须包含人群、渠道、变量、预期结果和失败解释，不能把素材生成当作实验本身。",
    },
    {
      title: "一次只改一个核心变量",
      instruction: "标题、痛点角度、证明方式、CTA、受众或页面承诺不得同时变化。",
    },
    {
      title: "指标对应增长目标",
      instruction: "获客看合格线索或预约，激活看首次价值动作，付费看购买或高意向行为，召回看回流后的持续行为。",
    },
    {
      title: "尊重样本约束",
      instruction: "在达到最低样本或运行周期前，不宣布胜出，不自动替换人群推荐。",
    },
    {
      title: "沉淀学习",
      instruction: "每次实验记录为什么胜或败、哪个假设被更新，以及下一轮应保留哪个变量。",
    },
  ],
  checks: [
    {
      name: "追踪完整性",
      condition: "人群、策略和素材版本有不可变追踪 ID",
      fallback: "不能归因到具体策略",
    },
    {
      name: "结论门槛",
      condition: "样本量、周期和转化数达到预设阈值",
      fallback: "状态只能是继续收集",
    },
    {
      name: "回流规则",
      condition: "研究证据与市场验证分别呈现",
      fallback: "不得用单一点击率覆盖研究结论",
    },
  ],
  forbidden: [
    "用少量点击、曝光或单次转化宣布市场结论。",
    "根据未归因数据自动修改 ICP、定价或核心定位。",
    "为了提升短期 CTR 引入与产品无关的夸张表达。",
  ],
};
