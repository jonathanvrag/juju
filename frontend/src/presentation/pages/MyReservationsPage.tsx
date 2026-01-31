import { useEffect } from 'react';
import { useReservationStore } from '../../application/stores';
import { ReservationCard } from '../components/reservations/ReservationCard';

export const MyReservationsPage = () => {
  const { reservations, isLoading, error, fetchUserReservations } =
    useReservationStore();

  useEffect(() => {
    fetchUserReservations();
  }, [fetchUserReservations]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Mis Reservas</h1>

      {isLoading ? (
        <div className='text-center py-12'>
          <p className='text-gray-600'>Cargando reservas...</p>
        </div>
      ) : error ? (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-600'>{error}</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className='text-center py-12 bg-gray-50 rounded-lg'>
          <p className='text-gray-600 text-lg mb-4'>
            No tienes reservas activas
          </p>
          <a
            href='/books'
            className='text-blue-600 hover:text-blue-700 font-medium'>
            Explorar libros disponibles
          </a>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {reservations.map(reservation => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      )}
    </div>
  );
};
