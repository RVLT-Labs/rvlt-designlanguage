"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LifecycleStepper, type Step } from "@/components/ui/stepper";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STEPS: Step[] = [
  { label: "Enquiry", state: "done" },
  { label: "Quote", state: "done" },
  { label: "Confirmed", state: "now" },
  { label: "Prep", state: "future" },
  { label: "On site", state: "future" },
  { label: "Return", state: "future" },
];

/**
 * Field-sized controls (DESIGN.md §16.8): every control keeps a 44px hit area even where its
 * visual mark is smaller (checkbox 20px, switch 24px tall, stepper ring 28px). Small buttons are
 * 44px on touch and 36px only under a fine pointer.
 */
export function TouchTargetsExample() {
  const [crew, setCrew] = useState("sam");
  const [stage, setStage] = useState(2);
  const stateOf = (i: number): Step["state"] => (i < stage ? "done" : i === stage ? "now" : "future");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <Checkbox id="tt-ready" data-testid="tt-checkbox" defaultChecked />
          <Label htmlFor="tt-ready">Ready for prep</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="tt-notify" data-testid="tt-switch" />
          <Label htmlFor="tt-notify">Notify the crew</Label>
        </div>
        <Button size="sm" variant="line" data-testid="tt-button-sm">Add note</Button>
      </div>
      <Tabs defaultValue="schedule">
        <TabsList aria-label="Job views">
          <TabsTrigger value="schedule" data-testid="tt-tab">Schedule</TabsTrigger>
          <TabsTrigger value="crew">Crew</TabsTrigger>
          <TabsTrigger value="gear">Gear</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule"><p className="text-[14px] text-muted">Load-in 06:30, dock 2.</p></TabsContent>
        <TabsContent value="crew"><p className="text-[14px] text-muted">Six crew booked.</p></TabsContent>
        <TabsContent value="gear"><p className="text-[14px] text-muted">Two items short.</p></TabsContent>
      </Tabs>
      <div className="max-w-xs space-y-2">
        <p className="text-[14px] font-medium text-ink-2">Crew chief</p>
        <Combobox
          value={crew}
          onValueChange={setCrew}
          options={[
            { value: "sam", label: "Sam Kowalski" },
            { value: "mia", label: "Mia Thornton" },
          ]}
        />
      </div>
      <LifecycleStepper label="Riverside festival lifecycle" steps={STEPS.map((s, i) => ({ ...s, state: stateOf(i) }))} onStepClick={setStage} />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="line">Pull the kit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pull this kit off Saturday?</DialogTitle>
            <DialogDescription>It is booked for the Riverside festival. The job goes short until you swap it.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="line" className="w-full sm:w-auto">Keep it booked</Button>
            </DialogClose>
            <Button className="w-full sm:w-auto">Pull it anyway</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
