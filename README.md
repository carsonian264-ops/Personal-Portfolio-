# Ian Carson — Portfolio

A personal portfolio for **Ian Carson**, a full-stack engineer based in Kenya, learning and building
with JavaScript, React, Node.js, Express, PostgreSQL, and now Python/ML.

Built from scratch as a static site — no build step, no framework, no UI kit.

## Stack

- Semantic HTML5
- Hand-written CSS (custom-property design tokens, bento grid, responsive layout)
- Vanilla JavaScript, split by concern:
  - `main.js` — navigation, scroll reveal, contact form, hero particle background
  - `terminal.js` — hero typing animation + the interactive command terminal
  - `github.js` — fetches **live** public data from the GitHub REST API for the
    [`carsonian264-ops`](https://github.com/carsonian264-ops) account (no auth, no key required)
  - `assistant.js` — the floating AI assistant. It's a **local, rule-based demo** — not wired to a
    live LLM API. `getResponse()` in that file is the single seam to swap in a real backend call.

## Running locally

No build step required — serve the folder with any static server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Honesty notes

- No stock photography, no fabricated project screenshots, no invented employment history.
- The "Download CV" button is intentionally disabled — no CV file exists yet.
- The contact form has no backend; submitting it opens a pre-filled `mailto:` message instead of
  silently "sending" anywhere.
- GitHub activity is fetched live in the visitor's browser — numbers are never hardcoded.

## License

Personal project — all rights reserved.
