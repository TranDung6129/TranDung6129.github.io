# D-017 URL map — content-language separation (2026-11-23)

Every public HTML URL that existed on `main` before this change still answers: either the page itself, or a redirect to the same content in the language that has it. This was checked by diffing the full route list of a `main` build against this branch (0 HTML routes lost).

## Essays (front-matter `aliases`)

| Old URL | Now redirects to | Why |
|---|---|---|
| `/en/khoa-hoc-may-tinh/complexity-theory-quantum/` | `/khoa-hoc-may-tinh/complexity-theory-quantum/` | English copy was Vietnamese text; removed. Redirects to the Vietnamese original. |
| `/en/kinh-te/co-gian-cung-cau-cong-thuc/` | `/kinh-te/co-gian-cung-cau-cong-thuc/` | English copy was Vietnamese text; removed. Redirects to the Vietnamese original. |
| `/en/kinh-te/doanh-thu-co-gian-dinh-thuc/` | `/kinh-te/doanh-thu-co-gian-dinh-thuc/` | English copy was Vietnamese text; removed. Redirects to the Vietnamese original. |
| `/en/kinh-te/ly-thuyet-tro-choi-nash/` | `/kinh-te/ly-thuyet-tro-choi-nash/` | English copy was Vietnamese text; removed. Redirects to the Vietnamese original. |
| `/en/kinh-te/toan-co-ban-2/` | `/kinh-te/toan-co-ban-2/` | English copy was Vietnamese text; removed. Redirects to the Vietnamese original. |
| `/en/kinh-te/toan-co-ban-3/` | `/kinh-te/toan-co-ban-3/` | English copy was Vietnamese text; removed. Redirects to the Vietnamese original. |
| `/en/kinh-te/toan-co-ban-4/` | `/kinh-te/toan-co-ban-4/` | English copy was Vietnamese text; removed. Redirects to the Vietnamese original. |
| `/en/kinh-te/toan-co-ban-5/` | `/kinh-te/toan-co-ban-5/` | English copy was Vietnamese text; removed. Redirects to the Vietnamese original. |
| `/en/toan-hoc/riemann-hypothesis-number-theory/` | `/toan-hoc/riemann-hypothesis-number-theory/` | English copy was Vietnamese text; removed. Redirects to the Vietnamese original. |
| `/en/triet-hoc/husserl-hien-tuong-hoc/` | `/triet-hoc/husserl-hien-tuong-hoc/` | English copy was Vietnamese text; removed. Redirects to the Vietnamese original. |
| `/kinh-te/game_theory_nash/` | `/en/kinh-te/game_theory_nash/` | Vietnamese copy was English text; removed. Redirects to the English original. |

## Generated listings (`data/redirects.yaml`, published by `layouts/_partials/site/redirects.html`)

These are tag, category and section listings that no longer have content in that language. `…/page/1/` variants redirect to the same target.

| Old URL | Now redirects to |
|---|---|
| `/categories/applied-mathematics/` | `/en/categories/applied-mathematics/` |
| `/en/khoa-hoc-may-tinh/` | `/khoa-hoc-may-tinh/` |
| `/en/tags/chien-luoc/` | `/tags/chien-luoc/` |
| `/en/tags/complexity/` | `/tags/complexity/` |
| `/en/tags/crypto/` | `/tags/crypto/` |
| `/en/tags/dai-so-tuyen-tinh/` | `/tags/dai-so-tuyen-tinh/` |
| `/en/tags/doanh-thu/` | `/tags/doanh-thu/` |
| `/en/tags/hien-tuong-hoc/` | `/tags/hien-tuong-hoc/` |
| `/en/tags/husserl/` | `/tags/husserl/` |
| `/en/tags/kinh-te/` | `/tags/kinh-te/` |
| `/en/tags/lagrange/` | `/tags/lagrange/` |
| `/en/tags/lap-trinh/` | `/tags/lap-trinh/` |
| `/en/tags/ly-thuyet-so/` | `/tags/ly-thuyet-so/` |
| `/en/tags/ly-thuyet-tro-choi/` | `/tags/ly-thuyet-tro-choi/` |
| `/en/tags/ma-tran/` | `/tags/ma-tran/` |
| `/en/tags/nash/` | `/tags/nash/` |
| `/en/tags/nhan-thuc/` | `/tags/nhan-thuc/` |
| `/en/tags/phan-tich/` | `/tags/phan-tich/` |
| `/en/tags/quantum/` | `/tags/quantum/` |
| `/en/tags/riemann/` | `/tags/riemann/` |
| `/en/tags/so-nguyen-to/` | `/tags/so-nguyen-to/` |
| `/en/tags/thuat-toan/` | `/tags/thuat-toan/` |
| `/en/tags/toan-hoc/` | `/tags/toan-hoc/` |
| `/en/tags/toan-kinh-te/` | `/tags/toan-kinh-te/` |
| `/en/tags/toi-uu-hoa/` | `/tags/toi-uu-hoa/` |
| `/en/tags/triet-hoc/` | `/tags/triet-hoc/` |
| `/en/tags/vi-mo/` | `/tags/vi-mo/` |
| `/en/tags/vi-phan/` | `/tags/vi-phan/` |
| `/en/tags/vi-tich-phan/` | `/tags/vi-tich-phan/` |
| `/en/tags/y-thuc/` | `/tags/y-thuc/` |
| `/en/toan-hoc/` | `/toan-hoc/` |
| `/en/triet-hoc/` | `/triet-hoc/` |
| `/tags/ai/` | `/en/tags/ai/` |
| `/tags/economics/` | `/en/tags/economics/` |
| `/tags/game-theory/` | `/en/tags/game-theory/` |
| `/tags/mathematics/` | `/en/tags/mathematics/` |
| `/tags/optimization/` | `/en/tags/optimization/` |

## Not redirected

37 RSS feeds of those listings (`…/index.xml`) end. GitHub Pages has no server-side redirects, and a feed cannot use an HTML meta refresh. The site feeds (`/index.xml`, `/en/index.xml`) and the sitemaps are unaffected apart from the removed entries.

<details><summary>Feeds that end</summary>

- `/categories/applied-mathematics/index.xml`
- `/en/khoa-hoc-may-tinh/index.xml`
- `/en/tags/chien-luoc/index.xml`
- `/en/tags/complexity/index.xml`
- `/en/tags/crypto/index.xml`
- `/en/tags/dai-so-tuyen-tinh/index.xml`
- `/en/tags/doanh-thu/index.xml`
- `/en/tags/hien-tuong-hoc/index.xml`
- `/en/tags/husserl/index.xml`
- `/en/tags/kinh-te/index.xml`
- `/en/tags/lagrange/index.xml`
- `/en/tags/lap-trinh/index.xml`
- `/en/tags/ly-thuyet-so/index.xml`
- `/en/tags/ly-thuyet-tro-choi/index.xml`
- `/en/tags/ma-tran/index.xml`
- `/en/tags/nash/index.xml`
- `/en/tags/nhan-thuc/index.xml`
- `/en/tags/phan-tich/index.xml`
- `/en/tags/quantum/index.xml`
- `/en/tags/riemann/index.xml`
- `/en/tags/so-nguyen-to/index.xml`
- `/en/tags/thuat-toan/index.xml`
- `/en/tags/toan-hoc/index.xml`
- `/en/tags/toan-kinh-te/index.xml`
- `/en/tags/toi-uu-hoa/index.xml`
- `/en/tags/triet-hoc/index.xml`
- `/en/tags/vi-mo/index.xml`
- `/en/tags/vi-phan/index.xml`
- `/en/tags/vi-tich-phan/index.xml`
- `/en/tags/y-thuc/index.xml`
- `/en/toan-hoc/index.xml`
- `/en/triet-hoc/index.xml`
- `/tags/ai/index.xml`
- `/tags/economics/index.xml`
- `/tags/game-theory/index.xml`
- `/tags/mathematics/index.xml`
- `/tags/optimization/index.xml`

</details>
