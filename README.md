# Conundrum Capital

This repo includes the following packages/apps:

### Technologies

This repo uses the following technologies:

- [Turbo](https://turbo.build/) for monorepo management
- [pNPM](https://pnpm.io/) for package management
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Prisma](https://prisma.io/) for database ORM
- [Next.js](https://nextjs.org/) for frontend (using pages router)
- [React](https://reactjs.org/) for frontend components
- [tRPC](https://trpc.io/) for typesafe frontend APIs
- [Tailwind](https://tailwindcss.com) for out of the styling
- [Shadcn](https://ui.shadcn.com) for out of the

### Repository Structure

The repository is structured as a monorepo using pnpm workspaces:

- `apps/`: Contains the deployable applications.
  - `web/`: The main Next.js frontend application.
    - `lib/engine`: Contains the core game logic or business engine.
    - `server/`: Holds the tRPC backend/API definitions.
    - `components/`: Contains reusable React components used within the `web` app.
    - `pages/`: Contains the Next.js page routes.
- `packages/`: Contains shared libraries and configurations used across applications.
  - `@repo/database/`: Prisma ORM wrapper for database management.
  - `@repo/eslint-config/`: Shared ESLint configurations.
  - `@repo/typescript-config/`: Shared TypeScript configurations.

### In order to get it start, you should run these commands

**Note**: if you don't already have pnpm and turbo installed, see installation instructions here: https://pnpm.io/installation and here: https://turborepo.com/docs/getting-started

- Install dependencies: `pnpm install`
- Migrate the database: `turbo db:migrate`
- Seed the database: `turbo db:seed`
- Start the dev server: `turbo dev`
- navigate to localhost:3000 in your browser
