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
        <p className={styles.eyebrow}>Busca</p>
        <h1 aria-live="polite">
          Resultados para <span aria-label="termo de busca">{q || '...'}</span>
        </h1>
        <p className={styles.help}>
          Esta busca procura texto no corpo ou título dos posts já carregados.
        </p>
      </header>

      <section className="post-list">
        {isLoading && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key -- placeholders
              <SkeletonCard key={`sk_search_${String(i)}`} />
            ))}

            <div className={styles.search_loading}>
              <Spinner label="Buscando..." />
            </div>
          </>
        )}

        {isError && error instanceof Error ? (
          <p className="error" role="alert">
            {error.message}
          </p>
        ) : null}

        {!isLoading && q.trim() !== '' && data.length === 0 ? (
          <div className={styles.empty}>
            <p>Não foram encontrados posts compatíveis com a pesquisa.</p>

            <Link to="/" className="btn btn-outline">
              Voltar ao início
            </Link>
          </div>
        ) : null}

        {!isLoading && q.trim() === '' ? (
          <div className={styles.empty}>
            <p>Use o campo de busca da Home para encontrar posts.</p>
          </div>
        ) : null}

        {!isLoading &&
          data.map((post) => <PostDetail key={post.id} post={post} />)}
      </section>
    </div>
  );
}
