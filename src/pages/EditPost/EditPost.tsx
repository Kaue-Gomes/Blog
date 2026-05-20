import type { ReactElement } from 'react';

import styles from './EditPost.module.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthValue } from '../../contexts/AuthContext';
import { useBlogPost, useUpdatePost } from '../../hooks/usePostsQueries';
import {
  parseTagsFromCsv,
  postFormSchema,
  type PostFormValues,
} from '../../forms/postFormSchema';

import { LabeledInput, LabeledTextArea } from '../../components/ui/Input';

import { Button } from '../../components/ui/Button';

import { SkeletonCard } from '../../components/ui/Skeleton';

export default function EditPostPage(): ReactElement {
  const { id } = useParams();

  const { user } = useAuthValue();

  const navigate = useNavigate();

  const { data: post, isLoading, error } = useBlogPost(id);

  const updatePost = useUpdatePost();

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (post !== undefined && post !== null) {
      reset({
        title: post.title,
        image: post.image,
        body: post.body,
        tagsCsv: post.tags.join(', '),
      });
    }
  }, [post, reset]);

  if (typeof id !== 'string' || id.length === 0) {
    return <Navigate to="/" replace />;
  }

  if (
    post !== null &&
    post !== undefined &&
    user !== null &&
    user.uid !== post.uid
  ) {
    toast.error('Não pode editar post de terceiros.');
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (values: PostFormValues): Promise<void> => {
    try {
      if (!post) return;

      const tags = parseTagsFromCsv(values.tagsCsv);

      await updatePost.mutateAsync({
        postId: id,
        patch: {
          title: values.title.trim(),
          image: values.image.trim(),
          body: values.body,
          tags,
        },
      });

      toast.success('Alterações gravadas!');

      navigate('/dashboard');
    } catch (unknownError) {
      const message =
        unknownError instanceof Error
          ? unknownError.message
          : 'Erro ao editar.';
      toast.error(message);
    }
  };

  return (
    <div className={styles.edit_post}>
      <header>
        <h2>Editar post</h2>

        <p>Altere apenas o necessário antes de republicar.</p>
      </header>

      {isLoading && (
        <>
          <SkeletonCard />
          <p>Carregando dados…</p>
        </>
      )}

      {error instanceof Error ? (
        <p className="error" role="alert">
          Falha ao buscar dados: {error.message}
        </p>
      ) : null}

      {!isLoading && post && (
        <form noValidate onSubmit={(e) => void handleSubmit(submit)(e)}>
          <h3>{post.title}</h3>

          <img
            className={styles.image_preview}
            src={post.image}
            alt={post.title}
            loading="lazy"
          />

          <LabeledInput
            id="title"
            label="Título"
            {...register('title')}
            error={errors.title?.message}
          />

          <LabeledInput
            id="image"
            label="URL da imagem"
            inputMode="url"
            {...register('image')}
            error={errors.image?.message}
          />

          <LabeledTextArea
            id="body"
            label="Conteúdo"
            rows={14}
            {...register('body')}
            error={errors.body?.message}
          />

          <LabeledInput
            id="tags"
            label="Tags"
            {...register('tagsCsv')}
            error={errors.tagsCsv?.message}
          />

          {!updatePost.isLoading ? (
            <Button type="submit">Salvar edição</Button>
          ) : (
            <Button type="button" disabled>
              Salvando...
            </Button>
          )}

          {updatePost.error instanceof Error ? (
            <p className="error">{updatePost.error.message}</p>
          ) : null}
        </form>
      )}
    </div>
  );
}
