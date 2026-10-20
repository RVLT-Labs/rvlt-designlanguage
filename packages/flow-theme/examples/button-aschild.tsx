import { Button } from "@/components/ui/button";

/**
 * Button asChild (Radix Slot). The child element (here a link) receives the button styling and
 * the state semantics: `disabled` makes it aria-disabled, removes it from the tab order and stops
 * activation; `loading` adds aria-busy and the spinner. Use a real <a href> for navigation, never
 * a button that navigates.
 */
export function ButtonAsChildExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild variant="line">
        <a href="#job-1042">Open the job</a>
      </Button>
      <Button asChild variant="line" disabled>
        <a href="#quote-1042">Open the quote</a>
      </Button>
      <Button asChild loading>
        <a href="#run-sheet">Export the run sheet</a>
      </Button>
      <p id="job-1042" className="w-full text-muted">Example destination: job J-1042, Riverside gala.</p>
      <span id="quote-1042" className="sr-only">Example quote destination</span>
      <span id="run-sheet" className="sr-only">Example run sheet destination</span>
    </div>
  );
}
