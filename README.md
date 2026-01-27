# kyso

This project was created by [James Zokah](https://github.com/jameszokah/kyso), a modern TypeScript stack that combines Next.js, Self, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **PWA** - Progressive Web App support
- **Tauri** - Build native desktop applications

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/web/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun run db:push
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see your fullstack application.

## Project Structure

```
kyso/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:studio`: Open database studio UI
- `cd apps/web && bun run generate-pwa-assets`: Generate PWA assets
- `cd apps/web && bun run desktop:dev`: Start Tauri desktop app in development
- `cd apps/web && bun run desktop:build`: Build Tauri desktop app

prompt store


```sh take a closer look into this, the
first one: -> addTool({
name: tool.name,
description: tool.description || '',
type: 'http_request',
config: {},
});

second one: -> tools.push({
name: toolData.name || 'http_tool',
description: toolData.description || '',
type: toolData.type || 'http_request',
config: toolData.config || {},
});

the first one is causing duplicates of tool been added to the extracted tool, the key differences is that the first one doesnt contain the right tool's data, making it static, but it updates the ui, say eg. when i add or remove it from the property bar config, the second one dont have static data, it changes, but does not refect the ui update say, eg i delete a edge that the tool connects to the voice agent it doesnt update, so remove the first duplicate tool and update the second one to reflect the ui changes say, eg i delete, the tool from the voice agent property bar config
```