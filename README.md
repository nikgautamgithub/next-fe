# 🤓 Next Frontend

> Because life's too short for messy codebases and "it works on my machine" excuses. No BS, just what works.

## 🎯 Why This Exists

I got tired of:

- 🤓 Code that makes you question your career choices
- 🌾 "The previous dev did it this way" (the previous dev is now a **farmer**)
- 🤷 Mix of 5 different state management libraries because why not
- 💀 No one knows where anything is
- 🐛 Bugs that only appear on Tuesdays

So I made this for myself. My personal starter kit that actually makes sense.

## ✨ What's Inside

### The Stack

**Next.js (App Router)**  
Fast, modern, and I don't have to fight the framework.

**TypeScript (Strict Mode)**  
If it compiles, it (**usually**) works. Saves me hours of debugging.

**Bun**  
Because npm is slow and I like my installs fast.

**Tailwind CSS**  
Utility classes > fighting CSS. Dark mode ready because obviously.

**Axios + TanStack Query**  
My API layer. Axios for requests, TanStack Query for caching/state. No more useEffect maggie.

**lodash-es**  
For when JavaScript makes simple things hard. Tree-shakeable so my bundles stay small.

**shadcn/ui**  
Copy-paste components that look good out of the box. Customizable without tears.

**React Hook Form + Zod**  
Forms that don't suck. Validation that makes sense.

**Sonner**  
Toast notifications that look professional with zero effort.

### Features

**Role-Based Permissions System**  
Full-featured permissions system available on the `permissions` branch. Includes permission guards, role management, and fine-grained access control. Checkout the branch to enable:

```bash
git checkout permissions
```

## 🚫 What's NOT Here

**tRPC** - My backend is FastAPI, not TypeScript. Wrong tool for the job.

**Prisma** - Backend handles the database. Frontend stays in its lane.

**NextAuth** - FastAPI already does auth with JWT cookies. No duplication needed.

**Redux** - TanStack Query handles server state. I will only add Zustand if I need client-only global state, which I don't this time.

**Regular lodash** - `lodash-es` has better tree-shaking. Smaller bundles = faster site.

## 🏗️ How It's Organized

```
app/              # Pages (Next.js App Router)
src/
├── components/       # UI components (organized by feature)
├── lib/
│   ├── api/          # Axios setup, API endpoints
│   ├── hooks/        # Custom hooks (queries, mutations)
│   ├── utils/        # Helper functions
│   └── constants/    # Config, routes, etc.
└── types/            # TypeScript types
```

Everything has a place. No "misc" or "helpers" dumping grounds.

## 🎯 My Patterns

### TanStack Query Factory Pattern

Query keys in one place. No typos, easy invalidation, looks professional.

### Optimistic Updates

UI updates instantly, rolls back if it fails. Feels fast because it is fast.

### lodash-es vs Native

- Use lodash-es for: `isEmpty`, `debounce`, `get`, `groupBy`, safety checks
- Use native for: `map`, `filter`, `forEach`, basic array stuff

### Component Structure

Client components, memoized callbacks, debounced inputs, proper loading states.

## 🚀 Getting Started

```bash
# Clone it
git clone <repo-url>
cd project

# Install (fast with Bun)
bun install

# Setup environment
cp .env.example .env.local
# Edit with your backend URL

# Add UI components you need
bunx shadcn@latest add button input card dialog

# Start coding
bun dev
```

## 🎨 My Rules

**Do:**

- Keep components small
- Handle loading/error states
- Show toast notifications
- Use TypeScript properly
- Memoize expensive stuff

**Don't:**

- Use `any` type
- Fetch in useEffect
- Store server state in useState
- Commit secrets
- Ship console.logs

## 🛠️ Quick Commands

```bash
bun dev              # Start dev server
bun run build        # Production build
bun run lint         # Check code
bun run format       # Prettier Format
```

## 💡 Why These Choices?

**Bun over npm** - Speed. That's it.

**lodash-es over lodash** - Tree-shaking = smaller bundles.

**TanStack Query** - Best server state library. Period.

**App Router** - The future of Next.js. Learn it now.

**shadcn/ui** - Components I can customize without fighting dependencies.

**Strict TypeScript** - Catch bugs at compile time, not production.

## 📝 Notes to Future Me

- FastAPI backend handles auth, don't duplicate it
- Use query keys factory, you'll thank yourself later
- Optimistic updates make everything feel faster
- Keep components in `features/` folder by domain
- Don't overthink it, just ship

## 🎯 Backend Context

- FastAPI backend (separate repo/server)
- JWT tokens in HTTP-only cookies
- Next.js API routes proxy to FastAPI (hides real endpoints)
- Frontend just checks auth state, backend does the work

---

**This is my template. There are many like it, but this one is mine.** 🚀

Built for speed, maintained for sanity, optimized for 2 AM debugging sessions.
