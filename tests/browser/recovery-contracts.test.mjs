import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {serve,launch,open,shot,record,axe,axNode,waitForAXName} from './harness.mjs';
let srv,browser;
before(async()=>{srv=await serve();browser=await launch();});
after(async()=>{await browser?.close();await srv?.close();});
for(const viewport of ['320','390','768','desktop'])for(const theme of ['dark','light']) {
 test(`contracts ${viewport} ${theme}: phone agenda, recovery, forms, motion and assets`,async()=>{
  const {page,context,errors,failed,external}=await open(browser,srv.url(`preview-v2/contracts/?theme=${theme}`),{viewport,reducedMotion:'reduce'});
  // Guard the initial DOM as well as the recovered state; no rule exclusions.
  const agenda=page.locator('[data-example="scheduler-recovery"] [data-scheduler-agenda]');
  if(Number(viewport)<768) {
   const rows=agenda.locator('section');
   for(let i=0;i<await rows.count();i++) {
    const row=rows.nth(i), person=await row.getByRole('heading').textContent();
    const calls=row.getByRole('button');
    for(let j=0;j<await calls.count();j++) {
     const call=calls.nth(j);
     assert.equal(await call.getAttribute('aria-label'),null);
     const natural=(await call.textContent()).replace(/\s+/g,' ').trim();
     assert.ok(natural.startsWith(person+': '));
     await waitForAXName(page,call,natural);
     const bounds=await call.boundingBox();
     assert.ok(bounds.height>=44 && bounds.width>=44);
    }
   }
  }
  assert.deepEqual(await axe(page),[]);

  const combo=page.getByRole('combobox',{name:'Sam Kowalski',exact:true});
  assert.equal(await combo.count(),1);
  assert.equal((await waitForAXName(page,combo,'Sam Kowalski')).name,'Sam Kowalski');
  const scan=page.locator('[data-example="scan-return"]');
  await scan.getByRole('button',{name:'Add scanned item'}).click();
  await scan.getByRole('button',{name:'Add scanned item'}).click();
  assert.match(await scan.getByRole('status').textContent(),/already/);
  assert.equal(await scan.locator('li').count(),1);
  await scan.getByRole('button',{name:'Confirm return',exact:true}).click();
  await scan.getByRole('button',{name:'Undo return',exact:true}).click();
  assert.match(await scan.getByRole('status').textContent(),/undone/);
  await scan.getByRole('button',{name:'Simulate offline',exact:true}).click();
  await scan.getByRole('button',{name:'Retry sync',exact:true}).click();
  assert.match(await scan.getByRole('status').textContent(),/Still offline/);
  await scan.getByRole('button',{name:'Simulate reconnect',exact:true}).click();
  assert.match(await scan.getByRole('status').textContent(),/pending changes/);
  await scan.getByRole('button',{name:'Retry sync',exact:true}).click();
  assert.match(await scan.getByRole('status').textContent(),/No server/);
  await scan.getByRole('button',{name:'Simulate server rejection',exact:true}).click();
  assert.match(await scan.getByRole('status').textContent(),/rejected/);
  await scan.getByLabel('Printed asset tag').fill('UNKNOWN');
  await scan.getByRole('button',{name:'Add scanned item'}).click();
  assert.match(await scan.getByRole('status').textContent(),/not recognised/);
  const form=page.locator('[data-example="form-field"]');
  await form.getByRole('button',{name:'Save example locally'}).click();
  const email=form.getByLabel('Crew email (required)');
  assert.equal(await email.getAttribute('aria-invalid'),'true');
  assert.ok(await email.evaluate(el=>el===document.activeElement));
  assert.match(await form.getByRole('alert').textContent(),/valid crew email/);
  await email.fill('crew@example.test');await form.getByRole('button',{name:'Save example locally'}).click();
  assert.match(await form.getByRole('status').textContent(),/No data was sent/);
  const roster=page.locator('[data-example="scheduler-recovery"]');
  const phone=Number(viewport)<768;
  assert.equal(await roster.locator('[data-scheduler-agenda]').isVisible(),phone);
  if(!phone)await roster.getByText('Full assignment list and clash details',{exact:true}).click();
  const call=roster.getByRole('button',{name:/Alexandra.*Convention centre RF check/});
  assert.equal(await call.count(),1);
  assert.match((await waitForAXName(page,call,/Alexandra.*Convention centre RF check.*Clash\. Review both assignments\./)).name,/Clash\. Review both assignments\./);
  await call.click();
  const dialog=page.getByRole('dialog');
  assert.match(await dialog.textContent(),/Riverside gala load-in/);
  assert.match(await dialog.textContent(),/Convention centre RF check/);
  await dialog.getByRole('button',{name:'Reassign selected call'}).click();
  assert.match(await roster.getByRole('status').textContent(),/Jo Wilson/);
  assert.match(await roster.getByRole('status').textContent(),/No crew member was notified/);
  await roster.getByRole('button',{name:'Next day'}).click();assert.match(await roster.textContent(),/Saturday/);
  await roster.getByRole('button',{name:'Previous day'}).click();
  const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,motion:[...document.querySelectorAll('button,[data-slot=card]')].filter(el=>{const s=getComputedStyle(el);return parseFloat(s.transitionDuration)>0.01||parseFloat(s.animationDuration)>0.01;}).length}));
  assert.ok(geometry.scroll<=geometry.width,JSON.stringify(geometry));assert.equal(geometry.motion,0);
  const violations=await axe(page);record(`contracts-${viewport}-${theme}`,{geometry,violations,errors,external,failed});
  await shot(page,`contracts-${viewport}-${theme}`,{fullPage:true});
  await context.close();assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);assert.deepEqual(violations,[]);
 });
}
for(const theme of ['dark','light'])for(const viewport of ['320','390','768','desktop'])for(const rel of ['','design-system/','examples/static-catalogue/','preview-v2/']) {
 test(`surface ${rel||'root'} ${theme} ${viewport}: fonts, semantics and no contrast failures`,async()=>{
   const {page,context,errors,failed,external}=await open(browser,srv.url(rel),{viewport,reducedMotion:'reduce'});
   if(rel==='preview-v2/' && theme==='light') await page.getByRole('button',{name:'Toggle theme'}).click();
   await page.evaluate(theme=>{document.documentElement.classList.toggle('light',theme==='light');document.documentElement.setAttribute('data-theme',theme);},theme);
   if(rel===''){
    const code=page.getByRole('region',{name:'Theme installation code'});
    await code.focus();
    assert.ok(await code.evaluate(el=>el===document.activeElement));
   }
   const v=await axe(page);const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,escaping:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1);}).map(el=>({tag:el.tagName,class:el.className,text:el.textContent?.slice(0,80)})).slice(0,30)}));
   record(`surface-${rel.replaceAll('/','-')||'root'}-${theme}-${viewport}`,{v,geometry,errors,failed,external});
   await shot(page,`surface-${rel.replaceAll('/','-')||'root'}-${theme}-${viewport}`);
   await context.close();assert.ok(geometry.scroll<=geometry.width,rel+JSON.stringify(geometry));assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);assert.deepEqual(v,[],rel);
 });
}
for(const name of ['Button','Input','StatusIndicator','Table','Card','LifecycleStepper','CueTag','Tabs','Checkbox','Switch'])for(const theme of ['dark','light']) {
 test(`card ${name} ${theme}: local registry, labelled controls and readable text`,async()=>{
  const {page,context,errors,failed,external}=await open(browser,srv.url(`design-system/components/${name}/view.html?theme=${theme}`),{viewport:'390',reducedMotion:'reduce'});
  const v=await axe(page,{rules:{'landmark-one-main':{enabled:false},'page-has-heading-one':{enabled:false},region:{enabled:false}}});
  record(`card-${name}-${theme}`,{v,errors,failed,external});await shot(page,`card-${name}-${theme}`,{fullPage:true});
  await context.close();assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);assert.deepEqual(v,[]);
 });
}
for(const theme of ['dark','light']) {
 test(`keyboard and Calling ${theme}: protected cue advance, modal focus and tabs`,async()=>{
  const {page,context}=await open(browser,srv.url(`preview-v2/contracts/?theme=${theme}`),{viewport:'390',reducedMotion:'reduce'});
  const calling=page.locator('[data-example="binder-calling"]');
  await calling.getByRole('button',{name:'Enter Calling',exact:true}).click();
  let dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'Enter simulation'}).click();
  await calling.getByRole('button',{name:'Go to next cue'}).click();
  dialog=page.getByRole('dialog');assert.match(await dialog.textContent(),/LX 12.*SND 4/);
  await page.keyboard.press('Escape');assert.match(await calling.textContent(),/Current: LX 12/);
  await calling.getByRole('button',{name:'Go to next cue'}).click();await page.getByRole('dialog').getByRole('button',{name:'Confirm Go'}).click();
  assert.match(await calling.textContent(),/Current: SND 4/);
  await calling.getByRole('button',{name:'Simulate offline edits'}).click();await calling.getByLabel('Local note').fill('Wait for the bell');
  await calling.getByRole('button',{name:'Exit Calling'}).click();assert.equal(await calling.getByLabel('Local note').inputValue(),'Wait for the bell');
  const safety=page.locator('[data-example="operational-recovery"]');
  await safety.getByRole('button',{name:'Record partial return',exact:true}).click();assert.match(await safety.textContent(),/Still out: 1/);
  await safety.getByRole('button',{name:'Check permission to load'}).click();assert.match(await safety.getByRole('status').textContent(),/Load blocked/);
  await safety.getByRole('button',{name:'Record damage and isolate'}).click();await safety.getByRole('button',{name:'Confirm substitute RF-00413'}).click();assert.match(await safety.getByRole('status').textContent(),/Quantity remains two/);
  await safety.getByRole('button',{name:'Keep local draft for review'}).click();assert.match(await safety.getByRole('status').textContent(),/Nothing sent/);
  const touch=page.locator('[data-example="touch-targets"]');
  const trigger=touch.getByRole('button',{name:'Pull the kit'});await trigger.focus();await page.keyboard.press('Enter');dialog=page.getByRole('dialog');
  for(let i=0;i<8;i++){await page.keyboard.press('Tab');assert.ok(await dialog.evaluate(d=>d.contains(document.activeElement)));}
  await page.keyboard.press('Escape');
  // Radix restores trigger focus after dialog unmount and its queued focus-scope cleanup.
  await page.waitForFunction(el=>el===document.activeElement,await trigger.elementHandle(),{timeout:5000});
  assert.ok(await trigger.evaluate(el=>el===document.activeElement));
  const first=touch.getByRole('tab').first();await first.focus();await page.keyboard.press('ArrowRight');
  // Radix roving focus intentionally moves focus in a queued timer, then selects on focus.
  await touch.getByRole('tab').nth(1).waitFor({state:'visible'});
  await page.waitForFunction(()=>{const tabs=document.querySelector('[data-example="touch-targets"]').querySelectorAll('[role=tab]');return tabs[1]===document.activeElement&&tabs[1].getAttribute('aria-selected')==='true';});
  assert.equal(await touch.getByRole('tab').nth(1).getAttribute('aria-selected'),'true');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await first.evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  await context.close();
 });
}
