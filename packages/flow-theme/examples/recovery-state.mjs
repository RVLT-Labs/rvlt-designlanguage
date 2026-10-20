// In-memory reference state only. Reload clears the example; it does not implement persistence.
export const initial={items:[],returned:false,connection:'online',synced:false,message:'Ready. No server connection.'};
export function reduce(state,action) {
 switch(action.type) {
  case 'scan':
   if(action.tag!=='RF-00412')return {...state,message:'Tag not recognised. Check the printed tag and try again.'};
   if(state.items.includes(action.tag))return {...state,message:'RF-00412 is already in this return. No duplicate added.'};
   return {...state,items:[...state.items,action.tag],synced:false,message:'RF-00412 added to this example. Pending confirmation.'};
  case 'return': return state.items.length ? {...state,returned:true,synced:false,message:'Return recorded in memory only. Undo is available.'}: {...state,message:'Scan an item before confirming a return.'};
  case 'undo': return {...state,returned:false,synced:false,message:'Return undone. Item retained for review.'};
  case 'offline':return {...state,connection:'offline',synced:false,message:'Offline simulation. Changes are in memory only, not saved on device.'};
  case 'reconnect':return {...state,connection:'online',synced:false,message:'Connection restored in this simulation. Review pending changes, then retry sync.'};
  case 'reject':return {...state,synced:false,message:'Simulated server rejected the change: this item is allocated elsewhere. Keep this return and contact the warehouse lead.'};
  case 'sync':return state.connection==='offline'? {...state,message:'Still offline. Pending changes retained in memory.'}: {...state,synced:true,message:'Simulated sync accepted. No server was contacted.'};
  default:return state;
 }
}
