export function generateInstall(repoUrl: string, name: string) {
  return `
\`\`\`bash
git clone ${repoUrl}
cd ${name}
npm install
npm run dev
\`\`\`
`;
}