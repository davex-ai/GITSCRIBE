import { RepoData } from "@/types/repo";
import { generateBadges } from "./badges";
import { inferFeatures } from "./features";
import { generateInstall } from "./install";

interface Options {
  showBanner?: boolean;
}

export function generateReadme(data: RepoData, options?: Options): string {
  const badges = generateBadges(data.language);
  const features = inferFeatures(data.description, data.language);
  const install = generateInstall(data.url, data.name);

  const banner = options?.showBanner
    ? `![Banner](https://capsule-render.vercel.app/api?type=waving&color=6366f1&height=200&section=header&text=${encodeURIComponent(
        data.name
      )}&fontSize=50&fontColor=ffffff)\n\n`
    : "";

  return `${banner}# ${data.name}

${badges}

## 📌 Description
${data.description || "No description provided."}

## ✨ Features
${features.map((f) => `- ${f}`).join("\n")}

## 🧰 Tech Stack
${data.language.map((l) => `- ${l}`).join("\n")}

## ⚙️ Installation
${install}

## 📊 Stats
⭐ Stars: ${data.stars}  
🍴 Forks: ${data.forks}

## 📄 License
MIT

---

<p align="center">Built by <a href="https://github.com/${data.owner}">${data.owner}</a></p>
`;
}