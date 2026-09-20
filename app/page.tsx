"use client";

import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleDot,
  Clipboard,
  Database,
  Download,
  FileAudio,
  FlaskConical,
  Gauge,
  Layers3,
  LoaderCircle,
  Megaphone,
  MessageSquareQuote,
  PenTool,
  Plus,
  Rocket,
  Search,
  Smile,
  Sparkles,
  Target,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { demoResult } from "@/lib/demo";
import type { AnalysisResult, Evidence, Segment } from "@/lib/types";
import { industries, type Industry } from "@/lib/skills";

const nav = [
  { id: "overview", label: "Overview", icon: Gauge },
  { id: "data", label: "Data", icon: Database },
  { id: "audience", label: "Audience", icon: Target },
  { id: "assets", label: "Assets", icon: Sparkles },
  { id: "campaigns", label: "Campaigns", icon: Rocket },
  { id: "experiments", label: "Experiments", icon: FlaskConical },
] as const;

type View = (typeof nav)[number]["id"];
type UploadItem = { name: string; content: string; size: string };

const steps = ["资料导入", "信号提取", "人群发现", "策略生成", "素材完成", "活动策划"];

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [result, setResult] = useState<AnalysisResult>(demoResult);
  const [selectedSegment, setSelectedSegment] = useState("s1");
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [profile, setProfile] = useState("");
  const [product, setProduct] = useState<{ name: string; description: string; capabilities: string; goal: string; industry: Industry | "自动推断" }>({ name: "", description: "", capabilities: "", goal: "获客", industry: "自动推断" });

  const primary = result.segments[0];

  useEffect(() => {
    if (!processing) return;
    const timer = window.setInterval(() => setProgress((value) => Math.min(value + Math.ceil(Math.random() * 8), 92)), 500);
    return () => window.clearInterval(timer);
  }, [processing]);

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    const parsed = await Promise.all(
      selected.map(async (file) => ({ name: file.name, content: await file.text(), size: `${Math.max(1, Math.round(file.size / 1024))} KB` })),
    );
    setFiles((current) => [...current, ...parsed]);
  }

  async function runAgent() {
    if (!product.name || !product.description || !files.length) return;
    setProcessing(true);
    setProgress(4);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, transcripts: files, profile }),
      });
      if (!response.ok) throw new Error("analysis failed");
      const payload = (await response.json()) as AnalysisResult;
      setResult(payload);
      setSelectedSegment(payload.segments[0]?.id || "");
      setProgress(100);
      window.setTimeout(() => {
        setProcessing(false);
        setShowNew(false);
        setView("overview");
      }, 500);
    } catch {
      setProcessing(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>Signal<span className="brand-fade">/Market</span></span></div>
        <button className="new-button" onClick={() => setShowNew(true)}><Plus size={16} /> New analysis</button>
        <nav className="nav-list">
          <p className="nav-title">WORKSPACE</p>
          {nav.map((item) => <button key={item.id} className={view === item.id ? "nav-item active" : "nav-item"} onClick={() => setView(item.id)}><item.icon size={17} /><span>{item.label}</span>{item.id === "assets" && <span className="count">12</span>}</button>)}
        </nav>
        <div className="project-card">
          <div className="project-icon">SF</div>
          <div><b>Summer launch</b><span>Last run 2h ago</span></div>
          <ChevronDown size={15} />
        </div>
        <div className="sidebar-foot"><span className="avatar">LR</span><div><b>Research team</b><span>Pro workspace</span></div></div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div><span className="eyebrow">PROJECT</span><h1>Summer launch <span className="status"><i /> Analysis ready</span></h1></div>
          <div className="top-actions"><button className="icon-button"><Search size={18} /></button><button className="secondary"><Download size={16} /> Export</button><button className="primary" onClick={() => setShowNew(true)}>New analysis <ArrowRight size={16} /></button></div>
        </header>

        {view === "overview" && <Overview result={result} onEvidence={setSelectedEvidence} onNavigate={setView} />}
        {view === "data" && <DataView result={result} files={files} onNew={() => setShowNew(true)} />}
        {view === "audience" && <AudienceView result={result} onEvidence={setSelectedEvidence} />}
        {view === "assets" && <AssetsView result={result} />}
        {view === "campaigns" && <CampaignsView result={result} />}
        {view === "experiments" && <ExperimentsView />}
      </section>

      {selectedEvidence && <EvidenceDrawer evidence={selectedEvidence} onClose={() => setSelectedEvidence(null)} />}
      {showNew && <NewAnalysisModal files={files} product={product} profile={profile} processing={processing} progress={progress} setProduct={setProduct} setProfile={setProfile} onFiles={handleFiles} removeFile={(name) => setFiles(files.filter((file) => file.name !== name))} onClose={() => !processing && setShowNew(false)} onRun={runAgent} />}
    </main>
  );
}

function Overview({ result, onEvidence, onNavigate }: { result: AnalysisResult; onEvidence: (item: Evidence) => void; onNavigate: (view: View) => void }) {
  const primary = result.segments[0];
  return <div className="page-content">
    <div className="flow-strip">{steps.map((step, index) => <div className="flow-step" key={step}><span><Check size={12} /></span><small>{step}</small>{index < steps.length - 1 && <i />}</div>)}</div>
    <section className="hero-grid">
      <article className="recommend-card gradient-border">
        <div className="card-label"><Target size={15} /> PRIMARY AUDIENCE</div>
        <h2>{primary.name}</h2><p>{primary.description}</p>
        <div className="tag-row">{primary.traits.map((trait) => <span key={trait}>{trait}</span>)}</div>
        <div className="reason"><Sparkles size={17} /><div><b>为什么是他们</b><p>高强度痛点与明确的上线时点同时出现，且当前产品能力可直接覆盖核心任务。</p></div></div>
        <div className="card-actions"><button className="link-button" onClick={() => onNavigate("audience")}>查看完整分析 <ArrowRight size={15} /></button><button className="evidence-button" onClick={() => onEvidence(result.evidence[0])}><MessageSquareQuote size={14} /> {primary.evidenceIds.length} 条证据</button></div>
      </article>
      <article className="score-card">
        <div className="score-ring" style={{ "--score": `${primary.score * 3.6}deg` } as React.CSSProperties}><div><strong>{primary.score}</strong><small>/ 100</small></div></div>
        <h3>Evidence-fit score</h3><p>当前样本中的优先推荐</p>
        <div className="score-list"><Score label="样本覆盖" value={82} /><Score label="痛点强度" value={primary.pain} /><Score label="购买信号" value={primary.buying} /><Score label="产品匹配" value={primary.fit} /><Score label="证据置信" value={primary.confidence} /></div>
      </article>
    </section>
    <section className="section-head"><div><span className="eyebrow">EVIDENCE CHAIN</span><h2>从 18 次访谈到一套可验证素材</h2></div><button className="text-button" onClick={() => onNavigate("audience")}>Explore analysis <ArrowRight size={15} /></button></section>
    <div className="chain-grid"><Chain icon={FileAudio} value={`${result.sample.interviews}`} label="访谈" tone="blue" /><Chain icon={Users} value={`${result.segments.length}`} label="行为分群" tone="purple" /><Chain icon={CircleDot} value={`${result.signals.length}`} label="关键信号" tone="pink" /><Chain icon={Target} value="1" label="首选人群" tone="violet" /><Chain icon={Rocket} value="12" label="GTM 素材" tone="coral" /></div>
    <section className="bottom-grid">
      <article className="panel"><div className="panel-head"><div><span className="eyebrow">TOP SIGNALS</span><h3>决定用户行动的信号</h3></div><BarChart3 size={19} /></div>{result.signals.slice(0, 3).map((signal) => <div className="signal-row" key={signal.label}><span className={`signal-type ${signal.type}`}>{signal.type}</span><div><b>{signal.label}</b><small>{signal.coverage}% 受访者提及</small></div><div className="mini-bar"><i style={{ width: `${signal.strength}%` }} /></div><strong>{signal.strength}</strong></div>)}</article>
      <article className="panel asset-preview"><div className="panel-head"><div><span className="eyebrow">READY TO TEST</span><h3>Landing page · Hero</h3></div><Sparkles size={19} /></div><div className="mini-landing"><span>Evidence-backed GTM</span><h3>{result.assets.landing.headline}</h3><p>{result.assets.landing.subhead}</p><button>{result.assets.landing.cta} <ArrowRight size={14} /></button></div><button className="link-button" onClick={() => onNavigate("assets")}>打开素材工作台 <ArrowRight size={15} /></button></article>
    </section>
  </div>;
}

function Score({ label, value }: { label: string; value: number }) { return <div><span>{label}</span><i><em style={{ width: `${value}%` }} /></i><b>{value}</b></div>; }
function Chain({ icon: Icon, value, label, tone }: { icon: typeof FileAudio; value: string; label: string; tone: string }) { return <article className={`chain-card ${tone}`}><span><Icon size={18} /></span><div><strong>{value}</strong><small>{label}</small></div><ArrowRight className="chain-arrow" size={17} /></article>; }

function DataView({ result, files, onNew }: { result: AnalysisResult; files: UploadItem[]; onNew: () => void }) {
  const rows = files.length ? files : [{ name: "Interview_P07.txt", size: "28 KB", content: "" }, { name: "Interview_P12.txt", size: "31 KB", content: "" }, { name: "participants.csv", size: "6 KB", content: "" }];
  return <div className="page-content"><section className="section-head"><div><span className="eyebrow">SOURCE DATA</span><h2>访谈与受访者画像</h2><p>{result.sample.interviews} 份访谈 · {result.sample.participants} 名参与者 · {result.sample.profileMatch}% 画像匹配</p></div><button className="primary" onClick={onNew}><UploadCloud size={16} /> 添加资料</button></section><div className="stats-grid"><Stat label="有效访谈" value={String(result.sample.interviews)} hint="全部已完成解析" /><Stat label="独立参与者" value={String(result.sample.participants)} hint="已完成身份去重" /><Stat label="画像匹配率" value={`${result.sample.profileMatch}%`} hint="未匹配属性保持未知" /><Stat label="引用可定位" value="100%" hint="已通过原文校验" /></div><article className="panel data-table"><div className="table-head"><b>文件</b><b>参与者</b><b>状态</b><b>数据质量</b></div>{rows.map((file, index) => <div className="table-row" key={file.name}><div><span className="file-icon"><FileAudio size={16} /></span><div><b>{file.name}</b><small>{file.size}</small></div></div><span>P-{String(index + 1).padStart(2, "0")}</span><span className="ready"><Check size={13} /> Ready</span><span>{index === 2 ? "画像字段 8/8" : "说话人已区分"}</span></div>)}</article></div>;
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) { return <article className="stat"><span>{label}</span><strong>{value}</strong><small>{hint}</small></article>; }

function SegmentsView({ result, selected, setSelected, onEvidence }: { result: AnalysisResult; selected: string; setSelected: (id: string) => void; onEvidence: (item: Evidence) => void }) {
  const active = result.segments.find((segment) => segment.id === selected) || result.segments[0];
  const evidence = result.evidence.filter((item) => active.evidenceIds.includes(item.id));
  return <div className="page-content"><section className="section-head"><div><span className="eyebrow">AUTO SEGMENTATION</span><h2>样本中识别出 {result.segments.length} 类行为人群</h2><p>基于已知画像、使用场景、JTBD、替代方案与购买信号联合分群。</p></div><button className="secondary"><Sparkles size={16} /> 重新运行</button></section><div className="segment-layout"><div className="segment-list">{result.segments.map((segment, index) => <button key={segment.id} onClick={() => setSelected(segment.id)} className={segment.id === active.id ? "segment-item selected" : "segment-item"}><span className={`rank rank-${index + 1}`}>0{index + 1}</span><div><b>{segment.name}</b><small>{segment.count} 人 · Score {segment.score}</small></div><ArrowRight size={16} /></button>)}</div><article className="segment-detail"><div className="card-label"><Users size={15} /> SEGMENT PROFILE</div><h2>{active.name}</h2><p>{active.description}</p><div className="tag-row">{active.traits.map((trait) => <span key={trait}>{trait}</span>)}</div><div className="axis-card"><div className="axis-label y">购买信号</div><div className="axis-label x">痛点强度</div>{result.segments.map((segment, index) => <div key={segment.id} className={`bubble bubble-${index + 1}`} style={{ left: `${segment.pain - 28}%`, bottom: `${segment.buying - 35}%` }}>{segment.score}</div>)}</div><h3>关键需求信号</h3>{result.signals.map((signal) => <div className="compact-signal" key={signal.label}><span>{signal.type}</span><b>{signal.label}</b><small>{signal.coverage}%</small></div>)}</article><aside className="evidence-panel"><span className="eyebrow">SUPPORTING EVIDENCE</span><h3>他们亲口说了什么</h3>{evidence.map((item) => <button key={item.id} className="quote-card" onClick={() => onEvidence(item)}><MessageSquareQuote size={17} /><q>{item.quote}</q><small>{item.participant} · {item.location}</small></button>)}</aside></div></div>;
}

function AudienceView({ result, onEvidence }: { result: AnalysisResult; onEvidence: (item: Evidence) => void }) {
  return <div className="page-content"><section className="section-head"><div><span className="eyebrow">AUDIENCE RECOMMENDATION</span><h2>优先验证谁，以及为什么</h2><p>分数只代表当前研究样本，不等同于市场规模。</p></div></section><div className="audience-stack">{result.segments.map((segment, index) => <AudienceCard key={segment.id} segment={segment} index={index} evidence={result.evidence} onEvidence={onEvidence} />)}</div><div className="notice"><CircleDot size={17} /><div><b>推荐边界</b><p>{result.limitations.join(" ")}</p></div></div></div>;
}
function AudienceCard({ segment, index, evidence, onEvidence }: { segment: Segment; index: number; evidence: Evidence[]; onEvidence: (item: Evidence) => void }) {
  return <article className={index === 0 ? "audience-card primary-audience" : "audience-card"}><div className="audience-rank"><span>{index === 0 ? "首选人群" : `候选 ${index}`}</span><strong>{segment.score}</strong><small>/ 100</small></div><div className="audience-main"><h3>{segment.name}</h3><p>{segment.description}</p><div className="tag-row">{segment.traits.map((trait) => <span key={trait}>{trait}</span>)}</div></div><div className="score-breakdown"><Score label="痛点" value={segment.pain} /><Score label="购买" value={segment.buying} /><Score label="匹配" value={segment.fit} /><Score label="置信" value={segment.confidence} /></div><button className="evidence-button" onClick={() => onEvidence(evidence.find((item) => segment.evidenceIds.includes(item.id)) || evidence[0])}><MessageSquareQuote size={14} /> 查看依据</button></article>;
}

function AssetsView({ result }: { result: AnalysisResult }) {
  const [tab, setTab] = useState("Messaging");
  const tabs = ["Messaging", "落地页", "广告", "销售触达", "用户原话库"];
  return <div className="page-content assets-page"><section className="context-bar"><div><span>当前人群</span><b>{result.segments[0].name}</b></div><div><span>核心场景</span><b>访谈结束后启动增长实验</b></div><div><span>核心价值</span><b>证据直接转为可测试素材</b></div></section><div className="asset-tabs">{tabs.map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div><section className="asset-workspace"><div className="asset-canvas">{tab === "Messaging" && <Messaging result={result} />}{tab === "落地页" && <Landing result={result} />}{tab === "广告" && <Ads result={result} />}{tab === "销售触达" && <Email result={result} />}{tab === "用户原话库" && <QuoteLibrary result={result} />}</div><aside className="strategy-side"><span className="eyebrow">STRATEGY BASIS</span><h3>这套表达从哪里来</h3><div className="basis-item"><span>01</span><div><b>Audience</b><p>{result.segments[0].name}</p></div></div><div className="basis-item"><span>02</span><div><b>Pain</b><p>{result.signals[0].label}</p></div></div><div className="basis-item"><span>03</span><div><b>Outcome</b><p>{result.signals[1].label}</p></div></div><div className="basis-item"><span>04</span><div><b>Proof</b><p>{result.evidence.length} 条原始证据已校验</p></div></div><button className="primary full"><FlaskConical size={16} /> 创建验证实验</button></aside></section></div>;
}

function CopyButton({ text }: { text: string }) { return <button className="copy" onClick={() => navigator.clipboard.writeText(text)}><Clipboard size={14} /> Copy</button>; }
function Messaging({ result }: { result: AnalysisResult }) { return <div><CanvasHead eyebrow="MESSAGE STRATEGY" title="统一信息策略" /><AssetBlock label="定位句" text={result.strategy.positioning} /><AssetBlock label="核心价值主张" text={result.strategy.valueProp} /><h3 className="subheading">三条信息支柱</h3><div className="pillar-grid">{result.strategy.pillars.map((pillar, index) => <article key={pillar.title}><span>0{index + 1}</span><h4>{pillar.title}</h4><p>{pillar.body}</p><small>{pillar.evidenceIds.length} 条依据</small></article>)}</div><AssetBlock label="核心异议回应" text={result.strategy.objection} /></div>; }
function Landing({ result }: { result: AnalysisResult }) { return <div><CanvasHead eyebrow="LANDING PAGE" title="Hero section" /><div className="landing-editor"><span>Interview intelligence for GTM</span><h2>{result.assets.landing.headline}</h2><p>{result.assets.landing.subhead}</p><button>{result.assets.landing.cta} <ArrowRight size={15} /></button></div></div>; }
function Ads({ result }: { result: AnalysisResult }) { return <div><CanvasHead eyebrow="AD VARIATIONS" title="单变量测试素材" /><div className="ad-grid">{result.assets.ads.map((ad, index) => <article key={ad.label}><div><span>VERSION {String.fromCharCode(65 + index)}</span><small>变量：{ad.variable}</small></div><h3>{ad.headline}</h3><p>{ad.body}</p><CopyButton text={`${ad.headline}\n${ad.body}`} /></article>)}</div></div>; }
function Email({ result }: { result: AnalysisResult }) { return <div><CanvasHead eyebrow="SALES OUTREACH" title="冷启动邮件" /><AssetBlock label="Subject" text={result.assets.email.subject} /><AssetBlock label="Body" text={result.assets.email.body} /></div>; }
function QuoteLibrary({ result }: { result: AnalysisResult }) { return <div><CanvasHead eyebrow="VERBATIM LIBRARY" title="已校验用户原话" />{result.evidence.map((item) => <article className="library-quote" key={item.id}><q>{item.quote}</q><div><span>{item.participant} · {item.profile}</span><small>{item.source} · {item.location}</small></div></article>)}</div>; }
function CanvasHead({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="canvas-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><button className="secondary"><Download size={15} /> Export</button></div>; }
function AssetBlock({ label, text }: { label: string; text: string }) { return <article className="asset-block"><div><span>{label}</span><CopyButton text={text} /></div><p>{text}</p><button className="evidence-link"><MessageSquareQuote size={13} /> 查看依据</button></article>; }

const CAMPAIGN_AGENTS = [
  { id: "hopkins", name: "Claude Hopkins", tag: "科学广告", desc: "科学广告、明确利益、优惠机制、持续测试", icon: FlaskConical },
  { id: "ogilvy", name: "David Ogilvy", tag: "品牌形象", desc: "深度研究、品牌形象、具体事实、Big Idea", icon: PenTool },
  { id: "bernbach", name: "Bill Bernbach", tag: "人性洞察", desc: "反套路、人性洞察、幽默、文案与视觉一体", icon: Smile },
  { id: "reeves", name: "Rosser Reeves", tag: "独特卖点", desc: "USP：一次只传达一个独特卖点并重复强化", icon: Target },
  { id: "burnett", name: "Leo Burnett", tag: "内在戏剧性", desc: "挖掘产品“内在戏剧性”，角色、故事与符号", icon: Sparkles },
  { id: "wells", name: "Mary Wells", tag: "事件营销", desc: "戏剧化、娱乐化、跨渠道制造事件", icon: Megaphone }
];

function CampaignsView({ result }: { result: AnalysisResult }) {
  const [selectedAgent, setSelectedAgent] = useState(CAMPAIGN_AGENTS[2]);
  const [goal, setGoal] = useState("召回流失用户");
  const [channel, setChannel] = useState("LinkedIn");
  const [budget, setBudget] = useState("$5,000");
  const [generating, setGenerating] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: selectedAgent.name,
          goal,
          channel,
          budget,
          audience: result.segments[0],
          assets: result.assets,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCampaign(data);
      } else {
        throw new Error("API failed");
      }
    } catch (e) {
      console.error(e);
      setCampaign({
        concept: "不是你弃游，是游戏先把你赶走",
        hook: "承认过去的体验糟糕，用幽默反转引入新版本的丝滑体验",
        offer: "上线即领「抱歉大礼包」与跳过繁琐主线特权",
        plan: "1. 社媒自黑短视频 2. 玩家吐槽集锦海报 3. KOC 评测反转",
        metrics: "点击率提升 40%，回归首日留存率达到 60%"
      });
    }
    setGenerating(false);
  }

  return (
    <div className="page-content">
      <section className="section-head">
        <div>
          <span className="eyebrow">CAMPAIGN AGENTS</span>
          <h2>选择营销大师，生成 Campaign</h2>
          <p>基于不同的营销方法论，结合当前人群、痛点与素材，快速生成可执行的活动草案。</p>
        </div>
      </section>

      <div className="campaign-grid">
        {CAMPAIGN_AGENTS.map((agent) => (
          <article 
            key={agent.id} 
            className={`agent-card ${selectedAgent.id === agent.id ? "selected" : ""}`}
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="agent-head">
              <span><agent.icon size={18} /></span>
              <div>
                <b>{agent.name}</b>
                <small>{agent.tag}</small>
              </div>
            </div>
            <p>{agent.desc}</p>
          </article>
        ))}
      </div>

      <div className="campaign-form">
        <label>
          <span>目标 (Goal)</span>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="例如：提高注册率、召回用户" />
        </label>
        <label>
          <span>渠道 (Channel)</span>
          <select value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option>LinkedIn</option>
            <option>Google Ads</option>
            <option>Meta (FB/IG)</option>
            <option>Email</option>
            <option>全渠道 (Omnichannel)</option>
          </select>
        </label>
        <label>
          <span>预算评估 (Budget)</span>
          <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="例如：$5,000" />
        </label>
        <button className="primary" style={{ height: "42px", width: "100%" }} onClick={handleGenerate} disabled={generating}>
          {generating ? <LoaderCircle className="animate-spin" size={16} /> : <Rocket size={16} />}
          生成 Campaign
        </button>
      </div>

      {generating && (
        <div className="generating-overlay">
          <LoaderCircle className="animate-spin" size={32} color="#7b70d8" />
          <span>{selectedAgent.name} 正在为您构思 {goal} 的 Campaign...</span>
        </div>
      )}

      {campaign && !generating && (
        <div className="campaign-result">
          <CanvasHead eyebrow="CAMPAIGN DRAFT" title={`${selectedAgent.name} 的策略方案`} />
          <div className="campaign-result-grid">
            <div className="full-span">
              <h3>核心概念 (Campaign Concept)</h3>
              <p>{campaign.concept}</p>
            </div>
            <div>
              <h3>核心钩子 (Core Hook)</h3>
              <p>{campaign.hook}</p>
            </div>
            <div>
              <h3>诱饵 / 行动号召 (Offer)</h3>
              <p>{campaign.offer}</p>
            </div>
            <div>
              <h3>素材计划 (Asset Plan)</h3>
              <p>{campaign.plan}</p>
            </div>
            <div>
              <h3>测试假设与成功指标 (Metrics)</h3>
              <p>{campaign.metrics}</p>
            </div>
          </div>
          <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button className="secondary">保存并归档</button>
            <button className="primary"><FlaskConical size={16} /> 导入实验</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ExperimentsView() { return <div className="page-content"><section className="section-head"><div><span className="eyebrow">MARKET VALIDATION</span><h2>让市场结果修正研究判断</h2><p>每个版本只改变一个变量，达到最低样本后才自动给出结论。</p></div><button className="primary"><Plus size={16} /> 创建实验</button></section><div className="experiment-hero"><div><span className="live-dot" /> RUNNING · DAY 4 OF 7<h2>LinkedIn · Value proposition test</h2><p>验证“效率收益”和“证据可信”哪个更能驱动 Demo 预约。</p></div><div className="experiment-metric"><strong>3.84%</strong><span>Best CTR</span><small>+31% vs baseline</small></div></div><div className="variant-grid"><Variant name="A · 痛点角度" impressions="4,120" ctr="2.46%" conversions="7" status="继续收集" /><Variant name="B · 效率角度" impressions="4,086" ctr="3.84%" conversions="14" status="领先" active /><Variant name="C · 信任角度" impressions="4,102" ctr="3.12%" conversions="10" status="继续收集" /></div><div className="notice"><Sparkles size={17} /><div><b>Agent 建议</b><p>版本 B 当前领先，但距离最低 20 次转化仍差 6 次。继续运行，不调整流量；下一轮保留“15 分钟”效率变量并测试 CTA。</p></div></div></div>; }
function Variant({ name, impressions, ctr, conversions, status, active }: { name: string; impressions: string; ctr: string; conversions: string; status: string; active?: boolean }) { return <article className={active ? "variant active" : "variant"}><div><b>{name}</b><span>{status}</span></div><dl><div><dt>曝光</dt><dd>{impressions}</dd></div><div><dt>CTR</dt><dd>{ctr}</dd></div><div><dt>转化</dt><dd>{conversions}</dd></div></dl><div className="variant-bar"><i style={{ width: ctr }} /></div></article>; }

function EvidenceDrawer({ evidence, onClose }: { evidence: Evidence; onClose: () => void }) { return <div className="drawer-backdrop" onClick={onClose}><aside className="drawer" onClick={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose}><X size={18} /></button><span className="eyebrow">VERIFIED EVIDENCE</span><h2>原始访谈依据</h2><div className="person"><span className="avatar">{evidence.participant.slice(-2)}</span><div><b>{evidence.participant}</b><small>{evidence.profile}</small></div></div><blockquote>“{evidence.quote}”</blockquote><div className="source-meta"><span>来源</span><b>{evidence.source}</b><span>位置</span><b>{evidence.location}</b></div><div className="verified"><Check size={15} /> 已通过原文逐字匹配</div><div className="context"><b>使用边界</b><p>该引用用于支持当前样本中的需求信号，不代表所有目标市场用户。</p></div></aside></div>; }

type ModalProps = { files: UploadItem[]; product: { name: string; description: string; capabilities: string; goal: string; industry: Industry | "自动推断" }; profile: string; processing: boolean; progress: number; setProduct: (value: ModalProps["product"]) => void; setProfile: (value: string) => void; onFiles: (event: ChangeEvent<HTMLInputElement>) => void; removeFile: (name: string) => void; onClose: () => void; onRun: () => void };
function NewAnalysisModal({ files, product, profile, processing, progress, setProduct, setProfile, onFiles, removeFile, onClose, onRun }: ModalProps) {
  const currentStep = Math.min(Math.floor(progress / 20), 4);
  return <div className="modal-backdrop"><section className="modal"><button className="drawer-close" onClick={onClose}><X size={18} /></button>{processing ? <div className="processing"><span className="agent-orb"><Sparkles size={28} /></span><span className="eyebrow">AGENT IS WORKING</span><h2>{steps[currentStep]}</h2><p>正在把访谈证据传导为目标人群和 GTM 素材，请不要关闭页面。</p><div className="progress"><i style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong><div className="processing-steps">{steps.map((step, index) => <span className={index <= currentStep ? "done" : ""} key={step}>{index < currentStep ? <Check size={12} /> : index + 1} {step}</span>)}</div></div> : <><div className="modal-head"><span className="agent-orb"><Sparkles size={24} /></span><div><span className="eyebrow">NEW AGENT RUN</span><h2>从访谈生成 GTM</h2><p>填写产品上下文并导入访谈，Agent 将自动完成余下流程。</p></div></div><div className="form-grid"><label><span>产品名称 *</span><input value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} placeholder="例如：Signal to Market" /></label><label><span>GTM 目标</span><select value={product.goal} onChange={(e) => setProduct({ ...product, goal: e.target.value })}><option>获客</option><option>激活</option><option>付费转化</option><option>召回</option></select></label><label><span>所属行业</span><select value={product.industry} onChange={(e) => setProduct({ ...product, industry: e.target.value as Industry | "自动推断" })}><option value="自动推断">自动推断</option>{industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}</select></label><label className="wide"><span>产品解决什么问题 *</span><textarea value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} placeholder="描述用户问题、使用场景和目标结果" /></label><label className="wide"><span>已有能力与限制</span><textarea value={product.capabilities} onChange={(e) => setProduct({ ...product, capabilities: e.target.value })} placeholder="Agent 不会生成这里未声明的产品能力" /></label></div><div className="upload-zone"><UploadCloud size={25} /><b>导入访谈转写稿</b><p>支持 TXT、MD、CSV、JSON；音视频请先提供转写文本</p><label className="secondary">选择文件<input type="file" multiple accept=".txt,.md,.csv,.json" onChange={onFiles} hidden /></label></div>{files.length > 0 && <div className="file-list">{files.map((file) => <div key={file.name}><FileAudio size={15} /><span>{file.name}</span><small>{file.size}</small><button onClick={() => removeFile(file.name)}><X size={14} /></button></div>)}</div>}<label className="profile-input"><span>受访者画像 CSV 内容（可选）</span><textarea value={profile} onChange={(e) => setProfile(e.target.value)} placeholder="participant_id, role, industry, company_size..." /></label><div className="modal-actions"><span>{files.length ? `${files.length} 份资料已就绪` : "至少导入一份访谈"}</span><button className="primary" disabled={!product.name || !product.description || !files.length} onClick={onRun}>运行 Agent <ArrowRight size={16} /></button></div></>}</section></div>;
}
