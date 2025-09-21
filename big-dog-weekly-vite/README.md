# Big Dog Weekly (Vite + React + Tailwind)

## Quick start
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Deploy to Vercel
1. Push this folder to a new GitHub repo.
2. Import the repo into Vercel and click **Deploy**.
3. Use the deployed URL in Canvas with an `<iframe>`.

## Canvas embed
Paste this into the Canvas page **HTML** editor:
```html
<div style="position:relative;padding-top:0;">
  <iframe
    src="YOUR_VERCEL_URL_HERE"
    title="Big Dog Weekly Page"
    style="width:100%;height:1600px;border:0;overflow:auto;background:transparent;"
    allow="clipboard-write; fullscreen"
    loading="lazy"
  ></iframe>
</div>
```

## Notes
- This project includes minimal `Button` and `Card` components compatible with your code.
- Update the default logos in `src/page.tsx` if you want different defaults.
- All interactivity stays intact inside Canvas via the iframe.
