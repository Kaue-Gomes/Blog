import { Link } from 'react-router-dom';

import type { BlogPost } from '../types/post';

import styles from './PostDetail.module.css';

function getCategory(post: BlogPost): string {
  return post.tags[0]?.trim() || 'Geral';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return 'GB';
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function estimateReadTime(body: string): string {
  const plain = body.replace(/<[^>]+>/g, ' ');
  const words = plain.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

export default function PostDetail({ post }: { post: BlogPost }) {
  const category = getCategory(post);
  const readTime = estimateReadTime(post.body);

  return (
    <article className={styles.post_detail}>
      <Link
        to={`/posts/${post.id}`}
        className={styles.media}
        aria-label={`Ler ${post.title}`}
      >
        {post.image ? (
          <img src={post.image} alt="" loading="lazy" />
        ) : (
          <span aria-hidden>{category.slice(0, 2).toUpperCase()}</span>
        )}
      </Link>

      <div className={styles.content}>
        <div className={styles.meta_row}>
          <span className={styles.category}>{category}</span>
          <span>{readTime} de leitura</span>
        </div>

        <h2>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h2>

        <div className={styles.tags}>
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        <footer className={styles.card_footer}>
          <div className={styles.author}>
            <span className={styles.avatar} aria-hidden>
              {getInitials(post.createdBy)}
            </span>
            <span>{post.createdBy}</span>
          </div>

          <Link to={`/posts/${post.id}`} className={styles.read_link}>
            Ler post
          </Link>
        </footer>
      </div>
    </article>
  );
}
