# Formy.ai — AI-Powered Form Builder

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Neon](https://img.shields.io/badge/Neon-Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![Kinde](https://img.shields.io/badge/Auth-Kinde-000000?style=for-the-badge)](https://kinde.com/)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

> **One-line pitch:** Formy.ai is a full-stack, multi-tenant form builder where authenticated users can design forms with a drag-and-drop canvas (or generate them with AI), publish them as public links, and collect responses with optional caps, expiry dates, webhook delivery, email notifications, and CSV export.

This document is written as a **complete engineering handbook + interview preparation guide**. It covers the product, architecture, data model, low-level design, workflows, security model, deployment, real engineering challenges, technical debt, scale-up thinking, and a Q&A cheat sheet.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Feature Matrix](#2-feature-matrix)
3. [Tech Stack](#3-tech-stack)
4. [High-Level Architecture](#4-high-level-architecture)
5. [Route Map](#5-route-map)
6. [Project Structure](#6-project-structure)
7. [Data Model](#7-data-model)
8. [Core Workflows](#8-core-workflows)
9. [Low-Level Design (LLD)](#9-low-level-design-lld)
10. [Design System & UI Architecture](#10-design-system--ui-architecture)
11. [Security Model](#11-security-model)
12. [Performance & Scalability](#12-performance--scalability)
13. [Local Setup](#13-local-setup)
14. [Vercel Deployment](#14-vercel-deployment)
15. [Engineering Challenges & Fixes](#15-engineering-challenges--fixes)
16. [Known Limitations & Technical Debt](#16-known-limitations--technical-debt)
17. [Future Roadmap](#17-future-roadmap)
18. [Interview Preparation](#18-interview-preparation)
19. [Scripts & Verification](#19-scripts--verification)
20. [License & Credits](#20-license--credits)

---

## 1. Product Overview

Formy.ai solves the "I need a form, fast" problem for creators, small teams, and businesses.

**Two ways to build a form:**

1. **Visual builder** — drag blocks (inputs, layouts, content) onto a canvas, edit answer keys, colors, banner, and behavior.
2. **AI generation** — describe the form in plain English; Gemini returns a structured JSON tree of blocks that is merged into (or replaces) the canvas.

**How a form goes live:**

```
Draft form → configure limits (max responses / expiry) → publish
     → public URL /public/submit-form/<formId>
     → respondents submit → validation → storage → webhook + email
     → owner sees submissions and exports CSV
```

**Roles:**

| Actor | Authentication | Capabilities |
|---|---|---|
| Visitor | None | View published forms, submit responses, read landing page |
| Creator | Kinde session | CRUD forms, build with AI, publish/unpublish, configure settings, read responses, export CSV |
| System | Server only | Validate, rate limit, cache, deliver webhooks/email, store uploads |

**Core domain concepts:**

- **Form** — a named, owned document with a publish state.
- **Form layout** — a recursive JSON tree of blocks stored in `Form.jsonBlocks`.
- **Block** — a self-describing unit (`TextField`, `RowLayout`, …) that knows how to render in the palette, canvas, properties panel, and public form.
- **FormSettings** — presentation + behavior configuration (colors, banner, webhook, caps, expiry).
- **FormResponse** — a JSON object mapping block IDs to submitted values.

---

## 2. Feature Matrix

| Area | Feature | Status | Notes |
|---|---|---|---|
| Builder | Drag-and-drop canvas (`@dnd-kit`) | ✅ | Mouse + touch sensors |
| Builder | 13 block types | ✅ | Layout, content, input |
| Builder | Duplicate / delete / reorder blocks | ✅ | Recursive tree operations |
| Builder | Live properties panel | ✅ | React Hook Form + Zod per block |
| Builder | Preview dialog | ✅ | Renders the public form UI |
| AI | Generate a full form | ✅ | Gemini → JSON → validated blocks |
| AI | Append questions to an existing form | ✅ | `actionType: "addQuestions"` |
| Publishing | Publish / unpublish | ✅ | Public route checks `published` |
| Publishing | Share link + open live form | ✅ | Origin-based on the client |
| Publishing | Max responses cap | ✅ | Checked on load and on submit |
| Publishing | Expiry date | ✅ | Checked on load and on submit |
| Responses | Paginated submission list | ✅ | 20 per page, “Load more” |
| Responses | CSV export | ✅ | BOM + CRLF + formula-injection guard |
| Notifications | Webhook on submission | ✅ | SSRF-safe, 5s timeout |
| Notifications | Email to form creator (Resend) | ✅ | Optional; requires verified sender |
| Uploads | Banner image upload | ✅ | Auth + magic-byte validation; Blob on Vercel |
| Uploads | Preset/custom banner URL | ✅ | No upload required |
| Auth | Kinde login, dashboard guard | ✅ | Server-side session check |
| Multi-tenancy | Per-user form isolation | ✅ | Every query scoped by `userId` |
| SEO | Metadata, OG/Twitter, JSON-LD, robots, sitemap | ✅ | Environment-aware base URL |
| Analytics | Aggregate stats, conversion rate | ⚠️ Partial | Reads counters; `views` is never incremented |
| Tests | Automated unit/e2e | ❌ | Verified via types, lint, build, smoke tests |

---

## 3. Tech Stack

### Runtime & framework

| Layer | Technology | Version | Why it was chosen |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.5.28 | RSC, file routing, server actions, edge-ready deploys |
| UI runtime | React | 18 | Stable ecosystem; server components |
| Language | TypeScript | 5.x (strict) | End-to-end type safety |
| Styling | Tailwind CSS | 3.4 | Token-driven design system |
| Component primitives | shadcn/ui + Radix | — | Accessible, unstyled primitives you own |
| Icons | lucide-react | 0.468 | Consistent icon set |
| Motion | framer-motion | 12.35 | Entry animations, thank-you state |
| Drag & drop | `@dnd-kit/core` | 6.2 | Mouse/touch sensors, drag overlay, modular DnD |

### Backend & data

| Layer | Technology | Version | Why |
|---|---|---|---|
| Database | Neon (serverless Postgres) | — | Scale-to-zero Postgres, HTTP/WebSocket driver |
| ORM | Prisma | 5.22 | Typed queries, relations, schema-as-code |
| Neon adapter | `@prisma/adapter-neon` + `@neondatabase/serverless` | 5.22 / 0.10 | Serverless-friendly pooling |
| Auth | Kinde | 2.13 | Hosted OIDC, session helpers for RSC |
| AI | `@google/genai` (Gemini) | 2.31 | Structured JSON generation |
| Email | Resend | 6.12 | Transactional email API |
| Validation | Zod | 4.6 | Shared schemas, typed inference |
| Forms | react-hook-form + `@hookform/resolvers` | 7.54 / 3.9 | Controlled builder forms |
| Rate limiting | Custom in-memory sliding window | — | Zero infra for MVP |
| Object storage | Vercel Blob (REST) | — | Durable uploads on serverless |

### Fonts & design tokens

- **DM Sans** (`--font-sans`) — UI/body.
- **Instrument Serif** (`--font-display`) — editorial headings.
- HSL CSS variables for light/dark themes.
- Custom shadows: `shadow-soft`, `shadow-lift`, `shadow-glow`.
- Custom keyframes: aurora, float, shimmer, fade-in-up, gradient-x, scroll.

> Installed but currently unused: `ws`, `@upstash/redis`, `@upstash/ratelimit`, `@marsidev/react-turnstile`, and the `react-grab` dev wrapper. These are documented in [Technical Debt](#16-known-limitations--technical-debt).

---

## 4. High-Level Architecture

### Bird's-eye view

```
┌─────────────────────────────────────────────────────────────────────┐
│                              Browser                                │
│                                                                     │
│  Landing (RSC, static)      Dashboard (RSC shell + client islands)  │
│  Public form (RSC shell + client form)                              │
└───────────────┬───────────────────────────────┬─────────────────────┘
                │ Server Actions                │ fetch() / form POST
                ▼                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Next.js server (Node runtime)                   │
│                                                                     │
│  app/(routes)/… pages ──► actions/*.ts ──► lib/*                    │
│  app/api/upload           (validate,        (security, rate limit,  │
│  app/api/fetchFormById     authorize,        cache, gemini, prisma) │
│  app/api/auth/[kindeAuth]  persist)                                 │
└───────┬───────────────┬──────────────────┬──────────────────┬───────┘
        │               │                  │                  │
        ▼               ▼                  ▼                  ▼
   Neon Postgres    Google Gemini       Resend            Vercel Blob
   (Prisma +        (AI JSON)           (email)           (banner images;
    Neon adapter)                                          local disk in dev)
```

### Layering rules

| Layer | Responsibility | Must not |
|---|---|---|
| `app/**/page.tsx` | Routing, data orchestration, RSC composition | Contain business rules |
| `app/**/_components/**` | UI, local interaction state | Talk to the DB directly |
| `actions/*.ts` | Authn/authz, validation, business logic, side effects | Trust client input |
| `lib/*` | Reusable pure/infra helpers | Import UI components |
| `components/ui/*` | Presentational primitives | Know about forms domain |
| `prisma/schema.prisma` | Persistent contract | Encode UI concerns |

### Rendering strategy

- **Static (build-time):** `/`, `/robots.txt`, `/sitemap.xml`, `/_not-found`.
- **Dynamic (per request):** `/dashboard*`, `/public/submit-form/[formId]`, all API routes.
- **Server Components:** pages, layouts, response page, public form shell.
- **Client Components:** builder, public form inputs, settings forms, dialogs, toasts, share button.
- **Server Actions:** all mutations called directly from client components — no hand-written REST layer for CRUD.

### Why Server Actions instead of a REST API for CRUD?

- No duplicate DTO/serialization layer.
- Auth cookies are available server-side automatically.
- Progressive enhancement and smaller client bundles.
- The public API surface stays minimal: only 3 route handlers exist.

Trade-off: server actions are not a public API; if third-party integrations are needed later, a versioned REST/GraphQL layer should be added.

---

## 5. Route Map

### Pages

| Route | Type | Auth | Purpose |
|---|---|---|---|
| `/` | Static | Public | Marketing landing page |
| `/dashboard` | Dynamic | Required | Stats + form list + create form |
| `/dashboard/form/builder/[formId]` | Dynamic | Required | Drag-and-drop builder |
| `/dashboard/form/settings/[formId]` | Dynamic | Required | Detailed settings |
| `/dashboard/form/responds/[formId]` | Dynamic | Required | Responses + CSV export |
| `/public/submit-form/[formId]` | Dynamic | Public | Respondent-facing form |
| `/robots.txt` | Static | Public | Crawl rules |
| `/sitemap.xml` | Static | Public | Sitemap |

### Route handlers

| Route | Methods | Auth | Purpose |
|---|---|---|---|
| `/api/auth/[kindeAuth]` | GET | None | Kinde OAuth handler |
| `/api/fetchFormById` | GET | Required | Owner-scoped form fetch |
| `/api/upload` | POST | Required | Banner upload (Blob or local) |

### Layout guards

```tsx
// app/(routes)/dashboard/layout.tsx
const { isAuthenticated } = getKindeServerSession();
if (!(await isAuthenticated())) {
  redirect("/api/auth/login?post_login_redirect_url=/dashboard");
}
```

The guard prevents unauthenticated rendering, but **every server action still re-checks the session and ownership** — defense in depth.

---

## 6. Project Structure

```text
formy_ai/
├── app/
│   ├── layout.tsx                    # Fonts, metadata, JSON-LD, Toaster
│   ├── globals.css                   # Design tokens + base styles
│   ├── robots.ts                     # Env-aware robots.txt
│   ├── sitemap.ts                    # Env-aware sitemap
│   ├── (routes)/
│   │   ├── (landingPage)/            # Marketing route group
│   │   │   ├── page.tsx              # Composes all landing sections
│   │   │   ├── layout.tsx
│   │   │   └── _components/          # Hero, features, pricing, FAQ, …
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Auth guard + header
│   │   │   ├── page.tsx              # Stats + form grid (RSC + Suspense)
│   │   │   ├── form/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── builder/[formId]/page.tsx
│   │   │   │   ├── settings/[formId]/page.tsx
│   │   │   │   └── responds/[formId]/{page,loading}.tsx
│   │   │   └── _components/          # Builder, canvas, sidebar, settings, AI
│   │   └── public/
│   │       ├── layout.tsx
│   │       ├── submit-form/[formId]/{page,loading}.tsx
│   │       └── _components/          # FormSubmitComponent, NotAvaliable
│   └── api/
│       ├── auth/[kindeAuth]/route.ts
│       ├── fetchFormById/route.ts
│       └── upload/route.ts
├── actions/
│   ├── form.action.ts                # 12 server actions (CRUD, publish, submit, export)
│   └── ai.action.ts                  # AI generation action
├── components/
│   ├── blocks/                       # 13 block implementations + layouts
│   ├── ui/                           # shadcn/Radix primitives
│   ├── logo/index.tsx
│   └── BlockBtn*.tsx                 # Palette drag helpers
├── context/
│   └── builder-provider.tsx          # Builder state machine (client)
├── lib/
│   ├── app-url.ts                    # Env-aware deployment URL
│   ├── form-blocks.ts                # Block registry
│   ├── gemini.ts                     # Gemini client + fallback logic
│   ├── helper.ts                     # ID generation
│   ├── prismadb.ts                   # Singleton Prisma + Neon pool
│   ├── prompts.ts                    # AI prompt builder
│   ├── rate-limit.ts                 # Sliding-window limiter
│   ├── security.ts                   # SSRF/host checks, HTML escaping
│   ├── validations.ts                # Zod schemas
│   ├── webhook-safety.ts             # DNS + IP blocklist
│   └── utils.ts                      # cn()
├── @types/                           # Form + block domain types
├── constant/                         # Defaults, font maps
├── hooks/                            # use-toast, use-mobile
├── prisma/
│   ├── schema.prisma                 # 3 models
│   └── seed.ts                       # Commented-out template
├── next.config.mjs                   # Security headers
├── tailwind.config.ts                # Tokens, shadows, animations
└── package.json                      # Node 22 engines
```

---

## 7. Data Model

### ER diagram

```
┌───────────────────────────┐
│           Form            │
├───────────────────────────┤
│ id           Int      PK  │
│ formId       String   UQ  │◄── public identifier (UUID)
│ userId       String       │◄── Kinde subject (tenant key)
│ name         String       │
│ description  String       │
│ jsonBlocks   String       │◄── serialized block tree
│ views        Int          │
│ responses    Int          │◄── denormalized counter
│ published    Boolean      │
│ creatorName  String       │
│ creatorEmail String?      │
│ settingsId   Int      FK  │
│ createdAt    DateTime     │
│ updatedAt    DateTime     │
└─────┬───────────────────┬─┘
      │ *                 │ 1
      │                   │
      │ 1                 │ *
┌─────▼───────────┐  ┌────▼───────────────────────┐
│   FormSettings  │  │      FormResponses         │
├─────────────────┤  ├────────────────────────────┤
│ id              │  │ id           Int     PK    │
│ primaryColor    │  │ jsonReponse  String        │    ◄── map blockId → value
│ backgroundColor │  │ formId       Int     FK    │
│ bannerImage?    │  │ createdAt    DateTime      │
│ webhookUrl?     │  └────────────────────────────┘
│ maxResponses?   │
│ expiryDate?     │
└─────────────────┘
```

### Design decisions

| Decision | Rationale | Trade-off |
|---|---|---|
| `formId` UUID separate from `id` | Public URLs don't expose sequential PKs; stable identifier | Two identity columns |
| Layout stored as JSON string | A form shape is a **tree**, not a table; blocks evolve quickly | No SQL queries over individual fields |
| Response stored as JSON map | Schema-less answers follow the form tree | Orphaned keys if blocks are deleted |
| `responses` counter on `Form` | Fast dashboard stats without `COUNT(*)` | Must stay in sync with inserts |
| `views` counter | Intended for conversion analytics | **Never incremented today** (see limitations) |
| Settings as separate model | Keeps `Form` lean; evolution-friendly | Extra join on reads |
| No hard uniqueness on `settingsId` | Historical schema choice | App assumes 1:1; delete logic relies on it |
| `creatorEmail` denormalized | Avoids storing user profile locally | Backfilled on list fetch |

### Layout JSON contract

```json
[
  {
    "id": "row1",
    "blockType": "RowLayout",
    "attributes": {},
    "isLocked": true,
    "childblocks": [
      {
        "id": "h1",
        "blockType": "Heading",
        "attributes": {
          "label": "Customer feedback",
          "level": 1,
          "fontSize": "4x-large",
          "fontWeight": "normal"
        }
      },
      {
        "id": "p1",
        "blockType": "Paragraph",
        "attributes": {
          "label": "Description",
          "text": "Tell us how we did.",
          "fontSize": "small",
          "fontWeight": "normal"
        }
      }
    ]
  },
  {
    "id": "row2",
    "blockType": "RowLayout",
    "attributes": {},
    "childblocks": [
      {
        "id": "tf1",
        "blockType": "TextField",
        "attributes": {
          "label": "Your name",
          "helperText": "",
          "required": true,
          "placeHolder": "Jane Doe"
        }
      }
    ]
  }
]
```

### Response JSON contract

```json
{
  "tf1": "Jane Doe",
  "rs1": "Satisfied",
  "sr1": "4"
}
```

- Keys are **immutable block IDs** generated at build time.
- Values are strings; StarRating is stringified, Checkbox stores a joined/selected representation.
- The public form only submits **input block types**; layout/content blocks are ignored.

### Block taxonomy

| Category | Blocks |
|---|---|
| Layout | `RowLayout`, `ColumnsLayout` |
| Content | `Heading`, `Paragraph`, `Separator`, `Spacer` |
| Input | `TextField`, `TextArea`, `RadioSelect`, `Checkbox`, `Select`, `DatePicker`, `StarRating` |

Each block is an `ObjectBlockType`:

```ts
type ObjectBlockType = {
  blockCategory: "Layout" | "Field";
  blockType: FormBlockType;
  createInstance: (id: string) => FormBlockInstance;
  blockBtnElement: { icon: React.ElementType; label: string };
  canvasComponent: React.FC<{ blockInstance: FormBlockInstance }>;
  formComponent: React.FC<FormRenderProps>;
  propertiesComponent: React.FC<PropertiesRenderProps>;
};
```

This is a **registry + strategy pattern**: adding a block means creating one file and registering it in `lib/form-blocks.ts`. Open/Closed Principle in practice.

---

## 8. Core Workflows

### 8.1 Authentication and tenancy

1. `getKindeServerSession()` reads the Kinde session cookie.
2. Dashboard layout redirects unauthenticated users to Kinde login.
3. Every action calls `session.getUser()` and scopes queries by `user.id`.
4. Missing/foreign resources return `"Form not found or unauthorized"` — no existence leak.

### 8.2 Create form

```
Client (CreateForm dialog)
  → client-side gate: trimmed name length 2–100
  → createForm({ name, description })
    → Zod: name 2–100, description ≤ 500
    → Kinde session check
    → rate limit: 10 forms / user / hour
    → create FormSettings (default colors)
    → create Form with a locked RowLayout(Heading + Paragraph)
    → backfill creatorEmail via raw SQL
  → redirect to builder
```

Why a custom resolver? `@hookform/resolvers@3.9.1` reads `error.errors`, while Zod 4 exposes `error.issues` — the shipped `zodResolver` throws at runtime on invalid input. `CreateForm` uses a small `safeParse`-based resolver instead. Details in [Challenges](#15-engineering-challenges--fixes).

### 8.3 Builder: edit, save, publish

```
BuilderContextProvider
  → fetchBuilderFormById(formId)         [auth + ownership]
  → JSON.parse(jsonBlocks) → blockLayouts state

User edits
  → dnd-kit sensors (mouse 8px / touch 250ms)
  → context tree operations (add / duplicate / move / update)
  → properties panel writes attributes

Save
  → derive name/description from locked Heading/Paragraph
  → saveForm({ formId, name, description, jsonBlocks })
    → schema validates JSON and size (≤100KB)
    → ownership check
    → update Form
    → revalidateTag(`form-${formId}`)

Publish
  → optional maxResponses / expiryDate
  → updatePublish(formId, true)
    → ownership check
    → update published
    → revalidateTag(`form-${formId}`)
  → public URL becomes available
```

**Key invariant:** the first block is a locked layout containing the form title and description. Those values are the source of truth for `Form.name` and `Form.description` on save.

### 8.4 AI form generation

```
AIAssistanceBtn
  → build prompt (role, block contract, existing blocks, output schema)
  → generateAIPrompt(prompt)                    [server action]
    → auth + prompt length ≤ 4000
    → rate limit: 5 / user / minute
    → generateGeminiResponse(prompt)
        → model 1: gemini-3.5-flash-lite
        → fallback: gemini-3.8-flash on 404/408/429/5xx/timeout
        → 60s HTTP timeout, JSON MIME, 8192 output tokens
  → JSON.parse + runtime shape validation (recursive)
  → inject fresh unique IDs into every block/child
  → addQuestions → append; createForm → replace canvas
```

The AI is treated as **untrusted input**: output is parsed, shape-checked, and IDs are regenerated before it touches state.

### 8.5 Public form: render and submit

**Render**

```
GET /public/submit-form/[formId]
  → fetchPublishFormById(formId)
    → unstable_cache (1h, tag form-<id>)
    → published = true
    → attach settings fields via raw SQL
    → re-read response count + maxResponses + expiryDate
    → if cap reached or expired → "not available"
  → parse blocks → FormSubmitComponent
```

**Submit**

```
Client validation (required inputs, recursive walk)
  → collect input values into { blockId: value }
  → submitResponse(formId, JSON.stringify(values))
    → Zod: valid JSON, ≤100KB, formId ≤100
    → IP rate limit: 30 / form+IP / minute
    → form exists and is published
    → re-check maxResponses and expiryDate (authoritative)
    → create FormResponses row + increment Form.responses
    → fire webhook (if configured)
        → sync host checks + DNS resolution
        → block private/link-local/metadata targets
        → POST, redirect: "manual", 5s abort
    → fire email (if RESEND_API_KEY)
        → escape form name, strip CR/LF from subject
    → return { success: true }
  → thank-you state with reset option
```

Limits are checked **twice** (render and submit) because the cache can be stale: the cached read is a UX nicety, the submit check is the correctness guarantee.

### 8.6 Responses and export

- `fetchAllResponseByFormId` clamps `page ≥ 1` and `limit` to `1–100`, default 20.
- The response page server-renders the first page, then `AllReponds` appends pages client-side.
- CSV export:
  - authoritative fetch of all responses + current blocks;
  - headers from current block labels;
  - every cell quoted, quotes doubled;
  - leading `=`, `+`, `-`, `@` prefixed with `'` to stop spreadsheet formula injection;
  - UTF-8 BOM + CRLF for Excel compatibility.

### 8.7 Banner upload

```
Client pre-check (type + 4MB)
  → POST /api/upload (multipart)
    → Kinde auth (401)
    → content-length guard (413)
    → MIME whitelist: JPEG/PNG/WebP/GIF
    → magic-byte signature check (415)
    → if BLOB_READ_WRITE_TOKEN:
         PUT https://vercel.com/api/blob/?pathname=form-banners/<uuid>.<ext>
         headers: bearer token, x-api-version, public access, content type
         → { url }
      else if VERCEL:
         503 with actionable message
      else:
         write public/uploads/<uuid>.<ext> (dev/self-host)
    → updateFormSettings({ formId, bannerImage: url })
```

Client-supplied filenames are never used; the path is always `<uuid>.<ext>`.

---

## 9. Low-Level Design (LLD)

### 9.1 Module dependency graph

```
types ──────────────► constants
   │                     │
   ▼                     ▼
components/blocks ◄── lib/form-blocks ──► components/ui
   ▲
   │
context/builder-provider ◄── actions/form.action ◄── lib/prisma
   ▲                            │        │
   │                            │        ├── lib/validations ──► lib/security
   │                            │        ├── lib/webhook-safety
   │                            │        ├── lib/rate-limit
   │                            │        └── lib/app-url
   │                            └── lib/gemini ◄── actions/ai.action
   └── app/(routes)/dashboard/_components/*
```

Rules:

- `actions` may import `lib`, never `components`.
- `components` may call `actions` (RPC boundary), never import `lib/prisma`.
- `lib` is framework-light and testable.
- `context` owns builder state only; it does **not** persist anything.

### 9.2 Builder state model

```ts
type BuilderState = {
  loading: boolean;
  formData: FormWithSettings | null;   // server truth
  blockLayouts: FormBlockInstance[];   // local tree
  selectedBlockLayout: FormBlockInstance | null;
};
```

Operations (all immutable updates):

| Operation | Complexity | Notes |
|---|---|---|
| `addBlockLayout` | O(1) append | New root block |
| `removeBlockLayout` | O(n) | Also clears selection |
| `duplicateBlockLayout` | O(n + children) | Deep-clones children and assigns new IDs |
| `repositionBlockLayout` | O(n) | Splice remove + insert above/below |
| `insertBlockLayoutAtIndex` | O(n) | Drop from palette at index |
| `updateBlockLayout` | O(n) | Replace children array |
| `updateChildBlock` | O(n) recursive | Recursive map over the tree |
| `updateSettings` | O(1) | Optimistic settings merge |

**Single source of truth:** `blockLayouts` is the working copy; `saveForm` persists it. The builder does not autosave; unsaved edits are lost on navigation by design (explicit save model).

### 9.3 Server action contract

Every action returns a discriminated-ish result object:

```ts
type ActionResult<T = unknown> =
  | { success: true; message: string } & T
  | { success: false; message: string };
```

Principles:

- Never throw across the RSC boundary — catch, log, return a safe message.
- Validate **before** authenticating (cheap rejection of malformed input).
- Authenticate before touching the database.
- Verify ownership before every read/write.
- Revalidate cache tags after every mutation.

### 9.4 Validation strategy (Zod)

| Schema | Rules |
|---|---|
| `createFormSchema` | `name` trimmed 2–100; `description` ≤500 |
| `saveFormSchema` | `formId` ≥1; optional name ≤100 / description ≤500; `jsonBlocks` ≤100,000 chars and valid JSON |
| `submitResponseSchema` | `formId` 1–100; `response` ≤100,000 chars and valid JSON |
| `updateFormSettingsSchema` | colors ≤50; banner ≤10,000; webhook `""` or safe public URL; `maxResponses` int 1–1,000,000; `expiryDate` `""` or parseable |
| AI prompt | string, non-empty, ≤4,000 chars |
| Block properties | per-block schema (e.g. TextField: label 2–255, optional helper ≤255) |

Why both client and server validation?

- Client: immediate feedback, form gating, fewer wasted requests.
- Server: **the only trust boundary**; clients can be bypassed.

### 9.5 Authorization model

There is no RBAC. Authorization is **resource ownership**:

```
request → session.user.id
        → query WHERE { formId, userId }
        → if missing: same error as "not found"
```

- Public read: only `published = true`, and only via the public route.
- Public write: only `submitResponse`, rate-limited, capped, expiry-checked.
- Everything else: requires the owner's session.
- Sequential `Form.id` is never exposed; public URLs use `formId` (UUID).

### 9.6 Rate limiting algorithm

Sliding Window Log:

```
limit(identifier, max, windowMs):
  now = Date.now()
  timestamps = cache[key] filtered to (now - windowMs, now)
  if timestamps.length >= max: reject
  else: push(now); accept
```

| Bucket | Key | Limit |
|---|---|---|
| AI | `ai:<userId>` | 5 / minute |
| Form creation | `form-creation:<userId>` | 10 / hour |
| Responses | `form-response:<formId>:<ip>` | 30 / minute |

Properties:

- Exact (no fixed-window burst at boundaries).
- O(k) per check where k ≤ max.
- Map stored on `globalThis` so it survives dev hot reload.
- Cleanup interval purges entries older than 1 hour.

Limitation: **per-process memory**. On Vercel, each instance has its own counters, so the effective limit is `limit × instances`. Redis/Upstash is the correct production fix (packages already installed).

### 9.7 Caching design

```
unstable_cache(
  fetch form + settings,
  keyParts: [`form-${formId}`],
  { tags: [`form-${formId}`], revalidate: 3600 }
)
```

- Only **published form reads** are cached.
- Mutations call `revalidateTag(`form-${formId}`)`:
  - save layout,
  - publish/unpublish,
  - settings update,
  - delete.
- Response counts and caps are read **uncached** on every public load, so caps/expiry stay accurate within one query.
- Cache is deliberately per-form, not global, to avoid invalidating unrelated pages.

### 9.8 Error and failure semantics

| Failure | Behavior |
|---|---|
| Invalid input | `{ success: false, message }`, no DB work |
| Not authenticated | Generic unauthorized message |
| Not owner / not found | Identical message (no enumeration) |
| DB failure | Logged; generic “Something went wrong” |
| AI failure | Rate-limit-aware messages; internal logs include status |
| Webhook failure | Logged, submission still succeeds |
| Email failure | Logged, submission still succeeds |
| Blob failure | 502 with retry hint; local fallback only off-Vercel |

Design principle: **submission durability is never coupled to notification delivery**.

### 9.9 Recursive tree algorithms

The layout tree is walked in three places:

1. **Render** — canvas and public form recurse into `childblocks`.
2. **Validation** — required-field check recurses into children.
3. **Collection/Export** — flatten input blocks to `blockId → label` and `blockId → value`.

All walkers are depth-first and null-safe (`if (!block) return`). For a form with `n` blocks, each walk is O(n). No memoization is needed at current sizes; for very large forms, a flattened index map could be memoized per save.

### 9.10 API surface (route handlers)

| Endpoint | Input | Output |
|---|---|---|
| `POST /api/upload` | multipart `file` | `{ success, imageUrl }` |
| `GET /api/fetchFormById?formId=` | query param | `{ data: { success, message, form } }` |
| `GET /api/auth/[kindeAuth]` | Kinde protocol | Redirect/session |

---

## 10. Design System & UI Architecture

### Token layer

- Semantic color variables: `background`, `foreground`, `card`, `primary`, `muted`, `border`, `ring`, `sidebar-*`.
- Light and dark palettes defined in `app/globals.css`.
- Radius derived from `--radius`.
- Elevation tokens: `soft`, `lift`, `glow`.

### Typography

- **DM Sans** for UI — neutral, highly legible.
- **Instrument Serif** for editorial headings — gives the product a distinct, premium voice.
- Loaded with `next/font/google` → self-hosted, no layout shift, `display: swap`.

### Component strategy

- shadcn/ui primitives are copied into the repo, so they are fully customizable.
- Radix handles focus management, ARIA roles, portals, and keyboard interactions.
- Domain UI is composed from primitives + tokens; no ad-hoc hardcoded colors in new code.

### Responsive and motion

- Mobile-first Tailwind breakpoints.
- Builder switches between sidebar layout and mobile dialogs (`useIsMobile`).
- Framer Motion used sparingly: page entry, thank-you state, subtle transitions.
- `prefers-reduced-motion` is not explicitly handled — a future a11y improvement.

### UX details worth mentioning

- Save is explicit; publish offers limit configuration in one dialog.
- Form preview matches the public form.
- Unavailable forms render a branded fallback with a message from the server.
- Skeleton loaders on dashboard, public form, and responses.
- Floating share button appears only after publishing.
- Icon-only buttons carry `aria-label`s.

---

## 11. Security Model

### Threat model

| Asset | Threat | Control |
|---|---|---|
| Forms (confidentiality) | Cross-tenant access | `userId` scoping on every query |
| Responses (integrity) | Spam / flooding | IP + form rate limit, caps, expiry |
| Server network | SSRF via webhook URL | Sync host checks + DNS resolution + IP blocklist |
| Uploads | Malicious files / path traversal | Auth, MIME whitelist, magic bytes, UUID names, `wx` flag |
| Email | HTML/header injection | HTML escaping, CR/LF stripping |
| CSV exports | Formula injection | Leading `'` for `= + - @` |
| AI output | Malformed/malicious JSON | Parse, shape validation, ID regeneration |
| Dashboard | Clickjacking | `X-Frame-Options: DENY`, `frame-ancestors 'none'` |
| Browsers | MIME sniffing, referrer leakage | `nosniff`, strict referrer policy |
| API abuse | Enumeration/DoS | Generic errors, clamps, rate limits |

### Concrete controls

**Authentication & authorization**

- Kinde session checked in the dashboard layout and in every action.
- All form reads/writes filter by owner.
- Public access only through `fetchPublishFormById` with `published: true`.

**Input validation**

- Zod schemas at every server boundary.
- JSON payloads must parse and respect size limits.
- Numeric pagination clamped; form IDs length-limited.
- Webhook URLs restricted to http(s), no credentials, ≤2,000 chars, public hosts.

**SSRF defense (two layers)**

1. **Save-time (sync):** reject `localhost`, `.local`, `.internal`, `.home.arpa`, private/loopback/link-local/multicast IPv4 and IPv6 literals.
2. **Send-time (async):** DNS-resolve the hostname; reject if **any** resolved address is in a blocked range; use `net.BlockList`.

Also:

- `redirect: "manual"` prevents redirect-based SSRF pivots.
- 5-second `AbortController` timeout.
- `hostname` is re-checked after DNS resolution.

**Upload defense**

- Authenticated only.
- Content-length guard before reading the body.
- File size limit (4 MB) under the platform limit.
- MIME whitelist.
- Magic-byte verification so a `.jpg` with HTML content is rejected.
- Randomized UUID filenames.
- Write with `flag: "wx"` to avoid clobbering.
- Path is re-validated against the upload directory.
- Vercel Blob stores objects under a fixed `form-banners/` prefix.

**HTTP hardening**

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
/dashboard/*: X-Frame-Options: DENY, Content-Security-Policy: frame-ancestors 'none'
```

`poweredByHeader: false` removes the framework fingerprint.

**Information leakage**

- Unknown vs unauthorized resources return the same message.
- 500 responses are generic; details stay in server logs.
- AI failures don't echo provider internals to the client.

### Residual risks

- No CSP beyond `frame-ancestors` (no nonce/hash-based script policy).
- Webhook delivery can be abused for low-volume outbound requests (mitigated by ownership + rate limits, but not globally capped).
- Uploaded blobs are public by design (banner images).
- In-memory rate limits are per-instance.

---

## 12. Performance & Scalability

### Frontend

- RSC keeps data fetching server-side; client bundles stay focused on interactive islands.
- Route-level code splitting (Next.js).
- `Suspense` + skeletons for the form grid; `loading.tsx` for public/responds routes.
- Measured production build:

| Route | Page JS | First Load JS |
|---|---|---|
| `/` | 22.1 kB | 179 kB |
| `/dashboard` | 12.4 kB | 188 kB |
| `/dashboard/form/builder/[formId]` | 15.7 kB | 251 kB |
| `/dashboard/form/settings/[formId]` | 8.54 kB | 135 kB |
| `/dashboard/form/responds/[formId]` | 4.29 kB | 118 kB |
| `/public/submit-form/[formId]` | 2.96 kB | 282 kB |
| Shared by all | — | 103 kB |

Note: the public form has a high First Load because it pulls framer-motion and the full block registry. Lazy-loading motion and splitting blocks would reduce it.

### Backend

- **Aggregates, not counts:** dashboard stats use `prisma.form.aggregate`.
- **Pagination:** responses limited to 20 per page (max 100).
- **Relations in one query:** `include: { settings, formResponses }` avoids N+1.
- **Caching:** public form reads cached for 1 hour with tag-based invalidation.
- **Denormalized counter:** `Form.responses` avoids `COUNT(*)` on every dashboard render.
- **Serverless DB driver:** Neon adapter over WebSockets; global `WebSocket` requires Node 22 (pinned in `engines`).
- **Prisma singleton:** cached on `globalThis` outside production to avoid dev connection storms.

### Current bottlenecks

1. **AI latency** — external model calls dominate; 60-second ceiling.
2. **Serverless function body limit** — 4.5 MB, hence 4 MB upload cap.
3. **Cold starts** — Neon + Prisma initialization per new instance.
4. **In-memory rate limiting** — not global across instances.
5. **JSON payload size** — 100 KB layout/response caps bound the worst case but also limit very large forms.
6. **Unoptimized banner images** — full-size images on every public view.

### Scaling to 10× (summary)

- Move rate limiting and idempotency to Redis/Upstash.
- Queue webhook/email delivery (QStash/SQS) with retries and dead-letter handling.
- Serve published forms from edge cache with on-demand revalidation; keep submit checks authoritative.
- Direct-to-blob uploads with client tokens to bypass the function body cap.
- Add DB indexes (`Form.userId`, `FormResponses.formId, createdAt`, `Form.formId` already unique).
- Read replicas for dashboard analytics; precomputed stats table.
- Observability: structured logs, tracing, error tracking, SLOs.

---

## 13. Local Setup

### Requirements

- Node.js 22.x (pinned; required for global `WebSocket` used by Neon)
- npm
- A Neon/Postgres database
- Kinde application
- Google Gemini API key

### Steps

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env   # if present; otherwise create .env
# fill values from the table below

# 3. Apply the schema
npx prisma db push

# 4. Run
npm run dev
```

Open `http://localhost:3000`.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | Pooled Neon Postgres connection used by Prisma |
| `DIRECT_DATABASE_URL` | Optional | Direct connection for migrations/CLI |
| `KINDE_CLIENT_ID` | ✅ | Kinde app client ID |
| `KINDE_CLIENT_SECRET` | ✅ | Kinde app secret |
| `KINDE_ISSUER_URL` | ✅ | Kinde tenant issuer |
| `KINDE_SITE_URL` | ✅ | App origin registered in Kinde |
| `KINDE_POST_LOGIN_REDIRECT_URL` | ✅ | e.g. `http://localhost:3000/dashboard` |
| `KINDE_POST_LOGOUT_REDIRECT_URL` | ✅ | e.g. `http://localhost:3000` |
| `GEMINI_API_KEY` | ✅ | AI generation |
| `NEXT_PUBLIC_APP_URL` | ✅ (prod) | Canonical URL for links, SEO, emails |
| `RESEND_API_KEY` | Optional | Enables response emails |
| `RESEND_FROM_EMAIL` | Optional | Verified sender; defaults to `onboarding@resend.dev` |
| `BLOB_READ_WRITE_TOKEN` | Optional | Enables uploads on Vercel |

```env
DATABASE_URL="postgresql://…"
DIRECT_DATABASE_URL="postgresql://…"

KINDE_CLIENT_ID=…
KINDE_CLIENT_SECRET=…
KINDE_ISSUER_URL=https://your-tenant.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

GEMINI_API_KEY=…

NEXT_PUBLIC_APP_URL="http://localhost:3000"

RESEND_API_KEY=
RESEND_FROM_EMAIL="Formy.ai <notifications@yourdomain.com>"
BLOB_READ_WRITE_TOKEN=
```

---

## 14. Vercel Deployment

### Checklist

1. Push the repository (`.env`, `.next`, `node_modules`, `.vercel` are gitignored).
2. Import the project in Vercel.
3. Add every environment variable from the table above.
4. Set `NEXT_PUBLIC_APP_URL` to the production URL.
5. Create a **Vercel Blob** store and connect it → `BLOB_READ_WRITE_TOKEN`.
6. Update Kinde's allowed callback / logout URLs to the production domain.
7. Deploy. `postinstall` runs `prisma generate`; `next build` runs type-checking and lint.

### Platform-specific behavior

| Concern | Behavior |
|---|---|
| Node version | `engines: "22.x"` → Vercel uses Node 22 |
| Filesystem | Read-only → uploads go to Vercel Blob; local disk is dev-only |
| Request body | 4.5 MB cap → 4 MB upload limit |
| Database | Neon driver works over Node 22 global WebSocket |
| URLs | `getAppUrl()` falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL` |
| Leftover localhost URL | Ignored on Vercel if `NEXT_PUBLIC_APP_URL` is a loopback URL |
| SEO | `metadataBase`, robots, sitemap derive from the same helper |
| Serverless limits | Noticeable for long AI calls; consider `maxDuration` if plan limits apply |

### Post-deploy verification

```bash
# Public pages
curl -I https://your-app.vercel.app/
curl -I https://your-app.vercel.app/robots.txt
curl -I https://your-app.vercel.app/sitemap.xml

# Auth gate should redirect
curl -I https://your-app.vercel.app/dashboard

# Unauthenticated upload should be 401
curl -X POST https://your-app.vercel.app/api/upload

# Unpublished/missing form should render the fallback page
curl -I https://your-app.vercel.app/public/submit-form/unknown
```

---

## 15. Engineering Challenges & Fixes

### 15.1 Runtime `ZodError` when creating a form with a short name

**Symptom:** submitting a name shorter than 2 characters crashed at runtime with a `ZodError` instead of showing a message.

**Root cause:** Zod 4 exposes validation failures under `error.issues`; `@hookform/resolvers@3.9.1` reads `error.errors` and re-throws because it is not an array. The mismatch only surfaced on invalid input.

**Fix:**

- Replaced `zodResolver` in `CreateForm` with a small resolver built on `schema.safeParse`.
- Mapped issues into RHF's `FieldErrors`.
- Disabled submit until the trimmed name is 2–100 characters.
- Added a guard inside `onSubmit` as a second line of defense.
- Added a live character counter and helper text.

**Interview lesson:** dependency compatibility is a correctness risk; validate the *error* path, not just the happy path.

### 15.2 Server-Side Request Forgery in webhooks

**Symptom/risk:** users could set a webhook URL pointing at internal services, cloud metadata (`169.254.169.254`), or localhost.

**Fix:** two-stage validation (sync URL/host checks at save time, DNS + IP blocklist at send time), manual redirect handling, and a timeout.

**Plot twist:** the first blocklist included `::ffff:0:0/96` to catch IPv4-mapped IPv6. `net.BlockList.check()` also applied that subnet to **IPv4** addresses, so *every* public IPv4 was blocked — legitimate webhooks stopped working. Removing that subnet and handling mapped addresses explicitly fixed it.

**Interview lesson:** security controls need positive tests (public URL must pass) as well as negative tests.

### 15.3 Unauthenticated, unbounded file upload

**Risk:** an open upload endpoint, client-controlled filenames (path traversal), and no content verification.

**Fix:** Kinde auth, content-length and size caps, MIME whitelist, magic-byte checks, UUID filenames, `wx` writes, directory re-validation, generic errors.

### 15.4 Vercel's read-only filesystem

**Symptom:** uploads worked locally and failed in production.

**Fix:** detect `BLOB_READ_WRITE_TOKEN`; upload via the Vercel Blob REST API; fall back to local disk in dev; return a clear 503 on Vercel without a store. Also lowered the cap to 4 MB to stay under the 4.5 MB function body limit.

### 15.5 Hardcoded deployment URLs

**Symptom:** share links, emails, canonical URLs, robots, and sitemap all pointed at one hardcoded domain; copying localhost env values to Vercel broke production links.

**Fix:** `lib/app-url.ts` with a precedence chain (`NEXT_PUBLIC_APP_URL` → production URL → deployment URL → localhost), loopback rejection on Vercel, and `window.location.origin` for client-side sharing.

### 15.6 Prisma Client generation failures on Windows

**Symptom:** fields added to `FormSettings` (banner, webhook, caps, expiry) were rejected at runtime because the generated client couldn't be refreshed while files were locked.

**Fix (pragmatic, documented debt):** raw parameterized SQL for those four fields, tolerant reads for both `camelCase` and lowercased column keys, and a `db push` workflow. The correct long-term fix is regenerating the client in CI and adopting Prisma Migrate.

### 15.7 Expressing forms as data

**Challenge:** forms are user-defined trees, but Postgres is relational.

**Decision:** store the tree as validated JSON, keep responses as `blockId → value` maps. This unlocks arbitrary layouts, AI generation, and block-level extensibility with one table. The cost is weaker querying and orphaned keys when blocks are removed — accepted for the product stage and listed as future work (layout versioning + response normalization).

### 15.8 Neon + serverless WebSockets

**Challenge:** the Neon serverless driver needs a WebSocket implementation.

**Decision:** pin Node 22 (global `WebSocket`), use the Prisma Neon adapter with a pooled connection string, and keep a Prisma singleton. Avoid bundling `ws` into the runtime path.

### 15.9 Notification side effects inside the submission path

**Challenge:** a slow or failing webhook must not fail the respondent's submission.

**Decision:** write the response first, then fire webhook/email without awaiting their completion for the response result; each has its own catch and timeout. Trade-off: no retries; a queue is the production upgrade.

### 15.10 UI/UX overhaul without behavior changes

**Challenge:** modernize a working product without breaking builder behavior.

**Approach:** introduced design tokens and typography first, then rebuilt shells (landing, dashboard, builder chrome, settings, public form), preserved every handler and server contract, and verified with `tsc`, ESLint, a production build, and HTTP smoke tests. Component APIs stayed stable so logic did not move.

---

## 16. Known Limitations & Technical Debt

These are deliberate or acknowledged gaps — useful to discuss honestly in interviews.

### Correctness / product

1. **Views never increment.** `Form.views` exists and is displayed, but no code increments it. Conversion rate therefore reads 0 until views are tracked.
2. **Response keys are block-ID based.** Deleting or recreating blocks orphans historical answers; the UI labels them “Unknown field.” A layout version per response would fix this.
3. **Delete assumes 1:1 settings.** `settingsId` isn't unique in the schema; `deleteForm` deletes settings after the form. Safe for current app behavior, not enforced by the DB.
4. **No optimistic concurrency.** Two tabs saving the same form: last write wins.
5. **AI output validation is structural, not exhaustive.** Unknown block types are caught by rendering, but attributes aren't schema-checked per block before insertion.

### Reliability / platform

6. **In-memory rate limiting** is per instance; not global on serverless.
7. **No retry/queue for webhooks or email.** Failures are logged and dropped.
8. **`unstable_cache`** is an unstable Next API; semantics can change across majors.
9. **No Prisma migrations folder**; schema is applied with `db push`.
10. **Raw SQL workarounds** for four settings fields increase maintenance risk.

### Security / privacy

11. **No full CSP** beyond `frame-ancestors` for the dashboard.
12. **Public blobs** are permanent unless lifecycle rules are added.
13. **No audit log** for publish/settings changes.
14. **No explicit CSRF tokens**; relies on Next.js server-action origin checks and Kinde's cookie configuration.

### Quality / DX

15. **No automated tests** (unit, integration, e2e).
16. **No error monitoring or tracing.**
17. **Unused dependencies:** `ws`, `@upstash/*`, `@marsidev/react-turnstile`, unused `react-grab` wrapper.
18. **Builder DnD lacks a keyboard sensor**, limiting accessibility.
19. **No `prefers-reduced-motion` handling.**
20. **No response editing/partial submissions.**

---

## 17. Future Roadmap

### P0 — Production hardening

- Add Vitest (units: validation, URL safety, rate limiter, CSV) and Playwright (auth, create → build → publish → submit → export).
- CI: typecheck, lint, tests, build on every PR.
- Move rate limiting to Upstash Redis (packages already present).
- Queue webhooks/emails with retries, idempotency keys, and a dead-letter queue.
- Add Sentry/Axiom; structured logs with request IDs.
- Adopt Prisma Migrate; eliminate raw SQL workarounds.
- Track views properly (prerender + async increment) and expose conversion accurately.

### P1 — Scale and performance

- Direct-to-blob uploads with short-lived client tokens (bypass function body caps).
- Edge-cache published forms with tag-based revalidation.
- Cursor pagination for responses; indexes on `(formId, createdAt)`.
- Precomputed daily stats table; read replica for analytics.
- Lazy-load framer-motion and split the block registry per route.
- Blob lifecycle rules for replaced/deleted banners.
- Safe JSON layout versioning + migration script.

### P2 — Product depth

- Conditional logic, multi-page forms, calculated fields.
- File-upload and signature blocks.
- Partial submissions and resume links.
- Templates gallery and duplicate form.
- Teams, roles, and shared workspaces.
- Stripe billing and plan limits.
- Integrations: Zapier, Slack, Google Sheets.
- Custom domains and branded public pages.
- i18n and RTL support.

### P3 — Engineering excellence

- Storybook for design-system and block components.
- Contract tests for every server action.
- Load testing (k6) for submission endpoints.
- Feature flags and staged rollouts.
- Full accessibility audit and keyboard DnD.

---

## 18. Interview Preparation

### 18.1 The 60-second pitch

> “Formy.ai is a multi-tenant form builder built on Next.js App Router, React Server Components, and server actions. Creators design forms on a drag-and-drop canvas made of composable block strategies, or generate them with Gemini. The form layout is stored as a validated JSON tree, responses as a block-ID-to-value map in Postgres via Prisma and Neon. Publishing exposes a public route that re-checks caps and expiry on submission, rate-limits by form and IP, and asynchronously notifies the owner through a hardened webhook and email pipeline. I hardened the project end-to-end: authentication and ownership on every action, SSRF and upload defenses, tagged caching, and a Vercel-safe storage and URL strategy. The code builds clean with strict TypeScript, ESLint, and a production build, and I verified the routes with HTTP smoke tests.”

### 18.2 STAR stories

**Story A — The Zod crash**

- **Situation:** creating a form with a one-character name crashed at runtime.
- **Task:** make validation fail gracefully and prevent invalid submissions.
- **Action:** traced it to Zod 4 (`issues`) vs `@hookform/resolvers` 3.9 (`errors`); wrote a safeParse-based resolver, gated the submit button, and added a submit guard.
- **Result:** no runtime exception; invalid input is blocked before the request.

**Story B — SSRF defense**

- **Situation:** user-configured webhook URLs could reach internal networks.
- **Task:** allow legitimate public endpoints while blocking SSRF.
- **Action:** built sync host validation and async DNS/IP validation, blocked redirects, added timeouts; discovered and fixed a blocklist entry that accidentally blocked all IPv4.
- **Result:** metadata/private targets are rejected; public endpoints verified to pass.

**Story C — Vercel uploads**

- **Situation:** local uploads wrote to `public/uploads`, which is read-only on Vercel.
- **Task:** make uploads work serverlessly without adding heavy dependencies.
- **Action:** added Vercel Blob REST uploads, local fallback, a clear 503 path, and a 4 MB cap under the platform's 4.5 MB body limit.
- **Result:** uploads persist in production; misconfiguration is explainable instead of a generic 500.

**Story D — UI overhaul without regressions**

- **Situation:** a working but visually dated product needed a redesign.
- **Task:** modernize UI/UX without changing behavior.
- **Action:** introduced tokens and fonts, rebuilt page shells and states, preserved handlers and contracts, verified with typecheck/lint/build/smoke tests.
- **Result:** a consistent design system and a clean production build.

### 18.3 Likely questions and strong answers

**Q: Walk me through the architecture.**
RSC pages fetch and compose; client islands handle interaction; server actions own auth, validation, persistence, and side effects; `lib` holds infrastructure; Prisma talks to Neon. Public traffic hits one dynamic route with a cached read and uncached limit checks.

**Q: Why store form layouts as JSON instead of normalized tables?**
A form is a tree with user-defined nesting and rapidly evolving block types. JSON makes arbitrary layouts and AI generation trivial and keeps schema changes out of the DB. The trade-off is weaker relational querying and orphaned response keys; at scale I'd add layout versioning and possibly normalize answers for analytics.

**Q: How is authorization enforced?**
Kinde authenticates. Each action re-checks the session and scopes queries by `userId`; public reads require `published`; unknown and unauthorized return the same message. The layout guard is UX, not the security boundary.

**Q: How does the rate limiter work, and what breaks on serverless?**
Sliding window log per identifier. It's exact within a process, but serverless instances don't share memory, so effective limits multiply by instance count. Production fix: Redis with atomic scripts or Upstash Ratelimit.

**Q: How do you prevent SSRF?**
Validate the URL scheme, reject credentials, block private hostnames and IP ranges at save time; at send time resolve DNS, reject if any address is private, disable redirects, and time out after 5 seconds.

**Q: How does caching work?**
Published form reads use `unstable_cache` with a per-form tag and one-hour TTL. Mutations invalidate the tag. Response caps are read fresh so limits remain correct despite cached layout/settings.

**Q: What happens when a user submits a form?**
Client validates required fields recursively and sends a JSON map; server validates schema and size, rate-limits by form+IP, re-checks published/caps/expiry, inserts the response and increments the counter, then fires webhook and email without blocking the success response.

**Q: How do you handle AI output safely?**
Treat it as untrusted: parse JSON, verify the action type, recursively validate block shapes, regenerate all IDs, then apply. Rate-limit and cap prompt length. Errors are user-safe and logged server-side.

**Q: What would you scale first at 10× traffic?**
Global rate limiting, queued side effects, edge caching for published forms, direct-to-blob uploads, response pagination/indexes, and observability. The current app is already stateless except for the dev rate-limit cache.

**Q: What are the main bottlenecks?**
AI latency, Neon cold starts, the 4.5 MB function body cap, per-instance rate limiting, and unoptimized banner images.

**Q: What would you refactor first?**
Introduce tests and CI, then replace raw SQL settings updates with a properly generated Prisma client and migrations, then move rate limiting and side effects to managed infrastructure.

**Q: How do you ensure data isolation between users?**
Every read/write includes `userId`; public identifiers are UUIDs; no sequential IDs are exposed; unauthorized and missing resources are indistinguishable.

**Q: How do you handle failures in webhooks/email?**
They are isolated from the submission transaction, have timeouts, and log failures. The known gap is retries — a queue is the next step.

**Q: How would you test this system?**
Unit: Zod schemas, URL/SSRF checks, rate limiter, CSV escaping, tree operations. Integration: server actions against a test Postgres branch with a mocked session. E2E: create → build → publish → submit → export. Plus contract tests for AI output validation.

**Q: How would you evolve the JSON layout safely?**
Add `schemaVersion` and a migration pipeline: on read, upgrade old trees; on write, persist the current version. Keep block-level validators for attributes. Alternatively, normalize to `FormBlock` rows and keep a compiled JSON cache.

**Q: What was the hardest part?**
The interaction between external constraints: Zod/resolver version mismatch, serverless filesystem and body limits, SSRF filtering without false positives, and keeping behavior stable through a full UI redesign.

### 18.4 Numbers to quote

- 13 block types, 3 Prisma models, 12 form server actions + 1 AI action.
- 3 route handlers, 6 user-facing routes.
- Rate limits: 10 forms/hour/user, 5 AI requests/min/user, 30 responses/min/form+IP.
- Upload: 4 MB file cap, 4.5 MB request cap, 4 allowed image types, magic-byte verified.
- Cache: 1-hour TTL, tag `form-<formId>`, invalidated on 4 mutation types.
- Validation caps: 100 KB layout, 100 KB response, 4,000-char AI prompt.
- Build: 12 routes (9 static pages), 103 kB shared JS, 12–45 s compile on a local machine.

### 18.5 What to say you'd do differently

- Add tests and CI from day one, before hardening.
- Normalize or version the layout earlier.
- Use managed rate limiting and queues instead of in-memory/fire-and-forget.
- Generate the Prisma client in CI to avoid raw SQL workarounds.
- Track analytics events explicitly rather than relying on unused counters.
- Build accessibility (keyboard DnD, reduced motion) into the builder from the start.

---

## 19. Scripts & Verification

```bash
npm run dev       # Start development server
npm run build     # Production build (type-check + lint + compile)
npm run start     # Serve the production build
npm run lint      # ESLint
npx tsc --noEmit  # Type-check only
```

### Verification performed on this codebase

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ Clean |
| `npm run lint` | ✅ Clean |
| `rm -rf .next && npm run build` | ✅ 12 routes built, 9 static pages |
| `GET /` | ✅ 200 |
| `GET /dashboard` (no session) | ✅ 307 → Kinde login |
| `POST /api/upload` (no session) | ✅ 401 |
| `GET /api/fetchFormById` (no session) | ✅ 401 |
| `GET /public/submit-form/<unknown>` | ✅ 200 branded fallback |
| Security headers | ✅ Present on app and dashboard routes |
| App URL helper | ✅ Verified for local, production, custom domain, preview, and empty env |

---

## 20. License & Credits

- **License:** no `LICENSE` file is currently included. Add one (e.g. MIT) before distributing or accepting contributions.
- **Author:** built and maintained by [Ark](https://github.com/Ark898).
- **Acknowledgements:** Next.js, React, Prisma, Neon, Kinde, Google Gemini, Resend, Vercel Blob, shadcn/ui, Radix UI, dnd-kit, Tailwind CSS, Framer Motion, Lucide.
