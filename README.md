# Ankit — ML & Research Portfolio

A responsive personal portfolio with separate **Profile, About, Publications, Articles, and Projects** pages, plus an owner-only editor at **`/admin`**.

The editor saves your content permanently into `content/portfolio.json` in this GitHub repository. Changes are versioned as commits. The public website reads current content through a Vercel API, so a refresh shows your edits without waiting for a rebuild. If the API is unavailable, the site uses its last deployed content as a fallback.

## Features

- Profile photo upload, biography, interests, education, GitHub, LinkedIn, contact email, and résumé link.
- About page with paragraph formatting.
- Publications: title, authors, venue, year, description, paper and code links.
- Articles: title, date, summary, full text, and a reading dialog.
- Projects: category filters, descriptions, tags, code links, and demo links.
- Add, edit, and remove entries in a password-protected editor.
- Explicit publishing, conflict detection, unsaved-change warning, and image compression.
- Responsive layouts, keyboard focus indicators, security headers, and plain-text rendering.
- No framework packages or database subscription required for this implementation.

Publications and articles intentionally start empty. Add only your actual work. Project summaries are starting copy; update them with your verified results.

## Deploy on Vercel

1. Sign in to [Vercel](https://vercel.com/new) with GitHub.
2. Import **`raoankit72005/Ankit_portfolio`**.
3. Use **Framework Preset: Other**, **Root Directory: repository root**, **Build Command: `npm run build`**, and **Output Directory: `dist`**. The included `vercel.json` supplies these settings and routes. Use Node.js 22 or newer.
4. Add the environment variables below before deploying. Set them for **Production**. Avoid giving untrusted preview deployments a write token or admin password.
5. Deploy. Open the Vercel URL for your website; open **`https://YOUR-SITE.vercel.app/admin`** for the editor.

### Environment variables

| Name | Value |
| --- | --- |
| `GITHUB_REPO` | `raoankit72005/Ankit_portfolio` |
| `GITHUB_BRANCH` | `main` |
| `GITHUB_TOKEN` | A fine-grained GitHub personal access token restricted to this repository with **Contents: Read and write** |
| `ADMIN_PASSWORD` | A unique random secret of at least 24 characters; generate a 64-character value with the command below |

Generate your admin password **on your own computer**:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Save the value in your password manager and in Vercel's `ADMIN_PASSWORD` variable. Do not put it in source code, GitHub, articles, or public screenshots.

Create the GitHub token at [GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens](https://github.com/settings/personal-access-tokens/new). Choose your account, select **only Ankit_portfolio**, and set **Repository permissions → Contents → Read and write**. Set an expiry you can track. Copy the token directly into Vercel's `GITHUB_TOKEN` variable; do not send it in chat. GitHub may require approval for organization repositories, though this is a personal repository.

After changing environment variables, **redeploy** to apply them. If a token expires, replace it and redeploy.

### Editing your website

1. Go to `/admin` and sign in with your `ADMIN_PASSWORD`.
2. Choose **Profile**, **About**, **Publications**, **Articles**, or **Projects**.
3. Change fields, upload a photo, or click **Add** / **Remove** for entries.
4. Click **Publish changes**. Wait for the success message and commit identifier.
5. Refresh the public page. The content has been saved to GitHub and is visible to all visitors.

Drafts are held in page memory until you publish. Closing the editor loses unpublished edits. Articles support plain text and blank-line-separated paragraphs, not arbitrary HTML or Markdown. URLs must use HTTPS. The photo is compressed in the browser and stored inside the content file; it is public, like the rest of the portfolio. Images up to 12 MB can be selected, then are resized to at most 640 pixels and checked against the stored size limit. For large media libraries, use dedicated media storage rather than this content file.

The admin password is sent over HTTPS in an authorization header and held only in page memory. The server verifies it on every save. No password or GitHub token is included in the public build. There is no multi-user account system. Use the generated random password, keep it private, and rotate it in Vercel if needed. The editor refuses to activate with a password shorter than 24 characters.

### Edit using GitHub instead

You can also edit **`content/portfolio.json`** in GitHub. Keep valid JSON and the existing field structure. Add entries using the shapes below, with a unique ID for each entry. Avoid simultaneous edits in GitHub and `/admin`; if a conflict occurs, keep a copy of your draft and reload saved content before retrying.

Publication:

```json
{"id":"my-paper-2027","title":"Your real paper title","authors":"Ankit, Co-author","venue":"Conference or journal","year":"2027","summary":"Your contribution and finding.","paper":"https://example.com/paper","code":""}
```

Article:

```json
{"id":"attention-notes","title":"My attention implementation notes","date":"2026-10-12","summary":"What I learned.","body":"Your full article.\n\nAnother paragraph."}
```

Project:

```json
{"id":"my-project","title":"Project title","category":"Machine learning","summary":"Short description.","body":"Details and verified results.","tags":["PyTorch"],"code":"https://github.com/raoankit72005/your-repo","demo":""}
```

## Run locally

```bash
git clone https://github.com/raoankit72005/Ankit_portfolio.git
cd Ankit_portfolio
npm run dev
```

Open `http://localhost:3000`. Copy `.env.example` to `.env` and fill in your own values only if you want to test live editing. **Local publishing also writes to the configured GitHub repository.** Without secrets, the public pages use the seed content and the editor explains the missing setup.

```bash
npm run check
npm test
npm run build
```

## File map

| File | Purpose |
| --- | --- |
| `public/index.html`, `public/app.js` | Public pages and client-side navigation |
| `public/style.css` | Portfolio and editor styles |
| `public/admin.html`, `public/admin.js` | Owner editor |
| `content/portfolio.json` | Your editable content |
| `api/admin.js` | Login verification |
| `api/content.js` | Load content and authenticated publishing |
| `lib/server.js`, `lib/schema.js` | Authentication, GitHub requests, and input validation |
| `vercel.json` | Vercel build, routes, and security headers |

## Troubleshooting

- **Public site works but editor says not configured:** add all four variables in Vercel and redeploy. The password must contain at least 24 characters.
- **GitHub request failed:** check token expiry, selected repository, Contents permission, branch name, and whether branch protection blocks direct commits. This editor requires direct write access to the content file on the configured branch.
- **Content changed elsewhere:** copy your unpublished text, reload saved content, then apply your changes again. The editor prevents overwriting a newer revision.
- **Website shows older content:** refresh; verify API configuration. During API failure, deployed fallback content may be older. A new Vercel deployment refreshes the fallback.
- **Photo or content too large:** use a smaller photo or reduce content. The entire saved portfolio is capped at 750 KB.
- **Vercel deployment protection:** visitors may need access until you configure Vercel's deployment protection for the intended public audience.

## Validation performed

JavaScript syntax checks, content-schema validation, static build, and six automated tests covering authentication, origin validation, unsafe URLs, size limits, permanent-save payloads, and concurrent-edit conflicts. A real Vercel deployment and live GitHub saves require your environment-variable configuration; they have not been tested with your production credentials.

References: [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js), [Vercel project configuration](https://vercel.com/docs/project-configuration), [Vercel environment variables](https://vercel.com/docs/environment-variables), and [GitHub contents API](https://docs.github.com/en/rest/repos/contents).
