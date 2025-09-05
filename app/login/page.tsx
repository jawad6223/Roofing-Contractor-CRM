import {FC} from 'react';
import LoginModal from '@/components/Auth/loginModal';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

const LoginPage:FC=()=> {
  return (
    <ProtectedRoute requireAuth={false}>
      <LoginModal />
    </ProtectedRoute>
  );
}

export default LoginPage;