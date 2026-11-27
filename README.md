# Expedition with Lakshya

A cinematic, responsive travel website starter built with React + Vite. Designed for a zero-cost-first Netlify deployment.

## Included in this first build
- Responsive cinematic homepage and navigation
- Destination search and category filters
- Destination cards with detail modal
- Travel journal preview
- Community review submission form
- Browser-local demo review storage, or Supabase insert when configured
- Netlify SPA redirect configuration
- Supabase SQL and setup guide

## Run locally
```bash
npm install
npm run dev
```

## Important current limitations
This is the first frontend build, not a fully deployed production service. Destination content and photos are sample/demo content. Review submissions are browser-local until Supabase is configured; when configured, submissions are stored as pending and require moderation. Public review display, account login, real admin dashboard, actual media upload/download library, location-specific itinerary editor, music player, and map integrations are next development phases.

See `SUPABASE_SETUP.md` for database setup and Netlify deployment instructions.
