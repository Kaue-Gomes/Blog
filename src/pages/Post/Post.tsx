import { useParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import { Helmet } from 'react-helmet-async';

import { useBlogPost } from '../../hooks/usePostsQueries';
import { PostBodyDisplay } from '../../components/content/PostBodyDisplay';
import styles from './Post.module.css';
import { SkeletonPage } from '../../components/ui/Skeleton';

function estimateReadTime(body: string): string {
  const plain = body.replace(/<[^>]+>/g, ' ');
  const words = plain.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min de leitura`;
}

function formatDate(dateLike: { toDate?: () => Date }): string {
  const date = dateLike.toDate?.();
  if (!(date instanceof Date)) {
    return 'Publicado recentemente';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

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

      {isLoading && <SkeletonPage rows={8} />}

      {error instanceof Error ? (
        <p className="error" role="alert">
          Erro ao carregar post: {error.message}
        </p>
      ) : null}

      {!isLoading && post && (
        <article aria-labelledby={`post-heading-${post.id}`}>
          <div className={styles.progress} aria-hidden />

          <header className={styles.post_header}>
            <p className={styles.category}>{post.tags[0] ?? 'Geral'}</p>
            <h1 id={`post-heading-${post.id}`}>{post.title}</h1>

            <div className={styles.byline}>
              <span>{post.createdBy}</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>{estimateReadTime(post.body)}</span>
            </div>
          </header>

          {post.image ? <img src={post.image} alt="" loading="lazy" /> : null}

          <PostBodyDisplay body={post.body} />

          <footer className={styles.tags_block}>
            <h2>Este post fala sobre</h2>

            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </footer>
        </article>
      )}
    </div>
  );
}
