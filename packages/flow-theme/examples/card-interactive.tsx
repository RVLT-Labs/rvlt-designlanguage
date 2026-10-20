import { Card, CardContent, CardDescription, CardHeader, CardLink, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "@/components/ui/status-indicator";

/**
 * Interactive card: the title is a real link (CardLink) that stretches over the card, so a
 * pointer press anywhere, Tab + Enter, and screen readers all meet one link named "Riverside
 * festival". Static cards stay plain containers. Never put onClick on a card.
 */
export function CardInteractiveExample() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card interactive className="max-w-xs">
        <CardHeader>
          <CardTitle asChild>
            <h3>
              <CardLink href="#job-riverside">Riverside festival</CardLink>
            </h3>
          </CardTitle>
          <CardDescription>Quoted · Sat 12 Dec · 3 stages</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusIndicator intent="neutral" label="Quoted" />
        </CardContent>
      </Card>
      <Card className="max-w-xs">
        <CardHeader>
          <CardTitle asChild>
            <h3>Hilton ballroom</h3>
          </CardTitle>
          <CardDescription>Gala dinner · Fri 15 Nov</CardDescription>
        </CardHeader>
      </Card>
      <p id="job-riverside" className="text-muted sm:col-span-2">Example destination: Riverside festival, quoted, three stages. No booking system is connected.</p>
    </div>
  );
}
