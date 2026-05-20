# Firebase — segurança, ambientes e deploy

## Variáveis de ambiente

1. Copie [`.env.example`](../.env.example) para `.env.local`.
2. Preencha `REACT_APP_FIREBASE_*` com o projeto no [Console Firebase](https://console.firebase.google.com/).
3. Nunca commite `.env` ou `.env.local`.

Se alguma API key foi versionada antes desta migração, gere uma nova chave em **Projeto settings → Apps da Web**, ou restrinja quotas/domínios.

## Firestore Rules e índices

- Regras revisáveis em [`firestore.rules`](../firestore.rules).
- Índices compósitos declarados em [`firestore.indexes.json`](../firestore.indexes.json).

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Rate limiting só com Rules?

Limitar criações por minuto apenas com linguagem Rules costuma precisar de **documentos auxiliares** (timestamp do último post escrito pelo cliente num **batch**) ou **Cloud Functions**/`App Check` + quotas servidoras. Esta base documenta esse trade-off até implementar batches no `postService`.

## CSP (Content Security Policy)

CRA + desenvolvimento com `eval` impedem políticas muito estritas via meta-tags. Em produção, prefira responder **HTTP headers CSP** atrás de Firebase Hosting / Cloudflare / Netlify configurando diretivas que inclua domínios do Firebase Identity, Firestore, Google Fonts usados pela app e eventual reCAPTCHA (App Check). Documente no host as origens obrigatórias.

## App Check

Configure `REACT_APP_FIREBASE_RECAPTCHA_SITE_KEY` e ative Enforcement no Console depois das Security Rules ficarem endurecidas.

## Dual project (`dev` / `prod`)

- Dois workspaces Firebase distintos, `.env.dev` vs `.env.prod` apenas locais ou secrets de CI.
- `firebase use <projeto>` antes de cada `deploy`.

```bash
firebase use <projeto-target>
firebase deploy --only firestore:rules
```

## Storage

[`storage.rules`](../storage.rules) permanece fechado até existir uploads (ex.: capas guardadas sob `covers/{uid}/`), altura que abra leituras públicas e validações MIME/tamanho específicas.
