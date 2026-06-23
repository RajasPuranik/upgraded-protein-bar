# FuelBar Next.js Storefront

FuelBar is now a Next.js App Router storefront for protein bars with a Firebase-ready catalog and a localStorage shopping cart.

## What is included

- Next.js App Router project structure
- Shared design system tokens in `app/globals.css`
- Navbar, footer, hero, products, sugar-free banner, nutrition, ingredients, Gen Z, features, and CTA sections
- Product flavor tabs and nutrition size tabs
- Firebase setup for Auth and Firestore
- Firestore product data model and local seed catalog
- Cart context with localStorage persistence
- Cart drawer with quantity controls, customer details, free-delivery logic, and WhatsApp checkout
- Project-local raster hero image at `public/fuelbar-product-hero.png`

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Firebase setup

Copy `.env.example` to `.env.local` and add your Firebase web app values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Firestore reads from a `products` collection. Each product document should match the model in `lib/products.ts`.
The app falls back to the local seed catalog when Firebase is not configured.

## Useful commands

```bash
npm run dev
npm run build
npm run generate:hero
```

## Project structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  cart/
  sections/
lib/
  firebase.ts
  firebase-auth.ts
  firestore-products.ts
  products.ts
public/
  fuelbar-product-hero.png
scripts/
  generate-hero-image.mjs
```

The old `index.html` is kept in the repo as a legacy static reference, but the active app is the Next.js project.
