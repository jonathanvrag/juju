import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useReservationStore } from '../../../application/stores';
import { useToast } from '../../../hooks/useToast';

const reservationSchema = z.object({
  expirationDate: z.string().min(1, 'La fecha de expiración es obligatoria'),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
  onSuccess?: () => void;
}

export function ReservationModal({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  onSuccess,
}: ReservationModalProps) {
  const toast = useToast();
  const { createReservation } = useReservationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
  });

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    try {
      await createReservation({
        bookId,
        expirationDate: new Date(data.expirationDate).toISOString(),
      });
      toast.success('Reserva creada exitosamente');
      reset();
      onClose();
      onSuccess?.();
    } catch {
      toast.error('Error al crear la reserva');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Fecha mínima: mañana
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Fecha máxima: 30 días desde hoy
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Reservar Libro'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Info del libro */}
        <div className='bg-gray-900 p-4 rounded-lg border border-gray-700'>
          <p className='text-sm text-gray-400 mb-1'>Libro a reservar:</p>
          <p className='text-lg font-semibold text-gray-100'>{bookTitle}</p>
        </div>

        {/* Fecha de expiración */}
        <div>
          <label
            htmlFor='expirationDate'
            className='block text-sm font-medium text-gray-300 mb-2'>
            <Calendar className='h-4 w-4 inline mr-2' />
            Fecha de expiración de la reserva
          </label>
          <input
            id='expirationDate'
            type='date'
            min={minDate}
            max={maxDateStr}
            {...register('expirationDate')}
            className='input-field'
          />
          {errors.expirationDate && (
            <p className='mt-1 text-sm text-red-400'>
              {errors.expirationDate.message}
            </p>
          )}
          <p className='mt-2 text-xs text-gray-500'>
            La reserva estará activa hasta esta fecha. Después expirará
            automáticamente.
          </p>
        </div>

        {/* Botones */}
        <div className='flex gap-3 pt-4 border-t border-gray-700'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='btn-primary flex-1'>
            {isSubmitting ? 'Reservando...' : 'Confirmar Reserva'}
          </button>
          <button
            type='button'
            onClick={handleClose}
            className='btn-secondary px-6'
            disabled={isSubmitting}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
