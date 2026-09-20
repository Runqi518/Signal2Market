import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agent, goal, channel, budget, audience, assets } = body;

    const apiKey = process.env.OPENAI_API_KEY || process.env.DASHSCOPE_API_KEY;
    
    // 如果没有配置 key，返回 mock 数据
    if (!apiKey) {
      console.warn("No OPENAI_API_KEY found, returning mock data");
      return NextResponse.json({
        concept: `${agent} 的模拟：不是你弃游，是游戏先把你赶走`,
        hook: `承认过去的体验糟糕，用幽默反转引入新版本的丝滑体验（${channel} 专属）`,
        offer: "上线即领「抱歉大礼包」与跳过繁琐主线特权",
        plan: "1. 社媒自黑短视频 2. 玩家吐槽集锦海报 3. KOC 评测反转",
        metrics: "点击率提升 40%，回归首日留存率达到 60%"
      });
    }

    const systemPrompt = `你是一位深谙世界顶尖营销大师方法的 AI Agent。
当前选择的营销大师是：${agent}。
请严格遵循 ${agent} 的核心决策原则和方法论来构思这个活动 (Campaign)。

要求输出 JSON 格式，包含以下字段：
{
  "concept": "核心概念 (Campaign Concept)，一两句话总结这个活动的本质",
  "hook": "核心钩子 (Core Hook)，如何第一眼抓住用户注意力",
  "offer": "诱饵 / 行动号召 (Offer)，给用户什么不可抗拒的价值",
  "plan": "素材计划 (Asset Plan)，按顺序列出需要制作的核心素材",
  "metrics": "测试假设与成功指标 (Metrics)，如何判断这个活动成功"
}`;

    const userPrompt = `
我们正在策划一场营销活动。
【目标】：${goal}
【渠道】：${channel}
【预算】：${budget}

【目标人群特征】：
- 人群名称: ${audience?.name || '未知'}
- 人群描述: ${audience?.description || '未知'}
- 核心痛点: ${audience?.traits?.join(', ') || '未知'}

【已有资产参考 (Messaging)】：
- 价值主张: ${assets?.strategy?.valueProp || '未知'}

请以 ${agent} 的风格和视角，针对上述背景输出一份可执行的 Campaign 草案 (确保严格返回 JSON)。`;

    const res = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-plus",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Qwen API Error:", errorText);
      throw new Error("Failed to fetch from Qwen");
    }

    const data = await res.json();
    const content = data.choices[0].message.content;
    const jsonResult = JSON.parse(content);
    return NextResponse.json(jsonResult);
  } catch (error) {
    console.error("Campaign Agent Error:", error);
    return NextResponse.json({
        concept: "不是你弃游，是游戏先把你赶走 (Fallback)",
        hook: "承认过去的体验糟糕，用幽默反转引入新版本的丝滑体验",
        offer: "上线即领「抱歉大礼包」与跳过繁琐主线特权",
        plan: "1. 社媒自黑短视频 2. 玩家吐槽集锦海报 3. KOC 评测反转",
        metrics: "点击率提升 40%，回归首日留存率达到 60%"
    });
  }
}
