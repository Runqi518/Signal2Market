import { NextResponse } from "next/server";
import { demoResult } from "@/lib/demo";
import { getGtmSkillContext, inferIndustry } from "@/lib/skills";
import type { AnalysisResult, Evidence } from "@/lib/types";

export const maxDuration = 60;

type RequestBody = {
  product: { name?: string; description?: string; capabilities?: string; goal?: string; industry?: string };
  transcripts: { name: string; content: string }[];
  profile?: string;
};

function extractQuotes(transcripts: RequestBody["transcripts"]): Evidence[] {
  const candidates = transcripts.flatMap((file, fileIndex) =>
    file.content
      .split(/[。！？!?\n]+/)
      .map((text, lineIndex) => ({ text: text.trim(), file, fileIndex, lineIndex }))
      .filter(({ text }) => text.length >= 12 && text.length <= 100),
  );
  const signalPattern = /但是|问题|困难|麻烦|需要|希望|担心|付费|价格|购买|换成|效率|时间|不能|没有/;
  const selected = [...candidates.filter(({ text }) => signalPattern.test(text)), ...candidates]
    .filter((item, index, all) => all.findIndex((other) => other.text === item.text) === index)
    .slice(0, 4);

  return selected.map(({ text, file, fileIndex, lineIndex }, index) => ({
    id: `e${index + 1}`,
    participant: `P-${String(fileIndex + 1).padStart(2, "0")}`,
    profile: "画像待补充",
    quote: text,
    source: file.name,
    location: `片段 ${lineIndex + 1}`,
  }));
}

function localAnalysis(body: RequestBody): AnalysisResult {
  const evidence = extractQuotes(body.transcripts);
  if (!evidence.length) return demoResult;
  const participants = new Set(body.transcripts.map((item) => item.name)).size;
  const evidenceIds = evidence.map((item) => item.id);
  const primaryQuote = evidence[0].quote;
  const outcomeQuote = evidence[1]?.quote || primaryQuote;
  const exploratoryScore = participants < 3 ? 58 : 68;
  return {
    sample: { interviews: body.transcripts.length, participants, profileMatch: body.profile ? 90 : 0 },
    evidence,
    segments: [{
      id: "s1",
      name: "当前访谈样本（探索性）",
      count: participants,
      description: "未启用语义模型，当前仅根据已导入材料形成一个探索性样本组，不推断额外人群属性。",
      traits: [body.profile ? "已导入画像" : "画像未知", `${participants} 名独立参与者`, body.product.goal || "GTM 目标未知"],
      pain: 60,
      buying: 35,
      fit: 65,
      confidence: participants < 3 ? 40 : 55,
      score: exploratoryScore,
      evidenceIds,
    }],
    signals: evidence.slice(0, 4).map((item, index) => ({
      type: index === 0 ? "痛点" : index === 1 ? "期望结果" : "购买阻力",
      label: item.quote.length > 28 ? `${item.quote.slice(0, 28)}…` : item.quote,
      coverage: Math.round(100 / participants),
      strength: index === 0 ? 60 : 50,
      evidenceIds: [item.id],
    })),
    strategy: {
      positioning: `为正在解决“${body.product.description || "用户需求到市场验证"}”的团队，将真实访谈直接转化为可验证的目标人群与 GTM 素材。`,
      valueProp: `围绕 ${body.product.name || "你的产品"} 的真实用户证据，自动完成从分群到渠道文案的传导。`,
      pillars: [
        { title: "用户问题", body: primaryQuote, evidenceIds: [evidence[0].id] },
        { title: "期望结果", body: outcomeQuote, evidenceIds: [evidence[1]?.id || evidence[0].id] },
        { title: "产品连接", body: body.product.capabilities || "产品能力尚未补充，发布前需要完善。", evidenceIds: [] },
      ],
      objection: "当前结论属于本地探索性分析，需要配置语义模型或补充更多样本后再确定目标人群。",
    },
    assets: {
      landing: {
        headline: `用真实访谈验证 ${body.product.name || "产品"} 的市场表达`,
        subhead: `围绕“${primaryQuote}”这一已出现的用户信号，生成可测试的定位与渠道素材。`,
        cta: body.product.goal === "付费转化" ? "查看方案" : "开始验证",
      },
      ads: [
        { label: "问题角度", headline: primaryQuote, body: `${body.product.name || "产品"}：${body.product.description}`, variable: "用户问题" },
        { label: "结果角度", headline: outcomeQuote, body: body.product.capabilities || body.product.description || "了解产品方案", variable: "期望结果" },
        { label: "证据角度", headline: "从真实用户表达出发", body: `基于 ${participants} 名受访者的当前样本生成，继续用市场结果验证。`, variable: "证据可信度" },
      ],
      email: {
        subject: `关于“${primaryQuote.slice(0, 24)}”`,
        body: `我们正在用 ${body.product.name || "该产品"} 解决这一问题：${body.product.description}。如果这也是你的实际场景，欢迎参与一次简短验证。`,
      },
      social: `${body.product.name || "产品"} 正在验证一个来自真实访谈的问题：“${primaryQuote}”。${body.product.description}`,
    },
    limitations: [
      "当前使用本地规则分析；配置 OPENAI_API_KEY 后可启用深度语义分析。",
      ...(body.profile ? [] : ["未导入受访者画像，人口与组织属性均保持未知。"]),
      ...(participants < 3 ? ["独立参与者少于 3 人，人群评分已限制为探索性等级。"] : []),
      "样本覆盖率只代表本次导入材料，不代表整体市场规模。",
    ],
  };
}

function parseModelJson(content: string): AnalysisResult {
  const cleaned = content.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned) as AnalysisResult;
}

function validateQuotes(result: AnalysisResult, body: RequestBody): AnalysisResult {
  const sourceByName = new Map(body.transcripts.map((item) => [item.name, item.content]));
  const evidence = result.evidence.filter((item) => sourceByName.get(item.source)?.includes(item.quote));
  const validIds = new Set(evidence.map((item) => item.id));
  return {
    ...result,
    evidence,
    segments: result.segments.map((item) => ({ ...item, evidenceIds: item.evidenceIds.filter((id) => validIds.has(id)) })),
    signals: result.signals.map((item) => ({ ...item, evidenceIds: item.evidenceIds.filter((id) => validIds.has(id)) })),
    strategy: {
      ...result.strategy,
      pillars: result.strategy.pillars.map((item) => ({ ...item, evidenceIds: item.evidenceIds.filter((id) => validIds.has(id)) })),
    },
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;
  if (!body.transcripts?.length) {
    return NextResponse.json({ error: "至少需要一份文本访谈" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json(localAnalysis(body));

  const validIndustries = ["科技与AI", "医疗健康", "美妆个护", "娱乐内容", "通用"];
  const industry = (body.product.industry && validIndustries.includes(body.product.industry) 
    ? body.product.industry 
    : inferIndustry(`${body.product.name || ""} ${body.product.description || ""} ${body.product.capabilities || ""}`)) as any;
  const prompt = `你是 Signal2Market 的访谈到 GTM 分析引擎。只能使用输入资料，输出严格 JSON 且结构与示例完全一致。不得推断未知身份；所有 quote 必须逐字来自原文并填写准确 source；样本覆盖不能表述为市场规模；生成 2 至 3 个人群、四类信号、Messaging、落地页、3 版广告、邮件、社媒文案和限制。评分公式：覆盖20%、痛点25%、购买信号20%、产品匹配25%、证据置信10%。\n\n当前识别行业：${industry}\n内置 Skill（必须执行，行业规则仅适用于当前行业）：\n${getGtmSkillContext(industry)}\n\nJSON 结构示例：${JSON.stringify(demoResult)}\n\n输入：${JSON.stringify(body)}`;
  try {
    const response = await fetch(`${process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!response.ok) throw new Error(`Model request failed: ${response.status}`);
    const payload = await response.json();
    const result = parseModelJson(payload.choices[0].message.content);
    return NextResponse.json(validateQuotes(result, body));
  } catch {
    return NextResponse.json(localAnalysis(body));
  }
}
