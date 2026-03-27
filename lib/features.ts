export function inferFeatures(description: string, languages: string[]) {
  const features: string[] = [];

  const desc = description?.toLowerCase() || "";

  if (desc.includes("api")) features.push("REST API support");
  if (desc.includes("auth")) features.push("Authentication system");
  if (desc.includes("real-time")) features.push("Real-time functionality");
  if (desc.includes("chat")) features.push("Messaging or chat system");
  if (desc.includes("ai") || desc.includes("ml"))
    features.push("AI/ML integration");

  if (languages.includes("TypeScript"))
    features.push("Type-safe development");

  if (features.length === 0) {
    features.push("Scalable project architecture");
  }

  return features;
}