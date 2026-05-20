// CSS
import styles from './Home.module.css';

import { Link, useNavigate } from 'react-router-dom';
import PostDetail from '../../components/PostDetail';

import { type FormEvent, type ReactElement, useMemo, useState } from 'react';

import { useInfinitePosts } from '../../hooks/usePostsQueries';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { SkeletonCard } from '../../components/ui/Skeleton';

export default function Home(): ReactElement {
  const navigate = useNavigate();

  const [queryInput, setQueryInput] = useState('');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePosts({});

  const postsFlat = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data]
  );

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const q = queryInput.trim();
    if (q.length === 0) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className={styles.home}>
      <h1>Veja os nossos posts mais recentes</h1>

      <form className={styles.search_form} onSubmit={handleSubmit}>
        <input
          type="search"
          name="q"
          placeholder="Busque por texto no conteúdo..."
          aria-label="Buscar por texto"
          autoComplete="off"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
        />

        <Button type="submit" variant="outline" className="btn-dark">
          Pesquisar
        </Button>
      </form>

      <section className="post-list">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key -- skeleton placeholders
            <SkeletonCard key={`sk_home_${String(i)}`} />
          ))}

        {!isLoading && postsFlat.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts.</p>

            <Link to="/posts/create" className="btn">
              Criar primeiro post
            </Link>
          </div>
        )}

        {!isLoading &&
          postsFlat.map((post) => <PostDetail key={post.id} post={post} />)}

        {hasNextPage && (
          <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
            <Button
              type="button"
              variant="outline"
              disabled={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              {isFetchingNextPage ? (
                <Spinner label="Carregando mais..." />
              ) : (
                'Carregar mais'
              )}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
