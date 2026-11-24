#!/usr/bin/env node
// The Epistemic Diary — Studio (D7): a local authoring dashboard.
// Runs on the owner's machine only: listens on 127.0.0.1, reads and writes Markdown in this
// repository, previews with the real Hugo server, publishes with git. No login, no hosting,
// no secrets in the repository.
//
//   node tools/studio/server.mjs            → http://127.0.0.1:4318
//   STUDIO_PORT=4400 HUGO_PORT=1414 node tools/studio/server.mjs
//
// Writes are limited to content/**.md and data/*.yaml inside the repository.
import http from 'node:http';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import path from 'node:path';
import { spawn, execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const PORT = Number(process.env.STUDIO_PORT || 4318);
const HUGO_PORT = Number(process.env.HUGO_PORT || 1414);
const HOST = '127.0.0.1';
const PUBLIC = path.join(HERE, 'public');
const MAIN_SECTIONS = ['kinh-te', 'toan-hoc', 'khoa-hoc-may-tinh', 'triet-hoc'];

// ---------- helpers ----------------------------------------------------------------------
const inside = (base, p) => { const r = path.resolve(base, p); return r === base || r.startsWith(base + path.sep) ? r : null; };
function writable(rel) {
  const abs = inside(ROOT, rel);
  if (!abs) return null;
  const r = path.relative(ROOT, abs).split(path.sep).join('/');
  if (/^content\/.+\.md$/.test(r) || /^data\/[^/]+\.ya?ml$/.test(r)) return abs;
  return null;
}
function run(cmd, args, opts = {}) {
  return new Promise(resolve => execFile(cmd, args, { cwd: ROOT, maxBuffer: 8 << 20, ...opts }, (err, stdout, stderr) =>
    resolve({ ok: !err, code: err ? err.code : 0, stdout: String(stdout), stderr: String(stderr) })));
}
function frontMatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  const fm = {}; if (!m) return { fm, body: text, raw: '' };
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line); if (!kv) continue;
    let v = kv[2].trim();
    if (/^\[.*\]$/.test(v)) v = v.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    else v = v.replace(/^["']|["']$/g, '');
    if (v === 'true') v = true; else if (v === 'false') v = false;
    fm[kv[1]] = v;
  }
  return { fm, body: text.slice(m[0].length), raw: m[1] };
}
function permalink(rel) {
  // content/<section>/<slug>[.en].md → /[en/]<section>/<slug>/
  const m = /^content\/(.+?)\/([^/]+?)(\.(en|ja|zh-cn))?\.md$/.exec(rel);
  if (!m) return null;
  const lang = m[4]; const slug = m[2] === 'index' ? '' : m[2] + '/';
  return `${lang ? '/' + lang : ''}/${m[1]}/${slug}`.replace(/\/+/g, '/');
}
async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p)); else if (e.name.endsWith('.md') && !e.name.startsWith('_index')) out.push(p);
  }
  return out;
}
async function listContent() {
  const files = await walk(path.join(ROOT, 'content'));
  const series = await seriesIndex();
  const rows = [];
  for (const abs of files) {
    const rel = path.relative(ROOT, abs).split(path.sep).join('/');
    const section = rel.split('/')[1];
    const kind = MAIN_SECTIONS.includes(section) ? 'essay' : section;
    const { fm, body } = frontMatter(await fs.readFile(abs, 'utf8'));
    const lang = (/\.(en|ja|zh-cn)\.md$/.exec(rel) || [, 'vi'])[1];
    const base = rel.replace(/\.(en|ja|zh-cn)\.md$/, '.md').replace(/^content/, '').replace(/\.md$/, '');
    rows.push({
      path: rel, kind, section, lang, title: fm.title || rel, date: fm.date || '', draft: fm.draft === true,
      categories: [].concat(fm.categories || []), words: (body.match(/\S+/g) || []).length,
      series: series[base] || null, url: permalink(rel),
      ignored: (await run('git', ['check-ignore', '-q', rel])).ok,
    });
  }
  return rows.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
async function seriesIndex() {
  const out = {}; const dir = path.join(ROOT, 'content', 'series');
  if (!fss.existsSync(dir)) return out;
  for (const f of await fs.readdir(dir)) {
    if (!f.endsWith('.md') || f.startsWith('_index') || /\.(en|ja|zh-cn)\.md$/.test(f)) continue;
    const t = await fs.readFile(path.join(dir, f), 'utf8');
    const title = (frontMatter(t).fm.title) || f;
    const essays = [...t.matchAll(/^\s+-\s+(\/\S+)/gm)].map(m => m[1]);
    essays.forEach((e, i) => { out[e] = { title, part: i + 1, of: essays.length }; });
  }
  return out;
}
async function bibliography() {
  const t = await fs.readFile(path.join(ROOT, 'data', 'bibliography.yaml'), 'utf8');
  const out = []; let cur = null;
  for (const line of t.split('\n')) {
    const k = /^([a-z0-9]+):\s*$/.exec(line); if (k) { cur = { key: k[1] }; out.push(cur); continue; }
    const f = /^\s{2}(authors|year|title|type):\s*(.*)$/.exec(line);
    if (cur && f) cur[f[1]] = f[2].replace(/^\[|\]$/g, '').replace(/"/g, '');
  }
  return out;
}
async function stats() {
  // GoatCounter API (owner's account). Off until both the endpoint (params.toml) and a token
  // (environment only, never in the repository) exist.
  const params = await fs.readFile(path.join(ROOT, 'config', '_default', 'params.toml'), 'utf8');
  const endpoint = (/^goatcounter\s*=\s*"([^"]*)"/m.exec(params) || [])[1] || '';
  const token = process.env.GOATCOUNTER_TOKEN || '';
  if (!endpoint || !token) return { enabled: false, endpoint: !!endpoint, token: !!token };
  const site = endpoint.replace(/\/count$/, '');
  const get = async p => (await fetch(`${site}/api/v0${p}`, { headers: { Authorization: `Bearer ${token}` } })).json();
  const [total, hits, refs] = await Promise.all([get('/stats/total'), get('/stats/hits?limit=10'), get('/stats/toprefs?limit=8')]);
  return { enabled: true, total, hits, refs };
}

// ---------- Hugo preview -------------------------------------------------------------------
let hugo = null; let hugoLog = '';
// Content files git ignores (the owner's private local drafts) never reach the site, so the
// preview and the pre-publish build leave them out too; one broken local draft cannot stop either.
async function ignoredContentEnv() {
  const r = await run('git', ['ls-files', '--others', '--ignored', '--exclude-standard', '--', 'content']);
  const names = r.stdout.split('\n').filter(f => f.endsWith('.md')).map(f => path.basename(f).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return names.length ? { ...process.env, HUGO_IGNOREFILES: '(' + names.join('|') + ')$' } : process.env;
}
async function startHugo() {
  if (hugo) return;
  hugo = spawn('hugo', ['server', '-D', '--bind', HOST, '--port', String(HUGO_PORT), '--disableFastRender', '--navigateToChanged=false',
    '--baseURL', `http://${HOST}:${HUGO_PORT}/`, '--appendPort=false'], { cwd: ROOT, env: await ignoredContentEnv() });
  const log = d => { hugoLog = (hugoLog + d).slice(-6000); };
  hugo.stdout.on('data', log); hugo.stderr.on('data', log);
  hugo.on('exit', () => { hugo = null; });
}

// ---------- HTTP -----------------------------------------------------------------------------
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const send = (res, code, body, type = 'application/json; charset=utf-8') => { res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body)); };
const readBody = req => new Promise((ok, bad) => { let b = ''; req.on('data', c => { b += c; if (b.length > 4 << 20) { bad(new Error('too large')); req.destroy(); } }); req.on('end', () => ok(b)); });

const server = http.createServer(async (req, res) => {
  try {
    // Same-origin only: refuse requests carrying another site's Origin (CSRF from the browser).
    // Host check stops DNS-rebinding pages from reaching the API through another hostname.
    if (req.headers.host !== `${HOST}:${PORT}`) return send(res, 421, { error: 'host' });
    const origin = req.headers.origin;
    if (origin && origin !== `http://${HOST}:${PORT}`) return send(res, 403, { error: 'origin' });
    const url = new URL(req.url, `http://${HOST}:${PORT}`);
    const api = url.pathname;
    if (api === '/api/content' && req.method === 'GET') return send(res, 200, await listContent());
    if (api === '/api/file' && req.method === 'GET') {
      const abs = writable(url.searchParams.get('path') || ''); if (!abs) return send(res, 400, { error: 'path' });
      return send(res, 200, { path: url.searchParams.get('path'), text: await fs.readFile(abs, 'utf8'), url: permalink(url.searchParams.get('path')) });
    }
    if (api === '/api/file' && req.method === 'PUT') {
      const { path: rel, text } = JSON.parse(await readBody(req)); const abs = writable(rel || '');
      if (!abs || typeof text !== 'string') return send(res, 400, { error: 'path' });
      if (!/^---\n[\s\S]*?\n---/.test(text)) return send(res, 400, { error: 'front matter missing' });
      await fs.writeFile(abs, text, 'utf8'); return send(res, 200, { saved: rel, at: new Date().toISOString() });
    }
    if (api === '/api/new' && req.method === 'POST') {
      const { section, slug, lang } = JSON.parse(await readBody(req));
      if (!MAIN_SECTIONS.includes(section) || !/^[a-z0-9][a-z0-9-]{1,80}$/.test(slug || '')) return send(res, 400, { error: 'section or slug' });
      const rel = `content/${section}/${slug}${lang === 'en' ? '.en' : ''}.md`;
      if (fss.existsSync(path.join(ROOT, rel))) return send(res, 409, { error: 'exists' });
      const r = await run('hugo', ['new', 'content', rel.replace(/^content\//, '')]);
      if (!r.ok) return send(res, 500, { error: r.stderr.slice(0, 400) });
      let t = await fs.readFile(path.join(ROOT, rel), 'utf8');
      if (!/^draft:/m.test(t)) t = t.replace(/^---\n/, '---\ndraft: true\n');
      t = t.replace(/^---\n/, `---\ncategories: ["${section}"]\n`);
      await fs.writeFile(path.join(ROOT, rel), t);
      return send(res, 201, { path: rel });
    }
    if (api === '/api/bibliography') return send(res, 200, await bibliography());
    if (api === '/api/stats') return send(res, 200, await stats().catch(e => ({ enabled: false, error: String(e) })));
    if (api === '/api/status') {
      const st = await run('git', ['status', '--porcelain', '--', 'content', 'data']);
      return send(res, 200, { hugo: !!hugo, hugoPort: HUGO_PORT, log: hugoLog.slice(-1200), changes: st.stdout.split('\n').filter(Boolean) });
    }
    if (api === '/api/publish' && req.method === 'POST') {
      // Commit only content/ and data/ changes, then push. The client asks for confirmation first.
      const { message, dryRun } = JSON.parse(await readBody(req));
      const st = await run('git', ['status', '--porcelain', '--', 'content', 'data']);
      const changes = st.stdout.split('\n').filter(Boolean);
      if (!changes.length) return send(res, 200, { nothing: true });
      const check = await run('hugo', ['--gc', '--minify', '--destination', path.join(process.env.TMPDIR || '/tmp', 'studio-check')], { env: await ignoredContentEnv() });
      if (!check.ok) return send(res, 422, { error: 'build failed', detail: check.stderr.slice(-1200) });
      if (dryRun) return send(res, 200, { dryRun: true, changes, build: 'ok' });
      const add = await run('git', ['add', '--', 'content', 'data']);
      const commit = await run('git', ['commit', '-m', String(message || 'Studio: update content').slice(0, 200)]);
      if (!commit.ok) return send(res, 500, { error: commit.stderr || commit.stdout });
      const push = await run('git', ['push']);
      return send(res, push.ok ? 200 : 500, { committed: true, pushed: push.ok, detail: (push.stderr || '').slice(-600) });
    }
    // the site's own fonts, so the Studio reads like the publication
    if (api.startsWith('/fonts/')) {
      const f = inside(path.join(ROOT, 'assets', 'editorial-fonts'), decodeURIComponent(api.slice(7)));
      if (f && f.endsWith('.woff2') && fss.existsSync(f)) return send(res, 200, await fs.readFile(f), 'font/woff2');
      return send(res, 404, { error: 'font' });
    }
    // static UI
    const file = inside(PUBLIC, url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
    if (file && fss.existsSync(file) && fss.statSync(file).isFile()) return send(res, 200, await fs.readFile(file), TYPES[path.extname(file)] || 'application/octet-stream');
    send(res, 404, { error: 'not found' });
  } catch (e) { send(res, 500, { error: String(e.message || e) }); }
});

if (process.env.STUDIO_NO_HUGO !== '1') startHugo();
server.listen(PORT, HOST, () => console.log(`Studio: http://${HOST}:${PORT}  (preview: http://${HOST}:${HUGO_PORT})`));
process.on('SIGINT', () => { if (hugo) hugo.kill(); process.exit(0); });
process.on('SIGTERM', () => { if (hugo) hugo.kill(); process.exit(0); });
