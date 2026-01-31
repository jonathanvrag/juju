import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, BooksPage } from '../pages';
import { ProtectedRoute } from './ProtectedRoute';
import { BookDetailPage } from '../pages/Books/BookDetailPage';
import { BookFormPage } from '../pages/Books/BookFormPage';
import { MyReservationsPage } from '../pages/MyReservationsPage';

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
              <BooksPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/books/new'
          element={
            <ProtectedRoute>
              <BookFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/books/:id/edit'
          element={
            <ProtectedRoute>
              <BookFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/books/:id'
          element={
            <ProtectedRoute>
              <BookDetailPage />
            </ProtectedRoute>
          }
        />

        <Route path='/my-reservations' element={<MyReservationsPage />} />

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
