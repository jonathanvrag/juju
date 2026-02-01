import type { Loan } from '../../domain/entities';
import { useLoanStore } from '../../application/stores';
import { formatDate } from '../../shared/utils/dateUtils';
import { useState } from 'react';
import { ConfirmationModal } from './common/ConfirmationModal';

interface Props {
  loan: Loan;
}

export const LoanCard = ({ loan }: Props) => {
  const { returnBook } = useLoanStore();
  const [isReturning, setIsReturning] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleReturn = async () => {
    setIsReturning(true);
    try {
      await returnBook(loan.id);
    } catch (error) {
      console.error('Failed to return book:', error);
      alert('Error al devolver libro');
    } finally {
      setIsReturning(false);
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    returned: 'bg-gray-100 text-gray-800',
    overdue: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    active: 'Activo',
    returned: 'Devuelto',
    overdue: 'Vencido',
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 transition-shadow hover:shadow-lg border border-gray-100'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='text-xl font-bold text-gray-800 mb-1'>Libro ID: {loan.bookId}</h3> 
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[loan.status]}`}>
            {statusLabels[loan.status]}
          </span>
        </div>
      </div>

      <div className='space-y-2 mb-6'>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-500'>Fecha prestamo:</span>
          <span className='font-medium text-gray-900'>{formatDate(loan.loanDate)}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-500'>Fecha devolución:</span>
          <span className={`font-medium ${loan.status === 'overdue' ? 'text-red-600' : 'text-gray-900'}`}>
             {formatDate(loan.dueDate)}
          </span>
        </div>
         {loan.returnDate && (
          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Devuelto el:</span>
            <span className='font-medium text-gray-900'>{formatDate(loan.returnDate)}</span>
          </div>
        )}
      </div>

      {loan.status === 'active' && (
        <>
          <button
            onClick={() => setIsConfirmOpen(true)}
            disabled={isReturning}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors
            ${
              isReturning
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}>
            {isReturning ? 'Devolviendo...' : 'Devolver Libro'}
          </button>

          <ConfirmationModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleReturn}
            title='Devolver Libro'
            message='¿Estás seguro de que deseas devolver este libro?'
            confirmText='Devolver'
          />
        </>
      )}
    </div>
  );
};
