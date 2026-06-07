"use server";

function indefiniteArticle(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function cleanPurpose(text: string): string {
  return text
    .replace(/^I\s+(?:want|need|would\s+like|'d\s+like|am\s+looking|wish)\s+to\s+/i, "")
    .replace(/^to\s+/i, "")
    .replace(/\.$/, "");
}

export type TCFormState = {
  prompt: string;
} | null;

export async function buildPrompt(_prevState: TCFormState, formData: FormData): Promise<TCFormState> {
  const practiceArea = formData.get("practiceArea") as string;
  const task = formData.get("task") as string;
  const taskOther = formData.get("taskOther") as string;
  const format = formData.get("format") as string;
  const formatOther = formData.get("formatOther") as string;
  const tableFormat = formData.get("tableFormat") as string;
  const headings = formData.get("headings") as string;
  const lengthType = formData.get("lengthType") as string;
  const lengthValue = formData.get("lengthValue") as string;
  const audience = formData.get("audience") as string;
  const audienceOther = formData.get("audienceOther") as string;
  const purpose = formData.get("purpose") as string;
  const sources = formData.get("sources") as string;
  const tone = formData.get("tone") as string;
  const toneOther = formData.get("toneOther") as string;

  const taskLabel = task === "__other__" ? taskOther : task;
  const draftDocType = formData.get("draftDocType") as string;
  const draftDocOther = formData.get("draftDocOther") as string;
  const legalResearchDesc = formData.get("legalResearchDesc") as string;
  const draftContractType = formData.get("draftContractType") as string;
  const draftContractOther = formData.get("draftContractOther") as string;
  const draftCommType = formData.get("draftCommType") as string;
  const draftCommOther = formData.get("draftCommOther") as string;
  const formatLabel = format === "other" ? formatOther : format;
  const toneLabel = tone === "others" ? toneOther : tone;

  const audienceLabel = audience === "others" ? audienceOther : audience;
  const draftDocLabel = draftDocType === "__other__" ? draftDocOther : draftDocType;
  const draftContractLabel = draftContractType === "__other__" ? draftContractOther : draftContractType;
  const draftCommLabel = draftCommType === "__other__" ? draftCommOther : draftCommType;

  const prompt = [
    practiceArea
      ? practiceArea === "General"
        ? "You are an experienced lawyer."
        : `You are an experienced lawyer specialising in ${practiceArea.toLowerCase()} practice.`
      : null,
    practiceArea ? `` : null,
    taskLabel === "Summarise"
      ? "Please summarise the attached document(s). **[Reminder to user to upload documents to be summarised.]**"
      : taskLabel === "Compare"
        ? "Please compare the attached document(s). **[Reminder to user to upload the different versions of the document to be compared.]**"
        : taskLabel === "Review a contract"
        ? "Please review the attached contract(s). **[Reminder to user to upload contract(s) to be reviewed.]**"
        : taskLabel === "Create a timeline"
          ? "Please create a timeline in chronological order from the attached document(s). **[Reminder to user to upload the document(s) from which timeline is to be created.]**"
        : taskLabel === "Draft a document"
          ? null
        : taskLabel === "Legal research"
          ? null
        : taskLabel === "Draft a contract"
          ? null
        : taskLabel === "Draft communications"
          ? null
        : task === "__other__"
          ? `Please ${taskLabel.charAt(0).toLowerCase() + taskLabel.slice(1)}.`
        : `Task: ${taskLabel}`,
    draftDocLabel
      ? taskLabel === "Draft a document"
        ? `Please draft ${indefiniteArticle(draftDocLabel)} ${draftDocLabel}.`
        : `Draft: ${draftDocLabel}.`
      : null,
    legalResearchDesc
      ? taskLabel === "Legal research"
        ? `Please conduct legal research on ${legalResearchDesc}.`
        : `Legal research topic: ${legalResearchDesc}`
      : null,
    draftContractLabel
      ? taskLabel === "Draft a contract"
        ? `Please draft ${indefiniteArticle(draftContractLabel)} ${draftContractLabel}.`
        : `Draft contract: ${draftContractLabel}.`
      : null,
    draftCommLabel
      ? taskLabel === "Draft communications"
        ? `Please draft ${indefiniteArticle(draftCommLabel)} ${draftCommLabel}.`
        : `Draft communication: ${draftCommLabel}.`
      : null,
    purpose ? `The purpose of the document is to ${cleanPurpose(purpose)}.` : null,
    sources ? `Please reference the following source material: ${sources}. **[Reminder to user to upload source material.]**` : null,
    ``,
    `The output must be formatted as ${formatLabel?.toLowerCase() ?? "a document"}.`,
    tableFormat ? `Table format: ${tableFormat}` : null,
    headings ? `The headings are as follows: ${headings}.` : null,
    lengthValue ? `The document should be approximately ${lengthValue} ${lengthType ?? "pages"} in length.` : null,
    audienceLabel
      ? audienceLabel === "Singapore Court"
        ? "The target audience is the Singapore Court."
        : `The target audience is ${indefiniteArticle(audienceLabel)} ${audienceLabel.toLowerCase()}.`
      : null,
    toneLabel ? `Use a ${toneLabel.toLowerCase()} tone throughout the document.` : null,
    ``,
    `Ensure the output is accurate, well-structured, and appropriate for the intended audience.`,
  ]
    .filter(Boolean)
    .join("\n");

  return { prompt };
}
