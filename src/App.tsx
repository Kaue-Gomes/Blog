import './App.css';

import { Suspense, lazy, useMemo, type ReactElement } from 'react';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { User } from 'firebase/auth';

import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PageErrorBoundary } from './components/PageErrorBoundary';
import { useAuthBootstrap } from './hooks/useAuthBootstrap';

import { Spinner } from './components/ui/Spinner';
import { Alert } from './components/ui/Alert';

const HomePage = lazy(async () => import('./pages/Home/Home'));
const AboutPage = lazy(async () => import('./pages/About/About'));
const PostDetailPage = lazy(async () => import('./pages/Post/Post'));
const CreatePostPage = lazy(
  async () => import('./pages/CreatePost/CreatePost')
);
const SearchPage = lazy(async () => import('./pages/Search/Search'));
const LoginPage = lazy(async () => import('./pages/Login/Login'));
const RegisterPage = lazy(async () => import('./pages/Register/Register'));
const DashboardPage = lazy(async () => import('./pages/Dashboard/Dashboard'));
const EditPostPage = lazy(async () => import('./pages/EditPost/EditPost'));
const ProfilePage = lazy(async () => import('./pages/Profile/Profile'));

function Fallback(): ReactElement {
  return (
    <div className="container" aria-busy>
      <Spinner />
    </div>
  );
}

function AppRoutes({ user }: { user: User | null }): ReactElement {
  const basename = useMemo(() => {
    const raw =
      typeof process.env.PUBLIC_URL === 'string' ? process.env.PUBLIC_URL : '/';
    const trimmed = raw.replace(/\/+$/, '');
    if (!trimmed || trimmed === '.' || trimmed === '') {
      return '';
    }
    return trimmed;
  }, []);

  return (
    <BrowserRouter basename={basename}>
      <Navbar />
      <div className="container">
        <PageErrorBoundary
          fallback={
            <Alert
              tone="error"
              title="Algo deu errado"
              message="Atualize ou tente mais tarde."
            />
          }
        >
          <Suspense fallback={<Fallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/authors/:uid" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />

              <Route
                path="/posts/create"
                element={
                  user ? <CreatePostPage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/posts/edit/:id"
                element={
                  user ? <EditPostPage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/dashboard"
                element={
                  user ? <DashboardPage /> : <Navigate to="/login" replace />
                }
              />

              <Route
                path="/login"
                element={!user ? <LoginPage /> : <Navigate to="/" replace />}
              />
              <Route
                path="/register"
                element={!user ? <RegisterPage /> : <Navigate to="/" replace />}
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </PageErrorBoundary>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default function App(): ReactElement {
  const { loading, user } = useAuthBootstrap();

  if (loading) {
    return <Fallback />;
  }

  return (
    <div className="App">
      <AuthProvider value={{ user }}>
        <AppRoutes user={user} />
      </AuthProvider>
    </div>
  );
}
