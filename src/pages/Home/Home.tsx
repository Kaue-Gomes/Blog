import styles from './Home.module.css';

import { Link, useNavigate } from 'react-router-dom';
import PostDetail from '../../components/PostDetail';

import { type FormEvent, type ReactElement, useMemo, useState } from 'react';

import { useInfinitePosts } from '../../hooks/usePostsQueries';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { SkeletonCard } from '../../components/ui/Skeleton';

const FALLBACK_CATEGORIES = ['Tecnologia', 'Design', 'Carreira'];

export default function Home(): ReactElement {
  const navigate = useNavigate();

  const [queryInput, setQueryInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePosts({});

  const postsFlat = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data]
  );

  const categories = useMemo(() => {
    const tags = postsFlat
      .flatMap((post) => post.tags)
      .map((tag) => tag.trim())
      .filter(Boolean);

    return ['Todos', ...Array.from(new Set([...FALLBACK_CATEGORIES, ...tags]))];
  }, [postsFlat]);

  const visiblePosts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return postsFlat;
    }

    return postsFlat.filter((post) =>
      post.tags.some(
        (tag) => tag.toLowerCase() === selectedCategory.toLowerCase()
      )
    );
  }, [postsFlat, selectedCategory]);

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
      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          Blog aberto a leitores
          {postsFlat.length > 0
            ? ` · ${postsFlat.length} posts publicados`
            : ''}
        </p>
        <h1>Ideias, projetos e aprendizados em um blog mais leve.</h1>
        <p className={styles.subtitle}>
          Explore posts por tema, encontre conteúdos pela busca e acompanhe
          novas publicações com uma experiência mais clara e editorial.
        </p>

        <form className={styles.search_form} onSubmit={handleSubmit}>
          <label className={styles.search_label}>
            <span>Buscar no blog</span>
            <input
              type="search"
              name="q"
              placeholder="Digite uma palavra-chave..."
              aria-label="Buscar por texto"
              autoComplete="off"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
            />
          </label>

          <Button type="submit" className={styles.search_button}>
            Pesquisar
          </Button>
        </form>

        <div className={styles.filters} aria-label="Filtrar por categoria">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                selectedCategory === category ? styles.filter_active : ''
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="post-list" aria-label="Posts recentes">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key -- skeleton placeholders
            <SkeletonCard key={`sk_home_${String(i)}`} />
          ))}

        {!isLoading && visiblePosts.length === 0 && (
          <div className={styles.noposts}>
            <div className={styles.empty_icon} aria-hidden>
              #
            </div>
            <p className={styles.empty_kicker}>Nada por aqui ainda</p>
            <h2>Nenhum post encontrado</h2>
            <p>
              Publique o primeiro conteúdo ou mude o filtro para descobrir
              outras categorias.
            </p>

            <Link to="/posts/create" className="btn">
              Criar primeiro post
            </Link>
          </div>
        )}

        {!isLoading &&
          visiblePosts.map((post) => <PostDetail key={post.id} post={post} />)}
      </section>

      {hasNextPage && (
        <div className={styles.load_more}>
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
    </div>
  );
}
