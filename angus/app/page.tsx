"use client";

import { useActionState, useState } from "react";
import { buildPrompt, type FormState } from "./actions";
import { q2Options } from "./data";

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

export default function Home() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(buildPrompt, null);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [tone, setTone] = useState("");
  const [copied, setCopied] = useState(false);

  const options = q1 ? q2Options[q1] ?? null : null;

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
          <Field label="What do you want from the AI system?">
            <select
              name="q1"
              value={q1}
              required
              className={selectClass}
              onChange={(e) => {
                setQ1(e.target.value);
                setQ2("");
              }}
            >
              <option value="">Select an option</option>
              <optgroup label="General">
                <option value="Summarise a document">Summarise a document</option>
                <option value="Draft communications">Draft communications</option>
                <option value="Create a timeline">Create a timeline</option>
                <option value="Legal research">Legal research</option>
              </optgroup>
              <optgroup label="Litigation">
                <option value="Litigation strategy">Litigation strategy</option>
                <option value="Draft a court document">Draft a court document</option>
              </optgroup>
              <optgroup label="Corporate">
                <option value="Draft a contract">Draft a contract</option>
                <option value="Review a contract">Review a contract</option>
              </optgroup>
              <optgroup label="Others">
                <option value="__other__">Others</option>
              </optgroup>
            </select>
            {q1 === "__other__" && (
              <input
                name="q1Other"
                type="text"
                placeholder="Please specify..."
                required
                className={`${inputClass} mt-2`}
              />
            )}
          </Field>

          {options && (
            <Field label="What is the deliverable?">
              {options.length === 1 && options[0].value === "__other__" ? (
                <textarea
                  name="q2Other"
                  placeholder="Please specify the structure and headings required, if necessary."
                  required
                  className={textareaClass}
                />
              ) : (
                <>
                  <select
                    name="q2"
                    value={q2}
                    required
                    className={selectClass}
                    onChange={(e) => setQ2(e.target.value)}
                  >
                    <option value="">Select a deliverable</option>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {q2 === "__other__" && (
                    <input
                      name="q2Other"
                      type="text"
                      placeholder="Please specify..."
                      required
                      className={`${inputClass} mt-2`}
                    />
                  )}
                </>
              )}
            </Field>
          )}

          <Field label="What are you preparing this document for?">
            <textarea
              name="purpose"
              placeholder="Describe the purpose of this document..."
              required
              className={textareaClass}
            />
          </Field>

          <Field label="What information or sources should the AI model use in generating a response?">
            <textarea
              name="sources"
              placeholder="Paste or describe the source material..."
              className={textareaClass}
            />
          </Field>

          <Field label="What is the tone of the document you are preparing?">
            <select
              name="tone"
              value={tone}
              required
              className={selectClass}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="">Select tone</option>
              <option value="Formal">Formal</option>
              <option value="Conversational">Conversational</option>
              <option value="Plain language">Plain language</option>
              <option value="Firm but polite">Firm but polite</option>
              <option value="Friendly">Friendly</option>
              <option value="__other__">Others</option>
            </select>
            {tone === "__other__" && (
              <input
                name="toneOther"
                type="text"
                placeholder="Please specify..."
                required
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
              {state.prompt}
            </pre>
          </section>
        )}
      </main>
    </div>
  );
}
