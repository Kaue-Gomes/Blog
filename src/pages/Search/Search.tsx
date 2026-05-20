import { Link, useSearchParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import PostDetail from '../../components/PostDetail';
import { usePostsTextSearch } from '../../hooks/usePostsQueries';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { Spinner } from '../../components/ui/Spinner';

import styles from './Search.module.css';

export default function Search(): ReactElement {
  const [params] = useSearchParams();

  const q = params.get('q') ?? '';
  const { data = [], isLoading, isError, error } = usePostsTextSearch(q);

  return (
    <div className={styles.search_container}>
      <header>
        <h1 aria-live="polite">
          Resultados para:{' '}
          <span aria-label="termo de busca">{q || '(sem termo)'}</span>
        </h1>
        <p className={styles.help}>
          Esta busca procura texto no corpo ou título (client-side sobre os
          lotes já carregados). Para coleções grandes, evoluir para Algolia ou
          Cloud Functions.
        </p>
      </header>

      <section className="post-list">
        {isLoading && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key -- placeholders
              <SkeletonCard key={`sk_search_${String(i)}`} />
            ))}

            <Spinner label="Buscando…" />
          </>
        )}

        {isError && error instanceof Error ? (
          <p className="error" role="alert">
            {error.message}
          </p>
        ) : null}

        {!isLoading && q.trim() !== '' && data.length === 0 ? (
          <>
            <p>Não foram encontrados posts compatíveis com a pesquisa.</p>

            <Link to="/" className="btn btn-dark">
              Voltar ao início
            </Link>
          </>
        ) : null}

        {!isLoading && q.trim() === '' ? (
          <p>
            Adicione <code>?q=</code>
            ao URL ou use o campo na Home.
          </p>
        ) : null}

        {!isLoading &&
          data.map((post) => <PostDetail key={post.id} post={post} />)}
      </section>
    </div>
  );
}
