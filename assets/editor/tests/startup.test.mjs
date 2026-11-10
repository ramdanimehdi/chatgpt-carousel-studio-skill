import assert from 'node:assert/strict';
import test from 'node:test';
import { loadDashboard } from '../components/content/startup.ts';
import { hydrateProject } from '../components/content/types.ts';

const pack = {
 schema: 'cfs-daily-pack-v1', packId: 'current', title: 'المحتوى',
 projects: [{ id: 'carousel', name: 'الكاروسيل', kind: 'carousel', dailyPackId: 'current', slides: [{ id: 7, title: 'النص المصحّح', finalImage: '/generated/fixed.png' }] }],
 assetReplacements: { '/generated/old.png': '/generated/fixed.png' },
};
const initialAssets = [{ id: 'photo', name: 'الصورة', src: '/photos/mehdi.png', category: 'صور', focusX: 50, focusY: 30 }];
function setup(overrides = {}) {
 const writes = [];
 return {
  writes,
  deps: {
   readProjects: async () => [], readAssets: async () => initialAssets,
   write: async (table, value) => { writes.push({ table, value }); },
   fetchPack: async () => pack, fallbackPack: pack, hydrate: hydrateProject,
   initialAssets, ...overrides,
  },
 };
}

test('legacy reel without slides no longer prevents opening every project', async () => {
 const legacy = { id: 'legacy', name: 'ريلز محفوظ', kind: 'reel', script: 'السكريبت الأصلي', caption: 'كابشن المستخدم', extraMetadata: { keep: true } };
 const { deps, writes } = setup({ readProjects: async () => [legacy] });
 const result = await loadDashboard(deps);
 const reel = result.projects.find(p => p.id === 'legacy');
 assert.equal(reel.script, legacy.script);
 assert.equal(reel.caption, legacy.caption);
 assert.deepEqual(reel.slides, []);
 assert.deepEqual(reel.extraMetadata, legacy.extraMetadata);
 assert.equal(result.projects.length, 2);
 assert.equal(writes.some(item => item.value.id === 'legacy'), false);
 assert.equal('slides' in legacy, false);
});

test('artwork update preserves edited text, ordering, caption and publication state', async () => {
 const existing = { ...pack.projects[0], stage: 'published', caption: 'كابشن معدل', publishMeta: { publishedAt: '2026-10-24T08:00:00Z' }, slides: [{ id: 9, title: 'شريحة مضافة', finalImage: '/generated/custom.png' }, { id: 7, title: 'عنوان المستخدم', finalImage: '/generated/old.png', useFinalImage: false }] };
 const { deps } = setup({ readProjects: async () => [existing] });
 const { projects } = await loadDashboard(deps);
 assert.equal(projects.length, 1);
 assert.equal(projects[0].caption, existing.caption);
 assert.deepEqual(projects[0].publishMeta, existing.publishMeta);
 assert.equal(projects[0].stage, 'published');
 assert.deepEqual(projects[0].slides.map(s => s.id), [9, 7]);
 assert.equal(projects[0].slides[0].finalImage, '/generated/custom.png');
 assert.equal(projects[0].slides[1].title, 'عنوان المستخدم');
 assert.equal(projects[0].slides[1].useFinalImage, false);
 assert.equal(projects[0].slides[1].finalImage, '/generated/fixed.png');
 assert.equal(existing.slides[1].finalImage, '/generated/old.png');
});

test('invalid update JSON does not hide existing projects or bundled carousel', async () => {
 const { deps } = setup({ readProjects: async () => [{ id: 'saved', name: 'مشروعي', kind: 'story' }], fetchPack: async () => ({ projects: null }) });
 const result = await loadDashboard(deps);
 assert.deepEqual(result.projects.map(p => p.id), ['carousel', 'saved']);
 assert.deepEqual(result.warnings, ['update']);
});

test('network failure opens bundled content and retains local edits', async () => {
 const { deps } = setup({ readProjects: async () => [{ ...pack.projects[0], caption: 'محفوظ' }], fetchPack: async () => { throw new TypeError('Network failure'); } });
 const result = await loadDashboard(deps);
 assert.equal(result.projects[0].caption, 'محفوظ');
 assert.equal(result.packInfo.count, 1);
 assert.deepEqual(result.warnings, ['update']);
});

test('denied local storage still opens content and never writes over unread records', async () => {
 const { deps, writes } = setup({ readProjects: async () => { throw new Error('SecurityError'); }, readAssets: async () => { throw new Error('SecurityError'); } });
 const result = await loadDashboard(deps);
 assert.equal(result.projects[0].id, 'carousel');
 assert.equal(result.assets[0].id, 'photo');
 assert.deepEqual(writes, []);
 assert.ok(result.warnings.includes('projects'));
});

test('failed save does not suppress a corrected image already loaded in memory', async () => {
 const { deps } = setup({ readProjects: async () => [{ ...pack.projects[0], slides: [{ id: 7, finalImage: '/generated/old.png' }] }], write: async () => { throw new Error('QuotaExceededError'); } });
 const result = await loadDashboard(deps);
 assert.equal(result.projects[0].slides[0].finalImage, '/generated/fixed.png');
 assert.ok(result.warnings.includes('save'));
});

test('incomplete saved fields and null slides get safe defaults without mutating records', () => {
 const raw = { id: 'old', name: 'قديم', kind: 'carousel', idea: null, slides: [null, { id: 2, title: null, body: null }], versions: null };
 const p = hydrateProject(raw);
 assert.equal(p.slides.length, 2);
 assert.equal(p.slides[1].title, '');
 assert.equal(typeof p.idea.hook, 'string');
 assert.deepEqual(p.versions, []);
 assert.equal(raw.slides[0], null);
});
