import { RepoContext, Signal } from "@/types/RepoContent";

export function detectFrontend(ctx: RepoContext): Signal[] {
  const signals: Signal[] = [];

  const deps = {
    ...ctx.packageJson?.dependencies,
    ...ctx.packageJson?.devDependencies,
  };

  if (deps?.react) {
    signals.push({
      type: "frontend",
      confidence: 0.9,
      source: "react",
    });
  }

  if (deps?.next) {
    signals.push({
      type: "frontend",
      confidence: 1.0,
      source: "next",
    });
  }

   if (deps?.vue) signals.push({ type: "frontend", confidence: 1.0, source: "vue" });
  if (deps?.svelte) signals.push({ type: "frontend", confidence: 1.0, source: "svelte" });

  if (ctx.files.includes("components")) {
    signals.push({
      type: "frontend",
      confidence: 0.6,
      source: "folder",
    });
  }

   const structure = ["pages", "app", "components", "src/pages", "src/app"];
  if (structure.some(dir => ctx.files.includes(dir))) {
    signals.push({ type: "frontend", confidence: 0.6, source: "folder-structure" });
  }

  // Metadata Analysis
  const readme = ctx.readme?.toLowerCase() || "";
  if (readme.includes("ui") || readme.includes("frontend") || readme.includes("spa")) {
    signals.push({ type: "frontend", confidence: 0.4, source: "readme" });
  }

  return signals;
}

export function detectBackend(ctx: RepoContext): Signal[] {
  const signals: Signal[] = [];

  const deps = {
    ...ctx.packageJson?.dependencies,
  };

  if (deps?.express || deps?.fastify || deps?.koa || deps?.nest) {
    signals.push({
      type: "backend",
      confidence: 0.9,
      source: "framework",
    });
  }
    if (deps?.mongoose || deps?.prisma || deps?.typeorm) {
    signals.push({ type: "backend", confidence: 0.8, source: "orm" });
  }

  if (ctx.files.includes("api") || ctx.files.includes("routes")) {
    signals.push({
      type: "backend",
      confidence: 0.7,
      source: "structure",
    });
  }

    const patterns = ["controllers", "services", "api", "routes", "models"];
  patterns.forEach(dir => {
    if (ctx.files.includes(dir)) {
      signals.push({ type: "backend", confidence: 0.5, source: `structure:${dir}` });
    }
  });

  return signals;
}

export function detectDevOps(ctx: RepoContext): Signal[] {
  const signals: Signal[] = [];

  if (ctx.files.includes("Dockerfile")) {
    signals.push({ type: "docker", confidence: 1.0, source: "file" });
  }

    if (ctx.files.includes("k8s") || ctx.files.includes("helm")) {
    signals.push({ type: "devops", confidence: 1.0, source: "kubernetes" });
  }

  if (ctx.files.includes(".github")) {
    signals.push({ type: "ci", confidence: 0.8, source: "github-actions" });
  }

  return signals;
}

export function aggregateSignals(signals: Signal[]) {
  const map: Record<string, number> = {};

  for (const s of signals) {
    map[s.type] = (map[s.type] || 0) + s.confidence;
  }

  return map;
}


