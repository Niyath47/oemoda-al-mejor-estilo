# OE moda al mejor estilo

Landing page for the fashion boutique at Avinguda la Rambleta 12, Catarroja,
Valencia. Built with Vite, GSAP ScrollTrigger and Lenis. All imagery is stored
locally in `public/images/`.

## Local development

```bash
npm install
npm run dev
npm run build
```

## Deploy to Netlify

This repo is ready to connect in the Netlify UI. The settings in
`netlify.toml` are applied automatically:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 22

Steps: Netlify → Add new site → Import an existing project → GitHub →
select `oemoda-al-mejor-estilo` → deploy. No environment variables are needed.

## Swapping the shop photos

The two shop-front photos from the brief were not available as files.
`public/images/store-interior.jpg` and `store-rack.jpg` are placeholders.
Replace them with the real photos, keeping the filenames, and redeploy.
