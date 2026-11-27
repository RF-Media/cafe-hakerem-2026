# Bing IndexNow Setup

This site uses Bing IndexNow to notify Bing search engine of new content immediately after publishing.

## What is IndexNow?

IndexNow is a protocol that allows you to notify Bing (and other search engines via partners like Yandex and Seznam) about URL changes in real-time, instead of waiting for the crawlers to discover them naturally.

## Verification

✅ **Verification file:** `/public/926121c6bafe48e1a3377aab87f4421b.txt`

The verification file contains your IndexNow API key: `926121c6bafe48e1a3377aab87f4421b`

This file is served at: `https://cafehakerem.co.il/926121c6bafe48e1a3377aab87f4421b.txt`

## API Endpoint

**POST** `/api/indexnow`

Submit URLs for indexing:

```bash
curl -X POST https://cafehakerem.co.il/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{
    "urlList": [
      "https://cafehakerem.co.il/page1",
      "https://cafehakerem.co.il/page2"
    ]
  }'
```

## Manual Submission

Submit all main pages at once using the npm script:

```bash
npm run index:bing
```

This submits the following pages:
- Home (`/`)
- Menu (`/menu`)
- About (`/about`)
- Jachnun (`/jachnun`)
- Catering (`/catering`)
- Contact (`/contact`)
- Map (`/map`)
- Coffee Club (`/coffee-club`)
- Offers (`/offers`)
- Hanukkah (`/hanukkah`)
- Accessibility (`/accessibility`)
- Privacy (`/privacy`)

## Automatic Submission (Vercel Deployment Hook)

To automatically notify Bing every time you deploy to production:

1. Go to your Vercel project settings: https://vercel.com/dashboard
2. Navigate to **Integrations** → **Deploy Hooks**
3. Create a new deploy hook with:
   - **Name:** `Bing IndexNow`
   - **Branch:** `main`
   - **URL:** `https://cafehakerem.co.il/api/indexnow`
   - **Request body:**
     ```json
     {
       "urlList": [
         "https://cafehakerem.co.il/",
         "https://cafehakerem.co.il/menu",
         "https://cafehakerem.co.il/about",
         "https://cafehakerem.co.il/jachnun",
         "https://cafehakerem.co.il/catering",
         "https://cafehakerem.co.il/contact",
         "https://cafehakerem.co.il/map",
         "https://cafehakerem.co.il/coffee-club",
         "https://cafehakerem.co.il/offers",
         "https://cafehakerem.co.il/hanukkah",
         "https://cafehakerem.co.il/accessibility",
         "https://cafehakerem.co.il/privacy"
       ]
     }
     ```

The deploy hook will automatically call the IndexNow endpoint after every successful deploy to Vercel.

## Bing Webmaster Tools

Register your site in Bing Webmaster Tools:
1. Go to https://www.bing.com/webmasters
2. Click "Add a site"
3. Enter `https://cafehakerem.co.il`
4. Verify using the verification file (Bing will check `/926121c6bafe48e1a3377aab87f4421b.txt`)
5. Submit your sitemap: `https://cafehakerem.co.il/sitemap.xml`

## Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | URLs queued for indexing ✅ |
| 400 | Bad request | Check request format |
| 403 | Forbidden | Verification file not found or key invalid |
| 429 | Rate limited | Wait before trying again (Bing spam protection) |
| 422 | Unprocessable | URLs don't belong to this host |

## Troubleshooting

**403 Forbidden**
- Verify the file exists at `https://cafehakerem.co.il/926121c6bafe48e1a3377aab87f4421b.txt`
- Confirm it contains exactly: `926121c6bafe48e1a3377aab87f4421b`
- Wait for Vercel deploy to complete (verify in Deployments tab)

**429 Too Many Requests**
- You've submitted too many requests recently
- Bing's rate limit is typically 5–10 requests per day
- Try again after a few minutes

## References

- [IndexNow Documentation](https://www.indexnow.org/documentation)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [IndexNow Specification](https://www.bing.com/indexnow/getstarted)
