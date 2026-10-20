export const initial={quantity:2,returned:0,previous:0,damaged:false,substituted:false,expired:true,loaded:false,conflict:true,synced:false,message:'Local draft. No device storage or server connection.'};
export function reduce(s,a) {
 switch(a.type) {
  case 'return': return Number.isInteger(a.quantity)&&a.quantity>0&&s.returned+a.quantity<=s.quantity?{...s,previous:s.returned,returned:s.returned+a.quantity,synced:false,message:'Partial return recorded in memory. Outstanding quantity remains on this job.'}:{...s,message:'Enter a whole quantity no greater than the outstanding items. Nothing changed.'};
  case 'undo':return {...s,returned:s.previous,synced:false,message:'Last return undone. Review the outstanding quantity.'};
  case 'damage':return {...s,damaged:true,message:'RF-00412 isolated for damage review. Original allocation retained until substitute is confirmed.'};
  case 'substitute':return s.damaged?{...s,substituted:true,synced:false,message:'Simulated substitute RF-00413 confirmed for RF-00412. Quantity remains two. Damaged item stays isolated.'}:s;
  case 'load':return {...s,loaded:false,message:'Load blocked: operator ticket expired. Ask the supervisor to verify a current ticket or assign a qualified operator. No override in this reference.'};
  case 'resolve':return {...s,conflict:false,synced:false,previous:a.choice==='server'?0:s.previous,returned:a.choice==='server'?0:s.returned,message:a.choice==='server'?'Server example chosen: return quantity reset to zero. Local draft remains unsynced.':'Local draft retained for supervisor review. Nothing sent to a server.'};
  default:return s;
 }
}
