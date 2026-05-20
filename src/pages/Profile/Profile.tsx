import type { ReactElement } from 'react';

import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';

import styles from './Profile.module.css';
import PostDetail from '../../components/PostDetail';
import { useInfinitePosts } from '../../hooks/usePostsQueries';

import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { SkeletonCard } from '../../components/ui/Skeleton';

export default function ProfilePage(): ReactElement {
  const { uid } = useParams();

  const authorUid =
    uid !== undefined && uid.trim().length > 0 ? uid.trim() : '';

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfinitePosts({ authorUid }, { enabled: authorUid.length > 0 });

  const flattened = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data]
  );

  const firstVisible = flattened[0];
  const displayName =
    firstVisible?.createdBy !== undefined &&
    firstVisible.createdBy.trim().length > 0
      ? firstVisible.createdBy
      : 'Autor';

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div aria-hidden className={styles.avatar}>
          {displayName.slice(0, 1).toUpperCase()}
        </div>

        <div className={styles.meta}>
          <h1>{displayName}</h1>

          <p className={styles.uid}>
            UID interno Firebase (somente administradores entendem o significado
            técnico).
          </p>

          <p className={styles.mono}>{authorUid}</p>

          <Link className="btn btn-outline" to="/">
            Voltar ao feed
          </Link>
        </div>
      </header>

      {authorUid.length === 0 ? (
        <p className="error" role="alert">
          Endereço de perfil inválido.
        </p>
      ) : null}

      <section className={styles.section}>
        <h2>Histórias publicadas</h2>

        {isLoading && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key -- placeholders
              <SkeletonCard key={`sk_profile_${String(i)}`} />
            ))}
          </>
        )}

        {!isLoading && flattened.length === 0 ? (
          <p>Sem histórias públicas até ao momento.</p>
        ) : null}

        {!isLoading &&
          flattened.map((postItem) => (
            <PostDetail key={postItem.id} post={postItem} />
          ))}

        {hasNextPage ? (
          <div className={styles.controls}>
            <Button
              type="button"
              variant="outline"
              disabled={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              {isFetchingNextPage ? (
                <Spinner label="Carregando próximos" />
              ) : (
                'Carregar mais histórias'
              )}
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
