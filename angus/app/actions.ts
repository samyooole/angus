"use server";

import { q2Options } from "./data";

export type FormState = {
  prompt: string;
} | null;

export async function buildPrompt(_prevState: FormState, formData: FormData): Promise<FormState> {
  const q1 = formData.get("q1") as string;
  const q1Other = formData.get("q1Other") as string;
  const q2 = formData.get("q2") as string;
  const q2Other = formData.get("q2Other") as string;
  const purpose = formData.get("purpose") as string;
  const sources = formData.get("sources") as string;
  const tone = formData.get("tone") as string;
  const toneOther = formData.get("toneOther") as string;

  const taskLabel = q1 === "__other__" ? q1Other : q1;
  const options = q2Options[q1];
  const isQ2Other = q2 === "__other__";
  const deliverableLabel = isQ2Other
    ? q2Other
    : options?.find((o) => o.value === q2)?.label ?? q2 ?? "";
  const toneLabel = tone === "__other__" ? toneOther : tone;

  const prompt = [
    `You are a skilled legal assistant.`,
    ``,
    `Your task is to ${taskLabel?.toLowerCase() ?? "assist with a legal matter"}.`,
    deliverableLabel ? `The deliverable should be: ${deliverableLabel}.` : null,
    purpose ? `Purpose of the document: ${purpose}` : null,
    sources ? `Reference the following source material: ${sources}` : null,
    toneLabel ? `Use a ${toneLabel.toLowerCase()} tone throughout the document.` : null,
    ``,
    `Ensure the output is accurate, well-structured, and appropriate for the intended purpose.`,
  ]
    .filter(Boolean)
    .join("\n");

  return { prompt };
}
