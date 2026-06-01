"use client";

import { useActionState, useState } from "react";
import { buildPrompt, type TCFormState } from "./tc-actions";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100";
const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";
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

export default function TcPage() {
  const [state, formAction, pending] = useActionState<TCFormState, FormData>(
    buildPrompt,
    null,
  );
  const [practiceArea, setPracticeArea] = useState("");
  const [task, setTask] = useState("");
  const [draftDocType, setDraftDocType] = useState("");
  const [draftContractType, setDraftContractType] = useState("");
  const [draftCommType, setDraftCommType] = useState("");
  const [format, setFormat] = useState("");
  const [tone, setTone] = useState("");
  const [lengthType, setLengthType] = useState<"pages" | "words">("pages");
  const [copied, setCopied] = useState(false);
  const [improved, setImproved] = useState(false);

  const handleCopy = async () => {
    if (!state?.prompt) return;
    await navigator.clipboard.writeText(state.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const taskOptions: Record<string, { label: string; value: string }[]> = {
    Litigation: [
      { label: "Summarise", value: "Summarise" },
      { label: "Draft a document", value: "Draft a document" },
      { label: "Create a timeline", value: "Create a timeline" },
      { label: "Legal research", value: "Legal research" },
      { label: "Others", value: "__other__" },
    ],
    "Corporate Transactions": [
      { label: "Draft a contract", value: "Draft a contract" },
      { label: "Review a contract", value: "Review a contract" },
      { label: "Others", value: "__other__" },
    ],
    General: [
      { label: "Draft communications", value: "Draft communications" },
      { label: "Summarise", value: "Summarise" },
      { label: "Compare", value: "Compare" },
      { label: "Others", value: "__other__" },
    ],
  };

  const currentTaskOptions = practiceArea ? taskOptions[practiceArea] ?? [] : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <form action={formAction} className="space-y-6">
        <Field label="Practice Area">
          <select
            name="practiceArea"
            defaultValue=""
            className={selectClass}
            onChange={(e) => {
              setPracticeArea(e.target.value);
              setTask("");
            }}
          >
            <option value="" disabled>
              Select a practice area
            </option>
            <option value="Litigation">Litigation</option>
            <option value="Corporate Transactions">Corporate Transactions</option>
            <option value="General">General</option>
          </select>
        </Field>

        <Field label="What task do you want to do today?">
          <select
            name="task"
            value={task}
            disabled={!practiceArea}
            className={selectClass}
            onChange={(e) => {
              setTask(e.target.value);
              setDraftDocType("");
              setDraftContractType("");
              setDraftCommType("");
            }}
          >
            <option value="" disabled>
              {practiceArea ? "Select a task" : "Select a practice area first"}
            </option>
            {currentTaskOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {task === "__other__" && (
            <input
              name="taskOther"
              type="text"
              placeholder="Specify task..."
              className={`${inputClass} mt-2`}
            />
          )}
        </Field>

        {task === "Draft a document" && (
          <Field label="What would you like me to draft?">
            <select
              name="draftDocType"
              defaultValue=""
              className={selectClass}
              onChange={(e) => setDraftDocType(e.target.value)}
            >
              <option value="" disabled>Select document type</option>
              <option value="Statement of Claim">Statement of Claim</option>
              <option value="Defence">Defence</option>
              <option value="Affidavit">Affidavit</option>
              <option value="Written submissions">Written submissions</option>
              <option value="__other__">Others</option>
            </select>
            {draftDocType === "__other__" && (
              <input
                name="draftDocOther"
                type="text"
                placeholder="Specify document type..."
                className={`${inputClass} mt-2`}
              />
            )}
          </Field>
        )}

        {task === "Legal research" && (
          <Field label="Please describe the issue you would like to research.">
            <textarea
              name="legalResearchDesc"
              placeholder="Describe the legal issue..."
              className={textareaClass}
            />
          </Field>
        )}

        {task === "Draft a contract" && (
          <Field label="What contract would you like me to draft?">
            <select
              name="draftContractType"
              defaultValue=""
              className={selectClass}
              onChange={(e) => setDraftContractType(e.target.value)}
            >
              <option value="" disabled>Select contract type</option>
              <option value="Share Purchase Agreement">Share Purchase Agreement</option>
              <option value="Asset Purchase Agreement">Asset Purchase Agreement</option>
              <option value="Joint Venture Agreement">Joint Venture Agreement</option>
              <option value="Employment Agreement">Employment Agreement</option>
              <option value="Company Constitution">Company Constitution</option>
              <option value="__other__">Others</option>
            </select>
            {draftContractType === "__other__" && (
              <input
                name="draftContractOther"
                type="text"
                placeholder="Specify contract type..."
                className={`${inputClass} mt-2`}
              />
            )}
          </Field>
        )}

        {task === "Draft communications" && (
          <Field label="What communications would you like to draft?">
            <select
              name="draftCommType"
              defaultValue=""
              className={selectClass}
              onChange={(e) => setDraftCommType(e.target.value)}
            >
              <option value="" disabled>Select communication type</option>
              <option value="Letter">Letter</option>
              <option value="Email">Email</option>
              <option value="Memo">Memo</option>
              <option value="__other__">Others</option>
            </select>
            {draftCommType === "__other__" && (
              <input
                name="draftCommOther"
                type="text"
                placeholder="Specify communication type..."
                className={`${inputClass} mt-2`}
              />
            )}
          </Field>
        )}

        <Field label="What is the objective of this task?">
          <textarea
            name="purpose"
            placeholder="Please describe the objective of the task and provide all relevant context."
            className={textareaClass}
          />
        </Field>

        <Field label="What information or sources should the AI refer to?">
          <textarea
            name="sources"
            placeholder="Please paste or describe the source material."
            className={textareaClass}
          />
        </Field>

        <Field label="Format">
          <select
            name="format"
            defaultValue=""
            className={selectClass}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="" disabled>
              Select format
            </option>
            <option value="Bullet point list">Bullet point list</option>
            <option value="Paragraphs (with headings)">Paragraphs (with headings)</option>
            <option value="Paragraphs (without headings)">Paragraphs (without headings)</option>
            <option value="Table">Table</option>
            <option value="other">Others</option>
          </select>
          {format === "Table" && (
            <input
              name="tableFormat"
              type="text"
              placeholder="What is the format of the table?"
              className={`${inputClass} mt-2`}
            />
          )}
          {format === "other" && (
            <input
              name="formatOther"
              type="text"
              placeholder="Specify format..."
              className={`${inputClass} mt-2`}
            />
          )}
        </Field>

        <fieldset className="space-y-1.5">
          <legend className={labelClass}>How long should the document be?</legend>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="tc-length-pages"
                name="lengthType"
                value="pages"
                checked={lengthType === "pages"}
                onChange={() => setLengthType("pages")}
                className="h-4 w-4 accent-zinc-900 dark:accent-zinc-100"
              />
              <label htmlFor="tc-length-pages" className="text-sm text-zinc-700 dark:text-zinc-300">
                Pages
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="tc-length-words"
                name="lengthType"
                value="words"
                checked={lengthType === "words"}
                onChange={() => setLengthType("words")}
                className="h-4 w-4 accent-zinc-900 dark:accent-zinc-100"
              />
              <label htmlFor="tc-length-words" className="text-sm text-zinc-700 dark:text-zinc-300">
                Words
              </label>
            </div>
          </div>
          <input
            name="lengthValue"
            id="tc-length-value"
            type="number"
            min={1}
            placeholder={`Number of ${lengthType}`}
            className={inputClass}
          />
        </fieldset>

        <Field label="Target Audience">
          <select name="audience" defaultValue="" className={selectClass}>
            <option value="" disabled>
              Select target audience
            </option>
            <option value="Court">Court</option>
            <option value="Lawyer">Lawyer</option>
            <option value="Non-lawyer">Non-lawyer</option>
          </select>
        </Field>

        <Field label="Tone">
          <select
            name="tone"
            defaultValue=""
            className={selectClass}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="" disabled>
              Select tone
            </option>
            <option value="Formal">Formal</option>
            <option value="Conversational">Conversational</option>
            <option value="Plain language">Plain Language</option>
            <option value="Firm but polite">Firm but Polite</option>
            <option value="Friendly">Friendly</option>
            <option value="others">Others</option>
          </select>
          {tone === "others" && (
            <input
              name="toneOther"
              type="text"
              placeholder="Specify tone..."
              className={`${inputClass} mt-2`}
            />
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
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Generated Prompt
            </h2>
            <button
              onClick={handleCopy}
              className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            {improved && "[IMPROVED PROMPT]\n\n"}
            {state.prompt.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={i}>{part.slice(2, -2)}</strong>
                : part,
            )}
          </pre>
          <div className="flex justify-end">
            <button
              onClick={() => setImproved(true)}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Improve
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
