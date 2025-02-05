# Objective

This project aims at presenting a daily message in Slack with our MRR progress.

# Data & Infra

- The MRR data is retrieved from a Superbase table that is automatically updated every day with Metabase data.
- The monthly codes are stored in the Const and the 365 files and can be manually edited there.
- The project is deployed Vercel.
- The daily sync between Metabase, Supabase and Slack is done in Make.

# Set up

- npm install
- npm run dev
