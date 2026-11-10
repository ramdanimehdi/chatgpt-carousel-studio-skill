import assert from 'node:assert/strict';
import test from 'node:test';
import {hydrateProject} from '../components/content/types.ts';
import {planDay,publicationBlocked,skipReason,recordResponse,formatTime} from '../components/content/publication.ts';
const p=(id,extras={})=>({...hydrateProject({id,name:id,kind:'carousel',stage:'design-review',day:'2026-11-08',slides:[{id:1}]}),...extras});
test('day queue skips published, past scheduled, ambiguous and script-only materials without leaving time gaps',()=>{
 const projects=[p('published',{stage:'published'}),p('one'),p('scheduled',{stage:'scheduled',publishMeta:{scheduledAt:'2026-01-01T00:00:00Z'}}),p('unknown',{publishMeta:{attemptState:'unknown'}}),p('script',{kind:'reel'}),p('two'),p('other',{day:'2026-11-07'})];
 const slots=planDay(projects,'2026-11-08','2026-11-08T20:00:00Z',Date.parse('2026-11-08T17:00:00Z'));
 assert.deepEqual(slots.map(s=>s.project.id),['one','two']);assert.equal(Date.parse(slots[1].at)-Date.parse(slots[0].at),10800000);
 assert.equal(publicationBlocked(projects[2]),true);assert.match(skipReason(projects[4]),/فيديو/);
});
test('queue rolls over midnight and rejects past or invalid start',()=>{const slots=planDay([p('a'),p('b')],'2026-11-08','2026-11-08T23:00:00Z',0);assert.equal(slots[1].at,'2026-11-09T02:00:00.000Z');assert.throws(()=>planDay([],'2026-11-08','bad'));assert.throws(()=>planDay([],'2026-11-08','2020-01-01'));});
test('submission never pretends a future scheduled time is an actual publication date',()=>{const saved=recordResponse(p('a'),{results:{post:{_id:'ghl1',status:'scheduled'}}},'scheduled','2026-11-08T20:00:00Z',['ig']);assert.equal(saved.stage,'scheduled');assert.equal(saved.publishMeta.publishedAt,undefined);assert.equal(saved.publishMeta.scheduledAt,'2026-11-08T20:00:00Z');assert.deepEqual(saved.publishMeta.postIds,['ghl1']);assert.equal(publicationBlocked(saved),true);});
test('pending immediate post remains blocked and only confirmed publication carries its actual date',()=>{const pending=recordResponse(p('a'),{results:{post:{_id:'ghl2',status:'pending'}}},'published',undefined,['ig']);assert.equal(pending.stage,'scheduled');assert.equal(pending.publishMeta.publishedAt,undefined);const done=recordResponse(pending,{results:{post:{_id:'ghl2',status:'published',publishedAt:'2026-11-08T15:20:00Z'}}},'published',undefined,['ig']);assert.equal(done.stage,'published');assert.equal(done.publishMeta.publishedAt,'2026-11-08T15:20:00.000Z');});
test('missing or malformed historical timestamps are not invented',()=>{assert.equal(formatTime('true'),'التاريخ والوقت غير مسجلين');const done=recordResponse(p('a'),{results:{post:{status:'published'}}},'published',undefined,[]);assert.equal(done.stage,'published');assert.equal(done.publishMeta.publishedAt,undefined);});
