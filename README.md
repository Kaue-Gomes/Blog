## Miniblog React + Firebase (TypeScript)

SPA hospedada no GitHub Pages (`homepage` já define o sub-path `/Blog/`).

### Principais tecnologias

- Create React App + TypeScript estrito (`tsconfig`)
- Firebase Auth / Firestore (SDK modular v10)
- TanStack Query (cache/refetch das coleções paginadas)
- React Hook Form + Zod
- Vitest smoke + GitHub Actions
- Husky + lint-staged (Prettier)
- Firebase Security Rules + índices versionados no repositório

### Arquitetura (visão rápida)

```mermaid
flowchart LR
 subgraph client [CRA React]
   UI[páginas e UI]
   SVC[services/auth + posts]
 end
 subgraph fb [Firebase]
   AuthSvc[Firebase Auth]
   FS[Firestore]
 end
 UI --> SVC
 SVC --> AuthSvc
 SVC --> FS

Fluxo: componentes chamam hooks; os hooks usam TanStack Query → as chamadas ficam encapsuladas em services/ (sem SDK espalhado na UI).

Pré-requisitos
Node 20 LTS (vide .nvmrc).
Conta/projeto Firebase (Auth Email/Senha + Firestore em modo produção apenas após revisar as Rules).

Instalar Firebase CLI apenas se quiser publicar as Rules:

npm install -g firebase-tools
Configuração rápida
npm install
cp .env.example .env.local # preencha com valores reais do console Firebase
npm start
npm run build    # garante validações similares ao CI quando as envs estão válidas
npm run test:unit

Consulte sempre docs/FIREBASE_SETUP.md para deploy de Rules, App Check, CSP e configuração de múltiplos projetos.

Qualidade automatizada
npm run test:unit — Vitest cobre helpers puros inicialmente.
npm test — Jest CRA (opcional para cenários legados React).
npm run prepare — instala Husky (executado após npm install).
GitHub Actions .github/workflows/ci.yml replica npm ci → test:unit → build com placeholders de Firebase.
Roadmap destacado / backlog

Consulte docs/CHECKLIST.md e CHANGELOG.md.

Itens conscientemente adiados:

Editor rico (Tiptap)
Next.js SSR
App Check obrigatório em produção
Pipelines de deploy automáticos ao migrar além do GitHub Pages
Capturas sugeridas (para README)

Substitua estes marcadores antes de publicar no portfólio:

Lista de posts (tema claro).
Página individual com OG tags geradas pelo react-helmet-async.
Deploy rápido (GitHub Pages existente)

npm run deploy continua utilizando gh-pages quando homepage estiver configurado.

Importante: variáveis REACT_APP_* precisam existir durante o npm run build (idealmente usando secrets do GitHub Actions caso automatize essa etapa).

Segurança
Credenciais nunca devem ser versionadas no Git.

A proteção real do Firestore acontece nas Rules (firestore.rules); execute sempre:

firebase deploy --only firestore:rules
<details> <summary>Inglês (resumo técnico)</summary>

React SPA with Firebase modular SDK, hardened Firestore Rules, TanStack Query, Zod validations, GitHub Actions CI, Vitest starter tests, Husky + Prettier hooks, and limited SPA SEO due to lack of SSR (Next.js migration documented). Always deploy Firestore Rules after schema changes.

</details> ```
