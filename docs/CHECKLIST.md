<!-- Checklist sintético mapeando o roadmap do portfólio; marque quando fechar cada item. -->

# Checklist roadmap

## Prioridade zero — segurança

- [ ] Regras aplicadas/deploy no projeto Firebase prod (`firebase deploy firestore`)
- [ ] Rotacionar chaves caso tenham sido versionadas antes da migração `.env`

## Produto SPA atual (CRA)

- [x] TypeScript + serviços + TanStack Query
- [ ] Editor rico (Tiptap) no corpo dos posts _(backlog técnico)_
- [ ] Next.js/App Router quando SEO for obrigatório em produção
- [x] Skeletons/toasts/delete confirm/paginação busca SPA
- [x] Coberturas mínimas Vitest + CI GH Actions

## Operações futuras

- [ ] Projeto Firebase separado (`dev` / `prod`)
- [ ] Pipeline `main`→ Firebase Hosting/GitHub Pages com secrets segregados

Referências técnicas: [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md).
