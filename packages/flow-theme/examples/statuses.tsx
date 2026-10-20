import {StatusIndicator} from "@/components/ui/status-indicator";
export function StatusesExample() {
 return <div className="flex flex-wrap gap-5">
  <StatusIndicator intent="ok" label="Available" />
  <StatusIndicator intent="warn" label="Prepping" />
  <StatusIndicator intent="overbooked" label="Clash" />
  <StatusIndicator intent="repair" label="In repair" />
  <StatusIndicator intent="neutral" label="Checked out" />
  <StatusIndicator intent="live" label="Connection live" />
 </div>;
}
