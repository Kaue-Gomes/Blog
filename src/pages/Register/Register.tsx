import type { ReactElement } from 'react';

import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import styles from './Register.module.css';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  translateAuthMessage,
  registerWithEmailPassword,
  type RegisterInput,
} from '../../services/authService';
import {
  type RegisterFormValues,
  registerSchema,
} from '../../forms/authFormSchema';
import { LabeledInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthValue } from '../../contexts/AuthContext';

export default function RegisterPage(): ReactElement {
  const navigate = useNavigate();
  const { user } = useAuthValue();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => registerWithEmailPassword(data),
    onSuccess: () => {
      toast.success('Conta criada. Bora publicar?');
      navigate('/posts/create');
    },
    onError: (mutationError: unknown) => {
      toast.error(
        translateAuthMessage(mutationError) ??
          'Não conseguimos concluir o cadastro.'
      );
    },
  });

  const onSubmit = (values: RegisterFormValues): void => {
    registerMutation.mutate({
      displayName: values.displayName.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.register}>
      <header>
        <h1>Cadastre-se para postar</h1>

        <p>Use um nome público legível nos créditos do post.</p>
      </header>

      <form noValidate onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <LabeledInput
          id="display_register"
          type="text"
          label="Nome"
          {...register('displayName')}
          autoComplete="name"
          error={errors.displayName?.message}
        />

        <LabeledInput
          id="email_register"
          type="email"
          label="Email"
          {...register('email')}
          autoComplete="email"
          error={errors.email?.message}
        />

        <LabeledInput
          id="pwd_register"
          type="password"
          label="Senha"
          {...register('password')}
          autoComplete="new-password"
          error={errors.password?.message}
        />

        <LabeledInput
          id="pwd_confirm"
          type="password"
          label="Confirmar senha"
          {...register('confirmPassword')}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        {!registerMutation.isLoading ? (
          <Button type="submit">Criar conta</Button>
        ) : (
          <Button type="button" disabled>
            Salvando...
          </Button>
        )}

        <p className={styles.footer}>
          Já tem conta?{' '}
          <Link className={styles.anchor} to="/login">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
