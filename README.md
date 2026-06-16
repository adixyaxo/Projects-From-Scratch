# systems-portfolio

Hyperminimal portfolio for low-level systems engineering projects.

## Architecture

```
/
├── index.html          — Single page, bento grid layout
├── css/
│   └── style.css       — All styles, zero dependencies
├── js/
│   └── main.js         — Noise canvas, counter, micro-interactions
└── README.md
```

## Design decisions

- **Pure black** background, greyscale throughout — no colour
- **Space Mono** for all structural type — reinforces machine-level work
- **Bento grid** with 1px seams — structure is the decoration
- **Real code fragments** from each implementation as ambient texture
- **Zero external dependencies** beyond Google Fonts — matches the engineering philosophy
- **Static HTML/CSS/JS** — no build step, no bundler, deploys directly to GitHub Pages

## Deploy to GitHub Pages

1. Push to a repo named `<username>.github.io`
   — or any repo, then enable Pages from Settings → Pages → Deploy from branch

2. That's it. No build step required.

## Projects documented

| # | Project | Language | Key concepts |
|---|---------|----------|-------------|
| 01 | HTTP Web Server | C | POSIX sockets, RFC 1945 |
| 02 | Multithreaded Web Server | C++ | RAII, threads, HTTP/1.1, keep-alive |
| 03 | SHA-256 | C | FIPS 180-4, bitwise ops |

## Customisation

- Update `href` values on `.project-link` anchors to point to real GitHub repos
- Update `identity-links` hrefs with actual URLs
- The LOC counter target (1410) is in `js/main.js` — adjust to match real counts
