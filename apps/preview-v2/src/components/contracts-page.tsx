"use client";

import { useEffect, useState } from "react";

import { EXAMPLES } from "@examples/index";

/**
 * The documented examples (packages/flow-theme/examples), rendered exactly as the docs show them.
 * Each sits in a [data-example] region that the browser tests drive.
 */
export function ContractsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("theme");
    if (q === "light" || q === "dark") setTheme(q);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground">
        Skip to content
      </a>
      <header className="flex flex-wrap items-center gap-3 border-b-2 border-border bg-paper-2 px-5 py-3">
        <a href="../" className="inline-flex min-h-11 items-center font-display text-[17px] font-extrabold tracking-tight text-ink">
          RVLT Flow preview
        </a>
        <span className="text-[14px] text-muted">Component contracts</span>
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-pressed={theme === "light"}
          className="ml-auto inline-flex min-h-11 items-center rounded-full border-2 border-input px-4 text-[14px] font-semibold text-ink hover:bg-elev focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          Paper theme
        </button>
      </header>
      <main id="main" className="mx-auto max-w-5xl space-y-12 px-5 py-10">
        <div>
          <h1 className="font-display text-[24px] font-extrabold tracking-tight text-ink">Component contracts</h1>
          <p className="mt-2 max-w-2xl text-[16px] text-ink-2">
            Copyable examples from the <code className="font-mono text-[14px]">@rvlt/flow-theme</code> docs, compiled against the
            registry source. Browser regression coverage and recorded results are listed in the remediation matrix.
          </p>
        </div>
        {EXAMPLES.map(({ id, title, description, Component }) => (
          <section key={id} id={id} data-example={id} aria-labelledby={`${id}-h`} className="space-y-4">
            <div>
              <h2 id={`${id}-h`} className="font-display text-[18px] font-bold tracking-tight text-ink">{title}</h2>
              <p className="mt-1 max-w-2xl text-[14px] text-muted">{description}</p>
            </div>
            <div className="rounded-[var(--radius)] border-2 border-border bg-card p-5 shadow-[var(--sh-card)]">
              <Component />
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
