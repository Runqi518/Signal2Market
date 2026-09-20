export type SkillRule = {
  title: string;
  instruction: string;
};

export type SkillQualityGate = {
  name: string;
  condition: string;
  fallback: string;
};

export type Skill = {
  id: string;
  name: string;
  scope: "研究" | "分析" | "策略" | "素材" | "实验" | "合规";
  purpose: string;
  triggers: string[];
  principles: SkillRule[];
  checks: SkillQualityGate[];
  forbidden: string[];
};

export function formatSkill(skill: Skill) {
  const principles = skill.principles.map((rule) => `- ${rule.title}：${rule.instruction}`).join("\n");
  const checks = skill.checks.map((gate) => `- ${gate.name}：满足条件是「${gate.condition}」；否则「${gate.fallback}」。`).join("\n");
  const forbidden = skill.forbidden.map((item) => `- ${item}`).join("\n");
  return `【${skill.name}】${skill.purpose}\n\n原则：\n${principles}\n\n质量门槛：\n${checks}\n\n禁止事项：\n${forbidden}`;
}
