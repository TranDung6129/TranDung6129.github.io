"""Isolated parser/route regression fixture; no application/source mutation."""
import json
import pathlib
import subprocess
import sys
import tempfile
import unittest
ANALYZER=pathlib.Path(__file__).with_name('analyze.py')
class AnalyzerFixture(unittest.TestCase):
 def test_paths_fragments_aliases_and_route_failure(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=pathlib.Path(tmp)/'public'; out=pathlib.Path(tmp)/'report'; root.mkdir()
   content={
    'index.html':'<html lang="vi"><title>Fixture</title><a href="/%C3%A9/#valid">x</a><a href="https://trandung6129.github.io/é/#named">y</a><a href="/é/#missing">z</a><a href="./asset.md">md</a><video poster="/missing.png"></video><a href="https://example.com/external">external</a></html>',
    'é/index.html':'<html><title>Target</title><h1 id="valid">Target</h1><a name="named"></a></html>',
    'alias/index.html':'<html><meta http-equiv="refresh" content="0;url=/"></html>',
    'asset.md':'# Markdown output',
    'index.xml':'<rss><channel><item><title>Fixture</title></item></channel></rss>',
    'sitemap.xml':'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>',
    'search.json':'[]','en/search.json':'[]','ja/search.json':'[]','zh-cn/search.json':'[]',
   }
   for p,text in content.items():
    path=root/p;path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text)
   run=subprocess.run([sys.executable,str(ANALYZER),str(root),str(out)],capture_output=True,text=True)
   self.assertEqual(run.returncode,0,run.stderr)
   report=json.loads((out/'summary.json').read_text())
   self.assertEqual(report['links']['missing_target_occurrences'],1)
   self.assertEqual(report['links']['missing_fragment_occurrences'],1)
   self.assertEqual(report['links']['external_unique_unchecked'],1)
   self.assertEqual(report['alias_html'],1)
   self.assertEqual(report['xml']['rss_item_occurrences'],1)
   refs=json.loads((out/'missing-targets.json').read_text())
   self.assertEqual(refs[0]['target'],'missing.png')
   prior=pathlib.Path(tmp)/'prior.txt';prior.write_text((out/'routes.txt').read_text()+'/disappeared/\n')
   run=subprocess.run([sys.executable,str(ANALYZER),str(root),str(out),str(prior)],capture_output=True,text=True)
   self.assertNotEqual(run.returncode,0)
   self.assertEqual(json.loads((out/'summary.json').read_text())['route_diff']['removed'],['/disappeared/'])
if __name__=='__main__': unittest.main()
