"use server";

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
  const lengthType = formData.get("lengthType") as string;
  const lengthValue = formData.get("lengthValue") as string;
  const audience = formData.get("audience") as string;
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

  const draftDocLabel = draftDocType === "__other__" ? draftDocOther : draftDocType;
  const draftContractLabel = draftContractType === "__other__" ? draftContractOther : draftContractType;
  const draftCommLabel = draftCommType === "__other__" ? draftCommOther : draftCommType;

  const prompt = [
    practiceArea
      ? practiceArea === "General"
        ? "You are a skilled legal assistant."
        : `You are a skilled legal assistant specializing in ${practiceArea.toLowerCase()} practice.`
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
        : `Task: ${taskLabel}`,
    draftDocLabel ? `Draft: ${draftDocLabel}.` : null,
    legalResearchDesc ? `Legal research topic: ${legalResearchDesc}` : null,
    draftContractLabel ? `Draft contract: ${draftContractLabel}.` : null,
    draftCommLabel ? `Draft communication: ${draftCommLabel}.` : null,
    ``,
    `The output must be formatted as ${formatLabel?.toLowerCase() ?? "a document"}.`,
    tableFormat ? `Table format: ${tableFormat}` : null,
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
