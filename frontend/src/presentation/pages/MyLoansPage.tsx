import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLoanStore } from '../../application/stores';
import { LoanCard } from '../components/LoanCard';

export const MyLoansPage = () => {
  const { loans, isLoading, error, fetchUserLoans } = useLoanStore();

  useEffect(() => {
    fetchUserLoans();
  }, [fetchUserLoans]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <Link
          to='/books'
          className='inline-flex items-center text-gray-500 hover:text-gray-700 mb-4'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Volver al catálogo
        </Link>
        <h1 className='text-3xl font-bold'>Mis Préstamos</h1>
      </div>

      {isLoading ? (
        <div className='text-center py-12'>
          <p className='text-gray-600'>Cargando préstamos...</p>
        </div>
      ) : error ? (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-600'>{error}</p>
        </div>
      ) : loans.length === 0 ? (
        <div className='text-center py-12 bg-gray-50 rounded-lg'>
          <p className='text-gray-600 text-lg mb-4'>
            No tienes préstamos activos
          </p>
          <a
            href='/books'
            className='text-blue-600 hover:text-blue-700 font-medium'>
            Explorar libros disponibles
          </a>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {loans.map(loan => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}
    </div>
  );
};
