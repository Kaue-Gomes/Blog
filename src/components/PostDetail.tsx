import { Link } from 'react-router-dom';

import type { BlogPost } from '../types/post';

import styles from './PostDetail.module.css';

export default function PostDetail({ post }: { post: BlogPost }) {
  return (
    <div className={styles.post_detail}>
      <img src={post.image} alt={post.title} loading="lazy" />
      <h2>{post.title}</h2>
      <p className={styles.createdby}>por: {post.createdBy}</p>
      <div className={styles.tags}>
        {post.tags.map((tag) => (
          <p key={tag}>
            <span>#</span>
            {tag}
          </p>
        ))}
      </div>
      <Link to={`/posts/${post.id}`} className="btn btn-outline">
        Ler
      </Link>
    </div>
  );
}
