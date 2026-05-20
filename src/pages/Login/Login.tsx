import type { ReactElement } from 'react';

import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import styles from './Login.module.css';
import { useMutation } from '@tanstack/react-query';
import {
  translateAuthMessage,
  loginWithEmailPassword,
  type LoginInput,
} from '../../services/authService';
import { type LoginFormValues, loginSchema } from '../../forms/authFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LabeledInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthValue } from '../../contexts/AuthContext';

export default function LoginPage(): ReactElement {
  const navigate = useNavigate();
  const { user } = useAuthValue();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginInput) =>
      loginWithEmailPassword(credentials),
    onSuccess: () => {
      toast.success('Sessão iniciada.');
      navigate('/');
    },

    onError: (mutationError: unknown) => {
      toast.error(
        translateAuthMessage(mutationError) ??
          'Não conseguimos autenticar neste momento.'
      );
    },
  });

  const onSubmit = (values: LoginFormValues): void => {
    loginMutation.mutate({
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.login}>
      <header>
        <h1>Entrar</h1>

        <p>Autenticação via Firebase Authentication.</p>
      </header>

      <form noValidate onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <LabeledInput
          id="email_login"
          type="email"
          label="Email"
          {...register('email')}
          autoComplete="email"
          placeholder="usuario@servidor.pt"
          error={errors.email?.message}
        />

        <LabeledInput
          id="pwd_login"
          type="password"
          label="Palavra-passe"
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
        />

        {!loginMutation.isLoading ? (
          <Button type="submit">Entrar agora</Button>
        ) : (
          <Button type="button" disabled>
            Aguarde…
          </Button>
        )}

        <p className={styles.footer}>
          Ainda não tem conta?{' '}
          <Link to="/register" className={styles.anchor}>
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}
