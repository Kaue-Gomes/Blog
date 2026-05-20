import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { BlogPost } from '../types/post';

export const POSTS_COLLECTION = 'posts';
export const DEFAULT_PAGE_SIZE = 8;

export function mapPostDoc(
  snapshot: QueryDocumentSnapshot<DocumentData>
): BlogPost {
  const d = snapshot.data();
  const createdAtRaw = d.createdAt;
  const createdAt =
    createdAtRaw instanceof Timestamp ? createdAtRaw : Timestamp.fromMillis(0);

  const tagsUnknown = Array.isArray(d.tags) ? d.tags : [];
  const tags = tagsUnknown.every((t): t is string => typeof t === 'string')
    ? tagsUnknown
    : [];

  return {
    id: snapshot.id,
    uid: typeof d.uid === 'string' ? d.uid : '',
    title: typeof d.title === 'string' ? d.title : '',
    body: typeof d.body === 'string' ? d.body : '',
    image: typeof d.image === 'string' ? d.image : '',
    tags,
    createdBy: typeof d.createdBy === 'string' ? d.createdBy : '',
    createdAt,
  };
}

export async function fetchPost(postId: string): Promise<BlogPost | null> {
  const ref = doc(db, POSTS_COLLECTION, postId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapPostDoc(snap as QueryDocumentSnapshot<DocumentData>);
}

export type PostsPageArgs = {
  tag?: string | null;
  authorUid?: string | null;
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData>;
};

export type PostsPageResult = {
  posts: BlogPost[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
};

export async function fetchPostsPage(
  args: PostsPageArgs
): Promise<PostsPageResult> {
  const pageSize = args.pageSize ?? DEFAULT_PAGE_SIZE;

  const tagTrimmedRaw = typeof args.tag === 'string' ? args.tag.trim() : '';
  const tagTrimmed = tagTrimmedRaw.toLowerCase();
  const hasTag = Boolean(tagTrimmed);

  const authorUid =
    typeof args.authorUid === 'string' ? args.authorUid.trim() : '';
  const hasAuthor = Boolean(authorUid);

  const constraints = (): QueryConstraint[] => {
    if (hasAuthor) return [where('uid', '==', authorUid)];
    if (hasTag) return [where('tags', 'array-contains', tagTrimmed)];
    return [];
  };

  let qConstr = query(
    collection(db, POSTS_COLLECTION),
    ...constraints(),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  if (args.cursor) {
    qConstr = query(
      collection(db, POSTS_COLLECTION),
      ...constraints(),
      orderBy('createdAt', 'desc'),
      startAfter(args.cursor),
      limit(pageSize)
    );
  }

  const snap = await getDocs(qConstr);
  const posts = snap.docs.map((s) =>
    mapPostDoc(s as QueryDocumentSnapshot<DocumentData>)
  );

  const lastVisible =
    snap.docs.length > 0
      ? (snap.docs[snap.docs.length - 1] as QueryDocumentSnapshot<DocumentData>)
      : null;

  return {
    posts,
    lastDoc: snap.docs.length < pageSize ? null : lastVisible,
  };
}

export async function fetchAllPostsMatchingText(
  needle: string
): Promise<BlogPost[]> {
  /** Busca client-side sobre primeiros batches (bom para coleções modestas/portfólio). */
  const collected: BlogPost[] = [];
  let cursor: QueryDocumentSnapshot<DocumentData> | undefined;
  const lowered = needle.trim().toLowerCase();
  if (!lowered) return collected;

  for (let i = 0; i < 20; i += 1) {
    const batch = await fetchPostsPage({
      cursor,
      pageSize: 40,
      tag: null,
      authorUid: null,
    });
    const hits = batch.posts.filter((p) => {
      const t = `${p.title} ${p.body}`.toLowerCase();
      return t.includes(lowered);
    });
    collected.push(...hits);
    const lastDoc = batch.lastDoc;
    if (!lastDoc) break;
    cursor = lastDoc;
  }

  /** dedupe by id */
  const map = new Map<string, BlogPost>();
  collected.forEach((p) => map.set(p.id, p));
  return [...map.values()];
}

export type CreatePostInput = {
  title: string;
  image: string;
  body: string;
  tags: string[];
  uid: string;
  createdBy: string;
};

export async function createPost(data: CreatePostInput): Promise<string> {
  const payload = {
    ...data,
    createdAt: Timestamp.now(),
  };
  const ref = await addDoc(collection(db, POSTS_COLLECTION), payload);
  return ref.id;
}

export async function updatePost(
  postId: string,
  partial: Omit<Partial<CreatePostInput>, 'uid'>
): Promise<void> {
  await updateDoc(doc(db, POSTS_COLLECTION, postId), partial as DocumentData);
}

export async function deletePost(postId: string): Promise<void> {
  await deleteDoc(doc(db, POSTS_COLLECTION, postId));
}
