import { Button } from "@/components/ui/button";

/**
 * Button states (DESIGN.md §9.1). A loading button keeps its width and its accessible name
 * (the label stays in the accessibility tree; only the spinner is hidden from it), and is
 * announced as busy and disabled.
 */
export function ButtonStatesExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button data-testid="send-idle">Sending quote</Button>
      <Button data-testid="send-loading" loading>
        Sending quote
      </Button>
      <Button variant="line">Save draft</Button>
      <Button variant="ghost">Cancel</Button>
      <Button disabled>Book gear out</Button>
    </div>
  );
}
