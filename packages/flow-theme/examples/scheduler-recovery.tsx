"use client";
import {useState,useRef} from "react";
import {CrewScheduler,type SchedulerRow,type SchedulerShift} from "@/components/ui/crew-scheduler";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter,DialogClose} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {formatHour,layoutShifts,canAssign} from "@/lib/scheduler";
const INITIAL:SchedulerRow[]=[
 {id:'alex',name:'Alexandra Montgomery-Williams',shifts:[{id:'gala',label:'Riverside gala load-in, main stage',startHour:8,endHour:12},{id:'expo',label:'Convention centre RF check',startHour:9,endHour:9.25}]},
 {id:'sam',name:'Sam Nguyen',shifts:[{id:'night',label:'Overnight bump-out',startHour:22,endHour:2}]},
 {id:'lee',name:'Lee Patel',unavailable:true,shifts:[]},
 {id:'jo',name:'Jo Wilson',shifts:[]},
];
export function SchedulerRecoveryExample() {
 const [rows,setRows]=useState(INITIAL),[selected,setSelected]=useState<{row:SchedulerRow;shift:SchedulerShift}|null>(null);
 const [day,setDay]=useState(0),[message,setMessage]=useState('Local reference. Changes last until reload.');
 const origin=useRef<HTMLElement|null>(null),status=useRef<HTMLParagraphElement>(null);
 const labels=['Friday 11 December','Saturday 12 December','Sunday 13 December'];
 const destination=rows.find(row=>row.id==='jo')!;
 const allowed=!!selected&&selected.row.id!==destination.id&&canAssign(destination,selected.shift);
 function reassign() {
  if(!selected||!allowed)return; const {row,shift}=selected;
  setRows(current=>current.map(r=>r.id===row.id?{...r,shifts:r.shifts.filter(s=>s.id!==shift.id)}:r.id==='jo'?{...r,shifts:[...r.shifts,shift]}:r));
  setMessage(`${shift.label} reassigned to Jo Wilson in this example. The other call is unchanged. No crew member was notified.`);setSelected(null);
 }
 return <div className="space-y-4">
  <p>Clash recovery reference with a short call, long names, unavailable crew and overnight work. No booking service or notifications.</p>
  <CrewScheduler rows={day===0?rows:[]} label={labels[day]} startHour={8} endHour={28} onDayChange={direction=>{setDay(d=>Math.max(0,Math.min(2,d+direction)));setMessage('Selected day changed. Only Friday has example assignments.');}} onShiftClick={(shift,row)=>{origin.current=document.activeElement as HTMLElement;setSelected({shift,row});}}/>
  {day!==0&&<p>No example assignments for this day.</p>}
  <p ref={status} tabIndex={-1} role="status">{message}</p>
  <Dialog open={!!selected} onOpenChange={open=>{if(!open)setSelected(null);}}>
   <DialogContent onCloseAutoFocus={event=>{event.preventDefault();(origin.current?.isConnected?origin.current:status.current)?.focus();}}><DialogHeader><DialogTitle>Review assignments</DialogTitle><DialogDescription>Read both calls before choosing a resolution. This changes local example state only.</DialogDescription></DialogHeader>
    {selected&&<div className="space-y-3"><p>{selected.row.name}</p><ul className="space-y-2">{layoutShifts(selected.row.shifts).map(({shift,end,clash})=><li key={shift.id}><strong>{shift.label}</strong>: {formatHour(shift.startHour)} to {formatHour(end)}{clash?' · Clash':''}</li>)}</ul>
     <p>Selected: {selected.shift.label}. {allowed ? "Jo Wilson is available. Reassigning moves only this call and keeps its times." : "Jo Wilson cannot take this call. Keep these assignments and review another crew member in the product."}</p></div>}
    <DialogFooter><DialogClose asChild><Button variant="line">Keep assignments</Button></DialogClose><Button disabled={!allowed} onClick={reassign}>Reassign selected call</Button></DialogFooter>
   </DialogContent>
  </Dialog>
 </div>;
}
