## Miniblog â€” React + Firebase (TypeScript)

SPA hospedada no GitHub Pages (`homepage` jÃ¡ define o sub-path `/Blog/`).

### Principais tecnologias

- Create React App + TypeScript estrito (`tsconfig`)
- Firebase Auth / Firestore (SDK modular v10)
- TanStack Query (cache/refetch das coleÃ§Ãµes paginadas)
- React Hook Form + Zod
- Vitest smoke + GitHub Actions
- Husky + lint-staged (Prettier)
- Firebase Security Rules + Ã­ndices versionados no repo

### Arquitetura (visÃ£o rÃ¡pida)

```mermaid
flowchart LR
 subgraph client [CRA React]
   UI[PÃ¡ginas e UI]
   SVC[services/auth + posts]
 end
 subgraph fb [Firebase]
   AuthSvc[Firebase Auth]
   FS[Firestore]
 end
 UI --> SVC
 SVC --> AuthSvc
 SVC --> FS
```

Fluxo tÃ­pico: componentes chamam hooks â†’ hooks usam TanStack Query â†’ chamadas ficam encapsuladas em `services/` (sem SDK espalhado na UI).

### PrÃ©-requisitos

1. Node 20 LTS (vide `.nvmrc`).
2. Conta/projeto Firebase (Auth Email/Senha + Firestore modo produÃ§Ã£o apenas apÃ³s revisar Rules).
3. Instalar Firebase CLI apenas se quiser publicar Rules: `npm install -g firebase-tools`.

### ConfiguraÃ§Ã£o rÃ¡pida

```bash
npm install
cp .env.example .env.local # preencha com valores reais da consola Firebase
npm start
npm run build    # garante gates similares ao CI quando envs estÃ£o vÃ¡lidas
npm run test:unit
```

Consulte sempre [`docs/FIREBASE_SETUP.md`](./docs/FIREBASE_SETUP.md) para deploy de Rules/App Check/CSP/dual projeto.

### Qualidade automatizada

- `npm run test:unit` â€” Vitest cobre helpers puros primeiro.
- `npm test` â€” Jest CRA (opcional quando quiser cenÃ¡rios legados React).
- `npm run prepare` â€” instala Husky (executado apÃ³s `npm install`).
- GitHub Actions `.github/workflows/ci.yml` replica `npm ci â†’ test:unit â†’ build` com placeholders de Firebase.

### Roadmap destacado / backlog

Consulte [`docs/CHECKLIST.md`](./docs/CHECKLIST.md) e [`CHANGELOG.md`](./CHANGELOG.md). Itens conscientemente adiados: editor rico (Tiptap), Next.js SSR, App Check obrigatÃ³rio em produÃ§Ã£o, pipelines de deploy automÃ¡ticos quando decidir hospedagem alÃ©m de GH Pages.

### Capturas sugeridas (para README)

Substitua estes marcadores antes de portfolio pÃºblico:

1. Lista de posts (tema claro).
2. PÃ¡gina individual com OG tags geradas pelo `react-helmet-async`.

### Deploy rÃ¡pido (GitHub Pages existente)

`npm run deploy` continua a usar `gh-pages` quando `homepage` configurado â€” **lembre**: variÃ¡veis `REACT_APP_*` tÃªm de existir durante `npm run build` (idealmente secrets do GitHub Actions se automatizar esta etapa).

### SeguranÃ§a

- Credenciais nunca devem regressar ao Git.
- Defence real em Firestore acontece nas Rules (`firestore.rules`); faÃ§a sempre `firebase deploy --only firestore:rules`.

---

<details>
<summary>InglÃªs (resumo tÃ©cnico)</summary>

React SPA with Firebase modular SDK, hardened Firestore Rules, TanStack Query, Zod validations, GH Actions CI, Vitest starter tests, husky prettier hook, SPA SEO limited by lack of SSR (Next migration documented). Always deploy rules after schema changes.</details>
