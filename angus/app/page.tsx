"use client";

import { useActionState, useState } from "react";
import { buildPrompt, type FormState } from "./actions";

const inputClass = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";
const selectClass = `${inputClass} appearance-none`;
const textareaClass = `${inputClass} min-h-[80px] resize-y`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function Home() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(buildPrompt, null);
  const [format, setFormat] = useState("");
  const [tone, setTone] = useState("");
  const [lengthType, setLengthType] = useState<"pages" | "words">("pages");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!state?.prompt) return;
    await navigator.clipboard.writeText(state.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-dvh bg-white font-sans dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Prompt Builder
          </h1>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Legal Tasks
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <form action={formAction} className="space-y-6">
          <Field label="Practice Area">
            <select name="practiceArea" defaultValue="" required className={selectClass}>
              <option value="" disabled>Select a practice area</option>
              <option value="Litigation">Litigation</option>
              <option value="Corporate transactions">Corporate Transactions</option>
            </select>
          </Field>

          <Field label="What task do you want to do today?">
            <select name="task" defaultValue="" required className={selectClass}>
              <option value="" disabled>Select a task</option>
              <option value="Summarise">Summarise</option>
              <option value="Draft">Draft</option>
              <option value="Create a timeline">Create a Timeline</option>
              <option value="Legal research">Legal Research</option>
            </select>
          </Field>

          <Field label="Format">
            <select name="format" defaultValue="" required className={selectClass} onChange={(e) => setFormat(e.target.value)}>
              <option value="" disabled>Select format</option>
              <option value="Bullet-point list">Bullet-point List</option>
              <option value="Paragraphs">Paragraphs (with headings or without headings)</option>
              <option value="Table">Table</option>
              <option value="other">Other (free text)</option>
            </select>
            {format === "other" && (
              <input name="formatOther" type="text" placeholder="Specify format..." required className={`${inputClass} mt-2`} />
            )}
          </Field>

          <fieldset className="space-y-1.5">
            <legend className={labelClass}>How long should the document be?</legend>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="length-pages"
                  name="lengthType"
                  value="pages"
                  checked={lengthType === "pages"}
                  onChange={() => setLengthType("pages")}
                  className="h-4 w-4 accent-zinc-900 dark:accent-zinc-100"
                />
                <label htmlFor="length-pages" className="text-sm text-zinc-700 dark:text-zinc-300">Pages</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="length-words"
                  name="lengthType"
                  value="words"
                  checked={lengthType === "words"}
                  onChange={() => setLengthType("words")}
                  className="h-4 w-4 accent-zinc-900 dark:accent-zinc-100"
                />
                <label htmlFor="length-words" className="text-sm text-zinc-700 dark:text-zinc-300">Words</label>
              </div>
            </div>
            <input
              name="lengthValue"
              type="number"
              min={1}
              placeholder={`Number of ${lengthType}`}
              required
              className={inputClass}
            />
          </fieldset>

          <Field label="Target Audience">
            <select name="audience" defaultValue="" required className={selectClass}>
              <option value="" disabled>Select target audience</option>
              <option value="Court">Court</option>
              <option value="Lawyer">Lawyer</option>
              <option value="Non-lawyer">Non-lawyer</option>
            </select>
          </Field>

          <Field label="What are you preparing this document for?">
            <textarea
              name="purpose"
              placeholder="Describe the purpose of this document..."
              required
              className={textareaClass}
            />
          </Field>

          <Field label="What information or sources should the AI refer to?">
            <textarea
              name="sources"
              placeholder="Paste or describe the source material..."
              className={textareaClass}
            />
          </Field>

          <Field label="Tone">
            <select name="tone" defaultValue="" required className={selectClass} onChange={(e) => setTone(e.target.value)}>
              <option value="" disabled>Select tone</option>
              <option value="Formal">Formal</option>
              <option value="Conversational">Conversational</option>
              <option value="Plain language">Plain Language</option>
              <option value="Firm but polite">Firm but Polite</option>
              <option value="Friendly">Friendly</option>
              <option value="others">Others</option>
            </select>
            {tone === "others" && (
              <input name="toneOther" type="text" placeholder="Specify tone..." required className={`${inputClass} mt-2`} />
            )}
          </Field>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {pending ? "Generating..." : "Generate Prompt"}
          </button>
        </form>

        {state?.prompt && (
          <section className="mt-10 space-y-3" aria-label="Generated prompt">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Generated Prompt</h2>
              <button
                onClick={handleCopy}
                className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              {state.prompt}
            </pre>
          </section>
        )}
      </main>
    </div>
  );
}
