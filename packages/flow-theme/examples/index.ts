// Every documented @rvlt/flow-theme example. The docs quote these files verbatim
// (tests/unit/examples.test.mjs) and preview-v2 compiles and renders them at /contracts/.
import type { ComponentType } from "react";

import { ButtonAsChildExample } from "./button-aschild";
import { ButtonStatesExample } from "./button-states";
import { CardInteractiveExample } from "./card-interactive";
import { TouchTargetsExample } from "./touch-targets";

export interface ExampleEntry {
  id: string;
  title: string;
  description: string;
  Component: ComponentType;
}

import {FormFieldExample} from "./form-field";
import {StatusesExample} from "./statuses";

import {ScanReturnExample} from "./scan-return";
import {SchedulerRecoveryExample} from "./scheduler-recovery";

import {OperationalRecoveryExample} from "./operational-recovery";
import {BinderCallingExample} from "./binder-calling";

export const EXAMPLES: ExampleEntry[] = [
 {id:"operational-recovery",title:"Returns, damage and reconnect decisions",description:"Quantities, substitution, expired tickets and conflicting drafts with persistent local feedback.",Component:OperationalRecoveryExample},
 {id:"binder-calling",title:"Binder Calling reference",description:"Fixed script geometry, protected cue advance, page navigation and local offline notes.",Component:BinderCallingExample},
 {id:"scan-return", title:"Scan, return and reconnect", description:"Local recovery states with duplicate prevention and undo.",Component:ScanReturnExample},
 {id:"scheduler-recovery", title:"Crew agenda and clash recovery", description:"Phone agenda, separate overlapping calls and explicit reassignment.",Component:SchedulerRecoveryExample},
  {id:"form-field", title:"Accessible form", description:"Native labels, required fields and validation with preserved input.", Component:FormFieldExample},
  {id:"statuses", title:"Status vocabulary", description:"Visible labels with the distributed public API.", Component:StatusesExample},
  { id: "button-states", title: "Button states", description: "Default, loading (named, busy, same width), line, ghost and disabled.", Component: ButtonStatesExample },
  { id: "button-aschild", title: "Button asChild", description: "A link styled as a button that takes the disabled and loading semantics.", Component: ButtonAsChildExample },
  { id: "touch-targets", title: "Field-sized controls", description: "Checkbox, switch, tabs, combobox clear, stepper rings and dialog close all keep a 44px hit area.", Component: TouchTargetsExample },
  { id: "card-interactive", title: "Interactive card", description: "A card that opens something is a real link, named by its title.", Component: CardInteractiveExample },
];
