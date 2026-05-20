import { Link } from 'react-router-dom';

import toast from 'react-hot-toast';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';

import styles from './Dashboard.module.css';

import { useAuthValue } from '../../contexts/AuthContext';
import { useInfinitePosts, useRemovePost } from '../../hooks/usePostsQueries';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import type { BlogPost } from '../../types/post';
import { SkeletonCard } from '../../components/ui/Skeleton';

export default function DashboardPage(): ReactElement {
  const { user } = useAuthValue();
  const [pendingRemoval, setPendingRemoval] = useState<BlogPost | null>(null);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfinitePosts({ authorUid: user?.uid }, { enabled: Boolean(user?.uid) });

  const flattened = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data]
  );

  const removePostMutation = useRemovePost();

  const confirmDelete = async (): Promise<void> => {
    if (!pendingRemoval) return;

    try {
      await removePostMutation.mutateAsync(pendingRemoval.id);
      toast.success('Post eliminado');
      setPendingRemoval(null);
    } catch {
      toast.error('Não conseguimos apagar este post.');
    }
  };

  return (
    <div className={styles.dashboard}>
      <Modal
        title="Eliminar este post?"
        description="Será revertido apenas no Firestore usando as rules de proprietário."
        isOpen={Boolean(pendingRemoval)}
        onClose={() => !removePostMutation.isLoading && setPendingRemoval(null)}
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!removePostMutation.isLoading) setPendingRemoval(null);
          }}
          disabled={removePostMutation.isLoading}
        >
          Voltar atrás
        </Button>

        <Button
          type="button"
          variant="danger"
          disabled={removePostMutation.isLoading}
          ariaLabel="Confirmar eliminação"
          onClick={() => void confirmDelete()}
        >
          {removePostMutation.isLoading ? 'A remover…' : 'Confirmar'}
        </Button>
      </Modal>

      <h2>Dashboard</h2>

      <p>Gira os seus posts antes de republicar algo novo.</p>

      {user?.uid ? (
        <p className={styles.slug}>
          <Link to={`/authors/${encodeURIComponent(user.uid)}`}>
            Ver perfil público
          </Link>
        </p>
      ) : null}

      {!isLoading && flattened.length === 0 && (
        <div className={styles.noposts}>
          <p>Ainda não publicou histórias.</p>

          <Link to="/posts/create" className="btn">
            Criar primeiro post
          </Link>
        </div>
      )}

      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key -- skeleton
          <SkeletonCard key={`sk_dash_${String(i)}`} />
        ))}

      {flattened.length > 0 && (
        <>
          <div className={styles.post_header}>
            <span>Título</span>

            <span>Ações</span>
          </div>

          {flattened.map((postRow) => (
            <div className={styles.post_row} key={postRow.id}>
              <p>{postRow.title}</p>

              <div className={styles.actions}>
                <Link className="btn btn-outline" to={`/posts/${postRow.id}`}>
                  Ver
                </Link>

                <Link
                  className="btn btn-outline"
                  to={`/posts/edit/${postRow.id}`}
                >
                  Editar
                </Link>

                <Button
                  type="button"
                  variant="danger"
                  ariaLabel={`Eliminar post ${postRow.title}`}
                  onClick={() => setPendingRemoval(postRow)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}

          {hasNextPage ? (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button
                type="button"
                variant="outline"
                disabled={isFetchingNextPage}
                onClick={() => void fetchNextPage()}
              >
                {isFetchingNextPage ? <Spinner /> : 'Carregar histórico'}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
