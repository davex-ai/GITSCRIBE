import { Insight, RepoContext } from "@/types/RepoContent";
import { aggregateSignals, detectBackend, detectDevOps, detectFrontend} from "./detectors";

export function deriveInsights(scores: Record<string, number>): Insight[] {
  const insights: Insight[] = [];

  if (scores.frontend > 1.2) {
    insights.push({ label: "Frontend App", confidence: scores.frontend });
  }

  if (scores.backend > 1.0) {
    insights.push({ label: "Backend API", confidence: scores.backend });
  }

  if (scores.frontend > 0.8 && scores.backend > 0.8) {
  insights.push({
    label: "Fullstack",
    confidence: (scores.frontend + scores.backend) / 2,
  });
}

  if (scores.docker) {
    insights.push({ label: "Dockerized", confidence: scores.docker });
  }

  return insights;
}

export function runInference(ctx: RepoContext) {
  const signals = [
    ...detectFrontend(ctx),
    ...detectBackend(ctx),
    ...detectDevOps(ctx),
  ];

  const scores = aggregateSignals(signals);
  const insights = deriveInsights(scores);
  const badges = insightsToBadges(insights);

  return { signals, scores, insights, badges };
}

export function insightsToBadges(insights: Insight[]) {
  return insights.map(
    (i) =>
      `![${i.label}](https://img.shields.io/badge/${encodeURIComponent(
        i.label
      )}-blue?style=for-the-badge)`
  );
}