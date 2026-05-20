import { useParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import { Helmet } from 'react-helmet-async';

import { useBlogPost } from '../../hooks/usePostsQueries';
import { PostBodyDisplay } from '../../components/content/PostBodyDisplay';
import styles from './Post.module.css';
import { SkeletonPage } from '../../components/ui/Skeleton';
import { Spinner } from '../../components/ui/Spinner';

export default function PostPage(): ReactElement {
  const { id } = useParams();

  const { data: post, isLoading, error } = useBlogPost(id);

  const excerpt =
    typeof post?.body === 'string'
      ? post.body.slice(0, 155)
      : 'Post do miniblog Firebase.';

  const pageUrl =
    typeof window !== 'undefined' ? window.location.href : undefined;

  return (
    <div className={styles.post_container}>
      <Helmet>
        {post && (
          <>
            <title>{`${post.title} | Blog Gomes`}</title>

            <meta name="description" content={excerpt} />

            <meta property="og:type" content="article" />

            <meta property="og:title" content={post.title} />

            <meta property="og:description" content={excerpt} />

            {typeof post.image === 'string' && post.image.startsWith('http') ? (
              <meta property="og:image" content={post.image} />
            ) : null}

            {pageUrl !== undefined ? (
              <meta property="og:url" content={pageUrl} />
            ) : null}
          </>
        )}
      </Helmet>

      {isLoading && (
        <>
          <SkeletonPage rows={8} />

          <div
            style={{
              display: 'grid',
              justifyItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Spinner />
          </div>
        </>
      )}

      {error instanceof Error ? (
        <p className="error" role="alert">
          Erro ao carregar post: {error.message}
        </p>
      ) : null}

      {!isLoading && post && (
        <article aria-labelledby={`post-heading-${post.id}`}>
          <h1 id={`post-heading-${post.id}`}>{post.title}</h1>

          <p className={styles.createdby}>por {post.createdBy}</p>

          <img src={post.image} alt={post.title} loading="lazy" />

          <PostBodyDisplay body={post.body} />

          <h3>Este post fala sobre</h3>

          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <p key={tag}>
                <span>#</span>
                {tag}
              </p>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}
