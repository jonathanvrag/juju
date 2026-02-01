import { ReservationStatus } from '../../../domain/entities/Reservation';
import type { Reservation } from '../../../domain/entities/Reservation';
import { useReservationStore } from '../../../application/stores';
import { useState } from 'react';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface ReservationCardProps {
  reservation: Reservation;
}

export const ReservationCard = ({ reservation }: ReservationCardProps) => {
  const { cancelReservation, fulfillReservation, fetchUserReservations } = useReservationStore();
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [fulfillConfirmOpen, setFulfillConfirmOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const styles: Record<ReservationStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-blue-100 text-blue-800',
      fulfilled: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
    };

    const labels: Record<ReservationStatus, string> = {
      pending: 'Pendiente',
      active: 'Activa',
      fulfilled: 'Cumplida',
      cancelled: 'Cancelada',
      expired: 'Expirada',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleCancel = async () => {
    try {
      await cancelReservation(reservation.id);
      await fetchUserReservations();
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      alert('No se pudo cancelar la reserva. Intenta de nuevo.');
    }
  };


  const handleFulfill = async () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15); // 15 days loan duration

    try {
      await fulfillReservation(reservation.id, {
        loanDueDate: dueDate.toISOString(),
      });
      await fetchUserReservations();
    } catch (error) {
      console.error('Error al cumplir la reserva:', error);
      alert('No se pudo cumplir la reserva.');
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
      <div className='flex justify-between items-start mb-4'>
        <h3 className='text-lg font-semibold text-gray-900'>
          {reservation.book?.title || 'Libro sin título'}
        </h3>
        {getStatusBadge(reservation.status)}
      </div>

      <p className='text-sm text-gray-600 mb-2'>
        <span className='font-medium'>Autor:</span>{' '}
        {reservation.book?.author || 'Desconocido'}
      </p>

      <p className='text-sm text-gray-600 mb-4'>
        <span className='font-medium'>Fecha de reserva:</span>{' '}
        {formatDate(reservation.reservationDate)}
      </p>

      {reservation.expirationDate && (
        <p className='text-sm text-gray-600 mb-4'>
          <span className='font-medium'>Expira:</span>{' '}
          {formatDate(reservation.expirationDate)}
        </p>
      )}

      <div className='flex gap-2 mt-4'>
        {(reservation.status === ReservationStatus.PENDING || 
          reservation.status === ReservationStatus.ACTIVE) && (
          <>
            <button
              className='flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium'
              onClick={() => setFulfillConfirmOpen(true)}>
              Cumplir Reserva
            </button>
            <button
              className='flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium'
              onClick={() => setCancelConfirmOpen(true)}>
              Cancelar
            </button>
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={fulfillConfirmOpen}
        onClose={() => setFulfillConfirmOpen(false)}
        onConfirm={handleFulfill}
        title='Cumplir Reserva'
        message='¿Estás seguro de que deseas cumplir esta reserva y crear un préstamo?'
        confirmText='Crear Préstamo'
      />

      <ConfirmationModal
        isOpen={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
        onConfirm={handleCancel}
        title='Cancelar Reserva'
        message='¿Estás seguro de que deseas cancelar esta reserva?'
        confirmText='Cancelar Reserva'
        isDanger
      />
    </div>
  );
};
