import DOMPurify from 'dompurify';
import styles from './PostBodyDisplay.module.css';

type PostBodyDisplayProps = {
  body: string;
};

/** Texto usa escape nativo do React; se houver marcação futura/HTML, sanitiza antes. */
export function PostBodyDisplay({ body }: PostBodyDisplayProps) {
  const looksHtml = /<[a-z][\s\S]*>/i.test(body);

  if (looksHtml) {
    const safe = DOMPurify.sanitize(body, {
      ALLOWED_TAGS: [
        'b',
        'i',
        'strong',
        'em',
        'br',
        'p',
        'ul',
        'ol',
        'li',
        'a',
        'blockquote',
        'pre',
        'code',
      ],
      ALLOWED_ATTR: ['href', 'title'],
    });
    return (
      <div
        className={styles.post_body_rich}
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    );
  }

  return (
    <p style={{ whiteSpace: 'pre-wrap' }} aria-label="Conteúdo do post">
      {body}
    </p>
  );
}
