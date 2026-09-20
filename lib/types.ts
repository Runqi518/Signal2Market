export type Evidence = {
  id: string;
  participant: string;
  profile: string;
  quote: string;
  source: string;
  location: string;
};

export type Segment = {
  id: string;
  name: string;
  count: number;
  description: string;
  traits: string[];
  pain: number;
  buying: number;
  fit: number;
  confidence: number;
  score: number;
  evidenceIds: string[];
};

export type Signal = {
  type: "痛点" | "期望结果" | "购买触发" | "购买阻力";
  label: string;
  coverage: number;
  strength: number;
  evidenceIds: string[];
};

export type AnalysisResult = {
  sample: { interviews: number; participants: number; profileMatch: number };
  segments: Segment[];
  signals: Signal[];
  evidence: Evidence[];
  strategy: {
    positioning: string;
    valueProp: string;
    pillars: { title: string; body: string; evidenceIds: string[] }[];
    objection: string;
  };
  assets: {
    landing: { headline: string; subhead: string; cta: string };
    ads: { label: string; headline: string; body: string; variable: string }[];
    email: { subject: string; body: string };
    social: string;
  };
  limitations: string[];
};
