"use client";
import {useReducer,useState,useRef,type CSSProperties} from "react";
import {initial,reduce} from "./calling-state.mjs";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter,DialogClose} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import binder from "./binder-tokens.json";
const cues=['LX 12: House to half','SND 4: Bell','FLY 7: Cloth out'];
const button='min-h-11 rounded-lg border-2 border-input px-4 py-2 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red disabled:opacity-45';
export function BinderCallingExample() {
 const [s,dispatch]=useReducer(reduce,initial),[entry,setEntry]=useState(false),[page,setPage]=useState(1),[zoom,setZoom]=useState(100),[brightness,setBrightness]=useState(100);
 const origin=useRef<HTMLElement|null>(null);
 return <div style={Object.fromEntries(Object.entries(binder).map(([key,value])=>[`--${key}`,value])) as CSSProperties} className="space-y-4" onKeyDown={e=>{if(e.altKey&&e.key.toLowerCase()==='g'&&s.calling){e.preventDefault();origin.current=document.activeElement as HTMLElement;dispatch({type:'arm'});}}}>
  <p>Binder reference simulation. No live cue, PDF, print or sync integration. The white script page keeps identical geometry in markup and calling. Brightness is a display experiment, requiring stage-manager validation.</p>
  <div className="flex flex-wrap gap-3"><button className={button} onClick={e=>{origin.current=e.currentTarget;if(s.calling)dispatch({type:'exit'});else setEntry(true);}}>{s.calling?'Exit Calling':'Enter Calling'}</button><button className={button} disabled={!s.calling||s.current===2} onClick={e=>{origin.current=e.currentTarget;dispatch({type:'arm'});}}>Go to next cue</button><button className={button} onClick={()=>dispatch({type:'offline'})}>{s.offline?'Simulate reconnect':'Simulate offline edits'}</button></div>
  <p>Current: {cues[s.current]}. Next: {cues[s.current+1]??'End of example'}. Mode: {s.calling?'Calling':'Markup'}. Connection: {s.offline?'Offline simulation':'Online simulation'}.</p>
  <p className="text-muted">Keyboard: Tab between controls, Enter or Space activates a button, Escape cancels a dialog. Alt+G opens Go confirmation while Calling is active in this example.</p>
  <div className="flex flex-wrap gap-3"><button className={button} disabled={page===1} onClick={()=>setPage(p=>p-1)}>Previous page</button><span className="py-3">Page {page} of 2</span><button className={button} disabled={page===2} onClick={()=>setPage(p=>p+1)}>Next page</button></div>
  <div className="grid gap-3 md:grid-cols-2"><div><Label htmlFor="script-zoom">Script zoom: {zoom}%</Label><input id="script-zoom" className="min-h-11 w-full" type="range" min={100} max={200} step={25} value={zoom} onChange={e=>setZoom(Number(e.target.value))}/></div><div><Label htmlFor="display-brightness">Display brightness experiment: {brightness}%</Label><input id="display-brightness" className="min-h-11 w-full" type="range" min={70} max={100} step={5} value={brightness} onChange={e=>setBrightness(Number(e.target.value))}/></div></div>
  <div className="overflow-auto rounded border border-line bg-[var(--stage)] p-3" role="region" aria-label="Fixed white script page, scroll at increased zoom" tabIndex={0}>
   <article style={{width:`${zoom}%`,minWidth:240,background:'var(--page)',color:'var(--page-ink)',filter:`brightness(${brightness}%)`,padding:24,fontFamily:'Helvetica, Arial, sans-serif',fontSize:18,lineHeight:1.7}} aria-label={`Script page ${page}`}>
    <h3 style={{fontSize:20,fontWeight:700}}>Act 1, page {page}</h3><p>ROSA: Bring the house to half. Wait for the bell.</p>
    <ol>{cues.map((cue,i)=><li key={cue} aria-current={i===s.current?'step':undefined}><span style={{border:`1px ${i===1?'dashed':'solid'} var(--${['dept-lx','dept-snd','dept-fly'][i]})`,borderRadius:8,padding:'2px 6px',fontWeight:i===s.current?700:400}}>{cue}</span>{i===s.current?' Current cue':i===s.current+1?' Next cue':''}</li>)}</ol>
   </article>
  </div>
  <Label htmlFor="calling-note">Local note</Label><Textarea id="calling-note" value={s.note} onChange={e=>dispatch({type:'edit',note:e.target.value})}/><p>{s.pending?'Pending note, in memory only.':'No pending notes.'}</p><p role="status">{s.message}</p>
  <Dialog open={entry||s.armed} onOpenChange={open=>{if(!open){setEntry(false);dispatch({type:'cancel'});}}}><DialogContent onCloseAutoFocus={event=>{event.preventDefault();origin.current?.focus();}}><DialogHeader><DialogTitle>{entry?'Enter Calling simulation?':'Confirm next cue'}</DialogTitle><DialogDescription>{entry?'This is a protected local rehearsal reference. No live show is connected.':`Advance from ${cues[s.current]} to ${cues[s.current+1]??'end'} in this example only?`}</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><button className={button}>Cancel</button></DialogClose><button className={button} onClick={()=>{if(entry){dispatch({type:'enter'});setEntry(false);}else dispatch({type:'go'});}}>{entry?'Enter simulation':'Confirm Go'}</button></DialogFooter></DialogContent></Dialog>
 </div>;
}
