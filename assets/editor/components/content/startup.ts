import type { Asset, Project } from './types';

type DailyPack = { schema: string; packId: string; title: string; projects: Project[]; assetReplacements: Record<string, string> };
type StartupDependencies = {
 readProjects: () => Promise<unknown[]>;
 readAssets: () => Promise<Asset[]>;
 write: (table: string, value: Project | Asset) => Promise<void>;
 fetchPack: () => Promise<unknown>;
 fallbackPack: unknown;
 hydrate: (value: unknown) => Project | null;
 initialAssets: Asset[];
};

function parsePack(value: unknown, hydrate: StartupDependencies['hydrate']): DailyPack | null {
 if (!value || typeof value !== 'object') return null;
 const raw = value as Record<string, unknown>;
 if (raw.schema !== 'cfs-daily-pack-v1' || typeof raw.packId !== 'string' || !Array.isArray(raw.projects)) return null;
 const replacements: Record<string, string> = {};
 if (raw.assetReplacements && typeof raw.assetReplacements === 'object') {
  for (const [from, to] of Object.entries(raw.assetReplacements)) {
   if (typeof to === 'string' && from.startsWith('/generated/') && to.startsWith('/generated/')) replacements[from] = to;
  }
 }
 return { schema: raw.schema, packId: raw.packId, title: typeof raw.title === 'string' ? raw.title : 'المحتوى المتاح', projects: raw.projects.map(hydrate).filter((p): p is Project => !!p), assetReplacements: replacements };
}

export async function loadDashboard(deps: StartupDependencies) {
 const warnings = new Set<'projects' | 'assets' | 'save' | 'update'>();
 // A failed read must never lead to writing over records we could not inspect.
 let canWriteProjects = true;
 let canWriteAssets = true;
 const [storedProjects, storedAssets] = await Promise.all([
  deps.readProjects().catch(() => { canWriteProjects = false; warnings.add('projects'); return []; }),
  deps.readAssets().catch(() => { canWriteAssets = false; warnings.add('assets'); return []; }),
 ]);
 let projects = storedProjects.map(deps.hydrate).filter((p): p is Project => !!p);
 const assets = storedAssets.length ? storedAssets : deps.initialAssets;
 const save = async (table: 'projects' | 'assets', value: Project | Asset) => {
  if (table === 'projects' ? !canWriteProjects : !canWriteAssets) return;
  try { await deps.write(table, value); }
  catch { warnings.add('save'); if (table === 'projects') canWriteProjects = false; else canWriteAssets = false; }
 };
 if (!storedAssets.length) for (const asset of assets) await save('assets', asset);

 let pack: DailyPack | null = null;
 try { pack = parsePack(await deps.fetchPack(), deps.hydrate); if (!pack) warnings.add('update'); }
 catch { warnings.add('update'); }
 // Keep the shipped carousel available even offline or if the JSON request
 // returns a login/error page. Existing local edits always take precedence.
 pack ??= parsePack(deps.fallbackPack, deps.hydrate);
 if (pack) {
  const ids = new Set(projects.map(project => project.id));
  const incoming = pack.projects.filter(project => !ids.has(project.id));
  for (const project of incoming) await save('projects', project);
  projects = [...incoming, ...projects];
  for (let i = 0; i < projects.length; i++) {
   const project = projects[i];
   const slides = project.slides.map(slide => {
    const replacement = slide.finalImage && Object.hasOwn(pack.assetReplacements, slide.finalImage) && pack.assetReplacements[slide.finalImage];
    return replacement ? { ...slide, finalImage: replacement } : slide;
   });
   if (slides.some((slide, index) => slide !== project.slides[index])) {
    const updated = { ...project, slides };
    projects[i] = updated;
    await save('projects', updated);
   }
  }
 }
 return {
  projects, assets,
  packInfo: pack ? { packId: pack.packId, title: pack.title, count: pack.projects.filter(project => project.dailyPackId === pack.packId).length, ideaCount: 0 } : null,
  warnings: [...warnings],
 };
}
