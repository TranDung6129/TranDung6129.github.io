"""P1-02 offline Hugo output baseline. No network or application mutation.
Run: python3 analyze.py PUBLIC_DIR OUTPUT_DIR [PRIOR_ROUTES]
URL checks cover HTML href/src/poster/data-src, not CSS url() or JS requests.
"""
import collections, hashlib, json, pathlib, posixpath, struct, sys
import urllib.parse as url
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
root,out=map(pathlib.Path,sys.argv[1:3]); out.mkdir(parents=True,exist_ok=True)
files={p.relative_to(root).as_posix():p for p in root.rglob('*') if p.is_file()}
def dump(name,data): (out/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def route(p): return '/'+(p[:-10] if p.endswith('index.html') else p)
routes=sorted(route(p) for p in files)
(out/'routes.txt').write_text('\n'.join(routes)+'\n')
class Page(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True); self.lang=None; self.title=[]; self.in_title=False; self.headings=[]; self.heading=None; self.ids=set(); self.refs=[]; self.images=[]; self.canonical=[]; self.description=[]; self.noindex=False; self.alternates=[]; self.features=collections.Counter(); self.refresh=False
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='html': self.lang=a.get('lang')
  if t=='title': self.in_title=True
  if t in ['h1','h2','h3','h4','h5','h6']: self.heading={'level':int(t[1]),'id':a.get('id'),'text':''}; self.headings.append(self.heading)
  if a.get('id'): self.ids.add(a['id'])
  if t=='a' and a.get('name'): self.ids.add(a['name'])
  if t=='meta':
   if a.get('name')=='description': self.description.append(a.get('content',''))
   if a.get('name')=='robots' and 'noindex' in a.get('content',''): self.noindex=True
   if a.get('http-equiv','').lower()=='refresh': self.refresh=True
  if t=='link' and a.get('rel')=='canonical': self.canonical.append(a.get('href'))
  if t=='link' and a.get('hreflang'): self.alternates.append({'lang':a.get('hreflang'),'href':a.get('href')})
  for k in ['href','src','poster','data-src']:
   if a.get(k): self.refs.append((t,k,a[k]))
  if t=='img': self.images.append({k:a.get(k) for k in ['src','data-src','alt','width','height']})
  if t=='code': self.features['code_elements']+=1
  if 'highlight' in a.get('class','').split(): self.features['highlight_blocks']+=1
  if a.get('id')=='toc-static': self.features['toc_static']+=1
  if t=='script' and 'mathjax' in a.get('src','').lower(): self.features['mathjax_script']+=1
  if a.get('id','').startswith('react-root-'): self.features['react_mount']+=1
 def handle_endtag(self,t):
  if t=='title': self.in_title=False
  if t in ['h1','h2','h3','h4','h5','h6']: self.heading=None
 def handle_data(self,d):
  if self.in_title: self.title.append(d)
  if self.heading is not None: self.heading['text']+=d
pages={}
for path in sorted(files):
 if path.endswith('.html'):
  p=Page(); p.feed(files[path].read_text()); pages[path]=p
metadata=[]
for path,p in pages.items():
 metadata.append({'path':route(path),'alias_refresh':p.refresh,'lang':p.lang,'title':''.join(p.title),'canonical':p.canonical,'description':p.description,'noindex':p.noindex,'headings':p.headings,'images':p.images,'alternates':p.alternates,'features':dict(p.features)})
dump('html-metadata.json',metadata)
missing=[]; fragments=[]; external=set(); tested=0; skipped=0
for path,p in pages.items():
 for tag,attr,value in p.refs:
  absolute=url.urljoin('https://trandung6129.github.io'+route(path),value)
  parts=url.urlsplit(absolute)
  if parts.scheme not in ('https','http'): skipped+=1; continue
  if parts.hostname not in ['trandung6129.github.io','www.trandung6129.github.io']:
   external.add(absolute); continue
  tested+=1
  target=posixpath.normpath(url.unquote(parts.path)).lstrip('/')
  if not target or parts.path.endswith('/'): target=(target+'/' if target else '')+'index.html'
  elif target not in files and target+'/index.html' in files: target+='/index.html'
  item={'source':route(path),'element':tag,'attribute':attr,'url':value,'target':target}
  if target not in files: missing.append(item)
  elif parts.fragment and target in pages and url.unquote(parts.fragment) not in pages[target].ids:
   item['fragment']=url.unquote(parts.fragment); fragments.append(item)
dump('missing-targets.json',missing); dump('missing-fragments.json',fragments)
(out/'external-urls-unchecked.txt').write_text('\n'.join(sorted(external))+'\n')
xmls=[]; rss=0; rssitems=0; sitemap=0
for path in sorted(files):
 if path.endswith('.xml'):
  try:
   tree=ET.parse(files[path]); tag=tree.getroot().tag.split('}')[-1]; xmls.append({'path':path,'valid':True,'root':tag})
   if tag=='rss': rss+=1; rssitems+=len(tree.findall('.//item'))
   if tag in ['urlset','sitemapindex']: sitemap+=1
  except ET.ParseError as e: xmls.append({'path':path,'valid':False,'error':str(e)})
dump('xml-validation.json',xmls)
search=[]
for path in sorted(files):
 if path.endswith('search.json'):
  data=json.loads(files[path].read_text()); search.append({'path':path,'entries':len(data),'list':isinstance(data,list),'entries_with_title':sum(bool(x.get('title')) for x in data),'entries_with_uri':sum(bool(x.get('uri')) for x in data),'keys':sorted(data[0]) if data else []})
dump('search-indexes.json',search)
images=[]
for path in sorted(files):
 if pathlib.Path(path).suffix in ['.png','.jpg','.jpeg','.gif','.svg','.ico']:
  data=files[path].read_bytes(); dimensions=None
  if data.startswith(b'\x89PNG\r\n\x1a\n'): dimensions=list(struct.unpack('>II',data[16:24]))
  if data[:3]==b'GIF': dimensions=list(struct.unpack('<HH',data[6:10]))
  images.append({'path':path,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'dimensions_png_gif':dimensions})
dump('image-files.json',images)
prior=set(pathlib.Path(sys.argv[3]).read_text().splitlines()) if len(sys.argv)>3 else set(routes)
nonaliases=[x for x in metadata if not x['alias_refresh']]
titlegroups=collections.defaultdict(list)
for x in nonaliases: titlegroups[x['title']].append(x['path'])
summary={'emitted_files':len(files),'html_files':len(pages),'non_alias_html':len(nonaliases),'alias_html':len(metadata)-len(nonaliases),'html_language_counts':dict(collections.Counter(p.lang for p in pages.values())),'non_alias_language_counts':dict(collections.Counter(x['lang'] for x in nonaliases)),'route_diff':{'removed':sorted(prior-set(routes)),'added':sorted(set(routes)-prior)},'links':{'internal_references_checked':tested,'missing_target_occurrences':len(missing),'unique_missing_targets':sorted(set(x['target'] for x in missing)),'missing_fragment_occurrences':len(fragments),'external_unique_unchecked':len(external),'non_http_skipped':skipped,'scope':'HTML href/src/poster/data-src only; includes canonical/hreflang/CDN same-host links. No CSS/JS or external network/fragment semantics for non-HTML.'},'metadata':{'without_title':sum(not x['title'] for x in nonaliases),'without_canonical':sum(not x['canonical'] for x in nonaliases),'without_description':sum(not any(x['description']) for x in nonaliases),'noindex_pages':[x['path'] for x in nonaliases if x['noindex']],'duplicate_title_groups':{k:v for k,v in titlegroups.items() if len(v)>1},'images_without_alt_attribute':sum(i['alt'] is None for x in nonaliases for i in x['images']),'images_empty_alt':sum(i['alt']=='' for x in nonaliases for i in x['images'])},'features':dict(sum((p.features for p in pages.values()),collections.Counter())),'xml':{'files':len(xmls),'invalid':sum(not x['valid'] for x in xmls),'rss_files':rss,'rss_item_occurrences':rssitems,'sitemap_files':sitemap},'search':search,'image_files':len(images),'robots':{'present':'robots.txt' in files,'bytes':files['robots.txt'].stat().st_size if 'robots.txt' in files else 0}}
summary['links']['missing_by_literal_url']=dict(collections.Counter(x['url'] for x in missing))
summary['links']['unique_missing_target_count']=len(summary['links']['unique_missing_targets'])
canonical=collections.defaultdict(list)
for item in nonaliases:
 for value in item['canonical']: canonical[value].append(item['path'])
summary['metadata']['duplicate_canonical_groups']={k:v for k,v in canonical.items() if len(v)>1}
if len(sys.argv)>4:
 import csv
 with pathlib.Path(sys.argv[4]).open() as handle:
  source_rows=list(csv.DictReader(handle))
 summary['source_markdown_counts']=dict(collections.Counter('en' if item['path'].endswith('.en.md') else 'vi' for item in source_rows))
dump('summary.json',summary)
assert files and not summary['route_diff']['removed'] and not summary['route_diff']['added']
assert not summary['xml']['invalid'] and rss>0 and sitemap>0
assert len(search)==4 and all(x['list'] for x in search)
print(json.dumps(summary,ensure_ascii=False,indent=2))
