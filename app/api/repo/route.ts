import { NextResponse } from "next/server";
import axios from "axios";
import { generateReadme } from "@/lib/generator";

export async function POST(req: Request) {
  try {
    const { repoUrl } = await req.json();

    // extract owner/repo
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub URL" },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;

    const repoRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );

    const langRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/languages`
    );

    const data = {
      name: repoRes.data.name,
      description: repoRes.data.description,
      stars: repoRes.data.stargazers_count,
      forks: repoRes.data.forks_count,
      language: Object.keys(langRes.data),
      url: repoRes.data.html_url,
    };

    const readme = generateReadme(data)

    return NextResponse.json({ ...data, readme });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch repo" },
      { status: 500 }
    );
  }
}