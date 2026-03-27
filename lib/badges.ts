const colorMap: Record<string, string> = {
  TypeScript: "3178c6",
  JavaScript: "f7df1e",
  Python: "3776AB",
  Java: "b07219",
  HTML: "e34c26",
  CSS: "563d7c",
  C: "555555",
  "C++": "f34b7d",
  "C#": "178600",
  PHP: "4F5D95",
  Ruby: "701516",
  Go: "00ADD8",
  Swift: "F05138",
  Rust: "dea584",
  Kotlin: "A97BFF",
  Scala: "c22d40",
  Dart: "00B4AB",
  Shell: "89e051",
  Vue: "41b883",
  React: "61dafb",
};


export function generateBadges(languages: string[]) {
  return languages
    .map((lang) => {
      const color = colorMap[lang] || "444";
      return `![${lang}](https://img.shields.io/badge/${lang}-${color}?style=for-the-badge)`;
    })
    .join(" ");
}