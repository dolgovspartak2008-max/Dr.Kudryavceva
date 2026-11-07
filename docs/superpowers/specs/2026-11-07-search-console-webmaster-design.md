# Search Console and Yandex Webmaster setup

## Goal

Verify `https://dr-kudryavceva.online/` in Google Search Console and Yandex Webmaster, publish the site's XML sitemap in both services, and confirm that the live verification and crawl files are reachable.

## Approach

Use the ownership-verification files issued by each service and keep them at the repository root. This matches the Google method already selected in Search Console, avoids DNS changes, and survives future deployments as long as the files remain in the repository.

The existing `robots.txt` and `sitemap.xml` remain the canonical crawl-discovery files. No analytics, DNS, page content, or application behavior will be changed.

## Flow

1. Add Google's exact verification file `googleadfe7d73e5d91e86.html` to the repository root.
2. Add the site in Yandex Webmaster, obtain its exact HTML verification file, and add it to the repository root.
3. Push the verification files to `main` so Vercel publishes them on the production domain.
4. Confirm both public verification URLs return the expected text.
5. Complete ownership verification in Google Search Console and Yandex Webmaster.
6. Submit `https://dr-kudryavceva.online/sitemap.xml` in both services and verify that each service acknowledges the sitemap.

## Validation

- The Google verification URL returns the Google verification text rather than the site's custom 404 page.
- The Yandex verification URL returns the Yandex verification text.
- `robots.txt` continues to reference the production sitemap.
- `sitemap.xml` remains reachable and contains the production URLs.
- Both webmaster services visibly show successful site ownership.
- Both webmaster services visibly list the submitted sitemap.

## Constraints

- Work directly on `main`, as approved by the repository owner.
- Keep the verification files permanently in the repository.
- Do not change DNS records or add analytics counters.
- Do not modify unrelated site content.
