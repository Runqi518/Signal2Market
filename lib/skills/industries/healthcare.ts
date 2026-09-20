import type { Skill } from "../types";

export const healthcareSkill: Skill = {
  id: "industry-healthcare",
  name: "医疗健康 GTM 与合规预检",
  scope: "合规",
  purpose: "适用于医疗服务、健康管理、数字健康、药械相关产品的用户研究与市场表达。",
  triggers: ["医疗", "健康", "患者", "医生", "诊疗", "器械"],
  principles: [
    {
      title: "拆分医疗角色",
      instruction: "区分患者、家属、医生、护士、医疗机构、采购、支付方和监管相关角色，不能合并为单一用户。",
    },
    {
      title: "只表达体验与服务价值",
      instruction: "素材可表达流程效率、可及性、理解成本、服务体验和访谈中出现的事实，不提供诊断或治疗建议。",
    },
    {
      title: "高风险宣称升级",
      instruction: "涉及疾病、疗效、安全、临床结果、诊断准确性时必须标记为医学、法务或合规人工审核。",
    },
    {
      title: "信任优先",
      instruction: "优先使用服务流程透明、专业资质、隐私保护、适用边界和真实体验来建立信任。",
    },
  ],
  checks: [
    {
      name: "医疗宣称",
      condition: "没有治愈、根治、无副作用、绝对安全、替代医生等表述",
      fallback: "禁止发布",
    },
    {
      name: "证据等级",
      condition: "健康效果仅来自访谈事实并标注适用范围",
      fallback: "标记为待专业验证",
    },
    {
      name: "受众保护",
      condition: "不制造疾病恐惧、不诱导高风险健康决策",
      fallback: "重写为教育和透明信息",
    },
  ],
  forbidden: [
    "提供医疗诊断、治疗建议、用药指导或确定性疗效承诺。",
    "用患者个案暗示普遍疗效。",
    "在未经专业审核时生成医疗器械、药品或治疗相关广告。",
  ],
};
