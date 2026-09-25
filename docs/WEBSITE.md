# Add Black Wire to the Valleytech web store

The guide can be a normal navigation destination within the existing Shopify store. Visitors use the browser version without installing the Windows application.

Proposed store page: `https://valleytechsolutions.tech/pages/bwm-technical-reference-guide`

Menu label: **BWM-Technical Reference Guide**

This URL is the intended destination, not a claim that the page is already live.

## How it fits into the store

The Shopify page keeps the store's header, navigation and footer and embeds the browser guide in an iframe. An **Open the guide full screen** link provides more room on small displays and an alternative when a browser restricts embedded storage or downloads. A link in the main store menu points to this page. Products, cart and checkout continue through Shopify.

The app and reference files are deployed to a separate static web host. A host-provided HTTPS address is sufficient; an optional `guide.valleytechsolutions.tech` subdomain can be connected later. No change to the storefront's primary domain or nameservers is needed merely to add the embedded page.

The entire reference catalog is included. Images and documents load when requested; opening the guide does not download the entire collection. No server-side customer database, Shopify credentials or payment access is needed by the guide.

## Build the browser edition

Import the library as described in BUILDING.md, then:

```sh
pnpm build:web
pnpm test:web
pnpm preview:web
```

Upload the contents of `web-release` to a static host over HTTPS. The output includes the catalog, full-resolution originals, previews, PDF resources, license notices and security/cache header configuration. It excludes desktop executables and personal workbench backups.

For a deployment mounted below a URL path, set `BLACKWIRE_BASE_PATH` to a slash-terminated path such as `/bwm-guide/` when building and previewing. The server must actually mount the output at that path. Leave it unset when using a dedicated hostname such as a Pages project URL.

The `_headers` file uses the syntax supported by Cloudflare Pages. Other hosts need equivalent header settings. In particular, allow frame ancestors `https://valleytechsolutions.tech` and `https://www.valleytechsolutions.tech`; do not add `X-Frame-Options: DENY` or `SAMEORIGIN`, which would prevent the Shopify embed. The app still restricts scripts, workers and network requests to its own resources.

## Hosting requirements

The current build contains roughly **6,242 files / 1.89 GB**, with a largest file of **15.86 MB**. The build report checks the 20,000-file / 25-MiB-per-file limits documented for Cloudflare Pages direct upload. Hosting eligibility and current account limits must still be checked before deployment. Larger future collections may require separate object storage/CDN hosting for originals.

Cloudflare Pages is a suitable candidate for the current static output. GitHub remains the source/release location; the web app does not depend on GitHub raw-file URLs as a production image CDN. A hosting account/destination is required before deployment. Do not upload an installer EXE into a Shopify page and expect it to run in a visitor's browser.

## Connect the verified deployment

After deployment, test its real HTTPS URL, images, PDFs, mobile layout, downloads and browser storage. Generate the store page body using that verified URL:

```sh
node scripts/prepare-shopify-page.mjs https://your-verified-guide-host.example/
```

This generates `data/qa/shopify/guide-page.html` from `integrations/shopify/guide-page.template.html`. Use the **BWM-Technical Reference Guide** title and `bwm-technical-reference-guide` page handle. Publish and add the navigation item only once the embedded guide works. The placeholder in the template is not a deployable address.

The default Shopify page may constrain content width. Begin with the existing theme's page layout and verify it on desktop/mobile; use a dedicated wide page template if needed. Theme changes should be previewed before publishing.

## Behavior and limits

- Browser search, source credits, image/PDF viewing, original downloads and power tools share the desktop implementation.
- A board can be linked directly with `?board=<catalog-board-id>`; its viewer opens on arrival.
- The browser edition requires a connection to load references. It does not claim that the whole collection is available offline or silently cache nearly two gigabytes on a visitor's device.
- Bookmarks and measurements use browser storage. They are not customer-account records or cloud-synced data. Exported JSON backups work with the desktop edition.
- Browsers can restrict storage inside cross-site iframes. The full-screen link and backup export provide alternatives; storage failures are surfaced in the interface.
- References retain their existing attribution and rights limitations. Hosting does not establish permission for commercial printing or reuse.

## Validation recorded locally

The browser smoke test covers mounting below `/bwm-guide/`, on-demand originals, dash-aware search, image rendering, original downloads, bookmarks, direct board links, PDF pagination, the power desk, sandboxed embedding, narrow layout and the production content-security policy. The tested initial page loaded approximately **6.84 MB decoded**, with no original media files requested before opening a board. Deployment and the real Shopify theme still require verification.

Primary documentation: [Shopify pages and embedded content](https://help.shopify.com/en/manual/online-store/add-edit-pages), [Shopify menu links](https://help.shopify.com/en/manual/online-store/menus-and-links/editing-menus), [Cloudflare Pages direct upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [Pages limits](https://developers.cloudflare.com/pages/platform/limits/).
