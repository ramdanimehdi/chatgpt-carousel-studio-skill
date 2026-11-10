import assert from 'node:assert/strict';
import test, { afterEach } from 'node:test';
import { database, all } from '../components/content/storage.ts';

const previous = Object.getOwnPropertyDescriptor(globalThis, 'indexedDB');
afterEach(() => { if (previous) Object.defineProperty(globalThis, 'indexedDB', previous); else delete globalThis.indexedDB; });
function useDatabase(version, stores) {
 const opens = [], created = [];
 const names = new Set(stores);
 const db = { version, close() {}, objectStoreNames: { contains: name => names.has(name) }, createObjectStore(name) { created.push(name); names.add(name); } };
 Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: { open(name, requestedVersion) {
  opens.push(requestedVersion);
  const request = { result: db };
  queueMicrotask(() => {
   if (requestedVersion !== undefined) { db.version = requestedVersion; request.onupgradeneeded?.(); }
   request.onsuccess?.();
  });
  return request;
 } } });
 return { db, opens, created };
}
test('existing higher database version opens without requesting version 1', async () => {
 const fixture = useDatabase(3, ['projects', 'assets', 'meta']);
 assert.equal(await database(), fixture.db);
 assert.deepEqual(fixture.opens, [undefined]);
 assert.deepEqual(fixture.created, []);
});
test('missing stores are added without deleting an existing projects store', async () => {
 const fixture = useDatabase(2, ['projects']);
 await database();
 assert.deepEqual(fixture.opens, [undefined, 3]);
 assert.deepEqual(fixture.created, ['assets', 'meta']);
});
test('an aborted local read rejects promptly rather than hanging startup', { timeout: 1000 }, async () => {
 const fixture = useDatabase(1, ['projects', 'assets', 'meta']);
 fixture.db.transaction = () => {
  const tx = { error: new Error('Read aborted'), objectStore: () => ({ getAll: () => ({ result: [] }) }) };
  queueMicrotask(() => tx.onabort?.());
  return tx;
 };
 await assert.rejects(all('projects'), /Read aborted/);
});
