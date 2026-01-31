import { apiClient } from './apiClient';
import type {
  IReservationRepository,
  CreateReservationData,
  FulfillReservationData,
} from '../../domain/repositories';
import type { Reservation, Loan } from '../../domain/entities';

export class ReservationApi implements IReservationRepository {
  async create(reservationData: CreateReservationData): Promise<Reservation> {
    const { data } = await apiClient.post('/reservations', reservationData);
    return data.data.reservation;
  }

  async getUserReservations(): Promise<Reservation[]> {
    const { data } = await apiClient.get('/reservations/my-reservations');
    return data.data.reservations;
  }

  async cancel(id: string): Promise<Reservation> {
    const { data } = await apiClient.delete(`/reservations/${id}/cancel`);
    return data.data.reservation;
  }

  async fulfill(
    id: string,
    fulfillData: FulfillReservationData
  ): Promise<Loan> {
    const { data } = await apiClient.post(
      `/reservations/${id}/fulfill`,
      fulfillData
    );
    return data.data.loan;
  }
}
