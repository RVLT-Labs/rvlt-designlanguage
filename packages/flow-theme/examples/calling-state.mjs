export const initial={calling:false,armed:false,current:0,offline:false,pending:false,note:'',message:'Markup reference. No live show connected.'};
export function reduce(s,a) {
 switch(a.type) {
  case 'enter':return {...s,calling:true,message:'Calling simulation entered. Go requires confirmation.'};
  case 'exit':return {...s,calling:false,armed:false,message:'Returned to markup. Cue position and local note retained.'};
  case 'arm':return s.calling?{...s,armed:true}:s;
  case 'cancel':return {...s,armed:false};
  case 'go':return s.calling&&s.armed?{...s,current:Math.min(2,s.current+1),armed:false,message:'Cue advanced in this simulation only.'}:s;
  case 'offline':return {...s,offline:!s.offline,message:'Connection simulation changed. Notes remain in memory only.'};
  case 'edit':return {...s,note:a.note,pending:true,message:'Note edited in memory, not synced or saved to device.'};
  default:return s;
 }
}
