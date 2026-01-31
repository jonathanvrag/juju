import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, HomePage } from '../pages';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        <Route
          path='/'
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
