import axios from "axios";
import { parseRepoUrl } from "./parser";
import { RepoData } from "@/types/repo";

export async function fetchRepoData(repoUrl: string): Promise<RepoData> {
  const { owner, repo } = parseRepoUrl(repoUrl);

  const [repoRes, langRes] = await Promise.all([
    axios.get(`https://api.github.com/repos/${owner}/${repo}`),
    axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`),
  ]);

  return {
    name: repoRes.data.name,
    description: repoRes.data.description,
    stars: repoRes.data.stargazers_count,
    forks: repoRes.data.forks_count,
    language: Object.keys(langRes.data),
    url: repoRes.data.html_url,
    owner: repoRes.data.owner.login,
  };
}