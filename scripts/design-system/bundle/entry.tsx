// RVLT live component bundle — the real component source from TwoToned/gearflow (the RVLT registry
// primitives as Flow ships them) and RVLT-Labs/binder, compiled to one classic script (window.Rvlt).
// The design-system frame sets <html data-theme>; the apps key light mode off `.light`, so mirror it.
(function syncLightClass() {
  var d = document.documentElement;
  var set = function () { d.classList.toggle("light", d.getAttribute("data-theme") === "light"); };
  set();
  new MutationObserver(set).observe(d, { attributes: true, attributeFilter: ["data-theme"] });
})();

export { Button } from "G/components/ui/button";
export { Badge } from "G/components/ui/badge";
export { StatusIndicator } from "G/components/ui/status-indicator";
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Panel } from "G/components/ui/card";
export { Stat } from "G/components/ui/stat";
export { EmptyState } from "G/components/ui/empty-state";
export { FlowMascot } from "G/components/ui/flow-mascot";
export { Skeleton } from "G/components/ui/skeleton";
export { Input, SearchInput } from "G/components/ui/input";
export { Textarea } from "G/components/ui/textarea";
export { Label } from "G/components/ui/label";
export { Checkbox } from "G/components/ui/checkbox";
export { Switch } from "G/components/ui/switch";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "G/components/ui/tabs";
export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from "G/components/ui/table";
export { LifecycleStepper } from "G/components/ui/stepper";
export { FeaturePatch } from "G/components/ui/feature-patch";
export { PersonAvatar, avatarHue } from "G/components/ui/avatar";
export { Kbd } from "G/components/ui/kbd";
export { SectionHeader, SidebarSection } from "G/components/layout/page-layouts";
export { Button as BinderButton } from "B/components/ui/button";
export { Segmented } from "B/components/ui/segmented";
export { EmptyState as BinderEmptyState } from "B/components/EmptyState";
export { DocsIcon as BinderDocsIcon, PrintIcon as BinderPrintIcon, CuesIcon as BinderCuesIcon } from "B/components/icons";
export { Search as SearchIcon, Package as PackageIcon, FolderOpen as FolderOpenIcon, CalendarRange as CalendarRangeIcon, HardHat as HardHatIcon, Wrench as WrenchIcon, Warehouse as WarehouseIcon, Printer as PrinterIcon } from "G-lucide";
