import type { ReactElement } from 'react';

import styles from './CreatePost.module.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthValue } from '../../contexts/AuthContext';
import {
  parseTagsFromCsv,
  postFormSchema,
  type PostFormValues,
} from '../../forms/postFormSchema';
import { LabeledInput, LabeledTextArea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCreatePost } from '../../hooks/usePostsQueries';

export default function CreatePostPage(): ReactElement {
  const { user } = useAuthValue();
  const navigate = useNavigate();
  const createPost = useCreatePost();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      image: '',
      body: '',
      tagsCsv: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: PostFormValues): Promise<void> => {
    const tags = parseTagsFromCsv(values.tagsCsv);
    try {
      if (!user?.uid || !user.displayName) {
        toast.error('Sessão inválida. Entre novamente.');
        navigate('/login');
        return;
      }

      await createPost.mutateAsync({
        title: values.title.trim(),
        image: values.image.trim(),
        body: values.body,
        tags,
        uid: user.uid,
        createdBy: user.displayName.trim() !== '' ? user.displayName : 'Autor',
      });

      toast.success('Post criado!');

      navigate('/');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Falha ao criar post.';
      toast.error(message);
    }
  };

  return (
    <div className={styles.create_post}>
      <header>
        <h2>Criar post</h2>

        <p>Escreva sobre o que quiser e compartilhe o seu conhecimento.</p>
      </header>

      <form noValidate onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <LabeledInput
          id="title"
          label="Título:"
          placeholder="Um título forte…"
          error={errors.title?.message}
          {...register('title')}
        />

        <LabeledInput
          id="image"
          label="URL da imagem:"
          placeholder="https://..."
          autoComplete="off"
          inputMode="url"
          error={errors.image?.message}
          {...register('image')}
        />

        <LabeledTextArea
          id="body"
          rows={12}
          label="Conteúdo:"
          placeholder="Desenvolva a ideia com clareza"
          error={errors.body?.message}
          {...register('body')}
        />

        <LabeledInput
          id="tags"
          label="Tags:"
          placeholder="react, segurança, firebase"
          error={errors.tagsCsv?.message}
          {...register('tagsCsv')}
        />

        {!createPost.isLoading ? (
          <Button type="submit">Criar post</Button>
        ) : (
          <Button type="button" disabled>
            Salvando...
          </Button>
        )}

        {createPost.error instanceof Error ? (
          <p className="error" role="alert">
            {createPost.error.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
