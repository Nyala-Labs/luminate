<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key known differences:
- **`middleware.ts` → `proxy.ts`:** The root-level middleware file convention is renamed to `proxy.ts` and the export function must be named `proxy` (not `middleware`). The `edge` runtime is NOT supported in proxy files. If you need edge runtime, keep the deprecated `middleware.ts`. Run `npx @next/codemod@canary middleware-to-proxy .` to auto-migrate.
<!-- END:nextjs-agent-rules -->

## Environment & Tooling
- **Package Manager:** Use **`bun`** exclusively (`bun install`, `bun dev`, `bun add`). Do not use `npm` or `yarn`.
- **Styling:** Tailwind CSS **v4** is used (via `@tailwindcss/postcss`). Be aware of v4 differences from v3 (e.g., no `tailwind.config.ts`; configuration is handled directly in CSS like `app/globals.css`).

## Common Commands
- **Dev:** `bun dev`
- **Lint:** `bun run lint`
- **Build:** `bun run build`

## Database
- **Tool:** Drizzle ORM
- **Commands:** `bun run db:generate`, `bun run db:push`, `bun run db:migrate`, `bun run db:studio`