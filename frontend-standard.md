React Frontend Standard
=======================

* * *
**Foreword**  
This standard draws on hands-on experience designing enterprise-scale front ends; complex application architectures with real-time data feeds and advanced WebGL/SVG presentation layers, supplemented with AI-assisted research to establish best practice (noting best practices is moving target).

This defines what good front-end design looks like in 2026, and serves as a reference checklist for evaluating generated code against established patterns.

Purpose
-------

This document defines the frontend architecture standard, non-functional requirements, and quality gates for Stanmore Resources.
It is designed to be pulled into any new frontend project as the governing reference.
The standard is React centric as that is our frontend of choice - however - most aspects carry over to other frontend stacks.

AI generated front-ends produces 1.7× more issues per PR than human-written code.
Security gaps 2.7× more common and error handling 2× more frequently missing.

These concerns can be reduced in several ways::
 - Using reference patterns and standards (this document)
 - Linting standards / automation in CICD (mypy, ruff, eslinit),
 - Using autoamted code quality / analysis tools

To address the other concerns, the [Engineering SDLC w agents](/Architecture-Practice/Governance/Engineering-SDLC-w-agents) (draft - needs review / owernship decided) has been created.  
The broader toolchain envinroment is here [SDLC Toolchain](/Way-of-Working-Requirement-to-Delivery-\(draft\)/SDLC-Toolchain) (also draft - to evolve thorugh practice).


**Scope:**
 - All React/TypeScript single-page applications deployed on Azure (Static Web Apps, App Service).
 - Does NOT cover backend APIs, mobile applications, or static sites.

**Enforcement:**
Standards marked ⚙️ should be enforced by tooling (ESLint, CI gates, SonarQube).
Standards marked 👁️ require human review. Standards marked 📐 are architectural principles verified at design review.

**Importing Standards to code**
This standard can be imported into frontend application directly from this wiki using:
   > `git submodule add <wiki-repo-url> <local-path>` and commit the `.gitmodules` file.

Subsequent clones should use `git clone --recurse-submodules`, or run `git submodule update --init --recursive` on an existing clone.



* * *

# 1. Strategy — Deciding What Concerns to Manage


Before choosing a framework or pattern, a frontend architecture must identify what concerns the application needs to manage.

Not every application needs every concern — a static marketing site has different needs than an enterprise search platform.

The strategy step is to **inventory the concerns** and then **select the patterns** that address them.

## 1.1 Concern Inventory

| Concern | Question to Ask | When It Matters |
| --- | --- | --- |
| **Data fetching** | How does the UI get data from the backend? | Always |
| **Data caching** | Should previously-fetched data be reused, or always re-requested? | When the same data is accessed from multiple views or components |
| **Data staleness** | How does the UI know when its data is outdated? | When backend data changes independently of user actions |
| **Optimistic updates** | Should the UI update immediately before the server confirms? | When perceived responsiveness matters (e.g. saving preferences) |
| **Loading and error state** | How does the UI communicate pending requests and failures? | Always |
| **Authentication** | How are tokens acquired, refreshed, and injected? | Any authenticated application |
| **Authorisation / RBAC** | How does the UI show/hide features based on user role? | Role-differentiated interfaces |
| **Navigation / routing** | How does the user move between views, and is that state in the URL? | Any multi-view application |
| **Deep linking** | Can a specific view state be bookmarked or shared? | Collaborative or reference applications |
| **Form state** | How is multi-field input managed, validated, and submitted? | Data entry applications |
| **UI state** | How are panel visibility, widths, theme, and layout preferences tracked? | Complex layouts with user-configurable panels |
| **Cross-component communication** | How do sibling components share data without prop drilling? | When 2+ components need the same data but don't have a parent-child relationship |
| **Real-time updates** | Does the UI need to reflect server-side changes without user action? | Dashboards, collaboration, monitoring |
| **Offline / resilience** | Should the app work (even partially) when the network is unavailable? | Field/mobile applications |
| **Pagination / virtualisation** | How does the UI handle large result sets? | Any list/table with unbounded results |
| **Undo / history** | Can the user reverse actions or navigate state history? | Editors, complex workflows |
| **Accessibility** | How is keyboard navigation, screen reader support, and focus management handled? | All user-facing applications (legal/compliance requirement) |
| **Internationalisation** | Does the UI need to support multiple languages or locales? | Global or multi-region applications |
| **Testing** | How are components, hooks, and integration flows tested? | Any production application |

## 1.2 Strategy Decision

For each concern, the team decides:
1.  **Not applicable** — the application doesn't need this (e.g. offline support for an intranet-only tool).
2.  **Deferred** — needed eventually but not for the first release. Document the decision so it's intentional, not accidental.
3.  **Managed by convention** — handled by a team coding standard but no dedicated library or pattern (e.g. "all components must handle loading and error states").
4.  **Managed by pattern** — addressed by a specific architectural pattern or library (e.g. TanStack Query for data fetching/caching, React Router for navigation, Zustand for cross-component state).
The output of this step is a **concern matrix** that documents what the application manages, how, and what was intentionally deferred. This prevents the most common failure mode: concerns that are neither addressed nor explicitly deferred — they're simply unmanaged, and the consequences emerge in production.

* * *

# 2. Architecture Patterns

## 2.1 MVC in React

| Layer | Responsibility | React Implementation |
| --- | --- | --- |
| **Model** | Owns domain data, business rules, and data lifecycle (fetch, cache, validate, transform, persist). The Model does not know about the UI. | Custom hooks (`useDocumentSearch`, `useAIChat`), stores (Zustand), or TanStack Query. Type definitions + behaviour. |
| **View** | Renders UI from data provided to it. The View does not fetch data, manage auth, or contain business logic. It receives data and callbacks as props. | React components — JSX, styling, layout. Purely presentational. |
| **Controller** | Orchestrates the interaction between Model and View. Handles user actions, calls Model methods, and selects which View to render. | Page-level components or route handlers that wire Models to Views. |

**The key discipline:**
 - A View component should be renderable with test data and no backend.
 - If you can't render `<ListDocuments results={mockData} />` in a test harness without a running API, the View is doing too much.


## 2.2 MVVM — Hooks as ViewModels
In practice, React's custom hooks make MVVM the most natural pattern.
 - A hook like `useDocumentSearch()` is a ViewModel.
 - A ViewModel exposes `{ results, isLoading, search, clearResults }` and the View component renders from those values.

| Layer | Responsibility | React Implementation |
| --- | --- | --- |
| **Model** | Domain data and business rules | Same as MVC |
| **ViewModel** | Exposes reactive state for a specific View. Translates Model data into View-ready format. | Custom hooks returning `{ data, loading, error, actions }`. The hook _is_ the ViewModel. |
| **View** | Binds to ViewModel state and renders. | Components that call a custom hook and render from its return value. |

## 2.3 Container / Presentational

| Type | Responsibility | Rule |
| --- | --- | --- |
| **Container** (Smart) | Calls hooks, manages state, wires data to children | `SearchPage` calls `useDocumentSearch()`, passes results to `ResultsTable` |
| **Presentational** (Dumb) | Receives props, renders UI, calls callback props for user actions. No `useState` for data, no `useEffect`, no direct API calls. | `ResultsTable` receives `results[]` and `onRowClick`, renders a table |
**The test:** if a component has both `useState`/`useEffect` for data management AND complex JSX rendering, it's doing both jobs. Split it. ⚙️ Enforced by `max-lines-per-function: 50`.

### 2.4 Feature-Based Folder Structure 📐

    src/
    ├── app/                  # App shell, routes, providers
    ├── features/             # Feature modules
    │   └── search/
    │       ├── api/          # TanStack Query hooks + service functions
    │       ├── components/   # Feature-specific UI
    │       ├── hooks/        # Feature-specific logic
    │       ├── types/        # Feature-specific types
    │       └── utils/        # Feature-specific utilities
    ├── components/           # Shared UI components
    ├── hooks/                # Shared hooks
    ├── lib/                  # Pre-configured libraries (API client, auth)
    ├── types/                # Shared types
    └── utils/                # Shared utilities
   

Import rules (enforced by `eslint-plugin-boundaries`):
*   Pages → features → shared components → hooks → utils → types.
*   **Features cannot import from other features.** Cross-feature data sharing goes through shared hooks or the controller layer.
*   No circular dependencies. ⚙️ Enforced by `eslint-plugin-import/no-cycle`.

## 2.5 State Management Decision Tree 📐

| State Type | Solution | When |
| --- | --- | --- |
| Server/remote data | TanStack Query | Always. ~80% of what teams put in Redux is actually server state. |
| Single-component UI state | `useState` | Toggle, input value, panel open/closed |
| Shared between parent-child (2–3 levels) | Prop drilling | Explicit and traceable. Refactor at 4+ levels. |
| Low-frequency global state | React Context | Theme, auth, locale. Not for data that updates frequently. |
| High-frequency shared UI state | Zustand | Panel widths, complex layout preferences, cross-feature UI coordination |

## 2.6 Barrel Files

Strongly discouraged in application code.
Barrel `index.ts` files cause bundle bloat, circular imports, and slower test execution.
The Next.js team documented removing barrels reducing module loads from 11,000 to 3,500.
One exception: a single `index.ts` at the feature boundary acting as a public API.

* * *

# 3. Well-Architected Layers

## 3.1 Model Layer

**3.1.1 API Client (Data Access)**
A single, typed HTTP client that all data fetching flows through.
| Requirement | Enforcement |
| --- | --- |
| Centralised auth injection via interceptor, not passed per-call | 📐 |
| Base URL from environment config (`VITE_API_BASE_URL`), not hardcoded | ⚙️ ESLint no-restricted-syntax for hardcoded URLs |
| HTTP errors transformed into typed error objects with status, message, detail | 👁️ |
| AbortController support so navigating away cancels in-flight requests | 👁️ |
| Request and response types enforced — generated from OpenAPI spec where available | 📐 |
| Client swappable with mock implementation for testing | 📐 |
| Backend base URL changeable in one config file, not scattered across components | ⚙️ |

**3.1.2 Domain Models (Custom Hooks)**
Each domain concern gets its own Model hook that encapsulates data, loading state, error state, and operations.
Rules for custom hooks:
*   One hook per file.
*   `use` prefix only if it calls other React hooks. Otherwise it's a utility function.
*   Return objects `{ data, isLoading, error, actions }` for multi-value hooks.
*   Type all inputs and outputs explicitly.
*   If a component has >30 lines of logic before its JSX return, extract into a hook.
*   Hooks do not depend on other domain hooks unless the dependency is explicit and injected.
*   Hooks are unit-testable without rendering any component.

**3.1.3 Data Caching and Staleness (TanStack Query)**
| Capability | Implementation |
| --- | --- |
| Cache by key | Query key factories: `['documents', 'search', { query, filter }]` |
| Stale-while-revalidate | `staleTime: 5 * 60 * 1000` (5 min) for non-critical data |
| Deduplication | Built into TanStack Query — two components requesting the same key fire one fetch |
| Invalidation | `queryClient.invalidateQueries()` on mutation success |
| Background refresh | `refetchOnWindowFocus: true` for dashboard data |
| Optimistic updates | `onMutate` → update cache → `onError` → rollback |

## 3.2 View Layer

**3.2.1 Presentational Components**
| Requirement | Enforcement |
| --- | --- |
| All data via props. No internal `fetch()`, no direct API access. | 👁️ |
| Rendering logic only. No data transformation, no filter application. | 👁️ |
| User interactions fire callback props. The View doesn't know what happens next. | 👁️ |
| Testable in isolation with mock data. No backend, no auth, no network. | 👁️ |
| Consistent sizing — no layout dependent on data content (graceful overflow/truncation). | 👁️ |
| Keyboard navigable, screen reader compatible, correct ARIA attributes. | ⚙️ `eslint-plugin-jsx-a11y` |

**3.2.2 Layout Components**
| Requirement | Enforcement |
| --- | --- |
| Slot-based composition (`<WorkspaceLayout sidebar={...} main={...} />`). | 📐 |
| Responsive — adapts to viewport. Resize logic lives here, not in business components. | 👁️ |
| No data awareness — doesn't know about documents, search results, or chat history. | 👁️ |

## 3.3 Controller Layer

**3.3.1 Page / Route Components**
| Requirement | Enforcement |
| --- | --- |
| Calls Model hooks: `const { results, loading, search } = useDocumentSearch()` | 👁️ |
| Passes data to Views: `<ResultsTable results={results} isLoading={loading} />` | 👁️ |
| Handles navigation — route changes, query parameter updates, deep link resolution | 👁️ |
| Orchestrates cross-model interactions in the Controller, not in either Model | 📐 |
| Minimal JSX — mostly `<View prop={modelData} />` wiring. If 200+ lines of JSX, extract Views. | ⚙️ `max-lines-per-function` |

**3.3.2 Router Integration**
| Requirement | Enforcement |
| --- | --- |
| URL-driven state — current view, filters, search query reflected in URL | 👁️ |
| Deep linking — bookmark `/workspace?q=safety&site=SWC` and return to exact state | 👁️ |
| Browser back/forward work as expected | 👁️ |
| Route-level code splitting with `React.lazy()` + `Suspense` | ⚙️ Bundle budget |

## 3.4 Cross-Cutting Concerns

| Concern | Layer | Implementation |
| --- | --- | --- |
| Authentication | Shared service → Model (API Client) | `useAuth()` hook + HTTP interceptor |
| Error boundaries | View — wraps component subtrees | Three levels: root, route, widget |
| Theme / design tokens | View — CSS variables | CSS custom properties + `data-theme` attribute |
| Logging / telemetry | Cross-cutting | Application Insights SDK |
| Feature flags | Controller — decides which View to render | Feature flag service or env-var driven |

## 3.5 Platform-Level Centralisation 📐

Capabilities needed by every application should be implemented once at the platform layer and consumed as infrastructure, not reimplemented as application code.
| Concern | Platform layer (implement once) | App layer (if no platform) | Risk of N independent implementations |
| --- | --- | --- | --- |
| JWT validation | APIM validate-jwt policy | Each app's own JWT middleware | N implementations to audit and patch |
| Rate limiting | APIM rate-limit policy | Each app's own (or none) | Downstream services unprotected |
| WAF / API security | Azure Front Door + WAF | Bare App Service endpoints | N separate attack surfaces |
| API versioning | APIM version sets | Each app's URL prefix scheme | Breaking changes break consumers silently |
| Auth token acquisition | Shared npm package wrapping MSAL | Each frontend's own MSAL config | N copies, each with accessToken/idToken confusion risk |
| Request logging | APIM diagnostic logging → single App Insights | Each app's own telemetry pipeline | No cross-app correlation |
| API discovery | APIM developer portal | Tribal knowledge | No single catalogue |
| SSL / certificates | Front Door / APIM TLS termination | Each App Service's own cert | N certificates to track and rotate |
**Decision rule:** if a capability is needed by all apps, will never differ between apps, and failure to keep implementations in sync creates security or compliance risk — it belongs at the platform layer.

* * *

# 4. Code Quality Standards

## 4.1 Complexity and Size Limits ⚙️

| Metric | Threshold | ESLint / Sonar Rule |
| --- | --- | --- |
| Cognitive complexity per function | ≤ 15 | `sonarjs/cognitive-complexity` |
| Cyclomatic complexity per function | ≤ 10 | `complexity` |
| Lines per function | ≤ 50 (skip blanks/comments) | `max-lines-per-function` |
| Lines per file | ≤ 250 (skip blanks/comments) | `max-lines` |
| Function parameters | ≤ 3 | `max-params` |
| Nesting depth | ≤ 3 | `max-depth` |
| Max nested callbacks | ≤ 2 | `max-nested-callbacks` |
| Code duplication (new code) | ≤ 3% | SonarQube quality gate |
| Props per component | ≤ 7 | 👁️ Code review |

## 4.2 AI-Generated Code — Known Failure Modes 👁️

AI coding tools consistently produce these anti-patterns. Every PR review must check for them:
| Failure Mode | What To Look For |
| --- | --- |
| God components | Single file with data fetching + state + validation + 200+ lines of JSX |
| No error handling | `catch(e) { console.log(e) }` or no error boundaries |
| Hardcoded URLs | API endpoints as string literals instead of environment variables |
| Happy-path-only rendering | No loading spinner, no error message, no empty state |
| Dependency bloat | New `npm install` for functionality already in the project |
| Style soup | Inline styles mixed with Tailwind mixed with CSS modules in one feature |
| Stale patterns | Class components, `componentDidMount`, patterns from pre-hooks era |
| Over-engineering | Unnecessary abstractions, premature generalisations, factory-of-factories |
| Phantom imports | Importing packages that don't exist in `package.json` |

## 4.3 SonarQube Quality Gate ⚙️

Apply SonarQube "Sonar Way" as baseline on all new code:
*   Zero new bugs, zero new vulnerabilities, zero new security hotspots.
*   Maintainability rating: A.
*   Code duplication on new code: ≤ 3%.
*   Coverage on new code: ≥ 80%.
SonarQube's AI Code Assurance features (2025+) automatically apply stricter analysis to AI-generated code when detected.

* * *

# 5. Non-Functional Requirements

## NFR-PERF: Performance

| ID | Requirement | Target | Enforcement |
| --- | --- | --- | --- |
| NFR-PERF-001 | Largest Contentful Paint (LCP) | ≤ 2.5s (p75) | ⚙️ Lighthouse CI |
| NFR-PERF-002 | Interaction to Next Paint (INP) | ≤ 200ms (p75) | ⚙️ Lighthouse CI |
| NFR-PERF-003 | Cumulative Layout Shift (CLS) | ≤ 0.1 | ⚙️ Lighthouse CI |
| NFR-PERF-004 | Initial JS bundle (gzipped) | ≤ 200 KB | ⚙️ `size-limit` in CI |
| NFR-PERF-005 | Lighthouse Performance score | ≥ 90 | ⚙️ Lighthouse CI |
| NFR-PERF-006 | Time to Interactive | ≤ 5s first load | 👁️ Lighthouse |
| NFR-PERF-007 | Route-based code splitting | All routes use `React.lazy` + `Suspense` | 👁️ |
| NFR-PERF-008 | No heavy libraries where lightweight alternatives exist | e.g. day.js (2 KB) not moment.js (72 KB) | 👁️ |

## NFR-A11Y: Accessibility

| ID | Requirement | Target | Enforcement |
| --- | --- | --- | --- |
| NFR-A11Y-001 | WCAG compliance level | 2.2 AA minimum | 👁️ + ⚙️ |
| NFR-A11Y-002 | Contrast ratio (normal text) | ≥ 4.5:1 | ⚙️ `eslint-plugin-jsx-a11y` |
| NFR-A11Y-003 | Keyboard accessibility | All interactive elements reachable and operable | 👁️ Manual testing |
| NFR-A11Y-004 | Focus indicators | Visible, ≥ 3:1 contrast | 👁️ |
| NFR-A11Y-005 | Touch/click targets | ≥ 24×24 CSS pixels | 👁️ |
| NFR-A11Y-006 | Lighthouse Accessibility score | ≥ 90 | ⚙️ Lighthouse CI |
| NFR-A11Y-007 | Automated a11y checks in tests | `jest-axe` on all rendered components | ⚙️ |
Automated tools catch only 30–40% of accessibility issues. Manual keyboard and screen reader testing is required before go-live.

## NFR-SEC: Security

| ID | Requirement | Target | Enforcement |
| --- | --- | --- | --- |
| NFR-SEC-001 | XSS prevention | Never use `dangerouslySetInnerHTML` without DOMPurify | ⚙️ ESLint rule |
| NFR-SEC-002 | User-controlled href | No `javascript:` protocol in href attributes | ⚙️ `jsx-a11y/no-invalid-href` |
| NFR-SEC-003 | Token storage | `httpOnly` cookies, never `localStorage` | 📐 |
| NFR-SEC-004 | Content Security Policy | `script-src 'self'`; no inline scripts | 📐 |
| NFR-SEC-005 | Dependency vulnerabilities | Zero high/critical in `npm audit` | ⚙️ CI gate |
| NFR-SEC-006 | No secrets in frontend env vars | API keys, connection strings never in `VITE_*` variables | 👁️ |
| NFR-SEC-007 | HTTPS enforced | All environments, no mixed content | ⚙️ |
| NFR-SEC-008 | Dependency scanning | Dependabot enabled on repo | ⚙️ |

## NFR-ERR: Error Handling and Resilience

| ID | Requirement | Target | Enforcement |
| --- | --- | --- | --- |
| NFR-ERR-001 | Error boundary — root level | Catastrophic failure page with reload button | 👁️ |
| NFR-ERR-002 | Error boundary — route level | Page-level crash isolated, nav still works | 👁️ |
| NFR-ERR-003 | Error boundary — widget level | Widget failure doesn't break the page | 👁️ |
| NFR-ERR-004 | All data-fetching hooks expose error state | `{ data, isLoading, error }` pattern | 👁️ |
| NFR-ERR-005 | No empty catch blocks | All caught errors handled or re-thrown | ⚙️ `no-empty` + `sonarjs/no-ignored-exceptions` |
| NFR-ERR-006 | No `console.log` in production | Use structured logging or remove | ⚙️ `no-console` (warn in dev, error in prod) |
| NFR-ERR-007 | Graceful degradation | Network failure shows retry option, not blank screen | 👁️ |

### NFR-OBS: Observability

| ID | Requirement | Target | Enforcement |
| --- | --- | --- | --- |
| NFR-OBS-001 | Production error tracking | Application Insights or Sentry integrated | 📐 |
| NFR-OBS-002 | Unhandled exceptions captured | Global error handler + error boundaries report to telemetry | 👁️ |
| NFR-OBS-003 | API call tracking | All fetch requests logged with correlation ID, latency, status | 👁️ |
| NFR-OBS-004 | Page view tracking | Route changes logged | 👁️ |
| NFR-OBS-005 | No PII in logs | User names, emails, tokens excluded from telemetry | 👁️ |

## NFR-MAINT: Maintainability

| ID | Requirement | Target | Enforcement |
| --- | --- | --- | --- |
| NFR-MAINT-001 | TypeScript strict mode | `"strict": true` in `tsconfig.json` | ⚙️ |
| NFR-MAINT-002 | No `any` types | `@typescript-eslint/no-explicit-any` | ⚙️ |
| NFR-MAINT-003 | Consistent formatting | Prettier with project config | ⚙️ Pre-commit hook |
| NFR-MAINT-004 | Import ordering | Consistent, enforced by `eslint-plugin-import` | ⚙️ |
| NFR-MAINT-005 | JSDoc on all exports | Descriptions on exported functions, types, interfaces | ⚙️ `eslint-plugin-jsdoc` |
| NFR-MAINT-006 | No dead code | Unused variables, imports, and functions removed | ⚙️ `no-unused-vars` |
| NFR-MAINT-007 | Feature-based folder structure | As defined in Section 2.4 | 📐 |
| NFR-MAINT-008 | No barrel files in features | One `index.ts` at feature boundary only | 👁️ |

* * *

# 6. Testing Strategy

## 6.1 Testing Trophy Model

Prioritise integration tests over unit tests, with static analysis as the foundation.
| Layer | Proportion | Tool | What to test |
| --- | --- | --- | --- |
| Static analysis | Foundation | TypeScript + ESLint | Type errors, lint violations, a11y rules |
| Unit tests | ~20% | Vitest | Pure functions, utilities, data transformations |
| Integration tests | ~60% | Vitest + React Testing Library + MSW | Component behaviour, hook interactions, user flows within a feature |
| E2E tests | ~20% | Playwright | 5–15 critical user journeys across the full application |

## 6.2 React Testing Library Rules ⚙️

*   Query priority: `getByRole` → `getByLabelText` → `getByText` → `getByTestId` (last resort).
*   Use `userEvent` not `fireEvent` for realistic interactions.
*   Test user-visible behaviour, not implementation details. Don't assert on state variables or hook internals.
*   Use MSW (Mock Service Worker) for network-level API mocking — not manual fetch mocks.
*   Install `eslint-plugin-testing-library` and `eslint-plugin-jest-dom`.

## 6.3 Coverage Thresholds ⚙️

| Scope | Branches | Functions | Lines |
| --- | --- | --- | --- |
| Global minimum | 70% | 75% | 80% |
| Business logic / utils | 90% | 90% | 90% |
| UI components | 60% | 70% | 70% |
Branch coverage is the most meaningful metric — it reveals untested decision paths.
Review AI-generated tests critically. AI tends to verify implementation details rather than behaviour, and frequently tests that the mocked value equals the mocked value.

## 6.4 Visual Regression Testing

Use Playwright's built-in `toHaveScreenshot()` for visual regression on critical screens. For component-level visual testing, Chromatic (free tier: 5,000 snapshots/month) integrates with Storybook.

* * *

# 7. Dependency Management

| Requirement | Enforcement |
| --- | --- |
| Use `npm ci` (not `npm install`) in CI pipelines | ⚙️ CI config |
| `package-lock.json` committed and verified with `lockfile-lint` | ⚙️ |
| Dependabot or Renovate enabled for automated vulnerability alerts | ⚙️ |
| `npm audit --audit-level=high` passes in CI | ⚙️ CI gate |
| Run `depcheck` to find unused dependencies before each release | 👁️ |
| Bundle analysis with `size-limit` in CI; `source-map-explorer` for investigation | ⚙️ + 👁️ |
| No duplicate-purpose packages (e.g. both axios and got, both moment and dayjs) | 👁️ |

* * *

# 8. ESLint Configuration

The following plugins form the enforcement layer. All must be present in every project:
| Plugin | Purpose |
| --- | --- |
| `eslint-plugin-boundaries` | Architectural layer boundary enforcement |
| `eslint-plugin-sonarjs` | Cognitive complexity, code smell detection |
| `eslint-plugin-import` | Circular dependency detection, import ordering |
| `eslint-plugin-react-hooks` | Rules of Hooks |
| `eslint-plugin-jsx-a11y` | Accessibility rules |
| `eslint-plugin-unicorn` | Modern JS best practices |
| `eslint-plugin-testing-library` | Testing anti-pattern detection |
| `eslint-plugin-jsdoc` | Documentation enforcement on exports |

Pre-commit: **Husky + lint-staged** → ESLint `--fix` + Prettier on staged files.
CI pipeline:
1.  `eslint --max-warnings 0`
2.  `tsc --noEmit`
3.  `vitest run --coverage`
4.  `npx size-limit`
5.  `npm audit --audit-level=high`
6.  SonarQube quality gate

* * *


# 9. Documentation Standards
--------------------------

## 9.1 Architecture Decision Records

Store in `docs/decisions/` within the repo. Use MADR v4.0 template: Status, Context and Problem Statement, Considered Options, Decision Outcome, Consequences. Every technology choice (state library, styling approach, build tool) warrants an ADR.

## 9.2 Component Catalogue

Storybook 8+ (Vite builder) for all shared/reusable components. Document component states: default, loading, error, empty, disabled.

## 9.3 AI Context File

Every repo must include a `CLAUDE.md` (or `.cursorrules`) file defining project conventions, folder structure, preferred patterns, and anti-patterns. This file is injected as context for AI tools and measurably improves output quality.

## 9.4 README Standard

Every frontend repo README must include: project purpose (one paragraph), architecture overview (link to ADR), local development setup, environment variables table, deployment process, and testing instructions.

* * *

# 10. Recommended Stack
---------------------

| Concern | Tool | Rationale |
| --- | --- | --- |
| Build | **Vite** | Fast dev server, content-hashed output, ESM-native |
| Framework | **React 18+** | Established, strong ecosystem, AI tools trained on it |
| Language | **TypeScript (strict)** | Type safety catches AI errors at compile time |
| Server state | **TanStack Query v5** | Caching, dedup, invalidation, optimistic updates |
| Client state | **Zustand** | Minimal API, no boilerplate, works outside React |
| Routing | **React Router v6+** | URL-driven state, code splitting support |
| Styling | **Tailwind CSS + shadcn/ui** | Utility-first, accessible primitives, AI-friendly |
| Forms | **React Hook Form + Zod** | Performant, schema-based validation |
| Testing (unit/integration) | **Vitest + React Testing Library + MSW** | Fast, Vite-native, realistic mocking |
| Testing (E2E) | **Playwright** | Multi-browser, built-in parallelisation, visual regression |
| Linting | **ESLint + plugin stack (§8)** | Primary enforcement mechanism |
| Formatting | **Prettier** | Zero-debate formatting |
| Quality gate | **SonarQube** | Complexity, duplication, coverage on new code |
| Observability | **Azure Application Insights** | Stanmore Azure stack alignment |
| Error tracking | **Sentry** (optional complement) | Deeper error context, session replay |
| API client codegen | **Orval** (if OpenAPI spec available) | Type-safe hooks generated from spec |

* * *
