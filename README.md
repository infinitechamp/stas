# STAS Intelligent Systems website (stas.co.ke)

Static site (HTML, CSS, JS). No build step. Hosted on GitHub Pages.

## Structure
- `index.html`: the home page (services, tutoring and research, about, process, contact)
- `services/`: one page per service
- `pay.html`: online payments page
- `css/style.css`, `js/main.js`: styling and behaviour
- `assets/`: logo and favicon
- `404.html`: not-found page
- `CNAME`: custom domain (stas.co.ke)
- `.nojekyll`, `robots.txt`, `sitemap.xml`

## Deploy to GitHub Pages
1. Create a repo (for example `stas-website`) and push these files to the `main` branch root.
2. Repo Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Under "Custom domain" enter `stas.co.ke` (the `CNAME` file already contains it), then tick "Enforce HTTPS" once the certificate is issued.

## DNS (at your .ke registrar)
- Apex `stas.co.ke`: four A records pointing to
  185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- `www`: a CNAME record pointing to `<your-github-username>.github.io`
- Check the current values in GitHub's docs ("Managing a custom domain for your GitHub Pages site") before saving.

## Before going live
Edit `js/site-config.js` (one file controls everything below):
- `phone`, `whatsapp` (digits only, e.g. 2547XXXXXXXX), `email`, `location`: used on the contact section, the floating WhatsApp button, service pages and the payments page.
- `formAccessKey`: makes the contact form send automatically (see below).

## Contact form (sends without opening a mail app)
The form posts to Web3Forms (free). To switch it on:
1. Go to web3forms.com, enter the email address that should receive enquiries, and verify it.
2. Paste the access key they email you into `formAccessKey` in `js/site-config.js`.
The key is meant to be public. Until it is set, the form falls back to opening the visitor's email app.

## Service pages
Each service has its own page in `services/` (including Meta Business Suite & Ads). Edit the text directly in those HTML files.
The home page cards (`index.html`, section "What we do") link to them. To add a service, copy one of the files in
`services/`, edit it, and add a card and a `sitemap.xml` entry.

## Online payments (pay.html)
GitHub Pages is static, so the payments page uses hosted checkout links and manual payment details instead of a server.
All settings live in `js/payments-config.js`. Any option left empty is hidden; with everything empty, visitors see a
"payments are being set up" notice and your contact email.

1. **M-Pesa + card checkout (recommended):** create a payment link in your provider's dashboard (any Kenyan provider works) and paste the https:// links into `card.kes` and `card.usd`.
   Providers verify your business before going live (typically KRA PIN plus business registration and ID); check
   their current requirements when you sign up.
2. **M-Pesa Paybill/Till:** set `mpesa.type` to `"paybill"` or `"till"` and fill `mpesa.number`.
3. **Bank transfer:** fill the `bank` block.
5. The "Confirm on WhatsApp" button uses the WhatsApp number in `js/site-config.js`.

Security: this file is public. Never put API secret keys in it. Payments are reconciled by the invoice number the
customer enters as the reference, then confirmed by WhatsApp or email. Automatic confirmation (webhooks) needs a
small server; ask if you want that added later.

## Card payments
The two card buttons on pay.html (KES and USD) open the checkout links set in `cardLinks` in `js/payments-config.js`. Replace the links there to change them. Never put secret keys in this repo.

## SEO
- Every page has its own title, description, canonical URL, Open Graph/Twitter tags and structured data (JSON-LD).
- `assets/og-image.jpg` is the picture shown when the site is shared on WhatsApp, Facebook, LinkedIn and X.
- `sitemap.xml` lists the pages; `robots.txt` points search engines to it. `pay.html` is set to "noindex" on purpose.
- After going live: verify stas.co.ke in Google Search Console (a "Domain" property with a DNS TXT record is easiest),
  then submit https://stas.co.ke/sitemap.xml. Do the same in Bing Webmaster Tools.
- When you add a new page, add it to `sitemap.xml` and give it its own title and description.
