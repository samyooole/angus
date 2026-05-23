"use server";

export type TCFormState = {
  prompt: string;
} | null;

export async function buildPrompt(_prevState: TCFormState, formData: FormData): Promise<TCFormState> {
  const practiceArea = formData.get("practiceArea") as string;
  const task = formData.get("task") as string;
  const format = formData.get("format") as string;
  const formatOther = formData.get("formatOther") as string;
  const lengthType = formData.get("lengthType") as string;
  const lengthValue = formData.get("lengthValue") as string;
  const audience = formData.get("audience") as string;
  const purpose = formData.get("purpose") as string;
  const sources = formData.get("sources") as string;
  const tone = formData.get("tone") as string;
  const toneOther = formData.get("toneOther") as string;

  const formatLabel = format === "other" ? formatOther : format;
  const toneLabel = tone === "others" ? toneOther : tone;

  const prompt = [
    `You are a skilled legal assistant specializing in ${practiceArea.toLowerCase()} practice.`,
    ``,
    `Your task is to ${task.toLowerCase()} a document related to ${practiceArea.toLowerCase()}.`,
    ``,
    `The output must be formatted as a ${formatLabel?.toLowerCase() ?? "document"}.`,
    lengthValue ? `The document should be approximately ${lengthValue} ${lengthType ?? "pages"} in length.` : null,
    `The target audience is ${audience?.toLowerCase() ?? "legal professionals"}.`,
    purpose ? `Purpose of the document: ${purpose}` : null,
    sources ? `Reference the following source material: ${sources}` : null,
    toneLabel ? `Use a ${toneLabel.toLowerCase()} tone throughout the document.` : null,
    ``,
    `Ensure the output is accurate, well-structured, and appropriate for the intended audience.`,
  ]
    .filter(Boolean)
    .join("\n");

  return { prompt };
}
