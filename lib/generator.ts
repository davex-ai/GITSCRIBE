import { RepoData } from "@/types/repo";
import { generateBadges } from "./badges";
import { inferFeatures } from "./features";
import { generateInstall } from "./install";

export function generateReadme(data: RepoData): string {
  const badges = generateBadges(data.language);
  const features = inferFeatures(data.description, data.language);
  const install = generateInstall(data.url, data.name);

  return `
# ${data.name}

## 📌 Description
${data.description || "No description provided."}

## 🧰 Tech Stack
${data.language.map((lang) => `- ${lang}`).join("\n")}

## 🏷️ Badges
${badges}

## ⚙️ Installation
${install}

## ✨ Features
${features.map((f) => `- ${f}`).join("\n")}

## 📊 Stats
⭐ Stars: ${data.stars}  
🍴 Forks: ${data.forks}

## 📄 License
This project is licensed under the MIT License.
`;
}