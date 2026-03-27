 import { NextResponse } from "next/server";
import { fetchRepoData } from "@/lib/github";
import { generateReadme } from "@/lib/generator";

export async function POST(req: Request) {
  try {
    const { repoUrl, options } = await req.json();

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repo URL is required" },
        { status: 400 }
      );
    }

    const data = await fetchRepoData(repoUrl);
    const readme = generateReadme(data, options);

    return NextResponse.json({
      ...data,
      readme,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}