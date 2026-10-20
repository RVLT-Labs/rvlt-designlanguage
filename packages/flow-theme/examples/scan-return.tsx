"use client";
import {useReducer,useState} from "react";
import {initial,reduce} from "./recovery-state.mjs";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
export function ScanReturnExample() {
 const [state,dispatch]=useReducer(reduce,initial),[tag,setTag]=useState('RF-00412');
 return <div className="space-y-4 [&_button]:h-auto [&_button]:min-h-12 [&_button]:max-w-full [&_button]:whitespace-normal [&_button]:py-3">
  <p>Interactive reference, in memory only. Reload clears changes. No scanner, device storage or server is connected.</p>
  <form onSubmit={e=>{e.preventDefault();dispatch({type:'scan',tag:tag.trim()});}} className="space-y-2">
   <Label htmlFor="return-tag">Printed asset tag</Label><Input id="return-tag" value={tag} onChange={e=>setTag(e.target.value)} aria-describedby="tag-hint"/>
   <p id="tag-hint" className="text-muted">Use RF-00412 for a recognised item. Any other tag demonstrates recovery.</p>
   <Button type="submit" className="min-h-12">Add scanned item</Button>
  </form>
  <p role="status" aria-live="polite">{state.message}</p>
  <ul>{state.items.map((item:string)=><li key={item}>{item}: {state.returned?'Return recorded':'Pending return'}</li>)}</ul>
  <div className="flex flex-wrap gap-3"><Button className="min-h-12" onClick={()=>dispatch({type:'return'})} disabled={!state.items.length||state.returned}>Confirm return</Button>
   <Button variant="line" onClick={()=>dispatch({type:'undo'})} disabled={!state.returned}>Undo return</Button></div>
  <p>Connection: {state.connection}. Sync: {state.synced?'Simulated acceptance':'Pending review'}.</p>
  <div className="flex flex-wrap gap-3">
   <Button variant="line" onClick={()=>dispatch({type:'offline'})}>Simulate offline</Button>
   <Button variant="line" onClick={()=>dispatch({type:'reconnect'})}>Simulate reconnect</Button>
   <Button variant="line" disabled={!state.items.length} onClick={()=>dispatch({type:'sync'})}>Retry sync</Button>
   <Button variant="ghost" disabled={!state.items.length} onClick={()=>dispatch({type:'reject'})}>Simulate server rejection</Button>
  </div>
 </div>;
}
