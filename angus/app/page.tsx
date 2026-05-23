"use client";

import { useState } from "react";
import TcPage from "./tc-page";
import CfPage from "./cf-page";

type Version = "tc" | "cf";

export default function Home() {
  const [version, setVersion] = useState<Version>("tc");

  return (
    <div className="min-h-dvh bg-white font-sans dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Prompt Builder
          </h1>
          <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              onClick={() => setVersion("tc")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                version === "tc"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Tse Chuan&apos;s version
            </button>
            <button
              onClick={() => setVersion("cf")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                version === "cf"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Chern Faye&apos;s version
            </button>
          </div>
        </div>
      </header>

      {version === "tc" ? <TcPage /> : <CfPage />}
    </div>
  );
}
