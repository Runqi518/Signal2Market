import { channelAssetsSkill } from "./channels/channel-assets";
import { complianceSkill } from "./core/compliance";
import { experimentSkill } from "./core/experiments";
import { positioningSkill } from "./core/positioning";
import { segmentationSkill } from "./core/segmentation";
import { userResearchSkill } from "./core/user-research";
import { beautySkill } from "./industries/beauty";
import { entertainmentSkill } from "./industries/entertainment";
import { generalIndustrySkill } from "./industries/general";
import { healthcareSkill } from "./industries/healthcare";
import { technologySkill } from "./industries/technology-ai";
import { formatSkill, type Skill } from "./types";

export type Industry = "科技与AI" | "医疗健康" | "美妆个护" | "娱乐内容" | "通用";
export const industries: Industry[] = ["科技与AI", "医疗健康", "美妆个护", "娱乐内容", "通用"];

const industrySkillMap: Record<Industry, Skill> = {
  "科技与AI": technologySkill,
  "医疗健康": healthcareSkill,
  "美妆个护": beautySkill,
  "娱乐内容": entertainmentSkill,
  "通用": generalIndustrySkill,
};

const baseSkills = [userResearchSkill, segmentationSkill, positioningSkill, channelAssetsSkill, experimentSkill, complianceSkill];

export function inferIndustry(text: string): Industry {
  if (/医疗|医院|医生|患者|诊疗|健康|药品|器械/.test(text)) return "医疗健康";
  if (/美妆|护肤|彩妆|香氛|洗护|肤质|化妆品/.test(text)) return "美妆个护";
  if (/游戏|影视|音乐|娱乐|直播|内容社区|创作者/.test(text)) return "娱乐内容";
  if (/SaaS|软件|AI|人工智能|开发者|企业服务|平台|API/i.test(text)) return "科技与AI";
  return "通用";
}

export function getGtmSkillContext(industry: Industry) {
  const skills = [...baseSkills, industrySkillMap[industry]];
  return skills.map(formatSkill).join("\n\n---\n\n");
}

export function getLoadedSkillNames(industry: Industry) {
  return [...baseSkills, industrySkillMap[industry]].map((skill) => skill.name);
}

export type { Skill } from "./types";
