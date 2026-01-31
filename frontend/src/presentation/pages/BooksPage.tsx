import { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useBookStore } from '../../application/stores';
import { Navbar, Loading, EmptyState } from '../components/common';
import { BookCard, Pagination } from '../components/books';

export function BooksPage() {
  const { books, pagination, isLoading, fetchBooks } = useBookStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchBooks({ page: 1, limit: 9 });
  }, [fetchBooks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks({
      page: 1,
      limit: 9,
      search,
      status: statusFilter || undefined,
    });
  };

  const handlePageChange = (page: number) => {
    fetchBooks({
      page,
      limit: 9,
      search: search || undefined,
      status: statusFilter || undefined,
    });
  };

  return (
    <div className='min-h-screen bg-gray-900'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-100'>
              Catálogo de Libros
            </h1>
            <p className='text-gray-400 mt-1'>
              {pagination.total} libros disponibles
            </p>
          </div>
          <button className='btn-primary flex items-center space-x-2'>
            <Plus className='h-5 w-5' />
            <span>Agregar Libro</span>
          </button>
        </div>

        {/* Filtros */}
        <div className='card mb-8'>
          <form onSubmit={handleSearch} className='flex gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500' />
                <input
                  type='text'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder='Buscar por título o autor'
                  className='input-field pl-10'
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className='input-field w-48'>
              <option value=''>Todos los estados</option>
              <option value='available'>Disponible</option>
              <option value='reserved'>Reservado</option>
              <option value='loaned'>Prestado</option>
            </select>
            <button type='submit' className='btn-primary'>
              Buscar
            </button>
          </form>
        </div>

        {/* Contenido */}
        {isLoading ? (
          <Loading />
        ) : books.length === 0 ? (
          <EmptyState
            title='No se encontraron libros'
            description='Intenta ajustar los filtros de búsqueda'
          />
        ) : (
          <>
            {/* Grid de libros */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Paginación */}
            {pagination.pages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
