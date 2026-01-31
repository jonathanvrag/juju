import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { useBookStore } from '../../../application/stores/bookStore';
import { useToast } from '../../../hooks/useToast';
import { Navbar, Loading } from '../../components/common';

// Validación con Zod
const bookSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(200, 'Máximo 200 caracteres'),
  author: z
    .string()
    .min(1, 'El autor es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  publicationYear: z
    .number('Debe ser un número')
    .int('Debe ser un año válido')
    .min(1000, 'Año mínimo: 1000')
    .max(
      new Date().getFullYear() + 1,
      `Año máximo: ${new Date().getFullYear() + 1}`
    ),
});

type BookFormData = z.infer<typeof bookSchema>;

export function BookFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEditing = Boolean(id);

  const {
    selectedBook,
    isLoading,
    fetchBookById,
    createBook,
    updateBook,
    clearSelectedBook,
  } = useBookStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    if (id) {
      fetchBookById(id);
    }

    return () => {
      clearSelectedBook();
    };
  }, [id, fetchBookById, clearSelectedBook]);

  useEffect(() => {
    if (selectedBook && isEditing) {
      reset({
        title: selectedBook.title,
        author: selectedBook.author,
        publicationYear: selectedBook.publicationYear,
      });
    }
  }, [selectedBook, isEditing, reset]);

  const onSubmit = async (data: BookFormData) => {
    try {
      if (isEditing && id) {
        await updateBook(id, data);
        toast.success('Libro actualizado exitosamente');
      } else {
        await createBook(data);
        toast.success('Libro creado exitosamente');
      }
      navigate('/books');
    } catch {
      toast.error(
        isEditing ? 'Error al actualizar el libro' : 'Error al crear el libro'
      );
    }
  };

  if (isLoading && isEditing) {
    return (
      <div className='min-h-screen bg-gray-900'>
        <Navbar />
        <Loading />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900'>
      <Navbar />

      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-6'>
          <Link
            to='/books'
            className='inline-flex items-center text-gray-400 hover:text-gray-300 mb-4'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Volver al catálogo
          </Link>

          <h1 className='text-3xl font-bold text-gray-100'>
            {isEditing ? 'Editar Libro' : 'Crear Nuevo Libro'}
          </h1>
          <p className='text-gray-400 mt-2'>
            {isEditing
              ? 'Actualiza la información del libro'
              : 'Completa los datos para agregar un nuevo libro al catálogo'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className='card'>
          <div className='space-y-6'>
            {/* Título */}
            <div>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-gray-300 mb-2'>
                Título del libro
              </label>
              <input
                id='title'
                type='text'
                {...register('title')}
                className='input-field'
                placeholder='Ej: Cien años de soledad'
              />
              {errors.title && (
                <p className='mt-1 text-sm text-red-400'>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Autor */}
            <div>
              <label
                htmlFor='author'
                className='block text-sm font-medium text-gray-300 mb-2'>
                Autor
              </label>
              <input
                id='author'
                type='text'
                {...register('author')}
                className='input-field'
                placeholder='Ej: Gabriel García Márquez'
              />
              {errors.author && (
                <p className='mt-1 text-sm text-red-400'>
                  {errors.author.message}
                </p>
              )}
            </div>

            {/* Año de publicación */}
            <div>
              <label
                htmlFor='publicationYear'
                className='block text-sm font-medium text-gray-300 mb-2'>
                Año de publicación
              </label>
              <input
                id='publicationYear'
                type='number'
                {...register('publicationYear', { valueAsNumber: true })}
                className='input-field'
                placeholder='Ej: 1967'
              />
              {errors.publicationYear && (
                <p className='mt-1 text-sm text-red-400'>
                  {errors.publicationYear.message}
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className='flex gap-4 mt-8 pt-6 border-t border-gray-700'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='btn-primary flex-1 flex items-center justify-center'>
              <Save className='h-4 w-4 mr-2' />
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                  ? 'Actualizar Libro'
                  : 'Crear Libro'}
            </button>

            <Link to='/books' className='btn-secondary px-8'>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
