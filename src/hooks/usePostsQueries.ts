import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import {
  fetchPost,
  fetchPostsPage,
  createPost,
  updatePost,
  deletePost,
  fetchAllPostsMatchingText,
  type CreatePostInput,
  type PostsPageResult,
} from '../services/postService';

export type PostsListFilters = {
  tag?: string | null;
  authorUid?: string | null;
};

export function useInfinitePosts(
  filters: PostsListFilters,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;

  return useInfiniteQuery({
    queryKey: ['posts', filters],
    enabled,
    queryFn: (ctx): Promise<PostsPageResult> => {
      const pageParam = (
        ctx as {
          pageParam?: QueryDocumentSnapshot<DocumentData>;
        }
      ).pageParam;
      return fetchPostsPage({
        ...filters,
        cursor: pageParam,
      });
    },
    getNextPageParam: (last) => last.lastDoc ?? undefined,
  });
}

export function useBlogPost(postId: string | undefined) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(String(postId)),
    enabled: Boolean(postId),
  });
}

export function usePostsTextSearch(term: string | undefined) {
  return useQuery({
    queryKey: ['posts-fulltext', term],
    queryFn: async () => fetchAllPostsMatchingText(String(term ?? '').trim()),
    enabled: Boolean(term && term.trim() !== ''),
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostInput) => createPost(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['posts'] });
      void qc.invalidateQueries({ queryKey: ['posts-fulltext'] });
    },
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      patch,
    }: {
      postId: string;
      patch: Omit<Partial<CreatePostInput>, 'uid'>;
    }) => updatePost(postId, patch),
    onSuccess: (_v, vars) => {
      void qc.invalidateQueries({ queryKey: ['posts'] });
      void qc.invalidateQueries({ queryKey: ['post', vars.postId] });
      void qc.invalidateQueries({ queryKey: ['posts-fulltext'] });
    },
  });
}

export function useRemovePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: (_void, postId) => {
      void qc.invalidateQueries({ queryKey: ['posts'] });
      void qc.removeQueries({ queryKey: ['post', postId] });
      void qc.invalidateQueries({ queryKey: ['posts-fulltext'] });
    },
  });
}
