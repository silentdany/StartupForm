# App Template

This is a [Next.js](https://nextjs.org/) project bootstrapped with the Mini App Template.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customization

The main configuration for your app is located in `lib/config/app-config.ts`. Edit this file to customize:

- App name, short name, and description
- SEO metadata, keywords, and social sharing info
- Social media platforms (for character counter apps)
- Site structure and footer links
- Feature flags

## Structure

- `app/` - Next.js app router pages and layouts
- `components/` - Reusable React components
- `lib/` - Utility functions and configuration
- `public/` - Static assets

## Deployment

This app is ready to be deployed on [Vercel](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Creating Additional Apps

To create another app using this template, run:

```bash
cd [parent-directory]
./scripts/create-new-app.sh my-new-app "My New App" "Description of my new app"
``` 