# Changelog

Todas as alterações relevantes seguem versão semântica aproximada (`major.minor.patch`).

## 0.2.0 — 2026-05-20

- **Segurança:** Security Rules duras para `posts` (proprietário `uid`, tamanhos de campo, timestamps alinhados) e índices versionados (`firestore.indexes.json`); `.env`/`.gitignore` + exemplo de env; recomendações de CSP em documentação (`docs/FIREBASE_SETUP.md`).
- **Stack:** migração progressiva para **TypeScript** (CRA mantido), Firebase **modular v10**, **TanStack Query** para dados, **React Hook Form + Zod**, **React Helmet Async** para metadados SPA, **DOMPurify** para eventual HTML sanitizado nos posts.
- **Arquitetura:** camada `services/` (`postService`, `authService`), hooks especializados, componentes UI reutilizáveis, **lazy loading + Suspense** nas rotas, **Error Boundary** por rota, confirmação modal para exclusão no dashboard e toasts (`react-hot-toast`).
- **UX:** paginação “carregar mais” com cursores Firestore (`startAfter`), busca texto client-side incremental, loaders esqueléticos, tema claro/escuro com persistência após primeira escolha, página de perfil `/authors/:uid`.
- **DevOps:** GitHub Actions (build + Vitest), Husky + lint-staged (Prettier), Vitest baseline (`npm run test:unit`), Husky inicializado (`prepare`), `sitemap.xml` + `robots.txt` atualizados.
- **Observações:** SPA continua sem SSR; próximo grande salto de SEO será **Next.js** ou hospedagem com headers CSP dedicados (`README.md` orienta decisão).

## 0.1.0 — legado inicial

Versão inicial em JavaScript CRA + Firebase.
