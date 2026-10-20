import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const ui=n=>read(`packages/flow-theme/registry/rvlt/ui/${n}.tsx`);
test('step names come from visible stage and hidden state with a decorative ring',()=>{
 const s=ui('stepper');
 assert.doesNotMatch(s,/aria-label=\{`/);
 assert.match(s,/<span\s+aria-hidden/);
 assert.ok(s.includes('{s.label}'));
 assert.ok(s.includes('<span className="sr-only">{stateText[s.state]}</span>'));
});
test('agenda names use person plus whitespace-separated visible job, time and instructions',()=>{
 const s=ui('crew-scheduler').split('data-scheduler-agenda')[1].split('data-scheduler-timeline')[0];
 assert.doesNotMatch(s,/aria-label=\{detail/);
 assert.ok(s.includes('<span className="sr-only">{row.name}: </span>'));
 assert.ok(s.includes('{shift.label}</span>{" "}<span'));
 assert.ok(s.includes('{" "}{(clash||row.unavailable)'));
 assert.ok(s.includes('clash&&row.unavailable'));
});
test('preview hero is in main and phone layout wraps fixed crew columns',()=>{
 const s=read('apps/preview-v2/src/components/preview-page.tsx');
 assert.ok(s.indexOf('<main id="main"')<s.indexOf('<h1'));
 assert.match(s,/grid grid-cols-2 gap-3 sm:grid-cols-4/);
 assert.match(s,/basis-full.*sm:basis-0/);
 assert.doesNotMatch(s,/bg-red shadow-\[var\(--sh-halo\)\] text-white/);
 assert.doesNotMatch(s,/-top-3[^"\n]*bg-red /);
});
test('catalogue header links compose underlined readable ink on paper',()=>{
 assert.ok(read('examples/static-catalogue/index.html').includes('header a{color:var(--ink-2);text-decoration:underline}'));
});
