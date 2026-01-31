import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User,
  Edit,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { useBookStore } from '../../application/stores';
import { useToast } from '../../hooks/useToast';
import { Navbar, Loading } from '../components/common';

const statusConfig = {
  available: { label: 'Disponible', class: 'badge-available' },
  reserved: { label: 'Reservado', class: 'badge-reserved' },
  loaned: { label: 'Prestado', class: 'badge-loaned' },
};

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    selectedBook,
    isLoading,
    fetchBookById,
    deleteBook,
    clearSelectedBook,
  } = useBookStore();

  useEffect(() => {
    if (id) {
      fetchBookById(id);
    }

    return () => {
      clearSelectedBook();
    };
  }, [id, fetchBookById, clearSelectedBook]);

  const handleDelete = async () => {
    if (!id || !selectedBook) return;

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar "${selectedBook.title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteBook(id);
      toast.success('Libro eliminado exitosamente');
      navigate('/books');
    } catch {
      toast.error('Error al eliminar el libro');
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-900'>
        <Navbar />
        <Loading />
      </div>
    );
  }

  if (!selectedBook) {
    return (
      <div className='min-h-screen bg-gray-900'>
        <Navbar />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-100'>
              Libro no encontrado
            </h2>
            <Link
              to='/books'
              className='text-primary-400 hover:text-primary-300 mt-4 inline-block'>
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = statusConfig[selectedBook.status];

  return (
    <div className='min-h-screen bg-gray-900'>
      <Navbar />

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-6'>
          <Link
            to='/books'
            className='inline-flex items-center text-gray-400 hover:text-gray-300 mb-4'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Volver al catálogo
          </Link>
        </div>

        {/* Card principal */}
        <div className='card'>
          <div className='flex justify-between items-start mb-6'>
            <div className='flex-1'>
              <h1 className='text-3xl font-bold text-gray-100 mb-2'>
                {selectedBook.title}
              </h1>
              <p className='text-lg text-gray-400 flex items-center'>
                <User className='h-5 w-5 mr-2' />
                {selectedBook.author}
              </p>
            </div>
            <span className={`badge ${status.class}`}>{status.label}</span>
          </div>

          {/* Detalles */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div className='space-y-4'>
              <div>
                <h3 className='text-sm font-medium text-gray-400 mb-1'>
                  Año de publicación
                </h3>
                <p className='text-gray-100 flex items-center'>
                  <Calendar className='h-4 w-4 mr-2' />
                  {selectedBook.publicationYear}
                </p>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <h3 className='text-sm font-medium text-gray-400 mb-1'>
                  Estado actual
                </h3>
                <p className='text-gray-100 flex items-center'>
                  <BookOpen className='h-4 w-4 mr-2' />
                  {status.label}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className='flex gap-4 pt-6 border-t border-gray-700'>
            {selectedBook.status === 'available' && (
              <button className='btn-primary flex-1'>Reservar Libro</button>
            )}

            <Link
              to={`/books/${id}/edit`}
              className='btn-secondary flex items-center justify-center'>
              <Edit className='h-4 w-4 mr-2' />
              Editar
            </Link>

            <button
              onClick={handleDelete}
              className='btn-danger flex items-center justify-center'>
              <Trash2 className='h-4 w-4 mr-2' />
              Eliminar
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className='card mt-6'>
          <h2 className='text-xl font-semibold text-gray-100 mb-4'>
            Información adicional
          </h2>
          <div className='space-y-2 text-sm text-gray-400'>
            <p>
              <span className='font-medium text-gray-300'>Creado:</span>{' '}
              {new Date(selectedBook.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p>
              <span className='font-medium text-gray-300'>
                Última actualización:
              </span>{' '}
              {new Date(selectedBook.updatedAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
