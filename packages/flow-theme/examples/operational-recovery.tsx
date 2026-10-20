"use client";
import {useReducer,useState} from "react";
import {initial,reduce} from "./operational-state.mjs";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
export function OperationalRecoveryExample() {
 const [s,dispatch]=useReducer(reduce,initial),[quantity,setQuantity]=useState('1');
 return <div className="space-y-5 [&_button]:h-auto [&_button]:min-h-12 [&_button]:max-w-full [&_button]:whitespace-normal [&_button]:py-3">
  <p>Job: Riverside gala, J-204. Two RF receivers. Local simulation only: no stock, tickets, durable storage or server is connected.</p>
  <section aria-label="Partial return" className="space-y-3 border-t border-line pt-3"><h3 className="font-bold">Partial return</h3>
   <p>RF-00412 and RF-00414. Expected: {s.quantity}. Returned: {s.returned}. Still out: {s.quantity-s.returned}.</p>
   <form className="space-y-2" onSubmit={e=>{e.preventDefault();dispatch({type:'return',quantity:Number(quantity)});}}><Label htmlFor="partial-quantity">Quantity received</Label><Input id="partial-quantity" type="number" min={1} max={s.quantity-s.returned} step={1} value={quantity} onChange={e=>setQuantity(e.target.value)}/><Button className="min-h-12" type="submit" disabled={s.returned===s.quantity}>Record partial return</Button></form>
   <Button variant="line" onClick={()=>dispatch({type:'undo'})}>Undo last quantity</Button>
  </section>
  <section aria-label="Damaged substitute" className="space-y-3 border-t border-line pt-3"><h3 className="font-bold">Damaged substitute</h3>
   <p>Original: Shure receiver RF-00412, quantity 1. Proposed replacement: Shure receiver RF-00413, quantity 1, available in this scenario.</p>
   <p>{s.damaged?'RF-00412 isolated.':'RF-00412 awaiting inspection.'} {s.substituted?'RF-00413 allocated in the example.':'Substitute not yet confirmed.'}</p>
   <div className="flex flex-wrap gap-3"><Button variant="line" onClick={()=>dispatch({type:'damage'})}>Record damage and isolate</Button><Button disabled={!s.damaged||s.substituted} onClick={()=>dispatch({type:'substitute'})}>Confirm substitute RF-00413</Button></div>
  </section>
  <section aria-label="Expired ticket" className="space-y-3 border-t border-line pt-3"><h3 className="font-bold">Expired operator ticket</h3>
   <p>Alexandra Montgomery-Williams: forklift ticket expired 10 December. Job J-204 requires a current ticket. Loading remains blocked.</p>
   <Button variant="line" onClick={()=>dispatch({type:'load'})}>Check permission to load</Button>
  </section>
  <section aria-label="Reconnect conflict" className="space-y-3 border-t border-line pt-3"><h3 className="font-bold">Reconnect conflict</h3>
   <p>Local draft: {s.returned} returned. Server scenario: zero returned, allocated to another job. Sync: pending. {s.conflict?'Unresolved conflict. Choose which draft to retain.':'Draft choice recorded locally. Supervisor review still required.'}</p>
   <div className="flex flex-wrap gap-3"><Button variant="line" disabled={!s.conflict} onClick={()=>dispatch({type:'resolve',choice:'server'})}>Use server example, discard local return</Button><Button variant="line" disabled={!s.conflict} onClick={()=>dispatch({type:'resolve',choice:'local'})}>Keep local draft for review</Button></div>
  </section>
  <p role="status" className="rounded border border-line p-3">{s.message}</p>
 </div>;
}
