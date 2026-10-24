# Hekto Ecommerce

React, TypeScript, and Vite storefront frontend.

## Local development

Requirements: Node.js and npm.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Vite serves the development app at `http://localhost:5173` by default. If that
port is occupied, Vite selects the next available port. The production build
can be checked locally with `npm run build` followed by `npm run preview`;
preview uses `http://localhost:4173` by default.

## Backend URL

The frontend reads `VITE_API_BASE_URL` when Vite builds the app. It must be the
backend origin plus the API path (including `/api`), for example:

```dotenv
VITE_API_BASE_URL=https://ecom-zb9o.vercel.app/api
```

`.env.example` contains the current backend URL. For a local backend, copy it
to `.env.local` and set the variable to the local backend URL, such as
`http://localhost:3000/api` (replace the port with the backend's actual port).
The app defaults to the current deployed backend when this variable is unset.

`VITE_` variables are embedded in browser JavaScript at build time. They are
public configuration, not secrets. Set `VITE_API_BASE_URL` in the frontend
hosting provider's environment settings before its build runs; changing it
requires a new frontend build/deployment.

## Deployment

No frontend hosting-provider configuration is checked into this repository.
For a static frontend deployment:

1. Install dependencies with `npm ci`.
2. Set `VITE_API_BASE_URL` for the deployment environment.
3. Build with `npm run build` and publish the generated `dist/` directory.
4. Configure the host to serve `index.html` for unknown application paths so
   React Router routes (for example `/products` and `/carts`) work on refresh.
5. Configure the backend's CORS allowlist to include the deployed frontend
   origin.

Vite's development and preview servers are for local testing, not production
hosting. Hosting-specific rewrite and environment settings depend on the
deployment provider.

## Checks

```sh
npm run lint
npm run build
```
