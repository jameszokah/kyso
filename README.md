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

```sh
first of all on our Visualizer Customization, we dont need an option to select the vistualizer type that is either the Audio Visualizer or Persona, but rather combine all as one persona, no need to split the two, secondly we need a cusomizable similar exterience for the chat flow, eg. our chat input, transcription, aka our (control bar) follow the agent-ui and ai-elements components folders which contains most components we can customize for such task also follow the React Composition Patterns for all the component you'll be working on and the ones you've worked on
, which h follow the skills i've given @.gemini,  and overall anytime we change our voice agent setting it doesnot imediately reflect or affect our ui, pls fix that, carefully plan each above instruction before implementing, finally most of the element on the persona component takes too long to display or even work or load up, look into that as well and see how you can fix it.

part 2. of the instruction to follow and plan well before implementing, is on the workflow when a user, clicks on the deploy button on the top right coner we should display a dialog which should show a version history or snaphot of each deployed version of the workflow or the extracted wrkflow to be specific, now on our first deployment since we dont have a timeline version snapshot or history, there is no need to show any version snapshot user can roll back to. or to show the current version, but there must be a simple form to write the version message, for each version and also to alert that we about to deploy a version or a snapshot, (for the naming instead of calling or display it as version or snapshot to the user let find or user a more approprate user friendly naming for it) and for the backend or api (lets use orpc)@orpc-docs.md which we already configured or setup, used drizzel orm for the db, providing secure protected backend api implementation, and connent and impement it with the from end in a typesafe way with tankstack-query, implemet the backend logic for our workflow creation, and storing our workflow and saving it anytime the user clicks save button and a crud api for our workflows and find a more optimal way(data structure or data schema) to store the workflow, and along side the workflow itself we should have our agentflow, which is our extracted workflow beside that or close to that we need to add our saved voice agent setting, and on our dashboard page we should be able to easily perform this crud operations, and when we click on a single workflow it should navigate the user to the detailed workflow page or workflow editer page, which is where the user builds the wrokflow

```
